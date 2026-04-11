const NON_CONSTRUCTOR_NAMES = new Set(["Symbol", "BigInt"]);

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

function hasShadowedDefinition(node, name, sourceCode) {
    return sourceCode.scopeManager.scopes.some(scope =>
        scopeContainsNode(scope, node) &&
        scope.type !== "global" &&
        scope.variables.some(variable => variable.name === name && variable.defs.length > 0),
    );
}

const noNewNativeNonconstructorRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        return {
            NewExpression(node) {
                if (node.callee.type !== "Identifier" || !NON_CONSTRUCTOR_NAMES.has(node.callee.name)) {
                    return;
                }

                if (hasShadowedDefinition(node, node.callee.name, context.sourceCode)) {
                    return;
                }

                context.report({
                    node: node.callee,
                    message: "`{{name}}` cannot be called as a constructor.",
                    data: { name: node.callee.name },
                });
            },
        };
    },
};

export default noNewNativeNonconstructorRule;
