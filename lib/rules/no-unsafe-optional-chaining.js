/**
 * no-unsafe-optional-chaining — disallow use of optional chaining in contexts where the undefined value is not allowed.
 * Adapted from ESLint's no-unsafe-optional-chaining rule.
 */

function isOptionalChaining(node) {
    return (
        (node.type === "ChainExpression") ||
        (node.type === "CallExpression" && node.optional) ||
        (node.type === "MemberExpression" && node.optional)
    );
}

function hasOptionalChaining(node) {
    if (!node) return false;
    if (isOptionalChaining(node)) return true;
    if (node.type === "ChainExpression") return true;
    // Check if the node contains optional chaining
    if (node.type === "CallExpression" || node.type === "MemberExpression") {
        return (node.optional) || hasOptionalChaining(node.object) || hasOptionalChaining(node.callee);
    }
    return false;
}

// Contexts where undefined would cause a TypeError
function checkNode(node, context, fieldName) {
    const child = node[fieldName];
    if (!child) return;

    // Check if child is or contains optional chaining
    if (
        child.type === "ChainExpression" ||
        (child.type === "CallExpression" && child.optional) ||
        (child.type === "MemberExpression" && child.optional) ||
        child.type === "LogicalExpression" // Could be short-circuited optional chain
    ) {
        // Actually look for the outermost optional chain result
        // The unsafe case is when ?.foo is used where undefined can't be used
    }

    // Simplified: check if the expression could be undefined (via optional chaining)
    // and is in a context that can't handle undefined
    function isOptionalChainResult(n) {
        if (!n) return false;
        if (n.type === "ChainExpression") return true;
        if ((n.type === "CallExpression" || n.type === "MemberExpression") && n.optional) return true;
        if (n.type === "LogicalExpression") return isOptionalChainResult(n.right);
        if (n.type === "AssignmentExpression") return isOptionalChainResult(n.right);
        return false;
    }

    if (isOptionalChainResult(child)) {
        context.report({
            node,
            message: "Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError.",
        });
    }
}

const noUnsafeOptionalChainingRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    disallowArithmeticOperators: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const disallowArithmetic = context.options[0]?.disallowArithmeticOperators ?? false;

        function check(node, child) {
            if (!child) return;
            function isOC(n) {
                if (!n) return false;
                if (n.type === "ChainExpression") return true;
                if ((n.type === "CallExpression" || n.type === "MemberExpression") && n.optional) return true;
                return false;
            }
            if (isOC(child)) {
                context.report({
                    node,
                    message: "Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError.",
                });
            }
        }

        return {
            // new (a?.b)() — can't use undefined as constructor
            "NewExpression"(node) {
                check(node, node.callee.type === "ChainExpression" ? node.callee : null);
                if (node.callee.type === "ChainExpression") {
                    context.report({
                        node,
                        message: "Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError.",
                    });
                }
            },
            // (a?.b)() — template tag
            "TaggedTemplateExpression"(node) {
                if (node.tag.type === "ChainExpression") {
                    context.report({
                        node,
                        message: "Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError.",
                    });
                }
            },
            // Spreading: [...a?.b] — can't spread undefined
            "SpreadElement"(node) {
                if (node.argument.type === "ChainExpression") {
                    context.report({
                        node,
                        message: "Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError.",
                    });
                }
            },
        };
    },
};

export default noUnsafeOptionalChainingRule;
