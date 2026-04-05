const BUILT_IN_ERROR_TYPES = new Set([
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "AggregateError",
]);

function findParentCatch(node) {
    let current = node.parent;

    while (current) {
        if (
            current.type === "FunctionDeclaration" ||
            current.type === "FunctionExpression" ||
            current.type === "ArrowFunctionExpression" ||
            current.type === "StaticBlock"
        ) {
            return null;
        }

        if (current.type === "CatchClause") {
            return current;
        }

        current = current.parent;
    }

    return null;
}

function isThrowingBuiltInError(node) {
    const argument = node.argument;
    return (
        (argument.type === "NewExpression" || argument.type === "CallExpression") &&
        argument.callee.type === "Identifier" &&
        BUILT_IN_ERROR_TYPES.has(argument.callee.name)
    );
}

function getCauseNode(node) {
    const throwExpression = node.argument;
    const optionsIndex =
        throwExpression.callee.name === "AggregateError" ? 2 : 1;
    const options = throwExpression.arguments[optionsIndex];

    if (!options || options.type !== "ObjectExpression") {
        return null;
    }

    for (const property of options.properties) {
        if (
            property.type === "Property" &&
            !property.computed &&
            property.key.type === "Identifier" &&
            property.key.name === "cause"
        ) {
            return property.value;
        }
    }

    return null;
}

const preserveCaughtErrorRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        return {
            ThrowStatement(node) {
                if (!isThrowingBuiltInError(node)) {
                    return;
                }

                const catchClause = findParentCatch(node);
                if (!catchClause || !catchClause.param || catchClause.param.type !== "Identifier") {
                    return;
                }

                const causeNode = getCauseNode(node);
                if (!causeNode) {
                    context.report({
                        node,
                        message: "There is no `cause` attached to the symptom error being thrown.",
                    });
                    return;
                }

                if (causeNode.type !== "Identifier" || causeNode.name !== catchClause.param.name) {
                    context.report({
                        node: causeNode,
                        message: "The symptom error is being thrown with an incorrect `cause`.",
                    });
                }
            },
        };
    },
};

export default preserveCaughtErrorRule;
