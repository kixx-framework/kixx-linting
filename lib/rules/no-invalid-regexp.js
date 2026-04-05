/**
 * no-invalid-regexp — disallow invalid regular expression strings in RegExp constructors.
 * Adapted from ESLint's no-invalid-regexp rule.
 */

function isRegExpConstructor(node) {
    if (node.type !== "CallExpression" && node.type !== "NewExpression") return false;
    const callee = node.callee;
    return callee.type === "Identifier" && callee.name === "RegExp";
}

function getStringValue(node) {
    if (node.type === "Literal" && typeof node.value === "string") return node.value;
    return null;
}

const VALID_FLAGS = new Set(["d", "g", "i", "m", "s", "u", "v", "y"]);

function validateFlags(flags, allowedFlags) {
    const seen = new Set();
    for (const flag of flags) {
        if (!VALID_FLAGS.has(flag) && !(allowedFlags && allowedFlags.includes(flag))) return false;
        if (seen.has(flag)) return false;
        seen.add(flag);
    }
    return true;
}

const noInvalidRegexpRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    allowConstructorFlags: {
                        type: "array",
                        items: { type: "string" },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const allowedFlags = context.options[0]?.allowConstructorFlags ?? [];

        function checkRegExpConstructor(node) {
            if (!isRegExpConstructor(node)) return;

            const [patternArg, flagsArg] = node.arguments;
            const patternStr = patternArg ? getStringValue(patternArg) : null;
            const flagsStr = flagsArg ? getStringValue(flagsArg) : null;

            if (flagsStr !== null && !validateFlags(flagsStr, allowedFlags)) {
                context.report({
                    node,
                    message: `Invalid flags supplied to RegExp constructor '${flagsStr}'.`,
                });
                return;
            }

            if (patternStr !== null) {
                try {
                    new RegExp(patternStr, flagsStr ?? ""); // eslint-disable-line no-new
                } catch (e) {
                    context.report({
                        node,
                        message: `Invalid regular expression: /${patternStr}/: ${e.message}`,
                    });
                }
            }
        }

        return {
            CallExpression: checkRegExpConstructor,
            NewExpression: checkRegExpConstructor,

            Literal(node) {
                if (!node.regex) return;
                const { pattern, flags } = node.regex;
                try {
                    new RegExp(pattern, flags); // eslint-disable-line no-new
                } catch (e) {
                    context.report({
                        node,
                        message: `Invalid regular expression: /${pattern}/${flags}: ${e.message}`,
                    });
                }
            },
        };
    },
};

export default noInvalidRegexpRule;
