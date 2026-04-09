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
    { text: "foo(a => a);" },
    { text: "foo(function*() {});" },
    { text: "foo(function() { this; });" },
    {
        text: "foo(function bar() {});",
        options: [{ allowNamedFunctions: true }],
    },
    { text: "foo(function() { (() => this); });" },
    { text: "foo(function() { this; }.bind(obj));" },
    { text: "foo(function() { this; }.call(this));" },
    { text: "foo(a => { (function() {}); });" },
    { text: "var foo = function foo() {};" },
    { text: "(function foo() {})();" },
    { text: "foo(function bar() { bar; });" },
    { text: "foo(function bar() { arguments; });" },
    { text: "foo(function bar() { arguments; }.bind(this));" },
    { text: "foo(function bar() { new.target; });" },
    { text: "foo(function bar() { new.target; }.bind(this));" },
    { text: "foo(function bar() { this; }.bind(this, somethingElse));" },
    { text: "foo((function() {}).bind.bar)" },
    { text: "foo((function() { this.bar(); }).bind(obj).bind(this))" },
];

const invalid = [
    {
        text: "foo(function bar() {});",
    },
    {
        text: "foo(function() {});",
        options: [{ allowNamedFunctions: true }],
    },
    {
        text: "foo(function bar() {});",
        options: [{ allowNamedFunctions: false }],
    },
    {
        text: "foo(function() {});",
    },
    {
        text: "foo(nativeCb || function() {});",
    },
    {
        text: "foo(bar ? function() {} : function() {});",
    },
    {
        text: "foo(function() { (function() { this; }); });",
    },
    {
        text: "foo(function() { this; }.bind(this));",
    },
    {
        text: "foo(bar || function() { this; }.bind(this));",
    },
    {
        text: "foo(function() { (() => this); }.bind(this));",
    },
    {
        text: "foo(function bar(a) { a; });",
    },
    {
        text: "foo(function(a) { a; });",
    },
    {
        text: "foo(function(arguments) { arguments; });",
    },
    {
        text: "foo(function() { this; });",
        options: [{ allowUnboundThis: false }],
    },
    {
        text: "foo(function() { (() => this); });",
        options: [{ allowUnboundThis: false }],
    },
    {
        text: "qux(function(foo, bar, baz) { return foo * 2; })",
    },
    {
        text: "qux(function(foo, bar, baz) { return foo * bar; }.bind(this))",
    },
    {
        text: "qux(function(foo, bar, baz) { return foo * this.qux; }.bind(this))",
    },
    {
        text: "foo(function() {}.bind(this, somethingElse))",
    },
    {
        text: "qux(function(foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) { return foo + bar; });",
    },
    {
        text: "qux(function(baz, baz) { })",
    },
    {
        text: "qux(function( /* no params */ ) { })",
    },
    {
        text: "qux(function( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) { return foo; })",
    },
    {
        text: "qux(async function (foo = 1, bar = 2, baz = 3) { return baz; })",
    },
    {
        text: "qux(async function (foo = 1, bar = 2, baz = 3) { return this; }.bind(this))",
    },
    {
        text: "foo((bar || function() {}).bind(this))",
    },
    {
        text: "foo(function() {}.bind(this).bind(obj))",
    },

    // Optional chaining
    {
        text: "foo?.(function() {});",
    },
    {
        text: "foo?.(function() { return this; }.bind(this));",
    },
    {
        text: "foo(function() { return this; }?.bind(this));",
    },
    {
        text: "foo((function() { return this; }?.bind)(this));",
    },

    // https://github.com/eslint/eslint/issues/16718
    {
        text: `
            test(
                function ()
                { }
            );
            `,
    },
    {
        text: `
            test(
                function (
                    ...args
                ) /* Lorem ipsum
                dolor sit amet. */ {
                    return args;
                }
            );
            `,
    },
];

describe("prefer-arrow-callback", ({ describe }) => {

    const globalRules = { "prefer-arrow-callback": ["error"] };
    const defaultLanguageOptions = { sourceType: "script" };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["prefer-arrow-callback"] = rules["prefer-arrow-callback"].concat(options);
                }

                const res = lintText(file, rules, { ...defaultLanguageOptions, ...languageOptions });

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
                    rules["prefer-arrow-callback"] = rules["prefer-arrow-callback"].concat(options);
                }

                const res = lintText(file, rules, { ...defaultLanguageOptions, ...languageOptions });

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("prefer-arrow-callback", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
