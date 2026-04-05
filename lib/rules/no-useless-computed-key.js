/**
 * no-useless-computed-key — disallow unnecessary computed property keys in objects and classes.
 * Adapted from ESLint's no-useless-computed-key rule.
 */

function isUselessComputedKey(key) {
    if (!key) return false;
    // ["foo"] — string literal
    if (key.type === "Literal" && typeof key.value === "string") return true;
    // [0] or [1.5] — number literal (but not NaN/Infinity as identifiers)
    if (key.type === "Literal" && typeof key.value === "number") return true;
    return false;
}

function getKeyName(key) {
    if (key.type === "Literal") return JSON.stringify(key.value);
    return null;
}

const noUselessComputedKeyRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    enforceForClassMembers: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const enforceForClassMembers = context.options[0]?.enforceForClassMembers ?? false;

        function checkProperty(node) {
            if (!node.computed) return;
            if (!isUselessComputedKey(node.key)) return;
            context.report({
                node,
                message: `Unnecessarily computed property [${getKeyName(node.key)}] found.`,
            });
        }

        function checkClassMember(node) {
            if (!node.computed) return;
            if (!isUselessComputedKey(node.key)) return;
            context.report({
                node,
                message: `Unnecessarily computed property [${getKeyName(node.key)}] found.`,
            });
        }

        const visitors = {
            Property: checkProperty,
        };

        if (enforceForClassMembers) {
            visitors.MethodDefinition = checkClassMember;
            visitors.PropertyDefinition = checkClassMember;
        }

        return visitors;
    },
};

export default noUselessComputedKeyRule;
