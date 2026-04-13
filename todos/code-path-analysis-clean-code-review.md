# Code Path Analysis Port: Clean Code Refactor Opportunities

Date: 2026-04-13

Scope reviewed:
- `lib/code-path-analysis/`

Validation performed:
- `node lint.js lib/code-path-analysis` (passes)

## 1) Encapsulation leak in `CodePathSegment` internals

- **Smell (evidence)**:
  - Public internal state accessor in [`lib/code-path-analysis/code-path-segment.js:91`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-segment.js:91).
  - Internal flags mutated via `.internal` in [`code-path-segment.js:170`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-segment.js:170), [`code-path-segment.js:173`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-segment.js:173), [`code-path-segment.js:208`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-segment.js:208), [`code-path-segment.js:230`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-segment.js:230).
- **Current safe contract/invariant**:
  - All current `.internal` uses are in the same module/class static methods, so callers can be migrated without cross-file breakage.
- **Proposed owner**:
  - `CodePathSegment` class only.
- **Smallest shippable change**:
  - Remove `get internal()`.
  - Replace `segment.internal.*` uses with class-private access (`segment.#internal.*`) inside static methods.
  - Add tiny internal helpers (`isUsed`, `markUsedInternal`) only if needed for clarity.
- **Expected payoff**:
  - Removes leaked mutable internals and clarifies ownership of segment invariants.
- **Risk level**:
  - Low.
- **Verification**:
  - `rg -n "\.internal\b" lib/code-path-analysis`
  - `node lint.js lib/code-path-analysis/code-path-segment.js`
  - `node run-tests.js`

## 2) `CodePath` exposes mutable state object through `internal` getter

- **Smell (evidence)**:
  - Public `internal` getter in [`lib/code-path-analysis/code-path.js:72`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path.js:72).
  - External accessor method returns that object in [`code-path.js:68`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path.js:68).
- **Current safe contract/invariant**:
  - Main consumers already use `CodePath.getState(codePath)` in analyzer logic; direct external `.internal` usage is minimal.
- **Proposed owner**:
  - `CodePath` for access control, `CodePathState` for mutation rules.
- **Smallest shippable change**:
  - Remove public `internal` getter.
  - Change `CodePath.getState(codePath)` to return `codePath.#internal` directly (allowed within class body).
  - Update internal class getters to reference `this.#internal` directly.
- **Expected payoff**:
  - Reduces coupling and prevents accidental state mutation from unrelated modules.
- **Risk level**:
  - Medium (API surface tightening).
- **Verification**:
  - `rg -n "codePath\.internal|\.internal\b" lib/code-path-analysis lib/traverser.js`
  - `node lint.js lib/code-path-analysis/code-path.js`
  - `node run-tests.js`

## 3) Dynamic method attachment onto arrays in `CodePathState`

- **Smell (evidence)**:
  - Arrays are used as data containers and then receive methods at runtime in [`lib/code-path-analysis/code-path-state.js:943`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-state.js:943), [`code-path-state.js:950`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-state.js:950), [`code-path-state.js:965`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-state.js:965), [`code-path-state.js:971`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/code-path-state.js:971).
- **Current safe contract/invariant**:
  - Call sites only require `.add(...)` and array iteration semantics.
- **Proposed owner**:
  - `CodePathState` should own “final segment collection” behavior.
- **Smallest shippable change**:
  - Replace ad hoc array mutation with a named helper object/factory in the same module (for example `createFinalSegmentsStore()`), exposing `items` and `add()`.
  - Keep adapter getters in `CodePath` to return arrays to preserve external behavior.
- **Expected payoff**:
  - Makes this invariant explicit and removes surprising hidden behavior from plain arrays.
- **Risk level**:
  - Medium.
- **Verification**:
  - `rg -n "returnedForkContext|thrownForkContext" lib/code-path-analysis`
  - `node lint.js lib/code-path-analysis/code-path-state.js lib/code-path-analysis/code-path.js`
  - `node run-tests.js`

## 4) Missing explicit bounds/assertions in `ForkContext.createSegments`

- **Smell (evidence)**:
  - Index normalization and direct indexing without invariant checks in [`lib/code-path-analysis/fork-context.js:39`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/fork-context.js:39), [`fork-context.js:41`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/fork-context.js:41), [`fork-context.js:50`](/Users/kris/Projects/kixx/linting/lib/code-path-analysis/fork-context.js:50).
- **Current safe contract/invariant**:
  - Existing call patterns currently produce valid ranges; behavior depends on that implicit precondition.
- **Proposed owner**:
  - `ForkContext` helper `createSegments`.
- **Smallest shippable change**:
  - Add `assert(...)` precondition checks for normalized index bounds and list shape before indexing.
- **Expected payoff**:
  - Fail-fast behavior for broken call sequences; easier debugging for future changes.
- **Risk level**:
  - Low.
- **Verification**:
  - `node lint.js lib/code-path-analysis/fork-context.js`
  - `node run-tests.js`

