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
    { text: "A: break A;" },
    { text: "A: { foo(); break A; bar(); }" },
    { text: "A: if (a) { foo(); if (b) break A; bar(); }" },
    { text: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) break A; bar(); }" },
    { text: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue A; bar(); }" },
    { text: "A: { B: break B; C: for (var i = 0; i < 10; ++i) { foo(); if (a) break A; if (c) continue C; bar(); } }" },
    { text: "A: { var A = 0; console.log(A); break A; console.log(A); }" },
];

const invalid = [
    {
        text: "A: var foo = 0;",
    },
    {
        text: "A: { foo(); bar(); }",
    },
    {
        text: "A: if (a) { foo(); bar(); }",
    },
    {
        text: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) break; bar(); }",
    },
    {
        text: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue; bar(); }",
    },
    {
        text: "A: for (var i = 0; i < 10; ++i) { B: break A; }",
    },
    {
        text: "A: { var A = 0; console.log(A); }",
    },
    {
        text: "A: /* comment */ foo",
    },
    {
        text: "A /* comment */: foo",
    },

    // https://github.com/eslint/eslint/issues/16988
    {
        text: 'A: "use strict"',
    },
    {
        text: '"use strict"; foo: "bar"',
    },
    {
        text: 'A: ("use strict")', // Parentheses may be removed by another rule.
    },
    {
        text: "A: `use strict`", // `use strict` may be changed to "use strict" by another rule.
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "if (foo) { bar: 'baz' }",
    },
    {
        text: "A: B: 'foo'",
    },
    {
        text: "A: B: C: 'foo'",
    },
    {
        text: "A: B: C: D: 'foo'",
    },
    {
        text: "A: B: C: D: E: 'foo'",
    },
    {
        text: "A: 42",
    },

    /*
		 * Below is fatal errors.
		 * "A: break B",
		 * "A: function foo() { break A; }",
		 * "A: class Foo { foo() { break A; } }",
		 * "A: { A: { break A; } }"
		 */
];

describe("no-unused-labels", ({ describe }) => {

    const globalRules = { "no-unused-labels": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unused-labels"] = rules["no-unused-labels"].concat(options);
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
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unused-labels"] = rules["no-unused-labels"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-unused-labels", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
