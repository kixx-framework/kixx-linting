export function getStaticPropertyName(node) {
    if (node.type !== "MemberExpression") {
        return null;
    }

    if (!node.computed && node.property.type === "Identifier") {
        return node.property.name;
    }

    if (node.computed && node.property.type === "Literal" && typeof node.property.value === "string") {
        return node.property.value;
    }

    if (
        node.computed &&
        node.property.type === "TemplateLiteral" &&
        node.property.expressions.length === 0
    ) {
        return node.property.quasis[0]?.value?.cooked ?? null;
    }

    return null;
}

export function isFunctionLike(node) {
    return (
        node?.type === "FunctionDeclaration" ||
        node?.type === "FunctionExpression" ||
        node?.type === "ArrowFunctionExpression"
    );
}

export function isNodeInScopeBlock(scope, node) {
    const block = scope.block;
    if (!block) {
        return false;
    }

    return block.start <= node.start && block.end >= node.end;
}

export function hasShadowingDefinition(sourceCode, node, name, { includeGlobal = true } = {}) {
    return sourceCode.scopeManager.scopes.some(scope =>
        isNodeInScopeBlock(scope, node) &&
        (includeGlobal || scope.type !== "global") &&
        scope.variables.some(variable => variable.name === name && variable.defs.length > 0),
    );
}

export function getImplicitArgumentsVariable(scope) {
    for (const variable of scope.variables) {
        if (variable.name === "arguments") {
            return variable.identifiers.length === 0 ? variable : null;
        }
    }

    return null;
}

export function getGlobalVariable(scope, name) {
    let current = scope;

    while (current?.upper) {
        current = current.upper;
    }

    return current?.variables.find(variable => variable.name === name) ?? null;
}
