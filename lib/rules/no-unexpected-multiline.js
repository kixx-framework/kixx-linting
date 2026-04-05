/**
 * no-unexpected-multiline — disallow confusing multiline expressions.
 * Adapted from ESLint's no-unexpected-multiline rule.
 */

const noUnexpectedMultilineRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        const sourceCode = context.sourceCode;

        function isSameLine(tokenA, tokenB) {
            return tokenA.loc.end.line === tokenB.loc.start.line;
        }

        function checkPreceding(node, openToken) {
            const prevToken = sourceCode.getTokenBefore(openToken);
            if (!prevToken) return;
            if (!isSameLine(prevToken, openToken)) {
                // The open token is on a different line than the preceding token — potential issue
                return { prevToken, openToken };
            }
            return null;
        }

        return {
            // (expr)\n(args) — function call where paren is on next line
            CallExpression(node) {
                const calleeLastToken = sourceCode.getLastToken(node.callee);
                const openParen = sourceCode.getTokenAfter(calleeLastToken);
                if (!openParen || openParen.value !== "(") return;
                if (calleeLastToken.loc.end.line < openParen.loc.start.line) {
                    context.report({
                        node,
                        message: "Unexpected newline between function and ( of function call.",
                    });
                }
            },
            // expr\n[prop] — member access where bracket is on next line
            MemberExpression(node) {
                if (!node.computed) return;
                const objectLastToken = sourceCode.getLastToken(node.object);
                const openBracket = sourceCode.getTokenAfter(objectLastToken);
                if (!openBracket || openBracket.value !== "[") return;
                if (objectLastToken.loc.end.line < openBracket.loc.start.line) {
                    context.report({
                        node,
                        message: "Unexpected newline between object and [ of property access.",
                    });
                }
            },
            // expr\n`template` — tagged template where tag ends before backtick
            TaggedTemplateExpression(node) {
                const tagLastToken = sourceCode.getLastToken(node.tag);
                const quasi = node.quasi;
                if (tagLastToken.loc.end.line < quasi.loc.start.line) {
                    context.report({
                        node,
                        message: "Unexpected newline between template tag and template literal.",
                    });
                }
            },
        };
    },
};

export default noUnexpectedMultilineRule;
