import { getImplicitArgumentsVariable } from "./utils.js";

function isFunctionName(variable) {
    return variable?.defs?.[0]?.type === "FunctionName";
}

function checkMetaProperty(node, metaName, propertyName) {
    return node.meta.name === metaName && node.property.name === propertyName;
}

function getCallbackInfo(node) {
    const info = { isCallback: false, isLexicalThis: false };
    let currentNode = node;
    let parent = node.parent;
    let bound = false;

    while (currentNode && parent) {
        switch (parent.type) {
            case "LogicalExpression":
            case "ChainExpression":
            case "ConditionalExpression":
                break;

            case "MemberExpression":
                if (
                    parent.object === currentNode &&
                    parent.property?.type === "Identifier" &&
                    parent.property.name === "bind" &&
                    parent.computed === false &&
                    parent.parent?.type === "CallExpression" &&
                    parent.parent.callee === parent
                ) {
                    if (!bound) {
                        bound = true;
                        info.isLexicalThis =
                            parent.parent.arguments.length === 1 &&
                            parent.parent.arguments[0].type === "ThisExpression";
                    }

                    parent = parent.parent;
                } else {
                    return info;
                }
                break;

            case "CallExpression":
            case "NewExpression":
                if (parent.callee !== currentNode) {
                    info.isCallback = true;
                }
                return info;

            default:
                return info;
        }

        currentNode = parent;
        parent = parent.parent;
    }

    return info;
}

const preferArrowCallbackRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const option = context.options[0] ?? {};
        const allowNamedFunctions = option.allowNamedFunctions === true;
        const allowUnboundThis = option.allowUnboundThis !== false;
        let stack = [];

        function enterScope() {
            stack.push({ this: false, super: false, meta: false });
        }

        function exitScope() {
            return stack.pop() ?? { this: false, super: false, meta: false };
        }

        return {
            Program() {
                stack = [];
            },

            ThisExpression() {
                const info = stack.at(-1);
                if (info) {
                    info.this = true;
                }
            },

            Super() {
                const info = stack.at(-1);
                if (info) {
                    info.super = true;
                }
            },

            MetaProperty(node) {
                const info = stack.at(-1);
                if (info && checkMetaProperty(node, "new", "target")) {
                    info.meta = true;
                }
            },

            FunctionDeclaration: enterScope,
            "FunctionDeclaration:exit": exitScope,
            ArrowFunctionExpression: enterScope,
            "ArrowFunctionExpression:exit": exitScope,
            FunctionExpression: enterScope,
            "FunctionExpression:exit"(node) {
                const scopeInfo = exitScope();

                if (allowNamedFunctions && node.id?.name) {
                    return;
                }

                if (node.generator) {
                    return;
                }

                const nameVariable = sourceCode.getDeclaredVariables(node)[0];
                if (isFunctionName(nameVariable) && nameVariable.references.length > 0) {
                    return;
                }

                const argumentsVariable = getImplicitArgumentsVariable(sourceCode.getScope(node));
                if (argumentsVariable && argumentsVariable.references.length > 0) {
                    return;
                }

                const callbackInfo = getCallbackInfo(node);
                if (!callbackInfo.isCallback) {
                    return;
                }

                const supportsThisRequirement =
                    !allowUnboundThis || !scopeInfo.this || callbackInfo.isLexicalThis;

                if (!supportsThisRequirement || scopeInfo.super || scopeInfo.meta) {
                    return;
                }

                context.report({
                    node,
                    message: "Unexpected function expression.",
                });
            },
        };
    },
};

export default preferArrowCallbackRule;
