import fsp from "node:fs/promises";
import path from "node:path";

import {
    describe,
    assert,
    assertEqual,
    assertNonEmptyString,
    runLintJsCli,
    createLintCliFixtureWorkspace,
} from "./deps.js";

async function withFixtureWorkspace(fixtureName, fn) {
    const fixture = await createLintCliFixtureWorkspace(fixtureName);

    try {
        return await fn(fixture.workspacePath);
    } finally {
        await fixture.cleanup();
    }
}

function assertContains(text, value, messagePrefix) {
    assertEqual(true, text.includes(value), messagePrefix);
}

function assertNotContains(text, value, messagePrefix) {
    assertEqual(false, text.includes(value), messagePrefix);
}

describe("lint CLI contract", ({ describe }) => {
    describe("argument and config errors", ({ it }) => {
        it("fails when too many positional arguments are provided", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["src/error.js", "src/merged.js"],
                });

                assertEqual(1, result.exitCode, "exitCode");
                assertNonEmptyString(result.stderr, "stderr");
                assertEqual("", result.stdout, "stdout");
            });
        });

        it("fails when eslint.config.js does not exist", async () => {
            await withFixtureWorkspace("missing-config-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath, args: ["."] });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "eslint.config.js", "stderr includes missing config filename");
            });
        });

        it("fails when eslint.config.js default export is not an array", async () => {
            await withFixtureWorkspace("invalid-config-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath, args: ["."] });

                assertEqual(1, result.exitCode, "exitCode");
                assertNonEmptyString(result.stderr, "stderr");
            });
        });

        it("fails when importing eslint.config.js throws", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const configFilepath = path.join(workspacePath, "eslint.config.js");
                await fsp.writeFile(
                    configFilepath,
                    "throw new Error('fixture import failure');\n",
                    "utf8",
                );

                const result = await runLintJsCli({ cwd: workspacePath, args: ["."] });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "fixture import failure", "stderr includes import error");
            });
        });
    });

    describe("target selection", ({ it }) => {
        it("defaults target path to cwd when no positional arg is provided", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "src/error.js", "stderr includes cwd lint result");
            });
        });

        it("supports file targets", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["single-file-target.js"],
                });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "single-file-target.js", "stderr includes file target");
                assertNotContains(result.stderr, "src/error.js", "stderr omits unrelated files");
            });
        });

        it("supports directory targets with recursive traversal", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["src"],
                });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "src/error.js", "stderr includes direct child file");
                assertContains(result.stderr, "src/nested/child.js", "stderr includes nested file");
            });
        });

        it("ignores non-.js files during directory walking", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["src"],
                });

                assertNotContains(result.stderr, "not-javascript.txt", "stderr omits .txt files");
                assertNotContains(result.stderr, "data.json", "stderr omits .json files");
            });
        });
    });

    describe("matching and merge behavior", ({ it }) => {
        it("applies global ignore objects", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath, args: ["."] });

                assertNotContains(result.stderr, "src/globally-ignored.js", "stderr omits globally ignored file");
                assertNotContains(result.stderr, "ignored/skip.js", "stderr omits globally ignored directory");
            });
        });

        it("applies per-object ignores", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath, args: ["src"] });

                assertNotContains(result.stderr, "ignored-by-object.js", "stderr omits per-object ignored file");
            });
        });

        it("merges matching configs right-to-left so earlier entries win", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath, args: ["src/merged.js"] });

                assertContains(result.stderr, "src/merged.js", "stderr includes merged target");
                assertContains(result.stderr, "warn", "severity reflects merge precedence");
                assertEqual(0, result.exitCode, "exitCode");
            });
        });
    });

    describe("output and exit codes", ({ it }) => {
        it("prints grouped diagnostics with severity labels and rule IDs to stderr", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({ cwd: workspacePath, args: ["src/error.js"] });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "src/error.js", "stderr includes file header");
                assertContains(result.stderr, "error", "stderr includes severity label");
                assertContains(result.stderr, "(no-console)", "stderr includes rule id");
                assertEqual("", result.stdout, "stdout");
            });
        });

        it("labels parser failures as parse-error when ruleId is null", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const invalidFilepath = path.join(workspacePath, "src", "parse-error.js");
                await fsp.writeFile(invalidFilepath, "const = ;\n", "utf8");

                const result = await runLintJsCli({ cwd: workspacePath, args: ["src/parse-error.js"] });

                assertEqual(1, result.exitCode, "exitCode");
                assertContains(result.stderr, "parse-error", "stderr includes parse-error label");
            });
        });

        it("is silent and exits 0 when no messages are produced", async () => {
            await withFixtureWorkspace("warnings-only-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["src/also-clean.js"],
                });

                assertEqual(0, result.exitCode, "exitCode");
                assertEqual("", result.stdout, "stdout");
                assertEqual("", result.stderr, "stderr");
            });
        });

        it("exits 0 when all diagnostics are warnings", async () => {
            await withFixtureWorkspace("warnings-only-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["src/warn.js"],
                });

                assertEqual(0, result.exitCode, "exitCode");
                assertContains(result.stderr, "warn", "stderr includes warning severity");
            });
        });

        it("exits 1 when any error is present", async () => {
            await withFixtureWorkspace("mixed-workspace", async (workspacePath) => {
                const result = await runLintJsCli({
                    cwd: workspacePath,
                    args: ["src/error.js"],
                });

                assertEqual(1, result.exitCode, "exitCode");
                assert(result.stderr.length > 0, "stderr should be non-empty");
            });
        });
    });
});
