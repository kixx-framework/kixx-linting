import { hasShadowingDefinition } from "./utils.js";

const WRAPPER_NAMES = new Set(["String", "Number", "Boolean"]);

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

const noNewWrappersRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        const configuredGlobals = context.languageOptions?.globals ?? {};
        const directiveGlobals = parseDirectiveGlobals(context.sourceCode);

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
