/**
 * no-regex-spaces — disallow multiple spaces in regular expressions.
 * Adapted from ESLint's no-regex-spaces rule.
 */

import { findRedundantSpaces, parseRegExpConstructorArgs } from "./regex-helpers.js";

function scopeContainsNode(scope, node) {
    const block = scope.block;
    if (!block) {
        return false;
    }

    const blockStart = block.range ? block.range[0] : block.start;
    const blockEnd = block.range ? block.range[1] : block.end;
    const nodeStart = node.range ? node.range[0] : node.start;
    const nodeEnd = node.range ? node.range[1] : node.end;

    return blockStart <= nodeStart && blockEnd >= nodeEnd;
}

function hasShadowedDefinition(sourceCode, node, name) {
    return sourceCode.scopeManager.scopes.some(scope =>
        scopeContainsNode(scope, node) &&
        scope.variables.some(variable => variable.name === name && variable.defs.length > 0),
    );
}

function parseDirectiveGlobals(sourceCode) {
    const result = new Map();

    for (const comment of sourceCode.getAllComments()) {
        if (comment.type !== "Block") {
            continue;
        }

        const match = /^\s*globals?\s+([\s\S]*)$/iu.exec(comment.value);
        if (!match) {
            continue;
        }

        for (const item of match[1].split(",")) {
            const declaration = item.trim();
            if (!declaration) {
                continue;
            }

            const [nameRaw, valueRaw = ""] = declaration.split(":");
            const name = nameRaw.trim();
            const value = valueRaw.trim().toLowerCase();
            if (!name) {
                continue;
            }

            result.set(name, value);
        }
    }

    return result;
}

const noRegexSpacesRule = {
    meta: { type: "suggestion", schema: [] },
    create(context) {
        const configuredGlobals = context.languageOptions?.globals ?? {};
        const directiveGlobals = parseDirectiveGlobals(context.sourceCode);

        function isRegExpEnabled(referenceNode) {
            if (hasShadowedDefinition(context.sourceCode, referenceNode, "RegExp")) {
                return false;
            }

            if (configuredGlobals.RegExp === "off") {
                return false;
            }

            return directiveGlobals.get("RegExp") !== "off";
        }

        function reportFirstRedundantSpace(node, pattern, flags) {
            const spaces = findRedundantSpaces(pattern, flags);
            if (spaces.length === 0) {
                return;
            }

            const { length } = spaces[0];
            context.report({
                node,
                message: `Spaces are hard to count. Use {${length}}.`,
            });
        }

        return {
            Literal(node) {
                if (!node.regex) {
                    return;
                }

                reportFirstRedundantSpace(node, node.regex.pattern, node.regex.flags);
            },
            CallExpression(node) {
                if (
                    node.callee.type !== "Identifier" ||
                    node.callee.name !== "RegExp" ||
                    !isRegExpEnabled(node.callee)
                ) {
                    return;
                }

                const parsed = parseRegExpConstructorArgs(node);
                if (!parsed) {
                    return;
                }

                const patternArg = node.arguments[0];
                const rawContent = typeof patternArg.raw === "string"
                    ? patternArg.raw.slice(1, -1)
                    : "";

                if (!/ {2,}/u.test(rawContent)) {
                    return;
                }

                reportFirstRedundantSpace(node, parsed.pattern, parsed.flags);
            },
            NewExpression(node) {
                if (
                    node.callee.type !== "Identifier" ||
                    node.callee.name !== "RegExp" ||
                    !isRegExpEnabled(node.callee)
                ) {
                    return;
                }

                const parsed = parseRegExpConstructorArgs(node);
                if (!parsed) {
                    return;
                }

                const patternArg = node.arguments[0];
                const rawContent = typeof patternArg.raw === "string"
                    ? patternArg.raw.slice(1, -1)
                    : "";

                if (!/ {2,}/u.test(rawContent)) {
                    return;
                }

                reportFirstRedundantSpace(node, parsed.pattern, parsed.flags);
            },
        };
    },
};

export default noRegexSpacesRule;
