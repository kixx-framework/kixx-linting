function isValidThisContext(node) {
    let current = node.parent;

    while (current) {
        switch (current.type) {
            case "ArrowFunctionExpression":
                // Arrow functions inherit `this` from enclosing scope — keep looking
                current = current.parent;
                continue;

            case "FunctionDeclaration":
            case "FunctionExpression":
                // `this` is valid only if this function is a class method or object method
                return (
                    current.parent?.type === "MethodDefinition" ||
                    current.parent?.type === "Property"
                );

            case "PropertyDefinition":
            case "StaticBlock":
                return true;

            case "MethodDefinition":
                return true;

            case "Program":
                return false;

            default:
                current = current.parent;
        }
    }

    return false;
}

const noInvalidThisRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        return {
            ThisExpression(node) {
                if (isValidThisContext(node)) {
                    return;
                }

                context.report({
                    node,
                    message: "Unexpected 'this'.",
                });
            },
        };
    },
};

export default noInvalidThisRule;
