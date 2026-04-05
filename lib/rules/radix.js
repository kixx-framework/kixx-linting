import { getStaticPropertyName } from "./utils.js";

const VALID_RADIX_VALUES = new Set(Array.from({ length: 35 }, (_, index) => index + 2));

function isValidRadix(node) {
    return !(
        (node.type === "Literal" && !VALID_RADIX_VALUES.has(node.value)) ||
        (node.type === "Identifier" && node.name === "undefined")
    );
}

function isParseIntCall(node) {
    if (node.callee.type === "Identifier") {
        return node.callee.name === "parseInt";
    }

    return (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name === "Number" &&
        getStaticPropertyName(node.callee) === "parseInt"
    );
}

const radixRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        return {
            CallExpression(node) {
                if (!isParseIntCall(node)) {
                    return;
                }

                if (node.arguments.length === 0) {
                    context.report({
                        node,
                        message: "Missing parameters.",
                    });
                    return;
                }

                if (node.arguments.length === 1) {
                    context.report({
                        node,
                        message: "Missing radix parameter.",
                    });
                    return;
                }

                if (!isValidRadix(node.arguments[1])) {
                    context.report({
                        node,
                        message: "Invalid radix parameter, must be an integer between 2 and 36.",
                    });
                }
            },
        };
    },
};

export default radixRule;
