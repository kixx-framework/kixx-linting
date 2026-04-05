/**
 * func-style — enforce the consistent use of either function declarations or expressions.
 * Adapted from ESLint's func-style rule.
 */

const funcStyleRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                enum: ["declaration", "expression"],
            },
            {
                type: "object",
                properties: {
                    allowArrowFunctions: { type: "boolean" },
                    overrides: {
                        type: "object",
                        properties: {
                            namedExports: { enum: ["declaration", "expression", "ignore"] },
                        },
                        additionalProperties: false,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const style = context.options[0] ?? "expression";
        const allowArrowFunctions = context.options[1]?.allowArrowFunctions ?? false;

        return {
            FunctionDeclaration(node) {
                if (style === "expression") {
                    // Function declarations are disallowed when style is "expression"
                    // Unless it's a named export, which might have overrides
                    context.report({
                        node,
                        message: "Expected a function expression.",
                    });
                }
            },
            FunctionExpression(node) {
                if (style !== "declaration") return;
                // In "declaration" style, function expressions assigned to variables
                // should be declarations instead
                const parent = node.parent;
                if (
                    parent &&
                    parent.type === "VariableDeclarator" &&
                    parent.id &&
                    parent.id.type === "Identifier"
                ) {
                    context.report({
                        node,
                        message: "Expected a function declaration.",
                    });
                }
            },
            ArrowFunctionExpression(node) {
                if (style !== "declaration") return;
                if (allowArrowFunctions) return;
                const parent = node.parent;
                if (
                    parent &&
                    parent.type === "VariableDeclarator" &&
                    parent.id &&
                    parent.id.type === "Identifier"
                ) {
                    context.report({
                        node,
                        message: "Expected a function declaration.",
                    });
                }
            },
        };
    },
};

export default funcStyleRule;
