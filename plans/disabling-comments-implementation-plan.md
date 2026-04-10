# Disabling Comments Implementation Plan

## Implementation Approach

Implement line-scoped disabling as a post-report suppression layer rather than changing individual rules. The parser already captures comments, so the main work is to parse `eslint-disable-line` and `eslint-disable-next-line` directives into a per-line suppression index, then filter reported diagnostics against that index before counts are finalized. This keeps rule modules unchanged, preserves backward-compatible `eslint-*` syntax already present in the codebase, and localizes edge-case handling around comment parsing, line targeting, and unknown or malformed directives. Tests should focus on directive parsing, suppression behavior across comment forms, and confirming non-targeted diagnostics still surface normally.

- [x] **Define directive semantics and acceptance coverage**
  - **Story**: S1. As a user, I can suppress one or more configured rules on the current or following line using existing `eslint-*` comment syntax
  - **What**: Document the concrete behavior this feature will support in tests and implementation notes: `eslint-disable-line` applies to the line containing the directive comment, `eslint-disable-next-line` applies to the immediately following line, only explicitly named rules are supported, comma-separated rule lists are allowed, block comments may span multiple lines for `eslint-disable-next-line`, and comments without valid rule names do not suppress anything. Capture non-goals for this change such as file-wide disable directives, enable directives, descriptions, or plugin-namespace validation beyond matching configured rule IDs
  - **Where**: `plans/disabling-comments-implementation-plan.md`, implementation notes in test names within `test/`
  - **Acceptance criteria**: AC1 same-line suppression works for `//` and `/* */`; AC2 next-line suppression works for `//` and `/* */`; AC3 multiple comma-separated rules are recognized; AC4 multiline block comment syntax for `eslint-disable-next-line` is recognized; AC5 unsupported directive shapes stay out of scope and are explicitly not implemented
  - **Depends on**: none
  - **Defined semantics**:
    - Supported directives are only `eslint-disable-line` and `eslint-disable-next-line`
    - `eslint-disable-line` targets the physical line containing the directive comment
    - `eslint-disable-next-line` targets the immediately following physical line based on the comment's ending location
    - A directive suppresses diagnostics only when it includes one or more explicit rule IDs
    - Rule IDs are parsed as comma-separated entries after the directive prefix
    - Rule IDs are matched literally against configured rule IDs reported by the linter
    - Empty entries, whitespace-only entries, and comments with no valid rule IDs suppress nothing
    - Duplicate rule IDs are accepted but behave as a single suppression entry
    - Line comments and block comments are both supported
    - Multiline block comments are supported for `eslint-disable-next-line`; rule lists may span lines inside the comment body
    - Suppression is line-scoped only; it does not affect earlier lines, later lines beyond the single target line, or file-wide behavior
    - Parse errors and diagnostics without a concrete `ruleId` remain unsuppressible through this feature
  - **Explicit non-goals for this change**:
    - File-wide `eslint-disable`
    - Re-enabling with `eslint-enable`
    - Bare directives with no rule list
    - ESLint-style descriptions or metadata after directives beyond the comma-separated rule list parsing needed to recover rule IDs
    - Validation of plugin namespaces or rule ownership beyond literal matching to reported rule IDs
    - Range-based suppression, block-scoped suppression, or config-changing inline comments
  - **Implementation note for follow-up tests**:
    - Future test names should call out the supported forms directly, for example same-line line-comment suppression, next-line block-comment suppression, multiline block-comment rule-list parsing, and unsupported directive forms remaining inactive

- [x] **Add end-to-end linter tests for disabling comments**
  - **Story**: S1. As a user, I need confidence that line-specific disabling behaves correctly across supported comment styles
  - **What**: Add a focused integration-style test file that exercises `lintText()` with simple rules such as `no-console`, `no-debugger`, and `semi`. Cover valid suppression cases for `// eslint-disable-line ...`, `// eslint-disable-next-line ...`, `/* eslint-disable-line ... */`, `/* eslint-disable-next-line ... */`, multiline block comment rule lists, multiple rules in one directive, and selective suppression where one reported rule is suppressed while another on the same line is not. Also cover negative cases: malformed directive text, empty rule list, unknown rule name, and comments placed on unrelated lines
  - **Where**: `test/lib/linter-disable-directives.test.js`
  - **Acceptance criteria**: AC1 same-line suppression removes matching diagnostics only; AC2 next-line suppression removes matching diagnostics only; AC3 multiple listed rules can all be suppressed; AC4 multiline block comment parsing works; AC6 malformed, empty, or unknown directives do not suppress diagnostics; AC7 unmatched rules on a targeted line still report normally
  - **Depends on**: Define directive semantics and acceptance coverage

- [x] **Add parser-level tests for directive extraction edge cases**
  - **Story**: S2. As a maintainer, I need low-level tests that isolate directive parsing from rule behavior so regressions are easy to diagnose
  - **What**: Add unit tests for the directive parser/helper that will be introduced for comment analysis. Cover comment value normalization for line comments and block comments, whitespace variations, trailing explanatory text after rule names, commas with newlines, duplicate rule names, and line-number targeting for both directive kinds. Assert the helper returns a deterministic structure keyed by target line and rule ID set so failures can be debugged without going through full lint runs
  - **Where**: `test/lib/disable-directives.test.js`
  - **Acceptance criteria**: AC8 directive parsing tolerates surrounding whitespace and newlines; AC9 duplicate rule IDs are deduplicated; AC10 target lines are computed correctly from comment locations; AC11 helper output is deterministic and easy to consume from the linter pipeline
  - **Depends on**: Define directive semantics and acceptance coverage

- [x] **Implement disable-directive parsing helper**
  - **Story**: S2. As a maintainer, I need one module responsible for turning parsed comments into suppression metadata
  - **What**: Create a dedicated helper that scans `SourceCode` comments, detects the `eslint-disable-line` and `eslint-disable-next-line` prefixes, extracts comma-separated rule IDs, trims whitespace, ignores empty entries, deduplicates repeated names, and produces a map of `targetLine -> Set<ruleId>`. Use comment locations to resolve whether the directive applies to the current or next line, and support multiline block comments by parsing the full comment text rather than a single line fragment
  - **Where**: `lib/disable-directives.js`
  - **Acceptance criteria**: AC1 and AC2 directive kinds are recognized from parsed comments; AC3 comma-separated rule IDs are extracted; AC4 multiline block comments are parsed correctly; AC8 helper handles whitespace/newline variance; AC9 duplicate names are removed from the result
  - **Depends on**: Add parser-level tests for directive extraction edge cases

- [x] **Expose disable-directive metadata through SourceCode or linter pipeline**
  - **Story**: S3. As the linter pipeline, I need access to parsed suppression metadata without re-parsing comments in multiple places
  - **What**: Wire the new directive helper into the central linting flow at the point where parsed comments already exist. Choose one stable access pattern: either compute directive metadata in `SourceCode` and expose it through a method/property, or compute it in `lintText()` immediately after `SourceCode` construction and pass it downstream. Keep the ownership clear so suppression data is created once per file and reused during message filtering
  - **Where**: `lib/source-code.js`, `lib/linter.js`
  - **Acceptance criteria**: AC11 directive metadata is built once per lint run; AC12 the chosen API keeps comment parsing centralized; AC13 downstream code can retrieve target-line suppression data without knowing comment internals
  - **Depends on**: Implement disable-directive parsing helper

- [x] **Filter reported diagnostics against line directives**
  - **Story**: S1. As a user, I expect matching diagnostics to disappear from results when a supported disable directive targets their line
  - **What**: Add a suppression pass after `runRules()` returns messages and before final counts are computed. For each diagnostic with a non-null `ruleId`, drop it when its `line` is targeted by a directive containing the same rule ID. Preserve parse errors and any diagnostics whose rule ID is not explicitly listed. Keep sorting stable for remaining messages and ensure `errorCount`/`warningCount` reflect the filtered result rather than raw rule output
  - **Where**: `lib/linter.js`
  - **Acceptance criteria**: AC1 and AC2 matching rule diagnostics are suppressed on targeted lines; AC6 malformed or unknown directives have no effect; AC7 non-targeted diagnostics remain; AC14 parse errors are never suppressed by this feature; AC15 error and warning counts are computed from filtered messages
  - **Depends on**: Expose disable-directive metadata through SourceCode or linter pipeline

- [x] **Document supported disable-comment behavior**
  - **Story**: S4. As a user, I need the README to state exactly which ESLint-style disabling comments this linter supports
  - **What**: Update the project documentation to describe supported inline directives, the requirement to keep the `eslint-` prefix, the supported comment forms, and the fact that only line-scoped disabling with explicit rule names is implemented in this change. Include short examples for single-rule and multi-rule usage and avoid implying support for broader ESLint inline config features that are not present
  - **Where**: `README.md`
  - **Acceptance criteria**: AC16 README documents supported syntax with examples; AC17 README calls out explicit scope limitations so behavior is not overstated
  - **Depends on**: Filter reported diagnostics against line directives

- [x] **Run and stabilize targeted and full tests**
  - **Story**: S5. As a maintainer, I need proof that the new suppression feature works without regressing existing rule behavior
  - **What**: Execute the new directive-focused tests first, then run the full suite with `node run-tests.js`. Fix any failures related to comment parsing assumptions, line numbering, or count calculation. Confirm the repository files that already contain `eslint-disable-next-line` comments do not introduce unexpected behavior under the new implementation
  - **Where**: `test/lib/linter-disable-directives.test.js`, `test/lib/disable-directives.test.js`, full test suite via `run-tests.js`
  - **Acceptance criteria**: AC18 new directive tests pass; AC19 existing rule and CLI tests still pass; AC20 existing in-repo `eslint-*` comments do not cause regressions or crashes
  - **Depends on**: Add end-to-end linter tests for disabling comments, Filter reported diagnostics against line directives, Document supported disable-comment behavior
