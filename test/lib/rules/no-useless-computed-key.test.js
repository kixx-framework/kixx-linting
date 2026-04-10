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
    { text: "({ 'a': 0, b(){} })" },
    { text: "({ [x]: 0 });" },
    { text: "({ a: 0, [b](){} })" },
    { text: "({ ['__proto__']: [] })" },
    { text: "var { 'a': foo } = obj" },
    { text: "var { [a]: b } = obj;" },
    { text: "var { a } = obj;" },
    { text: "var { a: a } = obj;" },
    { text: "var { a: b } = obj;" },
    {
        text: "class Foo { a() {} }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { 'a'() {} }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { [x]() {} }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { ['constructor']() {} }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { static ['prototype']() {} }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "(class { 'a'() {} })",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "(class { [x]() {} })",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "(class { ['constructor']() {} })",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "(class { static ['prototype']() {} })",
        options: [{ enforceForClassMembers: true }],
    },
    { text: "class Foo { 'x'() {} }" },
    { text: "(class { [x]() {} })" },
    { text: "class Foo { static constructor() {} }" },
    { text: "class Foo { prototype() {} }" },
    {
        text: "class Foo { ['x']() {} }",
        options: [{ enforceForClassMembers: false }],
    },
    {
        text: "(class { ['x']() {} })",
        options: [{ enforceForClassMembers: false }],
    },
    {
        text: "class Foo { static ['constructor']() {} }",
        options: [{ enforceForClassMembers: false }],
    },
    {
        text: "class Foo { ['prototype']() {} }",
        options: [{ enforceForClassMembers: false }],
    },
    {
        text: "class Foo { a }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { ['constructor'] }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { static ['constructor'] }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { static ['prototype'] }",
        options: [{ enforceForClassMembers: true }],
    },

    /*
		 * Well-known browsers throw syntax error bigint literals on property names,
		 * so, this rule doesn't touch those for now.
		 */
    {
        text: "({ [99999999999999999n]: 0 })",
        languageOptions: { ecmaVersion: 2020 },
    },
];

const invalid = [
    {
        text: "({ ['0']: 0 })",
    },
    {
        text: "var { ['0']: a } = obj",
    },
    {
        text: "({ ['0+1,234']: 0 })",
    },
    {
        text: "({ [0]: 0 })",
    },
    {
        text: "var { [0]: a } = obj",
    },
    {
        text: "({ ['x']: 0 })",
    },
    {
        text: "var { ['x']: a } = obj",
    },
    {
        text: "var { ['__proto__']: a } = obj",
    },
    {
        text: "({ ['x']() {} })",
    },
    {
        text: "({ [/* this comment prevents a fix */ 'x']: 0 })",
    },
    {
        text: "({ ['x' /* this comment also prevents a fix */]: 0 })",
    },
    {
        text: "({ [('x')]: 0 })",
    },
    {
        text: "var { [('x')]: a } = obj",
    },
    {
        text: "({ *['x']() {} })",
    },
    {
        text: "({ async ['x']() {} })",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "({ get[.2]() {} })",
    },
    {
        text: "({ set[.2](value) {} })",
    },
    {
        text: "({ async[.2]() {} })",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "({ [2]() {} })",
    },
    {
        text: "({ get [2]() {} })",
    },
    {
        text: "({ set [2](value) {} })",
    },
    {
        text: "({ async [2]() {} })",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "({ get[2]() {} })",
    },
    {
        text: "({ set[2](value) {} })",
    },
    {
        text: "({ async[2]() {} })",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "({ get['foo']() {} })",
    },
    {
        text: "({ *[2]() {} })",
    },
    {
        text: "({ async*[2]() {} })",
    },
    {
        text: "({ ['constructor']: 1 })",
    },
    {
        text: "({ ['prototype']: 1 })",
    },
    {
        text: "class Foo { ['0']() {} }",
        options: [{ enforceForClassMembers: true }],
    },
    {
        text: "class Foo { ['0+1,234']() {} }",
        options: [{}],
    },
    {
        text: "class Foo { ['x']() {} }",
        options: [{ enforceForClassMembers: void 0 }],
    },
    {
        text: "class Foo { [/* this comment prevents a fix */ 'x']() {} }",
    },
    {
        text: "class Foo { ['x' /* this comment also prevents a fix */]() {} }",
    },
    {
        text: "class Foo { [('x')]() {} }",
    },
    {
        text: "class Foo { *['x']() {} }",
    },
    {
        text: "class Foo { async ['x']() {} }",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "class Foo { get[.2]() {} }",
    },
    {
        text: "class Foo { set[.2](value) {} }",
    },
    {
        text: "class Foo { async[.2]() {} }",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "class Foo { [2]() {} }",
    },
    {
        text: "class Foo { get [2]() {} }",
    },
    {
        text: "class Foo { set [2](value) {} }",
    },
    {
        text: "class Foo { async [2]() {} }",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "class Foo { get[2]() {} }",
    },
    {
        text: "class Foo { set[2](value) {} }",
    },
    {
        text: "class Foo { async[2]() {} }",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "class Foo { get['foo']() {} }",
    },
    {
        text: "class Foo { *[2]() {} }",
    },
    {
        text: "class Foo { async*[2]() {} }",
    },
    {
        text: "class Foo { static ['constructor']() {} }",
    },
    {
        text: "class Foo { ['prototype']() {} }",
    },
    {
        text: "(class { ['x']() {} })",
    },
    {
        text: "(class { ['__proto__']() {} })",
    },
    {
        text: "(class { static ['__proto__']() {} })",
    },
    {
        text: "(class { static ['constructor']() {} })",
    },
    {
        text: "(class { ['prototype']() {} })",
    },
    {
        text: "class Foo { ['0'] }",
    },
    {
        text: "class Foo { ['0'] = 0 }",
    },
    {
        text: "class Foo { static[0] }",
    },
    {
        text: "class Foo { ['#foo'] }",
    },
    {
        text: "(class { ['__proto__'] })",
    },
    {
        text: "(class { static ['__proto__'] })",
    },
    {
        text: "(class { ['prototype'] })",
    },
];

describe("no-useless-computed-key", ({ describe }) => {

    const globalRules = { "no-useless-computed-key": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-useless-computed-key"] = rules["no-useless-computed-key"].concat(options);
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
                    rules["no-useless-computed-key"] = rules["no-useless-computed-key"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-useless-computed-key", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
