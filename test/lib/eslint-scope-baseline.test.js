import {
    describe,
    assert,
    assertEqual,
} from "../deps.js";

import { parse } from "../../lib/parser.js";
import { analyze } from "../../lib/eslint-scope/index.js";

function assertArrayEqual(actual, expected) {
    assertEqual(JSON.stringify(expected), JSON.stringify(actual));
}

function analyzeText(text, args) {
    const {
        ecmaVersion = 2024,
        sourceType = "script",
        globals,
    } = args ?? {};

    const parseResult = parse(text, {
        ecmaVersion,
        sourceType,
    });

    assert(parseResult.ok, parseResult.ok ? "" : parseResult.errors[0].message);

    return {
        ast: parseResult.ast,
        scopeManager: analyze(parseResult.ast, {
            ecmaVersion,
            sourceType,
            globals,
        }),
    };
}

function findFirstNode(node, predicate) {
    if (!node || typeof node !== "object") {
        return null;
    }

    if (predicate(node)) {
        return node;
    }

    for (const value of Object.values(node)) {
        if (Array.isArray(value)) {
            for (const item of value) {
                const foundInArray = findFirstNode(item, predicate);
                if (foundInArray) {
                    return foundInArray;
                }
            }
            continue;
        }

        const found = findFirstNode(value, predicate);
        if (found) {
            return found;
        }
    }

    return null;
}

describe("eslint-scope baseline", ({ it }) => {
    it("captures module scopes, definitions, references, and through", () => {
        const { scopeManager } = analyzeText(
            "import dep from \"m\"; export const value = dep;",
            {
                ecmaVersion: 2024,
                sourceType: "module",
            },
        );

        assertArrayEqual(scopeManager.scopes.map(scope => scope.type), [
            "global",
            "module",
        ]);

        const moduleScope = scopeManager.scopes[1];

        assertArrayEqual(moduleScope.variables.map(variable => variable.name), [
            "dep",
            "value",
        ]);
        assertEqual("ImportBinding", moduleScope.variables[0].defs[0].type);
        assertEqual("Variable", moduleScope.variables[1].defs[0].type);
        assertArrayEqual(
            moduleScope.references.map(reference => {
                return `${reference.identifier.name}:${reference.resolved?.name ?? ""}`;
            }),
            ["value:value", "dep:dep"],
        );
        assertArrayEqual(moduleScope.through.map(reference => reference.identifier.name), []);
    });

    it("resolves configured globals through analyze(globals)", () => {
        const { scopeManager } = analyzeText("window; customValue;", {
            globals: {
                window: "readonly",
            },
        });
        const globalScope = scopeManager.globalScope;

        assert(globalScope !== null);
        assertEqual(true, globalScope.set.has("window"));
        assertEqual(0, globalScope.set.get("window").defs.length);
        assertArrayEqual(
            globalScope.through.map(reference => reference.identifier.name),
            ["customValue"],
        );
    });

    it("preserves acquire, acquireAll, release, and getDeclaredVariables", () => {
        const { ast, scopeManager } = analyzeText(
            "const named = function inner() {}; const x = 1; function f(y) { return y; }",
        );

        const functionExpressionNode = findFirstNode(ast, node => {
            return node.type === "FunctionExpression" && node.id?.name === "inner";
        });
        const xDeclarationNode = findFirstNode(ast, node => {
            return node.type === "VariableDeclaration" &&
                node.declarations?.at(0)?.id?.name === "x";
        });
        const xDeclaratorNode = xDeclarationNode.declarations[0];

        assert(functionExpressionNode !== null);
        assert(xDeclarationNode !== null);

        assertArrayEqual(
            scopeManager.acquireAll(functionExpressionNode).map(scope => scope.type),
            ["function-expression-name", "function"],
        );
        assertEqual("function-expression-name", scopeManager.acquire(functionExpressionNode).type);
        assertEqual("function", scopeManager.acquire(functionExpressionNode, true).type);
        assertEqual("global", scopeManager.release(functionExpressionNode).type);

        assertArrayEqual(
            scopeManager.getDeclaredVariables(xDeclarationNode).map(variable => variable.name),
            ["x"],
        );
        assertArrayEqual(
            scopeManager.getDeclaredVariables(xDeclaratorNode).map(variable => variable.name),
            ["x"],
        );
    });

    it("tracks function-expression name scopes, defaults, destructuring, and arrow references", () => {
        const { scopeManager } = analyzeText(
            "const named = function inner(a = outer) { const {x, y: {z = a}} = obj; return () => inner(z); };",
        );

        assertArrayEqual(scopeManager.scopes.map(scope => scope.type), [
            "global",
            "function-expression-name",
            "function",
            "function",
        ]);

        const globalScope = scopeManager.scopes[0];
        const functionNameScope = scopeManager.scopes[1];
        const functionScope = scopeManager.scopes[2];
        const arrowScope = scopeManager.scopes[3];

        assertArrayEqual(globalScope.variables.map(variable => variable.name), ["named"]);
        assertArrayEqual(globalScope.through.map(reference => reference.identifier.name), ["outer", "obj"]);
        assertArrayEqual(functionNameScope.variables.map(variable => variable.name), ["inner"]);
        assertArrayEqual(functionScope.variables.map(variable => variable.name), ["arguments", "a", "x", "z"]);
        assertArrayEqual(arrowScope.references.map(reference => reference.identifier.name), ["inner", "z"]);
        assertArrayEqual(arrowScope.through.map(reference => reference.identifier.name), ["inner", "z"]);
    });

    it("creates catch and nested block scopes", () => {
        const { scopeManager } = analyzeText(
            "try { throw err; } catch (e) { let local = e; }",
        );

        assertArrayEqual(scopeManager.scopes.map(scope => scope.type), [
            "global",
            "block",
            "catch",
            "block",
        ]);

        const catchScope = scopeManager.scopes[2];
        const catchBodyScope = scopeManager.scopes[3];

        assertArrayEqual(catchScope.variables.map(variable => variable.name), ["e"]);
        assertArrayEqual(catchBodyScope.variables.map(variable => variable.name), ["local"]);
        assertArrayEqual(scopeManager.globalScope.through.map(reference => reference.identifier.name), ["err"]);
    });

    it("creates for/for-in/for-of scopes and preserves order", () => {
        const { scopeManager } = analyzeText(
            "for (let i = 0; i < xs.length; i = i + 1) { let j = i; }" +
            "for (const k in obj) { k; }" +
            "for (const v of arr) { v; }",
        );

        assertArrayEqual(scopeManager.scopes.map(scope => scope.type), [
            "global",
            "for",
            "block",
            "for",
            "block",
            "for",
            "block",
        ]);

        assertArrayEqual(scopeManager.scopes[1].variables.map(variable => variable.name), ["i"]);
        assertArrayEqual(scopeManager.scopes[2].variables.map(variable => variable.name), ["j"]);
        assertArrayEqual(scopeManager.scopes[3].variables.map(variable => variable.name), ["k"]);
        assertArrayEqual(scopeManager.scopes[5].variables.map(variable => variable.name), ["v"]);
        assertArrayEqual(
            scopeManager.globalScope.through.map(reference => reference.identifier.name),
            ["xs", "obj", "arr"],
        );
    });

    it("creates class, class-field-initializer, and class-static-block scopes", () => {
        const { scopeManager } = analyzeText(
            "class C { x = foo; static { bar; let z = 1; } method() { return this.x; } }",
            { ecmaVersion: 2024 },
        );

        assertArrayEqual(scopeManager.scopes.map(scope => scope.type), [
            "global",
            "class",
            "class-field-initializer",
            "class-static-block",
            "function",
        ]);

        assertArrayEqual(
            scopeManager.scopes[2].through.map(reference => reference.identifier.name),
            ["foo"],
        );
        assertArrayEqual(
            scopeManager.scopes[3].variables.map(variable => variable.name),
            ["z"],
        );
        assertArrayEqual(
            scopeManager.scopes[3].through.map(reference => reference.identifier.name),
            ["bar"],
        );
    });

    it("marks direct eval and with scopes as dynamic", () => {
        const evalAnalysis = analyzeText(
            "function f() { eval(\"x\"); return unknownValue; }",
        );
        const evalFunctionScope = evalAnalysis.scopeManager.scopes.find(scope => scope.type === "function");

        assert(evalFunctionScope !== undefined);
        assertEqual(true, evalFunctionScope.directCallToEvalScope);
        assertEqual(true, evalFunctionScope.dynamic);
        assertArrayEqual(
            evalFunctionScope.through.map(reference => reference.identifier.name),
            ["eval", "unknownValue"],
        );

        const withAnalysis = analyzeText("with (obj) { value = value + 1; }");

        assertArrayEqual(withAnalysis.scopeManager.scopes.map(scope => scope.type), [
            "global",
            "with",
            "block",
        ]);

        const withScope = withAnalysis.scopeManager.scopes[1];

        assertEqual(true, withScope.dynamic);
        assertArrayEqual(
            withScope.through.map(reference => reference.identifier.name),
            ["value", "value"],
        );
    });

    it("tracks implicit globals created by assignments", () => {
        const { scopeManager } = analyzeText(
            "assigned = 1; function f() { nestedAssigned = 2; }",
        );
        const globalScope = scopeManager.globalScope;

        assertArrayEqual(
            globalScope.implicit.variables.map(variable => variable.name),
            ["assigned", "nestedAssigned"],
        );
        assertArrayEqual(
            globalScope.implicit.left.map(reference => reference.identifier.name),
            ["assigned", "nestedAssigned"],
        );
        assertArrayEqual(
            globalScope.through.map(reference => reference.identifier.name),
            ["assigned", "nestedAssigned"],
        );
    });
});
