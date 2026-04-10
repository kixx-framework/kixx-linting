import {
    describe,
    assertEqual,
} from "./deps.js";

import {
    normalizeConfigPath,
    matchesPathEntry,
    isGlobalIgnoreObject,
    findMatchingConfigs,
    deepMergeConfigs,
} from "../lib/lint-cli.js";

describe("lint CLI helpers", ({ describe }) => {
    describe("normalizeConfigPath", ({ it }) => {
        it("strips leading ./ and trailing /", () => {
            assertEqual("src/file.js", normalizeConfigPath("./src/file.js/"), "normalized path");
        });

        it("normalizes backslashes to forward slashes", () => {
            assertEqual("src/nested/file.js", normalizeConfigPath(".\\src\\nested\\file.js"), "normalized slashes");
        });
    });

    describe("matchesPathEntry", ({ it }) => {
        it("matches exact files", () => {
            assertEqual(true, matchesPathEntry("src/file.js", "./src/file.js"), "exact file match");
        });

        it("matches descendant paths from directory entries", () => {
            assertEqual(true, matchesPathEntry("src/nested/file.js", "src"), "nested directory match");
        });

        it("does not match sibling paths", () => {
            assertEqual(false, matchesPathEntry("src-other/file.js", "src"), "sibling path should not match");
        });
    });

    describe("isGlobalIgnoreObject", ({ it }) => {
        it("returns true only for objects with exactly one ignores key", () => {
            assertEqual(true, isGlobalIgnoreObject({ ignores: ["dist"] }), "global ignore object");
            assertEqual(false, isGlobalIgnoreObject({ ignores: ["dist"], rules: {} }), "object with extra keys");
        });
    });

    describe("findMatchingConfigs", ({ it }) => {
        it("skips files matched by global ignore entries", () => {
            const regularConfigs = [{ files: ["src"], rules: { "no-console": ["error"] } }];
            const matches = findMatchingConfigs(
                "src/file.js",
                regularConfigs,
                true,
                ["src"],
            );

            assertEqual(0, matches.length, "global ignore should exclude the file");
        });

        it("attaches no-files configs when at least one files config matches", () => {
            const withFiles = { files: ["src"], rules: { "no-console": ["error"] } };
            const noFiles = { rules: { semi: ["error", "always"] } };
            const matches = findMatchingConfigs(
                "src/file.js",
                [withFiles, noFiles],
                true,
                [],
            );

            assertEqual(2, matches.length, "both configs should be included");
            assertEqual(withFiles, matches[0], "files config first");
            assertEqual(noFiles, matches[1], "no-files config attached");
        });

        it("skips no-files configs when no files config matches and anyHasFiles is true", () => {
            const withFiles = { files: ["src"], rules: { "no-console": ["error"] } };
            const noFiles = { rules: { semi: ["error", "always"] } };
            const matches = findMatchingConfigs(
                "other/file.js",
                [withFiles, noFiles],
                true,
                [],
            );

            assertEqual(0, matches.length, "should skip unmatched file");
        });
    });

    describe("deepMergeConfigs", ({ it }) => {
        it("merges nested objects and replaces arrays", () => {
            const base = {
                rules: {
                    "no-warning-comments": ["warn", { terms: ["todo", "fixme"] }],
                    semi: ["error", "never"],
                },
                languageOptions: {
                    globals: {
                        process: "readonly",
                    },
                },
            };
            const incoming = {
                rules: {
                    "no-warning-comments": ["warn", { terms: ["todo"] }],
                    "no-console": ["error"],
                },
                languageOptions: {
                    globals: {
                        console: "readonly",
                    },
                },
            };

            const merged = deepMergeConfigs(base, incoming);

            assertEqual(
                JSON.stringify(["warn", { terms: ["todo"] }]),
                JSON.stringify(merged.rules["no-warning-comments"]),
                "arrays should be replaced",
            );
            assertEqual("readonly", merged.languageOptions.globals.process, "base nested key preserved");
            assertEqual("readonly", merged.languageOptions.globals.console, "incoming nested key merged");
            assertEqual("error", merged.rules["no-console"][0], "incoming scalar merged");
        });

        it("does not mutate input objects", () => {
            const base = { rules: { "no-console": ["error"] } };
            const incoming = { rules: { "no-console": ["warn"] } };

            const baseBefore = JSON.stringify(base);
            const incomingBefore = JSON.stringify(incoming);
            const merged = deepMergeConfigs(base, incoming);

            assertEqual(baseBefore, JSON.stringify(base), "base should remain unchanged");
            assertEqual(incomingBefore, JSON.stringify(incoming), "incoming should remain unchanged");
            assertEqual("warn", merged.rules["no-console"][0], "merge result should reflect incoming value");
        });
    });
});
