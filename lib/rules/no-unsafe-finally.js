/**
 * no-unsafe-finally — disallow control flow statements in finally blocks.
 * Adapted from ESLint's no-unsafe-finally rule.
 */

const UNSAFE_TYPES = new Set([
    "BreakStatement", "ContinueStatement", "ReturnStatement", "ThrowStatement",
]);

function isInsideFinally(node) {
    let current = node.parent;
    while (current) {
        if (
            current.type === "TryStatement" &&
            current.finalizer &&
            isInsideBlock(node, current.finalizer)
        ) {
            return true;
        }
        // Stop at function boundary
        if (
            current.type === "FunctionDeclaration" ||
            current.type === "FunctionExpression" ||
            current.type === "ArrowFunctionExpression"
        ) {
            return false;
        }
        current = current.parent;
    }
    return false;
}

function isInsideBlock(node, block) {
    return (
        node.range[0] >= block.range[0] &&
        node.range[1] <= block.range[1]
    );
}

const noUnsafeFinallyRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            BreakStatement(node) {
                if (!node.label && isInsideFinally(node)) {
                    context.report({ node, message: "Unsafe usage of BreakStatement." });
                }
            },
            ContinueStatement(node) {
                if (!node.label && isInsideFinally(node)) {
                    context.report({ node, message: "Unsafe usage of ContinueStatement." });
                }
            },
            ReturnStatement(node) {
                if (isInsideFinally(node)) {
                    context.report({ node, message: "Unsafe usage of ReturnStatement." });
                }
            },
            ThrowStatement(node) {
                if (isInsideFinally(node)) {
                    context.report({ node, message: "Unsafe usage of ThrowStatement." });
                }
            },
        };
    },
};

export default noUnsafeFinallyRule;
