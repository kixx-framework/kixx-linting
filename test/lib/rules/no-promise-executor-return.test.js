/*
 * Copyright OpenJS Foundation and other contributors, <www.openjsf.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";

const valid = [
    //------------------------------------------------------------------------------
    // General
    //------------------------------------------------------------------------------

    // not a promise executor
    { text: "function foo(resolve, reject) { return 1; }" },
    { text: "function Promise(resolve, reject) { return 1; }" },
    { text: "(function (resolve, reject) { return 1; })" },
    { text: "(function foo(resolve, reject) { return 1; })" },
    { text: "(function Promise(resolve, reject) { return 1; })" },
    { text: "var foo = function (resolve, reject) { return 1; }" },
    { text: "var foo = function Promise(resolve, reject) { return 1; }" },
    { text: "var Promise = function (resolve, reject) { return 1; }" },
    { text: "(resolve, reject) => { return 1; }" },
    { text: "(resolve, reject) => 1" },
    { text: "var foo = (resolve, reject) => { return 1; }" },
    { text: "var Promise = (resolve, reject) => { return 1; }" },
    { text: "var foo = (resolve, reject) => 1" },
    { text: "var Promise = (resolve, reject) => 1" },
    { text: "var foo = { bar(resolve, reject) { return 1; } }" },
    { text: "var foo = { Promise(resolve, reject) { return 1; } }" },
    { text: "new foo(function (resolve, reject) { return 1; });" },
    { text: "new foo(function bar(resolve, reject) { return 1; });" },
    { text: "new foo(function Promise(resolve, reject) { return 1; });" },
    { text: "new foo((resolve, reject) => { return 1; });" },
    { text: "new foo((resolve, reject) => 1);" },
    { text: "new promise(function foo(resolve, reject) { return 1; });" },
    { text: "new Promise.foo(function foo(resolve, reject) { return 1; });" },
    { text: "new foo.Promise(function foo(resolve, reject) { return 1; });" },
    { text: "new Promise.Promise(function foo(resolve, reject) { return 1; });" },
    { text: "new Promise()(function foo(resolve, reject) { return 1; });" },

    // not a promise executor - Promise() without new
    { text: "Promise(function (resolve, reject) { return 1; });" },
    { text: "Promise((resolve, reject) => { return 1; });" },
    { text: "Promise((resolve, reject) => 1);" },

    // not a promise executor - not the first argument
    { text: "new Promise(foo, function (resolve, reject) { return 1; });" },
    { text: "new Promise(foo, (resolve, reject) => { return 1; });" },
    { text: "new Promise(foo, (resolve, reject) => 1);" },

    // global Promise doesn't exist
    { text: "/* globals Promise:off */ new Promise(function (resolve, reject) { return 1; });" },
    {
        text: "new Promise((resolve, reject) => { return 1; });",
        languageOptions: {
            globals: { Promise: "off" },
        },
    },

    // global Promise is shadowed
    { text: "let Promise; new Promise(function (resolve, reject) { return 1; });" },
    { text: "function f() { new Promise((resolve, reject) => { return 1; }); var Promise; }" },
    { text: "function f(Promise) { new Promise((resolve, reject) => 1); }" },
    { text: "if (x) { const Promise = foo(); new Promise(function (resolve, reject) { return 1; }); }" },
    { text: "x = function Promise() { new Promise((resolve, reject) => { return 1; }); }" },

    // return without a value is allowed
    { text: "new Promise(function (resolve, reject) { return; });" },
    { text: "new Promise(function (resolve, reject) { reject(new Error()); return; });" },
    { text: "new Promise(function (resolve, reject) { if (foo) { return; } });" },
    { text: "new Promise((resolve, reject) => { return; });" },
    { text: "new Promise((resolve, reject) => { if (foo) { resolve(1); return; } reject(new Error()); });" },

    // throw is allowed
    { text: "new Promise(function (resolve, reject) { throw new Error(); });" },
    { text: "new Promise((resolve, reject) => { throw new Error(); });" },

    // not returning from the promise executor
    { text: "new Promise(function (resolve, reject) { function foo() { return 1; } });" },
    { text: "new Promise((resolve, reject) => { (function foo() { return 1; })(); });" },
    { text: "new Promise(function (resolve, reject) { () => { return 1; } });" },
    { text: "new Promise((resolve, reject) => { () => 1 });" },
    { text: "function foo() { return new Promise(function (resolve, reject) { resolve(bar); }) };" },
    { text: "foo => new Promise((resolve, reject) => { bar(foo, (err, data) => { if (err) { reject(err); return; } resolve(data); })});" },

    // promise executors do not have effect on other functions (tests function info tracking)
    { text: "new Promise(function (resolve, reject) {}); function foo() { return 1; }" },
    { text: "new Promise((resolve, reject) => {}); (function () { return 1; });" },
    { text: "new Promise(function (resolve, reject) {}); () => { return 1; };" },
    { text: "new Promise((resolve, reject) => {}); () => 1;" },

    /*
		 * allowVoid: true
		 * `=> void` and `return void` are allowed
		 */
    {
        text: "new Promise((r) => void cbf(r));",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => void 0)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => { return void 0 })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => { if (foo) { return void 0 } return void 0 })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    { text: "new Promise(r => {0})" },
];

const invalid = [
    // full error tests
    {
        text: "new Promise(function (resolve, reject) { return 1; })",
    },
    {
        text: "new Promise((resolve, reject) => resolve(1))",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise((resolve, reject) => { return 1 })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },

    // suggestions arrow function expression
    {
        text: "new Promise(r => 1)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => 1 ? 2 : 3)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => (1 ? 2 : 3))",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => (1))",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => () => {})",
        options: [
            {
                allowVoid: true,
            },
        ],
    },

    // primitives
    {
        text: "new Promise(r => null)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => null)",
        options: [
            {
                allowVoid: false,
            },
        ],
    },

    // inline comments
    {
        text: "new Promise(r => /*hi*/ ~0)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => /*hi*/ ~0)",
        options: [
            {
                allowVoid: false,
            },
        ],
    },

    // suggestions function
    {
        text: "new Promise(r => { return 0 })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r => { return 0 })",
        options: [
            {
                allowVoid: false,
            },
        ],
    },

    // multiple returns
    {
        text: "new Promise(r => { if (foo) { return void 0 } return 0 })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },

    // return assignment
    {
        text: "new Promise(resolve => { return (foo = resolve(1)); })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(resolve => r = resolve)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },

    // return<immediate token> (range check)
    {
        text: "new Promise(r => { return(1) })",
        options: [
            {
                allowVoid: true,
            },
        ],
    },
    {
        text: "new Promise(r =>1)",
        options: [
            {
                allowVoid: true,
            },
        ],
    },

    // snapshot
    {
        text: "new Promise(r => ((1)))",
        options: [
            {
                allowVoid: true,
            },
        ],
    },

    // other basic tests
    {
        text: "new Promise(function foo(resolve, reject) { return 1; })",
    },
    {
        text: "new Promise((resolve, reject) => { return 1; })",
    },

    // any returned value
    {
        text: "new Promise(function (resolve, reject) { return undefined; })",
    },
    {
        text: "new Promise((resolve, reject) => { return null; })",
    },
    {
        text: "new Promise(function (resolve, reject) { return false; })",
    },
    {
        text: "new Promise((resolve, reject) => resolve)",
    },
    {
        text: "new Promise((resolve, reject) => null)",
    },
    {
        text: "new Promise(function (resolve, reject) { return resolve(foo); })",
    },
    {
        text: "new Promise((resolve, reject) => { return reject(foo); })",
    },
    {
        text: "new Promise((resolve, reject) => x + y)",
    },
    {
        text: "new Promise((resolve, reject) => { return Promise.resolve(42); })",
    },

    // any return statement location
    {
        text: "new Promise(function (resolve, reject) { if (foo) { return 1; } })",
    },
    {
        text: "new Promise((resolve, reject) => { try { return 1; } catch(e) {} })",
    },
    {
        text: "new Promise(function (resolve, reject) { while (foo){ if (bar) break; else return 1; } })",
    },

    // `return void` is not allowed without `allowVoid: true`
    {
        text: "new Promise(() => { return void 1; })",
    },

    {
        text: "new Promise(() => (1))",
    },
    {
        text: "() => new Promise(() => ({}));",
    },

    // absence of arguments has no effect
    {
        text: "new Promise(function () { return 1; })",
    },
    {
        text: "new Promise(() => { return 1; })",
    },
    {
        text: "new Promise(() => 1)",
    },

    // various scope tracking tests
    {
        text: "function foo() {} new Promise(function () { return 1; });",
    },
    {
        text: "function foo() { return; } new Promise(() => { return 1; });",
    },
    {
        text: "function foo() { return 1; } new Promise(() => { return 2; });",
    },
    {
        text: "function foo () { return new Promise(function () { return 1; }); }",
    },
    {
        text: "function foo() { return new Promise(() => { bar(() => { return 1; }); return false; }); }",
    },
    {
        text: "() => new Promise(() => { if (foo) { return 0; } else bar(() => { return 1; }); })",
    },
    {
        text: "function foo () { return 1; return new Promise(function () { return 2; }); return 3;}",
    },
    {
        text: "() => 1; new Promise(() => { return 1; })",
    },
    {
        text: "new Promise(function () { return 1; }); function foo() { return 1; } ",
    },
    {
        text: "() => new Promise(() => { return 1; });",
    },
    {
        text: "() => new Promise(() => 1);",
    },
    {
        text: "() => new Promise(() => () => 1);",
    },
    {
        text: "() => new Promise(() => async () => 1);",
        languageOptions: { ecmaVersion: 2017 },

        // for async
    },
    {
        // No suggestion since an unnamed FunctionExpression inside braces is invalid syntax.
        text: "() => new Promise(() => function () {});",
    },
    {
        text: "() => new Promise(() => function foo() {});",
    },
    {
        text: "() => new Promise(() => []);",
    },

    // edge cases for global Promise reference
    {
        text: "new Promise((Promise) => { return 1; })",
    },
    {
        text: "new Promise(function Promise(resolve, reject) { return 1; })",
    },
];

describe("no-promise-executor-return", ({ describe }) => {

    const globalRules = { "no-promise-executor-return": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-promise-executor-return"] = rules["no-promise-executor-return"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, code, options, languageOptions, errors = 1 }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-promise-executor-return"] = rules["no-promise-executor-return"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-promise-executor-return", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
