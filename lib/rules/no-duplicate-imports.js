/**
 * no-duplicate-imports — disallow duplicate module imports.
 * Adapted from ESLint's no-duplicate-imports rule.
 */

const noDuplicateImportsRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    includeExports: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const includeExports = context.options[0]?.includeExports ?? false;

        // Map from source value to { import: node, export: node }
        const importedSources = new Map();
        const exportedSources = new Map();

        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                if (importedSources.has(source)) {
                    context.report({
                        node,
                        message: `'${source}' import is duplicated.`,
                    });
                } else {
                    importedSources.set(source, node);
                }
            },
            ExportNamedDeclaration(node) {
                if (!includeExports || !node.source) return;
                const source = node.source.value;
                if (exportedSources.has(source)) {
                    context.report({
                        node,
                        message: `'${source}' export is duplicated.`,
                    });
                } else {
                    exportedSources.set(source, node);
                }
            },
            ExportAllDeclaration(node) {
                if (!includeExports || !node.source) return;
                const source = node.source.value;
                if (exportedSources.has(source)) {
                    context.report({
                        node,
                        message: `'${source}' export is duplicated.`,
                    });
                } else {
                    exportedSources.set(source, node);
                }
            },
        };
    },
};

export default noDuplicateImportsRule;
