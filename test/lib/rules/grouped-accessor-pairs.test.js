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
    // no accessors
    { text: "({})" },
    { text: "({ a })" },
    { text: "({ a(){}, b(){}, a(){} })" },
    { text: "({ a: 1, b: 2 })" },
    { text: "({ a, ...b, c: 1 })" },
    { text: "({ a, b, ...a })" },
    { text: "({ a: 1, [b]: 2, a: 3, [b]: 4 })" },
    { text: "({ a: function get(){}, b, a: function set(foo){} })" },
    { text: "({ get(){}, a, set(){} })" },
    { text: "class A {}" },
    { text: "(class { a(){} })" },
    { text: "class A { a(){} [b](){} a(){} [b](){} }" },
    { text: "(class { a(){} b(){} static a(){} static b(){} })" },
    { text: "class A { get(){} a(){} set(){} }" },

    // no accessor pairs
    { text: "({ get a(){} })" },
    { text: "({ set a(foo){} })" },
    { text: "({ a: 1, get b(){}, c, ...d })" },
    { text: "({ get a(){}, get b(){}, set c(foo){}, set d(foo){} })" },
    { text: "({ get a(){}, b: 1, set c(foo){} })" },
    { text: "({ set a(foo){}, b: 1, a: 2 })" },
    { text: "({ get a(){}, b: 1, a })" },
    { text: "({ set a(foo){}, b: 1, a(){} })" },
    { text: "({ get a(){}, b: 1, set [a](foo){} })" },
    { text: "({ set a(foo){}, b: 1, get 'a '(){} })" },
    { text: "({ get a(){}, b: 1, ...a })" },
    { text: "({ set a(foo){}, b: 1 }, { get a(){} })" },
    { text: "({ get a(){}, b: 1, ...{ set a(foo){} } })" },
    { text: "({ set a(foo){}, get b(){} })", options: ["getBeforeSet"] },
    { text: "({ get a(){}, set b(foo){} })", options: ["setBeforeGet"] },
    { text: "class A { get a(){} }" },
    { text: "(class { set a(foo){} })" },
    { text: "class A { static set a(foo){} }" },
    { text: "(class { static get a(){} })" },
    { text: "class A { a(){} set b(foo){} c(){} }" },
    { text: "(class { a(){} get b(){} c(){} })" },
    { text: "class A { get a(){} static get b(){} set c(foo){} static set d(bar){} }" },
    { text: "(class { get a(){} b(){} a(foo){} })" },
    { text: "class A { static set a(foo){} b(){} static a(){} }" },
    { text: "(class { get a(){} static b(){} set [a](foo){} })" },
    { text: "class A { static set a(foo){} b(){} static get ' a'(){} }" },
    { text: "(class { set a(foo){} b(){} static get a(){} })" },
    { text: "class A { static set a(foo){} b(){} get a(){} }" },
    { text: "(class { get a(){} }, class { b(){} set a(foo){} })" },

    // correct grouping
    { text: "({ get a(){}, set a(foo){} })" },
    { text: "({ a: 1, set b(foo){}, get b(){}, c: 2 })" },
    { text: "({ get a(){}, set a(foo){}, set b(bar){}, get b(){} })" },
    { text: "({ get [a](){}, set [a](foo){} })" },
    { text: "({ set a(foo){}, get 'a'(){} })" },
    { text: "({ a: 1, b: 2, get a(){}, set a(foo){}, c: 3, a: 4 })" },
    { text: "({ get a(){}, set a(foo){}, set b(bar){} })" },
    { text: "({ get a(){}, get b(){}, set b(bar){} })" },
    { text: "class A { get a(){} set a(foo){} }" },
    { text: "(class { set a(foo){} get a(){} })" },
    { text: "class A { static set a(foo){} static get a(){} }" },
    { text: "(class { static get a(){} static set a(foo){} })" },
    { text: "class A { a(){} set b(foo){} get b(){} c(){} get d(){} set d(bar){} }" },
    { text: "(class { set a(foo){} get a(){} get b(){} set b(bar){} })" },
    { text: "class A { static set [a](foo){} static get [a](){} }" },
    { text: "(class { get a(){} set [`a`](foo){} })" },
    { text: "class A { static get a(){} static set a(foo){} set a(bar){} static get a(){} }" },
    { text: "(class { static get a(){} get a(){} set a(foo){} })" },

    // correct order
    { text: "({ get a(){}, set a(foo){} })", options: ["anyOrder"] },
    { text: "({ set a(foo){}, get a(){} })", options: ["anyOrder"] },
    { text: "({ get a(){}, set a(foo){} })", options: ["getBeforeSet"] },
    { text: "({ set a(foo){}, get a(){} })", options: ["setBeforeGet"] },
    { text: "class A { get a(){} set a(foo){} }", options: ["anyOrder"] },
    { text: "(class { set a(foo){} get a(){} })", options: ["anyOrder"] },
    { text: "class A { get a(){} set a(foo){} }", options: ["getBeforeSet"] },
    { text: "(class { static set a(foo){} static get a(){} })", options: ["setBeforeGet"] },

    // ignores properties with duplicate getters/setters
    { text: "({ get a(){}, b: 1, get a(){} })" },
    { text: "({ set a(foo){}, b: 1, set a(foo){} })" },
    { text: "({ get a(){}, b: 1, set a(foo){}, c: 2, get a(){} })" },
    { text: "({ set a(foo){}, b: 1, set 'a'(bar){}, c: 2, get a(){} })" },
    { text: "class A { get [a](){} b(){} get [a](){} c(){} set [a](foo){} }" },
    { text: "(class { static set a(foo){} b(){} static get a(){} static c(){} static set a(bar){} })" },

    // public and private
    { text: "class A { get '#abc'(){} b(){} set #abc(foo){} }" },
    { text: "class A { get #abc(){} b(){} set '#abc'(foo){} }" },
    { text: "class A { set '#abc'(foo){} get #abc(){} }", options: ["getBeforeSet"] },
    { text: "class A { set #abc(foo){} get '#abc'(){} }", options: ["getBeforeSet"] },
];

const invalid = [
    // basic grouping tests with full messages
    { text: "({ get a(){}, b:1, set a(foo){} })" },
    { text: "({ set 'abc'(foo){}, b:1, get 'abc'(){} })" },
    { text: "({ get [a](){}, b:1, set [a](foo){} })" },
    { text: "class A { get abc(){} b(){} set abc(foo){} }" },
    { text: "(class { set abc(foo){} b(){} get abc(){} })" },
    { text: "class A { static set a(foo){} b(){} static get a(){} }" },
    { text: "(class { static get 123(){} b(){} static set 123(foo){} })" },
    { text: "class A { static get [a](){} b(){} static set [a](foo){} }" },
    { text: "class A { get '#abc'(){} b(){} set '#abc'(foo){} }" },
    { text: "class A { get #abc(){} b(){} set #abc(foo){} }" },

    // basic ordering tests with full messages
    { text: "({ set a(foo){}, get a(){} })", options: ["getBeforeSet"] },
    { text: "({ get 123(){}, set 123(foo){} })", options: ["setBeforeGet"] },
    { text: "({ get [a](){}, set [a](foo){} })", options: ["setBeforeGet"] },
    { text: "class A { set abc(foo){} get abc(){} }", options: ["getBeforeSet"] },
    { text: "(class { get [`abc`](){} set [`abc`](foo){} })", options: ["setBeforeGet"] },
    { text: "class A { static get a(){} static set a(foo){} }", options: ["setBeforeGet"] },
    { text: "(class { static set 'abc'(foo){} static get 'abc'(){} })", options: ["getBeforeSet"] },
    { text: "class A { static set [abc](foo){} static get [abc](){} }", options: ["getBeforeSet"] },
    { text: "class A { set '#abc'(foo){} get '#abc'(){} }", options: ["getBeforeSet"] },
    { text: "class A { set #abc(foo){} get #abc(){} }", options: ["getBeforeSet"] },

    // ordering option does not affect the grouping check
    { text: "({ get a(){}, b: 1, set a(foo){} })", options: ["anyOrder"] },
    { text: "({ get a(){}, b: 1, set a(foo){} })", options: ["setBeforeGet"] },
    { text: "({ get a(){}, b: 1, set a(foo){} })", options: ["getBeforeSet"] },
    { text: "class A { set a(foo){} b(){} get a(){} }", options: ["getBeforeSet"] },
    { text: "(class { static set a(foo){} b(){} static get a(){} })", options: ["setBeforeGet"] },

    // various kinds of keys
    { text: "({ get 'abc'(){}, d(){}, set 'abc'(foo){} })" },
    { text: "({ set ''(foo){}, get [''](){} })", options: ["getBeforeSet"] },
    { text: "class A { set abc(foo){} get 'abc'(){} }", options: ["getBeforeSet"] },
    { text: "(class { set [`abc`](foo){} get abc(){} })", options: ["getBeforeSet"] },
    { text: "({ set ['abc'](foo){}, get [`abc`](){} })", options: ["getBeforeSet"] },
    { text: "({ set 123(foo){}, get [123](){} })", options: ["getBeforeSet"] },
    { text: "class A { static set '123'(foo){} static get 123(){} }", options: ["getBeforeSet"] },
    { text: "(class { set [a+b](foo){} get [a+b](){} })", options: ["getBeforeSet"] },
    { text: "({ set [f(a)](foo){}, get [f(a)](){} })", options: ["getBeforeSet"] },

    // multiple invalid
    { text: "({ get a(){}, b: 1, set a(foo){}, set c(foo){}, d(){}, get c(){} })", errors: 2 },
    { text: "({ get a(){}, set b(foo){}, set a(bar){}, get b(){} })", errors: 2 },
    { text: "({ get a(){}, set [a](foo){}, set a(bar){}, get [a](){} })", errors: 2 },
    { text: "({ a(){}, set b(foo){}, ...c, get b(){}, set c(bar){}, get c(){} })", options: ["getBeforeSet"], errors: 2 },
    { text: "({ set [a](foo){}, get [a](){}, set [-a](bar){}, get [-a](){} })", options: ["getBeforeSet"], errors: 2 },
    { text: "class A { get a(){} constructor (){} set a(foo){} get b(){} static c(){} set b(bar){} }", errors: 2 },
    { text: "(class { set a(foo){} static get a(){} get a(){} static set a(bar){} })", errors: 2 },
    { text: "class A { get a(){} set a(foo){} static get b(){} static set b(bar){} }", options: ["setBeforeGet"], errors: 2 },
    { text: "(class { set [a+b](foo){} get [a-b](){} get [a+b](){} set [a-b](bar){} })", errors: 2 },

    // combinations of valid and invalid
    { text: "({ get a(){}, set a(foo){}, get b(){}, c: function(){}, set b(bar){} })" },
    { text: "({ get a(){}, get b(){}, set a(foo){} })" },
    { text: "({ set a(foo){}, get [a](){}, get a(){} })" },
    { text: "({ set [a](foo){}, set a(bar){}, get [a](){} })" },
    { text: "({ get a(){}, set a(foo){}, set b(bar){}, get b(){} })", options: ["getBeforeSet"] },
    { text: "class A { get a(){} static set b(foo){} static get b(){} set a(foo){} }" },
    { text: "(class { static get a(){} set a(foo){} static set a(bar){} })" },
    { text: "class A { set a(foo){} get a(){} static get a(){} static set a(bar){} }", options: ["setBeforeGet"] },

    // non-accessor duplicates do not affect this rule
    { text: "({ get a(){}, a: 1, set a(foo){} })" },
    { text: "({ a(){}, set a(foo){}, get a(){} })", options: ["getBeforeSet"] },
    { text: "class A { get a(){} a(){} set a(foo){} }" },
    { text: "class A { get a(){} a; set a(foo){} }" }, // languageOptions: { ecmaVersion: 2022 }

    // full location tests
    { text: "({ get a(){},\n    b: 1,\n    set a(foo){}\n})" },
    { text: "class A { static set a(foo){} b(){} static get \n a(){}\n}" },
];


describe("grouped-accessor-pairs", ({ describe }) => {

    const globalRules = { "grouped-accessor-pairs": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["grouped-accessor-pairs"] = rules["grouped-accessor-pairs"].concat(options);
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
                    rules["grouped-accessor-pairs"] = rules["grouped-accessor-pairs"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [message] = res.messages;

                assertEqual("grouped-accessor-pairs", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
