/**
 * no-useless-constructor — disallow unnecessary constructors.
 * Adapted from ESLint's no-useless-constructor rule.
 */

function isEmptyBody(body) {
    return body.type === "BlockStatement" && body.body.length === 0;
}

function isDerivedClass(classNode) {
    return classNode && classNode.superClass !== null && classNode.superClass !== undefined;
}

function getClassNode(methodNode) {
    let current = methodNode.parent;
    while (current) {
        if (current.type === "ClassDeclaration" || current.type === "ClassExpression") {
            return current;
        }
        current = current.parent;
    }
    return null;
}

function isSuperCallWithSpread(stmt) {
    if (stmt.type !== "ExpressionStatement") return false;
    const expr = stmt.expression;
    if (expr.type !== "CallExpression") return false;
    if (!expr.callee || expr.callee.type !== "Super") return false;
    return expr.arguments.some(arg => arg.type === "SpreadElement");
}

function isSimpleSuperCall(body, funcParams) {
    // Body must be: { super(...args) } where args matches the constructor params exactly
    if (body.body.length !== 1) return false;
    const stmt = body.body[0];
    if (stmt.type !== "ExpressionStatement") return false;
    const expr = stmt.expression;
    if (expr.type !== "CallExpression") return false;
    if (!expr.callee || expr.callee.type !== "Super") return false;

    const args = expr.arguments;
    const params = funcParams;

    if (args.length !== params.length) return false;

    // Each arg must match corresponding param
    for (let i = 0; i < params.length; i++) {
        const arg = args[i];
        const param = params[i];

        if (param.type === "RestElement") {
            // rest param: ...x => must be spread ...x
            if (arg.type !== "SpreadElement") return false;
            if (arg.argument.type !== "Identifier") return false;
            if (param.argument.type !== "Identifier") return false;
            if (arg.argument.name !== param.argument.name) return false;
        } else if (param.type === "Identifier") {
            if (arg.type !== "Identifier") return false;
            if (arg.name !== param.name) return false;
        } else {
            return false;
        }
    }

    return true;
}

const noUselessConstructorRule = {
    meta: { type: "suggestion", schema: [] },
    create(context) {
        return {
            MethodDefinition(node) {
                if (node.kind !== "constructor") return;
                const classNode = getClassNode(node);
                if (!classNode) return;
                const derived = isDerivedClass(classNode);
                const func = node.value;
                const body = func.body;

                if (!derived) {
                    // Non-derived: useless if empty
                    if (isEmptyBody(body)) {
                        context.report({
                            node,
                            message: "Useless constructor.",
                        });
                    }
                } else {
                    // Derived: useless if just calls super(...args) with same params
                    if (isEmptyBody(body)) {
                        context.report({
                            node,
                            message: "Useless constructor.",
                        });
                    } else if (isSimpleSuperCall(body, func.params)) {
                        context.report({
                            node,
                            message: "Useless constructor.",
                        });
                    }
                }
            },
        };
    },
};

export default noUselessConstructorRule;
