/**
 * no-ex-assign — disallow reassigning exceptions in catch clauses.
 * Adapted from ESLint's no-ex-assign rule.
 */

const noExAssignRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            "Program:exit"(node) {
                const scope = context.sourceCode.getScope(node);

                function checkScope(s) {
                    // CatchClause scopes hold the error binding
                    if (s.type === "catch") {
                        for (const variable of s.variables) {
                            // The catch param is a CatchClause binding
                            const isCatchParam = variable.defs.some(def => def.type === "CatchClause");
                            if (!isCatchParam) continue;

                            for (const ref of variable.references) {
                                if (ref.isWrite()) {
                                    context.report({
                                        node: ref.identifier,
                                        message: `Do not assign to the exception parameter.`,
                                    });
                                }
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

export default noExAssignRule;
