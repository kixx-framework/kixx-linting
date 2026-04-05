/**
 * no-duplicate-case — disallow duplicate case labels.
 * Adapted from ESLint's no-duplicate-case rule.
 */

function getTokensText(node, sourceCode) {
    const tokens = sourceCode.getTokens(node);
    return tokens.map(t => t.value).join("");
}

const noDuplicateCaseRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        const sourceCode = context.sourceCode;
        return {
            SwitchStatement(node) {
                const previousTests = [];
                for (const switchCase of node.cases) {
                    if (!switchCase.test) continue;
                    const testKey = getTokensText(switchCase.test, sourceCode);
                    if (previousTests.includes(testKey)) {
                        context.report({
                            node: switchCase,
                            message: "Duplicate case label.",
                        });
                    } else {
                        previousTests.push(testKey);
                    }
                }
            },
        };
    },
};

export default noDuplicateCaseRule;
