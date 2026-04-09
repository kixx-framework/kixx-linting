# `preserve-caught-error` refactor plan

## Why this is not incremental

The current implementation only supports this narrow shape:

- `catch (errorIdentifier) { throw new Error(..., { cause: errorIdentifier }) }`

The new test matrix requires substantially more behavior:

- Accept `cause` keys written as identifiers, strings, and computed string literals.
- Respect `requireCatchParameter`.
- Handle `AggregateError`, where options are the third argument.
- Ignore throws inside nested function/class/static-block boundaries.
- Recognize when built-in `Error` names are shadowed by imports or local bindings.
- Distinguish correct and incorrect `cause` usage when multiple properties exist.
- Reject missing or incorrect causes across nested blocks and multiple throw sites.
- Avoid false positives for complex option objects where cause analysis is not reliable.
- Detect invalid cases involving destructured catch params and partially discarded errors.

That requires a broader semantic analyzer, not a small patch.

## Refactor steps

1. Expand option handling.
   - Add schema and read `requireCatchParameter`.
   - If `requireCatchParameter` is `false`, allow `catch { ... }`.
   - If `true`, report throws of built-in errors inside `catch { ... }` when no caught error can be preserved.

2. Replace the current `findParentCatch()`/`getCauseNode()` logic with a structured analyzer.
   - Walk upward from each throw until the nearest `CatchClause`, but stop at new function/class/static-block boundaries.
   - Extract a normalized description of the catch binding:
     - identifier binding
     - destructured binding
     - omitted binding
   - Track whether the original caught error is fully preserved, partially preserved, or unavailable.

3. Add built-in error constructor detection that respects shadowing.
   - Recognize `Error`, `TypeError`, `AggregateError`, etc. only when they resolve to globals.
   - Ignore imported/local bindings named `Error`.
   - Support both `new Error(...)` and `Error(...)`.

4. Normalize error options extraction.
   - For `Error`-family constructors, treat the second argument as options.
   - For `AggregateError`, treat the third argument as options.
   - If the options argument is missing, empty, or a simple object expression, analyze it.
   - If options contain spread properties or other complex constructs that prevent reliable analysis, skip reporting when the rule should conservatively avoid false positives.

5. Normalize `cause` property lookup.
   - Accept these property spellings:
     - `cause`
     - `"cause"`
     - `'cause'`
     - `` `cause` ``
     - computed string literals that statically resolve to `"cause"`
   - When multiple `cause` properties exist, use the last applicable one to match runtime object semantics.
   - Treat getters/setters/methods named `cause` as invalid for preservation purposes.

6. Add catch-binding identity analysis.
   - Valid direct preservation:
     - `cause: err`
   - Invalid preservation:
     - `cause: unrelated`
     - `cause: err.message`
     - `cause: e` where `e` is an alias of `err` but alias tracking is intentionally out of scope for now
     - `cause` references shadowed by inner bindings
   - Destructured catch params should be treated as partial loss of the original error and reported.

7. Support multiple throw sites per catch block.
   - Each qualifying built-in error throw inside the same catch should be analyzed independently.
   - Nested blocks, loops, and switch cases should still be considered part of the catch unless a new function boundary intervenes.

8. Preserve conservative escapes.
   - Do not report:
     - no throw in catch
     - throws from nested functions defined inside catch
     - complex spread-based option objects where reliable cause detection is not possible
     - custom/shadowed error constructors

## Verification sequence

1. Re-run:
   - `node run-tests.js test/lib/rules/preserve-caught-error.test.js`
2. If that passes, run nearby regression coverage:
   - `node run-tests.js test/lib/rules`
3. Review any failures for over-reporting around shadowed globals and nested-function boundaries first.
