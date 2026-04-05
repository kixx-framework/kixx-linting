/**
 * valid-typeof — enforce comparing typeof expressions against valid strings.
 * Adapted from ESLint's valid-typeof rule.
 */

const VALID_TYPES = new Set([
    "symbol", "undefined", "object", "boolean", "number", "string", "function", "bigint",
]);
const TYPEOF_OPERATORS = new Set(["==", "===", "!=", "!=="]);

const validTypeofRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    requireStringLiterals: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const requireStringLiterals = context.options[0]?.requireStringLiterals ?? false;

        function isTypeofExpression(node) {
            return node.type === "UnaryExpression" && node.operator === "typeof";
        }

        return {
            UnaryExpression(node) {
                if (node.operator !== "typeof") return;

                const parent = node.parent;
                if (
                    parent.type === "BinaryExpression" &&
                    TYPEOF_OPERATORS.has(parent.operator) &&
                    (parent.left === node || parent.right === node)
                ) {
                    const sibling = parent.left === node ? parent.right : parent.left;

                    if (sibling.type === "Literal") {
                        if (!VALID_TYPES.has(sibling.value)) {
                            context.report({
                                node: sibling,
                                message: `Invalid typeof comparison value "${sibling.value}".`,
                            });
                        }
                    } else if (requireStringLiterals && !isTypeofExpression(sibling)) {
                        context.report({
                            node: sibling,
                            message: "Typeof comparisons should be to string literals.",
                        });
                    }
                }
            },
        };
    },
};

export default validTypeofRule;
