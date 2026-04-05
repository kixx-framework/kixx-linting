/**
 * no-unmodified-loop-condition — disallow unmodified loop conditions.
 * Adapted from ESLint's no-unmodified-loop-condition rule (simplified AST approach).
 *
 * Reports a violation only when NONE of the condition variables are modified in the loop.
 * If at least one condition variable changes, the loop condition can resolve differently.
 */

function getIdentifiersInExpression(node) {
    if (!node) return [];
    const ids = [];
    function walk(n) {
        if (!n || typeof n !== "object") return;
        if (n.type === "Identifier") {
            ids.push(n.name);
            return;
        }
        for (const key of Object.keys(n)) {
            if (key === "parent") continue;
            const child = n[key];
            if (Array.isArray(child)) child.forEach(walk);
            else if (child && typeof child === "object" && child.type) walk(child);
        }
    }
    walk(node);
    return ids;
}

function getModifiedIdentifiers(node) {
    const modified = new Set();
    function walk(n) {
        if (!n || typeof n !== "object") return;
        // Don't recurse into nested functions
        if (
            n.type === "FunctionDeclaration" ||
            n.type === "FunctionExpression" ||
            n.type === "ArrowFunctionExpression"
        ) return;
        if (n.type === "AssignmentExpression" && n.left.type === "Identifier") {
            modified.add(n.left.name);
        }
        if (n.type === "UpdateExpression" && n.argument.type === "Identifier") {
            modified.add(n.argument.name);
        }
        for (const key of Object.keys(n)) {
            if (key === "parent") continue;
            const child = n[key];
            if (Array.isArray(child)) child.forEach(walk);
            else if (child && typeof child === "object" && child.type) walk(child);
        }
    }
    walk(node);
    return modified;
}

function checkCondition(condition, modified, context) {
    if (!condition) return;
    const ids = getIdentifiersInExpression(condition);
    if (ids.length === 0) return;

    // Only report if NONE of the condition identifiers are modified
    const anyModified = ids.some(id => modified.has(id));
    if (!anyModified) {
        context.report({
            node: condition,
            message: `'${ids[0]}' is not modified in this loop.`,
        });
    }
}

const noUnmodifiedLoopConditionRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            WhileStatement(node) {
                const modified = getModifiedIdentifiers(node.body);
                checkCondition(node.test, modified, context);
            },
            DoWhileStatement(node) {
                const modified = getModifiedIdentifiers(node.body);
                checkCondition(node.test, modified, context);
            },
            ForStatement(node) {
                if (!node.test) return;
                const modified = getModifiedIdentifiers(node.body);
                // Also count modifications in the update clause
                if (node.update) {
                    const updateMods = getModifiedIdentifiers(node.update);
                    for (const name of updateMods) modified.add(name);
                }
                checkCondition(node.test, modified, context);
            },
        };
    },
};

export default noUnmodifiedLoopConditionRule;
