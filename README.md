Kixx Linting
============

A narrowly scoped JavaScript linter written in JavaScript. Derived from [ESLint](https://github.com/eslint/eslint), but with only a limited subset of rules and options supported.

The primary objective of Kixx Linting is to provide a tool to agentic software engineering systems which will cheaply inform them of bugs and code smells. Kixx Linting intends to be cheap to run, providing straightforward and targeted feedback which large language models can understand.

Lint CLI
--------

Run linting with:

```bash
node lint.js <pathname>
```

The `<pathname>` argument is optional. If omitted, the CLI uses the current working directory.

`lint.js` always loads `eslint.config.js` from the current working directory. The config must default-export an array of config objects.

When the target is a directory, linting walks it recursively and only lints `.js` files. Other file extensions are ignored during directory traversal.

`files` and `ignores` matching is literal path-segment matching (no glob support). Diagnostic output is written to `stderr`, grouped by file.

Exit behavior:
- Exits `1` when any lint error is present (or when CLI/config loading fails).
- Exits `0` when results are warnings-only or fully clean.

Disabling Rules Inline
----------------------

Kixx Linting supports a small subset of ESLint-style inline disabling comments.
The `eslint-` prefix is required.

Supported forms:

```js
console.log(value); // eslint-disable-line no-console
console.log(value); /* eslint-disable-line no-console */

// eslint-disable-next-line no-console
console.log(value);

/* eslint-disable-next-line no-console, no-debugger */
console.log(value); debugger;

/* eslint-disable-next-line no-console,
   no-debugger */
console.log(value); debugger;

/* eslint-disable */
console.log(value);
debugger;
/* eslint-enable */

/* eslint-disable no-console, no-debugger */
console.log(value);
debugger;
/* eslint-enable no-console, no-debugger */

/* eslint-disable no-console */
console.log(value);
```

Behavior:
- `eslint-disable-line` applies to the line containing the directive comment.
- `eslint-disable-next-line` applies only to the immediately following line.
- `eslint-disable` applies after the block comment until a later `eslint-enable` block comment or the end of the file.
- A top-of-file `eslint-disable` comment with no later `eslint-enable` disables matching rule diagnostics for the rest of the file.
- Bare `eslint-disable` and `eslint-enable` comments affect all rule diagnostics.
- Rule-specific `eslint-disable` and `eslint-enable` comments affect only the listed rules.
- Multiple rules may be listed as comma-separated rule IDs.
- Line-scoped directives may use line comments or block comments.
- Range-scoped `eslint-disable` and `eslint-enable` directives use block comments.
- Parse errors are not suppressed by disable comments.

Testing
-------

Run the linter and the tests with:

```bash
npm test
```

Run just the linter with:

```bash
node lint.js
```

Or, to lint a specific file, pass in the pathname:

```bash
node lint.js <pathname>
```

Run just the tests with:

```bash
node run-tests.js
```

Or, to target a specific test suite by directory or file name, pass in the pathname:

```bash
node run-tests.js <pathname>
```

Copyright and License
---------------------
Copyright by Kris Walker (www.kriswalker.me).

Unless otherwise indicated, all source code is licensed under the MIT license. See LICENSE for details.

Significant portions of this software was derived from ESLint and the OpenJS Foundation (copyright OpenJS Foundation and other contributors, <www.openjsf.org>). The appropriate attribution and LICENSE notices are included in all substantial portions of this software.
