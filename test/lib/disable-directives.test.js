import {
    describe,
    assertEqual,
} from "../deps.js";

import { parse } from "../../lib/parser.js";
import { SourceCode } from "../../lib/source-code.js";
import { collectDisableDirectives } from "../../lib/disable-directives.js";

function createSourceCode(text) {
    const parseResult = parse(text);

    if (!parseResult.ok) {
        throw new Error(`Expected parse to succeed for test input: ${text}`);
    }

    return new SourceCode({
        text,
        ast: parseResult.ast,
        tokens: parseResult.tokens,
        comments: parseResult.comments,
        scopeManager: null,
        visitorKeys: null,
    });
}

function normalizeDirectiveIndex(directiveIndex) {
    return Array.from(directiveIndex.entries())
        .sort((left, right) => left[0] - right[0])
        .map(([line, ruleIds]) => [
            line,
            Array.from(ruleIds).sort(),
        ]);
}

function assertSuppressed(expected, disableDirectives, message) {
    assertEqual(expected, disableDirectives.isSuppressed(message));
}

describe("disable directives", ({ it }) => {
    it("normalizes whitespace for line and block comments", () => {
        const sourceCode = createSourceCode(
            "//   eslint-disable-line   no-console ,   no-debugger  \n" +
            "/* eslint-disable-next-line   semi , no-console */\n" +
            "console.log(foo)\n",
        );

        const directiveIndex = collectDisableDirectives(sourceCode);

        assertEqual(
            JSON.stringify([
                [1, ["no-console", "no-debugger"]],
                [3, ["no-console", "semi"]],
            ]),
            JSON.stringify(normalizeDirectiveIndex(directiveIndex)),
        );
    });

    it("supports commas with newlines and strips trailing explanatory text", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable-next-line no-console,\n" +
            "   no-debugger,\n" +
            "   semi because this line is covered elsewhere */\n" +
            "console.log(foo); debugger\n",
        );

        const directiveIndex = collectDisableDirectives(sourceCode);

        assertEqual(
            JSON.stringify([
                [4, ["no-console", "no-debugger", "semi"]],
            ]),
            JSON.stringify(normalizeDirectiveIndex(directiveIndex)),
        );
    });

    it("deduplicates repeated rule ids", () => {
        const sourceCode = createSourceCode(
            "console.log(foo); // eslint-disable-line no-console, no-console, semi, semi\n",
        );

        const directiveIndex = collectDisableDirectives(sourceCode);

        assertEqual(
            JSON.stringify([
                [1, ["no-console", "semi"]],
            ]),
            JSON.stringify(normalizeDirectiveIndex(directiveIndex)),
        );
    });

    it("computes target lines from comment locations for both directive kinds", () => {
        const sourceCode = createSourceCode(
            "console.log(foo); // eslint-disable-line no-console\n" +
            "/* eslint-disable-next-line\n" +
            "   no-debugger */\n" +
            "debugger;\n",
        );

        const directiveIndex = collectDisableDirectives(sourceCode);

        assertEqual(
            JSON.stringify([
                [1, ["no-console"]],
                [4, ["no-debugger"]],
            ]),
            JSON.stringify(normalizeDirectiveIndex(directiveIndex)),
        );
    });

    it("returns a deterministic line-keyed map when multiple comments target different lines", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable-next-line no-debugger */\n" +
            "debugger;\n" +
            "console.log(foo); // eslint-disable-line no-console\n",
        );

        const directiveIndex = collectDisableDirectives(sourceCode);

        assertEqual(
            JSON.stringify([
                [2, ["no-debugger"]],
                [3, ["no-console"]],
            ]),
            JSON.stringify(normalizeDirectiveIndex(directiveIndex)),
        );
    });

    it("recognizes bare block disable and enable directives as all-rule range state", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable */\n" +
            "console.log(foo);\n" +
            "debugger;\n" +
            "/* eslint-enable */\n" +
            "console.log(bar);\n",
        );

        const disableDirectives = collectDisableDirectives(sourceCode);

        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 2, column: 1 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-debugger", line: 3, column: 1 });
        assertSuppressed(false, disableDirectives, { ruleId: "no-console", line: 5, column: 1 });
    });

    it("recognizes rule-specific block disable and enable directives", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable no-console */\n" +
            "console.log(foo);\n" +
            "debugger;\n" +
            "/* eslint-enable no-console */\n" +
            "console.log(bar);\n",
        );

        const disableDirectives = collectDisableDirectives(sourceCode);

        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 2, column: 1 });
        assertSuppressed(false, disableDirectives, { ruleId: "no-debugger", line: 3, column: 1 });
        assertSuppressed(false, disableDirectives, { ruleId: "no-console", line: 5, column: 1 });
    });

    it("normalizes multiline rule lists and duplicate rule ids for block ranges", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable no-console,\n" +
            "   no-debugger,\n" +
            "   no-console because fixture code is intentional */\n" +
            "console.log(foo); debugger;\n",
        );

        const disableDirectives = collectDisableDirectives(sourceCode);

        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 4, column: 1 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-debugger", line: 4, column: 19 });
        assertSuppressed(false, disableDirectives, { ruleId: "semi", line: 4, column: 28 });
    });

    it("applies ordered interleaved block directive transitions", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable no-console */\n" +
            "console.log(foo);\n" +
            "/* eslint-disable no-debugger */\n" +
            "console.log(bar); debugger;\n" +
            "/* eslint-enable no-console */\n" +
            "console.log(baz); debugger;\n" +
            "/* eslint-enable */\n" +
            "debugger;\n",
        );

        const disableDirectives = collectDisableDirectives(sourceCode);

        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 2, column: 1 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 4, column: 1 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-debugger", line: 4, column: 19 });
        assertSuppressed(false, disableDirectives, { ruleId: "no-console", line: 6, column: 1 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-debugger", line: 6, column: 19 });
        assertSuppressed(false, disableDirectives, { ruleId: "no-debugger", line: 8, column: 1 });
    });

    it("combines block ranges with existing line-scoped directives", () => {
        const sourceCode = createSourceCode(
            "/* eslint-disable no-console */\n" +
            "console.log(foo); debugger; // eslint-disable-line no-debugger\n" +
            "/* eslint-enable no-console */\n" +
            "// eslint-disable-next-line no-console\n" +
            "console.log(bar); debugger;\n",
        );

        const disableDirectives = collectDisableDirectives(sourceCode);

        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 2, column: 1 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-debugger", line: 2, column: 19 });
        assertSuppressed(true, disableDirectives, { ruleId: "no-console", line: 5, column: 1 });
        assertSuppressed(false, disableDirectives, { ruleId: "no-debugger", line: 5, column: 19 });
    });
});
