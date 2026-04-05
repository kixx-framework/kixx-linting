/**
 * func-call-spacing — require or disallow spacing between function identifiers and invocations.
 * Adapted from ESLint's func-call-spacing rule.
 */

function isOpeningParenToken(token) {
    return token && token.value === "(" && token.type === "Punctuator";
}

function isNotQuestionDotToken(token) {
    return !(token && token.value === "?.");
}

const LINEBREAK_RE = /\r\n|[\r\n\u2028\u2029]/u;

const funcCallSpacingRule = {
    meta: {
        type: "layout",
        schema: [{ enum: ["always", "never"] }],
    },

    create(context) {
        const never = context.options[0] !== "always";
        const sourceCode = context.sourceCode;
        const text = sourceCode.getText();

        function checkSpacing(node, leftToken, rightToken) {
            if (!leftToken || !rightToken) return;

            const textBetweenTokens = text
                .slice(leftToken.range ? leftToken.range[1] : leftToken.end,
                       rightToken.range ? rightToken.range[0] : rightToken.start)
                .replace(/\/\*.*?\*\//gu, "");

            const hasWhitespace = /\s/u.test(textBetweenTokens);
            const hasNewline = hasWhitespace && LINEBREAK_RE.test(textBetweenTokens);

            if (never && hasWhitespace) {
                if (hasNewline) {
                    // Don't report (or autofix) newlines in "never" mode
                    return;
                }
                context.report({
                    node,
                    loc: {
                        start: leftToken.loc.end,
                        end: rightToken.loc.start,
                    },
                    message: "Unexpected whitespace between function name and paren.",
                });
            } else if (!never && !hasWhitespace) {
                context.report({
                    node,
                    loc: {
                        start: leftToken.loc.end,
                        end: rightToken.loc.start,
                    },
                    message: "Missing space between function name and paren.",
                });
            }
        }

        function checkCallOrNew(node) {
            const lastToken = sourceCode.getLastToken(node);
            const lastCalleeToken = sourceCode.getLastToken(node.callee);
            const parenToken = sourceCode.getFirstTokenBetween(
                lastCalleeToken,
                lastToken,
                isOpeningParenToken,
            );
            const prevToken =
                parenToken &&
                sourceCode.getTokenBefore(parenToken, isNotQuestionDotToken);

            // Parens in NewExpression are optional
            if (!(parenToken && (parenToken.range ? parenToken.range[1] : parenToken.end) < (node.range ? node.range[1] : node.end))) {
                return;
            }

            checkSpacing(node, prevToken, parenToken);
        }

        return {
            CallExpression: checkCallOrNew,
            NewExpression: checkCallOrNew,

            ImportExpression(node) {
                const leftToken = sourceCode.getFirstToken(node);
                const rightToken = sourceCode.getTokenAfter(leftToken);
                checkSpacing(node, leftToken, rightToken);
            },
        };
    },
};

export default funcCallSpacingRule;
