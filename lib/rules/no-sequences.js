/**
 * no-sequences — disallow comma operators.
 * Adapted from ESLint's no-sequences rule.
 */

const noSequencesRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    allowInParentheses: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const allowInParentheses = context.options[0]?.allowInParentheses ?? true;
        const sourceCode = context.sourceCode;

        function requiresExtraParens(node) {
            const parent = node.parent;
            // These contexts require parentheses around the comma expression
            return (
                parent.type === "ExpressionStatement" ||
                parent.type === "ForStatement" ||
                parent.type === "SequenceExpression"
            );
        }

        function isParenthesised(node) {
            const prevToken = sourceCode.getTokenBefore(node);
            const nextToken = sourceCode.getTokenAfter(node);
            return (
                prevToken && nextToken &&
                prevToken.value === "(" &&
                prevToken.range[1] <= node.range[0] &&
                nextToken.value === ")" &&
                nextToken.range[0] >= node.range[1]
            );
        }

        return {
            SequenceExpression(node) {
                if (allowInParentheses && isParenthesised(node)) {
                    return;
                }
                context.report({
                    node,
                    loc: sourceCode.getFirstTokenBetween(
                        node.expressions[0],
                        node.expressions[1],
                        token => token.value === ","
                    )?.loc ?? node.loc,
                    message: "Unexpected use of comma operator.",
                });
            },
        };
    },
};

export default noSequencesRule;
