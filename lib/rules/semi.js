/**
 * semi — require or disallow semicolons instead of ASI.
 * Adapted from ESLint's semi rule.
 */

const OPT_OUT_PATTERN = /^[-[(/+`]/u;

function isSemicolonToken(token) {
    return token && token.value === ";" && token.type === "Punctuator";
}

function isClosingBraceToken(token) {
    return token && token.value === "}" && token.type === "Punctuator";
}

function isTokenOnSameLine(left, right) {
    return left.loc.end.line === right.loc.start.line;
}

const semiRule = {
    meta: {
        type: "layout",
        schema: [
            { enum: ["always", "never"] },
            {
                type: "object",
                properties: {
                    omitLastInOneLineBlock: { type: "boolean" },
                    omitLastInOneLineClassBody: { type: "boolean" },
                    beforeStatementContinuationChars: { enum: ["always", "any", "never"] },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[1];
        const never = context.options[0] === "never";
        const exceptOneLine = Boolean(options && options.omitLastInOneLineBlock);
        const exceptOneLineClassBody = Boolean(options && options.omitLastInOneLineClassBody);
        const beforeStatementContinuationChars =
            (options && options.beforeStatementContinuationChars) || "any";
        const sourceCode = context.sourceCode;

        function isRedundantSemi(semiToken) {
            const nextToken = sourceCode.getTokenAfter(semiToken);
            return !nextToken || isClosingBraceToken(nextToken) || isSemicolonToken(nextToken);
        }

        function isOnSameLineWithNextToken(node) {
            const prevToken = sourceCode.getLastToken(node, 1);
            const nextToken = sourceCode.getTokenAfter(node);
            return !!nextToken && prevToken && isTokenOnSameLine(prevToken, nextToken);
        }

        function maybeAsiHazardAfter(node) {
            const t = node.type;
            if (
                t === "DoWhileStatement" ||
                t === "BreakStatement" ||
                t === "ContinueStatement" ||
                t === "DebuggerStatement" ||
                t === "ImportDeclaration" ||
                t === "ExportAllDeclaration"
            ) {
                return false;
            }
            if (t === "ReturnStatement") return Boolean(node.argument);
            if (t === "ExportNamedDeclaration") return Boolean(node.declaration);
            return true;
        }

        function maybeAsiHazardBefore(token) {
            return (
                Boolean(token) &&
                OPT_OUT_PATTERN.test(token.value) &&
                token.value !== "++" &&
                token.value !== "--"
            );
        }

        function canRemoveSemicolon(node) {
            if (isRedundantSemi(sourceCode.getLastToken(node))) {
                return true;
            }
            if (isOnSameLineWithNextToken(node)) {
                return false;
            }
            if (
                node.type !== "PropertyDefinition" &&
                beforeStatementContinuationChars === "never" &&
                !maybeAsiHazardAfter(node)
            ) {
                return true;
            }
            if (!maybeAsiHazardBefore(sourceCode.getTokenAfter(node))) {
                return true;
            }
            return false;
        }

        function isLastInOneLinerBlock(node) {
            const parent = node.parent;
            const nextToken = sourceCode.getTokenAfter(node);
            if (!nextToken || nextToken.value !== "}") return false;
            if (parent.type === "BlockStatement") {
                return parent.loc.start.line === parent.loc.end.line;
            }
            return false;
        }

        function isLastInOneLinerClassBody(node) {
            const parent = node.parent;
            const nextToken = sourceCode.getTokenAfter(node);
            if (!nextToken || nextToken.value !== "}") return false;
            if (parent.type === "ClassBody") {
                return parent.loc.start.line === parent.loc.end.line;
            }
            return false;
        }

        function report(node, missing) {
            const lastToken = sourceCode.getLastToken(node);
            const loc = missing
                ? lastToken.loc
                : {
                      start: lastToken.loc.end,
                      end: { line: lastToken.loc.end.line, column: lastToken.loc.end.column + 1 },
                  };
            context.report({
                node,
                loc,
                message: missing ? "Extra semicolon." : "Missing semicolon.",
            });
        }

        function checkForSemicolon(node) {
            const isSemi = isSemicolonToken(sourceCode.getLastToken(node));

            if (never) {
                if (isSemi && canRemoveSemicolon(node)) {
                    report(node, true);
                } else if (
                    !isSemi &&
                    beforeStatementContinuationChars === "always" &&
                    node.type !== "PropertyDefinition" &&
                    maybeAsiHazardBefore(sourceCode.getTokenAfter(node))
                ) {
                    report(node);
                }
            } else {
                const oneLinerBlock = exceptOneLine && isLastInOneLinerBlock(node);
                const oneLinerClassBody = exceptOneLineClassBody && isLastInOneLinerClassBody(node);
                const oneLinerBlockOrClassBody = oneLinerBlock || oneLinerClassBody;

                if (isSemi && oneLinerBlockOrClassBody) {
                    report(node, true);
                } else if (!isSemi && !oneLinerBlockOrClassBody) {
                    report(node);
                }
            }
        }

        function checkForSemicolonForVariableDeclaration(node) {
            const parent = node.parent;
            if (
                (parent.type !== "ForStatement" || parent.init !== node) &&
                (!/^For(?:In|Of)Statement/u.test(parent.type) || parent.left !== node)
            ) {
                checkForSemicolon(node);
            }
        }

        return {
            VariableDeclaration: checkForSemicolonForVariableDeclaration,
            ExpressionStatement: checkForSemicolon,
            ReturnStatement: checkForSemicolon,
            ThrowStatement: checkForSemicolon,
            DoWhileStatement: checkForSemicolon,
            DebuggerStatement: checkForSemicolon,
            BreakStatement: checkForSemicolon,
            ContinueStatement: checkForSemicolon,
            ImportDeclaration: checkForSemicolon,
            ExportAllDeclaration: checkForSemicolon,
            ExportNamedDeclaration(node) {
                if (!node.declaration) checkForSemicolon(node);
            },
            ExportDefaultDeclaration(node) {
                if (!/(?:Class|Function)Declaration/u.test(node.declaration.type)) {
                    checkForSemicolon(node);
                }
            },
            PropertyDefinition: checkForSemicolon,
        };
    },
};

export default semiRule;
