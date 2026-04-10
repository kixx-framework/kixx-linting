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
    { text: "(x || y).aFunction()" },
    { text: "[a, b, c].forEach(doSomething)" },
    { text: "var a = b;\n(x || y).doSomething()" },
    { text: "var a = b\n;(x || y).doSomething()" },
    { text: "var a = b\nvoid (x || y).doSomething()" },
    { text: "var a = b;\n[1, 2, 3].forEach(console.log)" },
    { text: "var a = b\nvoid [1, 2, 3].forEach(console.log)" },
    { text: '"abc\\\n(123)"' },
    { text: "var a = (\n(123)\n)" },
    { text: "f(\n(x)\n)" },
    { text: "(\nfunction () {}\n)[1]" },
    {
        code: "let x = function() {};\n   `hello`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "let x = function() {}\nx `hello`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        // eslint-disable-next-line no-template-curly-in-string
        code: "String.raw `Hi\n${2+3}!`;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "x\n.y\nz `Valid Test Case`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "f(x\n)`Valid Test Case`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "x.\ny `Valid Test Case`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "(x\n)`Valid Test Case`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            foo
            / bar /2
        `,
    },
    {
        text: `
            foo
            / bar / mgy
        `,
    },
    {
        text: `
            foo
            / bar /
            gym
        `,
    },
    {
        text: `
            foo
            / bar
            / ygm
        `,
    },
    {
        text: `
            foo
            / bar /GYM
        `,
    },
    {
        text: `
            foo
            / bar / baz
        `,
    },
    { text: "foo /bar/g" },
    {
        text: `
            foo
            /denominator/
            2
        `,
    },
    {
        text: `
            foo
            / /abc/
        `,
    },
    {
        text: `
            5 / (5
            / 5)
        `,
    },

    // Optional chaining
    {
        code: "var a = b\n  ?.(x || y).doSomething()",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: "var a = b\n  ?.[a, b, c].forEach(doSomething)",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: "var a = b?.\n  (x || y).doSomething()",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: "var a = b?.\n  [a, b, c].forEach(doSomething)",
        languageOptions: { ecmaVersion: 2020 },
    },

    // Class fields
    {
        code: "class C { field1\n[field2]; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        code: "class C { field1\n*gen() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        // ArrowFunctionExpression doesn't connect to computed properties.
        code: "class C { field1 = () => {}\n[field2]; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        // ArrowFunctionExpression doesn't connect to binary operators.
        code: "class C { field1 = () => {}\n*gen() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
];

const invalid = [
    {
        code: "var a = b\n(x || y).doSomething()",
    },
    {
        code: "var a = (a || b)\n(x || y).doSomething()",
    },
    {
        code: "var a = (a || b)\n(x).doSomething()",
    },
    {
        code: "var a = b\n[a, b, c].forEach(doSomething)",
    },
    {
        code: "var a = b\n    (x || y).doSomething()",
    },
    {
        code: "var a = b\n  [a, b, c].forEach(doSomething)",
    },
    {
        code: "let x = function() {}\n `hello`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "let x = function() {}\nx\n`hello`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: "x\n.y\nz\n`Invalid Test Case`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        code: `
                foo
                / bar /gym
            `,
    },
    {
        code: `
                foo
                / bar /g
            `,
    },
    {
        code: `
                foo
                / bar /g.test(baz)
            `,
    },
    {
        code: `
                foo
                /bar/gimuygimuygimuy.test(baz)
            `,
    },
    {
        code: `
                foo
                /bar/s.test(baz)
            `,
    },

    // Class fields
    {
        code: "class C { field1 = obj\n[field2]; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        code: "class C { field1 = function() {}\n[field2]; }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // "class C { field1 = obj\n*gen() {} }" is syntax error: Unexpected token '{'
];

describe("no-unexpected-multiline", ({ describe }) => {

    const globalRules = { "no-unexpected-multiline": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unexpected-multiline"] = rules["no-unexpected-multiline"].concat(options);
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
                    rules["no-unexpected-multiline"] = rules["no-unexpected-multiline"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-unexpected-multiline", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
