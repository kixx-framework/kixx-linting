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
    { text: "var x = NaN;" },
    { text: "isNaN(NaN) === true;" },
    { text: "isNaN(123) !== true;" },
    { text: "Number.isNaN(NaN) === true;" },
    { text: "Number.isNaN(123) !== true;" },
    { text: "foo(NaN + 1);" },
    { text: "foo(1 + NaN);" },
    { text: "foo(NaN - 1)" },
    { text: "foo(1 - NaN)" },
    { text: "foo(NaN * 2)" },
    { text: "foo(2 * NaN)" },
    { text: "foo(NaN / 2)" },
    { text: "foo(2 / NaN)" },
    { text: "var x; if (x = NaN) { }" },
    { text: "var x = Number.NaN;" },
    { text: "isNaN(Number.NaN) === true;" },
    { text: "Number.isNaN(Number.NaN) === true;" },
    { text: "foo(Number.NaN + 1);" },
    { text: "foo(1 + Number.NaN);" },
    { text: "foo(Number.NaN - 1)" },
    { text: "foo(1 - Number.NaN)" },
    { text: "foo(Number.NaN * 2)" },
    { text: "foo(2 * Number.NaN)" },
    { text: "foo(Number.NaN / 2)" },
    { text: "foo(2 / Number.NaN)" },
    { text: "var x; if (x = Number.NaN) { }" },
    { text: "x === Number[NaN];" },
    { text: "x === (NaN, 1)" },
    { text: "x === (doStuff(), NaN, 1)" },
    { text: "x === (doStuff(), Number.NaN, 1)" },

    //------------------------------------------------------------------------------
    // enforceForIndexOf
    //------------------------------------------------------------------------------

    { text: "foo.indexOf(NaN)" },
    { text: "foo.lastIndexOf(NaN)" },
    { text: "foo.indexOf(Number.NaN)" },
    { text: "foo.lastIndexOf(Number.NaN)" },
    {
        text: "foo.indexOf(NaN)",
        options: [{}],
    },
    {
        text: "foo.lastIndexOf(NaN)",
        options: [{}],
    },
    {
        text: "foo.indexOf(NaN)",
        options: [{ enforceForIndexOf: false }],
    },
    {
        text: "foo.lastIndexOf(NaN)",
        options: [{ enforceForIndexOf: false }],
    },
    {
        text: "indexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "lastIndexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "new foo.indexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.bar(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.IndexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo[indexOf](NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo[lastIndexOf](NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "indexOf.foo(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf()",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf()",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(a)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(Nan)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(a, NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(NaN, b, c)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(a, b)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(NaN, NaN, b)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(...NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "foo.lastIndexOf(NaN())",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(Number.NaN)",
        options: [{}],
    },
    {
        text: "foo.lastIndexOf(Number.NaN)",
        options: [{}],
    },
    {
        text: "foo.indexOf(Number.NaN)",
        options: [{ enforceForIndexOf: false }],
    },
    {
        text: "foo.lastIndexOf(Number.NaN)",
        options: [{ enforceForIndexOf: false }],
    },
    {
        text: "indexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "lastIndexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "new foo.indexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.bar(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.IndexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo[indexOf](Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo[lastIndexOf](Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "indexOf.foo(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(Number.Nan)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(a, Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(Number.NaN, b, c)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(Number.NaN, NaN, b)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf(...Number.NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "foo.lastIndexOf(Number.NaN())",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf((NaN, 1))",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf((NaN, 1))",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf((Number.NaN, 1))",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf((Number.NaN, 1))",
        options: [{ enforceForIndexOf: true }],
    },
];

const invalid = [
    {
        text: "123 == NaN;",
    },
    {
        text: "123 === NaN;",
    },
    {
        text: 'NaN === "abc";',
    },
    {
        text: 'NaN == "abc";',
    },
    {
        text: "123 != NaN;",
    },
    {
        text: "123 !== NaN;",
    },
    {
        text: 'NaN !== "abc";',
    },
    {
        text: 'NaN != "abc";',
    },
    {
        text: 'NaN < "abc";',
    },
    {
        text: '"abc" < NaN;',
    },
    {
        text: 'NaN > "abc";',
    },
    {
        text: '"abc" > NaN;',
    },
    {
        text: 'NaN <= "abc";',
    },
    {
        text: '"abc" <= NaN;',
    },
    {
        text: 'NaN >= "abc";',
    },
    {
        text: '"abc" >= NaN;',
    },
    {
        text: "123 == Number.NaN;",
    },
    {
        text: "123 === Number.NaN;",
    },
    {
        text: 'Number.NaN === "abc";',
    },
    {
        text: 'Number.NaN == "abc";',
    },
    {
        text: "123 != Number.NaN;",
    },
    {
        text: "123 !== Number.NaN;",
    },
    {
        text: 'Number.NaN !== "abc";',
    },
    {
        text: 'Number.NaN != "abc";',
    },
    {
        text: 'Number.NaN < "abc";',
    },
    {
        text: '"abc" < Number.NaN;',
    },
    {
        text: 'Number.NaN > "abc";',
    },
    {
        text: '"abc" > Number.NaN;',
    },
    {
        text: 'Number.NaN <= "abc";',
    },
    {
        text: '"abc" <= Number.NaN;',
    },
    {
        text: 'Number.NaN >= "abc";',
    },
    {
        text: '"abc" >= Number.NaN;',
    },
    {
        text: "x === Number?.NaN;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "x !== Number?.NaN;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "x === Number['NaN'];",
    },
    {
        text: `/* just
                adding */ x /* some */ === /* comments */ NaN; // here`,
    },
    {
        text: "(1, 2) === NaN;",
    },
    {
        text: "x === (doStuff(), NaN);",
    },
    {
        text: "x === (doStuff(), Number.NaN);",
    },
    {
        text: "x == (doStuff(), NaN);",
    },
    {
        text: "x == (doStuff(), Number.NaN);",
    },

    //------------------------------------------------------------------------------
    // enforceForIndexOf
    //------------------------------------------------------------------------------

    {
        text: "foo.indexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo['indexOf'](NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo[`indexOf`](NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo['lastIndexOf'](NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo().indexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.bar.lastIndexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf?.(NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo?.indexOf(NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(foo?.indexOf)(NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.lastIndexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo['indexOf'](Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo['lastIndexOf'](Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo().indexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.bar.lastIndexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
    },
    {
        text: "foo.indexOf?.(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo?.indexOf(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(foo?.indexOf)(Number.NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf((1, NaN))",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf((1, Number.NaN))",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.lastIndexOf((1, NaN))",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.lastIndexOf((1, Number.NaN))",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf(NaN, 1)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.lastIndexOf(NaN, 1)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf(NaN, b)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.lastIndexOf(NaN, b)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf(Number.NaN, b)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.lastIndexOf(Number.NaN, b)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.lastIndexOf(NaN, NaN)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.indexOf((1, NaN), 1)",
        options: [{ enforceForIndexOf: true }],
        languageOptions: { ecmaVersion: 2020 },
    },
];

describe("use-isnan", ({ describe }) => {

    const globalRules = { "use-isnan": ["error"] };
    const defaultLanguageOptions = { sourceType: "script" };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["use-isnan"] = rules["use-isnan"].concat(options);
                }

                const res = lintText(file, rules, { ...defaultLanguageOptions, ...languageOptions });

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
                    rules["use-isnan"] = rules["use-isnan"].concat(options);
                }

                const res = lintText(file, rules, { ...defaultLanguageOptions, ...languageOptions });

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("use-isnan", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
