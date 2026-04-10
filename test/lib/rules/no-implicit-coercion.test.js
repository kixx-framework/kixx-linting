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
    { text: "Boolean(foo)" },
    { text: "foo.indexOf(1) !== -1" },
    { text: "Number(foo)" },
    { text: "parseInt(foo)" },
    { text: "parseFloat(foo)" },
    { text: "String(foo)" },
    { text: "!foo" },
    { text: "~foo" },
    { text: "-foo" },
    { text: "+1234" },
    { text: "-1234" },
    { text: "- -1234" },
    { text: "+Number(lol)" },
    { text: "-parseFloat(lol)" },
    { text: "2 * foo" },
    { text: "1 * 1234" },
    { text: "123 - 0" },
    { text: "1 * Number(foo)" },
    { text: "1 * parseInt(foo)" },
    { text: "1 * parseFloat(foo)" },
    { text: "Number(foo) * 1" },
    { text: "Number(foo) - 0" },
    { text: "parseInt(foo) * 1" },
    { text: "parseFloat(foo) * 1" },
    { text: "- -Number(foo)" },
    { text: "1 * 1234 * 678 * Number(foo)" },
    { text: "1 * 1234 * 678 * parseInt(foo)" },
    { text: "(1 - 0) * parseInt(foo)" },
    { text: "1234 * 1 * 678 * Number(foo)" },
    { text: "1234 * 1 * Number(foo) * Number(bar)" },
    { text: "1234 * 1 * Number(foo) * parseInt(bar)" },
    { text: "1234 * 1 * Number(foo) * parseFloat(bar)" },
    { text: "1234 * 1 * parseInt(foo) * parseFloat(bar)" },
    { text: "1234 * 1 * parseInt(foo) * Number(bar)" },
    { text: "1234 * 1 * parseFloat(foo) * Number(bar)" },
    { text: "1234 * Number(foo) * 1 * Number(bar)" },
    { text: "1234 * parseInt(foo) * 1 * Number(bar)" },
    { text: "1234 * parseFloat(foo) * 1 * parseInt(bar)" },
    { text: "1234 * parseFloat(foo) * 1 * Number(bar)" },
    { text: "(- -1234) * (parseFloat(foo) - 0) * (Number(bar) - 0)" },
    { text: "1234*foo*1" },
    { text: "1234*1*foo" },
    { text: "1234*bar*1*foo" },
    { text: "1234*1*foo*bar" },
    { text: "1234*1*foo*Number(bar)" },
    { text: "1234*1*Number(foo)*bar" },
    { text: "1234*1*parseInt(foo)*bar" },
    { text: "0 + foo" },
    { text: "~foo.bar()" },
    { text: "foo + 'bar'" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "foo + `${bar}`", /* languageOptions: { ecmaVersion: 6 } */ },

    { text: "!!foo", options: [{ boolean: false }] },
    { text: "~foo.indexOf(1)", options: [{ boolean: false }] },
    { text: "+foo", options: [{ number: false }] },
    { text: "-(-foo)", options: [{ number: false }] },
    { text: "foo - 0", options: [{ number: false }] },
    { text: "1*foo", options: [{ number: false }] },
    { text: '""+foo', options: [{ string: false }] },
    { text: 'foo += ""', options: [{ string: false }] },
    { text: "var a = !!foo", options: [{ boolean: true, allow: ["!!"] }] },
    {
        text: "var a = ~foo.indexOf(1)",
        options: [{ boolean: true, allow: ["~"] }],
    },
    { text: "var a = ~foo", options: [{ boolean: true }] },
    { text: "var a = 1 * foo", options: [{ boolean: true, allow: ["*"] }] },
    { text: "- -foo", options: [{ number: true, allow: ["- -"] }] },
    { text: "foo - 0", options: [{ number: true, allow: ["-"] }] },
    { text: "var a = +foo", options: [{ boolean: true, allow: ["+"] }] },
    {
        text: 'var a = "" + foo',
        options: [{ boolean: true, string: true, allow: ["+"] }],
    },

    // https://github.com/eslint/eslint/issues/7057
    { text: "'' + 'foo'" },
    { text: "`` + 'foo'", /* languageOptions: { ecmaVersion: 6 } */ },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "'' + `${foo}`", /* languageOptions: { ecmaVersion: 6 } */ },
    { text: "'foo' + ''" },
    { text: "'foo' + ``", /* languageOptions: { ecmaVersion: 6 } */ },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "`${foo}` + ''", /* languageOptions: { ecmaVersion: 6 } */ },
    { text: "foo += 'bar'" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "foo += `${bar}`", /* languageOptions: { ecmaVersion: 6 } */ },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "`${foo}`", /* languageOptions: { ecmaVersion: 6 } */ },
    {
        // eslint-disable-next-line no-template-curly-in-string
        text: "`${foo}`",
        options: [{}],
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    "+42",

    // https://github.com/eslint/eslint/issues/14623
    { text: "'' + String(foo)" },
    { text: "String(foo) + ''" },
    { text: "`` + String(foo)", /* languageOptions: { ecmaVersion: 6 } */ },
    { text: "String(foo) + ``", /* languageOptions: { ecmaVersion: 6 } */ },

    // https://github.com/eslint/eslint/issues/16373
    { text: "console.log(Math.PI * 1/4)" },
    { text: "a * 1 / 2" },
    { text: "a * 1 / b" },
];
const invalid = [
    {
        text: "!!foo",
    },
    {
        text: "!!(foo + bar)",
    },
    {
        text: "!!(foo + bar); var Boolean = null",
    },
    {
        text: "!!(foo + bar)",
        languageOptions: {
            globals: {
                Boolean: "off",
            },
        },
    },
    {
        text: "~foo.indexOf(1)",
    },
    {
        text: "~foo.bar.indexOf(2)",
    },
    {
        text: "+foo",
    },
    {
        text: "-(-foo)",
    },
    {
        text: "+foo.bar",
    },
    {
        text: "1*foo",
    },
    {
        text: "foo*1",
    },
    {
        text: "1*foo.bar",
    },
    {
        text: "foo.bar-0",
    },
    {
        text: '""+foo',
    },
    {
        text: "``+foo",
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    {
        text: 'foo+""',
    },
    {
        text: "foo+``",
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    {
        text: '""+foo.bar',
    },
    {
        text: "``+foo.bar",
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    {
        text: 'foo.bar+""',
    },
    {
        text: "foo.bar+``",
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    {
        text: 'foo += ""',
    },
    {
        text: "foo += ``",
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    {
        text: "var a = !!foo",
        options: [{ boolean: true, allow: ["~"] }],
    },
    {
        text: "var a = ~foo.indexOf(1)",
        options: [{ boolean: true, allow: ["!!"] }],
    },
    {
        text: "var a = 1 * foo",
        options: [{ boolean: true, allow: ["+"] }],
    },
    {
        text: "var a = +foo",
        options: [{ boolean: true, allow: ["*"] }],
    },
    {
        text: 'var a = "" + foo',
        options: [{ boolean: true, allow: ["*"] }],
    },
    {
        text: "var a = `` + foo",
        options: [{ boolean: true, allow: ["*"] }],
        /* languageOptions: { ecmaVersion: 6 }, */
    },
    {
        text: "typeof+foo",
    },
    {
        text: "typeof +foo",
    },
    {
        text: "let x ='' + 1n;",
        /* languageOptions: { ecmaVersion: 2020 }, */
    },

    // Optional chaining
    {
        text: "~foo?.indexOf(1)",
        /* languageOptions: { ecmaVersion: 2020 }, */
    },
    {
        text: "~(foo?.indexOf)(1)",
        /* languageOptions: { ecmaVersion: 2020 }, */
    },

    // https://github.com/eslint/eslint/issues/16373 regression tests
    {
        text: "1 * a / 2",
    },
    {
        text: "(a * 1) / 2",
    },
    {
        text: "a * 1 / (b * 1)",
        errors: 2,
    },
    {
        text: "a * 1 + 2",
    },
];

describe("no-implicit-coercion", ({ describe }) => {

    const globalRules = { "no-implicit-coercion": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach((item, i) => {
                if (typeof item === "string") return; // bare string entries like "+42"
                const { text, options } = item;

                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-implicit-coercion"] = rules["no-implicit-coercion"].concat(options);
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
                    rules["no-implicit-coercion"] = rules["no-implicit-coercion"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-implicit-coercion", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
