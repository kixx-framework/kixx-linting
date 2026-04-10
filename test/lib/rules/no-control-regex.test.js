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
    { text: "var regex = /x1f/" },
    { text: String.raw`var regex = /\\x1f/` },
    { text: "var regex = new RegExp('x1f')" },
    { text: "var regex = RegExp('x1f')" },
    { text: "new RegExp('[')" },
    { text: "RegExp('[')" },
    { text: "new (function foo(){})('\\x1f')" },
    { text: String.raw`/\u{20}/u` }, // languageOptions: { ecmaVersion: 2015 }
    { text: String.raw`/\u{1F}/` },
    { text: String.raw`/\u{1F}/g` },
    { text: String.raw`new RegExp("\\u{20}", "u")` },
    { text: String.raw`new RegExp("\\u{1F}")` },
    { text: String.raw`new RegExp("\\u{1F}", "g")` },
    { text: String.raw`new RegExp("\\u{1F}", flags)` }, // when flags are unknown, this rule assumes there's no `u` flag
    { text: String.raw`new RegExp("[\\q{\\u{20}}]", "v")` },
    { text: String.raw`/[\u{20}--B]/v` }, // languageOptions: { ecmaVersion: 2024 }
];
const invalid = [
    {
        text: String.raw`var regex = /\x1f/`,
    },
    {
        text: String.raw`var regex = /\\\x1f\\x1e/`,
    },
    {
        text: String.raw`var regex = /\\\x1fFOO\\x00/`,
    },
    {
        text: String.raw`var regex = /FOO\\\x1fFOO\\x1f/`,
    },
    {
        text: "var regex = new RegExp('\\x1f\\x1e')",
    },
    {
        text: "var regex = new RegExp('\\x1fFOO\\x00')",
    },
    {
        text: "var regex = new RegExp('FOO\\x1fFOO\\x1f')",
    },
    {
        text: "var regex = RegExp('\\x1f')",
    },
    {
        text: "var regex = /(?<a>\\x1f)/", // languageOptions: { ecmaVersion: 2018 }
    },
    {
        text: String.raw`var regex = /(?<\u{1d49c}>.)\x1f/`, // languageOptions: { ecmaVersion: 2020 }
    },
    {
        text: String.raw`new RegExp("\\u001F", flags)`,
    },
    {
        text: String.raw`/\u{1111}*\x1F/u`, // languageOptions: { ecmaVersion: 2015 }
    },
    {
        text: String.raw`new RegExp("\\u{1111}*\\x1F", "u")`, // languageOptions: { ecmaVersion: 2015 }
    },
    {
        text: String.raw`/\u{1F}/u`, // languageOptions: { ecmaVersion: 2015 }
    },
    {
        text: String.raw`/\u{1F}/gui`, // languageOptions: { ecmaVersion: 2015 }
    },
    {
        text: String.raw`new RegExp("\\u{1F}", "u")`,
    },
    {
        text: String.raw`new RegExp("\\u{1F}", "gui")`,
    },
    {
        text: String.raw`new RegExp("[\\q{\\u{1F}}]", "v")`,
    },
    {
        text: String.raw`/[\u{1F}--B]/v`, // languageOptions: { ecmaVersion: 2024 }
    },
    {
        text: String.raw`/\x11/; RegExp("foo", "uv");`, // languageOptions: { ecmaVersion: 2024 }
    },
];

describe("no-control-regex", ({ describe }) => {

    const globalRules = { "no-control-regex": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-control-regex"] = rules["no-control-regex"].concat(options);
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
                    rules["no-control-regex"] = rules["no-control-regex"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-control-regex", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
