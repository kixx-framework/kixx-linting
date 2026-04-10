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
    { text: "RegExp('')" },
    { text: "RegExp()" },
    { text: "RegExp('.', 'g')" },
    { text: "new RegExp('.')" },
    { text: "new RegExp" },
    { text: "new RegExp('.', 'im')" },
    { text: "global.RegExp('\\\\')" },
    { text: "new RegExp('.', y)" },
    { text: "new RegExp('.', 'y')" },
    { text: "new RegExp('.', 'u')" },
    { text: "new RegExp('.', 'yu')" },
    { text: "new RegExp('/', 'yu')" },
    { text: "new RegExp('\\/', 'yu')" },
    { text: "new RegExp('\\\\u{65}', 'u')" },
    { text: "new RegExp('\\\\u{65}*', 'u')" },
    { text: "new RegExp('[\\\\u{0}-\\\\u{1F}]', 'u')" },
    { text: "new RegExp('.', 's')" },
    { text: "new RegExp('(?<=a)b')" },
    { text: "new RegExp('(?<!a)b')" },
    { text: "new RegExp('(?<a>b)\\k<a>')" },
    { text: "new RegExp('(?<a>b)\\k<a>', 'u')" },
    { text: "new RegExp('\\\\p{Letter}', 'u')" },

    // unknown flags
    { text: "RegExp('{', flags)" }, // valid without the "u" flag
    { text: "new RegExp('{', flags)" }, // valid without the "u" flag
    { text: "RegExp('\\\\u{0}*', flags)" }, // valid with the "u" flag
    { text: "new RegExp('\\\\u{0}*', flags)" }, // valid with the "u" flag
    {
        text: "RegExp('{', flags)", // valid without the "u" flag
        options: [{ allowConstructorFlags: ["u"] }],
    },
    {
        text: "RegExp('\\\\u{0}*', flags)", // valid with the "u" flag
        options: [{ allowConstructorFlags: ["a"] }],
    },

    // unknown pattern
    { text: "new RegExp(pattern, 'g')" },
    { text: "new RegExp('.' + '', 'g')" },
    { text: "new RegExp(pattern, '')" },
    { text: "new RegExp(pattern)" },

    // ES2020
    { text: "new RegExp('(?<\\\\ud835\\\\udc9c>.)', 'g')" },
    { text: "new RegExp('(?<\\\\u{1d49c}>.)', 'g')" },
    { text: "new RegExp('(?<𝒜>.)', 'g');" },
    { text: "new RegExp('\\\\p{Script=Nandinagari}', 'u');" },

    // ES2022
    { text: "new RegExp('a+(?<Z>z)?', 'd')" },
    { text: "new RegExp('\\\\p{Script=Cpmn}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Cypro_Minoan}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Old_Uyghur}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Ougr}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Tangsa}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Tnsa}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Toto}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Vith}', 'u')" },
    { text: "new RegExp('\\\\p{Script=Vithkuqi}', 'u')" },

    // ES2024
    { text: "new RegExp('[A--B]', 'v')" },
    { text: "new RegExp('[A&&B]', 'v')" },
    { text: "new RegExp('[A--[0-9]]', 'v')" },
    { text: "new RegExp('[\\\\p{Basic_Emoji}--\\\\q{a|bc|def}]', 'v')" },
    { text: "new RegExp('[A--B]', flags)" }, // valid only with `v` flag
    { text: "new RegExp('[[]\\\\u{0}*', flags)" }, // valid only with `u` flag

    // ES2025
    { text: "new RegExp('((?<k>a)|(?<k>b))')" },
    { text: "new RegExp('(?ims:foo)')" },
    { text: "new RegExp('(?ims-:foo)')" },
    { text: "new RegExp('(?-ims:foo)')" },
    { text: "new RegExp('(?s-i:foo)')" },

    // allowConstructorFlags
    {
        text: "new RegExp('.', 'g')",
        options: [{ allowConstructorFlags: [] }],
    },
    {
        text: "new RegExp('.', 'g')",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'a')",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'ag')",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'ga')",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp(pattern, 'ga')",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.' + '', 'ga')",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'a')",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
    {
        text: "new RegExp('.', 'z')",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
    {
        text: "new RegExp('.', 'az')",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
    {
        text: "new RegExp('.', 'za')",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
    {
        text: "new RegExp('.', 'agz')",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
];
const invalid = [
    {
        text: "RegExp('[');",
    },
    {
        text: "RegExp('.', 'z');",
    },
    {
        text: "RegExp('.', 'a');",
        options: [{}],
    },
    {
        text: "new RegExp('.', 'a');",
        options: [{ allowConstructorFlags: [] }],
    },
    {
        text: "new RegExp('.', 'z');",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "RegExp('.', 'a');",
        options: [{ allowConstructorFlags: ["A"] }],
    },
    {
        text: "RegExp('.', 'A');",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'az');",
        options: [{ allowConstructorFlags: ["z"] }],
    },
    {
        text: "new RegExp('.', 'aa');",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'aA');",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'aaz');",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
    {
        text: "new RegExp('.', 'azz');",
        options: [{ allowConstructorFlags: ["a", "z"] }],
    },
    {
        text: "new RegExp('.', 'aga');",
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: "new RegExp('.', 'uu');",
        options: [{ allowConstructorFlags: ["u"] }],
    },
    {
        text: "new RegExp('.', 'ouo');",
        options: [{ allowConstructorFlags: ["u"] }],
    },
    {
        text: "new RegExp(')');",
    },
    {
        text: String.raw`new RegExp('\\a', 'u');`,
    },
    {
        text: String.raw`new RegExp('\\a', 'u');`,
        options: [{ allowConstructorFlags: ["u"] }],
    },
    {
        text: String.raw`RegExp('\\u{0}*');`,
    },
    {
        text: String.raw`new RegExp('\\u{0}*');`,
    },
    {
        text: String.raw`new RegExp('\\u{0}*', '');`,
    },
    {
        text: String.raw`new RegExp('\\u{0}*', 'a');`,
        options: [{ allowConstructorFlags: ["a"] }],
    },
    {
        text: String.raw`RegExp('\\u{0}*');`,
        options: [{ allowConstructorFlags: ["a"] }],
    },

    // https://github.com/eslint/eslint/issues/10861
    {
        text: String.raw`new RegExp('\\');`,
    },

    // https://github.com/eslint/eslint/issues/16573
    {
        text: "RegExp(')' + '', 'a');",
    },
    {
        text: "new RegExp('.' + '', 'az');",
        options: [{ allowConstructorFlags: ["z"] }],
    },
    {
        text: "new RegExp(pattern, 'az');",
        options: [{ allowConstructorFlags: ["a"] }],
    },

    // ES2024
    {
        text: "new RegExp('[[]', 'v');",
    },
    {
        text: "new RegExp('.', 'uv');",
    },
    {
        text: "new RegExp(pattern, 'uv');",
    },
    {
        text: "new RegExp('[A--B]' /* valid only with `v` flag */, 'u')",
    },
    {
        text: "new RegExp('[[]\\\\u{0}*' /* valid only with `u` flag */, 'v')",
    },

    // ES2025
    {
        text: "new RegExp('(?<k>a)(?<k>b)')",
    },
    {
        text: "new RegExp('(?ii:foo)')",
    },
    {
        text: "new RegExp('(?-ii:foo)')",
    },
    {
        text: "new RegExp('(?i-i:foo)')",
    },
    {
        text: "new RegExp('(?-:foo)')",
    },
    {
        text: "new RegExp('(?g:foo)')",
    },
    {
        text: "new RegExp('(?-u:foo)')",
    },
];

describe("no-invalid-regexp", ({ describe }) => {

    const globalRules = { "no-invalid-regexp": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-invalid-regexp"] = rules["no-invalid-regexp"].concat(options);
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
                    rules["no-invalid-regexp"] = rules["no-invalid-regexp"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-invalid-regexp", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
