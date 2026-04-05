/**
 * no-dupe-keys — disallow duplicate keys in object literals.
 * Adapted from ESLint's no-dupe-keys rule.
 */

function getName(node) {
    if (node.type === "Identifier") return node.name;
    if (node.type === "Literal") return String(node.value);
    if (node.type === "PrivateIdentifier") return `#${node.name}`;
    return null;
}

const noDupeKeysRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            ObjectExpression(node) {
                const seenKeys = new Set();
                for (const prop of node.properties) {
                    if (prop.type !== "Property" || prop.computed) continue;
                    const name = getName(prop.key);
                    if (name === null) continue;
                    if (seenKeys.has(name)) {
                        context.report({
                            node: prop,
                            message: `Duplicate key '${name}'.`,
                        });
                    } else {
                        seenKeys.add(name);
                    }
                }
            },
        };
    },
};

export default noDupeKeysRule;
