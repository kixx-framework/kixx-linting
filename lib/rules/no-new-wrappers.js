import { hasShadowingDefinition } from "./utils.js";

const WRAPPER_NAMES = new Set(["String", "Number", "Boolean"]);

const noNewWrappersRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        const configuredGlobals = context.languageOptions?.globals ?? {};
        const directiveGlobals = context.sourceCode.getCommentGlobals();

        function isDisabledGlobal(name) {
            const configured = configuredGlobals[name];
            if (configured === "off") {
                return true;
            }

            const fromDirective = directiveGlobals.get(name);
            return fromDirective === "off";
        }

        return {
            NewExpression(node) {
                if (node.callee.type !== "Identifier" || !WRAPPER_NAMES.has(node.callee.name)) {
                    return;
                }

                if (hasShadowingDefinition(context.sourceCode, node, node.callee.name)) {
                    return;
                }

                if (isDisabledGlobal(node.callee.name)) {
                    return;
                }

                context.report({
                    node,
                    message: "Do not use {{name}} as a constructor.",
                    data: { name: node.callee.name },
                });
            },
        };
    },
};

export default noNewWrappersRule;
