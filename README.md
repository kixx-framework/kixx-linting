Kixx Linting
============

A narrowly scoped JavaScript linter written in JavaScript. Derived from [ESLint](https://github.com/eslint/eslint), but with only a limited subset of rules and options supported.

The primary objective of Kixx Linting is to provide a tool to agentic software engineering systems which will cheaply inform them of bugs and code smells. Kixx Linting intends to be cheap to run, and to provide straightforward and targeted feedback which large language models can understand.

Testing
-------

Run all the tests with:

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

Significant portions of this software was derived from ESLint and the OpenJS Foundation (copyright OpenJS Foundation and other contributors, <www.openjsf.org>) and also licensed under the MIT license. The appropriate attribution and LICENSE notices are included in all substantial portions of this software.
