/**
 * space-infix-ops — require spacing around infix operators.
 * Adapted from ESLint's space-infix-ops rule.
 */

function isEqToken(token) {
    return token && token.value === "=" && token.type === "Punctuator";
}

const spaceInfixOpsRule = {
    meta: {
        type: "layout",
        schema: [
            {
                type: "object",
                properties: {
                    int32Hint: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const int32Hint = context.options[0] ? context.options[0].int32Hint === true : false;
        const sourceCode = context.sourceCode;

        function getFirstNonSpacedToken(left, right, op) {
            const operator = sourceCode.getFirstTokenBetween(
                left,
                right,
                token => token.value === op,
            );
            if (!operator) return null;
            const prev = sourceCode.getTokenBefore(operator);
            const next = sourceCode.getTokenAfter(operator);

            if (
                !prev || !next ||
                !sourceCode.isSpaceBetween(prev, operator) ||
                !sourceCode.isSpaceBetween(operator, next)
            ) {
                return operator;
            }
            return null;
        }

        function report(mainNode, culpritToken) {
            context.report({
                node: mainNode,
                loc: culpritToken.loc,
                message: `Operator '${culpritToken.value}' must be spaced.`,
            });
        }

        function checkBinary(node) {
            const leftNode = node.left;
            const rightNode = node.right;
            const operator = node.operator || "=";
            const nonSpacedNode = getFirstNonSpacedToken(leftNode, rightNode, operator);
            if (nonSpacedNode) {
                if (!(int32Hint && sourceCode.getText(node).endsWith("|0"))) {
                    report(node, nonSpacedNode);
                }
            }
        }

        function checkConditional(node) {
            const nonSpacedConsequentNode = getFirstNonSpacedToken(node.test, node.consequent, "?");
            const nonSpacedAlternateNode = getFirstNonSpacedToken(node.consequent, node.alternate, ":");
            if (nonSpacedConsequentNode) report(node, nonSpacedConsequentNode);
            if (nonSpacedAlternateNode) report(node, nonSpacedAlternateNode);
        }

        function checkVar(node) {
            const leftNode = node.id;
            const rightNode = node.init;
            if (rightNode) {
                const nonSpacedNode = getFirstNonSpacedToken(leftNode, rightNode, "=");
                if (nonSpacedNode) report(node, nonSpacedNode);
            }
        }

        return {
            AssignmentExpression: checkBinary,
            AssignmentPattern: checkBinary,
            BinaryExpression: checkBinary,
            LogicalExpression: checkBinary,
            ConditionalExpression: checkConditional,
            VariableDeclarator: checkVar,

            PropertyDefinition(node) {
                if (!node.value) return;
                const operatorToken = sourceCode.getTokenBefore(node.value, isEqToken);
                if (!operatorToken) return;
                const leftToken = sourceCode.getTokenBefore(operatorToken);
                const rightToken = sourceCode.getTokenAfter(operatorToken);
                if (
                    !leftToken || !rightToken ||
                    !sourceCode.isSpaceBetween(leftToken, operatorToken) ||
                    !sourceCode.isSpaceBetween(operatorToken, rightToken)
                ) {
                    report(node, operatorToken);
                }
            },
        };
    },
};

export default spaceInfixOpsRule;
