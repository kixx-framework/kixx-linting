# ESLint Scope Flattening Implementation Plan

## Implementation Approach

Build a new `lib/eslint-scope/` module beside the vendored implementation, then switch consumers only after parity tests prove the scope API still behaves the same for existing rules. Flatten only the `esrecurse` and `estraverse` pieces that `eslint-scope` actually uses: syntax constants, visitor keys, and the recursive visitor base class, rather than porting unused traversal controller and replacement APIs. Convert the scope analyzer to native ES modules and modern JavaScript while preserving the external API used by `lib/linter.js`, `SourceCode`, and scope-dependent rules. Keep license attribution in the new module because the port continues to derive from BSD-licensed eslint-scope/escope, esrecurse, and estraverse code. Validate with focused scope tests, existing rule tests that depend on scope analysis, project linting, and the full test suite.

## TODO List

- [x] **Inventory public scope behavior**
  - **Story**: US1. As a maintainer, I need a clear compatibility target before replacing the vendored scope analyzer.
  - **What**: Document the public API and behavioral surface currently used by the project: `analyze()`, `ScopeManager`, `Scope`, `Reference`, `Variable`, `Definition`, `PatternVisitor`, `addGlobals()`, `acquire()`, `acquireAll()`, `release()`, `getDeclaredVariables()`, `globalScope`, `scopes`, `through`, `references`, and scope type names. Include the exact current dependency usage from `esrecurse` and `estraverse` so unused APIs are explicitly out of scope.
  - **Where**: `plans/eslint-scope-flattening-implementation-plan.md`
  - **Acceptance criteria**: US1-AC1 public exports are listed; US1-AC2 linter/rule usage is listed; US1-AC3 flattened dependency surface is limited to syntax constants, visitor keys, recursive visitor, `childVisitorKeys`, and `fallback`; US1-AC4 unused estraverse traversal/replacement controller APIs are documented as non-goals.
  - **Depends on**: none
  - **Implementation notes**:
    - **Current public exports (from `lib/vendor/eslint-scope/index.js`)**:
      - `analyze(ast, options)`
      - `version`
      - `ScopeManager`
      - `Scope`
      - `Reference`
      - `Variable`
      - `Definition`
      - `PatternVisitor`
      - `Referencer`
    - **Current analyzer wrapper behavior**:
      - Wrapper-level `analyze()` strips `options.globals`, calls core analyzer, then invokes `scopeManager.addGlobals(Object.keys(globals))` when `globals` is provided.
      - Core analyzer default options are:
        - `optimistic: false`
        - `nodejsScope: false`
        - `impliedStrict: false`
        - `sourceType: "script"`
        - `ecmaVersion: 5`
        - `childVisitorKeys: null`
        - `fallback: "iteration"`
    - **Current project usage (compatibility surface to preserve)**:
      - `lib/linter.js` imports `analyze()` and passes `ecmaVersion`, `sourceType`, and `globals`.
      - `lib/linter.js` calls `scopeManager.addGlobals()` for `/*global*/` comments.
      - `lib/linter.js` reads `scopeManager.globalScope` and then `globalScope.set.get(name)`.
      - `lib/source-code.js` depends on:
        - `scopeManager.acquire(node, inner?)`
        - `scopeManager.scopes`
        - `scopeManager.globalScope`
        - `scopeManager.getDeclaredVariables(node)`
        - `scope.references` and `reference.resolved`
      - Rules rely on scope model fields/methods exposed through `SourceCode` and direct scope-manager access:
        - `scope.through` (for unresolved/global reference behavior)
        - `scope.set`
        - `sourceCode.scopeManager.scopes`
        - `sourceCode.scopeManager.acquire(node, true)`
        - `sourceCode.getScope()`, `getDeclaredVariables()`, `getResolvedVariable()`
    - **Scope type strings that must remain stable**:
      - `"global"`
      - `"module"`
      - `"function"`
      - `"function-expression-name"`
      - `"block"`
      - `"switch"`
      - `"catch"`
      - `"with"`
      - `"for"`
      - `"class"`
      - `"class-field-initializer"`
      - `"class-static-block"`
    - **Flattened `estraverse` surface actually used by vendored `eslint-scope`**:
      - `Syntax` node-type constants
      - `VisitorKeys` map (as the base key map merged with caller `childVisitorKeys`)
      - No use of `traverse`, `replace`, `attachComments`, `Controller`, or `VisitorOption` inside vendored `eslint-scope`
    - **Flattened `esrecurse` surface actually used by vendored `eslint-scope`**:
      - `Visitor` class only, with:
        - dispatch by node type via `visit()`
        - default child traversal via `visitChildren()`
        - merge behavior for `childVisitorKeys`
        - `fallback: "iteration"` and function fallback handling
        - null/array handling
        - special object `properties` traversal handling
      - No use of `esrecurse.visit()` helper by vendored `eslint-scope`
    - **Explicit non-goals for flattening (out of scope)**:
      - Porting estraverse controller-based traversal APIs (`Controller`, `traverse`)
      - Porting estraverse AST replacement APIs (`replace`)
      - Porting estraverse comment attachment helpers (`attachComments`)
      - Porting any other estraverse/esrecurse APIs not required by the analyzer modules above

- [x] **Add baseline scope parity tests**
  - **Story**: US2. As a maintainer, I need tests that lock down the scope analyzer behavior before the implementation changes.
  - **What**: Add a focused test suite that imports the current vendored analyzer and asserts scope shapes for representative programs: globals, modules/imports/exports, function declarations/expressions, arrow functions, default parameters, destructuring, catch scopes, block scopes, for/for-in/for-of scopes, class declarations, class fields, static blocks, direct `eval`, `with`, implicit globals, and configured globals.
  - **Where**: `test/lib/eslint-scope-baseline.test.js`
  - **Acceptance criteria**: US2-AC1 tests inspect `ScopeManager.scopes` order and scope types; US2-AC2 tests inspect variables, definitions, references, and `through`; US2-AC3 tests cover modern syntax currently parsed by Acorn; US2-AC4 tests pass against the vendored analyzer before the new module is wired in.
  - **Depends on**: Inventory public scope behavior

- [x] **Add linter integration regression tests**
  - **Story**: US3. As a linter user, I need existing scope-dependent rules to behave the same after the analyzer is replaced.
  - **What**: Add integration tests through `lintText()` for scope-sensitive rules and APIs: `no-undef`, `no-unused-vars`, `no-use-before-define`, `prefer-const`, `no-invalid-this`, `no-loop-func`, `prefer-arrow-callback`, `prefer-rest-params`, `preserve-caught-error`, `no-console`, and configured globals. Cover both module and script source types where behavior differs.
  - **Where**: `test/lib/eslint-scope-integration.test.js`
  - **Acceptance criteria**: US3-AC1 expected diagnostics match current vendored behavior; US3-AC2 configured globals and `/*global*/` comments still resolve references; US3-AC3 `SourceCode.getScope()`, `getDeclaredVariables()`, and `getResolvedVariable()` are exercised indirectly; US3-AC4 tests pass before the import is switched.
  - **Depends on**: Inventory public scope behavior

- [x] **Create new module skeleton and attribution**
  - **Story**: US4. As a maintainer, I need the replacement module to live in the requested location with correct licensing.
  - **What**: Create the `lib/eslint-scope/` folder, add a module-level `LICENSE` or attribution file, and add placeholder entry points that will be filled by later tasks. Preserve BSD license notices for code derived from eslint-scope/escope, esrecurse, and estraverse, and keep project MIT code separate where applicable.
  - **Where**: `lib/eslint-scope/`, `lib/eslint-scope/LICENSE`, `lib/eslint-scope/index.js`
  - **Acceptance criteria**: US4-AC1 new files are under `lib/eslint-scope/`; US4-AC2 attribution covers all three flattened upstream packages; US4-AC3 no runtime consumer imports the new skeleton until the implementation is complete; US4-AC4 files use native ES module syntax.
  - **Depends on**: Inventory public scope behavior

- [x] **Port syntax constants and visitor keys**
  - **Story**: US5. As the new scope analyzer, I need local traversal metadata without importing vendored `estraverse`.
  - **What**: Create local syntax constants and visitor keys needed by scope analysis. Align the key list with `lib/visitor-keys.js` and the current parser output, including modern nodes such as `ChainExpression`, `ImportExpression`, `PrivateIdentifier`, `PropertyDefinition`, and `StaticBlock`, while retaining compatibility keys used by the port.
  - **Where**: `lib/eslint-scope/syntax.js`, `lib/eslint-scope/visitor-keys.js`
  - **Acceptance criteria**: US5-AC1 no imports from `lib/vendor/estraverse`; US5-AC2 supported node names cover all nodes in existing project visitor keys; US5-AC3 exported constants are immutable or treated as read-only; US5-AC4 keys can be merged with caller-provided `childVisitorKeys`.
  - **Depends on**: Create new module skeleton and attribution

- [x] **Port recursive visitor**
  - **Story**: US6. As the flattened analyzer, I need the `esrecurse.Visitor` behavior locally in modern JavaScript.
  - **What**: Rewrite the subset of `esrecurse` used by `eslint-scope` as a local ES module class. Preserve dispatch by node type, `visit()`, `visitChildren()`, `childVisitorKeys` merging, `fallback: "iteration"`, function fallback support, null handling, array child traversal, and special traversal of object pattern/expression `properties`.
  - **Where**: `lib/eslint-scope/visitor.js`
  - **Acceptance criteria**: US6-AC1 `Referencer` and `PatternVisitor` can extend the local visitor class; US6-AC2 traversal order matches current `esrecurse` behavior for baseline tests; US6-AC3 unknown node behavior matches current options; US6-AC4 implementation uses classes, `const`/`let`, `Object.hasOwn()`, and no CommonJS.
  - **Depends on**: Port syntax constants and visitor keys

- [x] **Port assertion utility**
  - **Story**: US7. As a maintainer, I need small local utilities to follow project style and avoid carrying unnecessary wrappers.
  - **What**: Add a local assertion helper or replace usages with a clear standard-library equivalent. Keep error messages compatible with current failures and avoid importing `process` or any CommonJS module.
  - **Where**: `lib/eslint-scope/assert.js`
  - **Acceptance criteria**: US7-AC1 assertions throw `Error` with the current message text; US7-AC2 import sites are ES modules; US7-AC3 helper passes project lint rules.
  - **Depends on**: Create new module skeleton and attribution

- [x] **Port variable and definition models**
  - **Story**: US8. As rules consuming scope data, I need variables and definitions to retain their existing shape.
  - **What**: Port `Variable`, `Definition`, and `ParameterDefinition` to modern ES modules. Preserve static type-name constants, constructor arguments, public properties, and definition metadata used by `no-unused-vars`, `prefer-const`, `preserve-caught-error`, and related rules.
  - **Where**: `lib/eslint-scope/variable.js`, `lib/eslint-scope/definition.js`
  - **Acceptance criteria**: US8-AC1 public class names and static constants match current behavior; US8-AC2 `defs`, `identifiers`, `references`, `tainted`, `stack`, and `scope` properties are preserved; US8-AC3 modules pass lint rules including `func-style`, `no-var`, `prefer-const`, and `no-plusplus`.
  - **Depends on**: Port assertion utility

- [x] **Port reference model**
  - **Story**: US8. As rules consuming scope data, I need identifier references to retain their existing shape and read/write semantics.
  - **What**: Port `Reference` to a modern ES module. Preserve `READ`, `WRITE`, `RW` flags, constructor semantics, public properties, `__maybeImplicitGlobal`, and methods `isStatic()`, `isWrite()`, `isRead()`, `isReadOnly()`, `isWriteOnly()`, and `isReadWrite()`.
  - **Where**: `lib/eslint-scope/reference.js`
  - **Acceptance criteria**: US8-AC4 reference flags match existing numeric values; US8-AC5 write references keep `writeExpr`, `partial`, and `init`; US8-AC6 method return values match baseline tests; US8-AC7 module passes project lint rules.
  - **Depends on**: Port variable and definition models

- [x] **Port scope classes**
  - **Story**: US9. As scope-dependent rules, I need scope objects and resolution behavior to remain compatible.
  - **What**: Port `Scope` and subclasses: `GlobalScope`, `ModuleScope`, `FunctionExpressionNameScope`, `CatchScope`, `WithScope`, `BlockScope`, `SwitchScope`, `FunctionScope`, `ForScope`, `ClassScope`, `ClassFieldInitializerScope`, and `ClassStaticBlockScope`. Preserve reference resolution, implicit globals, strict-mode detection, dynamic scope handling, declared-variable tracking, `arguments` handling, class/static-block scope behavior, and public properties.
  - **Where**: `lib/eslint-scope/scope.js`
  - **Acceptance criteria**: US9-AC1 all current scope type strings are preserved; US9-AC2 `__close()`, `__define()`, `__referencing()`, `resolve()`, `isStatic()`, `isArgumentsMaterialized()`, `isThisMaterialized()`, and `isUsedName()` match baseline behavior; US9-AC3 implicit global and configured global resolution works; US9-AC4 code uses project style and no vendored dependency imports.
  - **Depends on**: Port reference model

- [x] **Port scope manager**
  - **Story**: US10. As the linter pipeline, I need the manager API that connects AST nodes to scopes.
  - **What**: Port `ScopeManager` to a modern ES module. Preserve scope nesting methods, `__nodeToScope`, `__declaredVariables`, `globalScope`, `scopes`, `acquire()`, `acquireAll()`, `release()`, `addGlobals()`, `attach()`, `detach()`, source type handling, strict-mode options, JSX option handling, and ECMAScript version checks.
  - **Where**: `lib/eslint-scope/scope-manager.js`
  - **Acceptance criteria**: US10-AC1 node-to-scope acquisition matches baseline; US10-AC2 declared variables are returned for declaration nodes and parent declarations; US10-AC3 module, script, commonjs, and nodejs scope options behave as before; US10-AC4 no CommonJS or vendor imports remain.
  - **Depends on**: Port scope classes

- [x] **Port pattern visitor**
  - **Story**: US11. As the referencer, I need destructuring and assignment patterns to produce the same definitions and references.
  - **What**: Port `PatternVisitor` to extend the local recursive visitor. Preserve pattern detection, callback metadata, `rightHandNodes`, `assignments`, `restElements`, computed property handling, assignment pattern handling, member expression handling, spread/rest handling, and call expression handling.
  - **Where**: `lib/eslint-scope/pattern-visitor.js`
  - **Acceptance criteria**: US11-AC1 destructuring declarations produce the same identifiers and default-value references; US11-AC2 rest parameters/elements are marked correctly; US11-AC3 computed property keys are visited as right-hand nodes; US11-AC4 no imports from `esrecurse` or `estraverse`.
  - **Depends on**: Port recursive visitor, Port scope manager

- [x] **Port referencer**
  - **Story**: US12. As the scope analyzer, I need AST traversal to define variables and references for all supported JavaScript syntax.
  - **What**: Port `Referencer` and the import-specifier visitor to extend the local recursive visitor. Preserve behavior for programs, imports, exports, functions, classes, properties, class fields, static blocks, blocks, switches, loops, catch clauses, assignments, updates, member expressions, calls, direct `eval`, `this`, `with`, JSX option paths, and pattern traversal.
  - **Where**: `lib/eslint-scope/referencer.js`
  - **Acceptance criteria**: US12-AC1 definitions and references match baseline tests; US12-AC2 scope open/close ordering matches baseline; US12-AC3 modern syntax nodes supported by the parser are covered; US12-AC4 code uses project style, no `++`/`--`, no `var`, no CommonJS, and no vendored dependency imports.
  - **Depends on**: Port pattern visitor

- [x] **Create analyzer entry point**
  - **Story**: US13. As code importing the analyzer, I need a stable ES module public API.
  - **What**: Implement the new `index.js` entry point with `analyze()`, `version`, and all class exports. Port `defaultOptions()` and deep option merging in project style, support `globals` in the wrapper API, and avoid mutating caller-provided options.
  - **Where**: `lib/eslint-scope/index.js`
  - **Acceptance criteria**: US13-AC1 `import { analyze } from "./eslint-scope/index.js"` works; US13-AC2 exported names match the current vendored wrapper; US13-AC3 `analyze(ast, { globals })` adds globals after analysis; US13-AC4 default options match current behavior.
  - **Depends on**: Port referencer

- [x] **Switch linter to new analyzer**
  - **Story**: US3. As a linter user, I need the project to use the flattened analyzer transparently.
  - **What**: Update the linter import to use the new module path. Keep the rest of the linting flow unchanged unless tests reveal a compatibility bug in the new analyzer.
  - **Where**: `lib/linter.js`
  - **Acceptance criteria**: US3-AC5 `lib/linter.js` imports `./eslint-scope/index.js`; US3-AC6 no production code imports `lib/vendor/eslint-scope`; US3-AC7 existing linter behavior is unchanged according to integration tests.
  - **Depends on**: Create analyzer entry point, Add baseline scope parity tests, Add linter integration regression tests

- [x] **Update baseline tests to target new module**
  - **Story**: US2. As a maintainer, I need the compatibility tests to protect the replacement implementation going forward.
  - **What**: Change the baseline scope tests from the vendored analyzer import to the new `lib/eslint-scope/index.js` import after the implementation passes against the old behavior. Keep test names and assertions focused on behavior rather than implementation details.
  - **Where**: `test/lib/eslint-scope-baseline.test.js`
  - **Acceptance criteria**: US2-AC5 tests now exercise the new analyzer; US2-AC6 assertions remain behavior-focused; US2-AC7 the suite passes without importing vendored eslint-scope.
  - **Depends on**: Switch linter to new analyzer

- [x] **Run targeted scope-dependent rule tests**
  - **Story**: US14. As a maintainer, I need fast feedback on the riskiest behavior before running the full suite.
  - **What**: Run the new scope tests and existing focused rule suites for `no-undef`, `no-unused-vars`, `no-use-before-define`, `prefer-const`, `no-invalid-this`, `no-loop-func`, `prefer-arrow-callback`, `prefer-rest-params`, and `preserve-caught-error`. Fix analyzer compatibility issues rather than weakening rule expectations.
  - **Where**: `test/lib/eslint-scope-baseline.test.js`, `test/lib/eslint-scope-integration.test.js`, `test/lib/rules/no-undef.test.js`, `test/lib/rules/no-unused-vars.test.js`, `test/lib/rules/no-use-before-define.test.js`, `test/lib/rules/prefer-const.test.js`, `test/lib/rules/no-invalid-this.test.js`, `test/lib/rules/no-loop-func.test.js`, `test/lib/rules/prefer-arrow-callback.test.js`, `test/lib/rules/prefer-rest-params.test.js`, `test/lib/rules/preserve-caught-error.test.js`
  - **Acceptance criteria**: US14-AC1 all targeted tests pass with the new analyzer; US14-AC2 failures are resolved in `lib/eslint-scope/` unless a test exposes an existing incorrect expectation; US14-AC3 no scope-dependent rule behavior regresses.
  - **Depends on**: Update baseline tests to target new module

- [x] **Run project lint and fix style**
  - **Story**: US15. As a maintainer, I need the new code to satisfy this project’s current JavaScript style and lint rules.
  - **What**: Run `node lint.js lib/eslint-scope` and `node lint.js lib/linter.js`, then fix all reported issues. Pay special attention to `no-plusplus`, `func-style`, `prefer-arrow-callback`, `indent`, `max-statements-per-line`, `no-unused-vars`, `no-undef`, `eqeqeq`, `no-prototype-builtins`, `prefer-const`, and import style.
  - **Where**: `lib/eslint-scope/**/*.js`, `lib/linter.js`
  - **Acceptance criteria**: US15-AC1 targeted lint run reports zero errors; US15-AC2 all new code uses ES modules, `const`/`let`, no `var`, no CommonJS, and project indentation; US15-AC3 necessary rule-disable comments are narrow and justified.
  - **Depends on**: Run targeted scope-dependent rule tests

- [x] **Run full test suite**
  - **Story**: US16. As a maintainer, I need confidence the analyzer replacement does not regress unrelated linter behavior.
  - **What**: Run `node run-tests.js` and fix any regressions. If a failure reveals a missing visitor key or scope edge case, add a focused regression assertion to the new scope tests before fixing it.
  - **Where**: `test/`, `lib/eslint-scope/`
  - **Acceptance criteria**: US16-AC1 full test suite passes; US16-AC2 any discovered scope regression has a test; US16-AC3 no unrelated behavior is changed to make tests pass.
  - **Depends on**: Run project lint and fix style

- [x] **Run full project validation**
  - **Story**: US16. As a maintainer, I need final proof that linting and tests pass together the same way release validation expects.
  - **What**: Run `npm test`, which executes the linter and tests. Fix any remaining project-wide lint or runtime failures.
  - **Where**: `lib/eslint-scope/`, `lib/linter.js`, `test/`
  - **Acceptance criteria**: US16-AC4 `npm test` exits successfully; US16-AC5 the new `lib/eslint-scope/` folder is linted by the project config; US16-AC6 no vendored eslint-scope/esrecurse/estraverse imports are needed for runtime.
  - **Depends on**: Run full test suite

- [x] **Remove obsolete vendored dependency usage**
  - **Story**: US17. As a maintainer, I want the codebase to stop relying on the old vendored dependency path after the port is complete.
  - **What**: Search for remaining imports or references to `lib/vendor/eslint-scope`, `lib/vendor/esrecurse`, and `lib/vendor/estraverse`. If no remaining code needs them, delete those vendored directories; if another consumer still needs one, document why it remains and keep it ignored by lint.
  - **Where**: `lib/vendor/eslint-scope/`, `lib/vendor/esrecurse/`, `lib/vendor/estraverse/`, repository import sites
  - **Acceptance criteria**: US17-AC1 no production code imports old vendored scope/traversal packages; US17-AC2 obsolete vendored directories are removed or explicitly justified; US17-AC3 full validation still passes after cleanup.
  - **Depends on**: Run full project validation

- [x] **Update docs and export notes**
  - **Story**: US18. As a future maintainer, I need documentation showing where scope analysis now lives and why traversal code is local.
  - **What**: Update project documentation or internal notes to mention that the linter uses the native `lib/eslint-scope/` module and that its local visitor/syntax files are flattened replacements for the previous esrecurse/estraverse dependency usage. If public exports remain unchanged, state that no user-facing API change is intended.
  - **Where**: `README.md`, `plans/eslint-scope-flattening-implementation-plan.md`, or a short `lib/eslint-scope/README.md`
  - **Acceptance criteria**: US18-AC1 maintainers can find the new scope analyzer location; US18-AC2 flattened traversal rationale is documented; US18-AC3 docs do not imply support for unused estraverse APIs; US18-AC4 public linter usage remains documented as unchanged.
  - **Depends on**: Remove obsolete vendored dependency usage
