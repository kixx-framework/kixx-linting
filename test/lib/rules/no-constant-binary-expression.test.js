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
    // While this _would_ be a constant condition in React, ESLint has a policy of not attributing any specific behavior to JSX.
    // { text: "<p /> && foo" },
    // { text: "<></> && foo" },
    // { text: "<p /> ?? foo" },
    // { text: "<></> ?? foo" },
    { text: "arbitraryFunction(n) ?? foo" },
    { text: "foo.Boolean(n) ?? foo" },
    { text: "(x += 1) && foo" },
    { text: "`${bar}` && foo" },
    { text: "bar && foo" },
    { text: "delete bar.baz && foo" },
    { text: "true ? foo : bar" },
    { text: "new Foo() == true" },
    { text: "foo == true" },
    { text: "`${foo}` == true" },
    { text: "`${foo}${bar}` == true" },
    { text: "`0${foo}` == true" },
    { text: "`00000000${foo}` == true" },
    { text: "`0${foo}.000` == true" },
    { text: "[n] == true" },

    { text: "delete bar.baz === true" },

    { text: "foo.Boolean(true) && foo" },
    { text: "function Boolean(n) { return n; }; Boolean(x) ?? foo" },
    { text: "function String(n) { return n; }; String(x) ?? foo" },
    { text: "function Number(n) { return n; }; Number(x) ?? foo" },
    { text: "function Boolean(n) { return Math.random(); }; Boolean(x) === 1" },
    { text: "function Boolean(n) { return Math.random(); }; Boolean(1) == true" },

    { text: "new Foo() === x" },
    { text: "x === new someObj.Promise()" },
    { text: "Boolean(foo) === true" },
    { text: "function foo(undefined) { undefined ?? bar;}" },
    { text: "function foo(undefined) { undefined == true;}" },
    { text: "function foo(undefined) { undefined === true;}" },
    { text: "[...arr, 1] == true" },
    { text: "[,,,] == true" },
    {
        text: "new Foo() === bar;", // languageOptions: { globals: { Foo: "writable" } }
    },
    { text: "(foo && true) ?? bar" },
    { text: "foo ?? null ?? bar" },
    { text: "a ?? (doSomething(), undefined) ?? b" },
    { text: "a ?? (something = null) ?? b" },

    // Non-comparison binary expressions should not be reported by this rule.
    { text: '"a" + "b"' },
    { text: '"a" + "b" + "c"' },
    { text: "1 + 2" },
];

const invalid = [
    {
        text: "[] && greeting",
    },
    {
        text: "[] || greeting",
    },
    {
        text: "[] ?? greeting",
    },
    {
        text: "[] == true",
    },
    {
        text: "true == []",
    },
    {
        text: "[] != true",
    },
    {
        text: "[] === true",
    },
    {
        text: "[] !== true",
    },

    // Motivating examples from the original proposal https://github.com/eslint/eslint/issues/13752
    {
        text: "!foo == null",
    },
    {
        text: "!foo ?? bar",
    },
    {
        text: "(a + b) / 2 ?? bar",
    },
    {
        text: "String(foo.bar) ?? baz",
    },
    {
        text: '\"hello\" + name ?? ""',
    },
    {
        text: '[foo?.bar ?? ""] ?? []',
    },

    // Logical expression with constant truthiness
    {
        text: "true && hello",
    },
    {
        text: "true || hello",
    },
    {
        text: "true && foo",
    },
    { text: "'' && foo" },
    { text: "100 && foo" },
    {
        text: "+100 && foo",
    },
    {
        text: "-100 && foo",
    },
    {
        text: "~100 && foo",
    },
    {
        text: "/[a-z]/ && foo",
    },
    {
        text: "Boolean([]) && foo",
    },
    {
        text: "Boolean() && foo",
    },
    {
        text: "Boolean([], n) && foo",
    },
    {
        text: "({}) && foo",
    },
    { text: "[] && foo" },
    {
        text: "(() => {}) && foo",
    },
    {
        text: "(function() {}) && foo",
    },
    {
        text: "(class {}) && foo",
    },
    {
        text: "(class { valueOf() { return x; } }) && foo",
    },
    {
        text: "(class { [x]() { return x; } }) && foo",
    },
    {
        text: "new Foo() && foo",
    },

    // (boxed values are always truthy)
    {
        text: "new Boolean(unknown) && foo",
    },
    {
        text: "(bar = false) && foo",
    },
    {
        text: "(bar.baz = false) && foo",
    },
    {
        text: "(bar[0] = false) && foo",
    },
    {
        text: "`hello ${hello}` && foo",
    },
    {
        text: "void bar && foo",
    },
    {
        text: "!true && foo",
    },
    {
        text: "typeof bar && foo",
    },
    {
        text: "(bar, baz, true) && foo",
    },
    {
        text: "undefined && foo",
    },

    // Logical expression with constant nullishness
    {
        text: "({}) ?? foo",
    },
    {
        text: "([]) ?? foo",
    },
    {
        text: "(() => {}) ?? foo",
    },
    {
        text: "(function() {}) ?? foo",
    },
    {
        text: "(class {}) ?? foo",
    },
    {
        text: "new Foo() ?? foo",
    },
    { text: "1 ?? foo" },
    {
        text: "/[a-z]/ ?? foo",
    },
    {
        text: "`${''}` ?? foo",
    },
    {
        text: "(a = true) ?? foo",
    },
    {
        text: "(a += 1) ?? foo",
    },
    {
        text: "(a -= 1) ?? foo",
    },
    {
        text: "(a *= 1) ?? foo",
    },
    {
        text: "(a /= 1) ?? foo",
    },
    {
        text: "(a %= 1) ?? foo",
    },
    {
        text: "(a <<= 1) ?? foo",
    },
    {
        text: "(a >>= 1) ?? foo",
    },
    {
        text: "(a >>>= 1) ?? foo",
    },
    {
        text: "(a |= 1) ?? foo",
    },
    {
        text: "(a ^= 1) ?? foo",
    },
    {
        text: "(a &= 1) ?? foo",
    },
    {
        text: "undefined ?? foo",
    },
    {
        text: "!bar ?? foo",
    },
    {
        text: "void bar ?? foo",
    },
    {
        text: "typeof bar ?? foo",
    },
    {
        text: "+bar ?? foo",
    },
    {
        text: "-bar ?? foo",
    },
    {
        text: "~bar ?? foo",
    },
    {
        text: "++bar ?? foo",
    },
    {
        text: "bar++ ?? foo",
    },
    {
        text: "--bar ?? foo",
    },
    {
        text: "bar-- ?? foo",
    },
    {
        text: "(x == y) ?? foo",
    },
    {
        text: "(x + y) ?? foo",
    },
    {
        text: "(x / y) ?? foo",
    },
    {
        text: "(x instanceof String) ?? foo",
    },
    {
        text: "(x in y) ?? foo",
    },
    {
        text: "Boolean(x) ?? foo",
    },
    {
        text: "String(x) ?? foo",
    },
    {
        text: "Number(x) ?? foo",
    },

    // Binary expression with comparison to null
    {
        text: "({}) != null",
    },
    {
        text: "({}) == null",
    },
    {
        text: "null == ({})",
    },
    {
        text: "({}) == undefined",
    },
    {
        text: "undefined == ({})",
    },

    // Binary expression with loose comparison to boolean
    {
        text: "({}) != true",
    },
    {
        text: "({}) == true",
    },
    {
        text: "([]) == true",
    },
    {
        text: "([a, b]) == true",
    },
    {
        text: "(() => {}) == true",
    },
    {
        text: "(function() {}) == true",
    },
    {
        text: "void foo == true",
    },
    {
        text: "typeof foo == true",
    },
    {
        text: "![] == true",
    },
    {
        text: "true == class {}",
    },
    { text: "true == 1" },
    {
        text: "undefined == true",
    },
    {
        text: "true == undefined",
    },
    {
        text: "`hello` == true",
    },
    {
        text: "/[a-z]/ == true",
    },
    {
        text: "({}) == Boolean({})",
    },
    {
        text: "({}) == Boolean()",
    },
    {
        text: "({}) == Boolean(() => {}, foo)",
    },

    // Binary expression with strict comparison to boolean
    {
        text: "({}) !== true",
    },
    {
        text: "({}) == !({})",
    },
    {
        text: "({}) === true",
    },
    {
        text: "([]) === true",
    },
    {
        text: "(function() {}) === true",
    },
    {
        text: "(() => {}) === true",
    },
    {
        text: "!{} === true",
    },
    {
        text: "typeof n === true",
    },
    {
        text: "void n === true",
    },
    {
        text: "+n === true",
    },
    {
        text: "-n === true",
    },
    {
        text: "~n === true",
    },
    {
        text: "true === true",
    },
    {
        text: "1 === true",
    },
    {
        text: "'hello' === true",
    },
    {
        text: "/[a-z]/ === true",
    },
    {
        text: "undefined === true",
    },
    {
        text: "(a = {}) === true",
    },
    {
        text: "(a += 1) === true",
    },
    {
        text: "(a -= 1) === true",
    },
    {
        text: "(a *= 1) === true",
    },
    {
        text: "(a %= 1) === true",
    },
    {
        text: "(a ** b) === true",
    },
    {
        text: "(a << b) === true",
    },
    {
        text: "(a >> b) === true",
    },
    {
        text: "(a >>> b) === true",
    },
    {
        text: "--a === true",
    },
    {
        text: "a-- === true",
    },
    {
        text: "++a === true",
    },
    {
        text: "a++ === true",
    },
    {
        text: "(a + b) === true",
    },
    {
        text: "(a - b) === true",
    },
    {
        text: "(a * b) === true",
    },
    {
        text: "(a / b) === true",
    },
    {
        text: "(a % b) === true",
    },
    {
        text: "(a | b) === true",
    },
    {
        text: "(a ^ b) === true",
    },
    {
        text: "(a & b) === true",
    },
    {
        text: "Boolean(0) === Boolean(1)",
    },
    {
        text: "true === String(x)",
    },
    {
        text: "true === Number(x)",
    },
    {
        text: "Boolean(0) == !({})",
    },

    // Binary expression with strict comparison to null
    {
        text: "({}) !== null",
    },
    {
        text: "({}) === null",
    },
    {
        text: "([]) === null",
    },
    {
        text: "(() => {}) === null",
    },
    {
        text: "(function() {}) === null",
    },
    {
        text: "(class {}) === null",
    },
    {
        text: "new Foo() === null",
    },
    {
        text: "`` === null",
    },
    {
        text: "1 === null",
    },
    {
        text: "'hello' === null",
    },
    {
        text: "/[a-z]/ === null",
    },
    {
        text: "true === null",
    },
    {
        text: "null === null",
    },
    {
        text: "a++ === null",
    },
    {
        text: "++a === null",
    },
    {
        text: "--a === null",
    },
    {
        text: "a-- === null",
    },
    {
        text: "!a === null",
    },
    {
        text: "typeof a === null",
    },
    {
        text: "delete a.b === null",
    },
    {
        text: "void a === null",
    },
    {
        text: "undefined === null",
    },
    {
        text: "(x = {}) === null",
    },
    {
        text: "(x += y) === null",
    },
    {
        text: "(x -= y) === null",
    },
    {
        text: "(a, b, {}) === null",
    },

    // Binary expression with strict comparison to undefined
    {
        text: "({}) !== undefined",
    },
    {
        text: "({}) === undefined",
    },
    {
        text: "([]) === undefined",
    },
    {
        text: "(() => {}) === undefined",
    },
    {
        text: "(function() {}) === undefined",
    },
    {
        text: "(class {}) === undefined",
    },
    {
        text: "new Foo() === undefined",
    },
    {
        text: "`` === undefined",
    },
    {
        text: "1 === undefined",
    },
    {
        text: "'hello' === undefined",
    },
    {
        text: "/[a-z]/ === undefined",
    },
    {
        text: "true === undefined",
    },
    {
        text: "null === undefined",
    },
    {
        text: "a++ === undefined",
    },
    {
        text: "++a === undefined",
    },
    {
        text: "--a === undefined",
    },
    {
        text: "a-- === undefined",
    },
    {
        text: "!a === undefined",
    },
    {
        text: "typeof a === undefined",
    },
    {
        text: "delete a.b === undefined",
    },
    {
        text: "void a === undefined",
    },
    {
        text: "undefined === undefined",
    },
    {
        text: "(x = {}) === undefined",
    },
    {
        text: "(x += y) === undefined",
    },
    {
        text: "(x -= y) === undefined",
    },
    {
        text: "(a, b, {}) === undefined",
    },

    /*
     * If both sides are newly constructed objects, we can tell they will
     * never be equal, even with == equality.
     */
    { text: "[a] == [a]" },
    { text: "[a] != [a]" },
    { text: "({}) == []" },

    // Comparing to always new objects
    { text: "x === {}" },
    { text: "x !== {}" },
    { text: "x === []" },
    { text: "x === (() => {})" },
    { text: "x === (function() {})" },
    { text: "x === (class {})" },
    { text: "x === new Boolean()" },
    {
        text: "x === new Promise()", // languageOptions: { ecmaVersion: 6 }
    },
    {
        text: "x === new WeakSet()", // languageOptions: { ecmaVersion: 6 }
    },
    { text: "x === (foo, {})" },
    { text: "x === (y = {})" },
    { text: "x === (y ? {} : [])" },
    { text: "x === /[a-z]/" },

    // It's not obvious what this does, but it compares the old value of `x` to the new object.
    { text: "x === (x = {})" },

    {
        text: "window.abc && false && anything",
    },
    {
        text: "window.abc || true || anything",
    },
    {
        text: "window.abc ?? 'non-nullish' ?? anything",
    },
];

describe("no-constant-binary-expression", ({ describe }) => {

    const globalRules = { "no-constant-binary-expression": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-constant-binary-expression"] = rules["no-constant-binary-expression"].concat(options);
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
                    rules["no-constant-binary-expression"] = rules["no-constant-binary-expression"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-constant-binary-expression", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
