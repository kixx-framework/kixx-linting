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

import globals from '../../../vendor/globals/globals.json' with { type: 'json' };

import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";


const valid = [
    { text: "var a = 1, b = 2; a;" },
    { text: "/*global b*/ function f() { b; }" },
    {
        text: "function f() { b; }",
        languageOptions: { globals: { b: false } },
    },
    { text: "/*global b a:false*/  a;  function f() { b; a; }" },
    { text: "function a(){}  a();" },
    { text: "function f(b) { b; }" },
    { text: "var a; a = 1; a++;" },
    { text: "var a; function f() { a = 1; }" },
    { text: "/*global b:true*/ b++;" },
    {
        text: "window;",
        languageOptions: { globals: globals.browser },
    },
    {
        text: 'require("a");',
        languageOptions: { sourceType: "commonjs" },
    },
    { text: "Object; isNaN();" },
    { text: "toString()" },
    { text: "hasOwnProperty()" },
    { text: "function evilEval(stuffToEval) { var ultimateAnswer; ultimateAnswer = 42; eval(stuffToEval); }" },
    { text: "typeof a" },
    { text: "typeof (a)" },
    { text: "var b = typeof a" },
    { text: "typeof a === 'undefined'" },
    { text: "if (typeof a === 'undefined') {}" },
    {
        text: "function foo() { var [a, b=4] = [1, 2]; return {a, b}; }",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "var toString = 1;", languageOptions: { ecmaVersion: 6 } },
    {
        text: "function myFunc(...foo) {  return foo;}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var console; [1,2,3].forEach(obj => {\n  console.log(obj);\n});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var Foo; class Bar extends Foo { constructor() { super();  }}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "import Warning from '../lib/warning'; var warn = new Warning('text');",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import * as Warning from '../lib/warning'; var warn = new Warning('text');",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    { text: "var a; [a] = [0];", languageOptions: { ecmaVersion: 6 } },
    { text: "var a; ({a} = {});", languageOptions: { ecmaVersion: 6 } },
    { text: "var a; ({b: a} = {});", languageOptions: { ecmaVersion: 6 } },
    {
        text: "var obj; [obj.a, obj.b] = [0, 1];",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "URLSearchParams;",
        languageOptions: { globals: globals.browser },
    },
    { text: "Intl;", languageOptions: { ecmaVersion: 2015 } },
    {
        text: "IntersectionObserver;",
        languageOptions: { globals: globals.browser },
    },
    { text: "Credential;", languageOptions: { globals: globals.browser } },
    {
        text: "requestIdleCallback;",
        languageOptions: { globals: globals.browser },
    },
    {
        text: "customElements;",
        languageOptions: { globals: globals.browser },
    },
    {
        text: "PromiseRejectionEvent;",
        languageOptions: { globals: globals.browser },
    },
    {
        text: "(foo, bar) => { foo ||= WeakRef; bar ??= FinalizationRegistry; }",
        languageOptions: { ecmaVersion: 2021 },
    },
    { text: "(class C extends C {})", languageOptions: { ecmaVersion: 6 } },

    // Notifications of readonly are removed: https://github.com/eslint/eslint/issues/4504
    { text: "/*global b:false*/ function f() { b = 1; }" },
    {
        text: "function f() { b = 1; }",
        languageOptions: { globals: { b: false } },
    },
    { text: "/*global b:false*/ function f() { b++; }" },
    { text: "/*global b*/ b = 1;" },
    { text: "/*global b:false*/ var b = 1;" },
    { text: "Array = 1;" },

    // new.target: https://github.com/eslint/eslint/issues/5420
    {
        text: "class A { constructor() { new.target; } }",
        languageOptions: { ecmaVersion: 6 },
    },

    // Rest property
    {
        text: "var {bacon, ...others} = stuff; foo(others)",
        languageOptions: {
            ecmaVersion: 2018,
            globals: { stuff: false, foo: false },
        },
    },

    // export * as ns from "source"
    {
        text: 'export * as ns from "source"',
        languageOptions: { ecmaVersion: 2020, sourceType: "module" },
    },

    // import.meta
    {
        text: "import.meta",
        languageOptions: { ecmaVersion: 2020, sourceType: "module" },
    },

    // class static blocks
    {
        text: "let a; class C { static {} } a;",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "var a; class C { static {} } a;",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "a; class C { static {} } var a;",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { C; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "const C = class { static { C; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { a; } } var a;",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { a; } } let a;",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { var a; a; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { a; var a; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { a; { var a; } } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { let a; a; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { a; let a; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { function a() {} a; } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { a; function a() {} } }",
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "[Float16Array, Iterator]",
        languageOptions: { ecmaVersion: 2025 },
    },
    {
        text: "AsyncDisposableStack; DisposableStack; SuppressedError; Temporal",
        languageOptions: { ecmaVersion: 2026 },
    },
];
const invalid = [
    {
        text: "a = 1;",
    },
    {
        text: "if (typeof anUndefinedVar === 'string') {}",
        options: [{ typeof: true }],
    },
    {
        text: "var a = b;",
    },
    {
        text: "function f() { b; }",
    },
    {
        text: "window;",
    },
    {
        text: "Intl;",
    },
    {
        text: 'require("a");',
    },
    {
        text: "[a] = [0];",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "({a} = {});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "({b: a} = {});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "[obj.a, obj.b] = [0, 1];",
        languageOptions: { ecmaVersion: 6 },
    },

    // Experimental
    {
        text: "const c = 0; const a = {...b, c};",
        languageOptions: {
            ecmaVersion: 2018,
        },
    },

    // class static blocks
    {
        text: "class C { static { a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { { let a; } a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { { function a() {} } a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { function foo() { var a; }  a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { var a; } static { a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { let a; } static { a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { function a(){} } static { a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { var a; } foo() { a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { let a; } foo() { a; } }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { var a; } [a]; }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { let a; } [a]; }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { function a() {} } [a]; }",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
    {
        text: "class C { static { var a; } } a;",
        languageOptions: {
            ecmaVersion: 2022,
        },
    },
];

describe("no-undef", ({ describe }) => {

    const globalRules = { "no-undef": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };
                const effectiveLanguageOptions = { ecmaVersion: 5, sourceType: "script", ...languageOptions };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-undef"] = rules["no-undef"].concat(options);
                }

                const res = lintText(file, rules, effectiveLanguageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    // eslint-disable-next-line no-console
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };
                const effectiveLanguageOptions = { ecmaVersion: 5, sourceType: "script", ...languageOptions };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-undef"] = rules["no-undef"].concat(options);
                }

                const res = lintText(file, rules, effectiveLanguageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-undef", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
