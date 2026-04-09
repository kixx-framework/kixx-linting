import { getStaticPropertyName } from "./utils.js";

const VALID_RADIX_VALUES = new Set(Array.from({ length: 35 }, (_, index) => index + 2));

function parseDirectiveGlobals(sourceCode) {
    const result = new Map();

    for (const comment of sourceCode.getAllComments()) {
        if (comment.type !== "Block") {
            continue;
        }

        const match = /^\s*globals?\s+([\s\S]*)$/iu.exec(comment.value);
        if (!match) {
            continue;
        }

        for (const item of match[1].split(",")) {
            const declaration = item.trim();
            if (!declaration) {
                continue;
            }

            const [nameRaw, valueRaw = ""] = declaration.split(":");
            const name = nameRaw.trim();
            const value = valueRaw.trim().toLowerCase();

            if (!name) {
                continue;
            }

            result.set(name, value);
        }
    }

    return result;
}

function resolveVariableForIdentifier(sourceCode, identifierNode) {
    let scope = sourceCode.getScope(identifierNode);

    while (scope) {
        const reference = scope.references.find(ref => ref.identifier === identifierNode);
        if (reference?.resolved) {
            return reference.resolved;
        }
        scope = scope.upper;
    }

    return null;
}

function getChainTarget(node) {
    if (node.type !== "ChainExpression") {
        return node;
    }

    if (node.expression.type === "CallExpression") {
        return node.expression.callee;
    }

    return node.expression;
}

function isValidRadix(node) {
    return !(
        (node.type === "Literal" && !VALID_RADIX_VALUES.has(node.value)) ||
        (node.type === "Identifier" && node.name === "undefined")
    );
}

function isEnabledGlobalIdentifier(sourceCode, configuredGlobals, directiveGlobals, identifierNode) {
    const variable = resolveVariableForIdentifier(sourceCode, identifierNode);
    if (variable?.defs.length) {
        return false;
    }

    if (configuredGlobals[identifierNode.name] === "off") {
        return false;
    }

    return directiveGlobals.get(identifierNode.name) !== "off";
}

function isParseIntCall(sourceCode, configuredGlobals, directiveGlobals, node) {
    const callee = getChainTarget(node.callee);

    if (callee.type === "Identifier") {
        return callee.name === "parseInt" && isEnabledGlobalIdentifier(sourceCode, configuredGlobals, directiveGlobals, callee);
    }

    return (
        callee.type === "MemberExpression" &&
        callee.object.type === "Identifier" &&
        callee.object.name === "Number" &&
        getStaticPropertyName(callee) === "parseInt" &&
        isEnabledGlobalIdentifier(sourceCode, configuredGlobals, directiveGlobals, callee.object)
    );
}

const radixRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const configuredGlobals = context.languageOptions?.globals ?? {};
        const directiveGlobals = parseDirectiveGlobals(sourceCode);

        return {
            CallExpression(node) {
                if (!isParseIntCall(sourceCode, configuredGlobals, directiveGlobals, node)) {
                    return;
                }

                if (node.arguments.length === 0) {
                    context.report({
                        node,
                        message: "Missing parameters.",
                    });
                    return;
                }

                if (node.arguments.length === 1) {
                    context.report({
                        node,
                        message: "Missing radix parameter.",
                    });
                    return;
                }

                if (!isValidRadix(node.arguments[1])) {
                    context.report({
                        node,
                        message: "Invalid radix parameter, must be an integer between 2 and 36.",
                    });
                }
            },
        };
    },
};

export default radixRule;
