function hasTypeOfOperator(node) {
    const parent = node.parent;
    return parent?.type === "UnaryExpression" && parent.operator === "typeof";
}

const noUndefRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const option = context.options[0] ?? {};
        const considerTypeOf = option.typeof === true;
        const sourceCode = context.sourceCode;

        return {
            "Program:exit"(node) {
                const globalScope = sourceCode.getScope(node);

                for (const reference of globalScope.through) {
                    const identifier = reference.identifier;

                    if (!considerTypeOf && hasTypeOfOperator(identifier)) {
                        continue;
                    }

                    context.report({
                        node: identifier,
                        message: "'{{name}}' is not defined.",
                        data: { name: identifier.name },
                    });
                }
            },
        };
    },
};

export default noUndefRule;
