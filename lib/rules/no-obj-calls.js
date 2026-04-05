import { getStaticPropertyName } from "./utils.js";

const NON_CALLABLE_GLOBALS = new Set(["Atomics", "JSON", "Math", "Reflect", "Intl", "Temporal"]);

function getCalleeDisplayName(node) {
    if (node.type === "Identifier") {
        return node.name;
    }

    return getStaticPropertyName(node) ?? "<unknown>";
}

const noObjCallsRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        function checkNode(node) {
            const callee = node.callee;

            if (callee.type === "Identifier" && NON_CALLABLE_GLOBALS.has(callee.name)) {
                context.report({
                    node,
                    message: "'{{name}}' is not a function.",
                    data: { name: callee.name },
                });
                return;
            }

            if (
                callee.type === "MemberExpression" &&
                callee.object.type === "Identifier" &&
                NON_CALLABLE_GLOBALS.has(callee.object.name)
            ) {
                context.report({
                    node,
                    message: "'{{name}}' is reference to '{{ref}}', which is not a function.",
                    data: {
                        name: getCalleeDisplayName(callee),
                        ref: callee.object.name,
                    },
                });
            }
        }

        return {
            CallExpression: checkNode,
            NewExpression: checkNode,
        };
    },
};

export default noObjCallsRule;
