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
    { text: "class A { foo() {} bar() {} }" },
    { text: "class A { static foo() {} foo() {} }" },
    { text: "class A { get foo() {} set foo(value) {} }" },
    { text: "class A { static foo() {} get foo() {} set foo(value) {} }" },
    { text: "class A { foo() { } } class B { foo() { } }" },
    { text: "class A { [foo]() {} foo() {} }" },
    { text: "class A { 'foo'() {} 'bar'() {} baz() {} }" },
    { text: "class A { *'foo'() {} *'bar'() {} *baz() {} }" },
    { text: "class A { get 'foo'() {} get 'bar'() {} get baz() {} }" },
    { text: "class A { 1() {} 2() {} }" },
    { text: "class A { ['foo']() {} ['bar']() {} }" },
    { text: "class A { [`foo`]() {} [`bar`]() {} }" },
    { text: "class A { [12]() {} [123]() {} }" },
    { text: "class A { [1.0]() {} ['1.0']() {} }" },
    { text: "class A { [0x1]() {} [`0x1`]() {} }" },
    { text: "class A { [null]() {} ['']() {} }" },
    { text: "class A { get ['foo']() {} set ['foo'](value) {} }" },
    { text: "class A { ['foo']() {} static ['foo']() {} }" },

    // computed "constructor" key doesn't create constructor
    { text: "class A { ['constructor']() {} constructor() {} }" },
    { text: "class A { 'constructor'() {} [`constructor`]() {} }" },
    { text: "class A { constructor() {} get [`constructor`]() {} }" },
    { text: "class A { 'constructor'() {} set ['constructor'](value) {} }" },

    // not assumed to be statically-known values
    { text: "class A { ['foo' + '']() {} ['foo']() {} }" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "class A { [`foo${''}`]() {} [`foo`]() {} }" },
    { text: "class A { [-1]() {} ['-1']() {} }" },

    // not supported by this rule
    { text: "class A { [foo]() {} [foo]() {} }" },

    // private and public
    { text: "class A { foo; static foo; }" },
    { text: "class A { foo; #foo; }" },
    { text: "class A { '#foo'; #foo; }" },
];
const invalid = [
    {
        text: "class A { foo() {} foo() {} }",
    },
    {
        text: "!class A { foo() {} foo() {} };",
    },
    {
        text: "class A { 'foo'() {} 'foo'() {} }",
    },
    {
        text: "class A { 10() {} 1e1() {} }",
    },
    {
        text: "class A { ['foo']() {} ['foo']() {} }",
    },
    {
        text: "class A { static ['foo']() {} static foo() {} }",
    },
    {
        text: "class A { set 'foo'(value) {} set ['foo'](val) {} }",
    },
    {
        text: "class A { ''() {} ['']() {} }",
    },
    {
        text: "class A { [`foo`]() {} [`foo`]() {} }",
    },
    {
        text: "class A { static get [`foo`]() {} static get ['foo']() {} }",
    },
    {
        text: "class A { foo() {} [`foo`]() {} }",
    },
    {
        text: "class A { get [`foo`]() {} 'foo'() {} }",
    },
    {
        text: "class A { static 'foo'() {} static [`foo`]() {} }",
    },
    {
        text: "class A { ['constructor']() {} ['constructor']() {} }",
    },
    {
        text: "class A { static [`constructor`]() {} static constructor() {} }",
    },
    {
        text: "class A { static constructor() {} static 'constructor'() {} }",
    },
    {
        text: "class A { [123]() {} [123]() {} }",
    },
    {
        text: "class A { [0x10]() {} 16() {} }",
    },
    {
        text: "class A { [100]() {} [1e2]() {} }",
    },
    {
        text: "class A { [123.00]() {} [`123`]() {} }",
    },
    {
        text: "class A { static '65'() {} static [0o101]() {} }",
    },
    {
        text: "class A { [123n]() {} 123() {} }", // languageOptions: { ecmaVersion: 2020 }
    },
    {
        text: "class A { [null]() {} 'null'() {} }",
    },
    {
        text: "class A { foo() {} foo() {} foo() {} }",
        errors: 2,
    },
    {
        text: "class A { static foo() {} static foo() {} }",
    },
    {
        text: "class A { foo() {} get foo() {} }",
    },
    {
        text: "class A { set foo(value) {} foo() {} }",
    },
    {
        text: "class A { foo; foo; }",
    },

    /*
		 * This is syntax error
		 * { code: "class A { #foo; #foo; }" }
		 */
];

describe("no-dupe-class-members", ({ describe }) => {

    const globalRules = { "no-dupe-class-members": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-dupe-class-members"] = rules["no-dupe-class-members"].concat(options);
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
                    rules["no-dupe-class-members"] = rules["no-dupe-class-members"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-dupe-class-members", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
