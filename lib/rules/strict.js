/**
 * strict — require or disallow strict mode directives.
 * Adapted from ESLint's strict rule (simplified to the most common modes).
 */

function getDirectives(body) {
    const directives = [];
    for (const node of body) {
        if (
            node.type === "ExpressionStatement" &&
            node.expression.type === "Literal" &&
            node.expression.value === "use strict"
        ) {
            directives.push(node);
        } else {
            break;
        }
    }
    return directives;
}

const strictRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                enum: ["never", "global", "function", "safe"],
            },
        ],
    },
    create(context) {
        const mode = context.options[0] ?? "safe";

        // In ESM (module sourceType), strict mode is always on — no directives needed
        // We'll do a simplified check: report "use strict" in modules, or missing in scripts

        // Detect if this is an ES module by checking for import/export declarations
        function isModuleProgram(node) {
            return node.body.some(stmt =>
                stmt.type === "ImportDeclaration" ||
                stmt.type === "ExportDefaultDeclaration" ||
                stmt.type === "ExportNamedDeclaration" ||
                stmt.type === "ExportAllDeclaration"
            );
        }

        return {
            Program(node) {
                const directives = getDirectives(node.body);
                const hasGlobalStrict = directives.length > 0;
                const isModule = isModuleProgram(node);

                if (mode === "never") {
                    for (const dir of directives) {
                        context.report({
                            node: dir,
                            message: "Strict mode is not permitted.",
                        });
                    }
                } else if (mode === "global") {
                    if (!hasGlobalStrict) {
                        context.report({
                            node,
                            message: "Use the global form of 'use strict'.",
                        });
                    } else if (directives.length > 1) {
                        for (let i = 1; i < directives.length; i++) {
                            context.report({
                                node: directives[i],
                                message: "Multiple 'use strict' directives.",
                            });
                        }
                    }
                } else if (mode === "safe") {
                    // In safe mode: ES modules already have strict mode; 'use strict' is redundant
                    if (isModule && hasGlobalStrict) {
                        for (const dir of directives) {
                            context.report({
                                node: dir,
                                message: "'use strict' is unnecessary in an ES module.",
                            });
                        }
                    }
                }
            },
        };
    },
};

export default strictRule;
