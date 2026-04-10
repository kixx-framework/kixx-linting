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
} from '../../deps.js';

import { lintText } from '../../../mod.js';


const valid = [
    // no option (default: "never")
    { text: "var foo = { bar: 'baz' }" },
    { text: "var foo = {\nbar: 'baz'\n}" },
    { text: "var foo = [ 'baz' ]" },
    { text: "var foo = [\n'baz'\n]" },
    { text: "[,,]" },
    { text: "[\n,\n,\n]" },
    { text: "[,]" },
    { text: "[\n,\n]" },
    { text: "[]" },
    { text: "[\n]" },

    // "always-multiline" special parenthesized case
    { text: "var foo = [\n      (bar ? baz : qux),\n    ];", options: ["always-multiline"] },

    // "never" option
    { text: "var foo = { bar: 'baz' }", options: ["never"] },
    { text: "var foo = {\nbar: 'baz'\n}", options: ["never"] },
    { text: "var foo = [ 'baz' ]", options: ["never"] },
    { text: "var { a, b } = foo;", options: ["never"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [ a, b ] = foo;", options: ["never"] }, // languageOptions: { ecmaVersion: 6 }

    // "only-multiline" option with destructuring
    { text: "var { a,\n b, \n} = foo;", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [ a,\n b, \n] = foo;", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6 }

    // "always" option
    { text: "[(1),]", options: ["always"] },
    { text: "var x = { foo: (1),};", options: ["always"] },
    { text: "var foo = { bar: 'baz', }", options: ["always"] },
    { text: "var foo = {\nbar: 'baz',\n}", options: ["always"] },
    { text: "var foo = {\nbar: 'baz'\n,}", options: ["always"] },
    { text: "var foo = [ 'baz', ]", options: ["always"] },
    { text: "var foo = [\n'baz',\n]", options: ["always"] },
    { text: "var foo = [\n'baz'\n,]", options: ["always"] },
    { text: "[,,]", options: ["always"] },
    { text: "[\n,\n,\n]", options: ["always"] },
    { text: "[,]", options: ["always"] },
    { text: "[\n,\n]", options: ["always"] },
    { text: "[]", options: ["always"] },
    { text: "[\n]", options: ["always"] },

    // "always-multiline" / "only-multiline" options
    { text: "var foo = { bar: 'baz' }", options: ["always-multiline"] },
    { text: "var foo = { bar: 'baz' }", options: ["only-multiline"] },
    { text: "var foo = {\nbar: 'baz',\n}", options: ["always-multiline"] },
    { text: "var foo = {\nbar: 'baz',\n}", options: ["only-multiline"] },
    { text: "var foo = [ 'baz' ]", options: ["always-multiline"] },
    { text: "var foo = [ 'baz' ]", options: ["only-multiline"] },
    { text: "var foo = [\n'baz',\n]", options: ["always-multiline"] },
    { text: "var foo = [\n'baz',\n]", options: ["only-multiline"] },
    { text: "var foo = { bar:\n\n'bar' }", options: ["always-multiline"] },
    { text: "var foo = { bar:\n\n'bar' }", options: ["only-multiline"] },
    { text: "var foo = {a: 1, b: 2, c: 3, d: 4}", options: ["always-multiline"] },
    { text: "var foo = {a: 1, b: 2, c: 3, d: 4}", options: ["only-multiline"] },
    { text: "var foo = {a: 1, b: 2,\n c: 3, d: 4}", options: ["always-multiline"] },
    { text: "var foo = {a: 1, b: 2,\n c: 3, d: 4}", options: ["only-multiline"] },
    { text: "var foo = {x: {\nfoo: 'bar',\n}}", options: ["always-multiline"] },
    { text: "var foo = {x: {\nfoo: 'bar',\n}}", options: ["only-multiline"] },
    { text: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])", options: ["always-multiline"] },
    { text: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])", options: ["only-multiline"] },

    // https://github.com/eslint/eslint/issues/3627
    { text: "var [a, ...rest] = [];", options: ["always"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [\n    a,\n    ...rest\n] = [];", options: ["always"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [\n    a,\n    ...rest\n] = [];", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [\n    a,\n    ...rest\n] = [];", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "[a, ...rest] = [];", options: ["always"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "for ([a, ...rest] of []);", options: ["always"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var a = [b, ...spread,];", options: ["always"] }, // languageOptions: { ecmaVersion: 6 }

    // https://github.com/eslint/eslint/issues/7297
    { text: "var {foo, ...bar} = baz", options: ["always"] }, // languageOptions: { ecmaVersion: 2018 }

    // https://github.com/eslint/eslint/issues/3794
    { text: "import {foo,} from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo, {abc,} from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import * as foo from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo,} from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo} from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo, {abc} from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import * as foo from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo} from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {\n  foo,\n} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {\n  foo,\n} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {\n  foo,\n} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {\n  foo,\n} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo} from \n'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo} from \n'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }

    // function params — "never" (valid with 2024 defaults since no trailing comma)
    { text: "function foo(a) {}", options: ["never"] },
    { text: "foo(a)", options: ["never"] },

    // function params — "always-multiline"/"only-multiline" where end tokens are on same line (not multiline)
    { text: "function foo(a,\nb) {}", options: ["always-multiline"] },
    { text: "foo(a,\nb)", options: ["always-multiline"] },
    { text: "function foo(a,\nb) {}", options: ["only-multiline"] },
    { text: "foo(a,\nb)", options: ["only-multiline"] },

    // ecmaVersion: 8 — trailing commas in function params/args
    { text: "function foo(a) {}", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a,) {}", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: ["always"] }, // languageOptions: { ecmaVersion: 9 }
    { text: "function foo(\na,\nb,\n) {}", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,b)", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a,b) {}", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,b)", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a,b) {}", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,b)", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 8 }

    // object-options for functions
    { text: "function foo(a) {} ", options: [{}] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: [{}] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a) {} ", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a,) {}", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function bar(a, ...b) {}", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "bar(...a,)", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a) {} ", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(\na,\nb,\n) {} ", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(\na,\n...b\n) {} ", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,\nb,\n)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,\n...b,\n)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(a) {} ", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(\na,\nb,\n) {} ", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,\nb,\n)", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(\na,\nb\n) {} ", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,\nb\n)", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
];

const invalid = [
    // no option (default: "never")
    { text: "var foo = { bar: 'baz', }" },
    { text: "var foo = {\nbar: 'baz',\n}" },
    { text: "foo({ bar: 'baz', qux: 'quux', });" },
    { text: "foo({\nbar: 'baz',\nqux: 'quux',\n});" },
    { text: "var foo = [ 'baz', ]" },
    { text: "var foo = [ 'baz',\n]" },
    { text: "var foo = { bar: 'bar'\n\n, }" },

    // "never" and "only-multiline" options
    { text: "var foo = { bar: 'baz', }", options: ["never"] },
    { text: "var foo = { bar: 'baz', }", options: ["only-multiline"] },
    { text: "var foo = {\nbar: 'baz',\n}", options: ["never"] },
    { text: "foo({ bar: 'baz', qux: 'quux', });", options: ["never"] },
    { text: "foo({ bar: 'baz', qux: 'quux', });", options: ["only-multiline"] },

    // "always" option — object/array only (no function-call wrapper; those produce 2 errors with 2024)
    { text: "var foo = { bar: 'baz' }", options: ["always"] },
    { text: "var foo = {\nbar: 'baz'\n}", options: ["always"] },
    { text: "var foo = {\nbar: 'baz'\r\n}", options: ["always"] },
    { text: "var foo = [ 'baz' ]", options: ["always"] },
    { text: "var foo = ['baz']", options: ["always"] },
    { text: "var foo = [ 'baz'\n]", options: ["always"] },
    { text: "var foo = { bar:\n\n'bar' }", options: ["always"] },

    // "always" with multi-line arrays/objects containing parenthesized expressions
    {
        text: "var foo = [\n" +
            "  bar,\n" +
            "  (\n" +
            "    baz\n" +
            "  )\n" +
            "];",
        options: ["always"],
    },
    {
        text: "var foo = {\n" +
            "  foo: 'bar',\n" +
            "  baz: (\n" +
            "    qux\n" +
            "  )\n" +
            "};",
        options: ["always"],
    },
    {
        // https://github.com/eslint/eslint/issues/7291
        text: "var foo = [\n" +
            "  (bar\n" +
            "    ? baz\n" +
            "    : qux\n" +
            "  )\n" +
            "];",
        options: ["always"],
    },

    // "always-multiline" option
    { text: "var foo = {\nbar: 'baz'\n}", options: ["always-multiline"] },
    { text: "var foo = { bar: 'baz', }", options: ["always-multiline"] },
    { text: "foo({\nbar: 'baz',\nqux: 'quux'\n});", options: ["always-multiline"] },
    { text: "foo({ bar: 'baz', qux: 'quux', });", options: ["always-multiline"] },
    { text: "var foo = [\n'baz'\n]", options: ["always-multiline"] },
    { text: "var foo = ['baz',]", options: ["always-multiline"] },
    { text: "var foo = ['baz',]", options: ["only-multiline"] },
    { text: "var foo = {x: {\nfoo: 'bar',\n},}", options: ["always-multiline"] },
    { text: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}", options: ["always-multiline"] },
    { text: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}", options: ["only-multiline"] },
    { text: "var foo = [{\na: 1,\nb: 2,\nc: 3,\nd: 4,\n},]", options: ["always-multiline"] },

    // destructuring — ecmaVersion: 6
    { text: "var { a, b, } = foo;", options: ["never"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var { a, b, } = foo;", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [ a, b, ] = foo;", options: ["never"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var [ a, b, ] = foo;", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "[(1),]", options: ["never"] },
    { text: "[(1),]", options: ["only-multiline"] },
    { text: "var x = { foo: (1),};", options: ["never"] },
    { text: "var x = { foo: (1),};", options: ["only-multiline"] },

    // https://github.com/eslint/eslint/issues/3794
    { text: "import {foo} from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo, {abc} from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo} from 'foo';", options: ["always"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo,} from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo,} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo, {abc,} from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import foo, {abc,} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo,} from 'foo';", options: ["never"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo,} from 'foo';", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {foo,} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {foo,} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "import {\n  foo\n} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "export {\n  foo\n} from 'foo';", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }

    // https://github.com/eslint/eslint/issues/6233
    { text: "var foo = {a: (1)}", options: ["always"] },
    { text: "var foo = [(1)]", options: ["always"] },
    { text: "var foo = [\n1,\n(2)\n]", options: ["always-multiline"] },

    // function trailing commas — { functions: "never" }
    { text: "function foo(a,) {}", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a,) {})", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a,) => a", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a,) => (a)", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "({foo(a,) {}})", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "class A {foo(a,) {}}", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(...a,)", options: [{ functions: "never" }] }, // languageOptions: { ecmaVersion: 8 }

    // function trailing commas — { functions: "always" }
    { text: "function foo(a) {}", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a) {})", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a) => a", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a) => (a)", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "({foo(a) {}})", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "class A {foo(a) {}}", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(...a)", options: [{ functions: "always" }] }, // languageOptions: { ecmaVersion: 8 }

    // function trailing commas — { functions: "always-multiline" }
    { text: "function foo(a,) {}", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a,) {})", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(...a,)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(\na,\nb\n) {}", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,\nb\n)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\n...a,\n...b\n)", options: [{ functions: "always-multiline" }] }, // languageOptions: { ecmaVersion: 8 }

    // function trailing commas — { functions: "only-multiline" }
    { text: "function foo(a,) {}", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a,) {})", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(...a,)", options: [{ functions: "only-multiline" }] }, // languageOptions: { ecmaVersion: 8 }

    // string option "never" with function trailing commas — ecmaVersion: 8
    { text: "function foo(a,) {}", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a,) {})", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a,) => a", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a,) => (a)", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "({foo(a,) {}})", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "class A {foo(a,) {}}", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: ["never"] }, // languageOptions: { ecmaVersion: 8 }

    // string option "always" with function trailing commas — ecmaVersion: 8
    // NOTE: ({foo(a) {}}) with "always" produces 2 errors (object + function) — skipped
    { text: "function foo(a) {}", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a) {})", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a) => a", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(a) => (a)", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "class A {foo(a) {}}", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: ["always"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a)", options: ["always"] }, // languageOptions: { ecmaVersion: 9 }

    // string option "always-multiline" with function trailing commas — ecmaVersion: 8
    { text: "function foo(a,) {}", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a,) {})", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(...a,)", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "function foo(\na,\nb\n) {}", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\na,\nb\n)", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(\n...a,\n...b\n)", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 8 }

    // string option "only-multiline" with function trailing commas — ecmaVersion: 8
    { text: "function foo(a,) {}", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "(function foo(a,) {})", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(a,)", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 8 }
    { text: "foo(...a,)", options: ["only-multiline"] }, // languageOptions: { ecmaVersion: 8 }

    // https://github.com/eslint/eslint/issues/11502
    { text: "foo(a,)" }, // languageOptions: { ecmaVersion: 8 }

    // https://github.com/eslint/eslint/issues/16442
    { text: "function f(\n a,\n b\n) {}", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 2017 }
    { text: "f(\n a,\n b\n);", options: ["always-multiline"] }, // languageOptions: { ecmaVersion: 2017 }
];

describe('comma-dangle', ({ describe }) => {

    const globalRules = { 'comma-dangle': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['comma-dangle'] = rules['comma-dangle'].concat(options);
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

    describe('invalid code', ({ it }) => {
        it('has expected outcomes', () => {
            invalid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['comma-dangle'] = rules['comma-dangle'].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('comma-dangle', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
