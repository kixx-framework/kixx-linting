/**
 * no-useless-escape — disallow unnecessary escape characters.
 * Adapted from ESLint's no-useless-escape rule.
 */

import { RegExpParser, visitRegExpAST } from "../vendor/regexpp/index.js";

const parser = new RegExpParser();

// Characters with special meaning in string escapes
const VALID_STRING_ESCAPES = new Set("\\nrvtbfux0123456789'\"`\r\n\u2028\u2029");
const REGEX_GENERAL_ESCAPES = new Set("\\bcdDfnpPrsStvwWxu0123456789]");
const REGEX_NON_CHARCLASS_ESCAPES = new Set([
    ...REGEX_GENERAL_ESCAPES,
    ..."^/.$*+?[{}|()Bk",
]);

const noUselessEscapeRule = {
    meta: {
        type: "suggestion",
        schema: [],
    },

    create(context) {
        const sourceCode = context.sourceCode;

        function reportAt(node, rangeOffset, escapedChar) {
            const rangeStart = node.range[0] + rangeOffset;
            const start = sourceCode.getLocFromIndex(rangeStart);
            context.report({
                node,
                loc: {
                    start,
                    end: { line: start.line, column: start.column + 1 },
                },
                message: `Unnecessary escape character: \\${escapedChar}.`,
            });
        }

        function checkString(node) {
            // TemplateElement uses node.value.raw; Literal uses node.raw
            const isTemplate = node.type === "TemplateElement";
            const raw = isTemplate ? node.value.raw : node.raw;
            if (!raw) return;
            const quoteChar = isTemplate ? "`" : raw[0]; // ', ", or `

            for (let i = 0; i < raw.length - 1; i++) {
                if (raw[i] === "\\") {
                    const next = raw[i + 1];

                    // Skip valid escapes
                    if (VALID_STRING_ESCAPES.has(next)) {
                        i++;
                        continue;
                    }

                    // Skip escaping the quote character
                    if (!isTemplate && next === quoteChar) {
                        i++;
                        continue;
                    }

                    // Template: `\`` is valid, `\$` before `{` is valid
                    if (isTemplate) {
                        if (next === "`" || next === "$" || next === "{") {
                            i++;
                            continue;
                        }
                    }

                    // Report unnecessary escape
                    reportAt(node, i, next);
                    i++; // Skip the escaped character
                }
            }
        }

        function checkRegex(node) {
            const { pattern, flags } = node.regex;
            const unicode = flags.includes("u");
            const unicodeSets = flags.includes("v");

            let patternNode;
            try {
                patternNode = parser.parsePattern(pattern, 0, pattern.length, {
                    unicode,
                    unicodeSets,
                });
            } catch {
                return; // Ignore invalid patterns
            }

            const characterClassStack = [];

            visitRegExpAST(patternNode, {
                onCharacterClassEnter(cc) { characterClassStack.unshift(cc); },
                onCharacterClassLeave() { characterClassStack.shift(); },
                onCharacterEnter(charNode) {
                    if (!charNode.raw.startsWith("\\")) return;

                    const escapedChar = charNode.raw.slice(1);

                    // If the escape changes the value, it's meaningful
                    if (escapedChar !== String.fromCodePoint(charNode.value)) return;

                    const allowedEscapes = characterClassStack.length
                        ? REGEX_GENERAL_ESCAPES
                        : REGEX_NON_CHARCLASS_ESCAPES;

                    if (allowedEscapes.has(escapedChar)) return;

                    // Special case: '-' in character class (not at edges)
                    if (characterClassStack.length && escapedChar === "-") {
                        const cc = characterClassStack[0];
                        if (
                            cc.start + 1 !== charNode.start &&
                            charNode.end !== cc.end - 1
                        ) {
                            return;
                        }
                    }

                    // Special case: '^' at start of character class
                    if (characterClassStack.length && escapedChar === "^") {
                        const cc = characterClassStack[0];
                        if (cc.start + 1 === charNode.start) return;
                    }

                    // +1 because node.range[0] is the leading `/` and charNode.start is offset within pattern
                    reportAt(node, charNode.start + 1, escapedChar);
                },
            });
        }

        return {
            Literal(node) {
                if (node.regex) {
                    checkRegex(node);
                } else if (typeof node.value === "string") {
                    checkString(node);
                }
            },
            TemplateElement(node) {
                checkString(node);
            },
        };
    },
};

export default noUselessEscapeRule;
