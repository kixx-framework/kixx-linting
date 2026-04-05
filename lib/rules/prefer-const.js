function isEligibleLetDeclarator(node) {
    return (
        node.parent?.type === "VariableDeclaration" &&
        node.parent.kind === "let" &&
        node.init !== null &&
        node.parent.parent?.type !== "ForStatement"
    );
}

function isOnlyInitializedOnce(variable) {
    let writeCount = 0;

    for (const reference of variable.references) {
        if (!reference.isWrite()) {
            continue;
        }

        writeCount += 1;
        if (writeCount > 1 || reference.init !== true) {
            return false;
        }
    }

    return writeCount === 1;
}

const preferConstRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        const sourceCode = context.sourceCode;

        return {
            VariableDeclarator(node) {
                if (!isEligibleLetDeclarator(node)) {
                    return;
                }

                const variables = sourceCode.getDeclaredVariables(node);
                for (const variable of variables) {
                    if (!isOnlyInitializedOnce(variable)) {
                        return;
                    }
                }

                for (const variable of variables) {
                    const identifier = variable.identifiers[0];
                    if (!identifier) {
                        continue;
                    }

                    context.report({
                        node: identifier,
                        message: "'{{name}}' is never reassigned. Use 'const' instead.",
                        data: { name: variable.name },
                    });
                }
            },
        };
    },
};

export default preferConstRule;
