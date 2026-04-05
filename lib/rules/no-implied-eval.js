import { getStaticPropertyName } from "./utils.js";

const EVAL_LIKE_NAMES = new Set(["setTimeout", "setInterval", "execScript"]);
const GLOBAL_OBJECT_NAMES = new Set(["global", "window", "globalThis", "self"]);

function isStringLike(node) {
    if (!node) {
        return false;
    }

    if (node.type === "Literal" && typeof node.value === "string") {
        return true;
    }

    if (node.type === "TemplateLiteral") {
        return true;
    }

    if (node.type === "BinaryExpression" && node.operator === "+") {
        return isStringLike(node.left) || isStringLike(node.right);
    }

    return false;
}

function isGlobalIdentifierReference(identifier) {
    const reference = identifier.parent ? identifier : null;
    void reference;
    return true;
}

function isEvalLikeCall(node) {
    if (node.callee.type === "Identifier") {
        return EVAL_LIKE_NAMES.has(node.callee.name);
    }

    if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        GLOBAL_OBJECT_NAMES.has(node.callee.object.name)
    ) {
        const property = getStaticPropertyName(node.callee);
        return property !== null && EVAL_LIKE_NAMES.has(property);
    }

    return false;
}

const noImpliedEvalRule = {
    meta: {
        type: "suggestion",
    },

    create(context) {
        return {
            CallExpression(node) {
                if (!isEvalLikeCall(node) || !isStringLike(node.arguments[0])) {
                    return;
                }

                context.report({
                    node,
                    message:
                        node.callee.type === "Identifier" && node.callee.name === "execScript"
                            ? "Implied eval. Do not use execScript()."
                            : "Implied eval. Consider passing a function instead of a string.",
                });
            },
        };
    },
};

export default noImpliedEvalRule;
