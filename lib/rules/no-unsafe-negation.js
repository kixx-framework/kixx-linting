/**
 * no-unsafe-negation — disallow negating the left operand of relational operators.
 * Adapted from ESLint's no-unsafe-negation rule.
 */

const RELATIONAL_OPERATORS = new Set(["in", "instanceof"]);

function isParenthesised(sourceCode, node) {
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

const noUnsafeNegationRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    enforceForOrderingRelations: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const sourceCode = context.sourceCode;

        return {
            BinaryExpression(node) {
                if (
                    RELATIONAL_OPERATORS.has(node.operator) &&
                    node.left.type === "UnaryExpression" &&
                    node.left.operator === "!" &&
                    !isParenthesised(sourceCode, node.left)
                ) {
                    context.report({
                        node,
                        message: `Unexpected negation of the left operand of '${node.operator}'.`,
                    });
                }
            },
        };
    },
};

export default noUnsafeNegationRule;
