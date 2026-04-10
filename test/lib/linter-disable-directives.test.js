import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../deps.js";

import { lintText } from "../../mod.js";

const RULES = {
    "no-console": ["error"],
    "no-debugger": ["error"],
    semi: ["error", "always"],
};

function lintWithDisableDirectiveCoverage(text) {
    return lintText({ text }, RULES);
}

function toRuleSummaries(messages) {
    return messages.map(message => `${message.ruleId}@${message.line}`);
}

function assertRuleSummaries(expected, messages) {
    assertEqual(JSON.stringify(expected), JSON.stringify(toRuleSummaries(messages)));
}

describe("linter disable directives", ({ it }) => {
    it("suppresses same-line diagnostics for line comments", () => {
        const result = lintWithDisableDirectiveCoverage("console.log(foo); // eslint-disable-line no-console");

        assertEqual(0, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries([], result.messages);
    });

    it("suppresses same-line diagnostics for block comments", () => {
        const result = lintWithDisableDirectiveCoverage("console.log(foo); /* eslint-disable-line no-console */");

        assertEqual(0, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries([], result.messages);
    });

    it("suppresses next-line diagnostics for line comments", () => {
        const result = lintWithDisableDirectiveCoverage("// eslint-disable-next-line no-console\nconsole.log(foo);");

        assertEqual(0, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries([], result.messages);
    });

    it("suppresses next-line diagnostics for block comments", () => {
        const result = lintWithDisableDirectiveCoverage("/* eslint-disable-next-line no-console */\nconsole.log(foo);");

        assertEqual(0, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries([], result.messages);
    });

    it("supports multiline block-comment rule lists for next-line suppression", () => {
        const result = lintWithDisableDirectiveCoverage(
            "/* eslint-disable-next-line no-console,\n" +
            "no-debugger */\n" +
            "console.log(foo); debugger;",
        );

        assertEqual(0, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries([], result.messages);
    });

    it("suppresses multiple listed rules on the same line", () => {
        const result = lintWithDisableDirectiveCoverage(
            "console.log(foo); debugger; // eslint-disable-line no-console, no-debugger",
        );

        assertEqual(0, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries([], result.messages);
    });

    it("keeps unmatched diagnostics on a targeted line", () => {
        const result = lintWithDisableDirectiveCoverage("console.log(foo) // eslint-disable-line no-console");

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["semi@1"], result.messages);

        result.messages.forEach((message) => {
            assertNonEmptyString(message.message);
        });
    });

    it("suppresses all diagnostics inside a bare block disabled range", () => {
        const result = lintWithDisableDirectiveCoverage(
            "/* eslint-disable */\n" +
            "console.log(foo)\n" +
            "debugger;\n" +
            "/* eslint-enable */\n" +
            "console.log(bar);",
        );

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-console@5"], result.messages);
    });

    it("suppresses only listed rules inside a rule-specific block disabled range", () => {
        const result = lintWithDisableDirectiveCoverage(
            "/* eslint-disable no-console */\n" +
            "console.log(foo)\n" +
            "debugger;\n" +
            "/* eslint-enable no-console */\n" +
            "console.log(bar);",
        );

        assertEqual(3, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["semi@2", "no-debugger@3", "no-console@5"], result.messages);
    });

    it("suppresses multiple listed rules inside a block disabled range", () => {
        const result = lintWithDisableDirectiveCoverage(
            "/* eslint-disable no-console, no-debugger, no-console */\n" +
            "console.log(foo); debugger;\n" +
            "/* eslint-enable no-console, no-debugger */\n" +
            "debugger;",
        );

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-debugger@4"], result.messages);
    });

    it("treats a top-of-file block disable without enable as file-wide suppression", () => {
        const result = lintWithDisableDirectiveCoverage(
            "/* eslint-disable no-console */\n" +
            "console.log(foo);\n" +
            "debugger;\n" +
            "console.log(bar);",
        );

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-debugger@3"], result.messages);
    });

    it("does not suppress malformed directive text", () => {
        const result = lintWithDisableDirectiveCoverage("console.log(foo); // eslint-disable-lin no-console");

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-console@1"], result.messages);
    });

    it("does not suppress when the directive has an empty rule list", () => {
        const result = lintWithDisableDirectiveCoverage("console.log(foo); // eslint-disable-line");

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-console@1"], result.messages);
    });

    it("does not suppress unknown rule names", () => {
        const result = lintWithDisableDirectiveCoverage("console.log(foo); // eslint-disable-line not-a-rule");

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-console@1"], result.messages);
    });

    it("does not suppress diagnostics on unrelated lines", () => {
        const result = lintWithDisableDirectiveCoverage(
            "// eslint-disable-next-line no-console\n" +
            "const value = 1;\n" +
            "console.log(value);",
        );

        assertEqual(1, result.errorCount);
        assertEqual(0, result.warningCount);
        assertRuleSummaries(["no-console@3"], result.messages);
    });
});
