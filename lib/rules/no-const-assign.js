/**
 * no-const-assign — disallow reassigning const variables.
 * Adapted from ESLint's no-const-assign rule.
 */

const noConstAssignRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            "Program:exit"(node) {
                const scope = context.sourceCode.getScope(node);
                const reported = new Set();

                function checkScope(s) {
                    for (const variable of s.variables) {
                        // Check if const
                        const isConst = variable.defs.some(def =>
                            def.type === "Variable" &&
                            def.parent &&
                            def.parent.kind === "const"
                        );
                        if (!isConst) continue;

                        // Check for write references
                        for (const ref of variable.references) {
                            if (ref.isWrite()) {
                                // Ignore the initial declaration assignment
                                const def = variable.defs.find(d => d.name === ref.identifier);
                                if (def) continue;
                                const key = `${ref.identifier.range[0]}:${ref.identifier.range[1]}`;
                                if (reported.has(key)) continue;
                                reported.add(key);
                                context.report({
                                    node: ref.identifier,
                                    message: `'${variable.name}' is constant.`,
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

export default noConstAssignRule;
