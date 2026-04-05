/**
 * no-multi-assign — disallow chained assignment expressions.
 * Adapted from ESLint's no-multi-assign rule.
 */

const noMultiAssignRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    ignoreNonDeclaration: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const ignoreNonDeclaration = context.options[0]?.ignoreNonDeclaration ?? false;

        return {
            AssignmentExpression(node) {
                if (
                    node.right.type === "AssignmentExpression" &&
                    !(ignoreNonDeclaration && node.parent.type !== "VariableDeclarator")
                ) {
                    context.report({
                        node: node.right,
                        message: "Unexpected chained assignment.",
                    });
                }
            },
        };
    },
};

export default noMultiAssignRule;
