function collectExportedBindings(ast) {
    const exportedNames = new Set();

    for (const statement of ast.body) {
        if (statement.type === "ExportNamedDeclaration") {
            for (const specifier of statement.specifiers) {
                exportedNames.add(specifier.local.name);
            }

            const declaration = statement.declaration;
            if (declaration) {
                collectDeclarationNames(declaration, exportedNames);
            }
        }

        if (statement.type === "ExportDefaultDeclaration") {
            const declaration = statement.declaration;

            if (
                declaration &&
                (declaration.type === "FunctionDeclaration" ||
                    declaration.type === "ClassDeclaration") &&
                declaration.id
            ) {
                exportedNames.add(declaration.id.name);
            }
        }
    }

    return exportedNames;
}

function collectDeclarationNames(node, names) {
    if (!node) {
        return;
    }

    if (node.type === "VariableDeclaration") {
        for (const declarator of node.declarations) {
            collectPatternNames(declarator.id, names);
        }
        return;
    }

    if (
        (node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") &&
        node.id
    ) {
        names.add(node.id.name);
    }
}

function collectPatternNames(pattern, names) {
    if (!pattern) {
        return;
    }

    switch (pattern.type) {
        case "Identifier":
            names.add(pattern.name);
            break;

        case "RestElement":
            collectPatternNames(pattern.argument, names);
            break;

        case "AssignmentPattern":
            collectPatternNames(pattern.left, names);
            break;

        case "ArrayPattern":
            for (const element of pattern.elements) {
                if (element) {
                    collectPatternNames(element, names);
                }
            }
            break;

        case "ObjectPattern":
            for (const property of pattern.properties) {
                if (property.type === "Property") {
                    collectPatternNames(property.value, names);
                } else if (property.type === "RestElement") {
                    collectPatternNames(property.argument, names);
                }
            }
            break;
    }
}

function isReadReference(reference) {
    return reference.isRead();
}

function isUsedVariable(variable, exportedNames) {
    if (variable.references.some(isReadReference)) {
        return true;
    }

    return exportedNames.has(variable.name);
}

function isParameter(variable) {
    return variable.defs.some(definition => definition.type === "Parameter");
}

function isCatchClauseVariable(variable) {
    return variable.defs.some(definition => definition.type === "CatchClause");
}

function shouldIgnoreVariable(variable) {
    if (variable.defs.length === 0) {
        return true;
    }

    return variable.name === "arguments";
}

function getFunctionParameterVariables(scope) {
    return scope.variables.filter(isParameter);
}

function getLastUsedParameterIndex(parameterVariables) {
    let lastUsedIndex = -1;

    for (let index = 0; index < parameterVariables.length; index++) {
        if (parameterVariables[index].references.some(isReadReference)) {
            lastUsedIndex = index;
        }
    }

    return lastUsedIndex;
}

function shouldReportUnusedParameter(variable, parameterVariables, lastUsedIndex) {
    const parameterIndex = parameterVariables.indexOf(variable);
    if (parameterIndex === -1) {
        return false;
    }

    return parameterIndex > lastUsedIndex;
}

const noUnusedVarsRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const exportedNames = collectExportedBindings(sourceCode.ast);

        return {
            "Program:exit"() {
                for (const scope of sourceCode.scopeManager.scopes) {
                    const parameterVariables = getFunctionParameterVariables(scope);
                    const lastUsedParameterIndex = getLastUsedParameterIndex(parameterVariables);

                    for (const variable of scope.variables) {
                        if (shouldIgnoreVariable(variable)) {
                            continue;
                        }

                        if (isUsedVariable(variable, exportedNames)) {
                            continue;
                        }

                        if (isParameter(variable)) {
                            if (!shouldReportUnusedParameter(variable, parameterVariables, lastUsedParameterIndex)) {
                                continue;
                            }
                        } else if (isCatchClauseVariable(variable)) {
                            continue;
                        }

                        const node = variable.identifiers[0] ?? variable.defs[0]?.name;
                        if (!node) {
                            continue;
                        }

                        context.report({
                            node,
                            message: "'{{name}}' is defined but never used.",
                            data: { name: variable.name },
                        });
                    }
                }
            },
        };
    },
};

export default noUnusedVarsRule;
