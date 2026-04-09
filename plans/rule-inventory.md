# Rule Inventory

Audit date: 2026-04-05

## Summary

- Configured rules in `reference-lint.config.js`: 109
- Matching vendored ESLint reference rules in `reference-libraries/eslint/lib/rules/`: 109
- Custom rules requiring from-scratch implementation: 0
- Result: every configured rule can be adapted from the vendored ESLint rule source

## Notes On Previously Suspect Rules

- `no-unassigned-vars`
  - Present in `reference-libraries/eslint/lib/rules/no-unassigned-vars.js`
  - Intended semantics: flag `let`/`var` declarations that are read but never assigned, producing an "always undefined" diagnostic
  - Not custom
- `preserve-caught-error`
  - Present in `reference-libraries/eslint/lib/rules/preserve-caught-error.js`
  - Intended semantics: when a caught error is wrapped and re-thrown as a new built-in error, require preservation of the original error via the `cause` option; can also require a catch parameter when configured
  - Not custom

## Checked List

### Adapt From Vendored ESLint Source

- [x] `comma-dangle`
- [x] `constructor-super`
- [x] `default-case-last`
- [x] `eol-last`
- [x] `eqeqeq`
- [x] `for-direction`
- [x] `func-call-spacing`
- [x] `func-style`
- [x] `getter-return`
- [x] `grouped-accessor-pairs`
- [x] `indent`
- [x] `max-statements-per-line`
- [x] `new-parens`
- [x] `no-async-promise-executor`
- [x] `no-caller`
- [x] `no-case-declarations`
- [x] `no-class-assign`
- [x] `no-compare-neg-zero`
- [x] `no-cond-assign`
- [x] `no-console`
- [x] `no-const-assign`
- [x] `no-constant-binary-expression`
- [x] `no-constant-condition`
- [x] `no-control-regex`
- [x] `no-debugger`
- [x] `no-duplicate-imports`
- [x] `no-dupe-class-members`
- [x] `no-dupe-else-if`
- [x] `no-dupe-keys`
- [x] `no-duplicate-case`
- [x] `no-else-return`
- [x] `no-empty`
- [x] `no-empty-character-class`
- [x] `no-eq-null`
- [x] `no-ex-assign`
- [x] `no-extend-native`
- [x] `no-floating-decimal`
- [x] `no-func-assign`
- [x] `no-global-assign`
- [x] `no-implicit-coercion`
- [x] `no-invalid-regexp`
- [x] `no-invalid-this`
- [x] `no-irregular-whitespace`
- [x] `no-lonely-if`
- [x] `no-loop-func`
- [x] `no-loss-of-precision`
- [x] `no-misleading-character-class`
- [x] `no-mixed-operators`
- [x] `no-multi-assign`
- [x] `no-nested-ternary`
- [x] `no-new-native-nonconstructor`
- [x] `no-new-wrappers`
- [x] `no-obj-calls`
- [x] `no-plusplus`
- [x] `no-prototype-builtins`
- [x] `no-promise-executor-return`
- [x] `no-regex-spaces`
- [x] `no-return-assign`
- [x] `no-sequences`
- [x] `no-setter-return`
- [x] `no-shadow-restricted-names`
- [x] `no-template-curly-in-string`
- [x] `no-this-before-super`
- [x] `no-throw-literal`
- [x] `no-trailing-spaces`
- [x] `no-unassigned-vars`
- [x] `no-undef`
- [x] `no-unexpected-multiline`
- [x] `no-unmodified-loop-condition`
- [x] `no-unreachable`
- [x] `no-unsafe-finally`
- [x] `no-unsafe-negation`
- [x] `no-unused-expressions`
- [x] `no-unused-labels`
- [x] `no-unused-private-class-members`
- [x] `no-use-before-define`
- [x] `no-useless-assignment`
- [x] `no-useless-catch`
- [x] `no-useless-computed-key`
- [x] `no-var`
- [x] `no-warning-comments`
- [x] `preserve-caught-error`
- [x] `prefer-arrow-callback`
- [x] `prefer-const`
- [x] `prefer-numeric-literals`
- [x] `prefer-promise-reject-errors`
- [x] `prefer-rest-params`
- [x] `radix`
- [x] `require-yield`
- [x] `rest-spread-spacing`
- [x] `semi`
- [x] `strict`
- [x] `use-isnan`
- [x] `valid-typeof`

### Requires From-Scratch Implementation

- [ ] None
