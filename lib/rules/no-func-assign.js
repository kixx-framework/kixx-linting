/**
 * no-func-assign — disallow reassigning function declarations.
 * Adapted from ESLint's no-func-assign rule.
 */

const noFuncAssignRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            "Program:exit"(node) {
                const scope = context.sourceCode.getScope(node);

                function checkScope(s) {
                    for (const variable of s.variables) {
                        const isFunc = variable.defs.some(def => def.type === "FunctionName");
                        if (!isFunc) continue;

                        for (const ref of variable.references) {
                            if (ref.isWrite()) {
                                context.report({
                                    node: ref.identifier,
                                    message: `'${variable.name}' is a function.`,
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

export default noFuncAssignRule;
