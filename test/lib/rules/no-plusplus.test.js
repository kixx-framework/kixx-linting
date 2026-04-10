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
    { text: "var foo = 0; foo=+1;" },

    // With "allowForLoopAfterthoughts" allowed
    {
        text: "var foo = 0; foo=+1;",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (i = 0; i < l; i++) { console.log(i); }",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (var i = 0, j = i + 1; j < example.length; i++, j++) {}",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; i--, foo());",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; foo(), --i);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; foo(), ++i, bar);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; i++, (++j, k--));",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; foo(), (bar(), i++), baz());",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; (--i, j += 2), bar = j + 1);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; a, (i--, (b, ++j, c)), d);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
];

const invalid = [
    {
        text: "var foo = 0; foo++;",
    },
    {
        text: "var foo = 0; foo--;",
    },
    {
        text: "for (i = 0; i < l; i++) { console.log(i); }",
    },
    {
        text: "for (i = 0; i < l; foo, i++) { console.log(i); }",
    },

    // With "allowForLoopAfterthoughts" allowed
    {
        text: "var foo = 0; foo++;",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (i = 0; i < l; i++) { v++; }",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (i++;;);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;--i;);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;;) ++i;",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; i = j++);",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; i++, f(--j));",
        options: [{ allowForLoopAfterthoughts: true }],
    },
    {
        text: "for (;; foo + (i++, bar));",
        options: [{ allowForLoopAfterthoughts: true }],
    },
];

describe("no-plusplus", ({ describe }) => {

    const globalRules = { "no-plusplus": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-plusplus"] = rules["no-plusplus"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

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
            invalid.forEach(({ text, code, options, languageOptions, errors = 1 }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-plusplus"] = rules["no-plusplus"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-plusplus", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
