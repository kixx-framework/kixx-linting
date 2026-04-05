function isDoubleNegation(node) {
    return (
        node.operator === "!" &&
        node.argument.type === "UnaryExpression" &&
        node.argument.operator === "!"
    );
}

function isStringConcatenation(node) {
    return (
        node.type === "BinaryExpression" &&
        node.operator === "+" &&
        ((node.left.type === "Literal" && node.left.value === "") ||
            (node.right.type === "Literal" && node.right.value === ""))
    );
}

const noImplicitCoercionRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        return {
            UnaryExpression(node) {
                if (isDoubleNegation(node)) {
                    context.report({
                        node,
                        message: "Use explicit coercion instead of '!!'.",
                    });
                    return;
                }

                if (node.operator === "+" || node.operator === "~") {
                    context.report({
                        node,
                        message: "Use explicit coercion instead of '{{operator}}'.",
                        data: { operator: node.operator },
                    });
                }
            },

            BinaryExpression(node) {
                if (!isStringConcatenation(node)) {
                    return;
                }

                context.report({
                    node,
                    message: "Use explicit coercion instead of string concatenation with ''.",
                });
            },
        };
    },
};

export default noImplicitCoercionRule;
