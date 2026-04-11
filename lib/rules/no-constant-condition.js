/**
 * no-constant-condition — disallow constant expressions in conditions.
 * Adapted from ESLint's no-constant-condition rule.
 */

import { isFunctionLike } from "./utils.js";
import {
    hasStaticTemplateText,
    isBuiltinConstantIdentifier,
    isUnshadowedGlobalName,
} from "./constant-eval.js";

function isConstantTemplateLiteral(node, sourceCode) {
    return node.expressions.every(expression => isConstantExpression(expression, sourceCode, false));
}

function hasYield(node) {
    if (!node || typeof node !== "object") {
        return false;
    }

    if (node.type === "YieldExpression") {
        return true;
    }

    // Yield in nested functions doesn't make the outer loop body suspend.
    if (isFunctionLike(node)) {
        return false;
    }

    for (const value of Object.values(node)) {
        if (!value) {
            continue;
        }

        if (Array.isArray(value)) {
            if (value.some(child => hasYield(child))) {
                return true;
            }
            continue;
        }

        if (typeof value === "object" && hasYield(value)) {
            return true;
        }
    }

    return false;
}

function isAlwaysNullish(node, sourceCode) {
    return (
        (node.type === "Literal" && node.value === null) ||
        (node.type === "Identifier" && isBuiltinConstantIdentifier(node, sourceCode) && node.name === "undefined")
    );
}

function getStaticValue(node, sourceCode) {
    if (!node) {
        return { resolved: false, value: undefined };
    }

    switch (node.type) {
        case "Literal":
            return { resolved: true, value: node.value };
        case "Identifier":
            if (!isBuiltinConstantIdentifier(node, sourceCode)) {
                return { resolved: false, value: undefined };
            }
            if (node.name === "undefined") {
                return { resolved: true, value: undefined };
            }
            if (node.name === "NaN") {
                return { resolved: true, value: Number.NaN };
            }
            return { resolved: true, value: Infinity };
        case "TemplateLiteral": {
            const parts = [];

            for (let i = 0; i < node.quasis.length; i += 1) {
                parts.push(node.quasis[i].value.cooked);

                if (i < node.expressions.length) {
                    const expressionValue = getStaticValue(node.expressions[i], sourceCode);

                    if (!expressionValue.resolved) {
                        return { resolved: false, value: undefined };
                    }
                    parts.push(String(expressionValue.value));
                }
            }

            return { resolved: true, value: parts.join("") };
        }
        case "ArrayExpression": {
            const elements = [];

            for (const element of node.elements) {
                if (element === null) {
                    elements.push(undefined);
                    continue;
                }

                if (element.type === "SpreadElement") {
                    const spreadValue = getStaticValue(element.argument, sourceCode);

                    if (!spreadValue.resolved || !Array.isArray(spreadValue.value)) {
                        return { resolved: false, value: undefined };
                    }

                    elements.push(...spreadValue.value);
                    continue;
                }

                const elementValue = getStaticValue(element, sourceCode);

                if (!elementValue.resolved) {
                    return { resolved: false, value: undefined };
                }

                elements.push(elementValue.value);
            }

            return { resolved: true, value: elements };
        }
        case "UnaryExpression": {
            if (node.operator === "void") {
                return { resolved: true, value: undefined };
            }

            if (node.operator === "typeof") {
                const argumentValue = getStaticValue(node.argument, sourceCode);

                if (!argumentValue.resolved) {
                    return { resolved: false, value: undefined };
                }

                return { resolved: true, value: typeof argumentValue.value };
            }

            const argumentValue = getStaticValue(node.argument, sourceCode);

            if (!argumentValue.resolved) {
                return { resolved: false, value: undefined };
            }

            switch (node.operator) {
                case "!":
                    return { resolved: true, value: !argumentValue.value };
                case "+":
                    // eslint-disable-next-line no-implicit-coercion
                    return { resolved: true, value: +argumentValue.value };
                case "-":
                    return { resolved: true, value: -argumentValue.value };
                case "~":
                    return { resolved: true, value: ~argumentValue.value };
                default:
                    return { resolved: false, value: undefined };
            }
        }
        case "BinaryExpression": {
            if (node.operator === "in" || node.operator === "instanceof") {
                return { resolved: false, value: undefined };
            }

            const leftValue = getStaticValue(node.left, sourceCode);
            const rightValue = getStaticValue(node.right, sourceCode);

            if (!leftValue.resolved || !rightValue.resolved) {
                return { resolved: false, value: undefined };
            }

            switch (node.operator) {
                case "==":
                    // eslint-disable-next-line eqeqeq
                    return { resolved: true, value: leftValue.value == rightValue.value };
                case "!=":
                    // eslint-disable-next-line eqeqeq
                    return { resolved: true, value: leftValue.value != rightValue.value };
                case "===":
                    return { resolved: true, value: leftValue.value === rightValue.value };
                case "!==":
                    return { resolved: true, value: leftValue.value !== rightValue.value };
                case "<":
                    return { resolved: true, value: leftValue.value < rightValue.value };
                case "<=":
                    return { resolved: true, value: leftValue.value <= rightValue.value };
                case ">":
                    return { resolved: true, value: leftValue.value > rightValue.value };
                case ">=":
                    return { resolved: true, value: leftValue.value >= rightValue.value };
                case "+":
                    return { resolved: true, value: leftValue.value + rightValue.value };
                case "-":
                    return { resolved: true, value: leftValue.value - rightValue.value };
                case "*":
                    return { resolved: true, value: leftValue.value * rightValue.value };
                case "/":
                    return { resolved: true, value: leftValue.value / rightValue.value };
                case "%":
                    return { resolved: true, value: leftValue.value % rightValue.value };
                default:
                    return { resolved: false, value: undefined };
            }
        }
        default:
            return { resolved: false, value: undefined };
    }
}

function getConstantTruthiness(node, sourceCode) {
    if (!node) {
        return null;
    }

    const staticValue = getStaticValue(node, sourceCode);

    if (staticValue.resolved) {
        return Boolean(staticValue.value);
    }

    switch (node.type) {
        case "Literal":
            return Boolean(node.value);
        case "Identifier":
            if (!isBuiltinConstantIdentifier(node, sourceCode)) {
                return null;
            }
            if (node.name === "undefined" || node.name === "NaN") {
                return false;
            }
            return true;
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "ClassExpression":
        case "NewExpression":
            return true;
        case "TemplateLiteral":
            if (node.expressions.length === 0) {
                return node.quasis[0].value.cooked !== "";
            }
            if (hasStaticTemplateText(node)) {
                return true;
            }
            if (node.expressions.every(expression => isConstantExpression(expression, sourceCode, false))) {
                return true;
            }
            return null;
        case "UnaryExpression": {
            const argumentTruthiness = getConstantTruthiness(node.argument, sourceCode);

            if (node.operator === "!") {
                return argumentTruthiness === null ? null : !argumentTruthiness;
            }

            if (node.operator === "void") {
                return false;
            }

            if (node.operator === "typeof") {
                return true;
            }

            return null;
        }
        case "LogicalExpression": {
            const leftTruthiness = getConstantTruthiness(node.left, sourceCode);
            const rightTruthiness = getConstantTruthiness(node.right, sourceCode);

            if (node.operator === "&&") {
                if (leftTruthiness === false) {
                    return false;
                }
                if (rightTruthiness === false) {
                    return false;
                }
                if (leftTruthiness === true) {
                    return rightTruthiness;
                }
                return null;
            }

            if (node.operator === "||") {
                if (leftTruthiness === true) {
                    return true;
                }
                if (rightTruthiness === true) {
                    return true;
                }
                if (leftTruthiness === false) {
                    return rightTruthiness;
                }
                return null;
            }

            if (node.operator === "??") {
                if (node.left.type === "Literal" && node.left.value === null) {
                    return rightTruthiness;
                }
                if (node.left.type === "Identifier" && node.left.name === "undefined") {
                    return rightTruthiness;
                }
                if (leftTruthiness !== null) {
                    return leftTruthiness;
                }
                return null;
            }

            return null;
        }
        case "AssignmentExpression": {
            const rightTruthiness = getConstantTruthiness(node.right, sourceCode);

            if (node.operator === "=") {
                return rightTruthiness;
            }

            if (node.operator === "||=") {
                if (rightTruthiness === true) {
                    return true;
                }
                return null;
            }

            if (node.operator === "&&=") {
                if (rightTruthiness === false) {
                    return false;
                }
                return null;
            }

            return null;
        }
        case "CallExpression":
            if (
                node.callee.type === "Identifier" &&
                isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node) &&
                !node.arguments.some(argument => argument.type === "SpreadElement")
            ) {
                if (node.arguments.length === 0) {
                    return false;
                }
                if (node.arguments.length === 1) {
                    return getConstantTruthiness(node.arguments[0], sourceCode);
                }
            }
            return null;
        default:
            return null;
    }
}

function isConstantExpression(node, sourceCode, inBooleanPosition = true) {
    if (!node) return false;

    if (inBooleanPosition && getConstantTruthiness(node, sourceCode) !== null) {
        return true;
    }

    switch (node.type) {
        case "Literal":
            return true;
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "ClassExpression":
        case "NewExpression":
            return inBooleanPosition;
        case "TemplateLiteral":
            return isConstantTemplateLiteral(node, sourceCode);
        case "Identifier":
            return isBuiltinConstantIdentifier(node, sourceCode);
        case "UnaryExpression":
            if (node.operator === "!") {
                return getConstantTruthiness(node.argument, sourceCode) !== null;
            }
            if (node.operator === "void") {
                return true;
            }
            return isConstantExpression(node.argument, sourceCode, false);
        case "BinaryExpression":
            // `in` depends on property lookup semantics and is not treated as a
            // constant condition by this rule's test suite.
            if (node.operator === "in") {
                return false;
            }
            return isConstantExpression(node.left, sourceCode, false) && isConstantExpression(node.right, sourceCode, false);
        case "LogicalExpression":
            if (node.operator === "&&") {
                const leftTruthiness = getConstantTruthiness(node.left, sourceCode);

                if (leftTruthiness === true) {
                    return isConstantExpression(node.right, sourceCode, false);
                }
                if (leftTruthiness === false) {
                    return isConstantExpression(node.left, sourceCode, false);
                }
                return false;
            }
            if (node.operator === "||") {
                const leftTruthiness = getConstantTruthiness(node.left, sourceCode);

                if (leftTruthiness === true) {
                    return isConstantExpression(node.left, sourceCode, false);
                }
                if (leftTruthiness === false) {
                    return isConstantExpression(node.right, sourceCode, false);
                }
                return false;
            }
            if (node.operator === "??") {
                if (isAlwaysNullish(node.left, sourceCode)) {
                    return isConstantExpression(node.right, sourceCode, false);
                }
                if (isConstantExpression(node.left, sourceCode, false)) {
                    return true;
                }
                return false;
            }
            return false;
        case "ConditionalExpression":
            return isConstantExpression(node.test, sourceCode);
        case "SequenceExpression":
            return isConstantExpression(node.expressions[node.expressions.length - 1], sourceCode);
        case "AssignmentExpression":
            if (node.operator === "=") {
                return isConstantExpression(node.right, sourceCode, true);
            }
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
        const hasExplicitCheckLoopsOption = Object.hasOwn(context.options[0] ?? {}, "checkLoops");
        const checkLoops = context.options[0]?.checkLoops ?? true;
        const sourceCode = context.sourceCode;

        function isAllowedConstantLoop(node) {
            let current = node;

            while (current) {
                if (current.type === "FunctionDeclaration" || current.type === "FunctionExpression") {
                    return current.generator && hasYield(node.body);
                }

                if (current.type === "ArrowFunctionExpression") {
                    return false;
                }

                current = current.parent;
            }

            return false;
        }

        function report(node) {
            context.report({
                node,
                message: "Unexpected constant condition.",
            });
        }

        return {
            IfStatement(node) {
                if (isConstantExpression(node.test, sourceCode)) {
                    report(node.test);
                }
            },
            ConditionalExpression(node) {
                if (isConstantExpression(node.test, sourceCode)) {
                    report(node.test);
                }
            },
            WhileStatement(node) {
                if (checkLoops === false || checkLoops === "none") return;
                if (checkLoops === "allExceptWhileTrue") {
                    if (node.test.type === "Literal" && node.test.value === true) return;
                }
                if (!hasExplicitCheckLoopsOption && checkLoops === true) {
                    if (node.test.type === "Literal" && node.test.value === true) return;
                }
                if (node.test.type === "Literal" && node.test.value === true && isAllowedConstantLoop(node)) {
                    return;
                }
                if (isConstantExpression(node.test, sourceCode)) {
                    report(node.test);
                }
            },
            DoWhileStatement(node) {
                if (checkLoops === false || checkLoops === "none") return;
                if (checkLoops === "allExceptWhileTrue") {
                    if (node.test.type === "Literal" && node.test.value === true) return;
                }
                if (node.test.type === "Literal" && node.test.value === true && isAllowedConstantLoop(node)) {
                    return;
                }
                if (isConstantExpression(node.test, sourceCode)) {
                    report(node.test);
                }
            },
            ForStatement(node) {
                if (checkLoops === false || checkLoops === "none") return;
                if (!node.test) return; // for (;;) is allowed
                if (node.test.type === "Literal" && node.test.value === true && isAllowedConstantLoop(node)) {
                    return;
                }
                if (isConstantExpression(node.test, sourceCode)) {
                    report(node.test);
                }
            },
        };
    },
};

export default noConstantConditionRule;
