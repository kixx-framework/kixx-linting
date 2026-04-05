/**
 * no-useless-backreference — disallow useless backreferences in regular expressions.
 * Adapted from ESLint's no-useless-backreference rule.
 */

import { findUselessBackreferences } from "./regex-helpers.js";

const noUselessBackreferenceRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            Literal(node) {
                if (!node.regex) return;
                const { pattern, flags } = node.regex;
                const useless = findUselessBackreferences(pattern, flags);
                for (const { ref } of useless) {
                    context.report({
                        node,
                        message: `Backreference '\\${ref}' will be ignored. It references group '${ref}' from within that group, or the group appears after (or is in) a lookbehind.`,
                    });
                }
            },
        };
    },
};

export default noUselessBackreferenceRule;
