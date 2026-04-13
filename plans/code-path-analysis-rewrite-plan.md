# Code Path Analysis Rewrite Plan

## Implementation Approach

The vendored `lib/vendor/code-path-analysis/` module (~4,300 lines of CommonJS) will be rewritten as a modern ES module at `lib/code-path-analysis/`. The rewrite is a straight port — same architecture, same classes, same public API — converted from CommonJS to ES modules, updated to ES2022+ idioms (private fields, `Array.prototype.at()`, etc.), and made compliant with the project's ESLint rules (no `var`, no `++`/`--`, strict equality, trailing commas, 4-space indent, function declarations over expressions where applicable). The two `shared/` utility files (`assert.cjs`, `ast-utils.cjs`) will be inlined or replaced with standard library equivalents rather than carried forward as separate files. After all modules are ported, `lib/traverser.js` will be updated to import from the new location as a native ES module (removing the `createRequire` shim), and the vendored copy can be deleted.

---

## TODO List

- [x] **Port id-generator.js**
  - **Story**: Convert foundational utilities to ES modules
  - **What**: Rewrite `IdGenerator` class as an ES module. Replace `this.n` with a private field (`#n`). Replace `++` with `+= 1`. Export the class as a named export.
  - **Where**: `lib/code-path-analysis/id-generator.js`
  - **Acceptance criteria**: `IdGenerator` produces the same `{prefix}{n}` IDs; uses ES module syntax; passes project ESLint rules.
  - **Depends on**: none

- [x] **Port debug-helpers.js**
  - **Story**: Convert foundational utilities to ES modules
  - **What**: Rewrite the debug-helpers stub as an ES module. The vendored version exports a no-op object (`enabled: false`, all functions are no-ops). Port as-is with named exports.
  - **Where**: `lib/code-path-analysis/debug-helpers.js`
  - **Acceptance criteria**: Exports `enabled`, `dump`, `dumpState`, `dumpDot`, `makeDotArrows` as no-op named exports; passes ESLint.
  - **Depends on**: none

- [x] **Port code-path-segment.js**
  - **Story**: Convert graph node class to ES module
  - **What**: Rewrite `CodePathSegment` class as an ES module. Convert `internal` property to use a private field (`#internal`) with controlled access. Use private fields where appropriate. Replace `++` operators. Update `require("./debug-helpers")` to an ES import. Export as named export.
  - **Where**: `lib/code-path-analysis/code-path-segment.js`
  - **Acceptance criteria**: All static methods (`newRoot`, `newNext`, `newUnreachable`, `newDisconnected`, `markUsed`, `markPrevSegmentAsLooped`, `flattenUnusedSegments`) and instance methods preserved; ES module syntax; passes ESLint.
  - **Depends on**: Port debug-helpers.js

- [x] **Port fork-context.js**
  - **Story**: Convert forking logic to ES module
  - **What**: Rewrite `ForkContext` class and its helper functions (`createSegments`, `mergeExtraSegments`) as an ES module. Replace `require("./shared/assert.cjs")` with `import assert from "node:assert"` (use Node's built-in). Replace `require("./code-path-segment")` with ES import. Use private fields for internal state. Export class as named export.
  - **Where**: `lib/code-path-analysis/fork-context.js`
  - **Acceptance criteria**: All static methods (`newRoot`, `newEmpty`) and instance methods (`makeNext`, `makeUnreachable`, `makeDisconnected`, `add`, `replaceHead`, `addAll`, `clear`) preserved; uses `node:assert` instead of custom assert shim; passes ESLint.
  - **Depends on**: Port code-path-segment.js

- [x] **Port code-path-state.js**
  - **Story**: Convert state management to ES module
  - **What**: Rewrite `CodePathState` class and all internal context classes (`BreakContext`, `ChainContext`, `ChoiceContext`, `WhileLoopContext`, `DoWhileLoopContext`, `ForLoopContext`, `ForInLoopContext`, `ForOfLoopContext`, `SwitchContext`, `TryContext`) as an ES module. This is the largest file (~2,370 lines). Convert `require` calls to ES imports. Use private fields where appropriate. Replace `++`/`--` with `+= 1`/`-= 1`. Export `CodePathState` as a named export; context classes remain module-private.
  - **Where**: `lib/code-path-analysis/code-path-state.js`
  - **Acceptance criteria**: All public methods on `CodePathState` preserved with identical behavior (fork management, choice management, loop management, break/continue, try/catch/finally, switch, throw, return); all context classes ported; passes ESLint.
  - **Depends on**: Port code-path-segment.js, Port fork-context.js

- [x] **Port code-path.js**
  - **Story**: Convert code path container to ES module
  - **What**: Rewrite `CodePath` class as an ES module. Convert `require` calls to ES imports. Move the `currentSegment` getter (currently monkey-patched in `index.cjs`) directly into the class definition. Use `Object.defineProperty` for `internal` or a private field with a static accessor. Export as named export.
  - **Where**: `lib/code-path-analysis/code-path.js`
  - **Acceptance criteria**: All properties (`id`, `origin`, `upper`, `childCodePaths`), getters (`initialSegment`, `finalSegments`, `returnedSegments`, `thrownSegments`, `currentSegment`), static methods (`getState`), and `traverseSegments()` method preserved; `currentSegment` getter is part of the class (not monkey-patched); passes ESLint.
  - **Depends on**: Port code-path-state.js, Port id-generator.js

- [x] **Port code-path-analyzer.js**
  - **Story**: Convert main analyzer to ES module
  - **What**: Rewrite `CodePathAnalyzer` class and all helper functions (`isCaseNode`, `isPropertyDefinitionValue`, `isHandledLogicalOperator`, `isLogicalAssignmentOperator`, `getLabel`, `isForkingByTrueOrFalse`, `getBooleanValueIfSimpleConstant`, `isIdentifierReference`, `forwardCurrentToHead`, `preprocess`, `processCodePathToEnter`, `processCodePathToExit`, `postprocess`) as an ES module. Replace `require("./shared/assert.cjs")` with `import assert from "node:assert"`. Replace `require("./shared/ast-utils.cjs")` usage — inline the `breakableTypePattern` regex directly since it's a one-liner. Convert all other `require` calls to ES imports. Export `CodePathAnalyzer` as named export.
  - **Where**: `lib/code-path-analysis/code-path-analyzer.js`
  - **Acceptance criteria**: `CodePathAnalyzer` class with `enterNode()`, `leaveNode()`, and `onLooped()` methods preserved; all helper functions ported; `breakableTypePattern` inlined; uses `node:assert`; passes ESLint.
  - **Depends on**: Port code-path.js, Port code-path-segment.js, Port id-generator.js, Port debug-helpers.js

- [x] **Create module index**
  - **Story**: Provide a clean public entry point
  - **What**: Create an `index.js` entry point that re-exports `CodePathAnalyzer` as the default export (matching the current `index.cjs` behavior). No monkey-patching needed since `currentSegment` will be built into `CodePath` directly.
  - **Where**: `lib/code-path-analysis/index.js`
  - **Acceptance criteria**: `import CodePathAnalyzer from "./code-path-analysis/index.js"` works; default export is `CodePathAnalyzer`; passes ESLint.
  - **Depends on**: Port code-path-analyzer.js

- [x] **Update traverser.js to use new module**
  - **Story**: Wire up the new ES module and remove CommonJS shim
  - **What**: In `lib/traverser.js`, remove the `createRequire` import and the `require()` call for the vendored module. Replace with a standard ES import of `CodePathAnalyzer` from `"./code-path-analysis/index.js"`. Remove the `const require = createRequire(...)` line.
  - **Where**: `lib/traverser.js`
  - **Acceptance criteria**: `traverser.js` uses only ES imports; no `createRequire` or `require()` calls remain; code-path analysis still works identically for rules that subscribe to code-path events.
  - **Depends on**: Create module index

- [x] **Lint and validate**
  - **Story**: Ensure all new code passes project standards
  - **What**: Run the project's ESLint configuration against `lib/code-path-analysis/` and fix any violations. Run any existing tests to verify no regressions in traversal or code-path event emission.
  - **Where**: `lib/code-path-analysis/**/*.js`, `lib/traverser.js`
  - **Acceptance criteria**: Zero ESLint errors/warnings on all new files; existing tests pass; no regressions in code-path event behavior.
  - **Depends on**: Update traverser.js to use new module

- [x] **Remove vendored copy**
  - **Story**: Clean up the old dependency
  - **What**: Delete `lib/vendor/code-path-analysis/` directory entirely. Verify no other files import from it.
  - **Where**: `lib/vendor/code-path-analysis/` (deletion)
  - **Acceptance criteria**: Directory removed; no remaining references to `vendor/code-path-analysis` in the codebase; all tests still pass.
  - **Depends on**: Lint and validate
