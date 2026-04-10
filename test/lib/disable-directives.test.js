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
});
