/**
 * no-cond-assign — disallow assignment operators in conditional expressions.
 * Adapted from ESLint's no-cond-assign rule.
 */

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

function isDoubleParenthesised(sourceCode, node) {
    const prevToken = sourceCode.getTokenBefore(node, { skip: 1 });
    const nextToken = sourceCode.getTokenAfter(node, { skip: 1 });
    return (
        prevToken && nextToken &&
        prevToken.value === "(" &&
        nextToken.value === ")"
    );
}

function containsAssignment(node) {
    if (node.type === "AssignmentExpression") return true;
    if (node.type === "LogicalExpression" || node.type === "BinaryExpression") {
        return containsAssignment(node.left) || containsAssignment(node.right);
    }
    if (node.type === "ConditionalExpression") {
        return containsAssignment(node.test);
    }
    return false;
}

const noCondAssignRule = {
    meta: {
        type: "problem",
        schema: [{ enum: ["except-parens", "always"] }],
    },
    create(context) {
        const option = context.options[0] || "except-parens";
        const sourceCode = context.sourceCode;

        function checkCondition(conditionNode) {
            if (option === "always") {
                if (containsAssignment(conditionNode)) {
                    context.report({
                        node: conditionNode,
                        message: "Unexpected assignment within condition.",
                    });
                }
            } else {
                // except-parens: flag assignments that are not explicitly double-parenthesised
                // Note: isDoubleParenthesised skips the if/while's own required parens
                if (conditionNode.type === "AssignmentExpression") {
                    if (!isDoubleParenthesised(sourceCode, conditionNode)) {
                        context.report({
                            node: conditionNode,
                            message: "Unexpected assignment within condition.",
                        });
                    }
                }
            }
        }

        return {
            DoWhileStatement(node) { checkCondition(node.test); },
            ForStatement(node) { if (node.test) checkCondition(node.test); },
            IfStatement(node) { checkCondition(node.test); },
            WhileStatement(node) { checkCondition(node.test); },
        };
    },
};

export default noCondAssignRule;
