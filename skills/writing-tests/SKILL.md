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

## Examples

### Linting rule test (valid / invalid pattern)

Most rule tests follow this shape: declare `valid` and `invalid` fixture arrays at the top, then iterate over each in two nested `describe` blocks. Each fixture has a `text` field and optional `options`/`languageOptions`. A `console.error(res)` guard in the valid loop makes failures easier to diagnose.

```js
import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";

const valid = [
    { text: "var x = 5;" },
    { text: "foo();" },
];

const invalid = [
    { text: "var x = 5" },           // missing semicolon
    { text: "foo()", errors: 1 },    // explicit error count when > 1
];

describe("semi", ({ describe }) => {

    const globalRules = { semi: ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules.semi = rules.semi.concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    // eslint-disable-next-line no-console
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, options, languageOptions, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules.semi = rules.semi.concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("semi", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
```

### Unit / integration test (non-rule)

For tests that exercise library internals directly — parsers, utilities, etc. — use flat `it()` calls inside a single `describe`. Helper functions defined in the file are fine.

```js
import {
    describe,
    assertEqual,
} from "../deps.js";

import { parse } from "../../lib/parser.js";
import { SourceCode } from "../../lib/source-code.js";

function createSourceCode(text) {
    const parseResult = parse(text);
    if (!parseResult.ok) {
        throw new Error(`Expected parse to succeed for test input: ${text}`);
    }
    return new SourceCode({ text, ast: parseResult.ast });
}

describe("parser", ({ it }) => {
    it("parses a simple expression", () => {
        const src = createSourceCode("var x = 1;");
        assertEqual("Program", src.ast.type);
    });

    it("returns an error result for invalid syntax", () => {
        const result = parse("var {");
        assertEqual(false, result.ok);
    });
});
```

