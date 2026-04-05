function parseOptions(options) {
    if (typeof options === "object" && options !== null) {
        return {
            functions: options.functions ?? true,
            classes: options.classes ?? true,
            variables: options.variables ?? true,
        };
    }

    return {
        functions: true,
        classes: true,
        variables: true,
    };
}

function shouldCheckVariable(variable, config) {
    const definition = variable.defs[0];
    if (!definition) {
        return false;
    }

    switch (definition.type) {
        case "FunctionName":
            return config.functions;
        case "ClassName":
            return config.classes;
        case "Variable":
            return config.variables;
        default:
            return false;
    }
}

function getDefinitionStart(variable) {
    const definition = variable.defs[0];
    return definition?.name?.range?.[0] ?? null;
}

const noUseBeforeDefineRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const config = parseOptions(context.options[0]);
        const sourceCode = context.sourceCode;

        return {
            "Program:exit"() {
                for (const scope of sourceCode.scopeManager.scopes) {
                    for (const reference of scope.references) {
                        const variable = reference.resolved;
                        if (!variable || !shouldCheckVariable(variable, config)) {
                            continue;
                        }

                        const definitionStart = getDefinitionStart(variable);
                        const referenceStart = reference.identifier.range?.[0];

                        if (definitionStart === null || referenceStart === undefined) {
                            continue;
                        }

                        if (reference.isWrite() && reference.init === true) {
                            continue;
                        }

                        if (referenceStart < definitionStart) {
                            context.report({
                                node: reference.identifier,
                                message: "'{{name}}' was used before it was defined.",
                                data: { name: reference.identifier.name },
                            });
                        }
                    }
                }
            },
        };
    },
};

export default noUseBeforeDefineRule;
