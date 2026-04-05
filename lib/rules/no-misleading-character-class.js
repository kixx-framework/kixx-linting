/**
 * no-misleading-character-class — disallow characters which are made with multiple code points in character class syntax.
 * Adapted from ESLint's no-misleading-character-class rule.
 */

import { hasMisleadingCharacterClass } from "./regex-helpers.js";

const noMisleadingCharacterClassRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            Literal(node) {
                if (!node.regex) return;
                const { pattern, flags } = node.regex;
                if (hasMisleadingCharacterClass(pattern, flags)) {
                    context.report({
                        node,
                        message: "Unexpected surrogate pair in character class. Use the 'u' flag.",
                    });
                }
            },
        };
    },
};

export default noMisleadingCharacterClassRule;
