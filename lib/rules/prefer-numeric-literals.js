/**
 * prefer-numeric-literals — disallow parseInt() and Number.parseInt() in favor of binary, octal, and hexadecimal literals.
 * Adapted from ESLint's prefer-numeric-literals rule.
 */

const RADIX_MAP = new Map([
    [2, "binary"],
    [8, "octal"],
    [16, "hexadecimal"],
]);

const BASES = new Map([
    [2, "0b"],
    [8, "0o"],
    [16, "0x"],
]);

function isParseInt(node) {
    return (
        (node.type === "Identifier" && node.name === "parseInt") ||
        (node.type === "MemberExpression" &&
            !node.computed &&
            node.object.type === "Identifier" &&
            node.object.name === "Number" &&
            node.property.type === "Identifier" &&
            node.property.name === "parseInt")
    );
}

const preferNumericLiteralsRule = {
    meta: {
        type: "suggestion",
        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                if (!isParseInt(node.callee)) return;
                if (node.arguments.length < 2) return;

                const radixArg = node.arguments[1];
                if (radixArg.type !== "Literal" || typeof radixArg.value !== "number") return;

                const radix = radixArg.value;
                if (!RADIX_MAP.has(radix)) return;

                const stringArg = node.arguments[0];
                if (stringArg.type !== "Literal" || typeof stringArg.value !== "string") return;

                context.report({
                    node,
                    message: `Use ${RADIX_MAP.get(radix)} literals instead of parseInt().`,
                });
            },
        };
    },
};

export default preferNumericLiteralsRule;
