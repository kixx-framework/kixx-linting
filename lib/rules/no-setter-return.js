/**
 * no-setter-return — disallow returning values from setters.
 * Adapted from ESLint's no-setter-return rule.
 */

function findReturnStatements(node) {
    const returns = [];
    function walk(n) {
        if (!n || typeof n !== "object") return;
        if (
            n !== node && (
                n.type === "FunctionDeclaration" ||
                n.type === "FunctionExpression" ||
                n.type === "ArrowFunctionExpression"
            )
        ) return;
        if (n.type === "ReturnStatement") {
            returns.push(n);
        }
        for (const key of Object.keys(n)) {
            if (key === "parent") continue;
            const child = n[key];
            if (Array.isArray(child)) child.forEach(walk);
            else if (child && typeof child === "object" && child.type) walk(child);
        }
    }
    walk(node.body);
    return returns;
}

function isSetter(node) {
    const parent = node.parent;
    if (!parent) return false;
    // Object property setter: { set foo(v) {} }
    if (parent.type === "Property" && parent.kind === "set" && parent.value === node) return true;
    // Class method setter: class { set foo(v) {} }
    if (parent.type === "MethodDefinition" && parent.kind === "set" && parent.value === node) return true;
    return false;
}

const noSetterReturnRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            FunctionExpression(node) {
                if (!isSetter(node)) return;
                const returns = findReturnStatements(node);
                for (const ret of returns) {
                    if (ret.argument) {
                        context.report({
                            node: ret,
                            message: "Setter cannot return a value.",
                        });
                    }
                }
            },
        };
    },
};

export default noSetterReturnRule;
