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
    { text: "Object.prototype.hasOwnProperty.call(foo, 'bar')" },
    { text: "Object.prototype.isPrototypeOf.call(foo, 'bar')" },
    { text: "Object.prototype.propertyIsEnumerable.call(foo, 'bar')" },
    { text: "Object.prototype.hasOwnProperty.apply(foo, ['bar'])" },
    { text: "Object.prototype.isPrototypeOf.apply(foo, ['bar'])" },
    { text: "Object.prototype.propertyIsEnumerable.apply(foo, ['bar'])" },
    { text: "foo.hasOwnProperty" },
    { text: "foo.hasOwnProperty.bar()" },
    { text: "foo(hasOwnProperty)" },
    { text: "hasOwnProperty(foo, 'bar')" },
    { text: "isPrototypeOf(foo, 'bar')" },
    { text: "propertyIsEnumerable(foo, 'bar')" },
    { text: "({}.hasOwnProperty.call(foo, 'bar'))" },
    { text: "({}.isPrototypeOf.call(foo, 'bar'))" },
    { text: "({}.propertyIsEnumerable.call(foo, 'bar'))" },
    { text: "({}.hasOwnProperty.apply(foo, ['bar']))" },
    { text: "({}.isPrototypeOf.apply(foo, ['bar']))" },
    { text: "({}.propertyIsEnumerable.apply(foo, ['bar']))" },
    { text: "foo[hasOwnProperty]('bar')" },
    { text: "foo['HasOwnProperty']('bar')" },
    {
        text: "foo[`isPrototypeOff`]('bar')",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "foo?.['propertyIsEnumerabl']('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    { text: "foo[1]('bar')" },
    { text: "foo[null]('bar')" },
    {
        text: "class C { #hasOwnProperty; foo() { obj.#hasOwnProperty('bar'); } }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // out of scope for this rule
    { text: "foo['hasOwn' + 'Property']('bar')" },
    {
        text: "foo[`hasOwnProperty${''}`]('bar')",
        languageOptions: { ecmaVersion: 2015 },
    },
];

const invalid = [
    {
        text: "foo.hasOwnProperty('bar')",
    },
    {
        text: "foo.isPrototypeOf('bar')",
    },
    {
        text: "foo.propertyIsEnumerable('bar')",
    },
    {
        text: "foo.bar.hasOwnProperty('bar')",
    },
    {
        text: "foo.bar.baz.isPrototypeOf('bar')",
    },
    {
        text: "foo['hasOwnProperty']('bar')",
    },
    {
        text: "foo[`isPrototypeOf`]('bar').baz",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: String.raw`foo.bar["propertyIsEnumerable"]('baz')`,
    },
    {
        // Can't suggest Object.prototype when Object is shadowed
        text: "(function(Object) {return foo.hasOwnProperty('bar');})",
    },
    {
        name: "Can't suggest Object.prototype when there is no Object global variable",
        text: "foo.hasOwnProperty('bar')",
        languageOptions: {
            globals: {
                Object: "off",
            },
        },
    },

    // Optional chaining
    {
        text: "foo?.hasOwnProperty('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo?.bar.hasOwnProperty('baz')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo.hasOwnProperty?.('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        /*
			 * If hasOwnProperty is part of a ChainExpression
			 * and the optional part is before it, then don't suggest the fix
			 */
        text: "foo?.hasOwnProperty('bar').baz",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        /*
			 * If hasOwnProperty is part of a ChainExpression
			 * but the optional part is after it, then the fix is safe
			 */
        text: "foo.hasOwnProperty('bar')?.baz",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(a,b).hasOwnProperty('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        // No suggestion where the optional call target is unsafe
        text: "(foo?.hasOwnProperty)('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(foo?.hasOwnProperty)?.('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "foo?.['hasOwnProperty']('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        // No suggestion where the optional call target is unsafe
        text: "(foo?.[`hasOwnProperty`])('bar')",
        languageOptions: { ecmaVersion: 2020 },
    },
];

describe("no-prototype-builtins", ({ describe }) => {

    const globalRules = { "no-prototype-builtins": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-prototype-builtins"] = rules["no-prototype-builtins"].concat(options);
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
                    rules["no-prototype-builtins"] = rules["no-prototype-builtins"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-prototype-builtins", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
