/**
 * no-unreachable-loop — disallow loops with a body that allows only one iteration.
 * Adapted from ESLint's no-unreachable-loop rule.
 */

const LOOP_TYPES = new Set([
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
]);

/**
 * Checks if a loop body always exits on the first iteration.
 * Looks for unconditional return/throw/break/continue at the top level of the body.
 */
function alwaysExitsOnFirstIteration(node) {
    const body = node.body;
    if (!body) return false;

    const stmts = body.type === "BlockStatement" ? body.body : [body];

    // Check if any top-level statement is an unconditional exit
    for (const stmt of stmts) {
        if (isUnconditionalExit(stmt, node)) return true;
    }
    return false;
}

function isUnconditionalExit(stmt, loopNode) {
    if (!stmt) return false;
    switch (stmt.type) {
        case "ReturnStatement":
        case "ThrowStatement":
            return true;
        case "BreakStatement":
            // Break without label exits the loop; with label may exit outer construct
            return !stmt.label;
        case "ContinueStatement":
            // A continue does not exit the loop — it just skips to next iteration
            return false;
        case "BlockStatement": {
            // An unconditional block that starts with an exit is an exit
            for (const s of stmt.body) {
                if (isUnconditionalExit(s, loopNode)) return true;
                // If we reach a statement that's not an exit, the block doesn't always exit
                break;
            }
            return false;
        }
        default:
            return false;
    }
}

const noUnreachableLoopRule = {
    meta: {
        type: "problem",
        schema: [
            {
                type: "object",
                properties: {
                    ignore: {
                        type: "array",
                        items: {
                            enum: ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement"],
                        },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const ignore = new Set(context.options[0]?.ignore ?? []);

        function checkLoop(node) {
            if (ignore.has(node.type)) return;
            if (alwaysExitsOnFirstIteration(node)) {
                context.report({
                    node,
                    message: "Invalid loop. Its body allows only one iteration.",
                });
            }
        }

        return {
            WhileStatement: checkLoop,
            DoWhileStatement: checkLoop,
            ForStatement: checkLoop,
            ForInStatement: checkLoop,
            ForOfStatement: checkLoop,
        };
    },
};

export default noUnreachableLoopRule;
