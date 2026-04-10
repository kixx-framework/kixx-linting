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
        text: "switch (a) { case 1: { let x = 1; break; } default: { let x = 2; break; } }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: { const x = 1; break; } default: { const x = 2; break; } }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: { function f() {} break; } default: { function f() {} break; } }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: { class C {} break; } default: { class C {} break; } }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: `
            switch (a) {
                case 1:
                case 2: {}
            }
        `,
    },
    {
        text: `
            switch (a) {
                case 1: var x;
            }
        `,
    },
];

const invalid = [
    {
        text: `
                switch (a) {
                    case 1:
                        {}
                        function f() {}
                        break;
                }
            `,
    },
    {
        text: `
                switch (a) {
                    case 1:
                    case 2:
                        let x;
                }
            `, // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: `
                switch (a) {
                    case 1:
                        let x;
                    case 2:
                        let y;
                }
            `,
        errors: 2, // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: `
                switch (a) {
                    case 1:
                        let x;
                    default:
                        let y;
                }
            `,
        errors: 2, // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: let x = 1; break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { default: let x = 2; break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: const x = 1; break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { default: const x = 2; break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: function f() {} break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { default: function f() {} break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { case 1: class C {} break; }", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "switch (a) { default: class C {} break; }", // languageOptions: { ecmaVersion: 6 }
    },

    // https://github.com/eslint/eslint/pull/18388#issuecomment-2075356456
    {
        text: `
                switch ("foo") {
                    case "bar":
                        function baz() { }
                        break;
                    default:
                        baz();
                }
            `, // languageOptions: { ecmaVersion: "latest" }
    },
];

describe("no-case-declarations", ({ describe }) => {

    const globalRules = { "no-case-declarations": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-case-declarations"] = rules["no-case-declarations"].concat(options);
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
                    rules["no-case-declarations"] = rules["no-case-declarations"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-case-declarations", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
