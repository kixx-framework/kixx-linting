# Test Guide

This repo uses a small custom test harness driven by `run-tests.js`.

## Running Tests

- Run the full suite with `node run-tests.js`.
- Run a single test file by passing its path: `node run-tests.js test/path/to/file.test.js`.
- Run all `*test.js` files in a directory by passing the directory path.

The runner recursively imports files whose path matches `test.js$`.

## Test File Shape

Test modules should be ES modules. Import the shared test helpers from `test/deps.js`:

Example:

```js
import { describe, assertEqual, assert } from '../deps.js';
```

`test/deps.js` re-exports:

- Everything from `vendor/kixx-assert`
- `describe` from `vendor/kixx-test`

## Framework API

Use `describe()` to register suites. The callback receives an interface with:

- `before(fn, opts?)`
- `after(fn, opts?)`
- `it(name, fn?, opts?)`
- `describe(name, fn?, opts?)`
- `xit(name, fn?)`
- `xdescribe(name, fn?, opts?)`

### Notes

- A `describe(name)` or `it(name)` call with no function disables that block.
- `opts.disabled: true` also disables a block.
- `opts.timeout` overrides the default timeout in milliseconds.
- Zero-argument blocks may return synchronously or return a promise.
- Blocks with one or more parameters are treated as callback-style async blocks.

## Assertions

The assertion library exports both predicate helpers and assertion helpers.

Common assertion helpers:

- `assert`
- `assertFalsy`
- `assertEqual`
- `assertNotEqual`
- `assertMatches`
- `assertNotMatches`
- `assertDefined`
- `assertUndefined`
- `assertNonEmptyString`
- `assertNumberNotNaN`
- `assertArray`
- `assertBoolean`
- `assertFunction`
- `assertValidDate`
- `assertRegExp`
- `assertGreaterThan`
- `assertLessThan`

Useful predicates and utilities:

- `isString`
- `isNonEmptyString`
- `isNumber`
- `isNumberNotNaN`
- `isBoolean`
- `isUndefined`
- `isPrimitive`
- `isFunction`
- `isObjectNotNull`
- `isPlainObject`
- `isDate`
- `isValidDate`
- `isRegExp`
- `isMap`
- `isSet`
- `isEqual`
- `doesMatch`
- `toFriendlyString`

`AssertionError` is also exported for cases where a test needs to inspect the thrown error type or metadata.

## Conventions

- Register suites at module top level so importing the file adds the tests.
- Prefer the assertion helpers over raw `throw`s.
- Use `before` and `after` for shared setup and cleanup.
- Keep each `it()` focused on one behavior.
- Use disabled blocks only when you want an intentionally skipped case.

