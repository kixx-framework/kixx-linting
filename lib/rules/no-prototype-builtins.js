import { getStaticPropertyName } from "./utils.js";

const DISALLOWED_PROPERTIES = new Set([
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
]);

const noPrototypeBuiltinsRule = {
    meta: {
        type: "problem",
    },

    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== "MemberExpression") {
                    return;
                }

                const propertyName = getStaticPropertyName(node.callee);
                if (!propertyName || !DISALLOWED_PROPERTIES.has(propertyName)) {
                    return;
                }

                context.report({
                    node,
                    message: "Do not access Object.prototype method '{{prop}}' from target object.",
                    data: { prop: propertyName },
                });
            },
        };
    },
};

export default noPrototypeBuiltinsRule;
