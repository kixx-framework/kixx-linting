/**
 * use-isnan — require calls to isNaN() when checking for NaN.
 * Adapted from ESLint's use-isnan rule.
 */

const COMPARISON_OPS = new Set(["==", "===", "!=", "!=="]);

function isNaNIdentifier(node) {
    return node.type === "Identifier" && node.name === "NaN";
}

const useIsnanRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    enforceForSwitchCase: { type: "boolean" },
                    enforceForIndexOf: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const enforceForSwitchCase = options.enforceForSwitchCase ?? true;
        const enforceForIndexOf = options.enforceForIndexOf ?? false;

        function isNaNIndex(node) {
            return (
                node.type === "CallExpression" &&
                node.callee.type === "MemberExpression" &&
                !node.callee.computed &&
                (node.callee.property.name === "indexOf" || node.callee.property.name === "lastIndexOf") &&
                node.arguments.length === 1 &&
                isNaNIdentifier(node.arguments[0])
            );
        }

        return {
            BinaryExpression(node) {
                if (
                    COMPARISON_OPS.has(node.operator) &&
                    (isNaNIdentifier(node.left) || isNaNIdentifier(node.right))
                ) {
                    context.report({
                        node,
                        message: "Use the isNaN function to compare with NaN.",
                    });
                }
            },

            SwitchCase(node) {
                if (enforceForSwitchCase && node.test && isNaNIdentifier(node.test)) {
                    context.report({
                        node,
                        message: "Use the isNaN function to compare with NaN.",
                    });
                }
            },

            CallExpression(node) {
                if (enforceForIndexOf && isNaNIndex(node)) {
                    context.report({
                        node,
                        message: "Array prototype method '{{method}}' is overwritten by NaN."
                            .replace("{{method}}", node.callee.property.name),
                    });
                }
            },
        };
    },
};

export default useIsnanRule;
