/**
 * no-unused-expressions — disallow unused expressions.
 * Adapted from ESLint's no-unused-expressions rule.
 */

function isAllowedShortCircuit(node, allowShortCircuit) {
    if (!allowShortCircuit) return false;
    return node.type === "LogicalExpression" && (node.operator === "||" || node.operator === "&&" || node.operator === "??");
}

function isAllowedTernary(node, allowTernary) {
    if (!allowTernary) return false;
    return node.type === "ConditionalExpression";
}

function isAllowedTaggedTemplateExpression(node, allowTaggedTemplates) {
    if (!allowTaggedTemplates) return false;
    return node.type === "TaggedTemplateExpression";
}

function isDirective(node) {
    // A string expression statement at the top of a script/function body is a directive
    if (node.type !== "ExpressionStatement") return false;
    const expr = node.expression;
    if (expr.type !== "Literal" || typeof expr.value !== "string") return false;
    // Parent must be a body array
    const parent = node.parent;
    if (!parent) return false;
    const body = parent.body || parent.consequent;
    if (!Array.isArray(body)) return false;
    // Must be at the beginning before any non-directive statements
    let i = 0;
    while (i < body.length && body[i] !== node) {
        if (body[i].type !== "ExpressionStatement" || !body[i].expression || body[i].expression.type !== "Literal") {
            return false;
        }
        i++;
    }
    return true;
}

function isUsefulExpression(node, opts) {
    const { allowShortCircuit, allowTernary, allowTaggedTemplates } = opts;

    if (node.type === "AssignmentExpression") return true;
    if (node.type === "AwaitExpression") return true;
    if (node.type === "CallExpression") return true;
    if (node.type === "ImportExpression") return true;
    if (node.type === "NewExpression") return true;
    if (node.type === "UpdateExpression") return true;
    if (node.type === "YieldExpression") return true;
    if (isAllowedShortCircuit(node, allowShortCircuit)) {
        // Recurse to check the right side
        return isUsefulExpression(node.right, opts);
    }
    if (isAllowedTernary(node, allowTernary)) {
        // Both branches must be useful
        return isUsefulExpression(node.consequent, opts) && isUsefulExpression(node.alternate, opts);
    }
    if (isAllowedTaggedTemplateExpression(node, allowTaggedTemplates)) return true;

    return false;
}

const noUnusedExpressionsRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    allowShortCircuit: { type: "boolean" },
                    allowTernary: { type: "boolean" },
                    allowTaggedTemplates: { type: "boolean" },
                    enforceForJSX: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const opts = {
            allowShortCircuit: context.options[0]?.allowShortCircuit ?? false,
            allowTernary: context.options[0]?.allowTernary ?? false,
            allowTaggedTemplates: context.options[0]?.allowTaggedTemplates ?? false,
        };

        return {
            ExpressionStatement(node) {
                // Skip directives
                if (isDirective(node)) return;
                const expr = node.expression;
                if (!isUsefulExpression(expr, opts)) {
                    context.report({
                        node,
                        message: "Expected an assignment or function call and instead saw an expression.",
                    });
                }
            },
        };
    },
};

export default noUnusedExpressionsRule;
