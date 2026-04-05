/**
 * no-return-assign — disallow assignment operators in return statements.
 * Adapted from ESLint's no-return-assign rule.
 */

const ALWAYS_DISALLOWED = /^(?:=|[-+*/%&|^]?=)$/u;

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

const noReturnAssignRule = {
    meta: {
        type: "suggestion",
        schema: [{ enum: ["except-parens", "always"] }],
    },

    create(context) {
        const option = context.options[0] || "except-parens";
        const sourceCode = context.sourceCode;

        function checkForAssignment(node) {
            const body = node.argument;
            if (
                body &&
                body.type === "AssignmentExpression" &&
                (option === "always" || !isParenthesised(sourceCode, body))
            ) {
                context.report({
                    node: body,
                    message: "Return statement should not contain assignment.",
                });
            }
        }

        return {
            ReturnStatement: checkForAssignment,
        };
    },
};

export default noReturnAssignRule;
