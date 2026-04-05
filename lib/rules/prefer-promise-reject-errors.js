function couldBeError(node) {
    if (!node) {
        return false;
    }

    if (node.type === "NewExpression" && node.callee.type === "Identifier" && /Error$/.test(node.callee.name)) {
        return true;
    }

    return !(
        (node.type === "Literal" && typeof node.value !== "object") ||
        (node.type === "Identifier" && node.name === "undefined")
    );
}

function isPromiseRejectCall(node) {
    return (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name === "Promise" &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "reject" &&
        node.callee.computed === false
    );
}

const preferPromiseRejectErrorsRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        function checkRejectCall(node) {
            if (!node.arguments.length || !couldBeError(node.arguments[0])) {
                context.report({
                    node,
                    message: "Expected the Promise rejection reason to be an Error.",
                });
            }
        }

        return {
            CallExpression(node) {
                if (isPromiseRejectCall(node)) {
                    checkRejectCall(node);
                }
            },

            "NewExpression:exit"(node) {
                if (
                    node.callee.type !== "Identifier" ||
                    node.callee.name !== "Promise" ||
                    node.arguments.length === 0
                ) {
                    return;
                }

                const executor = node.arguments[0];
                if (
                    (executor.type !== "FunctionExpression" && executor.type !== "ArrowFunctionExpression") ||
                    executor.params.length < 2 ||
                    executor.params[1].type !== "Identifier"
                ) {
                    return;
                }

                const rejectName = executor.params[1].name;
                const rejectVariable = context.sourceCode
                    .getDeclaredVariables(executor)
                    .find(variable => variable.name === rejectName);

                if (!rejectVariable) {
                    return;
                }

                for (const reference of rejectVariable.references) {
                    if (
                        !reference.isRead() ||
                        reference.identifier.parent?.type !== "CallExpression" ||
                        reference.identifier.parent.callee !== reference.identifier
                    ) {
                        continue;
                    }

                    checkRejectCall(reference.identifier.parent);
                }
            },
        };
    },
};

export default preferPromiseRejectErrorsRule;
