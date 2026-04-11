# lib/ Refactoring Recommendations

This document captures a read-through of every file in `lib/` (excluding `lib/vendor/`) and lists the concrete cleanup opportunities, in rough priority order. The goal: less duplication, clearer object boundaries, and fewer places future agents have to look to understand how the linter works.

Each recommendation includes a **why**, a **where** (specific file paths and line numbers), and a **concrete change**. Recommendations are independent where possible so we can ship them one at a time.

---

## 1. Consolidate the rule-level helpers that are copy-pasted across many files

**This is the single biggest cleanup opportunity in lib/.** The rules directory has several small helpers that are inlined at the top of many rule files. They are not conceptually specialized — they exist because `lib/rules/utils.js` was never grown to hold them.

### 1a. `scopeContainsNode` is duplicated in 7 files

Identical or near-identical copies appear in:

- `lib/rules/no-regex-spaces.js:8`
- `lib/rules/no-promise-executor-return.js:13`
- `lib/rules/no-extend-native.js:33`
- `lib/rules/no-obj-calls.js:14`
- `lib/rules/no-undef.js:6`
- `lib/rules/no-new-wrappers.js:3`
- `lib/rules/no-new-native-nonconstructor.js:3`

All seven ask the same question: "does this scope's block contain the given node by byte range?" This is the definition of "which scope contains this node," which is already what `SourceCode.getScope(node)` solves — *badly*, because `getScope` walks every scope and picks the smallest containing one (`lib/source-code.js:377`). The duplicated helper is an intermediate step callers use to implement *their own* innermost-scope lookup.

**Change:**

- Delete all 7 copies. Callers that need "does scope X contain node Y?" can be rewritten to use `sourceCode.getScope(node)` and walk upward, which is what most of them actually want (see 1b).
- If a true range-containment helper is still needed after the rewrite, move a single copy into `lib/rules/utils.js`.

### 1b. `hasShadowedDefinition` is duplicated in 6 files with two slightly different signatures

- `lib/rules/no-regex-spaces.js:22` `(sourceCode, node, name)`
- `lib/rules/no-promise-executor-return.js:27` `(sourceCode, node, name)`
- `lib/rules/no-extend-native.js:47` `(node, name, sourceCode)` ← argument order differs
- `lib/rules/no-obj-calls.js:28` `(sourceCode, node, name)`
- `lib/rules/no-new-wrappers.js:17` `(sourceCode, node, name)`
- `lib/rules/no-new-native-nonconstructor.js:17` `(node, name, sourceCode)` ← argument order differs

The body of each is: "scan every scope that contains this identifier, check whether any of them has a local variable with this name." This is exactly "walk up from `sourceCode.getScope(identifier)` and ask `scope.set.has(name)` at each level" — which is what scope managers are *for*. The hand-rolled version also iterates all scopes (O(scopes)) rather than walking up the parent chain (O(depth)).

**Change:**

- Add `isBuiltinGlobalUnshadowed(sourceCode, identifierNode, name)` to `lib/rules/utils.js`. Body walks up from `sourceCode.getScope(identifierNode)` via `.upper` and checks `scope.variables` for a non-global definition of `name`.
- Delete the 6 local copies. Rewrite callers to use the shared helper.
- Unify the two divergent argument orders to one.

### 1c. `parseDirectiveGlobals` is duplicated in 6 files and doesn't belong in rule code at all

Copies in:

- `lib/rules/no-undef.js:71`
- `lib/rules/no-obj-calls.js:35`
- `lib/rules/no-new-wrappers.js:24`
- `lib/rules/no-promise-executor-return.js:34`
- `lib/rules/no-regex-spaces.js:29`
- `lib/rules/radix.js:5`

These all parse `/* global foo, bar:readonly */` comments out of the source file. This is not a rule concern — it is a file-level fact about what names are considered global in this file. Right now every rule that wants to respect these directives re-parses every comment from scratch.

The implementations are also subtly different. `no-undef.js` uses a regex with a more permissive declaration body; the others split on commas. One handles trailing `:off` markers, another doesn't.

**Change:**

- Move directive-globals parsing into the linter pipeline. Options, in descending preference:
  1. Parse them once in `lib/linter.js` and fold them into the `globals` map passed to `analyze()` as readonly/writable entries. After this, the scope manager will know about them and every rule's existing scope-based resolution will "just work" without any rule-level code.
  2. If (1) is too invasive right now, expose `sourceCode.getDirectiveGlobals()` as a single-parse lazy getter and have rules call that.
- Delete the 6 local copies.

### 1d. `getInnermostScope` is duplicated between the two `no-constant-*` rules

- `lib/rules/no-constant-condition.js:10`
- `lib/rules/no-constant-binary-expression.js:6`

These are byte-for-byte identical, and they are a *better* version of `SourceCode.getScope()` at `lib/source-code.js:377`: both use range-containment + smallest-block to pick the innermost scope, but the rule-level copies correctly prefer a non-global scope on ties.

**Change:**

- Fix the tie-breaking bug in `SourceCode.getScope()` so it matches the rule-level helpers.
- Delete both copies.
- Rewrite the callers (`isBuiltinConstantIdentifier`, `isUnshadowedGlobalName` in both files) to use `sourceCode.getScope(node)` and walk `.upper`.

### 1e. `isBuiltinConstantIdentifier` and `isUnshadowedGlobalName` are duplicated too

Byte-identical copies:

- `lib/rules/no-constant-condition.js:86` + `:104`
- `lib/rules/no-constant-binary-expression.js:40` + `:58`

After fixing 1d, both of these can also move to `lib/rules/utils.js` as `isGlobalBuiltinConstant(sourceCode, node)` and `isUnshadowedGlobal(sourceCode, node, name)`.

### 1f. Token-kind predicates are scattered

- `isSemicolonToken` — `lib/rules/semi.js:6`
- `isClosingBraceToken` — `lib/rules/semi.js:10`
- `isCommaToken` — `lib/rules/comma-dangle.js:44`
- `isOpeningParenToken` — `lib/rules/new-parens.js:10`, `lib/rules/preserve-caught-error.js:37`, `lib/rules/func-call-spacing.js:6`
- `isClosingParenToken` — `lib/rules/new-parens.js:6`

This is light duplication but high-frequency. Pull them into `lib/rules/utils.js` as a small family:

```js
export const isPunctuator = (value) => (token) => token?.type === "Punctuator" && token.value === value;
export const isSemicolon = isPunctuator(";");
export const isOpenParen = isPunctuator("(");
// ...etc
```

Or, if a factory feels like overkill, just export the individual predicates.

### 1g. Path-tracking engine is duplicated between `constructor-super` and `no-this-before-super`

`lib/rules/constructor-super.js` and `lib/rules/no-this-before-super.js` share a whole abstract-interpretation engine: `clonePath`, `normalizePaths`, `markSuperCall`, `evalExpression`, `evalExpressionChildren`, `flatMapActive`. A `diff` of the two files' first 200 lines shows the helpers are the same code with the second rule's version additionally threading a `violations` accumulator through.

Combined, the two files are 1,013 lines and most of the rule-specific logic is the last ~100 lines of each.

**Change:**

- Extract a single path-analysis module — e.g. `lib/rules/super-call-analysis.js` — exposing one function: `analyzeConstructorBody(body) -> { endpoints, thisBeforeSuperViolations, superBeforeSuperViolations }`. Both rules call it and decide which slice of the result to report.
- This is a higher-risk refactor than the others (behavior is subtle and tests matter here) so do it last, and only after the tests for both rules are passing green.
- Expected payoff: ~400–500 lines deleted, one place to fix any future bug in super-call flow analysis.

### 1h. `getClassAncestor` / `isDerivedClass` / `isNestedBoundary` are duplicated

Same two files (`constructor-super.js:9-32`, `no-this-before-super.js:6-29`). If 1g is done, these ride along automatically. Otherwise move them to `lib/rules/utils.js`.

---

## 2. Delete the dead `node.range ? … : node.start` fallback pattern

**Why:** The parser (`lib/parser.js:52-57`) always passes `locations: true, ranges: true` to acorn, so every AST node is guaranteed to have both `node.start`/`node.end` *and* `node.range[0]`/`node.range[1]`. The defensive fallback `node.range ? node.range[0] : node.start` is dead — the `false` branch never runs.

**Where:** The pattern appears in 22 files with 57 total occurrences (from `grep -c 'node\.range'`). Worst offenders:

- `lib/source-code.js` — 14 occurrences (in `getFirstToken`, `getLastToken`, `getTokenBefore`, `getTokenAfter`, `getFirstTokenBetween`, `getLastTokenBetween`, `getFirstTokens`, `getLastTokens`, `getTokensBetween`, `isSpaceBetween`, `commentsExistBetween`, `getCommentsInside`, `getCommentsBefore`, `getCommentsAfter`, `getScope`).
- `lib/rules/no-unsafe-finally.js`, `no-constant-condition.js`, `no-undef.js`, `no-new-native-nonconstructor.js`, `no-return-assign.js`, `no-unexpected-multiline.js`, `no-sequences.js`, `no-extend-native.js`, `no-cond-assign.js`, `no-new-wrappers.js`, `no-regex-spaces.js`, `no-obj-calls.js`, `no-mixed-operators.js`, `no-constant-binary-expression.js`, `no-promise-executor-return.js`, `no-unreachable.js`, `no-unsafe-negation.js` — 2 each.

**Change:**

- Replace every `node.range ? node.range[0] : node.start` with `node.start` and every `node.range ? node.range[1] : node.end` with `node.end`. Pick one idiom project-wide — I suggest `node.start`/`node.end` since that's what acorn natively emits and what the rest of `SourceCode` reads.
- After this pass, `SourceCode`'s private helpers shrink meaningfully and several rules lose awkward ternaries.

This is the single highest-ROI mechanical cleanup in `lib/`: it deletes noise without changing any behavior, and the grep is easy to verify.

---

## 3. Fix the leaked `SourceCode` internal in `indent.js`

**Why:** `lib/rules/indent.js:299` reads `sourceCode._allTokensSorted` directly:

```js
for (const token of sourceCode._allTokensSorted) {
```

Underscore-prefixed fields are the project's convention for "private to this class." This is the only place in `lib/rules/` where any such field is touched — the rest of the rules go through the public API. Letting one rule reach into `SourceCode`'s internals means the internals aren't free to change.

**Change:**

- Add a small public method to `SourceCode`. `indent.js` is building "first token on each line" — probably the cleanest shape is:

    ```js
    getFirstTokensByLine({ includeComments = false } = {}) { … }  // returns Map<lineNumber, token>
    ```

    Returning a cached Map keeps the per-run cost flat.

- Replace `indent.js:298-304` with a single call to the new method.

---

## 4. Kill `SourceCode.getFirstTokens` / `getLastTokens` — nothing uses them

**Why:** `lib/source-code.js:234` (`getFirstTokens`) and `lib/source-code.js:253` (`getLastTokens`) are never called anywhere in `lib/rules/`. They are also the only two methods that use `_normalizeCountOptions` (`lib/source-code.js:464`). Together they're ~60 lines of speculative API that nothing consumes.

**Change:**

- Delete `getFirstTokens`, `getLastTokens`, and `_normalizeCountOptions`.
- If a rule needs this later, it can come back when there's an actual caller to shape it around.

---

## 5. Audit `SourceCode` token-query options against actual usage

**Why:** `SourceCode.getFirstToken`, `getLastToken`, `getTokenBefore`, `getTokenAfter`, `getFirstTokenBetween`, `getLastTokenBetween` each accept a `rawOptions` parameter that `_normalizeOptions` (`lib/source-code.js:443`) resolves as one of:

- a number → `skip`
- a function → `filter`
- an object → `{ skip, filter, includeComments }`

This is the ESLint-compatible polymorphic shape. It makes the method signatures confusing and pushes complexity into every caller ("is this options or a filter?"). A spot check of `lib/rules/` suggests:

- Callers never pass a numeric `skip`.
- Callers never pass `includeComments: true` in this family of methods.
- Callers pass a filter function about half the time.

**Change:**

- Confirm the above with a grep before deciding.
- If confirmed, simplify to two parameters: `getFirstToken(node, filter)` (filter is an optional function). Drop `_normalizeOptions`. If a rule later needs `skip` or `includeComments`, add a focused method then.
- The wins are: clearer call sites, one fewer indirection, simpler `SourceCode` internals.

This one is lower-priority than 1–4 because it's a design-change rather than a deletion, and only worth it if the audit confirms the options are unused.

---

## 6. `linter.js` cleanups

Small grab-bag of fixes in `lib/linter.js`:

### 6a. `ecmaVersion` default is a string, not a number

`lib/linter.js:15`:

```js
const ecmaVersion = languageOptions.ecmaVersion ?? "2024";
```

`lib/parser.js:44` uses the numeric default:

```js
const ecmaVersion = options.ecmaVersion ?? 2024;
```

Acorn accepts both, but rules that do `Number(context.languageOptions?.ecmaVersion ?? 2024)` (e.g. `lib/rules/no-undef.js:109`, `lib/rules/no-unused-expressions.js:98`) hint that the string form is ambiguous downstream. Pick one — almost certainly the number.

### 6b. `_translateGlobals` is misnamed and over-documented

`lib/linter.js:95-107` defines `_translateGlobals`. It has:

- A leading underscore (not a convention for top-level module functions here).
- A 6-line docstring about hypothetical future rules needing to distinguish readonly vs writable.
- A body that does one thing: filter out `"off"` entries.

**Change:** rename to `removeOffGlobals(globals)` (or inline it — it's called once), and drop the docstring. The "future rules" justification is speculative generality and violates the "don't design for features not on the roadmap" guideline.

### 6c. `disableDirectives` filter step could move into `SourceCode`

`lib/linter.js:68-69`:

```js
const disableDirectives = sourceCode.getDisableDirectives();
const filteredMessages = messages.filter(message => !disableDirectives.isSuppressed(message));
```

Consider: `sourceCode.filterSuppressedMessages(messages)`. Hides the directive-object from the top-level pipeline and gives `SourceCode` ownership of what it already collects.

Low priority — only worth doing if we're already editing this file for something else.

---

## 7. `lint-cli.js` (357 lines) — decompose by responsibility

**Why:** `lib/lint-cli.js` is doing five things in one file:

1. CLI argument parsing (`parseCliArgv`).
2. Config loading and validation (`loadConfig`).
3. Flat-config matching (`findMatchingConfigs`, `matchesPathEntry`, `isGlobalIgnoreObject`, `normalizeConfigPath`, `deepMergeConfigs`, `mergeMatchingConfigs`, `cloneConfigValue`, `isPlainObject`).
4. File discovery (`collectFiles`, `collectFilesFromDirectory`, `toRelativeTargetPath`).
5. Result formatting (`writeLintResults`, `writeErrorLine`).

The file isn't too large *per se*, but the orchestrating function (`runLintCli`, lines 7–82) has to hold all five concepts in mind at once, and the config-matching logic is the subtlest part and also the most testable in isolation.

**Change (option A — minimal):**

- Extract **just** the flat-config matching engine into `lib/config-resolver.js`. That includes `findMatchingConfigs`, `matchesPathEntry`, `isGlobalIgnoreObject`, `normalizeConfigPath`, `deepMergeConfigs`, `mergeMatchingConfigs`, `cloneConfigValue`, `isPlainObject`. Export one entry point: `resolveConfigForFile(relativePath, configObjects) -> mergedConfig | null`.
- `lint-cli.js` keeps CLI parsing, file discovery, file reading, orchestration, and formatting. It shrinks to roughly half its size and the config-matching logic gets a home that can be unit-tested directly.

**Change (option B — deeper):**

- Also extract `collectFiles` + `collectFilesFromDirectory` + `toRelativeTargetPath` into `lib/file-collector.js`.
- Also extract `writeLintResults` + `writeErrorLine` into `lib/lint-result-formatter.js`.

Option B is cleaner OOP-wise, but don't do it unless you have a second formatter or a second file-discovery mode in mind. Per the "don't design for hypothetical future features" guideline, option A alone is probably the right call.

**Also while you're in there:**

- `collectFilesFromDirectory` (`lint-cli.js:320`) uses separate `readdir` + `lstat` calls per entry. `fs.readdir(path, { withFileTypes: true })` returns `Dirent`s with `isDirectory()`, `isFile()`, `isSymbolicLink()` methods and halves the syscalls. Mechanical.
- `loadConfig` throws string-formatted errors with `cause`. That's fine. But `parseCliArgv` has a mixed job — it validates *and* stats the filesystem. Splitting "parse arguments" from "verify target exists" would make each easier to read. Low priority.

---

## 8. `lib/rules/index.js` — the registry is 200 lines of bookkeeping

**Why:** Every rule has two entries that must stay in sync: one `import` at the top and one `registry.set` at the bottom. Adding a rule is a 2-step mechanical chore. The file is 200 lines and grows linearly with rule count.

**Change (low-effort):**

- Build the registry from a single list instead of two:

    ```js
    const RULES = [
        ["comma-dangle", commaDangleRule],
        ["eqeqeq", eqeqeqRule],
        // ...
    ];
    const registry = new Map(RULES);
    ```

    Cuts the file in half (one entry per rule instead of two), makes sync errors impossible, and still supports tree-shaking.

**Don't** switch to dynamic import.meta.glob-style auto-discovery — that adds magic without a clear payoff, and we control the callers.

---

## 9. `rule-runner.js` — small cleanups

`lib/rule-runner.js` is fine overall. Minor:

- `addVisitor` (line 23) is defined inside `runRules`. It's only used in the `for` loop below. The whole visitor-merging step could be a one-liner:

    ```js
    for (const [name, cb] of Object.entries(ruleVisitors)) {
        if (typeof cb === "function") {
            const list = visitors.get(name) ?? [];
            list.push(cb);
            visitors.set(name, list);
        }
    }
    ```

    Nothing breaks if you leave `addVisitor` as-is; this is a taste call.

- The file has two import statements but imports `VISITOR_KEYS` from `./visitor-keys.js` when `SourceCode` already carries `visitorKeys` on the instance (`lib/source-code.js:15`). `runRules` could call `traverse(sourceCode.ast, sourceCode.visitorKeys, visitors)` and drop the import. One fewer dependency in this file.

---

## 10. `rule-context.js` — clean enough, one tiny naming thing

`lib/rule-context.js` is a good shape already. The one small thing: the constructor takes `messages` as an array and stores it as `this._messages`. The underscore leaks through to the caller (the rule runner creates the array). The encapsulation would be slightly better if the runner passed a callback instead:

```js
new RuleContext({ …, onReport: (msg) => messages.push(msg) });
```

But this is a wash ergonomically and doesn't enable anything. Leave it alone unless you're already in the file.

---

## 11. `disable-directives.js` — one structural note

`lib/disable-directives.js` is cohesive and reads well. The `DisableDirectives` class is the right size. Two small observations:

- `entries()` and the `[Symbol.iterator]` getter (`lib/disable-directives.js:63-73`) are unused outside the file. Grep confirms no callers. Delete them.
- `isSuppressedByRangeDirectives` (line 161) reads the directive list linearly on every message. For files with many messages and many range directives this is O(M·D). Not a bottleneck today, but if it ever becomes one, the fix is to pre-resolve "which rules are disabled at this (line, column)" once per file. Note for later, don't do it now.

---

## 12. `no-invalid-this.js` strict-mode helpers overlap with `strict.js`

`lib/rules/no-invalid-this.js:10` defines `hasUseStrictDirective` and `lib/rules/no-invalid-this.js:30` defines `isInStrictCode`. The `strict.js` rule also has logic about detecting `"use strict"` directives (`lib/rules/strict.js`, 243 lines — not yet read in full, but it's the rule whose whole job is strict directives).

**Action:** read `strict.js` when doing this pass; if they overlap, extract a shared `isStrictModeNode` helper into `lib/rules/utils.js`.

---

## 13. Things **not** to change

Per the guidelines, some things that might look like smells aren't worth touching:

- **Large rule files** (`no-constant-binary-expression.js` at 747 lines, `no-constant-condition.js` at 609 lines, `indent.js` at 342 lines, etc.). These address one rule each. Their internal helpers are tightly coupled to the rule's semantics. Splitting them to chase line counts would just move the cognitive load to a new file boundary without reducing it. Fix the duplicated helpers (section 1) and leave the rule-specific bulk alone.
- **The rule-registry pattern itself.** A plain `Map<string, RuleModule>` is already simple. Don't "promote" it to a class or add lifecycle hooks.
- **The `SourceCode` public API surface** beyond what section 4/5 covers. It mirrors ESLint's shape, which is a known contract, and there's no gain in breaking compatibility.
- **`parser.js`** is 85 lines, does one thing, and its token normalization is all domain knowledge of acorn ↔ ESTree. Leave it.
- **`traverser.js`** is 130 lines and handles two cases (with and without code-path analysis). Both are real. It's fine.
- **`visitor-keys.js`** is a static table. There is nothing to clean up.

---

## Suggested execution order

1. **Section 2** (dead `node.range` fallback) — lowest risk, biggest mechanical win, no behavior change.
2. **Section 4** (delete `getFirstTokens`/`getLastTokens`) — trivial dead-code deletion.
3. **Section 1a, 1b, 1c, 1d, 1e, 1f** (consolidate rule helpers) — these are 6 sub-passes, one helper at a time. Each is independently shippable. Start with 1a since it's the largest; then 1b; then 1c (which also touches `linter.js`); then 1d/1e together; 1f last.
4. **Section 3** (fix `indent.js` leaking `_allTokensSorted`) — quick, high-value.
5. **Section 6** (`linter.js` cleanups) — small, isolated.
6. **Section 7** (extract config resolver from `lint-cli.js`) — medium-sized, want tests green before and after.
7. **Section 8** (collapse `rules/index.js`) — mechanical.
8. **Section 5** (`SourceCode` token options audit) — only if the audit finding supports it.
9. **Section 1g** (super-call analysis extraction) — save for last. Highest risk, largest payoff.

After each section, run the full test suite (`node run-tests.js`) before moving to the next. Do not bundle sections into a single commit — each should be independently revertable.
