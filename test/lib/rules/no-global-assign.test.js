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

// Inline only the browser globals needed for these tests.
// `top` is readonly (false), `onload` is writable (true).
const browserGlobals = { top: false, onload: true };

const valid = [
    { text: "string = 'hello world';" },
    { text: "var string;" },
    {
        text: "Object = 0;",
        options: [{ exceptions: ["Object"] }],
    },
    { text: "top = 0;" },
    {
        text: "onload = 0;",
        languageOptions: { globals: browserGlobals }
    },
    { text: "require = 0;" },
    {
        text: "a = 1",
        languageOptions: { globals: { a: true } }
    },
    { text: "/*global a:true*/ a = 1" },
];

const invalid = [
    {
        text: "String = 'hello world';",
    },
    {
        text: "String++;",
    },
    {
        text: "({Object = 0, String = 0} = {});",
        // languageOptions: { ecmaVersion: 6 },
        errors: 2,
    },
    {
        text: "top = 0;",
        languageOptions: { globals: browserGlobals },
    },
    {
        // languageOptions: { sourceType: "commonjs" },
        text: "require = 0;",
        languageOptions: { globals: { require: false } },
    },

    // Notifications of readonly are moved from no-undef: https://github.com/eslint/eslint/issues/4504
    {
        text: "/*global b:false*/ function f() { b = 1; }",
    },
    {
        text: "function f() { b = 1; }",
        languageOptions: { globals: { b: false } },
    },
    {
        text: "/*global b:false*/ function f() { b++; }",
    },
    {
        text: "/*global b*/ b = 1;",
    },
    {
        text: "Array = 1;",
    },
];

describe("no-global-assign", ({ describe }) => {

    const globalRules = { "no-global-assign": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-global-assign"] = rules["no-global-assign"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
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
                    rules["no-global-assign"] = rules["no-global-assign"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-global-assign", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
