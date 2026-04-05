/**
 * no-dupe-else-if — disallow duplicate conditions in if-else-if chains.
 * Adapted from ESLint's no-dupe-else-if rule.
 */

function getConditionsInAndExpressions(node) {
    if (node.type === "LogicalExpression" && node.operator === "&&") {
        return [...getConditionsInAndExpressions(node.left), ...getConditionsInAndExpressions(node.right)];
    }
    return [node];
}

function getTokensText(node, sourceCode) {
    const tokens = sourceCode.getTokens(node);
    return tokens.map(t => t.value).join("");
}

const noDupeElseIfRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        const sourceCode = context.sourceCode;
        return {
            IfStatement(node) {
                const conditions = getConditionsInAndExpressions(node.test);
                const conditionTexts = conditions.map(c => getTokensText(c, sourceCode));

                // Walk up through ancestor if-else chains
                let current = node.parent;
                while (current) {
                    if (current.type === "IfStatement" && current.alternate === node) {
                        // node is the else branch of this parent if
                        const parentConditions = getConditionsInAndExpressions(current.test);
                        const parentTexts = parentConditions.map(c => getTokensText(c, sourceCode));

                        // Check if any of node's conditions also appear in the parent's conditions
                        for (const cText of conditionTexts) {
                            if (parentTexts.includes(cText)) {
                                context.report({
                                    node: node.test,
                                    message: "This branch can never execute. Its condition is a duplicate or covered by previous conditions in the if-else-if chain.",
                                });
                                return;
                            }
                        }
                        node = current;
                        current = current.parent;
                    } else {
                        break;
                    }
                }
            },
        };
    },
};

export default noDupeElseIfRule;
