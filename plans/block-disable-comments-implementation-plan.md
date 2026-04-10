# Block Disable Comments Implementation Plan

## Implementation Approach

Extend the existing disable-comment support from line-only directives into a unified suppression layer that can answer whether an individual diagnostic should be hidden. Keep this as post-report filtering in the central linter pipeline rather than changing rule modules. The parser already captures block comments and `SourceCode` already computes disable metadata once, so the main work is to parse `eslint-disable` and `eslint-enable` block directives into ordered range state, merge that state with the existing `eslint-disable-line` and `eslint-disable-next-line` behavior, and filter diagnostics before counts are finalized.

This feature should follow the ESLint user-facing pattern documented for block comments:

```js
/* eslint-disable */

alert("foo");

/* eslint-enable */
```

```js
/* eslint-disable no-alert, no-console */

alert("foo");
console.log("bar");

/* eslint-enable no-alert, no-console */
```

```js
/* eslint-disable no-alert */

alert("foo");
```

The safest implementation is to move from the current `Map<line, Set<ruleId>>` API to a small suppression helper object, for example `isSuppressed(message)`, while retaining deterministic lower-level structures for tests. That keeps the linter from needing to know whether a suppression came from a line directive, a range directive, or a file-wide directive. Tests should lead the work because the tricky parts are directive ordering, all-rules versus specific-rules state, enable semantics, comments that appear on the same line as code, and counts after filtering.

- [x] **Define directive semantics and acceptance coverage**
  - **Story**: S1. As a user, I can disable lint diagnostics for a file section or entire file using ESLint-style block comments
  - **What**: Document the exact semantics this feature will implement before changing code. Support only block comments for `eslint-disable` and `eslint-enable`. `/* eslint-disable */` disables all rule diagnostics after the directive until a matching enable or end of file. `/* eslint-disable rule-a, rule-b */` disables only listed rules after the directive until matching rule-specific enable directives or end of file. A top-of-file disable with no later enable behaves as whole-file suppression for the affected rule set. Keep existing `eslint-disable-line` and `eslint-disable-next-line` semantics unchanged. Parse errors and diagnostics without `ruleId` remain unsuppressible
  - **Where**: `plans/block-disable-comments-implementation-plan.md`, test names in `test/lib/`
  - **Acceptance criteria**: AC1 bare block disable suppresses all rule diagnostics after the comment; AC2 bare block enable restores all rule diagnostics after the comment; AC3 rule-specific block disable suppresses only listed rules; AC4 rule-specific block enable restores only listed rules; AC5 a top-of-file disable suppresses matching diagnostics through end of file; AC6 line-scoped directives continue to behave exactly as before
  - **Depends on**: none
  - **Defined semantics**:
    - Supported new directives are `eslint-disable` and `eslint-enable`
    - New range directives are recognized only in block comments, matching the documented `/* ... */` pattern
    - Existing `eslint-disable-line` and `eslint-disable-next-line` line and block comment behavior remains supported
    - `eslint-disable` without a rule list disables all rule diagnostics
    - `eslint-enable` without a rule list enables all rule diagnostics
    - `eslint-disable rule-a, rule-b` disables only the listed rules
    - `eslint-enable rule-a, rule-b` enables only the listed rules
    - Rule IDs are parsed as comma-separated entries after the directive prefix, using the same normalization and trailing-description tolerance as the existing line-directive parser
    - Duplicate rule IDs are accepted but behave as one rule entry
    - Range directive state applies to diagnostics whose reported location appears after the directive comment's ending location
    - Diagnostics on a line before a trailing `/* eslint-disable */` comment on that same line are not suppressed by that trailing directive
    - Diagnostics after a trailing `/* eslint-enable */` comment on the same physical line are enabled according to normal ordered state
    - If this linter cannot reliably compare diagnostic columns to directive columns for every rule, the implementation should explicitly choose and test a line-based fallback before coding; the preferred behavior is location-order comparison by line and column
    - Parse errors and diagnostics without a concrete `ruleId` remain unsuppressible
  - **Explicit non-goals for this change**:
    - `eslint` config comments such as `/* eslint rule: value */`
    - `eslint-env`, `global`, `globals`, `exported`, or plugin-specific inline configuration
    - Reporting unused disable directives
    - Warning on unknown rule IDs in disable comments
    - Nested or paired-block validation errors when enables do not exactly match disables
    - Descriptions requiring ESLint's `--` convention beyond preserving the existing simple trailing-text behavior

- [x] **Add end-to-end linter tests for block disable ranges**
  - **Story**: S1. As a user, I need confidence that block disable and enable comments suppress exactly the expected diagnostics
  - **What**: Extend or add integration-style `lintText()` tests using predictable rules such as `no-console`, `no-debugger`, and `semi`. Cover bare all-rule disable/enable around a code region, rule-specific disable/enable around a code region, file-wide top-of-file disable with no enable, selective suppression where one rule remains active inside a rule-specific disabled range, and diagnostics after re-enable appearing normally. Include cases with multiple comma-separated rules and duplicate rule names
  - **Where**: `test/lib/linter-disable-directives.test.js` or `test/lib/linter-block-disable-directives.test.js`
  - **Acceptance criteria**: AC1 bare range suppression removes all matching rule diagnostics in the disabled region; AC2 diagnostics after bare enable are reported; AC3 rule-specific ranges suppress only listed rules; AC4 multiple listed rules are all suppressed; AC5 top-of-file disable suppresses matching diagnostics through end of file; AC7 counts are computed from filtered messages
  - **Depends on**: Define directive semantics and acceptance coverage

- [x] **Add parser-level tests for range directive extraction and state**
  - **Story**: S2. As a maintainer, I need low-level tests that isolate directive parsing and ordered suppression state from rule behavior
  - **What**: Add helper-level tests for parsing `eslint-disable` and `eslint-enable` block comments and for computing suppression at representative diagnostic locations. Cover bare directives, rule-specific directives, whitespace variations, comma-separated rule lists over multiple lines, duplicate rule IDs, trailing explanatory text, interleaved disable and enable comments, and interaction with existing line directives. Assert deterministic structures or helper responses so failures are easy to diagnose
  - **Where**: `test/lib/disable-directives.test.js`
  - **Acceptance criteria**: AC8 block disable and enable directives are recognized from parsed block comments; AC9 rule lists reuse existing normalization behavior; AC10 all-rule state and rule-specific state are represented distinctly; AC11 ordered enable/disable transitions produce expected suppression answers; AC12 line-scoped directives still target only their configured physical line
  - **Depends on**: Define directive semantics and acceptance coverage

- [x] **Refactor disable directive metadata into a suppression model**
  - **Story**: S3. As the linter pipeline, I need one API that can evaluate line-scoped, range-scoped, and file-wide suppressions without duplicating directive logic
  - **What**: Replace or wrap the existing `Map<targetLine, Set<ruleId>>` metadata with a helper object that exposes a clear query method such as `isMessageSuppressed(message)` or `isSuppressed({ ruleId, line, column })`. Internally keep line-scoped suppressions for `eslint-disable-line` and `eslint-disable-next-line`, plus an ordered range-directive list for `eslint-disable` and `eslint-enable`. Ensure the helper is still computed once from `SourceCode` comments
  - **Where**: `lib/disable-directives.js`, `lib/source-code.js`, `lib/linter.js`
  - **Acceptance criteria**: AC13 suppression metadata is built once per lint run; AC14 linter filtering calls one suppression API instead of inspecting directive maps directly; AC15 helper-level tests can inspect or query deterministic suppression behavior
  - **Depends on**: Add parser-level tests for range directive extraction and state

- [x] **Implement range directive parsing**
  - **Story**: S2. As a maintainer, I need `eslint-disable` and `eslint-enable` comments parsed consistently with the existing line-directive parser
  - **What**: Extend `lib/disable-directives.js` to detect block comments whose trimmed value begins with `eslint-disable` or `eslint-enable` without accidentally treating `eslint-disable-line` or `eslint-disable-next-line` as range directives. Parse optional rule lists after the directive prefix. Represent bare directives as all-rule transitions and rule-specific directives as per-rule transitions. Preserve existing `eslint-disable-line` and `eslint-disable-next-line` parsing behavior
  - **Where**: `lib/disable-directives.js`
  - **Acceptance criteria**: AC8 new range directives are recognized; AC9 rule list normalization is shared or behaviorally identical across directive kinds; AC16 `eslint-disable-line` and `eslint-disable-next-line` are not misclassified as `eslint-disable`; AC17 malformed directive text does not suppress diagnostics
  - **Depends on**: Refactor disable directive metadata into a suppression model

- [x] **Implement ordered suppression evaluation**
  - **Story**: S1. As a user, I expect disables and enables to affect only diagnostics located in the active disabled range
  - **What**: Evaluate range directives in source order for each diagnostic. Track an all-rules disabled state and a set of rule-specific disabled states. A bare disable turns on all-rule suppression. A bare enable clears all-rule suppression and clears rule-specific suppression, matching the intuitive ESLint-style "enable everything" behavior. Rule-specific disable adds those rules to the disabled set. Rule-specific enable removes only those rules from the disabled set. Combine this with the existing line-scoped index so a diagnostic is suppressed if either a matching line directive or active range state suppresses it
  - **Where**: `lib/disable-directives.js`
  - **Acceptance criteria**: AC1 through AC5 range behavior works; AC10 all-rule and rule-specific states remain distinct; AC11 interleaved transitions behave predictably; AC18 line-scoped and range-scoped suppression compose without double-counting or order instability
  - **Depends on**: Implement range directive parsing

- [x] **Filter diagnostics through the unified suppression API**
  - **Story**: S1. As a user, I expect final lint results and counts to reflect both line-scoped and range-scoped disable comments
  - **What**: Update `lintText()` to ask the suppression model whether each message should be kept. Preserve parse errors and diagnostics without `ruleId`. Preserve stable ordering of remaining diagnostics and compute `errorCount` and `warningCount` after filtering
  - **Where**: `lib/linter.js`
  - **Acceptance criteria**: AC6 existing line-scoped behavior remains unchanged; AC7 counts reflect filtered diagnostics; AC19 parse errors are never suppressed; AC20 remaining message order is unchanged
  - **Depends on**: Implement ordered suppression evaluation

- [x] **Document file and block disable behavior**
  - **Story**: S4. As a user, I need README examples that accurately describe supported ESLint-style block disable comments
  - **What**: Update the inline disabling section to include `/* eslint-disable */`, `/* eslint-enable */`, rule-specific block ranges, and top-of-file file-wide disables. Remove those items from the unsupported list. Keep wording clear that only disable/enable comments are supported, not arbitrary ESLint inline configuration
  - **Where**: `README.md`
  - **Acceptance criteria**: AC21 README includes examples for all-rule block disable, rule-specific block disable, and top-of-file file-wide disable; AC22 README states parse errors are not suppressible by disable comments; AC23 README preserves existing line-scoped examples
  - **Depends on**: Filter diagnostics through the unified suppression API

- [x] **Run and stabilize targeted and full tests**
  - **Story**: S5. As a maintainer, I need proof that block disabling works without regressing existing rule behavior
  - **What**: Run the new helper tests first, then the linter-level disable tests, then the full suite with `node run-tests.js`. Fix failures around comment ordering, same-line directives, rule-list parsing, and count calculation. Pay special attention to existing in-repo `eslint-disable-next-line` comments and rule tests that mention `eslint-disable` in fixture source
  - **Where**: `test/lib/disable-directives.test.js`, `test/lib/linter-disable-directives.test.js`, full suite via `run-tests.js`
  - **Acceptance criteria**: AC24 new range directive tests pass; AC25 existing line directive tests pass unchanged; AC26 full test suite passes; AC27 any intentional differences from ESLint behavior are documented in the plan or README before implementation is considered complete
  - **Depends on**: Add end-to-end linter tests for block disable ranges, Filter diagnostics through the unified suppression API, Document file and block disable behavior
