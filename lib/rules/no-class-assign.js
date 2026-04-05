/**
 * no-class-assign — disallow reassigning class declarations.
 * Adapted from ESLint's no-class-assign rule.
 */

const noClassAssignRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            "Program:exit"(node) {
                const scope = context.sourceCode.getScope(node);

                function checkScope(s) {
                    for (const variable of s.variables) {
                        const isClass = variable.defs.some(def => def.type === "ClassName");
                        if (!isClass) continue;

                        for (const ref of variable.references) {
                            if (ref.isWrite()) {
                                const def = variable.defs.find(d => d.name === ref.identifier);
                                if (def) continue;
                                context.report({
                                    node: ref.identifier,
                                    message: `'${variable.name}' is a class.`,
                                });
                            }
                        }
                    }

                    for (const child of s.childScopes) {
                        checkScope(child);
                    }
                }

                checkScope(scope);
            },
        };
    },
};

export default noClassAssignRule;
