# lint.js Config-Driven CLI Implementation Plan

## Implementation Approach

Rewrite `lint.js` as a config-driven CLI that loads `eslint.config.js`, walks a target path, matches discovered files against config objects, deep-merges matching configs right to left, and runs `lintText()` per file. Keep `lint.js` as a very small entrypoint that parses process-level input and delegates to CLI implementation modules under `lib/`. The highest-risk logic is config selector matching and merge semantics, so tests target those heavily. Tests use the project's existing `kixx-test` framework and `test/deps.js` assertions, with subprocess helpers for end-to-end CLI invocations. All diagnostics go to `stderr`; the existing hardcoded rules and globals in `lint.js` are deleted entirely.

**Key design decisions**:
- No glob support — `files` and `ignores` entries are literal path segments only.
- File extension filter: only `.js` files are collected during directory walking. Other file extensions are ignored.
- Symlinks are not followed during directory traversal.
- If a matched file cannot be read, print an error to `stderr` and continue to the next file (do not abort the entire run).
- An empty config array (`export default []`) means no files match any config, so nothing is linted and the CLI exits `0` silently.
- Merge precedence example: given `[configA, configB]`, start with `configB`, merge `configA` on top — `configA` wins for scalar conflicts.
- Global ignore object = a config object whose **only** key is `ignores`.
- The existing hardcoded rules and globals in `lint.js` are removed. The CLI reads all rules from `eslint.config.js`.
- `lint.js` is not executable and does not contain a shebang. The CLI is always invoked as `node lint.js <pathname>`.

- [x] **Create CLI test helpers and fixture workspaces**
  - **Story**: S2/S3. As a maintainer, I need reusable test infrastructure for running `lint.js` against fixture directories
  - **What**: Add a small set of helper functions in `test/deps.js` (or a nearby shared location) for: (1) spawning `node lint.js` with a custom cwd and capturing `stdout`, `stderr`, and exit code using `child_process.execFile` with a promisified wrapper, and (2) building fixture workspaces. Create 3-4 fixture directories under `test/fixtures/lint-cli/` that collectively cover the major scenarios: a workspace with valid config and mixed files (for testing matching, ignores, merge precedence, output, and non-`.js` files being ignored during directory walking), a workspace with missing/invalid config variants, and a workspace with only warnings (no errors). Keep fixtures small — use simple rules like `no-console` and `no-warning-comments` to produce predictable output. Each fixture workspace needs its own `eslint.config.js`
  - **Where**: `test/deps.js` (add subprocess helper), `test/fixtures/lint-cli/`
  - **Acceptance criteria**: AC11 (tests can execute `node lint.js` with a custom cwd), AC12 (tests can assert on captured `stderr`, `stdout`, and exit status), AC13 (helpers isolate fixture state), AC14 (fixtures exist for core CLI scenarios), AC15 (fixtures include file and directory targets), AC16 (fixtures include merge-precedence and ignore cases), AC17 (fixtures include non-`.js` files that are ignored during directory walking)
  - **Depends on**: none

- [x] **Add CLI contract tests**
  - **Story**: S4/S5/S6/S7. As a CLI user, I need the full contract tested before implementation begins
  - **What**: Write a single test file with describe blocks covering all CLI behavior. Use the `kixx-test` `describe()` pattern and assertions from `test/deps.js`. Group tests into sections: (1) argument and config errors — too many args, missing target, missing config, invalid export, thrown import; (2) target selection — default cwd, file target, directory target, recursive traversal, non-`.js` files ignored during directory walking; (3) matching and merge — `files` matching, per-object `ignores`, global ignores, no-`files` objects, right-to-left merge precedence, array replacement; (4) output and exit codes — grouped stderr, severity labels, `parse-error` for null ruleId, silent success, exit `1` on errors, exit `0` on warnings only. All tests should be failing initially (TDD red phase)
  - **Where**: `test/lint-cli.test.js`
  - **Acceptance criteria**: AC1 (zero or one arg), AC2 (config must exist), AC3 (valid export shape), AC4 (file and directory targets), AC5 (literal path matching), AC6 (global ignores), AC7 (right-to-left merge), AC8 (grouped stderr), AC9 (failure exits 1), AC10 (warnings exit 0), AC18 (recursive traversal), AC19 (directories not linted), AC20 (arrays replace), AC22 (errors exit 1), AC23 (silent success), AC24 (parse-error for null ruleId), AC25 (non-`.js` files are ignored during directory walking), AC26 (`lint.js` is invoked via `node`, with no shebang-specific behavior relied upon)
  - **Depends on**: Create CLI test helpers and fixture workspaces

- [x] **Implement thin CLI entrypoint**
  - **Story**: S4. As a CLI user, I need correct argument validation and config loading before any file work
  - **What**: In `lint.js`, delete the existing hardcoded rules/globals and single-file logic. Replace them with a minimal entrypoint that invokes a `lib/` CLI module and exits with its returned status code. Do not add a shebang, and do not rely on executable-script behavior; the file is always run as `node lint.js`
  - **Where**: `lint.js`, `lib/lint-cli.js`
  - **Acceptance criteria**: AC9 (failure exit codes), AC26 (`node lint.js` invocation model), AC31 (`lint.js` remains a small wrapper)
  - **Depends on**: Add CLI contract tests

- [x] **Implement CLI argument parsing and config loading**
  - **Story**: S4. As a CLI user, I need correct argument validation and config loading before any file work
  - **What**: In `lib/`, implement helper functions: `parseCliArgv(argv, cwd)` — enforce zero or one positional arg, default to cwd, resolve to absolute path, verify target exists; `loadConfig(cwd)` — check for `eslint.config.js` in cwd, convert to file URL, dynamic `import()`, validate default export is an array of plain objects. All errors go to `stderr` with exit code `1`
  - **Where**: `lib/lint-cli.js`, optionally split into `lib/lint-cli-config.js`
  - **Acceptance criteria**: AC1 (arg validation), AC2 (config file must exist), AC3 (export shape validation), AC9 (failure exit codes)
  - **Depends on**: Implement thin CLI entrypoint

- [x] **Implement file collection and path normalization**
  - **Story**: S5. As a CLI user, I need deterministic file discovery
  - **What**: Implement `collectFiles(targetPath)` — if target is a file, return it; if directory, recursively walk collecting only `.js` files, skipping symlinks, directories, and all non-`.js` extensions. Implement `toRelativeTargetPath(targetRoot, absoluteFilePath)` — normalize to forward slashes, strip leading `./`, strip trailing `/`. All discovered paths are converted to paths relative to the CLI target root for matching
  - **Where**: `lib/lint-cli.js`, optionally split into `lib/lint-cli-files.js`
  - **Acceptance criteria**: AC4 (file and directory targets), AC18 (recursive), AC19 (directories not linted), AC25 (non-`.js` files ignored during directory walking), AC28 (consistent normalization)
  - **Depends on**: Implement CLI argument parsing and config loading

- [x] **Implement config matching**
  - **Story**: S6. As a CLI user, I need `files`/`ignores` to correctly select which configs apply to each file
  - **What**: Implement helpers: `normalizeConfigPath(p)` — strip `./` and trailing `/`; `matchesPathEntry(relativePath, entry)` — exact match or ancestor-directory match; `isGlobalIgnoreObject(obj)` — true only when the object's only key is `ignores`; `findMatchingConfigs(relativePath, regularConfigs, anyHasFiles, globalIgnoreEntries)` — apply the matching algorithm from the spec: drop globally ignored files, evaluate per-object eligibility based on `files`/`ignores` presence, apply the "no-`files` objects attach to the match set" rule. Files with no matching regular config are skipped silently
  - **Where**: `lib/lint-cli.js`, optionally split into `lib/lint-cli-config.js`
  - **Acceptance criteria**: AC5 (literal matching), AC6 (global ignores), AC21 (no-`files` attachment rule), AC29 (no-match files skipped)
  - **Depends on**: Implement file collection and path normalization

- [x] **Implement config merging, lint execution, and output**
  - **Story**: S6/S7. As a CLI user, I need merged configs fed to `lintText()` with grouped output
  - **What**: Implement `deepMergeConfigs(base, incoming)` — recursively merge plain objects, replace arrays, scalars from `incoming` overwrite `base`. For each file's matching configs, clone them, iterate from end to start merging into an accumulator, strip `files`/`ignores` keys. Call `lintText({ name: absolutePath, text: source }, merged.rules ?? {}, merged.languageOptions ?? {})`. Collect results. Format grouped diagnostics to `stderr`: file header, then indented `line:col  severity  message  (ruleId)` lines. Map severity 1→`warn`, 2→`error`, null ruleId→`parse-error`. If no messages for any file, produce no output. Exit `1` if any error, `0` otherwise. If a file cannot be read, print error to `stderr` and continue
  - **Where**: `lib/lint-cli.js`, optionally split into `lib/lint-cli-merge.js` and `lib/lint-cli-output.js`
  - **Acceptance criteria**: AC7 (right-to-left merge), AC8 (grouped stderr), AC10 (warnings exit 0), AC20 (array replacement), AC22 (errors exit 1), AC23 (silent success), AC24 (parse-error), AC27 (no mutation of original config), AC30 (CLI keys stripped)
  - **Depends on**: Implement config matching

- [x] **Add helper-level unit tests**
  - **Story**: S6. As a maintainer, I need direct tests for matching and merge helpers so regressions can be diagnosed without end-to-end failures
  - **What**: Add a test file that imports the pure helper functions from `lib/`: path normalization, `matchesPathEntry`, `isGlobalIgnoreObject`, config eligibility, and `deepMergeConfigs`. Use the `kixx-test` framework. Keep these focused on edge cases: trailing slashes, `./` prefixes, nested directory matching, array replacement vs object merge, clone verification
  - **Where**: `test/lint-cli-helpers.test.js`
  - **Acceptance criteria**: AC5, AC6, AC7, AC20 (directly tested at the function level)
  - **Depends on**: Implement config merging, lint execution, and output

- [x] **Run and stabilize the full test suite**
  - **Story**: S10. As a maintainer, I need confidence that everything works end to end
  - **What**: Run `node run-tests.js` to execute all tests (existing rule tests + new CLI tests). Fix any expectation drift in fixtures or formatting. Confirm targeted runs work: `node run-tests.js test/lint-cli.test.js` and `node run-tests.js test/lint-cli-helpers.test.js`. Verify fixture workspaces are deterministic across repeated runs
  - **Where**: All test files
  - **Acceptance criteria**: AC34 (all tests pass), AC35 (fixtures are repeatable), AC36 (targeted test runs work)
  - **Depends on**: Add helper-level unit tests

- [x] **Update README documentation**
  - **Story**: S9. As a repo user, I need the README to explain the new CLI behavior
  - **What**: Update `README.md` to document: `lint.js` now loads `eslint.config.js` from cwd, accepts zero or one positional path argument (defaults to cwd), walks directories collecting only `.js` files, uses literal path matching for `files`/`ignores` (no globs), groups diagnostics on stderr, and exits `1` on errors or `0` on warnings-only/clean runs. Document invocation as `node lint.js <pathname>`
  - **Where**: `README.md`
  - **Acceptance criteria**: AC31 (config discovery), AC32 (target argument behavior), AC33 (diagnostics and exit codes)
  - **Depends on**: Run and stabilize the full test suite
