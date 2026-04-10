/**
 * no-constant-binary-expression — disallow expressions where the operation doesn't change the value.
 * Adapted from ESLint's no-constant-binary-expression rule.
 */

function getInnermostScope(sourceCode, node) {
    let bestScope = sourceCode.scopeManager.globalScope;
    const nodeStart = node.range ? node.range[0] : node.start;
    const nodeEnd = node.range ? node.range[1] : node.end;

    for (const scope of sourceCode.scopeManager.scopes) {
        const block = scope.block;

        if (!block) {
            continue;
        }

        const blockStart = block.range ? block.range[0] : block.start;
        const blockEnd = block.range ? block.range[1] : block.end;

        if (blockStart <= nodeStart && blockEnd >= nodeEnd) {
            const bestBlock = bestScope.block;
            const bestStart = bestBlock?.range ? bestBlock.range[0] : bestBlock?.start ?? 0;
            const bestEnd = bestBlock?.range ? bestBlock.range[1] : bestBlock?.end ?? Infinity;
            const currentSize = blockEnd - blockStart;
            const bestSize = bestEnd - bestStart;

            if (
                currentSize < bestSize ||
                (currentSize === bestSize && scope !== sourceCode.scopeManager.globalScope)
            ) {
                bestScope = scope;
            }
        }
    }

    return bestScope;
}

function isBuiltinConstantIdentifier(node, sourceCode) {
    if (!node || node.type !== "Identifier") {
        return false;
    }

    let scope = getInnermostScope(sourceCode, node);

    while (scope) {
        if (scope.variables.some(candidate => candidate.name === node.name && candidate.identifiers.length > 0)) {
            return false;
        }

        scope = scope.upper;
    }

    return node.name === "undefined" || node.name === "NaN" || node.name === "Infinity";
}

function isUnshadowedGlobalName(node, sourceCode, name, referenceNode = node) {
    if (!node || node.type !== "Identifier" || node.name !== name) {
        return false;
    }

    let scope = getInnermostScope(sourceCode, referenceNode);

    while (scope) {
        if (scope.variables.some(candidate => candidate.name === name && candidate.identifiers.length > 0)) {
            return false;
        }

        scope = scope.upper;
    }

    return true;
}

function isStaticTemplateLiteral(node) {
    return node.type === "TemplateLiteral" && node.expressions.length === 0;
}

function hasStaticTemplateText(node) {
    return node.type === "TemplateLiteral" && node.quasis.some(quasi => quasi.value.cooked !== "");
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
        case "TemplateLiteral":
            if (!isStaticTemplateLiteral(node)) {
                return { resolved: false, value: undefined };
            }
            return { resolved: true, value: node.quasis[0].value.cooked };
        case "ArrayExpression": {
            const elements = [];

            for (const element of node.elements) {
                if (element === null || element.type === "SpreadElement") {
                    return { resolved: false, value: undefined };
                }

                const elementValue = getStaticValue(element, sourceCode);

                if (!elementValue.resolved) {
                    return { resolved: false, value: undefined };
                }

                elements.push(elementValue.value);
            }

            return { resolved: true, value: elements };
        }
        case "ObjectExpression":
            if (node.properties.length === 0) {
                return { resolved: true, value: {} };
            }
            return { resolved: false, value: undefined };
        case "UnaryExpression": {
            if (node.operator === "void") {
                return { resolved: true, value: undefined };
            }
            if (node.operator === "typeof") {
                return { resolved: false, value: undefined };
            }

            const argumentValue = getStaticValue(node.argument, sourceCode);

            if (!argumentValue.resolved) {
                return { resolved: false, value: undefined };
            }

            switch (node.operator) {
                case "!":
                    return { resolved: true, value: !argumentValue.value };
                case "+":
                    return { resolved: true, value: +argumentValue.value };
                case "-":
                    return { resolved: true, value: -argumentValue.value };
                case "~":
                    return { resolved: true, value: ~argumentValue.value };
                default:
                    return { resolved: false, value: undefined };
            }
        }
        case "SequenceExpression":
            return getStaticValue(node.expressions[node.expressions.length - 1], sourceCode);
        case "AssignmentExpression":
            if (node.operator === "=") {
                return getStaticValue(node.right, sourceCode);
            }
            return { resolved: false, value: undefined };
        case "CallExpression":
            if (
                node.callee.type === "Identifier" &&
                isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node) &&
                !node.arguments.some(argument => argument.type === "SpreadElement")
            ) {
                if (node.arguments.length === 0) {
                    return { resolved: true, value: false };
                }
                if (node.arguments.length >= 1) {
                    const truthiness = getConstantTruthiness(node.arguments[0], sourceCode);

                    if (truthiness !== null) {
                        return { resolved: true, value: truthiness };
                    }
                }
            }
            return { resolved: false, value: undefined };
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
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "ClassExpression":
        case "NewExpression":
            return true;
        case "TemplateLiteral":
            if (isStaticTemplateLiteral(node)) {
                return node.quasis[0].value.cooked !== "";
            }
            if (hasStaticTemplateText(node)) {
                return true;
            }
            return null;
        case "UnaryExpression":
            if (node.operator === "!") {
                const argumentTruthiness = getConstantTruthiness(node.argument, sourceCode);
                return argumentTruthiness === null ? null : !argumentTruthiness;
            }
            if (node.operator === "void") {
                return false;
            }
            if (node.operator === "typeof") {
                return true;
            }
            return null;
        case "CallExpression":
            if (
                node.callee.type === "Identifier" &&
                isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node) &&
                !node.arguments.some(argument => argument.type === "SpreadElement")
            ) {
                if (node.arguments.length === 0) {
                    return false;
                }
                if (node.arguments.length >= 1) {
                    return getConstantTruthiness(node.arguments[0], sourceCode);
                }
            }
            return null;
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
                if (isAlwaysNullish(node.left, sourceCode)) {
                    return rightTruthiness;
                }
                if (isNeverNullish(node.left, sourceCode)) {
                    return leftTruthiness;
                }
                return null;
            }

            return null;
        }
        default:
            return null;
    }
}

function isAlwaysNullish(node, sourceCode) {
    if (!node) {
        return false;
    }

    const staticValue = getStaticValue(node, sourceCode);

    if (staticValue.resolved) {
        return staticValue.value == null;
    }

    if (node.type === "UnaryExpression" && node.operator === "void") {
        return true;
    }

    if (node.type === "LogicalExpression" && node.operator === "??") {
        return (
            isAlwaysNullish(node.left, sourceCode) &&
            isAlwaysNullish(node.right, sourceCode)
        );
    }

    return false;
}

function isNeverNullish(node, sourceCode) {
    if (!node) {
        return false;
    }

    const staticValue = getStaticValue(node, sourceCode);

    if (staticValue.resolved) {
        return staticValue.value != null;
    }

    switch (node.type) {
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "ClassExpression":
        case "NewExpression":
        case "UpdateExpression":
            return true;
        case "Literal":
            return node.value !== null;
        case "TemplateLiteral":
            return true;
        case "UnaryExpression":
            return node.operator !== "void";
        case "BinaryExpression":
            return true;
        case "CallExpression":
            if (
                node.callee.type === "Identifier" &&
                (
                    isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node) ||
                    isUnshadowedGlobalName(node.callee, sourceCode, "String", node) ||
                    isUnshadowedGlobalName(node.callee, sourceCode, "Number", node)
                )
            ) {
                return true;
            }
            return false;
        case "AssignmentExpression":
            if (node.operator === "=") {
                return isNeverNullish(node.right, sourceCode);
            }
            return true;
        case "SequenceExpression":
            return isNeverNullish(node.expressions[node.expressions.length - 1], sourceCode);
        case "ConditionalExpression":
            return (
                isNeverNullish(node.consequent, sourceCode) &&
                isNeverNullish(node.alternate, sourceCode)
            );
        case "LogicalExpression":
            if (node.operator === "??") {
                return (
                    isNeverNullish(node.left, sourceCode) ||
                    isNeverNullish(node.right, sourceCode)
                );
            }
            return false;
        default:
            return false;
    }
}

function isAlwaysBoolean(node, sourceCode) {
    if (!node) {
        return false;
    }

    const staticValue = getStaticValue(node, sourceCode);

    if (staticValue.resolved) {
        return typeof staticValue.value === "boolean";
    }

    switch (node.type) {
        case "UnaryExpression":
            return node.operator === "!" || node.operator === "delete";
        case "BinaryExpression":
            return [
                "==",
                "!=",
                "===",
                "!==",
                "<",
                "<=",
                ">",
                ">=",
                "in",
                "instanceof",
            ].includes(node.operator);
        case "LogicalExpression":
            return false;
        case "CallExpression":
            return (
                node.callee.type === "Identifier" &&
                isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node)
            );
        default:
            return false;
    }
}

function isDefinitelyNonBoolean(node, sourceCode) {
    if (!node) {
        return false;
    }

    const staticValue = getStaticValue(node, sourceCode);

    if (staticValue.resolved) {
        return typeof staticValue.value !== "boolean";
    }

    switch (node.type) {
        case "ArrayExpression":
        case "ObjectExpression":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
        case "ClassExpression":
        case "NewExpression":
            return true;
        case "Literal":
            return typeof node.value !== "boolean";
        case "TemplateLiteral":
            return true;
        case "UnaryExpression":
            return node.operator !== "!" && node.operator !== "delete";
        case "UpdateExpression":
            return true;
        case "BinaryExpression":
            return ![
                "==",
                "!=",
                "===",
                "!==",
                "<",
                "<=",
                ">",
                ">=",
                "in",
                "instanceof",
            ].includes(node.operator);
        case "AssignmentExpression":
            if (node.operator === "=") {
                return isDefinitelyNonBoolean(node.right, sourceCode);
            }
            return true;
        case "SequenceExpression":
            return isDefinitelyNonBoolean(node.expressions[node.expressions.length - 1], sourceCode);
        case "ConditionalExpression":
            return (
                isDefinitelyNonBoolean(node.consequent, sourceCode) &&
                isDefinitelyNonBoolean(node.alternate, sourceCode)
            );
        case "CallExpression":
            if (
                node.callee.type === "Identifier" &&
                (
                    isUnshadowedGlobalName(node.callee, sourceCode, "String", node) ||
                    isUnshadowedGlobalName(node.callee, sourceCode, "Number", node)
                )
            ) {
                return true;
            }
            return false;
        default:
            return false;
    }
}

function isKnownFreshObjectConstruction(node, sourceCode) {
    return (
        node.type === "NewExpression" &&
        node.callee.type === "Identifier" &&
        (
            isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node) ||
            isUnshadowedGlobalName(node.callee, sourceCode, "Promise", node) ||
            isUnshadowedGlobalName(node.callee, sourceCode, "WeakSet", node)
        )
    );
}

function isDefinitelyFreshObject(node, sourceCode, oppositeNode = null) {
    if (!node) {
        return false;
    }

    if (
        node.type === "ObjectExpression" ||
        node.type === "ArrayExpression" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "ClassExpression"
    ) {
        return true;
    }

    if (node.type === "Literal" && node.regex) {
        return true;
    }

    if (isKnownFreshObjectConstruction(node, sourceCode)) {
        return true;
    }

    if (node.type === "SequenceExpression") {
        return isDefinitelyFreshObject(node.expressions[node.expressions.length - 1], sourceCode, oppositeNode);
    }

    if (node.type === "ConditionalExpression") {
        return (
            isDefinitelyFreshObject(node.consequent, sourceCode, oppositeNode) &&
            isDefinitelyFreshObject(node.alternate, sourceCode, oppositeNode)
        );
    }

    if (node.type === "AssignmentExpression" && node.operator === "=") {
        return isDefinitelyFreshObject(node.right, sourceCode, oppositeNode);
    }

    return false;
}

function isBooleanLiteral(node, sourceCode) {
    const staticValue = getStaticValue(node, sourceCode);
    return staticValue.resolved && typeof staticValue.value === "boolean";
}

function isNullishLiteral(node, sourceCode) {
    const staticValue = getStaticValue(node, sourceCode);
    return staticValue.resolved && staticValue.value == null;
}

function hasConstantLooseBooleanComparison(node, booleanValue, sourceCode) {
    const staticValue = getStaticValue(node, sourceCode);

    if (staticValue.resolved) {
        return staticValue.value == booleanValue;
    }

    if (
        node.type === "ObjectExpression" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "ClassExpression" ||
        (node.type === "Literal" && node.regex)
    ) {
        return false;
    }

    if (node.type === "ArrayExpression") {
        if (node.elements.length === 0) {
            return [] == booleanValue;
        }

        if (
            node.elements.length >= 2 &&
            node.elements.every(element => element && element.type !== "SpreadElement")
        ) {
            return false;
        }

        return null;
    }

    if (node.type === "UnaryExpression" && node.operator === "typeof") {
        return false;
    }

    if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        isUnshadowedGlobalName(node.callee, sourceCode, "Boolean", node)
    ) {
        const evaluated = getStaticValue(node, sourceCode);
        return evaluated.resolved ? evaluated.value == booleanValue : null;
    }

    if (node.type === "SequenceExpression") {
        return hasConstantLooseBooleanComparison(
            node.expressions[node.expressions.length - 1],
            booleanValue,
            sourceCode,
        );
    }

    if (node.type === "AssignmentExpression" && node.operator === "=") {
        return hasConstantLooseBooleanComparison(node.right, booleanValue, sourceCode);
    }

    return null;
}

function report(node, context, message) {
    context.report({ node, message });
}

function isComparisonOperator(operator) {
    return [
        "==",
        "!=",
        "===",
        "!==",
        "<",
        "<=",
        ">",
        ">=",
    ].includes(operator);
}

const noConstantBinaryExpressionRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        const sourceCode = context.sourceCode;

        return {
            LogicalExpression(node) {
                const { operator, left } = node;

                if (operator === "&&") {
                    const truthiness = getConstantTruthiness(left, sourceCode);

                    if (truthiness === false) {
                        report(node, context, "Unexpected constant condition. The expression is always falsy.");
                    } else if (truthiness === true) {
                        report(node, context, "Unexpected constant condition. The left operand is always truthy.");
                    }
                } else if (operator === "||") {
                    const truthiness = getConstantTruthiness(left, sourceCode);

                    if (truthiness === true) {
                        report(node, context, "Unexpected constant condition. The left operand is always truthy.");
                    } else if (truthiness === false) {
                        report(node, context, "Unexpected constant condition. The expression always evaluates to the right operand.");
                    }
                } else if (operator === "??") {
                    if (isAlwaysNullish(left, sourceCode)) {
                        report(node, context, "Unexpected constant nullishness. The left operand is always nullish.");
                    } else if (isNeverNullish(left, sourceCode)) {
                        report(node, context, "Unexpected constant nullishness. The left operand is never nullish.");
                    }
                }
            },

            BinaryExpression(node) {
                const { operator, left, right } = node;
                const leftStatic = getStaticValue(left, sourceCode);
                const rightStatic = getStaticValue(right, sourceCode);

                if (isComparisonOperator(operator) && leftStatic.resolved && rightStatic.resolved) {
                    report(node, context, "Unexpected constant binary expression.");
                    return;
                }

                if (operator === "===" || operator === "!==") {
                    if (
                        isDefinitelyFreshObject(left, sourceCode, right) ||
                        isDefinitelyFreshObject(right, sourceCode, left)
                    ) {
                        report(
                            node,
                            context,
                            `Unexpected constant condition. Comparisons with newly created objects using '${operator}' are always ${operator === "===" ? "false" : "true"}.`,
                        );
                        return;
                    }

                    if (
                        (isNullishLiteral(left, sourceCode) && isNeverNullish(right, sourceCode)) ||
                        (isNullishLiteral(right, sourceCode) && isNeverNullish(left, sourceCode))
                    ) {
                        report(node, context, "Unexpected constant condition. This strict comparison is always constant.");
                        return;
                    }

                    if (
                        (isBooleanLiteral(left, sourceCode) && isDefinitelyNonBoolean(right, sourceCode)) ||
                        (isBooleanLiteral(right, sourceCode) && isDefinitelyNonBoolean(left, sourceCode))
                    ) {
                        report(node, context, "Unexpected constant condition. This strict boolean comparison is always constant.");
                    }

                    return;
                }

                if (operator === "==" || operator === "!=") {
                    if (
                        (isNullishLiteral(left, sourceCode) && isNeverNullish(right, sourceCode)) ||
                        (isNullishLiteral(right, sourceCode) && isNeverNullish(left, sourceCode))
                    ) {
                        report(node, context, "Unexpected constant condition. This loose nullish comparison is always constant.");
                        return;
                    }

                    if (
                        isDefinitelyFreshObject(left, sourceCode, right) &&
                        isDefinitelyFreshObject(right, sourceCode, left)
                    ) {
                        report(node, context, "Unexpected constant condition. Both sides are newly created objects.");
                        return;
                    }

                    if (isAlwaysBoolean(left, sourceCode)) {
                        const result = hasConstantLooseBooleanComparison(right, leftStatic.resolved ? leftStatic.value : null, sourceCode);

                        if (result !== null) {
                            report(node, context, "Unexpected constant condition. This loose boolean comparison is always constant.");
                            return;
                        }
                    }

                    if (isAlwaysBoolean(right, sourceCode)) {
                        const result = hasConstantLooseBooleanComparison(left, rightStatic.resolved ? rightStatic.value : null, sourceCode);

                        if (result !== null) {
                            report(node, context, "Unexpected constant condition. This loose boolean comparison is always constant.");
                        }
                    }
                }
            },
        };
    },
};

export default noConstantBinaryExpressionRule;
