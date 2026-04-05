/**
 * no-trailing-spaces — disallow trailing whitespace at the end of lines.
 * Adapted from ESLint's no-trailing-spaces rule.
 */

// Matches trailing whitespace characters (common space-like chars)
const BLANK_CLASS = "[ \t\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u3000]";
const SKIP_BLANK = new RegExp(`^${BLANK_CLASS}*$`, "u");
const NONBLANK = new RegExp(`${BLANK_CLASS}+$`, "u");

const noTrailingSpacesRule = {
    meta: {
        type: "layout",
        schema: [
            {
                type: "object",
                properties: {
                    skipBlankLines: { type: "boolean" },
                    ignoreComments: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const skipBlankLines = options.skipBlankLines || false;
        const ignoreComments = options.ignoreComments || false;
        const sourceCode = context.sourceCode;

        return {
            Program(node) {
                const lines = sourceCode.getLines();
                const src = sourceCode.getText();

                // Build set of line numbers that are inside template literal bodies.
                // Trailing spaces inside template literals are intentional.
                const templateLiteralLines = new Set();

                // Build set of comment line numbers when ignoreComments is true
                const commentLineNumbers = new Set();
                if (ignoreComments) {
                    for (const comment of sourceCode.getAllComments()) {
                        const endLine = comment.type === "Block"
                            ? comment.loc.end.line - 1
                            : comment.loc.end.line;
                        for (let i = comment.loc.start.line; i <= endLine; i++) {
                            commentLineNumbers.add(i);
                        }
                    }
                }

                // Collect template literal ranges from AST to skip those lines
                // We'll track them via the linebreaks in the source
                // Use a simpler approach: find all TemplateElement nodes from AST
                function collectTemplateLiteralLines(astNode) {
                    if (!astNode || typeof astNode !== "object") return;
                    if (astNode.type === "TemplateLiteral") {
                        const startLine = astNode.loc.start.line;
                        const endLine = astNode.loc.end.line;
                        // Only multi-line template literals have trailing-space concerns
                        for (let ln = startLine; ln <= endLine; ln++) {
                            templateLiteralLines.add(ln);
                        }
                    }
                    // Walk children
                    for (const key of Object.keys(astNode)) {
                        if (key === "parent") continue;
                        const child = astNode[key];
                        if (Array.isArray(child)) {
                            child.forEach(collectTemplateLiteralLines);
                        } else if (child && typeof child === "object" && child.type) {
                            collectTemplateLiteralLines(child);
                        }
                    }
                }
                collectTemplateLiteralLines(sourceCode.ast);

                // Build line break lengths for accurate range calculation
                const linebreakRe = /\r\n|[\r\n]/gu;
                const linebreaks = src.match(linebreakRe) || [];

                let totalLength = 0;
                for (let i = 0; i < lines.length; i++) {
                    const lineNumber = i + 1;
                    const linebreakLength = linebreaks[i] ? linebreaks[i].length : 1;
                    const lineLength = lines[i].length + linebreakLength;

                    const matches = NONBLANK.exec(lines[i]);

                    if (matches) {
                        // Skip if this line is inside a template literal
                        if (templateLiteralLines.has(lineNumber)) {
                            totalLength += lineLength;
                            continue;
                        }

                        // Skip blank lines when skipBlankLines is true
                        if (skipBlankLines && SKIP_BLANK.test(lines[i])) {
                            totalLength += lineLength;
                            continue;
                        }

                        // Skip comment lines when ignoreComments is true
                        if (ignoreComments && commentLineNumbers.has(lineNumber)) {
                            totalLength += lineLength;
                            continue;
                        }

                        context.report({
                            node,
                            loc: {
                                start: {
                                    line: lineNumber,
                                    column: matches.index,
                                },
                                end: {
                                    line: lineNumber,
                                    column: lines[i].length,
                                },
                            },
                            message: "Trailing spaces not allowed.",
                        });
                    }

                    totalLength += lineLength;
                }
            },
        };
    },
};

export default noTrailingSpacesRule;
