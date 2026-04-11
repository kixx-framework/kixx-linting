/**
 * no-promise-executor-return — disallow returning values from Promise executor functions.
 * Adapted from ESLint's no-promise-executor-return rule.
 */

function isPromiseExecutor(node) {
    const parent = node.parent;
    if (!parent || parent.type !== "NewExpression") return false;
    if (parent.callee.type !== "Identifier" || parent.callee.name !== "Promise") return false;
    return parent.arguments[0] === node;
}

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

function findReturnStatements(funcBody) {
    const returns = [];
    function walk(node) {
        if (!node || typeof node !== "object") return;
        // Don't recurse into nested functions
        if (
            node.type === "FunctionDeclaration" ||
            node.type === "FunctionExpression" ||
            node.type === "ArrowFunctionExpression"
        ) {
            return;
        }
        if (node.type === "ReturnStatement") {
            returns.push(node);
        }
        for (const key of Object.keys(node)) {
            if (key === "parent") continue;
            const child = node[key];
            if (Array.isArray(child)) {
                child.forEach(walk);
            } else if (child && typeof child === "object" && child.type) {
                walk(child);
            }
        }
    }
    walk(funcBody);
    return returns;
}

const noPromiseExecutorReturnRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    allowVoid: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const allowVoid = context.options[0]?.allowVoid ?? false;
        const configuredGlobals = context.languageOptions?.globals ?? {};
        const directiveGlobals = parseDirectiveGlobals(context.sourceCode);

        function isGlobalPromiseEnabled(referenceNode) {
            if (hasShadowedDefinition(context.sourceCode, referenceNode, "Promise")) {
                return false;
            }

            if (configuredGlobals.Promise === "off") {
                return false;
            }

            return directiveGlobals.get("Promise") !== "off";
        }

        function checkExecutor(node) {
            if (!isPromiseExecutor(node)) return;
            if (!isGlobalPromiseEnabled(node.parent.callee)) return;

            // For arrow functions with expression body
            if (node.type === "ArrowFunctionExpression" && node.body.type !== "BlockStatement") {
                if (allowVoid && node.body.type === "UnaryExpression" && node.body.operator === "void") return;
                context.report({
                    node: node.body,
                    message: "Return values from promise executor functions cannot be read.",
                });
                return;
            }

            // For block body functions, find return statements with values
            const returns = findReturnStatements(node.body);
            for (const ret of returns) {
                if (!ret.argument) continue; // bare return is ok
                if (allowVoid && ret.argument.type === "UnaryExpression" && ret.argument.operator === "void") continue;
                context.report({
                    node: ret,
                    message: "Return values from promise executor functions cannot be read.",
                });
            }
        }

        return {
            FunctionExpression: checkExecutor,
            ArrowFunctionExpression: checkExecutor,
        };
    },
};

export default noPromiseExecutorReturnRule;
