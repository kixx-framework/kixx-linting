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
    { text: "var foo = /foo/;" },
    { text: "var foo = RegExp('foo')" },
    { text: "var foo = / /;" },
    { text: "var foo = RegExp(' ')" },
    { text: "var foo = / a b c d /;" },
    { text: "var foo = /bar {3}baz/g;" },
    { text: "var foo = RegExp('bar {3}baz', 'g')" },
    { text: "var foo = new RegExp('bar {3}baz')" },
    { text: "var foo = /bar\t\t\tbaz/;" },
    { text: "var foo = RegExp('bar\t\t\tbaz');" },
    { text: "var foo = new RegExp('bar\t\t\tbaz');" },
    { text: "var RegExp = function() {}; var foo = new RegExp('bar   baz');" },
    { text: "var RegExp = function() {}; var foo = RegExp('bar   baz');" },
    { text: "var foo = /  +/;" },
    { text: "var foo = /  ?/;" },
    { text: "var foo = /  */;" },
    { text: "var foo = /  {2}/;" },

    // don't report if there are no consecutive spaces in the source code
    { text: "var foo = /bar \\ baz/;" },
    { text: "var foo = /bar\\ \\ baz/;" },
    { text: "var foo = /bar \\u0020 baz/;" },
    { text: "var foo = /bar\\u0020\\u0020baz/;" },
    { text: "var foo = new RegExp('bar \\ baz')" },
    { text: "var foo = new RegExp('bar\\ \\ baz')" },
    { text: "var foo = new RegExp('bar \\\\ baz')" },
    { text: "var foo = new RegExp('bar \\u0020 baz')" },
    { text: "var foo = new RegExp('bar\\u0020\\u0020baz')" },
    { text: "var foo = new RegExp('bar \\\\u0020 baz')" },

    // don't report spaces in character classes
    { text: "var foo = /[  ]/;" },
    { text: "var foo = /[   ]/;" },
    { text: "var foo = / [  ] /;" },
    { text: "var foo = / [  ] [  ] /;" },
    { text: "var foo = new RegExp('[  ]');" },
    { text: "var foo = new RegExp('[   ]');" },
    { text: "var foo = new RegExp(' [  ] ');" },
    { text: "var foo = RegExp(' [  ] [  ] ');" },
    { text: "var foo = new RegExp(' \\[   ');" },
    { text: "var foo = new RegExp(' \\[   \\] ');" },

    // ES2024
    { code: "var foo = /  {2}/v;", languageOptions: { ecmaVersion: 2024 } },
    {
        code: "var foo = /[\\q{    }]/v;",
        languageOptions: { ecmaVersion: 2024 },
    },

    // don't report invalid regex
    { text: "var foo = new RegExp('[  ');" },
    { text: "var foo = new RegExp('{  ', 'u');" },

    // don't report if flags cannot be determined
    { text: "new RegExp('  ', flags)" },
    { text: "new RegExp('[[abc]  ]', flags + 'v')" },
    { text: "new RegExp('[[abc]\\\\q{  }]', flags + 'v')" },
];

const invalid = [
    {
        code: "var foo = /bar  baz/;",
    },
    {
        code: "var foo = /bar    baz/;",
    },
    {
        code: "var foo = / a b  c d /;",
    },
    {
        code: "var foo = RegExp(' a b c d  ');",
    },
    {
        code: "var foo = RegExp('bar    baz');",
    },
    {
        code: "var foo = new RegExp('bar    baz');",
    },
    {
        // `RegExp` is not shadowed in the scope where it's called
        code: "{ let RegExp = function() {}; } var foo = RegExp('bar    baz');",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "var foo = /bar   {3}baz/;",
    },
    {
        code: "var foo = /bar    ?baz/;",
    },
    {
        code: "var foo = new RegExp('bar   *baz')",
    },
    {
        code: "var foo = RegExp('bar   +baz')",
    },
    {
        code: "var foo = new RegExp('bar    ');",
    },
    {
        code: "var foo = /bar\\  baz/;",
    },
    {
        code: "var foo = /[   ]  /;",
    },
    {
        code: "var foo = /  [   ] /;",
    },
    {
        code: "var foo = new RegExp('[   ]  ');",
    },
    {
        code: "var foo = RegExp('  [ ]');",
    },
    {
        code: "var foo = /\\[  /;",
    },
    {
        code: "var foo = /\\[  \\]/;",
    },
    {
        code: "var foo = /(?:  )/;",
    },
    {
        code: "var foo = RegExp('^foo(?=   )');",
    },
    {
        code: "var foo = /\\  /",
    },
    {
        code: "var foo = / \\  /",
    },

    // report only the first occurrence of consecutive spaces
    {
        code: "var foo = /  foo   /;",
    },

    // don't fix strings with escape sequences
    {
        code: "var foo = new RegExp('\\\\d  ')",
    },
    {
        code: "var foo = RegExp('\\u0041   ')",
    },
    {
        code: "var foo = new RegExp('\\\\[  \\\\]');",
    },

    // ES2024
    {
        code: "var foo = /[[    ]    ]    /v;",
        languageOptions: {
            ecmaVersion: 2024,
        },
    },
    {
        code: "var foo = new RegExp('[[    ]    ]    ', 'v');",
    },
];

describe("no-regex-spaces", ({ describe }) => {

    const globalRules = { "no-regex-spaces": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-regex-spaces"] = rules["no-regex-spaces"].concat(options);
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
                    rules["no-regex-spaces"] = rules["no-regex-spaces"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-regex-spaces", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
