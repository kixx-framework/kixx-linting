## prefer-const refactor plan

The current implementation in `lib/rules/prefer-const.js` is too narrow to satisfy the imported test corpus with incremental patching.

Current gaps:

- It only considers `let` declarators with an initializer.
- It skips all uninitialized `let` declarations, which breaks cases like `let x; x = 0;`.
- It hard-codes `ForStatement` exclusion and misses `for-in` / `for-of` semantics.
- It ignores rule options such as `destructuring` and `ignoreReadBeforeAssign`.
- It does not account for `/* exported */` comments or other source-text based exclusions.
- It relies only on reference write counts, which is not enough for read-before-assign, split initialization, and cross-scope cases in the test set.
- It reports per declarator only, but the expected behavior depends on variable-level analysis across a scope and sometimes across patterns.

Refactoring steps:

1. Build a scope-level candidate collector for `let` bindings.
2. Track, per variable:
   - declaration kind and declarator node
   - whether initialization happens in the declaration or later
   - every write reference and whether it is the initializing write
   - reads before the first write
   - whether any read/write occurs in a disqualifying nested scope
   - whether the binding participates in destructuring, loop headers, or assignment patterns
3. Implement option handling:
   - `destructuring: "any" | "all"`
   - `ignoreReadBeforeAssign`
4. Add exclusions for cases the tests mark as valid:
   - exported globals from comments
   - loop variables that are reassigned by loop mechanics or by body writes
   - declarations whose assignment is intentionally in a different scope
   - static block and modern syntax edge cases already represented in the test module
5. Report on the identifier nodes that remain eligible after the full analysis pass.
6. Re-run `node run-tests.js test/lib/rules/prefer-const.test.js` and then the broader suite for nearby rules that share scope/reference utilities.

Implementation note:

This rule should likely move from the current per-`VariableDeclarator` visitor to a scope exit analysis, because the necessary correctness depends on seeing the full reference set before deciding whether a binding is const-eligible.
