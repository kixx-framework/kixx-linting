/**
 * no-constant-binary-expression — disallow expressions where the operation doesn't change the value.
 * Adapted from ESLint's no-constant-binary-expression rule.
 */

// Types that always have a defined truthiness
const ALWAYS_TRUTHY_TYPES = new Set([
    "ClassExpression",
    "FunctionExpression",
    "ArrowFunctionExpression",
    "ArrayExpression",
    "ObjectExpression",
    "NewExpression",
]);

// Types that are always nullish
const ALWAYS_NULLISH_TYPES = new Set([]);

function isAlwaysTruthy(node) {
    if (!node) return false;
    if (ALWAYS_TRUTHY_TYPES.has(node.type)) return true;
    if (node.type === "Literal") {
        if (node.value === null) return false;
        if (typeof node.value === "boolean") return node.value;
        if (typeof node.value === "number") return node.value !== 0;
        if (typeof node.value === "string") return node.value !== "";
        if (typeof node.value === "bigint") return node.value !== 0n;
        return true; // regex literals
    }
    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return node.quasis[0].value.cooked !== "";
    }
    return false;
}

function isAlwaysFalsy(node) {
    if (!node) return false;
    if (node.type === "Literal") {
        if (node.value === null) return true;
        if (node.value === undefined) return true;
        if (typeof node.value === "boolean") return !node.value;
        if (typeof node.value === "number") return node.value === 0 || Number.isNaN(node.value);
        if (typeof node.value === "string") return node.value === "";
        if (typeof node.value === "bigint") return node.value === 0n;
    }
    if (node.type === "Identifier") {
        return node.name === "undefined" || node.name === "NaN";
    }
    return false;
}

function isAlwaysNullish(node) {
    if (!node) return false;
    if (node.type === "Literal" && node.value === null) return true;
    if (node.type === "Identifier" && node.name === "undefined") return true;
    return false;
}

function isAlwaysNewObject(node) {
    if (!node) return false;
    return (
        node.type === "ObjectExpression" ||
        node.type === "ArrayExpression" ||
        node.type === "ClassExpression" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "NewExpression"
    );
}

const noConstantBinaryExpressionRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            LogicalExpression(node) {
                const { operator, left, right } = node;

                if (operator === "&&") {
                    // left && right — if left is always falsy, right is never evaluated
                    // if left is always truthy, result is always right
                    if (isAlwaysFalsy(left)) {
                        context.report({
                            node,
                            message: "Unexpected constant condition. The expression is always falsy.",
                        });
                    } else if (isAlwaysTruthy(left)) {
                        context.report({
                            node,
                            message: "Unexpected constant condition. The left operand is always truthy.",
                        });
                    }
                } else if (operator === "||") {
                    // left || right — if left is always truthy, result is always left
                    if (isAlwaysTruthy(left)) {
                        context.report({
                            node,
                            message: "Unexpected constant condition. The left operand is always truthy.",
                        });
                    } else if (isAlwaysFalsy(left)) {
                        context.report({
                            node,
                            message: "Unexpected constant condition. The expression always evaluates to the right operand.",
                        });
                    }
                } else if (operator === "??") {
                    // left ?? right — if left is never nullish, right is never evaluated
                    if (!isAlwaysNullish(left) && isAlwaysTruthy(left)) {
                        context.report({
                            node,
                            message: "Unexpected constant condition. The left operand is never nullish.",
                        });
                    }
                }
            },

            BinaryExpression(node) {
                const { operator, left, right } = node;

                // Check === and !== with objects that are always new (never equal by reference)
                if (operator === "===" || operator === "!==") {
                    if (isAlwaysNewObject(left) || isAlwaysNewObject(right)) {
                        context.report({
                            node,
                            message: `Unexpected constant condition. Comparisons with newly created objects using '${operator}' are always ${operator === "===" ? "false" : "true"}.`,
                        });
                    }
                }
            },
        };
    },
};

export default noConstantBinaryExpressionRule;
