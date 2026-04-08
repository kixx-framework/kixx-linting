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
    { text: "x.prototype.p = 0" },
    { text: "x.prototype['p'] = 0" },
    { text: "Object.p = 0" },
    { text: "Object.toString.bind = 0" },
    { text: "Object['toString'].bind = 0" },
    { text: "Object.defineProperty(x, 'p', {value: 0})" },
    { text: "Object.defineProperties(x, {p: {value: 0}})" },
    { text: "global.Object.prototype.toString = 0" },
    { text: "this.Object.prototype.toString = 0" },
    // { text: "with(Object) { prototype.p = 0; }" },
    { text: "o = Object; o.prototype.toString = 0" },
    { text: "eval('Object.prototype.toString = 0')" },
    { text: "parseFloat.prototype.x = 1" },
    {
        text: "Object.prototype.g = 0",
        options: [{ exceptions: ["Object"] }],
    },
    { text: "obj[Object.prototype] = 0" },

    // https://github.com/eslint/eslint/issues/4438
    { text: "Object.defineProperty()" },
    { text: "Object.defineProperties()" },

    // https://github.com/eslint/eslint/issues/8461
    { text: "function foo() { var Object = function() {}; Object.prototype.p = 0 }" },
    {
        text: "{ let Object = function() {}; Object.prototype.p = 0 }",
        // languageOptions: { ecmaVersion: 6 },
    },
];

const invalid = [
    {
        text: "Object.prototype.p = 0",
    },
    {
        text: "BigInt.prototype.p = 0",
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "WeakRef.prototype.p = 0",
        // languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "FinalizationRegistry.prototype.p = 0",
        // languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "AggregateError.prototype.p = 0",
        // languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "Function.prototype['p'] = 0",
    },
    {
        text: "String['prototype'].p = 0",
    },
    {
        text: "Number['prototype']['p'] = 0",
    },
    {
        text: "Object.defineProperty(Array.prototype, 'p', {value: 0})",
    },
    {
        text: "Object.defineProperties(Array.prototype, {p: {value: 0}})",
    },
    {
        text: "Object.defineProperties(Array.prototype, {p: {value: 0}, q: {value: 0}})",
    },
    {
        text: "Number['prototype']['p'] = 0",
        options: [{ exceptions: ["Object"] }],
    },
    {
        text: "Object.prototype.p = 0; Object.prototype.q = 0",
        errors: 2,
    },
    {
        text: "function foo() { Object.prototype.p = 0 }",
    },

    // Optional chaining
    {
        text: "(Object?.prototype).p = 0",
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "Object.defineProperty(Object?.prototype, 'p', { value: 0 })",
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "Object?.defineProperty(Object.prototype, 'p', { value: 0 })",
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(Object?.defineProperty)(Object.prototype, 'p', { value: 0 })",
        // languageOptions: { ecmaVersion: 2020 },
    },

    // Logical assignments
    {
        text: "Array.prototype.p &&= 0",
        // languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "Array.prototype.p ||= 0",
        // languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "Array.prototype.p ??= 0",
        // languageOptions: { ecmaVersion: 2021 },
    },
];

describe("no-extend-native", ({ describe }) => {

    const globalRules = { "no-extend-native": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-extend-native"] = rules["no-extend-native"].concat(options);
                }

                const res = lintText(file, rules);

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
            invalid.forEach(({ text, options, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-extend-native"] = rules["no-extend-native"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-extend-native", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
