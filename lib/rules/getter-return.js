/**
 * getter-return — enforce return statements in getters (AST component).
 * Adapted from ESLint's getter-return rule.
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

function isGetter(node) {
    const parent = node.parent;
    if (!parent) return false;
    // Object property getter: { get foo() {} }
    if (parent.type === "Property" && parent.kind === "get" && parent.value === node) return true;
    // Class method getter: class { get foo() {} }
    if (parent.type === "MethodDefinition" && parent.kind === "get" && parent.value === node) return true;
    return false;
}

const getterReturnRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    allowImplicit: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const allowImplicit = context.options[0]?.allowImplicit ?? false;

        return {
            FunctionExpression(node) {
                if (!isGetter(node)) return;
                if (!node.body) return;

                const returns = findReturnStatements(node);

                if (returns.length === 0) {
                    context.report({
                        node,
                        message: "Expected to return a value in getter.",
                    });
                    return;
                }

                if (!allowImplicit) {
                    for (const ret of returns) {
                        if (!ret.argument) {
                            context.report({
                                node: ret,
                                message: "Expected to return a value in getter.",
                            });
                        }
                    }
                }
            },
        };
    },
};

export default getterReturnRule;
