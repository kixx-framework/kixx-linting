/**
 * no-dupe-class-members — disallow duplicate class member names.
 * Adapted from ESLint's no-dupe-class-members rule.
 */

function getName(node) {
    if (node.type === "Identifier") return node.name;
    if (node.type === "Literal") return String(node.value);
    return null;
}

const noDupeClassMembersRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            ClassBody(node) {
                const seen = new Map(); // "static:name:get/set/normal" -> true

                for (const member of node.body) {
                    if (member.computed) continue; // Skip computed keys

                    const name = getName(member.key);
                    if (name === null) continue;

                    const isStatic = member.static;
                    const kind = member.kind; // "constructor", "method", "get", "set"

                    // constructor can't be duplicated
                    const key = `${isStatic ? "static:" : ""}${name}:${kind}`;

                    if (seen.has(key)) {
                        context.report({
                            node: member,
                            message: `Duplicate class member '${name}'.`,
                        });
                    } else {
                        seen.set(key, true);
                        // Also track non-get/set version for conflict detection
                        if (kind === "get" || kind === "set") {
                            const methodKey = `${isStatic ? "static:" : ""}${name}:method`;
                            if (seen.has(methodKey)) {
                                context.report({
                                    node: member,
                                    message: `Duplicate class member '${name}'.`,
                                });
                            }
                        }
                    }
                }
            },
        };
    },
};

export default noDupeClassMembersRule;
