import { getGlobalVariable } from "./utils.js";

const noConsoleRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        const sourceCode = context.sourceCode;

        return {
            "Program:exit"(node) {
                const consoleVariable = getGlobalVariable(sourceCode.getScope(node), "console");
                if (!consoleVariable || consoleVariable.defs.length > 0) {
                    return;
                }

                for (const reference of consoleVariable.references) {
                    const parent = reference.identifier.parent;
                    if (parent?.type !== "MemberExpression" || parent.object !== reference.identifier) {
                        continue;
                    }

                    context.report({
                        node: parent,
                        message: "Unexpected console statement.",
                    });
                }
            },
        };
    },
};

export default noConsoleRule;
