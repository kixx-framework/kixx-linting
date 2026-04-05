/**
 * no-mixed-operators — disallow mixed binary operators without parens to clarify intent.
 * Adapted from ESLint's no-mixed-operators rule.
 */

const ARITHMETIC_OPERATORS = ["+", "-", "*", "/", "%", "**"];
const BITWISE_OPERATORS = ["&", "|", "^", "~", "<<", ">>", ">>>"];
const COMPARISON_OPERATORS = ["==", "!=", "===", "!==", ">", ">=", "<", "<="];
const LOGICAL_OPERATORS = ["&&", "||"];
const RELATIONAL_OPERATORS = ["in", "instanceof"];
const TERNARY_OPERATOR = ["?:"];
const COALESCE_OPERATOR = ["??"];

const DEFAULT_GROUPS = [
    ARITHMETIC_OPERATORS,
    BITWISE_OPERATORS,
    COMPARISON_OPERATORS,
    LOGICAL_OPERATORS,
    RELATIONAL_OPERATORS,
];

const PRECEDENCE = new Map([
    ["??", 1],
    ["||", 2],
    ["&&", 3],
    ["|", 4],
    ["^", 5],
    ["&", 6],
    ["==", 7], ["!=", 7], ["===", 7], ["!==", 7],
    ["<", 8], [">", 8], ["<=", 8], [">=", 8], ["in", 8], ["instanceof", 8],
    ["<<", 9], [">>", 9], [">>>", 9],
    ["+", 10], ["-", 10],
    ["*", 11], ["/", 11], ["%", 11],
    ["**", 12],
]);

function getPrecedence(node) {
    if (node.type === "ConditionalExpression") return 0;
    return PRECEDENCE.get(node.operator) ?? 0;
}

function includesBothInAGroup(groups, left, right) {
    return groups.some(group => group.includes(left) && group.includes(right));
}

function getChildNode(node) {
    return node.type === "ConditionalExpression" ? node.test : node.left;
}

const TARGET_NODE_TYPE = /^(?:Binary|Logical|Conditional)Expression$/u;

const noMixedOperatorsRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    groups: { type: "array" },
                    allowSamePrecedence: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const hasGroups = options.groups && options.groups.length > 0;
        const groups = hasGroups ? options.groups : DEFAULT_GROUPS;
        const allowSamePrecedence = options.allowSamePrecedence !== false;
        const sourceCode = context.sourceCode;

        function isParenthesised(node) {
            const prevToken = sourceCode.getTokenBefore(node);
            const nextToken = sourceCode.getTokenAfter(node);
            return (
                prevToken && nextToken &&
                prevToken.value === "(" &&
                prevToken.range[1] <= node.range[0] &&
                nextToken.value === ")" &&
                nextToken.range[0] >= node.range[1]
            );
        }

        function shouldIgnore(node) {
            const a = node;
            const b = node.parent;
            const bOp = b.type === "ConditionalExpression" ? "?:" : b.operator;
            return (
                !includesBothInAGroup(groups, a.operator, bOp) ||
                (allowSamePrecedence && getPrecedence(a) === getPrecedence(b))
            );
        }

        function isMixedWithParent(node) {
            return (
                node.operator !== node.parent.operator &&
                !isParenthesised(node)
            );
        }

        function getOperatorToken(node) {
            const child = getChildNode(node);
            // Find the token after the child that is not a closing paren
            let token = sourceCode.getTokenAfter(child);
            while (token && token.value === ")") {
                token = sourceCode.getTokenAfter(token);
            }
            return token;
        }

        const reported = new WeakSet();

        function check(node) {
            if (
                TARGET_NODE_TYPE.test(node.parent.type) &&
                isMixedWithParent(node) &&
                !shouldIgnore(node)
            ) {
                const parent = node.parent;
                const left = getChildNode(parent) === node ? node : parent;
                const right = getChildNode(parent) !== node ? node : parent;

                if (!reported.has(left)) {
                    reported.add(left);
                    const token = getOperatorToken(left);
                    context.report({
                        node: left,
                        loc: token ? token.loc : left.loc,
                        message: `Unexpected mix of '${left.operator || "?:"}' and '${right.operator || "?:"}'. Use parentheses to clarify the intended order of operations.`,
                    });
                }
                if (!reported.has(right)) {
                    reported.add(right);
                    const token = getOperatorToken(right);
                    context.report({
                        node: right,
                        loc: token ? token.loc : right.loc,
                        message: `Unexpected mix of '${left.operator || "?:"}' and '${right.operator || "?:"}'. Use parentheses to clarify the intended order of operations.`,
                    });
                }
            }
        }

        return {
            BinaryExpression: check,
            LogicalExpression: check,
        };
    },
};

export default noMixedOperatorsRule;
