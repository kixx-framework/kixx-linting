/**
 * grouped-accessor-pairs — require grouped accessor pairs in object literals and classes.
 * Adapted from ESLint's grouped-accessor-pairs rule.
 */

function getPropertyKey(node) {
    if (node.computed) return null; // Skip computed keys
    if (!node.key) return null;
    if (node.key.type === "Identifier") return node.key.name;
    if (node.key.type === "Literal") return String(node.key.value);
    return null;
}

function checkAccessors(nodes, context, order) {
    // Build a map of key -> [{kind, node, index}]
    const accessorMap = new Map();

    nodes.forEach((member, index) => {
        const kind = member.kind; // "get" or "set" for property, "get"/"set" for method
        if (kind !== "get" && kind !== "set") return;
        const key = getPropertyKey(member);
        if (key === null) return;
        const isStatic = member.static || false;
        const mapKey = `${isStatic ? "static:" : ""}${key}`;
        if (!accessorMap.has(mapKey)) {
            accessorMap.set(mapKey, []);
        }
        accessorMap.get(mapKey).push({ kind, node: member, index });
    });

    for (const [, accessors] of accessorMap) {
        if (accessors.length < 2) continue;
        const getter = accessors.find(a => a.kind === "get");
        const setter = accessors.find(a => a.kind === "set");
        if (!getter || !setter) continue;

        // Check adjacency: they should be next to each other
        const diff = Math.abs(getter.index - setter.index);
        if (diff !== 1) {
            context.report({
                node: setter.node,
                message: `Accessor pair for '${getPropertyKey(setter.node)}' should be grouped.`,
            });
            continue;
        }

        // Check order
        if (order === "getBeforeSet" && getter.index > setter.index) {
            context.report({
                node: getter.node,
                message: `Getter should come before setter for '${getPropertyKey(getter.node)}'.`,
            });
        } else if (order === "setBeforeGet" && setter.index > getter.index) {
            context.report({
                node: setter.node,
                message: `Setter should come before getter for '${getPropertyKey(setter.node)}'.`,
            });
        }
    }
}

const groupedAccessorPairsRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                enum: ["anyOrder", "getBeforeSet", "setBeforeGet"],
            },
        ],
    },
    create(context) {
        const order = context.options[0] ?? "anyOrder";

        return {
            ObjectExpression(node) {
                checkAccessors(node.properties, context, order);
            },
            ClassBody(node) {
                checkAccessors(node.body, context, order);
            },
        };
    },
};

export default groupedAccessorPairsRule;
