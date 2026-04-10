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
    { text: "var foo = { __proto__: 1, two: 2};" },
    { text: "var x = { foo: 1, bar: 2 };" },
    { text: "var x = { '': 1, bar: 2 };" },
    { text: "var x = { '': 1, ' ': 2 };" },
    {
        text: "var x = { '': 1, [null]: 2 };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { '': 1, [a]: 2 };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { [a]: 1, [a]: 2 };", // languageOptions: { ecmaVersion: 6 }
    },
    { text: "+{ get a() { }, set a(b) { } };" },
    {
        text: "var x = { a: b, [a]: b };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { a: b, ...c }", // languageOptions: { ecmaVersion: 2018 }
    },
    {
        text: "var x = { get a() {}, set a (value) {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { a: 1, b: { a: 2 } };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = ({ null: 1, [/(?<zero>0)/]: 2 })", // languageOptions: { ecmaVersion: 2018 }
    },
    { text: "var {a, a} = obj" }, // languageOptions: { ecmaVersion: 6 }
    // { text: "var x = { 012: 1, 12: 2 };" }, // Legacy octal literal is rejected by the repo's module-mode parser.
    {
        text: "var x = { 1_0: 1, 1: 2 };", // languageOptions: { ecmaVersion: 2021 }
    },
    {
        text: "var x = { __proto__: null, ['__proto__']: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { ['__proto__']: null, __proto__: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { '__proto__': null, ['__proto__']: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { ['__proto__']: null, '__proto__': null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__: null, __proto__ };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__, __proto__: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__: null, __proto__() {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__() {}, __proto__: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__: null, get __proto__() {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { get __proto__() {}, __proto__: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__: null, set __proto__(value) {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { set __proto__(value) {}, __proto__: null };", // languageOptions: { ecmaVersion: 6 }
    },
];
const invalid = [
    {
        text: "var x = { a: b, ['a']: b };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { y: 1, y: 2 };",
    },
    {
        text: "var x = { '': 1, '': 2 };",
    },
    {
        text: "var x = { '': 1, [``]: 2 };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var foo = { 0x1: 1, 1: 2};",
    },
    // {
    //     text: "var x = { 012: 1, 10: 2 };",
    // }, // Legacy octal literal is rejected by the repo's module-mode parser.
    {
        text: "var x = { 0b1: 1, 1: 2 };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { 0o1: 1, 1: 2 };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { 1n: 1, 1: 2 };", // languageOptions: { ecmaVersion: 2020 }
    },
    {
        text: "var x = { 1_0: 1, 10: 2 };", // languageOptions: { ecmaVersion: 2021 }
    },
    {
        text: 'var x = { "z": 1, z: 2 };',
    },
    {
        text: "var foo = {\n  bar: 1,\n  bar: 1,\n}",
    },
    {
        text: "var x = { a: 1, get a() {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { a: 1, set a(value) {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { a: 1, b: { a: 2 }, get b() {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = ({ '/(?<zero>0)/': 1, [/(?<zero>0)/]: 2 })", // languageOptions: { ecmaVersion: 2018 }
    },
    {
        text: "var x = { ['__proto__']: null, ['__proto__']: null };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { ['__proto__']: null, __proto__ };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { ['__proto__']: null, __proto__() {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { ['__proto__']: null, get __proto__() {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { ['__proto__']: null, set __proto__(value) {} };", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "var x = { __proto__: null, a: 5, a: 6 };", // languageOptions: { ecmaVersion: 6 }
    },
];

describe("no-dupe-keys", ({ describe }) => {

    const globalRules = { "no-dupe-keys": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-dupe-keys"] = rules["no-dupe-keys"].concat(options);
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
                    rules["no-dupe-keys"] = rules["no-dupe-keys"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-dupe-keys", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
