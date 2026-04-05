/**
 * no-shadow-restricted-names — disallow identifiers from shadowing restricted names.
 * Adapted from ESLint's no-shadow-restricted-names rule.
 */

const RESTRICTED_NAMES = new Set([
    "undefined",
    "NaN",
    "Infinity",
    "eval",
    "arguments",
]);

const noShadowRestrictedNamesRule = {
    meta: { type: "suggestion", schema: [] },
    create(context) {
        return {
            "Program:exit"(node) {
                const scope = context.sourceCode.getScope(node);

                function checkScope(s) {
                    for (const variable of s.variables) {
                        if (!RESTRICTED_NAMES.has(variable.name)) continue;
                        // If there are any definitions in this scope (meaning it shadows the global)
                        if (variable.defs.length > 0) {
                            const def = variable.defs[0];
                            context.report({
                                node: def.name,
                                message: `Shadowing of global property '${variable.name}'.`,
                            });
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

export default noShadowRestrictedNamesRule;
