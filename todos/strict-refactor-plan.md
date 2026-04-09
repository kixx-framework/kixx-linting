# `strict` Rule Refactor Plan

## Why This Is Not Incremental

The current implementation in [lib/rules/strict.js](/Users/kris/Projects/kixx/linting/lib/rules/strict.js) is a deliberately simplified `Program`-only check:

- It only inspects top-level directives.
- It does not implement `"function"` mode.
- It does not implement `"safe"` mode semantics beyond one module-specific case.
- It does not consider `parserOptions.ecmaFeatures.impliedStrict`.
- It does not consider `parserOptions.ecmaFeatures.globalReturn`.
- It does not analyze nested function bodies, function expressions, arrow functions, methods, or class static blocks.
- It treats duplicate global directives as errors in `"global"` mode even though the ported fixture accepts them.

The first failures from [test/lib/rules/strict.test.js](/Users/kris/Projects/kixx/linting/test/lib/rules/strict.test.js) already show opposite behavior on both valid and invalid fixtures:

- Valid case index 11 (`// Intentionally empty`, `"global"` mode) currently reports a missing global directive.
- Invalid case index 1 (`function foo() { 'use strict'; return; }`, `"never"` mode) currently reports nothing because nested function directives are ignored.

That combination indicates the rule needs a semantic rewrite, not a localized fix.

## Refactor Goals

Implement behavior close to ESLint's `strict` rule for the cases covered by the ported suite:

- `"never"`: disallow strict directives where they are meaningful.
- `"global"`: require a program-level directive in classic scripts, but do not require one for modules or implied-strict code paths.
- `"function"`: require function-level directives for applicable functions in classic scripts, while ignoring scopes where directives are invalid or unnecessary.
- `"safe"`: behave like `"global"` when `globalReturn` is enabled, otherwise like `"function"`, with special handling for modules and implied strict mode.

## Proposed Steps

1. Build reusable helpers for:
   - Detecting directive prologues from a statement list.
   - Determining whether a body can legally contain directives.
   - Determining whether a node is already strict because of enclosing context, module semantics, class semantics, or implied strict mode.
   - Determining whether a function should be checked at all.

2. Replace the `Program`-only visitor with a multi-node traversal:
   - `Program`
   - `FunctionDeclaration`
   - `FunctionExpression`
   - `ArrowFunctionExpression`
   - Potentially method-like functions if their node shapes need separate handling

3. Model strictness context explicitly:
   - Program source type (`script` vs `module`)
   - `impliedStrict`
   - `globalReturn`
   - Whether the current function is inside a class body or class static block
   - Whether the current function body can have a directive prologue

4. Implement `"never"` mode first:
   - Report top-level directives.
   - Report nested function directives.
   - Skip contexts where `"use strict"` is not a directive prologue and should not be treated as such.

5. Implement `"global"` mode:
   - Require one top-level directive for classic scripts.
   - Do not require one for modules or implied-strict programs.
   - Decide duplicate-directive handling based on the fixture set instead of the current simplified assumption.

6. Implement `"function"` mode:
   - Require directives on applicable classic-script functions.
   - Do not require them in modules, implied-strict code, class methods/constructors, or other contexts already strict by definition.
   - Do not require directives inside class static blocks themselves, but do check ordinary functions nested inside those blocks.

7. Implement `"safe"` mode as a dispatcher:
   - If `globalReturn` is true, use `"global"` semantics.
   - Otherwise use `"function"` semantics.
   - Preserve module/implied-strict exemptions.

8. Add focused helper tests or temporary debug coverage while iterating:
   - Empty program in `"global"` mode.
   - Nested function directives in `"never"` mode.
   - Module behavior in `"global"` and `"safe"` modes.
   - Class methods and class static block cases.
   - Default-parameter functions where directive prologues are deprecated/invalid.

## Likely Edge Cases To Resolve During Rewrite

- Duplicate `"use strict"` directives that appear to be accepted in some fixture contexts.
- Functions with non-simple parameter lists where directive prologues are invalid in modern ECMAScript.
- Arrow functions with expression bodies versus block bodies.
- Methods and constructors, which are already strict inside classes.
- Static blocks, which do not have directive prologues, while nested ordinary functions inside them still do.

## Suggested Implementation Order

1. Add helper utilities and strictness-context detection.
2. Make `"never"` pass.
3. Make `"global"` pass.
4. Add `"function"` support.
5. Layer `"safe"` on top.
6. Re-run the full `strict` fixture and then trim any remaining behavioral mismatches one by one.
