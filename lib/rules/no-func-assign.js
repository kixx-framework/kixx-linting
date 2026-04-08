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
                const reported = new Set();

                function checkScope(s) {
                    for (const variable of s.variables) {
                        const isFunc = variable.defs.some(def => def.type === "FunctionName");
                        if (!isFunc) continue;

                        for (const ref of variable.references) {
                            if (ref.isWrite()) {
                                const def = variable.defs.find(d => d.name === ref.identifier);
                                if (def) continue;

                                const key = `${ref.identifier.range[0]}:${ref.identifier.range[1]}`;
                                if (reported.has(key)) continue;
                                reported.add(key);

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
