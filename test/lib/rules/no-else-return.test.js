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
    { text: "function foo() { if (true) { if (false) { return x; } } else { return y; } }" },
    { text: "function foo() { if (true) { return x; } return y; }" },
    { text: "function foo() { if (true) { for (;;) { return x; } } else { return y; } }" },
    { text: "function foo() { var x = true; if (x) { return x; } else if (x === false) { return false; } }" },
    { text: "function foo() { if (true) notAReturn(); else return y; }" },
    { text: "function foo() {if (x) { notAReturn(); } else if (y) { return true; } else { notAReturn(); } }" },
    { text: "function foo() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }" },
    { text: "if (0) { if (0) {} else {} } else {}" },
    {
        text: `
            function foo() {
                if (foo)
                    if (bar) return;
                    else baz;
                else qux;
            }
        `,
    },
    {
        text: `
            function foo() {
                while (foo)
                    if (bar) return;
                    else baz;
            }
        `,
    },
    {
        text: "function foo19() { if (true) { return x; } else if (false) { return y; } }",
        options: [{ allowElseIf: true }],
    },
    {
        text: "function foo20() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
        options: [{ allowElseIf: true }],
    },
    {
        text: "function foo21() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
        options: [{ allowElseIf: true }],
    },
];

const invalid = [
    {
        text: "function foo1() { if (true) { return x; } else { return y; } }",
    },
    {
        text: "function foo2() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }",
    },
    {
        text: "function foo3() { if (true) return x; else return y; }",
    },
    {
        text: "function foo4() { if (true) { if (false) return x; else return y; } else { return z; } }",
    },
    {
        text: "function foo5() { if (true) { if (false) { if (true) return x; else { w = y; } } else { w = x; } } else { return z; } }",
    },
    {
        text: "function foo6() { if (true) { if (false) { if (true) return x; else return y; } } else { return z; } }",
    },
    {
        text: "function foo7() { if (true) { if (false) { if (true) return x; else return y; } return w; } else { return z; } }",
    },
    {
        text: "function foo8() { if (true) { if (false) { if (true) return x; else return y; } else { w = x; } } else { return z; } }",
    },
    {
        text: "function foo9() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
    },
    {
        text: "function foo9a() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
        options: [{ allowElseIf: false }],
    },
    {
        text: "function foo9b() {if (x) { return true; } if (y) { return true; } else { notAReturn(); } }",
        options: [{ allowElseIf: false }],
    },
    {
        text: "function foo10() { if (foo) return bar; else (foo).bar(); }",
    },
    {
        text: "function foo11() { if (foo) return bar \nelse { [1, 2, 3].map(foo) } }",
    },
    {
        text: "function foo12() { if (foo) return bar \nelse { baz() } \n[1, 2, 3].map(foo) }",
    },
    {
        text: "function foo13() { if (foo) return bar; \nelse { [1, 2, 3].map(foo) } }",
    },
    {
        text: "function foo14() { if (foo) return bar \nelse { baz(); } \n[1, 2, 3].map(foo) }",
    },
    {
        text: "function foo15() { if (foo) return bar; else { baz() } qaz() }",
    },
    {
        text: "function foo16() { if (foo) return bar \nelse { baz() } qaz() }",
    },
    {
        text: "function foo17() { if (foo) return bar \nelse { baz() } \nqaz() }",
    },
    {
        text: "function foo18() { if (foo) return function() {} \nelse [1, 2, 3].map(bar) }",
    },
    {
        text: "function foo19() { if (true) { return x; } else if (false) { return y; } }",
        options: [{ allowElseIf: false }],
    },
    {
        text: "function foo20() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
        options: [{ allowElseIf: false }],
    },
    {
        text: "function foo21() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
        options: [{ allowElseIf: false }],
    },

    // https://github.com/eslint/eslint/issues/11069
    {
        text: "function foo() { var a; if (bar) { return true; } else { var a; } }",
    },
    {
        text: "function foo() { if (bar) { var a; if (baz) { return true; } else { var a; } } }",
    },
    {
        text: "function foo() { var a; if (bar) { return true; } else { var a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { var a; if (baz) { return true; } else { var a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { let a; if (bar) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class foo { bar() { let a; if (baz) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { let a; if (baz) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() {let a; if (bar) { if (baz) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { const a = 1; if (bar) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { const a = 1; if (baz) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { let a; if (bar) { return true; } else { const a = 1 } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { let a; if (baz) { return true; } else { const a = 1; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { class a {}; if (bar) { return true; } else { const a = 1; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { class a {}; if (baz) { return true; } else { const a = 1; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { const a = 1; if (bar) { return true; } else { class a {} } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { const a = 1; if (baz) { return true; } else { class a {} } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { var a; if (bar) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { var a; return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let a; }  while (baz) { var a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a) { if (bar) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 1) { if (bar) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a, b = a) { if (bar) { return true; } else { let a; }  if (bar) { return true; } else { let b; }}",
        // languageOptions: { ecmaVersion: 6 },
        errors: 2,
    },
    {
        text: "function foo(...args) { if (bar) { return true; } else { let args; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { try {} catch (a) { if (bar) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { try {} catch (a) { if (bar) { if (baz) { return true; } else { let a; } } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { try {} catch ({bar, a = 1}) { if (baz) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let arguments_; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let arguments_; } return arguments_[0]; }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let arguments_; } if (baz) { return arguments_[0]; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let arguments_; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let a; } a; }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let a; } if (baz) { a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } a; }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } if (quux) { a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a() { if (foo) { return true; } else { let a; } a(); }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a() { if (a) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a() { if (foo) { return a; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let a; } function baz() { a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } (() => a) } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let a; } var a; }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } var a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } var { a } = {}; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } if (quux) { var a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } if (quux) { var a; } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (quux) { var a; } if (bar) { if (baz) { return true; } else { let a; } } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { let a; } function a(){} }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (baz) { if (bar) { return true; } else { let a; } function a(){} } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } if (quux) { function a(){}  } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } function a(){} }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { let a; if (bar) { return true; } else { function a(){} } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { var a; if (bar) { return true; } else { function a(){} } }",
        // languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { if (bar) { return true; } else { function baz() {} } }",
    },
    {
        text: "function foo() { if (foo) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6, sourceType: "commonjs" },
    },
    {
        text: "function foo() { let a; if (foo) { return true; } else { let a; } }",
        // languageOptions: { ecmaVersion: 6, sourceType: "commonjs" },
    },
];

describe("no-else-return", ({ describe }) => {

    const globalRules = { "no-else-return": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-else-return"] = rules["no-else-return"].concat(options);
                }

                const res = lintText(file, rules);

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
            invalid.forEach(({ text, options, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-else-return"] = rules["no-else-return"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-else-return", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
