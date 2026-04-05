/**
 * no-throw-literal — disallow throwing literals as exceptions.
 * Adapted from ESLint's no-throw-literal rule.
 */

function couldBeError(node) {
    switch (node.type) {
        case "Identifier":
        case "CallExpression":
        case "NewExpression":
        case "MemberExpression":
        case "TaggedTemplateExpression":
        case "YieldExpression":
        case "AwaitExpression":
            return true;
        case "AssignmentExpression":
            return couldBeError(node.right);
        case "SequenceExpression":
            return couldBeError(node.expressions[node.expressions.length - 1]);
        case "LogicalExpression":
            return couldBeError(node.left) || couldBeError(node.right);
        case "ConditionalExpression":
            return couldBeError(node.consequent) || couldBeError(node.alternate);
        default:
            return false;
    }
}

const noThrowLiteralRule = {
    meta: {
        type: "suggestion",
        schema: [],
    },

    create(context) {
        return {
            ThrowStatement(node) {
                if (node.argument && !couldBeError(node.argument)) {
                    context.report({
                        node,
                        message: "Expected an object to be thrown.",
                    });
                }
            },
        };
    },
};

export default noThrowLiteralRule;
