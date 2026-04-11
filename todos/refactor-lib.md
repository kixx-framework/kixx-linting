# lib/ Refactoring Recommendations

Scope: everything under `lib/` **except** `lib/vendor/`. Vendor code is copied-in third-party and should not be restructured.

The recommendations are ordered by confidence and reversibility: deletions and exact-duplicate collapses come first, extractions come later, and judgment-call cleanups come last. Each item is self-contained so it can be shipped independently.

---

## 1. Delete dead code

These can be deleted with a single grep to prove nothing uses them. No behavior change.

### 1.1 Dead export: `findUselessBackreferences`

- **Where:** `lib/rules/regex-helpers.js:337-411` plus helpers `findCapturingGroupByIndex` (387), `findCapturingGroupByName` (399), `isInsideNode` (409).
- **Evidence:** `rg "findUselessBackreferences" lib/` returns exactly one hit — the definition itself.
- **Action:** Delete the function and its three private helpers.
- **Payoff:** ~75 lines removed, `regex-helpers.js` drops from 411 to ~336 lines.
- **Risk:** None. Pure deletion.
- **Verify:** `rg "findUselessBackreferences|findCapturingGroupByIndex|findCapturingGroupByName" lib/` returns nothing after the change.

### 1.2 Dead method: `DisableDirectives.getRangeDirectives`

- **Where:** `lib/disable-directives.js:67-69`.
- **Evidence:** `rg "getRangeDirectives" lib/` returns only the definition.
- **Action:** Delete the method. Also consider whether `entries()` (63) and `[Symbol.iterator]` (71) are used — `rg "disableDirectives\.(entries|\\[)" lib/` shows no callers, so they are also dead. `isSuppressed` is the only method actually consumed (by `linter.js:69`).
- **Payoff:** ~10 lines removed. `DisableDirectives` shrinks to a single-method class.
- **Risk:** None.

### 1.3 Dead fields on `SourceCode`

- **Where:** `lib/source-code.js:17-18` — `this._tokens = tokens;` and `this._comments = comments;`.
- **Evidence:** `rg "this\._tokens\b" lib/source-code.js` matches only the assignment; same for `this._comments`. Everything reads `_tokensSorted` / `_commentsSorted` / `_allTokensSorted`.
- **Action:** Drop the two assignments. Keep the constructor params (they feed the sorted arrays).
- **Payoff:** Trivial line savings, but removes fields that look meaningful and invite future confusion.

### 1.4 Dead field on `RuleContext`

- **Where:** `lib/rule-context.js:18, 23` — the `filename` option and the `this.filename` assignment.
- **Evidence:** `rg "context\.filename" lib/` returns zero hits. No rule ever reads it. It is passed by `rule-runner.js:47` which also passes `filename` into the context, but nothing downstream reads it.
- **Action:** Remove `filename` from `RuleContext` constructor, from `runRules` destructuring (`rule-runner.js:17`, `:49`), and from `linter.js:67` where it is forwarded. Trace to `lintText`'s `fileName` local variable (`linter.js:12`) — keep it only for the returned `filePath`.
- **Payoff:** Removes an unused plumbing parameter through three files.
- **Risk:** Very low. Grep proves no rule depends on it. If a future rule needs the filename, re-add it at that point.

### 1.5 Dead leading underscore: `_translateGlobals` vestigial comment

- **Where:** `lib/linter.js:87-107`.
- **Evidence:** The JSDoc says "the wrapper ignores values currently." `lib/vendor/eslint-scope/index.js:28-30` confirms it: `addGlobals(Object.keys(globals))`. The function exists only to filter out `"off"` values before passing them to the vendor wrapper.
- **Action:** Rename `_translateGlobals` → `filterDisabledGlobals` (or inline — it's 12 lines and called once). The leading underscore is a meaningless ESM holdover; nothing outside the module can reach it. Delete the stale JSDoc about value-preservation for future rules, since no future rule will read globals from the scope manager the way the comment implies.
- **Payoff:** Clearer intent at the call site; removes a misleading "design for future rules" comment.

### 1.6 Dead path in AST traversal

- **Where:** `lib/traverser.js:105-122` — the `else` branch that handles "unknown node types" by iterating `Object.keys(node)` with a hardcoded skip list (`parent`, `type`, `loc`, `range`, `start`, `end`).
- **Evidence:** `VISITOR_KEYS` (`lib/visitor-keys.js`) covers every ESTree node type acorn emits. Any unknown type would indicate a parser upgrade — at which point the fallback would hide the bug, not help.
- **Action:** Replace the `else` branch with `throw new Error(\`Unknown node type: ${node.type}\`)` OR simply delete it and let the traversal skip unknown nodes silently. Prefer the throw — a noisy failure is better than a silent one, and we control the parser version.
- **Payoff:** ~18 lines removed, one speculative generality branch gone.
- **Risk:** If a future parser upgrade introduces a new node type, the throw will surface it immediately in tests. This is the correct failure mode.

### 1.7 Dead defensive pattern: `node.range ? node.range[0] : node.start`

- **Where:** 16 occurrences across 10 files. `rg -c "node\\.range \\? node\\.range\\[0\\] : node\\.start" lib/` finds them.
    - `lib/source-code.js`: 7 sites (`getFirstToken`, `getLastToken`, `getTokenBefore`, `getTokenAfter`, `getFirstTokenBetween`, `getLastTokenBetween`, `getFirstTokens`, `getLastTokens`, `getTokensBetween`, `getCommentsInside`, `getScope`).
    - `lib/rules/no-constant-condition.js`, `no-constant-binary-expression.js`, `no-regex-spaces.js`, `no-undef.js`, `no-promise-executor-return.js`, `no-new-native-nonconstructor.js`, `no-obj-calls.js`, `no-new-wrappers.js`, `no-extend-native.js`, `no-misleading-character-class.js`: 1 each.
- **Evidence:** `parser.js:50` calls `parseWithAcorn(..., { ranges: true, locations: true })`. Verified with a scratch script: every node acorn emits has both `start`/`end` numbers and a `range` array. The ternary never takes its second branch.
- **Action:** Pick one. `start`/`end` are shorter and match what the rest of the codebase already uses in the majority of places (token iteration, comment slicing, etc.). Replace `node.range ? node.range[0] : node.start` with `node.start`, same for `node.range[1]`/`node.end`.
- **Payoff:** Cleaner code across ~10 files. Removes a defensive pattern that implies the invariant might be violated, which trips future readers trying to understand why it exists.
- **Risk:** Low, once verified. If any caller passes a synthetic "node" (e.g., the start/end object crafted by `indent.js`), make sure it still has `start`/`end` — a grep for hand-built objects will cover this.

---

## 2. Collapse exact duplication

These are cases where the same function exists verbatim (or near-verbatim) in multiple files. Each collapse removes lines without changing behavior.

### 2.1 `scopeContainsNode` helper — duplicated 9 times

- **Where:** Same 13-line body copy-pasted across:
    - `lib/rules/no-extend-native.js:33`
    - `lib/rules/no-new-native-nonconstructor.js:3`
    - `lib/rules/no-new-wrappers.js:3`
    - `lib/rules/no-obj-calls.js:14`
    - `lib/rules/no-promise-executor-return.js:13`
    - `lib/rules/no-regex-spaces.js:8`
    - `lib/rules/no-undef.js:6`
    - `lib/rules/no-misleading-character-class.js:100` (inlined)
    - Uses the same defensive `node.range ? ... : node.start` pattern as §1.7, so each copy is 13 lines.
- **Shared concept:** "Does `scope.block` contain `node` positionally?"
- **Owner:** `lib/rules/utils.js` (already collects cross-rule helpers). Add `isNodeInScopeBlock(scope, node)`.
- **Action:** Move one canonical copy to `utils.js`, delete the 8 other copies, import it at the top of each rule file. Combine with §1.7 — drop the `range ?` ternary in the canonical version.
- **Payoff:** ~90 lines of duplication removed. Touches 8 rule files, but mechanically.
- **Risk:** None, the bodies are verbatim modulo parameter order (two files use `(sourceCode, node, name)`, two use `(node, name, sourceCode)` — the extracted version should pick one order).
- **Verify:** After extraction, `rg "function scopeContainsNode" lib/rules/` returns nothing.

### 2.2 `hasShadowedDefinition` helper — duplicated 6 times

- **Where:**
    - `lib/rules/no-extend-native.js:47`
    - `lib/rules/no-new-native-nonconstructor.js:17`
    - `lib/rules/no-new-wrappers.js:17`
    - `lib/rules/no-obj-calls.js:28`
    - `lib/rules/no-promise-executor-return.js:27`
    - `lib/rules/no-regex-spaces.js:22`
    - `lib/rules/no-undef.js:128` (inlined)
- **Variation:** Two copies additionally filter `scope.type !== "global"` (`no-extend-native`, `no-new-native-nonconstructor`). Confirm via diff whether that matters or whether every copy should filter the global scope — they should all agree on a single behavior.
- **Owner:** `lib/rules/utils.js`, alongside `isNodeInScopeBlock`.
- **Action:** Extract to `hasShadowingDefinition(sourceCode, node, name)`. Pick the semantics that match ESLint's upstream rule (filter non-global). Update call sites.
- **Payoff:** ~50 lines removed, plus resolves the latent inconsistency between the two variants.
- **Risk:** Medium. The two variants may produce subtly different results if a user declares a top-level `var Promise = ...;`. Add or confirm a test case before unifying.

### 2.3 `parseDirectiveGlobals` helper — duplicated 7 times

- **Where:** Seven near-identical implementations of "parse `/* global foo, bar:off */` directive comments into `Map<name, value>`":
    - `lib/rules/no-obj-calls.js:35`
    - `lib/rules/no-new-wrappers.js:24`
    - `lib/rules/no-promise-executor-return.js:34`
    - `lib/rules/no-regex-spaces.js:29`
    - `lib/rules/no-undef.js:71`
    - `lib/rules/radix.js:5`
    - `lib/rules/no-setter-return.js:9` (named `parseGlobalComments`, same behavior)
    - `lib/rules/no-global-assign.js:33` (named `parseGlobalComments`, slightly different return shape — uses `writable:boolean`)
- **Shared concept:** Per-file parsing of `/*global*/` directives. This is **file-level** information that the owner should be `SourceCode`, not every rule.
- **Owner:** Best fit: add `sourceCode.getCommentGlobals()` → memoized `Map<string, string>`. Similar to `getDisableDirectives()` — same pattern of "parse comments once, cache, expose to rules." Could also live on `utils.js`, but caching per-file belongs on SourceCode so each rule doesn't re-scan the comments array.
- **Action:**
    1. Add `getCommentGlobals()` to `SourceCode` (constructor computes once, getter returns cached Map).
    2. Replace 7 rule-local `parseDirectiveGlobals` copies with `context.sourceCode.getCommentGlobals()`.
    3. For `no-global-assign`, reconcile the `writable:boolean` vs `"readonly"/"writable"` value shape — pick one. The `"off"`/`"readonly"`/`"writable"` string form is more informative; `no-global-assign` can convert locally.
- **Payoff:** ~140 lines of duplication removed. Replaces N comment-array scans per file with 1. Surfaces a subtle inconsistency between rules about directive comment parsing.
- **Risk:** Medium. Each existing copy has small differences in regex and trimming. Diff them carefully and add a unit test for the consolidated version before removing the copies.
- **Verify:** `rg "parseDirectiveGlobals|parseGlobalComments" lib/rules/` returns nothing.

### 2.4 `scopeContainsNode` + `hasShadowedDefinition` are part of a bigger pattern: "is this identifier a real reference to global X?"

After 2.1–2.3 land, several rules (`no-new-wrappers`, `no-new-native-nonconstructor`, `no-obj-calls`, `no-promise-executor-return`, `no-regex-spaces`, `radix`, `no-extend-native`) will still duplicate the sequence:

```
if (hasShadowingDefinition(...)) return false;
if (configuredGlobals[name] === "off") return false;
return directiveGlobals.get(name) !== "off";
```

- **Owner:** A single helper `isReferenceToEnabledGlobal(sourceCode, identifierNode, name, context)` on `utils.js` (or on SourceCode). Returns `true` iff the identifier references an un-shadowed, not-disabled global.
- **Action:** Land after §2.1–2.3. This is a larger, behavior-sensitive extraction; do it only once the primitives are clean and tested.
- **Payoff:** Collapses ~7 rule-local "is it really the global Promise / RegExp / parseInt / Symbol?" checks into a single call. Those rules shrink by 20–40 lines each.
- **Risk:** Medium-high. Easy to introduce a subtle semantic drift. Keep the extraction as a 1:1 refactor — no new behavior — and run the full test suite after each rule migrates.

### 2.5 `resolveVariableForIdentifier` helper — duplicated 4 times

- **Where:**
    - `lib/rules/no-obj-calls.js:69`
    - `lib/rules/preserve-caught-error.js:60`
    - `lib/rules/radix.js:39`
    - `lib/rules/valid-typeof.js:33` (inlined as a closure)
- **Shared concept:** "Walk up from an identifier's scope and return its resolved variable."
- **Owner:** `SourceCode` already has `getScope(node)`. Add `getResolvedVariable(identifier)` next to it. Rules should not be walking scope chains by hand.
- **Action:** Extract to `SourceCode.getResolvedVariable(identifierNode)`. Replace four rule-local copies.
- **Payoff:** ~30 lines removed; centralizes a scope-walking primitive with the object that owns scope state.
- **Risk:** Low, but cross-check with `valid-typeof.js:33` — it iterates `sourceCode.scopeManager.scopes` without walking `.upper`, which is a subtly different (and probably wrong) implementation. Unifying will fix that bug.

### 2.6 `getInnermostScope` duplicated between the two constant-expression rules

- **Where:**
    - `lib/rules/no-constant-condition.js:10-42`
    - `lib/rules/no-constant-binary-expression.js:6-38`
- **Evidence:** Bodies are byte-identical. Also duplicated: `isBuiltinConstantIdentifier`, `isUnshadowedGlobalName`, `hasStaticTemplateText`, and large chunks of `getStaticValue`.
- **Observation:** `SourceCode.getScope(node)` (lib/source-code.js:377) **already implements** `getInnermostScope` correctly. Both rules reinvent it.
- **Action:**
    1. Delete both `getInnermostScope` copies — callers use `sourceCode.getScope(node)` directly.
    2. Extract `getStaticValue`, `isBuiltinConstantIdentifier`, `isUnshadowedGlobalName`, and `hasStaticTemplateText` into a new module `lib/rules/constant-eval.js` shared by both rules.
- **Payoff:** Large. These are the two biggest rules in the codebase (`no-constant-condition.js` = 609 lines, `no-constant-binary-expression.js` = 747 lines). Extraction should strip 100+ lines from each. `getInnermostScope` alone is ~30 lines duplicated — and it's wrong to have it outside SourceCode since that's where scope state lives.
- **Risk:** Medium. `getStaticValue` has minor differences between the two files (e.g., the binary rule's ArrayExpression handling bails on spreads; the condition rule's recurses). Reconcile to the stricter behavior and add regression tests.
- **Verify:** After the change, `rg "getInnermostScope" lib/` returns nothing, and `rg "function getStaticValue" lib/rules/` returns only `constant-eval.js`.

### 2.7 `getStaticPropertyName` has three conflicting definitions

- **Where:**
    - `lib/rules/utils.js:1` — canonical: takes a `MemberExpression`.
    - `lib/rules/preserve-caught-error.js:14` — takes a `Property` (different shape entirely).
    - `lib/rules/no-setter-return.js:40` — takes any node; optional `allowIdentifier` flag.
- **Shared concept:** All three answer "what is the static string name of this key/property?" The surface looks the same but the input types differ, so callers can't actually share one implementation as-is.
- **Action:**
    1. Rename `lib/rules/utils.js` version → `getMemberStaticPropertyName(memberExpr)` to make it clear which node shape it accepts.
    2. Add `getPropertyKeyName(propertyNode)` for the Property shape used by `preserve-caught-error` and `no-dupe-class-members.js:6` (which also reinvents the same thing under the name `getStaticStringValue`).
    3. Delete the local copies and migrate callers.
- **Payoff:** Removes the misleading name collision. Three functions with the same name doing different things is worse than the duplication itself.
- **Risk:** Low, mechanical rename.

### 2.8 `isFunctionLike` / function-boundary check — duplicated 6 times

- **Where:**
    - `lib/rules/no-empty.js:6` (named `isFunctionLike`)
    - `lib/rules/no-use-before-define.js:42` (named `isFunctionBoundary`)
    - `lib/rules/no-invalid-this.js:1` (named `isFunction`)
    - `lib/rules/no-unsafe-finally.js` (inlined at 18-21, 51, 64, 80, 93 — five times in one file!)
    - `lib/rules/no-promise-executor-return.js:72-78` (inlined in `walk`)
    - `lib/rules/no-constant-condition.js:58-64` (inlined in `hasYield`)
- **Owner:** `lib/rules/utils.js`. Add `isFunctionLike(node)` returning true for `FunctionDeclaration | FunctionExpression | ArrowFunctionExpression`.
- **Action:** Extract once. Update callers. Replace the 5 inlined copies inside `no-unsafe-finally.js` first — that file is most improved by the cleanup.
- **Payoff:** Small line savings (~20 lines) but significantly improves readability of `no-unsafe-finally.js`, which currently repeats the triple `current.type === "…"` check on every scope-walk.
- **Risk:** None.

### 2.9 Near-identical rule bodies: `no-class-assign`, `no-const-assign`, `no-func-assign`, `no-ex-assign`

- **Where:** Compare these four files side-by-side. They all implement the same pattern:
    - `Program:exit` visitor.
    - Recursive `checkScope(s)` that walks `s.variables` and `s.childScopes`.
    - Filter variables by some predicate on `def.type` (or `def.parent.kind === "const"`).
    - Report write references that are not the initial declaration.
    - Dedupe with a `reported` `Set` keyed on `range[0]:range[1]`.
- **Files:** `no-class-assign.js` (46 lines), `no-const-assign.js` (53 lines), `no-func-assign.js` (48 lines), `no-ex-assign.js` (52 lines). ~200 lines total for essentially the same algorithm.
- **Shared concept:** "Report write references to variables matching predicate P, with message M."
- **Owner:** A new helper `lib/rules/reassignment-checker.js` (or inline into `utils.js`) exposing a function:
    ```
    reportWriteReferences(context, { isMatch, buildMessage })
    ```
    Each rule reduces to one declaration:
    ```
    create(context) {
        return {
            "Program:exit"(node) {
                reportWriteReferences(context, node, {
                    isMatch: def => def.type === "ClassName",
                    buildMessage: v => `'${v.name}' is a class.`,
                });
            }
        };
    }
    ```
- **Payoff:** Four rules collapse from 200 lines total to ~60. The duplicated `reported` set, duplicated scope recursion, and duplicated "skip initial declaration" logic all live in one place.
- **Risk:** Low — the four rules already behave the same way. This is purely a "name and extract" refactor.
- **Verify:** Tests for all four rules remain green.

### 2.10 `no-console` shares the same "report once, walk scopes" infrastructure

`no-console.js` (62 lines) also uses the `reported` Set and walks references. After §2.9, see whether it also fits the shared helper. It doesn't walk variable definitions — it walks `globalScope.through` — so it may stay separate. Note it in the PR description and skip extraction unless the helper generalizes cleanly.

---

## 3. Fix leaked internals

### 3.1 `indent.js` reaches into `sourceCode._allTokensSorted`

- **Where:** `lib/rules/indent.js:299`:
    ```
    for (const token of sourceCode._allTokensSorted) {
    ```
- **Evidence:** `rg "sourceCode\\._" lib/rules/` returns exactly this one hit. It is the only private-field access from rule code into `SourceCode`.
- **Problem:** `_allTokensSorted` is a private field of `SourceCode`. The indent rule effectively needs "all tokens including comments, in source order," but `SourceCode` already exposes this via `getTokens(node, { includeComments: true })`. Because indent needs the *whole program's* tokens, it could also call `getTokens(ast, { includeComments: true })`.
- **Action:** Replace with `sourceCode.getTokens(sourceCode.ast, { includeComments: true })` at `indent.js:299`. If there is a concern about an unnecessary array filter pass, add a narrow public method `getAllTokensAndComments()` on `SourceCode` that returns the cached sorted array directly.
- **Payoff:** Removes the only private-field leak from rules into SourceCode. Lets SourceCode rename/restructure its internals freely.
- **Risk:** Trivial.

### 3.2 `no-misleading-character-class` re-implements `SourceCode.getScope` inline

- **Where:** `lib/rules/no-misleading-character-class.js:83-118` (`resolveConstIdentifierString`).
- **Evidence:** The 35-line body is a hand-rolled innermost-scope walk that is semantically equivalent to `sourceCode.getScope(identifierNode)` — which is already implemented on `lib/source-code.js:377`.
- **Action:** Replace the inline walk with `const scope = context.sourceCode.getScope(identifierNode);`.
- **Payoff:** ~30 lines removed, same behavior.
- **Risk:** Low.

---

## 4. Misleading or unclear names (name-then-extract)

### 4.1 `SourceCode.commentsExistBetween` vs `_commentsSorted.some` open-code

- **Where:** `lib/source-code.js:296-304`. The body checks `cs >= start && ce <= end`. Other places (e.g., `getCommentsInside`) do the same filter.
- **Observation:** This is just `_filterByRange(this._commentsSorted, start, end).length > 0`. Factor the existing `_filterByRange` helper (already in the file, line 485) to avoid the inline filter.
- **Payoff:** Small, but unifies the "comments in range" idiom. Low value, low cost — do it if doing neighborhood cleanup on `SourceCode`.

### 4.2 `normalizeSeverity` accepts both strings and numbers; the error message doesn't explain

- **Where:** `lib/rule-runner.js:98-103`.
- **Observation:** Fine as-is, but add a one-line comment on the accepted shapes (currently explained in a JSDoc 10 lines above). Optional; skip if comment-shy.

### 4.3 `disable-directives.js` uses `DIRECTIVE_PREFIXES` and `RANGE_DIRECTIVE_PREFIXES` as Maps but only iterates them

- **Where:** `lib/disable-directives.js:1-9`. They're Maps so the code can do `for (const [prefix, getTargetLine] of DIRECTIVE_PREFIXES)`. An array of `{ prefix, handler }` tuples would be equivalent and require less cognitive overhead. Low priority.

---

## 5. Evaluate after §1–2 land

These depend on the earlier cleanup and should be reassessed once duplication is gone. Do not attempt them in the same PR.

### 5.1 Break up `indent.js` (342 lines) only if needed

`indent.js` is large but cohesive — one algorithm, one visitor, one responsibility. Lines-count alone is not a reason to split it. After §3.1 lands, re-read it end-to-end. If the `processStatements` logic and the `Program:exit` validation phase feel like two distinct concerns (they do, on first read), split into `buildExpectedIndentMap` and `validateIndent`. Otherwise leave it alone.

### 5.2 Consider a `Rule` base / factory

**Do not do this.** Every rule currently exports a POJO `{ meta, create }`. Adding a `defineRule(options)` wrapper or a `Rule` class would be a thin wrapper over existing shapes — it would not let us delete anything, and it would create one more name for future agents to learn. The repetition in `lib/rules/index.js` (import + `registry.set`) is mildly annoying but trivially manageable. Leave the registry alone.

### 5.3 Consider caching `parseDirectiveGlobals` output on SourceCode (see §2.3)

This is the payoff for §2.3. Once the function lives on `SourceCode`, per-file parsing happens once per lint run instead of up to 7× today. Measure before/after on a large file if perf matters.

---

## Suggested ordering for a sequence of PRs

1. **PR 1 — Deletions (§1).** Low risk, clear wins. Gets ~130 lines out of the tree and removes the `range ?` defensive pattern everywhere.
2. **PR 2 — `utils.js` extractions (§2.1, §2.2, §2.5, §2.8).** Moves the "scope + globals + function-like" primitives into one place. Sets up PR 3.
3. **PR 3 — Directive-globals consolidation (§2.3, §2.4).** Behavior-sensitive. Needs test coverage first. Expect a little follow-up for the `no-global-assign` value-shape reconciliation.
4. **PR 4 — Reassignment-checker extraction (§2.9).** Collapses four rules against a small helper.
5. **PR 5 — Constant-eval extraction (§2.6).** Touches the two largest rules. Run full test suite.
6. **PR 6 — Private-field fixes (§3.1, §3.2, §2.7).** Final cleanup of leaked internals and the `getStaticPropertyName` name collision.

After all six land, `lib/` should be ~500 lines shorter, the rule files should be visibly more uniform, and SourceCode should be the single owner of "file-level derived information" (comments, tokens, scopes, directives, globals).

---

## Tests and verification

- Run `node run-tests.js` after each PR. The test harness is the primary regression safety net for this refactor.
- For §2.3, §2.6, and §2.9, add explicit unit tests for the extracted helpers before deleting callers' copies.
- For §1.7 and §3.1, `rg` before and after the change to prove the pattern is gone.
