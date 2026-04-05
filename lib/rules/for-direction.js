/**
 * for-direction — enforce "for" loop update clause moving the counter in the right direction.
 * Adapted from ESLint's for-direction rule.
 */

function getCounterVariable(init) {
    if (!init) return null;
    if (init.type === "VariableDeclaration") {
        // for (let i = 0; ...)
        if (init.declarations.length === 1 && init.declarations[0].id.type === "Identifier") {
            return init.declarations[0].id.name;
        }
    } else if (init.type === "AssignmentExpression" && init.left.type === "Identifier") {
        return init.left.name;
    }
    return null;
}

function getTestDirection(test, counter) {
    if (!test || !counter) return null;
    if (test.type !== "BinaryExpression") return null;

    const { operator, left, right } = test;
    const leftName = left.type === "Identifier" ? left.name : null;
    const rightName = right.type === "Identifier" ? right.name : null;

    if (leftName === counter) {
        // i < x, i <= x → counter increases toward test limit
        if (operator === "<" || operator === "<=") return "positive";
        // i > x, i >= x → counter decreases toward test limit
        if (operator === ">" || operator === ">=") return "negative";
    } else if (rightName === counter) {
        // x > i, x >= i → counter increases
        if (operator === ">" || operator === ">=") return "positive";
        // x < i, x <= i → counter decreases
        if (operator === "<" || operator === "<=") return "negative";
    }
    return null;
}

function getUpdateDirection(update, counter) {
    if (!update || !counter) return null;

    if (update.type === "UpdateExpression") {
        const arg = update.argument;
        if (arg.type !== "Identifier" || arg.name !== counter) return null;
        if (update.operator === "++") return "positive";
        if (update.operator === "--") return "negative";
    } else if (update.type === "AssignmentExpression") {
        const left = update.left;
        if (left.type !== "Identifier" || left.name !== counter) return null;
        const right = update.right;

        if (update.operator === "+=" || update.operator === "-=") {
            // Check if right side is a positive number
            if (right.type === "Literal" && typeof right.value === "number") {
                if (update.operator === "+=" && right.value > 0) return "positive";
                if (update.operator === "-=" && right.value > 0) return "negative";
                if (update.operator === "+=" && right.value < 0) return "negative";
                if (update.operator === "-=" && right.value < 0) return "positive";
            }
        }
    }
    return null;
}

const forDirectionRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            ForStatement(node) {
                const counter = getCounterVariable(node.init);
                if (!counter) return;

                const testDir = getTestDirection(node.test, counter);
                if (!testDir) return;

                const updateDir = getUpdateDirection(node.update, counter);
                if (!updateDir) return;

                if (testDir !== updateDir) {
                    context.report({
                        node,
                        message: "The update clause in this loop moves the variable in the wrong direction.",
                    });
                }
            },
        };
    },
};

export default forDirectionRule;
