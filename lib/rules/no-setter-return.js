/**
 * no-setter-return — disallow returning values from setters.
 * Adapted from ESLint's no-setter-return rule.
 */

const DIRECT_DESCRIPTOR_CALLS = new Set(["Object.defineProperty", "Reflect.defineProperty"]);
const NESTED_DESCRIPTOR_CALLS = new Set(["Object.defineProperties", "Object.create"]);

function parseGlobalComments(comments) {
    const result = new Map();

    for (const comment of comments) {
        if (comment.type !== "Block") continue;

        const match = /^\s*globals?\s+([\s\S]*)$/u.exec(comment.value);
        if (!match) continue;

        const declarations = match[1].split(",");
        for (const declaration of declarations) {
            const trimmed = declaration.trim();
            if (!trimmed) continue;

            const colonIndex = trimmed.indexOf(":");
            if (colonIndex === -1) {
                result.set(trimmed, "readonly");
                continue;
            }

            const name = trimmed.slice(0, colonIndex).trim();
            const value = trimmed.slice(colonIndex + 1).trim();
            if (name) {
                result.set(name, value);
            }
        }
    }

    return result;
}

function getStaticPropertyName(node, { allowIdentifier = true } = {}) {
    if (!node) return null;

    if (allowIdentifier && node.type === "Identifier") {
        return node.name;
    }

    if (node.type === "Literal") {
        return String(node.value);
    }

    if (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
    ) {
        return node.quasis[0].value.cooked ?? node.quasis[0].value.raw;
    }

    return null;
}

function getCalleeInfo(node) {
    if (!node) return null;

    if (node.type === "ChainExpression") {
        return getCalleeInfo(node.expression);
    }

    if (node.type !== "MemberExpression") {
        return null;
    }

    if (node.object.type !== "Identifier") {
        return null;
    }

    const propertyName = node.computed
        ? getStaticPropertyName(node.property, { allowIdentifier: false })
        : node.property.type === "Identifier" ? node.property.name : null;

    if (!propertyName) {
        return null;
    }

    return {
        objectNode: node.object,
        objectName: node.object.name,
        propertyName,
    };
}

function isShadowedReference(identifierNode, sourceCode) {
    for (const scope of sourceCode.scopeManager.scopes) {
        const reference = scope.references.find(ref => ref.identifier === identifierNode);
        if (reference) {
            return Boolean(reference.resolved && reference.resolved.defs.length > 0);
        }
    }

    return false;
}

function isTargetCallee(callNode, context, isDisabledGlobal) {
    const info = getCalleeInfo(callNode.callee);
    if (!info) return false;

    const fullName = `${info.objectName}.${info.propertyName}`;

    if (!DIRECT_DESCRIPTOR_CALLS.has(fullName) && !NESTED_DESCRIPTOR_CALLS.has(fullName)) {
        return false;
    }

    if (isDisabledGlobal(info.objectName)) {
        return false;
    }

    if (isShadowedReference(info.objectNode, context.sourceCode)) {
        return false;
    }

    return true;
}

function isDescriptorArg(objectExpr, context, isDisabledGlobal) {
    const parent = objectExpr.parent;
    if (!parent) return false;

    if (parent.type === "CallExpression" && parent.arguments[2] === objectExpr) {
        if (!isTargetCallee(parent, context, isDisabledGlobal)) return false;

        const info = getCalleeInfo(parent.callee);
        if (!info) return false;
        return DIRECT_DESCRIPTOR_CALLS.has(`${info.objectName}.${info.propertyName}`);
    }

    if (parent.type === "Property" && parent.value === objectExpr) {
        const grandparent = parent.parent;
        if (grandparent && grandparent.type === "ObjectExpression") {
            const callNode = grandparent.parent;
            if (callNode && callNode.type === "CallExpression" && callNode.arguments[1] === grandparent) {
                if (!isTargetCallee(callNode, context, isDisabledGlobal)) return false;

                const info = getCalleeInfo(callNode.callee);
                if (!info) return false;
                return NESTED_DESCRIPTOR_CALLS.has(`${info.objectName}.${info.propertyName}`);
            }
        }
    }

    return false;
}

function isSetterInDescriptor(node, context, isDisabledGlobal) {
    const parent = node.parent;
    if (!parent || parent.type !== "Property" || parent.value !== node) return false;

    const keyName = parent.computed
        ? getStaticPropertyName(parent.key, { allowIdentifier: false })
        : parent.key.type === "Identifier" ? parent.key.name : getStaticPropertyName(parent.key);

    if (keyName !== "set") return false;

    const descriptor = parent.parent;
    if (!descriptor || descriptor.type !== "ObjectExpression") return false;

    return isDescriptorArg(descriptor, context, isDisabledGlobal);
}

function isSetter(node, context, isDisabledGlobal) {
    const parent = node.parent;
    if (!parent) return false;

    if (parent.type === "Property" && parent.kind === "set" && parent.value === node) {
        return true;
    }

    if (parent.type === "MethodDefinition" && parent.kind === "set" && parent.value === node) {
        return true;
    }

    if (isSetterInDescriptor(node, context, isDisabledGlobal)) {
        return true;
    }

    return false;
}

function findReturnStatements(node) {
    const returns = [];

    function walk(n) {
        if (!n || typeof n !== "object") return;

        if (
            n !== node && (
                n.type === "FunctionDeclaration" ||
                n.type === "FunctionExpression" ||
                n.type === "ArrowFunctionExpression"
            )
        ) {
            return;
        }

        if (n.type === "ReturnStatement") {
            returns.push(n);
        }

        for (const key of Object.keys(n)) {
            if (key === "parent") continue;
            const child = n[key];
            if (Array.isArray(child)) {
                child.forEach(walk);
            } else if (child && typeof child === "object" && child.type) {
                walk(child);
            }
        }
    }

    walk(node.body);
    return returns;
}

const noSetterReturnRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        const configuredGlobals = context.languageOptions?.globals
            ?? context.languageOptions?.languageOptions?.globals
            ?? {};
        const commentGlobals = parseGlobalComments(context.sourceCode.getAllComments());

        function isDisabledGlobal(name) {
            if (configuredGlobals[name] === "off") {
                return true;
            }

            return commentGlobals.get(name) === "off";
        }

        function checkFunction(node) {
            if (!isSetter(node, context, isDisabledGlobal)) return;

            if (node.type === "ArrowFunctionExpression" && node.expression) {
                context.report({
                    node,
                    message: "Setter cannot return a value.",
                });
                return;
            }

            const returns = findReturnStatements(node);
            for (const ret of returns) {
                if (ret.argument) {
                    context.report({
                        node: ret,
                        message: "Setter cannot return a value.",
                    });
                }
            }
        }

        return {
            FunctionExpression: checkFunction,
            ArrowFunctionExpression: checkFunction,
        };
    },
};

export default noSetterReturnRule;
