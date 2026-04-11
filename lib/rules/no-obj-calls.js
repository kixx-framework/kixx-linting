import { getStaticPropertyName } from "./utils.js";

const NON_CALLABLE_GLOBALS = new Set(["Atomics", "JSON", "Math", "Reflect", "Intl", "Temporal"]);
const GLOBAL_MIN_ECMA = {
    Math: 5,
    JSON: 5,
    Reflect: 6,
    Intl: 2015,
    Atomics: 2017,
    Temporal: 2026,
    globalThis: 2020,
};

function scopeContainsNode(scope, node) {
    const block = scope.block;
    if (!block) {
        return false;
    }

    const blockStart = block.start;
    const blockEnd = block.end;
    const nodeStart = node.start;
    const nodeEnd = node.end;

    return blockStart <= nodeStart && blockEnd >= nodeEnd;
}

function hasShadowedDefinition(sourceCode, node, name) {
    return sourceCode.scopeManager.scopes.some(scope =>
        scopeContainsNode(scope, node) &&
        scope.variables.some(variable => variable.name === name && variable.defs.length > 0),
    );
}

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

const noObjCallsRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const configuredGlobals = context.languageOptions?.globals ?? {};
        const directiveGlobals = parseDirectiveGlobals(sourceCode);
        const ecmaVersion = Number(context.languageOptions?.ecmaVersion ?? 2024);

        function isEnabledGlobalName(name, referenceNode) {
            if (hasShadowedDefinition(sourceCode, referenceNode, name)) {
                return false;
            }

            if (configuredGlobals[name] === "off") {
                return false;
            }

            const directiveValue = directiveGlobals.get(name);
            if (directiveValue === "off") {
                return false;
            }

            if (Object.prototype.hasOwnProperty.call(configuredGlobals, name)) {
                return true;
            }

            if (directiveGlobals.has(name)) {
                return true;
            }

            const minEcma = GLOBAL_MIN_ECMA[name];
            if (typeof minEcma === "number") {
                return ecmaVersion >= minEcma;
            }

            return false;
        }

        function evaluateAsNonCallableGlobal(node, seenVariables = new Set()) {
            if (!node || typeof node !== "object") {
                return null;
            }

            if (node.type === "ChainExpression") {
                return evaluateAsNonCallableGlobal(getChainTarget(node), seenVariables);
            }

            if (node.type === "SequenceExpression") {
                const last = node.expressions[node.expressions.length - 1];
                return evaluateAsNonCallableGlobal(last, seenVariables);
            }

            if (node.type === "ConditionalExpression") {
                return (
                    evaluateAsNonCallableGlobal(node.consequent, seenVariables) ??
                    evaluateAsNonCallableGlobal(node.alternate, seenVariables)
                );
            }

            if (node.type === "Identifier") {
                if (NON_CALLABLE_GLOBALS.has(node.name) && isEnabledGlobalName(node.name, node)) {
                    return node.name;
                }

                const variable = resolveVariableForIdentifier(sourceCode, node);
                if (!variable || seenVariables.has(variable)) {
                    return null;
                }

                seenVariables.add(variable);

                if (variable.defs.length === 0) {
                    return null;
                }

                for (const def of variable.defs) {
                    if (def.type !== "Variable" || !def.node?.init) {
                        return null;
                    }

                    const resolved = evaluateAsNonCallableGlobal(def.node.init, seenVariables);
                    if (!resolved) {
                        return null;
                    }
                }

                return variable.defs.length > 0
                    ? evaluateAsNonCallableGlobal(variable.defs[0].node.init, seenVariables)
                    : null;
            }

            if (node.type === "MemberExpression") {
                const propertyName = getStaticPropertyName(node);
                if (!propertyName || !NON_CALLABLE_GLOBALS.has(propertyName)) {
                    return null;
                }

                const object = getChainTarget(node.object);

                if (
                    object.type === "Identifier" &&
                    (object.name === "globalThis" || object.name === "window") &&
                    isEnabledGlobalName(object.name, object) &&
                    isEnabledGlobalName(propertyName, node)
                ) {
                    return propertyName;
                }
            }

            return null;
        }

        function checkNode(node) {
            let current = node.parent;
            while (current) {
                if (current.type === "CallExpression" || current.type === "NewExpression") {
                    const ancestorName = evaluateAsNonCallableGlobal(getChainTarget(current.callee));
                    if (ancestorName) {
                        return;
                    }
                }
                current = current.parent;
            }

            const callee = getChainTarget(node.callee);
            const resolvedName = evaluateAsNonCallableGlobal(callee);

            if (!resolvedName) {
                return;
            }

            context.report({
                node,
                message: "'{{name}}' is not a function.",
                data: { name: resolvedName },
            });
        }

        return {
            CallExpression: checkNode,
            NewExpression: checkNode,
        };
    },
};

export default noObjCallsRule;
