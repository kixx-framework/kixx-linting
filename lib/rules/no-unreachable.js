/**
 * no-unreachable — disallow unreachable code after return, throw, continue, and break statements.
 * Uses a simple AST-based approach: checks for statements after unconditional jumps
 * within the same block.
 */

const JUMP_STATEMENTS = new Set([
    "ReturnStatement",
    "ThrowStatement",
    "BreakStatement",
    "ContinueStatement",
]);

/**
 * Check if a statement is an unconditional jump (exit from current block).
 */
function isJump(node) {
    return JUMP_STATEMENTS.has(node.type);
}

/**
 * Check a list of statements for code after a jump.
 */
function checkStatements(statements, context) {
    let foundJump = false;
    for (const stmt of statements) {
        if (foundJump) {
            context.report({
                node: stmt,
                message: "Unreachable code.",
            });
            // Only report one per block to avoid cascade noise
            break;
        }
        if (isJump(stmt)) {
            foundJump = true;
        }
    }
}

const noUnreachableRule = {
    meta: { type: "problem", schema: [] },
    create(context) {
        return {
            BlockStatement(node) {
                checkStatements(node.body, context);
            },
            SwitchCase(node) {
                checkStatements(node.consequent, context);
            },
            Program(node) {
                checkStatements(node.body, context);
            },
        };
    },
};

export default noUnreachableRule;
