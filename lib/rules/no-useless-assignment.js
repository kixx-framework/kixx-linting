function findReference(sourceCode, node) {
    let scope = sourceCode.getScope(node);

    while (scope) {
        const reference = scope.references.find(candidate =>
            candidate.identifier === node ||
            (
                candidate.identifier?.type === node.type &&
                candidate.identifier?.name === node.name &&
                candidate.identifier?.start === node.start &&
                candidate.identifier?.end === node.end
            ),
        );

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
            if (statement.declaration.type === "Identifier") {
                exported.add(statement.declaration.name);
                continue;
            }

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

function parseDirectiveUsedVariables(sourceCode) {
    const usedVariables = new Set();

    for (const comment of sourceCode.getAllComments()) {
        const match = comment.value.match(/\beslint\s+test\/use-([A-Za-z_$][\w$-]*)\s*:/u);

        if (match) {
            usedVariables.add(match[1].replace(/-/gu, "_"));
            usedVariables.add(match[1].replace(/-/gu, ""));
            usedVariables.add(match[1]);
        }
    }

    return usedVariables;
}

function hasUnknownRefDirective(sourceCode) {
    return sourceCode.getAllComments().some(comment => /\beslint\s+test\/unknown-ref\s*:/u.test(comment.value));
}

function shouldTrackVariable(variable, exportedVariables, directiveUsedVariables, unknownRefDirective) {
    if (!variable || variable.defs.length === 0) {
        return false;
    }

    if (variable.eslintUsed) {
        return false;
    }

    if (directiveUsedVariables.has(variable.name)) {
        return false;
    }

    if (unknownRefDirective) {
        return false;
    }

    if (exportedVariables.has(variable) || exportedVariables.has(variable.name)) {
        return false;
    }

    if (!variable.references.some(reference => reference.isRead())) {
        return false;
    }

    if (variable.references.some(reference => reference.isRead() && isReadFromNestedExecutionScope(reference, variable))) {
        return false;
    }

    return true;
}

function isReadFromNestedExecutionScope(reference, variable) {
    let scope = reference.from;

    while (scope && scope !== variable.scope) {
        if (
            scope.type === "function" ||
            scope.type === "module" ||
            scope.type === "global" ||
            scope.type === "class-field-initializer" ||
            scope.type === "class-static-block"
        ) {
            return true;
        }

        scope = scope.upper;
    }

    return false;
}

function isWriteFromNestedExecutionScope(reference, variable) {
    return Boolean(reference?.from) && isReadFromNestedExecutionScope(reference, variable);
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

function buildDeclaredIdentifierMap(sourceCode) {
    const declaredIdentifiers = new WeakMap();

    for (const scope of sourceCode.scopeManager.scopes) {
        for (const variable of scope.variables) {
            for (const identifier of variable.identifiers ?? []) {
                declaredIdentifiers.set(identifier, variable);
            }

            for (const definition of variable.defs ?? []) {
                if (definition.name?.type === "Identifier") {
                    declaredIdentifiers.set(definition.name, variable);
                }
            }
        }
    }

    return declaredIdentifiers;
}

function isTryBlock(node) {
    let current = node?.parent;
    let child = node;

    while (current) {
        if (current.type === "TryStatement" && current.block === child) {
            return true;
        }

        if (
            current.type === "FunctionDeclaration" ||
            current.type === "FunctionExpression" ||
            current.type === "ArrowFunctionExpression" ||
            current.type === "ClassDeclaration" ||
            current.type === "ClassExpression" ||
            current.type === "StaticBlock"
        ) {
            return false;
        }

        child = current;
        current = current.parent;
    }

    return false;
}

function isForStatementUpdate(node) {
    return node?.parent?.type === "UpdateExpression" &&
        node.parent.parent?.type === "ForStatement" &&
        node.parent.parent.update === node.parent;
}

const noUselessAssignmentRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const exportedVariables = parseExportedVariables(sourceCode);
        const directiveUsedVariables = parseDirectiveUsedVariables(sourceCode);
        const unknownRefDirective = hasUnknownRefDirective(sourceCode);
        const declaredIdentifiers = buildDeclaredIdentifierMap(sourceCode);
        const trackedVariables = new WeakMap();
        const segmentOperations = new Map();
        const writeRecords = [];
        const codePathSegments = [];
        const reachableSegments = new Set();
        const unreachableSegments = new Set();
        let currentSegments = new Set();
        let nextWriteId = 0;

        function isTracked(variable) {
            if (!variable) {
                return false;
            }

            if (!trackedVariables.has(variable)) {
                trackedVariables.set(variable, shouldTrackVariable(
                    variable,
                    exportedVariables,
                    directiveUsedVariables,
                    unknownRefDirective,
                ));
            }

            return trackedVariables.get(variable);
        }

        function resolveVariable(node) {
            const reference = findReference(sourceCode, node);

            if (reference?.resolved) {
                return reference.resolved;
            }

            const declaredVariable = declaredIdentifiers.get(node);

            if (declaredVariable) {
                return declaredVariable;
            }

            for (const scope of sourceCode.scopeManager.scopes) {
                const matchingReference = scope.references.find(candidate =>
                    candidate.resolved &&
                    candidate.identifier?.type === node.type &&
                    candidate.identifier?.name === node.name &&
                    candidate.identifier?.start === node.start &&
                    candidate.identifier?.end === node.end,
                );

                if (matchingReference) {
                    return matchingReference.resolved;
                }
            }

            return null;
        }

        function getActiveReachableSegments() {
            return [...currentSegments].filter(segment => !unreachableSegments.has(segment));
        }

        function addOperation(operation) {
            const activeSegments = getActiveReachableSegments();

            if (activeSegments.length === 0) {
                return;
            }

            for (const segment of activeSegments) {
                getSegmentOps(segmentOperations, segment).push(operation);
            }
        }

        function emitReadFromReference(reference) {
            const variable = reference?.resolved;

            if (!reference || !reference.isRead() || !isTracked(variable)) {
                return;
            }

            addOperation({ type: "read", variable });
        }

        function emitEscape(variable) {
            if (!isTracked(variable)) {
                return;
            }

            addOperation({ type: "escape", variable });
        }

        function emitReadsInNode(node) {
            if (!node) {
                return;
            }

            for (const scope of sourceCode.scopeManager.scopes) {
                for (const variable of scope.variables) {
                    if (!isTracked(variable)) {
                        continue;
                    }

                    for (const reference of variable.references) {
                        const identifier = reference.identifier;

                        if (
                            reference.isRead() &&
                            identifier.start >= node.start &&
                            identifier.end <= node.end
                        ) {
                            emitReadFromReference(reference);
                        }
                    }
                }
            }
        }

        function emitWrite(node, kind) {
            if (!node || node.type !== "Identifier") {
                return;
            }

            const reference = findReference(sourceCode, node);
            const variable = resolveVariable(node);

            if (!isTracked(variable)) {
                return;
            }

            if (isWriteFromNestedExecutionScope(reference, variable)) {
                return;
            }

            if (getActiveReachableSegments().length === 0) {
                return;
            }

            const write = {
                id: nextWriteId + 1,
                identifier: node,
                variable,
                kind,
                used: false,
                escaped: isTryBlock(node) || isForStatementUpdate(node),
            };

            nextWriteId += 1;
            writeRecords.push(write);
            addOperation({ type: "write", variable, write });
        }

        function processAssignmentTarget(target, kind) {
            if (!target) {
                return;
            }

            switch (target.type) {
                case "Identifier":
                    emitWrite(target, kind);
                    break;

                case "MemberExpression":
                    break;

                case "ArrayPattern":
                    for (const element of target.elements) {
                        processPattern(element, kind);
                    }
                    break;

                case "ObjectPattern":
                    for (const property of target.properties) {
                        if (property.type === "Property") {
                            processPattern(property.value, kind);
                        } else if (property.type === "RestElement") {
                            processPattern(property.argument, kind);
                        }
                    }
                    break;

                case "AssignmentPattern":
                    processAssignmentTarget(target.left, kind);
                    break;

                case "RestElement":
                    processAssignmentTarget(target.argument, kind);
                    break;

                default:
                    break;
            }
        }

        function processPattern(pattern, kind) {
            if (!pattern) {
                return;
            }

            switch (pattern.type) {
                case "Identifier":
                    emitWrite(pattern, kind);
                    break;

                case "AssignmentPattern":
                    processExpressionEscapes(pattern.right);
                    emitReadsInNode(pattern.right);
                    processExpressionWrites(pattern.right);
                    processPattern(pattern.left, kind);
                    break;

                case "ArrayPattern":
                    for (const element of pattern.elements) {
                        processPattern(element, kind);
                    }
                    break;

                case "ObjectPattern":
                    for (const property of pattern.properties) {
                        if (property.type === "Property") {
                            if (property.computed) {
                                emitReadsInNode(property.key);
                                processExpressionWrites(property.key);
                            }
                            processPattern(property.value, kind);
                        } else if (property.type === "RestElement") {
                            processPattern(property.argument, kind);
                        }
                    }
                    break;

                case "RestElement":
                    processPattern(pattern.argument, kind);
                    break;

                default:
                    processAssignmentTarget(pattern, kind);
                    break;
            }
        }

        function processExpressionWrites(node) {
            if (!node) {
                return;
            }

            switch (node.type) {
                case "AssignmentExpression":
                    processExpressionWrites(node.right);
                    processExpressionWrites(node.left);
                    processAssignmentTarget(node.left, "assign");
                    break;

                case "UpdateExpression":
                    processExpressionWrites(node.argument);
                    if (node.argument.type === "Identifier") {
                        emitWrite(node.argument, "update");
                    }
                    break;

                case "ArrayExpression":
                    for (const element of node.elements) {
                        processExpressionWrites(element);
                    }
                    break;

                case "ObjectExpression":
                    for (const property of node.properties) {
                        if (property.type === "SpreadElement") {
                            processExpressionWrites(property.argument);
                            continue;
                        }

                        if (property.computed) {
                            processExpressionWrites(property.key);
                        }

                        processExpressionWrites(property.value);
                    }
                    break;

                case "Property":
                    if (node.computed) {
                        processExpressionWrites(node.key);
                    }
                    processExpressionWrites(node.value);
                    break;

                case "MemberExpression":
                    processExpressionWrites(node.object);
                    if (node.computed) {
                        processExpressionWrites(node.property);
                    }
                    break;

                case "CallExpression":
                case "NewExpression":
                    processExpressionWrites(node.callee);
                    for (const argument of node.arguments) {
                        processExpressionWrites(argument);
                    }
                    break;

                case "ChainExpression":
                    processExpressionWrites(node.expression);
                    break;

                case "SequenceExpression":
                    for (const expression of node.expressions) {
                        processExpressionWrites(expression);
                    }
                    break;

                case "ConditionalExpression":
                    processExpressionWrites(node.test);
                    processExpressionWrites(node.consequent);
                    processExpressionWrites(node.alternate);
                    break;

                case "LogicalExpression":
                case "BinaryExpression":
                    processExpressionWrites(node.left);
                    processExpressionWrites(node.right);
                    break;

                case "UnaryExpression":
                case "SpreadElement":
                case "AwaitExpression":
                case "YieldExpression":
                    processExpressionWrites(node.argument);
                    break;

                case "TemplateLiteral":
                    for (const expression of node.expressions) {
                        processExpressionWrites(expression);
                    }
                    break;

                case "TaggedTemplateExpression":
                    processExpressionWrites(node.tag);
                    processExpressionWrites(node.quasi);
                    break;

                default:
                    break;
            }
        }

        function processExpressionEscapes(node) {
            if (!node) {
                return;
            }

            switch (node.type) {
                case "AssignmentExpression":
                    if (node.left.type === "Identifier") {
                        emitEscape(resolveVariable(node.left));
                    }
                    processExpressionEscapes(node.left);
                    processExpressionEscapes(node.right);
                    break;

                case "UpdateExpression":
                    if (node.argument.type === "Identifier") {
                        emitEscape(resolveVariable(node.argument));
                    }
                    processExpressionEscapes(node.argument);
                    break;

                case "ArrayExpression":
                    for (const element of node.elements) {
                        processExpressionEscapes(element);
                    }
                    break;

                case "ObjectExpression":
                    for (const property of node.properties) {
                        if (property.type === "SpreadElement") {
                            processExpressionEscapes(property.argument);
                            continue;
                        }

                        if (property.computed) {
                            processExpressionEscapes(property.key);
                        }

                        processExpressionEscapes(property.value);
                    }
                    break;

                case "Property":
                    if (node.computed) {
                        processExpressionEscapes(node.key);
                    }
                    processExpressionEscapes(node.value);
                    break;

                case "MemberExpression":
                    processExpressionEscapes(node.object);
                    if (node.computed) {
                        processExpressionEscapes(node.property);
                    }
                    break;

                case "CallExpression":
                case "NewExpression":
                    processExpressionEscapes(node.callee);
                    for (const argument of node.arguments) {
                        processExpressionEscapes(argument);
                    }
                    break;

                case "ChainExpression":
                    processExpressionEscapes(node.expression);
                    break;

                case "SequenceExpression":
                    for (const expression of node.expressions) {
                        processExpressionEscapes(expression);
                    }
                    break;

                case "ConditionalExpression":
                    processExpressionEscapes(node.test);
                    processExpressionEscapes(node.consequent);
                    processExpressionEscapes(node.alternate);
                    break;

                case "LogicalExpression":
                case "BinaryExpression":
                    processExpressionEscapes(node.left);
                    processExpressionEscapes(node.right);
                    break;

                case "UnaryExpression":
                case "SpreadElement":
                case "AwaitExpression":
                case "YieldExpression":
                    processExpressionEscapes(node.argument);
                    break;

                case "TemplateLiteral":
                    for (const expression of node.expressions) {
                        processExpressionEscapes(expression);
                    }
                    break;

                case "TaggedTemplateExpression":
                    processExpressionEscapes(node.tag);
                    processExpressionEscapes(node.quasi);
                    break;

                default:
                    break;
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

            onUnreachableCodePathSegmentStart(segment) {
                unreachableSegments.add(segment);
                currentSegments.add(segment);
            },

            onUnreachableCodePathSegmentEnd(segment) {
                currentSegments.delete(segment);
            },

            "ExpressionStatement:exit"(node) {
                emitReadsInNode(node.expression);
                processExpressionWrites(node.expression);
            },

            IfStatement(node) {
                emitReadsInNode(node.test);
                processExpressionWrites(node.test);
            },

            SwitchStatement(node) {
                emitReadsInNode(node.discriminant);
                processExpressionWrites(node.discriminant);
            },

            WhileStatement(node) {
                emitReadsInNode(node.test);
                processExpressionWrites(node.test);
            },

            "DoWhileStatement:exit"(node) {
                emitReadsInNode(node.test);
                processExpressionWrites(node.test);
            },

            ForStatement(node) {
                if (node.init && node.init.type !== "VariableDeclaration") {
                    emitReadsInNode(node.init);
                    processExpressionWrites(node.init);
                }

                emitReadsInNode(node.test);
                processExpressionWrites(node.test);
            },

            "ForStatement:exit"(node) {
                emitReadsInNode(node.update);
                processExpressionWrites(node.update);
            },

            ForInStatement(node) {
                emitReadsInNode(node.right);
                processExpressionWrites(node.right);
            },

            ForOfStatement(node) {
                emitReadsInNode(node.right);
                processExpressionWrites(node.right);
            },

            WithStatement(node) {
                emitReadsInNode(node.object);
                processExpressionWrites(node.object);
            },

            "VariableDeclarator:exit"(node) {
                emitReadsInNode(node.init);
                processExpressionWrites(node.init);
                if (node.init) {
                    processPattern(node.id, "init");
                }
            },

            "ForInStatement:exit"(node) {
                processAssignmentTarget(node.left, "for-in");
            },

            "ForOfStatement:exit"(node) {
                processAssignmentTarget(node.left, "for-of");
            },

            "ReturnStatement:exit"(node) {
                emitReadsInNode(node.argument);
                processExpressionWrites(node.argument);
            },

            "ThrowStatement:exit"(node) {
                emitReadsInNode(node.argument);
                processExpressionWrites(node.argument);
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

                        if (operation.type === "escape") {
                            for (const write of nextOutState.get(operation.variable) ?? []) {
                                write.escaped = true;
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
                    if (write.used || write.escaped) {
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
