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
    { text: "const JOE = 'schmoe';" },
    { text: "let moo = 'car';" },
    {
        text: "const JOE = 'schmoe';",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "let moo = 'car';",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "using moo = 'car';",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
    {
        text: "await using moo = 'car';",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
];

const invalid = [
    {
        text: "var foo = bar;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var foo = bar, toast = most;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var foo = bar; let toast = most;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var a of b) { console.log(a); }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var a in b) { console.log(a); }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (let a of b) { var c = 1; console.log(c); }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var i = 0; i < list.length; ++i) { foo(i) }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var i = 0, i = 0; false;);",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var i = 0; for (var i = 1; false;); console.log(i);",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },

    // Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
    {
        text: "var a, b, c; var a;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var a; if (b) { var a; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "if (foo) { var a, b, c; } a;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var i = 0; i < 10; ++i) {} i;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var a in obj) {} a;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (var a of list) {} a;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "switch (a) { case 0: var b = 1 }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },

    // Don't fix if the variable is in a loop and the behavior might change.
    {
        text: "for (var a of b) { arr.push(() => a); }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },

    // https://github.com/eslint/eslint/issues/7950
    {
        text: "var a = a",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var {a = a} = {}",
        languageOptions: {
            ecmaVersion: 2015,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var {a = b, b} = {}",
        languageOptions: {
            ecmaVersion: 2015,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var {a, b = a} = {}",
        languageOptions: {
            ecmaVersion: 2015,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var a = b, b = 1",
        languageOptions: {
            ecmaVersion: 2015,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "var a = b; var b = 1",
        languageOptions: {
            ecmaVersion: 2015,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },

    /*
		 * This case is not in TDZ, but it's very hard to distinguish the reference is in TDZ or not.
		 * So this rule does not fix it for safe.
		 */
    {
        text: "function foo() { a } var a = 1; foo()",
        languageOptions: {
            ecmaVersion: 2015,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },

    // https://github.com/eslint/eslint/issues/7961
    {
        text: "if (foo) var bar = 1;",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },

    // https://github.com/eslint/eslint/issues/9520
    {
        text: "var foo = 1",
    },
    {
        text: "{ var foo = 1 }",
    },
    {
        text: "if (true) { var foo = 1 }",
    },
    {
        text: "var foo = 1",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },

    // https://github.com/eslint/eslint/issues/11830
    {
        text: "function foo() { var let; }",
        languageOptions: { sourceType: "script" },
    },
    {
        text: "function foo() { var { let } = {}; }",
        languageOptions: { sourceType: "script" },
    },

    // https://github.com/eslint/eslint/issues/16610
    {
        text: "var fx = function (i = 0) { if (i < 5) { return fx(i + 1); } console.log(i); }; fx();",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = function () { foo() };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = () => foo();",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = (function () { foo(); })();",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = bar(function () { foo(); });",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var bar = foo, foo = function () { foo(); };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var bar = foo; var foo = function () { foo(); };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var { foo = foo } = function () { foo(); };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var { bar = foo, foo } = function () { foo(); };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var bar = function () { foo(); }; var foo = function() {};",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },

    // https://github.com/eslint/eslint/issues/20209
    {
        text: "export function a() { console.log(o); var o; return o; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function test() { console.log(x); var x = 1; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function test() { console.log(x); var x = 1; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "function test() { if (foo) { console.log(x); } var x = 1; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function a() { if (something) { console.log(o); } var o; return o; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function b() { if (something) { console.log(o); var o; return o; } }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function test() { var y = x; var x = 1; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var a = 1; function test() { console.log(a); var a = 2; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
];

describe("no-var", ({ describe }) => {

    const globalRules = { "no-var": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-var"] = rules["no-var"].concat(options);
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
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-var"] = rules["no-var"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-var", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
