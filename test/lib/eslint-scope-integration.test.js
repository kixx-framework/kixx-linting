import {
    describe,
    assertEqual,
} from "../deps.js";

import { lintText } from "../../mod.js";

function lintWith(text, rules, languageOptions) {
    return lintText(
        { text },
        rules,
        {
            sourceType: "script",
            ...(languageOptions ?? {}),
        },
    );
}

function summarizeMessages(messages) {
    return messages.map(message => {
        return `${message.ruleId}@${message.line}:${message.column}`;
    });
}

function assertSummaries(result, expected) {
    assertEqual(
        JSON.stringify(expected),
        JSON.stringify(summarizeMessages(result.messages)),
    );
}

describe("eslint-scope integration", ({ it }) => {
    it("keeps no-undef behavior for unresolved references", () => {
        const result = lintWith(
            "missingValue;",
            { "no-undef": ["error"] },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["no-undef@1:0"]);
    });

    it("keeps no-unused-vars behavior", () => {
        const result = lintWith(
            "const unused = 1;",
            { "no-unused-vars": ["error"] },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["no-unused-vars@1:6"]);
    });

    it("keeps no-use-before-define behavior", () => {
        const result = lintWith(
            "foo(); function foo() {}",
            { "no-use-before-define": ["error", { functions: true }] },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["no-use-before-define@1:0"]);
    });

    it("keeps prefer-const behavior", () => {
        const result = lintWith(
            "let value = 1; console.log(value);",
            {
                "prefer-const": ["error"],
                "no-console": ["off"],
            },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["prefer-const@1:4"]);
    });

    it("keeps no-invalid-this behavior for script and module source types", () => {
        const scriptResult = lintWith(
            "\"use strict\"; function f() { return this; }",
            { "no-invalid-this": ["error"] },
            { sourceType: "script" },
        );
        const moduleResult = lintWith(
            "this;",
            { "no-invalid-this": ["error"] },
            { sourceType: "module" },
        );

        assertEqual(1, scriptResult.errorCount);
        assertEqual(1, moduleResult.errorCount);
        assertSummaries(scriptResult, ["no-invalid-this@1:36"]);
        assertSummaries(moduleResult, ["no-invalid-this@1:0"]);
    });

    it("keeps no-loop-func behavior", () => {
        const result = lintWith(
            "for (var i = 0; i < items.length; i = i + 1) { funcs.push(function() { return i; }); }",
            {
                "no-loop-func": ["error"],
                "no-undef": ["off"],
            },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["no-loop-func@1:58"]);
    });

    it("keeps prefer-arrow-callback behavior", () => {
        const result = lintWith(
            "[1, 2, 3].map(function(n) { return n * 2; });",
            { "prefer-arrow-callback": ["error"] },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["prefer-arrow-callback@1:14"]);
    });

    it("keeps prefer-rest-params behavior", () => {
        const result = lintWith(
            "function f() { return arguments[0]; }",
            { "prefer-rest-params": ["error"] },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["prefer-rest-params@1:22"]);
    });

    it("keeps preserve-caught-error behavior", () => {
        const result = lintWith(
            "try { throw new Error(\"x\"); } catch (err) { throw new Error(\"y\"); }",
            { "preserve-caught-error": ["error"] },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["preserve-caught-error@1:44"]);
    });

    it("keeps no-console behavior", () => {
        const result = lintWith(
            "console.log(value);",
            {
                "no-console": ["error"],
                "no-undef": ["off"],
            },
        );

        assertEqual(1, result.errorCount);
        assertSummaries(result, ["no-console@1:0"]);
    });

    it("keeps configured globals resolution behavior", () => {
        const result = lintWith(
            "window;",
            { "no-undef": ["error"] },
            {
                globals: {
                    window: "readonly",
                },
            },
        );

        assertEqual(0, result.errorCount);
        assertSummaries(result, []);
    });

    it("keeps /*global*/ comment behavior for no-undef and no-unused-vars", () => {
        const usedFromComment = lintWith(
            "/*global browserGlobal*/\nbrowserGlobal;",
            {
                "no-undef": ["error"],
                "no-unused-vars": ["error"],
            },
        );
        const unusedFromComment = lintWith(
            "/*global browserGlobal*/",
            {
                "no-undef": ["error"],
                "no-unused-vars": ["error"],
            },
        );

        assertEqual(0, usedFromComment.errorCount);
        assertSummaries(usedFromComment, []);

        assertEqual(1, unusedFromComment.errorCount);
        assertSummaries(unusedFromComment, ["no-unused-vars@1:0"]);
    });
});
