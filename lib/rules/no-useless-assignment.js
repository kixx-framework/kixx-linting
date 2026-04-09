function findReference(sourceCode, node) {
    let scope = sourceCode.getScope(node);

    while (scope) {
        const reference = scope.references.find(candidate => candidate.identifier === node);

        if (reference) {
            return reference;
        }

        scope = scope.upper;
    }

    return null;
}

function cloneVariableState(variableState) {
    const clone = new Map();

    for (const [variable, writes] of variableState) {
        clone.set(variable, new Set(writes));
    }

    return clone;
}

function collectIdentifiers(pattern, identifiers = []) {
    if (!pattern || typeof pattern !== "object") {
        return identifiers;
    }

    switch (pattern.type) {
        case "Identifier":
            identifiers.push(pattern);
            break;

        case "AssignmentPattern":
            collectIdentifiers(pattern.left, identifiers);
            break;

        case "ArrayPattern":
            for (const element of pattern.elements) {
                collectIdentifiers(element, identifiers);
            }
            break;

        case "ObjectPattern":
            for (const property of pattern.properties) {
                collectIdentifiers(property, identifiers);
            }
            break;

        case "Property":
            collectIdentifiers(pattern.value, identifiers);
            break;

        case "RestElement":
            collectIdentifiers(pattern.argument, identifiers);
            break;

        default:
            break;
    }

    return identifiers;
}

function parseExportedVariables(sourceCode) {
    const exported = new Set();

    for (const statement of sourceCode.ast.body) {
        if (statement.type === "ExportNamedDeclaration") {
            if (statement.declaration) {
                const declarations = sourceCode.getDeclaredVariables(statement.declaration);

                for (const variable of declarations) {
                    exported.add(variable);
                }
            }

            for (const specifier of statement.specifiers ?? []) {
                if (specifier.local?.type === "Identifier") {
                    exported.add(specifier.local.name);
                }
            }
        }

        if (statement.type === "ExportDefaultDeclaration" && statement.declaration) {
            const declarations = sourceCode.getDeclaredVariables(statement.declaration);

            for (const variable of declarations) {
                exported.add(variable);
            }
        }
    }

    for (const comment of sourceCode.getAllComments()) {
        const match = comment.value.match(/^\s*exported\s+([^*]+?)\s*$/u);

        if (!match) {
            continue;
        }

        for (const name of match[1].split(/\s*,\s*|\s+/u)) {
            if (name) {
                exported.add(name);
            }
        }
    }

    return exported;
}

function isDeclarationName(node) {
    const parent = node.parent;

    return (
        parent?.type === "VariableDeclarator" && parent.id === node ||
        parent?.type === "FunctionDeclaration" && parent.id === node ||
        parent?.type === "FunctionExpression" && parent.id === node ||
        parent?.type === "ClassDeclaration" && parent.id === node ||
        parent?.type === "ClassExpression" && parent.id === node ||
        parent?.type === "RestElement" ||
        parent?.type === "Property" && parent.value === node && parent.parent?.type === "ObjectPattern" ||
        parent?.type === "AssignmentPattern" && parent.left === node ||
        parent?.type === "ArrayPattern"
    );
}

function isHandledWriteTarget(node) {
    const parent = node.parent;

    return Boolean(
        parent &&
        (
            parent.type === "AssignmentExpression" && parent.left === node ||
            parent.type === "UpdateExpression" && parent.argument === node ||
            parent.type === "VariableDeclarator" ||
            parent.type === "AssignmentPattern" ||
            parent.type === "ArrayPattern" ||
            parent.type === "ObjectPattern" ||
            parent.type === "Property" && parent.value === node && parent.parent?.type === "ObjectPattern" ||
            parent.type === "RestElement" ||
            parent.type === "ForInStatement" && parent.left === node ||
            parent.type === "ForOfStatement" && parent.left === node
        )
    );
}

function shouldTrackVariable(variable, exportedVariables) {
    if (!variable || variable.defs.length === 0) {
        return false;
    }

    if (exportedVariables.has(variable) || exportedVariables.has(variable.name)) {
        return false;
    }

    if (!variable.references.some(reference => reference.isRead())) {
        return false;
    }

    if (variable.references.some(reference => reference.from !== variable.scope && reference.isRead())) {
        return false;
    }

    return true;
}

function mergeStates(states) {
    const merged = new Map();

    for (const state of states) {
        if (!state) {
            continue;
        }

        for (const [variable, writes] of state) {
            let mergedWrites = merged.get(variable);

            if (!mergedWrites) {
                mergedWrites = new Set();
                merged.set(variable, mergedWrites);
            }

            for (const write of writes) {
                mergedWrites.add(write);
            }
        }
    }

    return merged;
}

function statesEqual(left, right) {
    if (left.size !== right.size) {
        return false;
    }

    for (const [variable, leftWrites] of left) {
        const rightWrites = right.get(variable);

        if (!rightWrites || leftWrites.size !== rightWrites.size) {
            return false;
        }

        for (const write of leftWrites) {
            if (!rightWrites.has(write)) {
                return false;
            }
        }
    }

    return true;
}

function getSegmentOps(segmentOperations, segment) {
    let operations = segmentOperations.get(segment);

    if (!operations) {
        operations = [];
        segmentOperations.set(segment, operations);
    }

    return operations;
}

const noUselessAssignmentRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const exportedVariables = parseExportedVariables(sourceCode);
        const trackedVariables = new WeakMap();
        const segmentOperations = new Map();
        const writeRecords = [];
        const codePathSegments = [];
        const reachableSegments = new Set();
        let currentSegments = new Set();

        function isTracked(variable) {
            if (!variable) {
                return false;
            }

            if (!trackedVariables.has(variable)) {
                trackedVariables.set(variable, shouldTrackVariable(variable, exportedVariables));
            }

            return trackedVariables.get(variable);
        }

        function markReads(node) {
            const reference = findReference(sourceCode, node);
            const variable = reference?.resolved;

            if (!reference || !reference.isRead() || !isTracked(variable)) {
                return;
            }

            for (const segment of currentSegments) {
                getSegmentOps(segmentOperations, segment).push({ type: "read", variable });
            }
        }

        function recordWrite(node) {
            const reference = findReference(sourceCode, node);
            const variable = reference?.resolved;

            if (!reference || !reference.isWrite() || !isTracked(variable)) {
                return;
            }

            if (currentSegments.size === 0) {
                return;
            }

            const write = {
                identifier: node,
                variable,
                used: false,
            };

            writeRecords.push(write);

            for (const segment of currentSegments) {
                getSegmentOps(segmentOperations, segment).push({ type: "write", variable, write });
            }
        }

        function recordPatternWrites(pattern) {
            for (const identifier of collectIdentifiers(pattern)) {
                recordWrite(identifier);
            }
        }

        return {
            onCodePathStart() {
                codePathSegments.push(currentSegments);
                currentSegments = new Set();
            },

            onCodePathEnd() {
                currentSegments = codePathSegments.pop();
            },

            onCodePathSegmentStart(segment) {
                reachableSegments.add(segment);
                currentSegments.add(segment);
            },

            onCodePathSegmentEnd(segment) {
                currentSegments.delete(segment);
            },

            Identifier(node) {
                if (isDeclarationName(node)) {
                    return;
                }

                markReads(node);
            },

            "VariableDeclarator:exit"(node) {
                recordPatternWrites(node.id);
            },

            "AssignmentExpression:exit"(node) {
                recordPatternWrites(node.left);
            },

            "UpdateExpression:exit"(node) {
                recordWrite(node.argument);
            },

            "ForInStatement:exit"(node) {
                recordPatternWrites(node.left);
            },

            "ForOfStatement:exit"(node) {
                recordPatternWrites(node.left);
            },

            "Program:exit"() {
                const inStates = new Map();
                const outStates = new Map();
                const worklist = [...reachableSegments];

                for (const segment of reachableSegments) {
                    inStates.set(segment, new Map());
                    outStates.set(segment, new Map());
                }

                while (worklist.length > 0) {
                    const segment = worklist.pop();
                    const previousStates = (segment.prevSegments ?? []).map(prevSegment => outStates.get(prevSegment));
                    const nextInState = mergeStates(previousStates);
                    const nextOutState = cloneVariableState(nextInState);

                    for (const operation of segmentOperations.get(segment) ?? []) {
                        if (operation.type === "read") {
                            for (const write of nextOutState.get(operation.variable) ?? []) {
                                write.used = true;
                            }
                            continue;
                        }

                        nextOutState.set(operation.variable, new Set([operation.write]));
                    }

                    if (
                        !statesEqual(nextInState, inStates.get(segment)) ||
                        !statesEqual(nextOutState, outStates.get(segment))
                    ) {
                        inStates.set(segment, nextInState);
                        outStates.set(segment, nextOutState);

                        for (const nextSegment of segment.nextSegments ?? []) {
                            worklist.push(nextSegment);
                        }
                    }
                }

                for (const write of writeRecords) {
                    if (write.used) {
                        continue;
                    }

                    context.report({
                        node: write.identifier,
                        message: "The value assigned to '{{name}}' is not used in subsequent statements.",
                        data: { name: write.variable.name },
                    });
                }
            },
        };
    },
};

export default noUselessAssignmentRule;
