/**
 * no-plusplus — disallow the unary operators `++` and `--`.
 * Adapted from ESLint's no-plusplus rule.
 */

const noPlusPlusRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    allowForLoopAfterthoughts: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const allowForLoopAfterthoughts = context.options[0]?.allowForLoopAfterthoughts ?? false;

        return {
            UpdateExpression(node) {
                if (
                    allowForLoopAfterthoughts &&
                    node.parent.type === "ForStatement" &&
                    node.parent.update === node
                ) {
                    return;
                }
                context.report({
                    node,
                    message: `Unary operator '${node.operator}' used.`,
                });
            },
        };
    },
};

export default noPlusPlusRule;
