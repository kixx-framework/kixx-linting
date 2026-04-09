# Kixx Linter — Implementation Plan

## Implementation Approach

Build a minimal, synchronous `lintText(sourceText, options)` function that parses JavaScript with vendored acorn, runs scope analysis with vendored eslint-scope, traverses the ESTree AST firing rule visitors, and returns an array of diagnostics. The espree→acorn dependency chain is collapsed: espree's only value-adds (JSX, esprima token translation) are not needed for our JS-only, no-JSX target. Scope analysis and code-path analysis are vendored from ESLint's reference libraries rather than reimplemented — both problems are large enough that rebuilding them would not produce a materially smaller result. Rules are organized into five families (text, layout, AST, scope, flow) that reflect what infrastructure each family actually needs, and are implemented after the core infrastructure is stable. ESLint's plugin system, config resolution, CLI, file I/O, caching, processors, retries, autofix, and inline config directives are all out of scope.

---

## TODO List

- [x] **Confirm rule inventory and custom rule status**
  - **Story**: Know exactly what needs to be built before building it
  - **What**: Audit every rule in `reference-lint.config.js` against `reference-libraries/eslint/lib/rules/`. Flag any rule not present in that directory as a custom rule requiring implementation from scratch. Of particular concern: `preserve-caught-error` and `no-unassigned-vars` do not appear to be standard ESLint rules. For each custom rule, determine its intended semantics from usage context. Produce a checked list distinguishing (a) rules that can be adapted from ESLint source and (b) rules that must be written from scratch with no reference implementation.
  - **Where**: `plans/rule-inventory.md` (reference only, not shipped)
  - **Acceptance criteria**: Every rule in the config is accounted for with a source; custom rules are identified before any rule implementation begins
  - **Depends on**: none

- [x] **Vendor acorn parser**
  - **Story**: Parse JavaScript source text into an ESTree AST without the espree intermediary
  - **What**: Copy acorn source files from `~/Projects/eslint/acorn/acorn/src/` into the project as ES modules. No modification to acorn source. Create a thin `lib/vendor/acorn/index.js` that re-exports `parse()` and `tokenizer()`. Acorn must be invoked with `{ ecmaVersion: 2024, sourceType, locations: true, ranges: true, onComment }` to produce locations, ranges, and comment data needed by rules.
  - **Where**: `lib/vendor/acorn/` (source copied verbatim from `~/Projects/eslint/acorn/acorn/src/`)
  - **Acceptance criteria**: `import { parse } from './lib/vendor/acorn/index.js'` works as an ES module; `parse('const x = 1', { ecmaVersion: 2024, sourceType: 'module', locations: true, ranges: true })` returns a valid ESTree AST with `loc` and `range` on every node; calling `parse()` on invalid syntax throws a `SyntaxError` with `lineNumber` and `column` properties
  - **Depends on**: none

- [x] **Vendor eslint-scope**
  - **Story**: Scope-dependent rules need variable declarations and references resolved
  - **What**: Copy eslint-scope source files from `reference-libraries/eslint-scope/lib/` into the project. Audit and fix any internal `require()`/`import` paths that reference npm-resolved modules. Include esrecurse and estraverse if eslint-scope depends on them, or inline them if small enough.
  - **Where**: `lib/vendor/eslint-scope/`
  - **Acceptance criteria**: `analyze(ast, { ecmaVersion: 2024, sourceType: 'module' })` returns a valid `ScopeManager` for an acorn-produced AST; `ScopeManager.acquire(functionNode)` returns the correct scope; the `globals` option correctly populates the global scope with `{ console: 'readonly', ... }` entries passed from linter config
  - **Depends on**: Vendor acorn parser

- [x] **Vendor code-path analysis**
  - **Story**: Flow-sensitive rules need reachability and execution-path state
  - **What**: Copy ESLint's code-path analysis module from `reference-libraries/eslint/lib/linter/code-path-analysis/` into the project. Audit and fix internal import paths. This module is needed by rules including `constructor-super`, `no-this-before-super`, `getter-return`, `no-setter-return`, `no-unreachable`, `no-promise-executor-return`, and `require-yield`. Confirm the module's public interface (it emits events like `onCodePathStart`, `onCodePathSegmentStart`, etc. that rules subscribe to via their visitor map).
  - **Where**: `lib/vendor/code-path-analysis/`
  - **Acceptance criteria**: The module can be imported and integrated into the traversal loop; a rule can subscribe to `onCodePathStart` and receive a `CodePath` object with a `currentSegment` property indicating reachability
  - **Depends on**: Vendor acorn parser

- [x] **Define ESTree visitor keys**
  - **Story**: The AST traverser needs to know which node properties contain child nodes
  - **What**: Create a single frozen object literal mapping every ES2024 ESTree node type to the ordered list of its child property names. Reference `eslint-visitor-keys` KEYS map for completeness but do not import that package. Include: all statement types, all expression types, all declaration types, `Program`, `SwitchCase`, `CatchClause`, `TemplateElement`, `Property`, `SpreadElement`, `ImportSpecifier`, `ExportSpecifier`, `ImportDeclaration`, `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportAllDeclaration`, and all pattern types.
  - **Where**: `lib/visitor-keys.js`
  - **Acceptance criteria**: Exports a frozen object; all ES2024 node types present in acorn's output are covered; no ESLint-specific or TypeScript node types are included
  - **Depends on**: none

- [x] **Build parser module**
  - **Story**: Parse provided source text and normalize errors into the linter's diagnostic format
  - **What**: Create a `parse(sourceText, options)` function that calls `acorn.parse()` with the correct options derived from linter config (`ecmaVersion`, `sourceType`). Collect comments via acorn's `onComment` callback. On `SyntaxError`, return `{ ok: false, errors: [{ message, line, column }] }`. On success, return `{ ok: true, ast, tokens, comments }`. Token list comes from acorn's `tokenizer()` or from `onToken` option. The caller should not know about acorn internals.
  - **Where**: `lib/parser.js`
  - **Acceptance criteria**: Returns `ok: true` with AST, tokens array, and comments array for valid source; returns `ok: false` with a diagnostic including correct line and column for invalid source; `sourceType: 'module'` and `sourceType: 'script'` both work; `ecmaVersion` defaults to `2024`
  - **Depends on**: Vendor acorn parser

- [x] **Build SourceCode**
  - **Story**: Rules need a unified interface to the AST, tokens, comments, source text, and scope
  - **What**: Create a `SourceCode` class constructed from `{ text, ast, tokens, comments, scopeManager, visitorKeys }`. Provide methods: `getText(node?)`, `getTokens(node)`, `getFirstToken(node)`, `getLastToken(node)`, `getTokenBefore(node, options?)`, `getTokenAfter(node, options?)`, `getTokensBetween(nodeA, nodeB)`, `getCommentsBefore(node)`, `getCommentsAfter(node)`, `getLines()`, `getScope(node)`, `getDeclaredVariables(node)`. Build a line-start offset index on construction for O(1) line/column lookups. Token queries should support `{ includeComments: boolean }` where needed by rules.
  - **Where**: `lib/source-code.js`
  - **Acceptance criteria**: `getText()` returns full source; `getText(node)` returns node's source slice; `getScope(node)` returns the innermost scope containing that node; `getTokenBefore(node)` returns the token immediately preceding the node start; `getLines()` returns an array of line strings
  - **Depends on**: Define ESTree visitor keys, Vendor eslint-scope, Build parser module

- [x] **Build AST traverser**
  - **Story**: The rule runner needs to walk the AST depth-first and fire visitor callbacks
  - **What**: Create a `traverse(ast, visitorKeys, visitors)` function. `visitors` is a `Map<string, Function[]>` of node type (and `"NodeType:exit"`) to arrays of callbacks. Walk the tree depth-first; on each node call all enter-phase listeners by node type before descending, then all exit-phase listeners after. Pass `(node, parent)` to each listener. Unknown node types whose keys are not in `visitorKeys` are visited shallowly if they have child-like properties, or skipped. Integrate code-path events by checking whether any active rule subscribes to `onCodePathStart` and similar events, and if so, drive the code-path analysis engine during traversal.
  - **Where**: `lib/traverser.js`
  - **Acceptance criteria**: All nodes visited in correct depth-first order; enter fires before children, exit fires after; multiple listeners for the same node type all fire; nodes with no entry in `visitorKeys` do not cause errors; a rule subscribing to `onCodePathStart` receives events at function boundaries
  - **Depends on**: Define ESTree visitor keys, Vendor code-path analysis

- [x] **Build RuleContext**
  - **Story**: Rules need a stable context object to query source and report problems
  - **What**: Create a `RuleContext` class or factory. Each rule instance gets its own context. Properties: `id` (rule name string), `options` (array of rule option values from config), `sourceCode` (SourceCode instance), `filename` (string). Methods: `report({ node, message, loc, data })`. The `report()` method resolves location from `node.loc.start` if `loc` is not provided; applies `data` substitution into `message` for `{{placeholder}}` patterns; pushes `{ ruleId, severity, message, line, column }` onto a shared messages array. Severity is closed over from the caller, not part of `report()`'s arguments.
  - **Where**: `lib/rule-context.js`
  - **Acceptance criteria**: `context.report({ node, message: 'Found {{thing}}', data: { thing: 'x' } })` pushes `{ ruleId: '...', severity: 2, message: 'Found x', line: N, column: N }`; `context.report({ loc: { line: 1, column: 5 }, message: 'err' })` uses the supplied location; messages array is shared across all rules in one `lintText()` call
  - **Depends on**: Build SourceCode

- [x] **Build rule registry**
  - **Story**: The rule runner needs to look up rule implementations by name
  - **What**: Create a registry as a plain `Map` from rule ID string to rule module. Each rule module is an object with `{ meta: { type, docs?, schema? }, create(context) }`. The registry starts empty; rules are added to it as they are implemented in subsequent tasks. Provide `registry.get(ruleId)` (returns rule or undefined) and `registry.has(ruleId)`. The registry does not validate rule options — that is not needed since we control both the registry and the caller config.
  - **Where**: `lib/rules/index.js`
  - **Acceptance criteria**: `registry.get('no-console')` returns the rule module after that rule is added; `registry.get('nonexistent')` returns `undefined`; adding a rule module to the registry requires only importing it and calling `registry.set()`
  - **Depends on**: none

- [x] **Build rule runner**
  - **Story**: The linter core needs to instantiate rules, collect their visitors, and traverse the AST
  - **What**: Create a `runRules(sourceCode, configuredRules, registry, filename)` function. `configuredRules` is an object like `{ 'no-debugger': 'error', 'indent': ['error', 4, { SwitchCase: 1 }] }`. For each rule ID: parse the severity and options array from the config entry, skip if severity is `'off'` or `0`, look up the rule in the registry (throw if not found), create a `RuleContext`, call `rule.create(context)` to get the visitor map, merge all visitor maps into a unified `Map<string, Function[]>`. After all rules are set up, call `traverse(sourceCode.ast, visitorKeys, mergedVisitors)`. Return the messages array sorted by line then column.
  - **Where**: `lib/rule-runner.js`
  - **Acceptance criteria**: Given `configuredRules: { 'no-debugger': 'error' }` and a source containing `debugger`, returns one message with `severity: 2`; severity `'warn'`/`1` produces `severity: 1`; severity `'off'`/`0` skips the rule; unknown rule IDs throw a descriptive error; messages are sorted by line/column
  - **Depends on**: Build AST traverser, Build RuleContext, Build rule registry

- [x] **Build lintText() entry point**
  - **Story**: Callers need a single synchronous function to lint JavaScript source text
  - **What**: Implement `lintText(sourceText, options)` where `options` is `{ fileName, rules, globals, sourceType }`. Steps: (1) call `parse(sourceText, { ecmaVersion: 2024, sourceType: options.sourceType ?? 'module' })`; (2) if `ok: false`, return early with `{ filePath: fileName, messages: errors, errorCount: errors.length, warningCount: 0 }` where each error has `severity: 2, ruleId: null`; (3) run `eslintScope.analyze(ast, { ecmaVersion: 2024, sourceType, globals: options.globals ?? {} })`; (4) construct `SourceCode`; (5) call `runRules(sourceCode, options.rules ?? {}, registry, fileName)`; (6) return `{ filePath: fileName, messages, errorCount, warningCount }`. `globals` values of `'readonly'` and `'writable'` must be translated to eslint-scope's expected format. Re-export from `index.js`.
  - **Where**: `lib/linter.js`, `index.js`
  - **Acceptance criteria**: `lintText('debugger', { rules: { 'no-debugger': 'error' } })` returns `{ messages: [{ ruleId: 'no-debugger', severity: 2, line: 1, column: 0 }], errorCount: 1, warningCount: 0 }`; syntax errors return a fatal message with correct location and `ruleId: null`; `lintText('', {})` returns zero messages; `globals: { console: 'readonly' }` prevents `no-undef` from flagging `console`
  - **Depends on**: Build parser module, Build SourceCode, Build rule runner, Vendor eslint-scope

- [x] **Implement text rules**
  - **Story**: Catch issues detectable from raw source lines and comment text
  - **What**: Implement 5 rules that operate primarily on `sourceCode.getLines()` and comment nodes rather than deep structural analysis: `eol-last`, `no-trailing-spaces`, `no-warning-comments` (with `{ location: 'anywhere' }` option — searches comment text), `no-template-curly-in-string` (string literal value contains `${`), `no-irregular-whitespace` (non-standard whitespace characters in source).
  - **Where**: `lib/rules/eol-last.js`, `lib/rules/no-trailing-spaces.js`, `lib/rules/no-warning-comments.js`, `lib/rules/no-template-curly-in-string.js`, `lib/rules/no-irregular-whitespace.js`; register each in `lib/rules/index.js`
  - **Acceptance criteria**: Each rule fires correctly for its configured options in `reference-lint.config.js`; none attempt to fix source; `no-warning-comments` warns (not errors) per the reference config
  - **Depends on**: Build lintText() entry point

- [x] **Implement layout/token-spacing rules**
  - **Story**: Catch formatting issues via token adjacency and line structure
  - **What**: Implement 10 rules that rely on token positions from `sourceCode.getTokens()`, `getTokenBefore()`, `getTokenAfter()`, and `getTokensBetween()`: `comma-dangle` (with per-context options), `func-call-spacing`, `indent` (with `4` and `{ SwitchCase: 1 }` options), `max-statements-per-line` (with `{ max: 1 }`), `new-parens`, `rest-spread-spacing` (`'never'`), `semi` (`'always'`), `space-infix-ops`, `space-unary-ops` (with `{ words: true, nonwords: false }`), `no-floating-decimal`.
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: Each rule detects its target violation and reports correct line/column; none produce fix output; `indent` correctly handles `SwitchCase: 1` indentation; `comma-dangle` applies correct setting per context (arrays, objects, functions, imports, exports)
  - **Depends on**: Build lintText() entry point

- [x] **Implement regex analysis helpers**
  - **Story**: Regex-focused rules need to inspect regular expression literal structure beyond what the AST exposes
  - **What**: Create shared helper functions for analyzing regex literals and `RegExp` constructor calls used by multiple rules. Helpers needed: `parseRegexLiteral(node)` returning `{ pattern, flags }` from a `Literal` node with `regex` property; `hasControlCharacter(pattern)` for `no-control-regex`; `hasEmptyCharacterClass(pattern)` for `no-empty-character-class`; `hasRedundantSpaces(pattern)` for `no-regex-spaces`; `hasUselessBackreference(pattern)` for `no-useless-backreference`; `getMisleadingCharacterClassNodes(pattern)` for `no-misleading-character-class`. Do not vendor a third-party regex parser unless the logic genuinely requires it — evaluate whether native JS regex introspection suffices for each helper.
  - **Where**: `lib/rules/regex-helpers.js`
  - **Acceptance criteria**: Each helper function is independently testable; `hasEmptyCharacterClass('/[]/')` returns true; `hasControlCharacter('/\\x00/')` returns true; helpers handle edge cases like escaped characters and unicode flags
  - **Depends on**: Build lintText() entry point

- [x] **Implement AST-structure rules (batch 1: literals, operators, and simple expressions)**
  - **Story**: Catch local structural mistakes detectable from a single AST node or its immediate children
  - **What**: Implement 16 rules: `eqeqeq`, `no-compare-neg-zero`, `no-eq-null`, `no-floating-decimal` (if not already in layout batch), `no-loss-of-precision`, `no-sequences`, `no-return-assign`, `no-throw-literal`, `no-caller`, `no-multi-assign`, `no-nested-ternary`, `no-plusplus`, `no-mixed-operators` (warn), `use-isnan`, `valid-typeof`, `prefer-numeric-literals`.
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: Each rule detects its target pattern and reports with correct location; `no-mixed-operators` uses severity `warn`; `valid-typeof` catches comparisons like `typeof x === 'nunber'`
  - **Depends on**: Build lintText() entry point

- [x] **Implement AST-structure rules (batch 2: control flow, classes, and declarations)**
  - **Story**: Catch structural problems in statements, classes, and declarations
  - **What**: Implement 17 rules: `default-case-last`, `no-case-declarations`, `no-duplicate-case`, `no-dupe-else-if`, `no-cond-assign`, `no-debugger`, `no-empty`, `no-lonely-if`, `no-unsafe-finally`, `no-unsafe-negation`, `constructor-super` (AST component only, deferring flow analysis to flow batch), `no-dupe-class-members`, `no-dupe-keys`, `no-useless-computed-key`, `no-unused-private-class-members`, `no-duplicate-imports`, `no-unused-labels`.
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: Each rule detects its target pattern; `no-dupe-keys` detects duplicate property names in object literals; `no-duplicate-imports` flags multiple `import` statements from the same module
  - **Depends on**: Build lintText() entry point

- [x] **Implement AST-structure rules (batch 3: async, promises, and miscellaneous)**
  - **Story**: Catch mistakes in async code and miscellaneous code quality patterns
  - **What**: Implement 15 rules: `no-async-promise-executor`, `no-promise-executor-return` (AST component — whether any return statement exists in a promise executor), `func-style` (with `'declaration'` and `{ allowArrowFunctions: true }`), `grouped-accessor-pairs` (with `'getBeforeSet'`), `getter-return` (AST component), `no-setter-return` (AST component), `no-unexpected-multiline`, `no-unused-expressions`, `no-useless-catch`, `strict`, `require-yield` (check generator functions for yield presence), `no-this-before-super` (AST component), `no-empty-character-class`, `no-invalid-regexp`, `no-control-regex`.
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: Each rule detects its target pattern; `func-style` allows arrow functions as expression assignments; `require-yield` fires only for generator functions with no `yield`
  - **Depends on**: Build lintText() entry point, Implement regex analysis helpers

- [x] **Implement regex rules**
  - **Story**: Catch defects in regular expression literals
  - **What**: Implement 4 rules using the regex helpers: `no-regex-spaces`, `no-misleading-character-class`, `no-useless-backreference`, `no-irregular-whitespace` (if not already in text batch — covers regex literals as well as other contexts).
  - **Where**: `lib/rules/no-regex-spaces.js`, `lib/rules/no-misleading-character-class.js`, `lib/rules/no-useless-backreference.js`; register each in `lib/rules/index.js`
  - **Acceptance criteria**: `no-regex-spaces` flags `/  /` (two spaces); `no-misleading-character-class` flags `/[👶🏽]/`; `no-useless-backreference` flags `/(?<a>x)\2/`
  - **Depends on**: Implement regex analysis helpers

- [x] **Implement scope-based rules (batch 1: illegal assignments)**
  - **Story**: Catch assignments to variables that must not be reassigned
  - **What**: Implement 7 rules using `sourceCode.getScope(node)` and eslint-scope reference/definition data: `no-const-assign`, `no-class-assign`, `no-func-assign`, `no-global-assign`, `no-ex-assign`, `no-shadow-restricted-names`, `no-extend-native`. For each, iterate over scope references and check whether write references target a binding that is declared as const/class/function/import/global/catch variable or a restricted name.
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: Each rule correctly identifies illegal assignments; `no-shadow-restricted-names` fires on `let undefined = 1`; `no-extend-native` fires on `Array.prototype.x = 1`; `no-const-assign` does not fire for `const` declarations that are only read
  - **Depends on**: Build lintText() entry point, Vendor eslint-scope

- [x] **Implement scope-based rules (batch 2: undefined variables and declaration ordering)**
  - **Story**: Catch references to undeclared variables and invalid declaration ordering
  - **What**: Implement 3 rules: `no-undef` (flag references with no binding in any scope, respecting `globals` config), `no-use-before-define` (with `{ functions: false, classes: false }` — flag variable references that appear before their declaration in source order), `no-unassigned-vars` (custom rule — flag variables declared but never assigned; confirm exact semantics from the rule inventory task).
  - **Where**: `lib/rules/no-undef.js`, `lib/rules/no-use-before-define.js`, `lib/rules/no-unassigned-vars.js`; register each in `lib/rules/index.js`
  - **Acceptance criteria**: `no-undef` does not fire for globals listed in `reference-lint.config.js` (console, setTimeout, etc.); `no-use-before-define` does not fire for function declarations when `functions: false`
  - **Depends on**: Build lintText() entry point, Vendor eslint-scope

- [x] **Implement scope-based rules (batch 3: variable declarations and preference)**
  - **Story**: Enforce preferred declaration and binding patterns
  - **What**: Implement 5 rules: `no-var` (flag `var` declarations), `prefer-const` (flag `let` bindings that are never reassigned after declaration), `prefer-rest-params` (flag `arguments` references in functions that could use rest params), `prefer-arrow-callback` (with `{ allowNamedFunctions: true, allowUnboundThis: false }` — flag non-arrow function expressions passed as callbacks), `no-loop-func` (flag function expressions or declarations inside loops that reference loop variables).
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: `prefer-const` does not fire for `let` that is reassigned; `prefer-arrow-callback` does not fire for named functions when `allowNamedFunctions: true`; `no-loop-func` fires when a closure captures a loop variable from a `for` using `var`
  - **Depends on**: Build lintText() entry point, Vendor eslint-scope

- [x] **Implement scope-based rules (batch 4: code quality and misuse patterns)**
  - **Story**: Catch misuse of globals, implicit conversions, and other scope-dependent quality issues
  - **What**: Implement 12 rules: `no-console`, `no-invalid-this`, `no-new-native-nonconstructor`, `no-new-wrappers`, `no-obj-calls`, `no-prototype-builtins`, `no-implicit-coercion`, `radix`, `prefer-promise-reject-errors`, `no-useless-assignment`, `preserve-caught-error` (custom — confirm semantics from rule inventory; likely: flag `catch (e) { ... }` blocks where the caught error variable is shadowed or discarded without being used).
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: `no-console` fires on `console.log()` and related; `no-invalid-this` fires on `this` outside of class methods and non-arrow functions; `radix` fires on `parseInt('10')` missing the radix argument
  - **Depends on**: Build lintText() entry point, Vendor eslint-scope

- [x] **Implement flow-sensitive rules**
  - **Story**: Rules that depend on reachability and execution-path state across control flow
  - **What**: Implement 8 rules using the vendored code-path analysis engine integrated into the traverser. The code-path engine emits events (`onCodePathStart`, `onCodePathEnd`, `onCodePathSegmentStart`, `onCodePathSegmentEnd`, `onUnreachableCodePathSegmentStart`) that rules subscribe to via their visitor map alongside regular node visitors: `no-unreachable`, `getter-return`, `no-setter-return`, `no-this-before-super`, `constructor-super`, `no-promise-executor-return`, `require-yield`, `require-atomic-updates`. Rules that were partially implemented in earlier AST batches (e.g., `getter-return`, `constructor-super`) should be completed or replaced here using flow data.
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: `no-unreachable` fires on statements after `return` but not in dead branches of `if`; `getter-return` fires when a getter has a path with no `return`; `constructor-super` fires when `super()` is missing in a derived class constructor; code-path events are received correctly during traversal
  - **Depends on**: Build lintText() entry point, Vendor code-path analysis

- [x] **Implement remaining scope-based rules**
  - **Story**: Detect complex patterns in async and loop contexts
  - **What**: Implement 4 remaining rules that were deferred because they interact with both scope and flow: `no-unmodified-loop-condition` (flag loop conditions that reference variables never modified within the loop), `no-useless-backreference` (if not in regex batch), `for-direction` (flag `for` loops where the update moves away from the termination condition), `require-atomic-updates` (flag async assignments where a non-atomic read-modify-write pattern could be interrupted).
  - **Where**: `lib/rules/{rule-name}.js` for each; register each in `lib/rules/index.js`
  - **Acceptance criteria**: `for-direction` fires on `for (let i = 0; i < 10; i--)` but not `for (let i = 0; i < 10; i++)`; `no-unmodified-loop-condition` fires when the loop condition variable is never written inside the loop body
  - **Depends on**: Build lintText() entry point, Vendor eslint-scope, Vendor code-path analysis

- [x] **Integration tests**
  - **Story**: Verify the linter works end-to-end with the complete rule set
  - **What**: Create integration tests using Node's built-in `node:test` runner. Three fixture scenarios: (1) a clean JavaScript file that produces zero messages with the full `reference-lint.config.js` rule set — confirms no false positives; (2) a file with exactly one violation per rule, confirming each of the 90 rules fires and produces the expected `ruleId`, severity, line, and column; (3) a file with a syntax error, confirming a fatal message is returned with `ruleId: null` and correct location. Additionally, a parity test for a representative subset of rules that runs both the Kixx linter and ESLint with the same config against the same fixture and compares message counts and locations — this validates that the Kixx rule implementations match reference behavior.
  - **Where**: `test/integration.test.js`, `test/fixtures/clean.js`, `test/fixtures/violations.js`, `test/fixtures/syntax-error.js`
  - **Acceptance criteria**: All 90 rules produce exactly one violation in `violations.js`; `clean.js` produces zero messages; the syntax error test returns `errorCount: 1` with `ruleId: null`; parity tests pass for the representative subset
  - **Depends on**: All rule implementation tasks
