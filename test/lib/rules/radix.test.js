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
    { text: 'parseInt("10", 10);' },
    { text: 'parseInt("10", 2);' },
    { text: 'parseInt("10", 36);' },
    { text: 'parseInt("10", 0x10);' },
    { text: 'parseInt("10", 1.6e1);' },
    { text: 'parseInt("10", 10.0);' },
    { text: 'parseInt("10", foo);' },
    { text: 'Number.parseInt("10", foo);' },
    { text: "parseInt" },
    { text: "Number.foo();" },
    { text: "Number[parseInt]();" },
    {
        text: "class C { #parseInt; foo() { Number.#parseInt(); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { #parseInt; foo() { Number.#parseInt(foo); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { #parseInt; foo() { Number.#parseInt(foo, 'bar'); } }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // Ignores if it's shadowed or disabled.
    { text: "var parseInt; parseInt();" },
    { text: "var Number; Number.parseInt();" },
    { text: "/* globals parseInt:off */ parseInt(foo);" },
    {
        text: "Number.parseInt(foo);",
        languageOptions: { globals: { Number: "off" } },
    },

    // Deprecated options "always" and "as-needed" should work the same as the default behavior of this rule
    {
        text: 'parseInt("10", 10);',
        options: ["always"],
    },
    {
        text: 'parseInt("10", 10);',
        options: ["as-needed"],
    },
    {
        text: 'parseInt("10", 8);',
        options: ["always"],
    },
    {
        text: 'parseInt("10", 8);',
        options: ["as-needed"],
    },
    {
        text: 'parseInt("10", foo);',
        options: ["always"],
    },
    {
        text: 'parseInt("10", foo);',
        options: ["as-needed"],
    },
];

const invalid = [
    {
        text: "parseInt();",
    },
    {
        text: 'parseInt("10");',
    },
    {
        text: 'parseInt("10",);', // Function parameter with trailing comma
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: 'parseInt((0, "10"));', // Sequence expression (no trailing comma).
    },
    {
        text: 'parseInt((0, "10"),);', // Sequence expression (with trailing comma).
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: 'parseInt("10", null);',
    },
    {
        text: 'parseInt("10", undefined);',
    },
    {
        text: 'parseInt("10", true);',
    },
    {
        text: 'parseInt("10", "foo");',
    },
    {
        text: 'parseInt("10", "123");',
    },
    {
        text: 'parseInt("10", 1);',
    },
    {
        text: 'parseInt("10", 37);',
    },
    {
        text: 'parseInt("10", 10.5);',
    },
    {
        text: "Number.parseInt();",
    },
    {
        text: 'Number.parseInt("10");',
    },
    {
        text: 'Number.parseInt("10", 1);',
    },
    {
        text: 'Number.parseInt("10", 37);',
    },
    {
        text: 'Number.parseInt("10", 10.5);',
    },

    // Optional chaining
    {
        text: 'parseInt?.("10");',
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: 'Number.parseInt?.("10");',
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: 'Number?.parseInt("10");',
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: '(Number?.parseInt)("10");',
        languageOptions: { ecmaVersion: 2020 },
    },

    // Deprecated options "always" and "as-needed" should work the same as the default behavior of this rule
    {
        text: "parseInt();",
        options: ["always"],
    },
    {
        text: "parseInt();",
        options: ["as-needed"],
    },
    {
        text: 'parseInt("10");',
        options: ["always"],
    },
    {
        text: 'parseInt("10");',
        options: ["as-needed"],
    },
    {
        text: 'parseInt("10", 1);',
        options: ["always"],
    },
    {
        text: 'parseInt("10", 1);',
        options: ["as-needed"],
    },
    {
        text: "Number.parseInt();",
        options: ["always"],
    },
    {
        text: "Number.parseInt();",
        options: ["as-needed"],
    },
];

describe("radix", ({ describe }) => {

    const globalRules = { radix: ["error"] };
    const defaultLanguageOptions = { ecmaVersion: 2022, sourceType: "script" };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules.radix = rules.radix.concat(options);
                }

                const res = lintText(file, rules, { ...defaultLanguageOptions, ...languageOptions });

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
                    rules.radix = rules.radix.concat(options);
                }

                const res = lintText(file, rules, { ...defaultLanguageOptions, ...languageOptions });

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("radix", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
