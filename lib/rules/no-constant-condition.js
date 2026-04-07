/**
 * no-constant-condition — disallow constant expressions in conditions.
 * Adapted from ESLint's no-constant-condition rule.
 */

function isConstantExpression(node) {
    if (!node) return false;
    switch (node.type) {
        case "Literal":
            return true;
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "ClassExpression":
        case "NewExpression":
            return true;
        case "TemplateLiteral":
            // Template literal with no expressions is constant
            return node.expressions.length === 0;
        case "Identifier":
            // undefined, NaN, Infinity are effectively constant
            return node.name === "undefined" || node.name === "NaN" || node.name === "Infinity";
        case "UnaryExpression":
            return isConstantExpression(node.argument);
        case "BinaryExpression":
            return isConstantExpression(node.left) && isConstantExpression(node.right);
        case "LogicalExpression":
            return isConstantExpression(node.left) && isConstantExpression(node.right);
        case "ConditionalExpression":
            return isConstantExpression(node.test);
        case "SequenceExpression":
            return isConstantExpression(node.expressions[node.expressions.length - 1]);
        case "AssignmentExpression":
            return false;
        default:
            return false;
    }
}

const noConstantConditionRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    checkLoops: {
                        oneOf: [
                            { type: "boolean" },
                            { enum: ["all", "allExceptWhileTrue", "none"] },
                        ],
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const checkLoops = context.options[0]?.checkLoops ?? true;

        function report(node) {
            context.report({
                node,
                message: "Unexpected constant condition.",
            });
        }

        return {
            IfStatement(node) {
                if (isConstantExpression(node.test)) {
                    report(node.test);
                }
            },
            ConditionalExpression(node) {
                if (isConstantExpression(node.test)) {
                    report(node.test);
                }
            },
            WhileStatement(node) {
                if (checkLoops === false || checkLoops === "none") return;
                if (checkLoops === "allExceptWhileTrue" || checkLoops === true) {
                    if (node.test.type === "Literal" && node.test.value === true) return;
                }
                if (isConstantExpression(node.test)) {
                    report(node.test);
                }
            },
            DoWhileStatement(node) {
                if (checkLoops === false || checkLoops === "none") return;
                if (checkLoops === "allExceptWhileTrue") {
                    if (node.test.type === "Literal" && node.test.value === true) return;
                }
                if (isConstantExpression(node.test)) {
                    report(node.test);
                }
            },
            ForStatement(node) {
                if (checkLoops === false || checkLoops === "none") return;
                if (!node.test) return; // for (;;) is allowed
                if (isConstantExpression(node.test)) {
                    report(node.test);
                }
            },
        };
    },
};

export default noConstantConditionRule;
