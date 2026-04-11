function isDeclarationWrite(variable, reference) {
    return variable.defs.some(def => def.name === reference.identifier);
}

function getReferenceKey(reference) {
    return `${reference.identifier.range[0]}:${reference.identifier.range[1]}`;
}

export function reportVariableReassignments(context, node, { isTargetVariable, buildMessage }) {
    const scope = context.sourceCode.getScope(node);
    const reported = new Set();

    function reportWriteReferences(variable) {
        for (const reference of variable.references) {
            if (!reference.isWrite() || isDeclarationWrite(variable, reference)) continue;

            const key = getReferenceKey(reference);
            if (reported.has(key)) continue;
            reported.add(key);

            context.report({
                node: reference.identifier,
                message: buildMessage(variable),
            });
        }
    }

    function checkScope(currentScope) {
        for (const variable of currentScope.variables) {
            if (isTargetVariable(variable, currentScope)) {
                reportWriteReferences(variable);
            }
        }

        for (const childScope of currentScope.childScopes) {
            checkScope(childScope);
        }
    }

    checkScope(scope);
}
