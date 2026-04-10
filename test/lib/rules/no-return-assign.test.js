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
    {
        text: "module.exports = {'a': 1};",
        languageOptions: {
            sourceType: "module",
        },
    },
    { text: "var result = a * b;" },
    { text: "function x() { var result = a * b; return result; }" },
    { text: "function x() { return (result = a * b); }" },
    {
        text: "function x() { var result = a * b; return result; }",
        options: ["except-parens"],
    },
    {
        text: "function x() { return (result = a * b); }",
        options: ["except-parens"],
    },
    {
        text: "function x() { var result = a * b; return result; }",
        options: ["always"],
    },
    {
        text: "function x() { return function y() { result = a * b }; }",
        options: ["always"],
    },
    {
        text: "() => { return (result = a * b); }",
        options: ["except-parens"],
    },
    {
        text: "() => (result = a * b)",
        options: ["except-parens"],
    },
    { text: "const foo = (a,b,c) => ((a = b), c)" },
    {
        text: `function foo(){
            return (a = b)
        }`,
    },
    {
        text: `function bar(){
            return function foo(){
                return (a = b) && c
            }
        }`,
    },
    {
        text: "const foo = (a) => (b) => (a = b)",
        languageOptions: { ecmaVersion: 6 },
    },
];
const invalid = [
    {
        text: "function x() { return result = a * b; };",
    },
    {
        text: "function x() { return (result) = (a * b); };",
    },
    {
        text: "function x() { return result = a * b; };",
        options: ["except-parens"],
    },
    {
        text: "function x() { return (result) = (a * b); };",
        options: ["except-parens"],
    },
    {
        text: "() => { return result = a * b; }",
    },
    {
        text: "() => result = a * b",
    },
    {
        text: "function x() { return result = a * b; };",
        options: ["always"],
    },
    {
        text: "function x() { return (result = a * b); };",
        options: ["always"],
    },
    {
        text: "function x() { return result || (result = a * b); };",
        options: ["always"],
    },
    {
        text: `function foo(){
                return a = b
            }`,
    },
    {
        text: `function doSomething() {
                return foo = bar && foo > 0;
            }`,
    },
    {
        text: `function doSomething() {
                return foo = function(){
                    return (bar = bar1)
                }
            }`,
    },
    {
        text: `function doSomething() {
                return foo = () => a
            }`,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `function doSomething() {
                return () => a = () => b
            }`,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `function foo(a){
                return function bar(b){
                    return a = b
                }
            }`,
    },
    {
        text: "const foo = (a) => (b) => a = b",
        languageOptions: { ecmaVersion: 6 },
    },
];

describe("no-return-assign", ({ describe }) => {

    const globalRules = { "no-return-assign": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-return-assign"] = rules["no-return-assign"].concat(options);
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
                    rules["no-return-assign"] = rules["no-return-assign"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-return-assign", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
