/**
 * no-useless-concat — disallow unnecessary concatenation of literals or template literals.
 * Adapted from ESLint's no-useless-concat rule.
 */

function isStringLiteral(node) {
    return (
        (node.type === "Literal" && typeof node.value === "string") ||
        node.type === "TemplateLiteral"
    );
}

function isOnSameLine(left, right) {
    return left.loc.end.line === right.loc.start.line;
}

function getLeft(node) {
    // Walk left side to find the leftmost leaf of nested concatenations
    if (node.type === "BinaryExpression" && node.operator === "+") {
        return getLeft(node.left);
    }
    return node;
}

function getRight(node) {
    // Right side of a concatenation
    return node.right;
}

const noUselessConcatRule = {
    meta: {
        type: "suggestion",
        schema: [],
    },

    create(context) {
        const sourceCode = context.sourceCode;

        return {
            BinaryExpression(node) {
                if (node.operator !== "+") return;

                const left = getLeft(node);
                const right = getRight(node);

                if (
                    isStringLiteral(left) &&
                    isStringLiteral(right) &&
                    isOnSameLine(left, right)
                ) {
                    context.report({
                        node,
                        message: "Unexpected string concatenation of literals.",
                    });
                }
            },
        };
    },
};

export default noUselessConcatRule;
