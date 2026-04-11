const BUILTIN_CONSTANT_NAMES = new Set(["undefined", "NaN", "Infinity"]);

function hasLocalDefinition(scope, name) {
    return scope.variables.some(candidate => {
        return candidate.name === name && candidate.identifiers.length > 0;
    });
}

function isUnshadowedName(sourceCode, name, referenceNode) {
    let scope = sourceCode.getScope(referenceNode);

    while (scope) {
        if (hasLocalDefinition(scope, name)) {
            return false;
        }

        scope = scope.upper;
    }

    return true;
}

export function isBuiltinConstantIdentifier(node, sourceCode) {
    if (!node || node.type !== "Identifier" || !BUILTIN_CONSTANT_NAMES.has(node.name)) {
        return false;
    }

    return !sourceCode || isUnshadowedName(sourceCode, node.name, node);
}

export function isUnshadowedGlobalName(node, sourceCode, name, referenceNode = node) {
    if (!sourceCode || !node || node.type !== "Identifier" || node.name !== name) {
        return false;
    }

    return isUnshadowedName(sourceCode, name, referenceNode);
}

export function isStaticTemplateLiteral(node) {
    return node.type === "TemplateLiteral" && node.expressions.length === 0;
}

export function hasStaticTemplateText(node) {
    return node.type === "TemplateLiteral" && node.quasis.some(quasi => quasi.value.cooked !== "");
}
