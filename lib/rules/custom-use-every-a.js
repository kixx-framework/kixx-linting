// Test fixture rule: marks every identifier's variable as used via markVariableAsUsed().
// Used in no-unused-vars tests to verify that markVariableAsUsed() is respected.
// By visiting every Identifier and calling markVariableAsUsed(node.name), it ensures
// any variable referenced by name in the source is considered used.
const customUseEveryARule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        return {
            "Identifier"(node) {
                context.markVariableAsUsed(node.name);
            },
        };
    },
};

export default customUseEveryARule;
