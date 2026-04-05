/**
 * no-unused-private-class-members — disallow unused private class members.
 * Adapted from ESLint's no-unused-private-class-members rule.
 */

const noUnusedPrivateClassMembersRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        // Stack of class info objects, one per class body
        const classStack = [];

        function currentClass() {
            return classStack[classStack.length - 1] || null;
        }

        return {
            ClassBody() {
                classStack.push({
                    defined: new Map(), // name -> definitionNode
                    used: new Set(),    // names used
                });
            },
            "ClassBody:exit"(node) {
                const info = classStack.pop();
                if (!info) return;
                for (const [name, defNode] of info.defined) {
                    if (!info.used.has(name)) {
                        context.report({
                            node: defNode,
                            message: `'#${name}' is defined but never used.`,
                        });
                    }
                }
            },
            // Track private field/method definitions
            PropertyDefinition(node) {
                if (!node.key || node.key.type !== "PrivateIdentifier") return;
                const info = currentClass();
                if (!info) return;
                info.defined.set(node.key.name, node);
            },
            MethodDefinition(node) {
                if (!node.key || node.key.type !== "PrivateIdentifier") return;
                const info = currentClass();
                if (!info) return;
                info.defined.set(node.key.name, node);
            },
            // Track private member accesses
            MemberExpression(node) {
                if (!node.property || node.property.type !== "PrivateIdentifier") return;
                const info = currentClass();
                if (!info) return;
                info.used.add(node.property.name);
            },
        };
    },
};

export default noUnusedPrivateClassMembersRule;
