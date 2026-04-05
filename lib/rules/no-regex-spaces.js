/**
 * no-regex-spaces — disallow multiple spaces in regular expressions.
 * Adapted from ESLint's no-regex-spaces rule.
 */

import { findRedundantSpaces } from "./regex-helpers.js";

const noRegexSpacesRule = {
    meta: { type: "suggestion", schema: [] },
    create(context) {
        return {
            Literal(node) {
                if (!node.regex) return;
                const { pattern, flags } = node.regex;
                const spaces = findRedundantSpaces(pattern, flags);
                if (spaces.length > 0) {
                    const { length } = spaces[0];
                    context.report({
                        node,
                        message: `Spaces are hard to count. Use {${length}}.`,
                    });
                }
            },
        };
    },
};

export default noRegexSpacesRule;
