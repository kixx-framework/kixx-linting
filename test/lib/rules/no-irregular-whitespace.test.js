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
    { text: "var a = 1;" },

    // Escaped sequences in string literals are fine.
    { text: "'\\u000B';" },
    { text: "'\\u00A0';" },
    { text: "'\\u1680';" },
    { text: "'\\u2028';" },

    // By default this rule skips strings.
    { text: "var any = '\u3000';" },

    // Option-based skips.
    { text: "// \u2000", options: [{ skipComments: true }] },
    { text: "/* \u2000 */", options: [{ skipComments: true }] },
    { text: "var any = /\u3000/;", options: [{ skipRegExps: true }] },
    { text: "var any = `\u3000`;", options: [{ skipTemplates: true }] },

    // Leading BOM should be ignored.
    { text: "\uFEFFconsole.log('hello BOM');" },
];

const invalid = [
    { text: "var any \u000B = 'thing';" },
    { text: "var any \u00A0 = 'thing';" },
    { text: "var any \u1680 = 'thing';" },
    { text: "var any \u2000 = 'thing';" },
    { text: "var any \u3000 = 'thing';" },

    { text: "// \u2000" },
    { text: "/* \u2000 */" },
    { text: "var any = /\u3000/;" },

    { text: "var any = '\u3000';", options: [{ skipStrings: false }] },
    { text: "var any = `\u3000`;" },
    { text: "var any = `\u3000`;", options: [{ skipTemplates: false }] },

    { text: "var a\u00A0=1;\nvar b\u2000=2;", errors: 2 },
    { text: "a\u2028b\u2029c", errors: 2 },
];

describe("no-irregular-whitespace", ({ describe }) => {

    const globalRules = { "no-irregular-whitespace": ["error"] };
    const normalizeLanguageOptions = (languageOptions) => ({
        ecmaVersion: 2024,
        sourceType: "script",
        ...(languageOptions || {}),
    });

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-irregular-whitespace"] = rules["no-irregular-whitespace"].concat(options);
                }

                const res = lintText(file, rules, normalizeLanguageOptions(languageOptions));

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
                    rules["no-irregular-whitespace"] = rules["no-irregular-whitespace"].concat(options);
                }

                const res = lintText(file, rules, normalizeLanguageOptions(languageOptions));

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-irregular-whitespace", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
