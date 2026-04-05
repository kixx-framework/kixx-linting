function getWriteReferences(variable) {
    return variable.references.filter(reference => reference.isWrite() && !reference.isRead());
}

const noUselessAssignmentRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const sourceCode = context.sourceCode;

        return {
            "Program:exit"() {
                for (const scope of sourceCode.scopeManager.scopes) {
                    for (const variable of scope.variables) {
                        if (variable.defs.length === 0) {
                            continue;
                        }

                        const writes = getWriteReferences(variable).sort(
                            (left, right) => left.identifier.range[0] - right.identifier.range[0],
                        );

                        for (let index = 0; index < writes.length; index++) {
                            const currentWrite = writes[index];
                            const nextWrite = writes[index + 1];
                            const currentStart = currentWrite.identifier.range[0];
                            const nextWriteStart = nextWrite?.identifier.range[0] ?? Infinity;

                            const readBeforeNextWrite = variable.references.some(reference => {
                                const start = reference.identifier.range[0];
                                return reference.isRead() && start > currentStart && start < nextWriteStart;
                            });

                            if (readBeforeNextWrite || !nextWrite) {
                                continue;
                            }

                            context.report({
                                node: currentWrite.identifier,
                                message: "The value assigned to '{{name}}' is not used in subsequent statements.",
                                data: { name: variable.name },
                            });
                        }
                    }
                }
            },
        };
    },
};

export default noUselessAssignmentRule;
