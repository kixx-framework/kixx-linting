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

    return null;
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
