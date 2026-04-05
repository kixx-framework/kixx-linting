/**
 * space-unary-ops — enforce consistent spacing before or after unary operators.
 * Adapted from ESLint's space-unary-ops rule.
 */

const spaceUnaryOpsRule = {
    meta: {
        type: "layout",
        schema: [
            {
                type: "object",
                properties: {
                    words: { type: "boolean" },
                    nonwords: { type: "boolean" },
                    overrides: {
                        type: "object",
                        additionalProperties: { type: "boolean" },
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || { words: true, nonwords: false };
        const sourceCode = context.sourceCode;

        function isFirstBangInBangBangExpression(node) {
            return (
                node &&
                node.type === "UnaryExpression" &&
                node.operator === "!" &&
                node.argument &&
                node.argument.type === "UnaryExpression" &&
                node.argument.operator === "!"
            );
        }

        function overrideExistsForOperator(operator) {
            return options.overrides && Object.hasOwn(options.overrides, operator);
        }

        function overrideEnforcesSpaces(operator) {
            return options.overrides[operator];
        }

        function verifyWordHasSpaces(node, firstToken, secondToken, word) {
            if (secondToken.range[0] === firstToken.range[1]) {
                context.report({
                    node,
                    message: `Unary word operator '${word}' must be followed by whitespace.`,
                });
            }
        }

        function verifyWordDoesntHaveSpaces(node, firstToken, secondToken, word) {
            if (secondToken.range[0] > firstToken.range[1]) {
                context.report({
                    node,
                    message: `Unexpected space after unary word operator '${word}'.`,
                });
            }
        }

        function checkUnaryWordOperatorForSpaces(node, firstToken, secondToken, word) {
            if (overrideExistsForOperator(word)) {
                if (overrideEnforcesSpaces(word)) {
                    verifyWordHasSpaces(node, firstToken, secondToken, word);
                } else {
                    verifyWordDoesntHaveSpaces(node, firstToken, secondToken, word);
                }
            } else if (options.words) {
                verifyWordHasSpaces(node, firstToken, secondToken, word);
            } else {
                verifyWordDoesntHaveSpaces(node, firstToken, secondToken, word);
            }
        }

        function verifyNonWordsHaveSpaces(node, firstToken, secondToken) {
            if (node.prefix) {
                if (isFirstBangInBangBangExpression(node)) return;
                if (firstToken.range[1] === secondToken.range[0]) {
                    context.report({
                        node,
                        message: `Unary operator '${firstToken.value}' must be followed by whitespace.`,
                    });
                }
            } else {
                if (firstToken.range[1] === secondToken.range[0]) {
                    context.report({
                        node,
                        message: `Space is required before unary expressions '${secondToken.value}'.`,
                    });
                }
            }
        }

        function verifyNonWordsDontHaveSpaces(node, firstToken, secondToken) {
            if (node.prefix) {
                if (secondToken.range[0] > firstToken.range[1]) {
                    context.report({
                        node,
                        message: `Unexpected space after unary operator '${firstToken.value}'.`,
                    });
                }
            } else {
                if (secondToken.range[0] > firstToken.range[1]) {
                    context.report({
                        node,
                        message: `Unexpected space before unary operator '${secondToken.value}'.`,
                    });
                }
            }
        }

        function checkForSpacesAfterYield(node) {
            const tokens = sourceCode.getFirstTokens(node, 3);
            const word = "yield";
            if (!node.argument || node.delegate) return;
            checkUnaryWordOperatorForSpaces(node, tokens[0], tokens[1], word);
        }

        function checkForSpacesAfterAwait(node) {
            const tokens = sourceCode.getFirstTokens(node, 3);
            checkUnaryWordOperatorForSpaces(node, tokens[0], tokens[1], "await");
        }

        function checkForSpaces(node) {
            const tokens =
                node.type === "UpdateExpression" && !node.prefix
                    ? sourceCode.getLastTokens(node, 2)
                    : sourceCode.getFirstTokens(node, 2);

            if (tokens.length < 2) return;
            const firstToken = tokens[0];
            const secondToken = tokens[1];

            if (
                (node.type === "NewExpression" || node.prefix) &&
                firstToken.type === "Keyword"
            ) {
                checkUnaryWordOperatorForSpaces(node, firstToken, secondToken, firstToken.value);
                return;
            }

            const operator = node.prefix ? tokens[0].value : tokens[1].value;

            if (overrideExistsForOperator(operator)) {
                if (overrideEnforcesSpaces(operator)) {
                    verifyNonWordsHaveSpaces(node, firstToken, secondToken);
                } else {
                    verifyNonWordsDontHaveSpaces(node, firstToken, secondToken);
                }
            } else if (options.nonwords) {
                verifyNonWordsHaveSpaces(node, firstToken, secondToken);
            } else {
                verifyNonWordsDontHaveSpaces(node, firstToken, secondToken);
            }
        }

        return {
            UnaryExpression: checkForSpaces,
            UpdateExpression: checkForSpaces,
            NewExpression: checkForSpaces,
            YieldExpression: checkForSpacesAfterYield,
            AwaitExpression: checkForSpacesAfterAwait,
        };
    },
};

export default spaceUnaryOpsRule;
