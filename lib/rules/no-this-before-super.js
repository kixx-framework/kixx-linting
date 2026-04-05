/**
 * no-this-before-super — disallow this/super before calling super() in constructors (AST component).
 * Adapted from ESLint's no-this-before-super rule.
 */

function isDerivedClass(classNode) {
    return classNode && classNode.superClass !== null && classNode.superClass !== undefined;
}

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

function analyzeConstructorBody(body) {
    // Walk the statements linearly (AST order = source order for our purposes)
    // Track whether we've seen a super() call before this/super access
    let superCallFound = false;
    const violations = [];

    function walk(node, inLoop) {
        if (!node || typeof node !== "object") return;

        // Skip nested functions/classes (they have their own this/super context)
        if (
            node.type === "FunctionDeclaration" ||
            node.type === "FunctionExpression" ||
            node.type === "ArrowFunctionExpression" ||
            node.type === "ClassDeclaration" ||
            node.type === "ClassExpression"
        ) return;

        if (node.type === "CallExpression" && node.callee && node.callee.type === "Super") {
            superCallFound = true;
            return;
        }

        if (!superCallFound) {
            if (node.type === "ThisExpression") {
                violations.push({ node, message: "'this' is not allowed before 'super()'." });
            }
            if (node.type === "Super" && node.parent && node.parent.type !== "CallExpression") {
                violations.push({ node, message: "'super' is not allowed before 'super()'." });
            }
        }

        for (const key of Object.keys(node)) {
            if (key === "parent") continue;
            const child = node[key];
            if (Array.isArray(child)) child.forEach(c => walk(c, inLoop));
            else if (child && typeof child === "object" && child.type) walk(child, inLoop);
        }
    }

    for (const stmt of body.body) {
        walk(stmt, false);
    }

    return violations;
}

const noThisBeforeSuperRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            MethodDefinition(node) {
                if (node.kind !== "constructor") return;
                const classNode = getClassAncestor(node);
                if (!classNode || !isDerivedClass(classNode)) return;

                const violations = analyzeConstructorBody(node.value.body);
                for (const v of violations) {
                    context.report(v);
                }
            },
        };
    },
};

export default noThisBeforeSuperRule;
