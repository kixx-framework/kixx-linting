/**
 * no-else-return — disallow else blocks after return statements in if statements.
 * Adapted from ESLint's no-else-return rule.
 */

function alwaysReturns(node) {
    if (!node) return false;
    if (node.type === "ReturnStatement" || node.type === "ThrowStatement") return true;
    if (node.type === "BlockStatement") {
        // A block always returns if any statement is a return/throw at top level
        // (simplified: check if last statement returns)
        for (let i = node.body.length - 1; i >= 0; i--) {
            const stmt = node.body[i];
            if (alwaysReturns(stmt)) return true;
            break;
        }
        // Check if ALL paths return — just check for explicit return at top level
        for (const stmt of node.body) {
            if (alwaysReturns(stmt)) return true;
        }
        return false;
    }
    if (node.type === "IfStatement") {
        return alwaysReturns(node.consequent) && alwaysReturns(node.alternate);
    }
    return false;
}

function containsReturn(node) {
    if (!node) return false;
    if (node.type === "ReturnStatement") return true;
    if (node.type === "BlockStatement") {
        return node.body.some(stmt => containsReturn(stmt));
    }
    if (node.type === "IfStatement") {
        return containsReturn(node.consequent) || containsReturn(node.alternate);
    }
    return false;
}

const noElseReturnRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    allowElseIf: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const allowElseIf = context.options[0]?.allowElseIf ?? true;

        return {
            IfStatement(node) {
                if (!node.alternate) return;

                // Skip if-else-if chains when allowElseIf is true
                if (allowElseIf && node.alternate.type === "IfStatement") return;

                // Check if the consequent always returns
                if (alwaysReturns(node.consequent)) {
                    context.report({
                        node: node.alternate,
                        message: "Unnecessary 'else' after 'return'.",
                    });
                }
            },
        };
    },
};

export default noElseReturnRule;
