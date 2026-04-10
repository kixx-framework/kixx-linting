import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

export * from "../vendor/kixx-assert/mod.js";
export { describe } from "../vendor/kixx-test/mod.js";

const execFile = promisify(execFileCallback);
const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TEST_DIRECTORY, "..");
const LINT_JS_FILEPATH = path.join(PROJECT_ROOT, "lint.js");
const LINT_CLI_FIXTURE_DIRECTORY = path.join(TEST_DIRECTORY, "fixtures", "lint-cli");

export async function runLintJsCli({
    args = [],
    cwd = PROJECT_ROOT,
    timeout = 10_000,
} = {}) {
    try {
        const result = await execFile(
            process.execPath,
            [LINT_JS_FILEPATH, ...args],
            { cwd, timeout },
        );

        return {
            exitCode: 0,
            stdout: result.stdout,
            stderr: result.stderr,
        };
    } catch (error) {
        if (typeof error.code === "number") {
            return {
                exitCode: error.code,
                stdout: error.stdout ?? "",
                stderr: error.stderr ?? "",
            };
        }
        throw error;
    }
}

export async function createLintCliFixtureWorkspace(fixtureName) {
    const fixturePath = path.join(LINT_CLI_FIXTURE_DIRECTORY, fixtureName);
    const fixtureStats = await fsp.stat(fixturePath).catch(() => {
        return null;
    });

    if (!fixtureStats || !fixtureStats.isDirectory()) {
        throw new Error(`Lint CLI fixture does not exist: ${fixtureName}`);
    }

    const workspacePath = await fsp.mkdtemp(
        path.join(process.cwd(), ".tmp-lint-cli-fixture-"),
    );

    await fsp.cp(fixturePath, workspacePath, { recursive: true });

    return {
        fixturePath,
        workspacePath,
        cleanup: async () => {
            await fsp.rm(workspacePath, { recursive: true, force: true });
        },
    };
}
