/**
 * require-atomic-updates — disallow assignments that can lead to race conditions due to using await or yield.
 * Adapted from ESLint's require-atomic-updates rule (simplified).
 */

/**
 * Check if an expression is a non-atomic read-modify-write using await/yield.
 * The unsafe pattern is: x = await expr; where x is also read in expr.
 * But the simpler and more common check is:
 * x += await expr  (compound assignment with await on right side)
 * or
 * x = x + await expr
 */

function containsAwaitOrYield(node) {
    if (!node) return false;
    if (node.type === "AwaitExpression" || node.type === "YieldExpression") return true;
    // Don't recurse into nested async functions
    if (
        node.type === "FunctionExpression" ||
        node.type === "FunctionDeclaration" ||
        node.type === "ArrowFunctionExpression"
    ) return false;
    for (const key of Object.keys(node)) {
        if (key === "parent") continue;
        const child = node[key];
        if (child && typeof child === "object" && child.type) {
            if (containsAwaitOrYield(child)) return true;
        }
        if (Array.isArray(child)) {
            for (const item of child) {
                if (item && typeof item === "object" && item.type && containsAwaitOrYield(item)) return true;
            }
        }
    }
    return false;
}

function getIdentifierName(node) {
    if (!node) return null;
    if (node.type === "Identifier") return node.name;
    return null;
}

function isSelfReferentialAssignment(left, right) {
    const name = getIdentifierName(left);
    if (!name) return false;

    // Check if right side contains a reference to the same identifier
    function containsRef(node) {
        if (!node) return false;
        if (node.type === "Identifier" && node.name === name) return true;
        for (const key of Object.keys(node)) {
            if (key === "parent") continue;
            const child = node[key];
            if (child && typeof child === "object" && child.type && containsRef(child)) return true;
            if (Array.isArray(child)) {
                for (const item of child) {
                    if (item && typeof item === "object" && item.type && containsRef(item)) return true;
                }
            }
        }
        return false;
    }

    return containsRef(right);
}

const requireAtomicUpdatesRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    allowProperties: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        return {
            AssignmentExpression(node) {
                const { operator, left, right } = node;

                // Compound assignment with await/yield on right: x += await foo()
                if (operator !== "=" && containsAwaitOrYield(right)) {
                    const name = getIdentifierName(left);
                    if (name) {
                        context.report({
                            node,
                            message: `Possible race condition: '${name}' might be reassigned based on an outdated value of '${name}'.`,
                        });
                        return;
                    }
                }

                // Simple assignment where left appears in right with await: x = x + await foo()
                if (operator === "=" && containsAwaitOrYield(right)) {
                    if (isSelfReferentialAssignment(left, right)) {
                        const name = getIdentifierName(left);
                        context.report({
                            node,
                            message: `Possible race condition: '${name}' might be reassigned based on an outdated value of '${name}'.`,
                        });
                    }
                }
            },
        };
    },
};

export default requireAtomicUpdatesRule;
