# `no-useless-assignment` Rewrite Plan

## Goal

Replace the current `lib/rules/no-useless-assignment.js` implementation with a rule that can correctly answer:

- Was a specific assigned value ever read before being overwritten?
- Did that read happen on at least one reachable path?
- Is the write intentionally exempt because the value may escape or be observed indirectly?

The current file does not have a reliable model for those questions. It needs a real control-flow-aware implementation rather than another local patch.

## Current Status

The current implementation in [lib/rules/no-useless-assignment.js](/Users/kris/Projects/kixx/linting/lib/rules/no-useless-assignment.js) is already partially refactored away from the original naive reference-sort approach, but it is still not correct.

At the moment:

- Three target test files pass:
  - [test/lib/rules/no-unused-labels.test.js](/Users/kris/Projects/kixx/linting/test/lib/rules/no-unused-labels.test.js)
  - [test/lib/rules/no-unused-private-class-members.test.js](/Users/kris/Projects/kixx/linting/test/lib/rules/no-unused-private-class-members.test.js)
  - [test/lib/rules/no-use-before-define.test.js](/Users/kris/Projects/kixx/linting/test/lib/rules/no-use-before-define.test.js)
- One target test file still fails:
  - [test/lib/rules/no-useless-assignment.test.js](/Users/kris/Projects/kixx/linting/test/lib/rules/no-useless-assignment.test.js)

Representative failing cases from that file:

- False positive:
  ```js
  function foo() {
      let v = "used";
      if (condition) {
          //
      } else {
          v = "used-2";
      }
      console.log(v);
  }
  ```
  The assignment in the `else` branch is used after the merge, but the current rule reports it.

- False negative:
  ```js
  let v = "used";
  console.log(v);
  v = "unused";
  ```
  The final assignment is unused, but the current rule misses it.

These two failures alone show that the current design is not trustworthy:

- it misses some reachable reads after merges
- it also misses obvious terminal overwrites

That combination usually means the abstraction boundary is wrong, not just one edge case.

## Why the Current Rule Fails

### 1. It records operations at the wrong granularity

The rule currently tries to attach reads and writes directly to active code-path segments during AST traversal.

That is too low-level and too eager:

- reads are observed at `Identifier` nodes
- writes are observed at expression/declarator exit points
- reachability is modeled at segment granularity

But the actual question is value liveness across statements and expression boundaries. The current rule does not have a stable notion of:

- when a write becomes visible
- whether a later read is on the same path
- whether a merge has already seen all predecessor effects

### 2. Segment-time recording is not enough on its own

The attempted fixed-point pass over segment operations is directionally correct, but the collected operations are still incomplete or attached to the wrong segments for some patterns.

Observed symptom:

- an `else` branch write was recorded on its branch segment
- the later `console.log(v)` read was not being applied in a way that preserved that write across the merge

This suggests one or more of:

- the read is not being attached to the merged segment correctly
- the merged segment is not seeing predecessor out-state as intended
- the operation order inside segments is wrong for some node shapes
- scope/reference lookup is not aligned with the traversal timing for every identifier occurrence

Even if that specific bug is fixed, the design is still brittle because the rule is reconstructing value flow from raw identifiers instead of from statement semantics.

### 3. It does not model “value escape” robustly

The rule currently exempts some variables if they are read from another scope:

- closures
- async callbacks
- delayed reads

That is necessary, but the current filter is too coarse to be the main safety mechanism.

There are several cases where a value can be observed without a direct local read:

- passed to another function call
- captured by a closure
- exported
- used in `return`, `throw`, `yield`, `await`, or destructuring defaults
- used indirectly through compound assignments or update expressions

The rewrite should treat these as part of normal value-flow semantics, not as scattered special cases.

### 4. It mixes “reference identity” with “value identity”

The rule is really about writes, not variables in the abstract.

For one variable:

```js
let x = 1;
x = 2;
x = 3;
console.log(x);
```

The liveness object is not “x”; it is each individual write:

- write W1: `x = 1`
- write W2: `x = 2`
- write W3: `x = 3`

The rule should determine:

- W1 overwritten before any read -> report
- W2 overwritten before any read -> report
- W3 read by `console.log(x)` -> do not report

The current implementation gestures toward this by storing write records, but the overall dataflow is still not driven from a clean “reaching writes” model.

## Correct Mental Model

The clean model is:

1. Each assignment-like operation produces a distinct write token.
2. Each program point has a set of reaching writes per variable.
3. A read marks all reaching writes for that variable as “used”.
4. A new write kills previous reaching writes for that variable and becomes the new reaching write.
5. At the end, any write token never marked “used” is reportable unless exempt.

That is classic forward dataflow.

For this rule, the core state at each control-flow point is:

```js
Map<Variable, Set<WriteRecord>>
```

Where:

- `Variable` is the scope-managed variable object
- `WriteRecord` describes one concrete write occurrence

Suggested `WriteRecord` shape:

```js
{
    id: number,
    variable,
    node,
    kind, // "init" | "assign" | "update" | "destructure" | "for-in" | "for-of"
    loc,
    used: false,
    escaped: false,
}
```

## Recommended Rewrite Strategy

### Recommendation

Do not continue patching the current file in place.

Instead:

1. Replace the current logic with a statement-oriented transfer engine.
2. Use code-path segments only as the CFG backbone.
3. Record semantic operations at stable boundaries.
4. Run a fixed-point analysis over those operations after traversal.

### Architecture

Split the implementation into four layers.

#### Layer 1: Variable eligibility

A small set of helpers should determine whether a variable is even eligible for reporting.

Suggested helper:

```js
function classifyVariable(variable, sourceCode) -> {
    track: boolean,
    reason?: string,
}
```

This should reject:

- implicit globals / unresolved refs
- variables with no definitions
- exported variables
- variables read from nested scopes where timing cannot be proven locally
- cases intentionally outside rule scope

This layer should be conservative.

#### Layer 2: Semantic operation extraction

Traverse the AST and emit normalized operations.

Suggested operation types:

- `read(variable, node)`
- `write(variable, node, kind)`
- `escape(variable, node, reason)`

Important point:

Do not treat every identifier uniformly. Normalize by construct.

Examples:

- `let x = 1;`
  - write `x`
- `x = y;`
  - read `y`
  - write `x`
- `x += 1;`
  - read `x`
  - write `x`
- `x++;`
  - read `x`
  - write `x`
- `({ a: x } = foo())`
  - read `foo`
  - write `x`
- `console.log(x)`
  - read `x`
- `return x`
  - read `x`
- `setTimeout(() => x, 0)`
  - likely escape `x` if closure capture is seen

The current `Identifier`-driven approach is too noisy. The rewrite should have explicit handlers for constructs that carry value semantics.

#### Layer 3: Segment-local ordered operation lists

For each reachable code-path segment, store an ordered list of operations that occur in that segment.

Suggested structure:

```js
Map<CodePathSegment, Operation[]>
```

Each operation should already be semantically normalized when added.

This avoids having later analysis reason about raw AST shapes.

#### Layer 4: Fixed-point reaching-write solver

After traversal:

1. initialize `inState` and `outState` for each segment
2. iterate until convergence
3. for each segment:
   - merge predecessor `outState`s into `inState`
   - apply that segment’s ordered operations to produce `outState`

Transfer function:

- `read(v)`:
  - mark all reaching writes for `v` as used
- `write(v, w)`:
  - replace reaching writes for `v` with `{w}`
- `escape(v)`:
  - mark all reaching writes for `v` as used or non-reportable

After convergence:

- report all tracked writes where `used === false` and `escaped === false`

## Suggested File Structure

Keep the rule file manageable by extracting helpers inside the same module first. If it gets too large, split later.

Suggested internal sections:

1. reference/scope helpers
2. export/directive parsing
3. variable classification
4. operation extraction helpers
5. pattern write extraction
6. dataflow state helpers
7. rule visitor

The immediate priority is correctness, not early micro-abstraction.

## Construct-by-Construct Semantics

This section is the most important part of the rewrite.

### Variable declarations

```js
let x = 1;
const x = 1;
var x = 1;
```

Treat initializer as a write.

If the initializer reads the same variable:

```js
var x = x;
let x = x;
const x = x;
```

That is a read before/while defining in `no-use-before-define`, but for `no-useless-assignment` it still means:

- initializer reads old value or TDZ behavior
- resulting write may or may not be used later

Keep these concerns separate. `no-useless-assignment` should only reason about whether the produced value is later used.

### Plain assignment

```js
x = y;
```

Semantics:

- read `y`
- write `x`

### Compound assignment

```js
x += 1;
x ||= y;
x &&= y;
x ??= y;
```

Semantics:

- always read current `x`
- conditionally or unconditionally write `x`

For logical assignments:

- `x ||= y`
  - read `x`
  - write only on path where assignment occurs
- same for `&&=` and `??=`

This is one place where raw identifier handling is especially dangerous.

### Update expressions

```js
x++;
--x;
```

Semantics:

- read `x`
- write `x`

Even if the expression value itself is unused, the assigned value might still be used later.

### Destructuring assignment

```js
({ a: x } = obj);
[x] = arr;
```

Semantics:

- read RHS
- write each bound target

Nested defaults:

```js
const { a, b = a } = obj;
```

Semantics:

- write `a`
- read `a` in `b` default
- write `b`

Operation extraction has to preserve this order.

### `for-in` / `for-of`

```js
for (x in obj) {}
for (x of arr) {}
```

Semantics:

- read RHS
- write loop target on each iteration

The write may be used:

- inside the body
- on later iterations
- after the loop if the variable survives

This makes loops one of the hardest cases. The rewrite should rely on the CFG rather than handwave iteration behavior.

### Conditionals and merges

```js
if (cond) {
    x = 1;
} else {
    x = 2;
}
console.log(x);
```

Both writes are used.

```js
if (cond) {
    x = 1;
}
console.log(x);
```

That write is used on the path where it executes.

The rule should report a write only if it is unused on every path where it occurs.

### Loops

```js
while (cond) {
    x = 1;
    console.log(x);
}
```

The write is used.

```js
while (cond) {
    x = 1;
}
```

Potentially unused, but loops need care:

- a write in one iteration may be read in the next
- a write may be observed after loop exit
- a `break`/`continue` changes liveness

This is exactly why the rewrite should use the existing code-path engine.

### `try` / `catch` / `finally`

These are major sources of false positives.

Examples from the test file already cover:

- writes before a possibly-throwing call
- writes inside nested try blocks
- writes in catch/finally that feed later reads

The rewrite must let the CFG handle exceptional edges naturally rather than hardcoding try/catch special cases one at a time.

### Cross-scope reads

```js
let x = 1;
setTimeout(() => console.log(x), 0);
x = 2;
```

This is intentionally conservative territory.

Practical recommendation:

- if a tracked variable is read from any nested scope, mark it as non-reportable for the containing code path
- do not try to prove callback timing locally

That matches the safe direction for linting.

### Member writes

```js
obj.x = 1;
arr[i] = 2;
```

These should not be in scope for this rule unless the rule explicitly intends property-level value tracking.

Current tests suggest the rule focuses on variable assignments, not object property liveness. Keep property writes out of tracking.

## Proposed Implementation Steps

### Step 1: Throw away the current operation recording logic

Specifically remove:

- `Identifier`-as-primary-semantics logic
- direct per-segment mutation during traversal
- assumptions that current active segments already reflect final predecessor state

### Step 2: Build a normalized operation emitter

Implement helpers like:

```js
emitRead(node)
emitWrite(node, kind)
emitPatternWrites(pattern, kind)
emitEscape(variable, node, reason)
```

These should resolve references and drop untrackable variables immediately.

### Step 3: Attach operations at stable node exits

Recommended hooks:

- `VariableDeclarator:exit`
- `AssignmentExpression:exit`
- `UpdateExpression:exit`
- `ForInStatement:exit`
- `ForOfStatement:exit`
- possibly `CallExpression`, `ReturnStatement`, `ThrowStatement`, `YieldExpression`, `AwaitExpression` for escape/read handling

Avoid generic `Identifier` visitors except as a low-level helper for specific constructs.

### Step 4: Build a proper dataflow solve

At `Program:exit`:

- enumerate reachable segments
- initialize `in/out` states
- iterate to fixpoint
- apply segment operation lists in order

This is the part that should be mathematically boring.

### Step 5: Report only after convergence

Never report during traversal.

Reporting must happen only after:

- all reads are known
- all overwrite relationships are settled
- all escaping variables have been classified

### Step 6: Add focused regression tests during development

The imported corpus is broad, but the rewrite will be easier to debug if you add tiny temporary probes while implementing.

Minimal cases to verify repeatedly:

1. terminal unused write
   ```js
   let x = 1;
   x = 2;
   ```

2. branch merge read
   ```js
   let x = 1;
   if (a) {} else { x = 2; }
   console.log(x);
   ```

3. overwrite chain
   ```js
   let x = 1;
   x = 2;
   x = 3;
   console.log(x);
   ```

4. closure escape
   ```js
   let x = 1;
   setTimeout(() => x, 0);
   x = 2;
   ```

5. try/catch
   ```js
   let x = 1;
   try {
       x = foo();
   } catch {
       x = 2;
   }
   console.log(x);
   ```

6. loop-carried use
   ```js
   let x = 0;
   while (cond) {
       console.log(x);
       x = 1;
   }
   ```

## Known Risk Areas

These should be called out explicitly during the rewrite.

### Risk 1: AST traversal order vs semantic order

Example:

```js
({ a, b = a } = obj);
```

The semantic order matters.

If traversal order does not match evaluation order, the rule must normalize explicitly.

### Risk 2: scope lookup timing

Some references may be easiest to resolve with `sourceCode.getScope(node)`, but the exact parent chain matters.

Do not assume every identifier’s nearest scope owns its reference record.

### Risk 3: code-path segment event timing

Segment start/end events do not automatically imply “all predecessor operations have been finalized”.

That is why the transfer solve must happen after traversal.

### Risk 4: false confidence from broad exemptions

It is easy to “fix” hard cases by exempting too much:

- all variables used in functions
- all loop writes
- all try/catch writes

That would make the rule pass tests more easily but would hollow it out.

Prefer precise semantics over broad suppression.

## What Not To Do

These are tempting but wrong shortcuts.

### Do not go back to sorted references only

That approach cannot correctly model:

- branches
- loops
- exceptional edges
- conditional writes

### Do not report immediately when a later write is seen

A later write does not prove the earlier write was useless unless no read exists on any reachable path in between.

### Do not use “next read / next write by source order” as the main algorithm

Source order is not control flow.

### Do not treat every `Identifier` read uniformly

Many identifiers occur in structural positions:

- binding positions
- destructuring targets
- computed keys
- defaults

These must be interpreted by construct.

## Suggested End State

The final rule should look roughly like this:

- a small front section for helper predicates
- a middle section for operation extraction
- a small, explicit dataflow solver
- a short reporting phase

If it is correct, the rule should be easier to reason about than the current version, even if it is longer.

That is the right tradeoff here.

## Validation Checklist

Before considering the rewrite done:

- `node run-tests.js test/lib/rules/no-useless-assignment.test.js` passes
- previously passing rule tests still pass if the full suite is sampled
- branch merge false positive is gone
- trailing assignment false negative is gone
- loop, try/catch, destructuring, and closure tests still behave conservatively
- no debug instrumentation remains in the rule

## Recommended Next Action

Start from a clean rewrite of [lib/rules/no-useless-assignment.js](/Users/kris/Projects/kixx/linting/lib/rules/no-useless-assignment.js) using:

- normalized semantic operations
- segment-local ordered op lists
- post-traversal fixed-point reaching-write analysis

Do not continue iterating on the current hybrid approach unless there is a very small targeted reason to preserve part of it.
