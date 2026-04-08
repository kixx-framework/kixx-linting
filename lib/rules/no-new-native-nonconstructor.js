const NON_CONSTRUCTOR_NAMES = new Set(["Symbol", "BigInt"]);

function scopeContainsNode(scope, node) {
    const block = scope.block;
    if (!block) {
        return false;
    }

    const blockStart = block.range ? block.range[0] : block.start;
    const blockEnd = block.range ? block.range[1] : block.end;
    const nodeStart = node.range ? node.range[0] : node.start;
    const nodeEnd = node.range ? node.range[1] : node.end;

    return blockStart <= nodeStart && blockEnd >= nodeEnd;
}

function hasShadowedDefinition(node, name, sourceCode) {
    return sourceCode.scopeManager.scopes.some(scope =>
        scopeContainsNode(scope, node) &&
        scope.type !== "global" &&
        scope.variables.some(variable => variable.name === name && variable.defs.length > 0)
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
