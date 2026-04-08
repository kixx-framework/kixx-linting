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
    { text: "a && b && c && d" },
    { text: "a || b || c || d" },
    { text: "(a || b) && c && d" },
    { text: "a || (b && c && d)" },
    { text: "(a || b || c) && d" },
    { text: "a || b || (c && d)" },
    { text: "a + b + c + d" },
    { text: "a * b * c * d" },
    { text: "a == 0 && b == 1" },
    { text: "a == 0 || b == 1" },
    {
        code: "(a == 0) && (b == 1)",
        options: [{ groups: [["&&", "=="]] }],
    },
    {
        code: "a + b - c * d / e",
        options: [{ groups: [["&&", "||"]] }],
    },
    { text: "a + b - c" },
    { text: "a * b / c" },
    {
        code: "a + b - c",
        options: [{ allowSamePrecedence: true }],
    },
    {
        code: "a * b / c",
        options: [{ allowSamePrecedence: true }],
    },
    {
        code: "(a || b) ? c : d",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "a ? (b || c) : d",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "a ? b : (c || d)",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "a || (b ? c : d)",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "(a ? b : c) || d",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    { text: "a || (b ? c : d)" },
    { text: "(a || b) ? c : d" },
    { text: "a || b ? c : d" },
    { text: "a ? (b || c) : d" },
    { text: "a ? b || c : d" },
    { text: "a ? b : (c || d)" },
    { text: "a ? b : c || d" },
];

const invalid = [
    {
        code: "a && b || c",
    },
    {
        code: "a && b > 0 || c",
        options: [{ groups: [["&&", "||", ">"]] }],
    },
    {
        code: "a && b > 0 || c",
        options: [{ groups: [["&&", "||"]] }],
    },
    {
        code: "a && b + c - d / e || f",
        options: [
            {
                groups: [
                    ["&&", "||"],
                    ["+", "-", "*", "/"],
                ],
            },
        ],
    },
    {
        code: "a && b + c - d / e || f",
        options: [
            {
                groups: [
                    ["&&", "||"],
                    ["+", "-", "*", "/"],
                ],
                allowSamePrecedence: true,
            },
        ],
    },
    {
        code: "a + b - c",
        options: [{ allowSamePrecedence: false }],
    },
    {
        code: "a * b / c",
        options: [{ allowSamePrecedence: false }],
    },
    {
        code: "a || b ? c : d",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "a && b ? 1 : 2",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "x ? a && b : 0",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "x ? 0 : a && b",
        options: [{ groups: [["&&", "||", "?:"]] }],
    },
    {
        code: "a + b ?? c",
        options: [{ groups: [["+", "??"]] }],
        languageOptions: { ecmaVersion: 2020 },
    },
];

describe("no-mixed-operators", ({ describe }) => {

    const globalRules = { "no-mixed-operators": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-mixed-operators"] = rules["no-mixed-operators"].concat(options);
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
                    rules["no-mixed-operators"] = rules["no-mixed-operators"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-mixed-operators", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
