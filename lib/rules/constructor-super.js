/**
 * constructor-super — require super() calls in constructors (AST component only).
 * Adapted from ESLint's constructor-super rule.
 */

function getClassAncestor(node) {
    let current = node.parent;
    while (current) {
        if (current.type === "ClassDeclaration" || current.type === "ClassExpression") {
            return current;
        }
        current = current.parent;
    }
    return null;
}

function isDerivedClass(classNode) {
    return classNode && classNode.superClass !== null && classNode.superClass !== undefined;
}

function findSuperCalls(node) {
    const calls = [];
    function walk(n) {
        if (!n || typeof n !== "object") return;
        // Don't recurse into nested functions/classes
        if (n !== node && (
            n.type === "FunctionDeclaration" ||
            n.type === "FunctionExpression" ||
            n.type === "ArrowFunctionExpression" ||
            n.type === "ClassDeclaration" ||
            n.type === "ClassExpression"
        )) return;
        if (n.type === "CallExpression" && n.callee && n.callee.type === "Super") {
            calls.push(n);
        }
        for (const key of Object.keys(n)) {
            if (key === "parent") continue;
            const child = n[key];
            if (Array.isArray(child)) {
                child.forEach(walk);
            } else if (child && typeof child === "object" && child.type) {
                walk(child);
            }
        }
    }
    walk(node);
    return calls;
}

const constructorSuperRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            MethodDefinition(node) {
                if (node.kind !== "constructor") return;
                const classNode = getClassAncestor(node);
                if (!classNode) return;

                const derived = isDerivedClass(classNode);
                const superCalls = findSuperCalls(node.value.body);

                if (derived) {
                    // Must call super()
                    if (superCalls.length === 0) {
                        context.report({
                            node,
                            message: "Expected to call 'super()'.",
                        });
                    }
                } else {
                    // Must not call super()
                    for (const call of superCalls) {
                        context.report({
                            node: call,
                            message: "Unexpected 'super()'.",
                        });
                    }
                }
            },
        };
    },
};

export default constructorSuperRule;
