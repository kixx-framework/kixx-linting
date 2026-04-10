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
    { text: "var x = 5;" },
    { text: "var x =5, y;" },
    { text: "foo();" },
    { text: "x = foo();" },
    { text: 'setTimeout(function() {foo = "bar"; });' },
    { text: 'setTimeout(function() {foo = "bar";});' },
    { text: "for (var a in b){}" },
    { text: "for (var i;;){}" },
    { text: "if (true) {}\n;[global, extended].forEach(function(){});" },
    { text: "throw new Error('foo');" },
    {
        text: "for (let thing of {}) {\n  console.log(thing);\n}",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "do{}while(true);" },
    {
        text: "class C { static {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo(); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo(); } }",
        options: ["always"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo(); bar(); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo(); bar(); baz();} }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // omitLastInOneLineBlock: true
    {
        text: "if (foo) { bar() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo) { bar(); baz() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo)\n{ bar(); baz() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo) {\n bar(); baz(); }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo) { bar(); baz(); \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo() { bar(); baz() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo()\n{ bar(); baz() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo(){\n bar(); baz(); }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo(){ bar(); baz(); \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "() => { bar(); baz() };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "() =>\n { bar(); baz() };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "() => {\n bar(); baz(); };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "() => { bar(); baz(); \n};",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const obj = { method() { bar(); baz() } };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const obj = { method()\n { bar(); baz() } };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const obj = { method() {\n bar(); baz(); } };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const obj = { method() { bar(); baz(); \n} };",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\n method() { bar(); baz() } \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\n method()\n { bar(); baz() } \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\n method() {\n bar(); baz(); } \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\n method() { bar(); baz(); \n} \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\n static { bar(); baz() } \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C {\n static\n { bar(); baz() } \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C {\n static {\n bar(); baz(); } \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C {\n static { bar(); baz(); \n} \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },

    // method definitions and static blocks don't have a semicolon.
    {
        text: "class A { a() {} b() {} }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var A = class { a() {} b() {} };",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class A { static {} }",
        languageOptions: { ecmaVersion: 2022 },
    },

    {
        text: "import theDefault, { named1, named2 } from 'src/mylib';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },

    // exports, "always"
    {
        text: "export * from 'foo';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export { foo } from 'foo';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = 0;export { foo };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export var foo;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export function foo () { }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export function* foo () { }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export class Foo { }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export let foo;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export const FOO = 42;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default function() { }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default function* () { }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default class { }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default foo || bar;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default (foo) => foo.bar();",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default foo = 42;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default foo += 42;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    { text: "++\nfoo;" },


    // Class fields
    {
        text: "class C { foo; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { foo; }",
        options: ["always"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { foo;\n[bar]; }",
        options: ["always"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { foo() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
];

const invalid = [
    {
        text: "import * as utils from './utils'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { square, diag } from 'lib'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { default as foo } from 'lib'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import 'src/mylib'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import theDefault, { named1, named2 } from 'src/mylib'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function foo() { return [] }",
    },
    {
        text: "while(true) { break }",
    },
    {
        text: "while(true) { continue }",
    },
    {
        text: "let x = 5",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 5",
    },
    {
        text: "var x = 5, y",
    },
    {
        text: "debugger",
    },
    {
        text: "foo()",
    },
    {
        text: "foo()\n",
    },
    {
        text: "foo()\r\n",
    },
    {
        text: "foo()\nbar();",
    },
    {
        text: "foo()\r\nbar();",
    },
    {
        text: "for (var a in b) var i ",
    },
    {
        text: "for (;;){var i}",
    },
    {
        text: "for (;;) var i ",
    },
    {
        text: "for (var j;;) {var i}",
    },
    {
        text: "var foo = {\n bar: baz\n}",
    },
    {
        text: "var foo\nvar bar;",
    },
    {
        text: "throw new Error('foo')",
    },
    {
        text: "do{}while(true)",
    },
    {
        text: "if (foo) {bar()}",
    },
    {
        text: "if (foo) {bar()} ",
    },
    {
        text: "if (foo) {bar()\n}",
    },

    {
        text: "class C { static { foo() } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo(); bar() } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo()\nbar(); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo(); bar()\nbaz(); } }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // omitLastInOneLineBlock: true
    {
        text: "if (foo) { bar()\n }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo) {\n bar() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo) {\n bar(); baz() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "if (foo) { bar(); }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo() { bar(); baz(); }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo()\n{ bar(); baz(); }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo() {\n bar(); baz() }",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "function foo() { bar(); baz() \n}",
        options: ["always", { omitLastInOneLineBlock: true }],
    },
    {
        text: "class C {\nfoo() { bar(); baz(); }\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\nfoo() \n{ bar(); baz(); }\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\nfoo() {\n bar(); baz() }\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\nfoo() { bar(); baz() \n}\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C {\nstatic { bar(); baz(); }\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C {\nstatic \n{ bar(); baz(); }\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C {\nstatic {\n bar(); baz() }\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C {\nfoo() { bar(); baz() \n}\n}",
        options: ["always", { omitLastInOneLineBlock: true }],
        languageOptions: { ecmaVersion: 2022 },
    },

    // exports, "always"
    {
        text: "export * from 'foo'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export { foo } from 'foo'",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = 0;export { foo }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export var foo",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export let foo",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export const FOO = 42",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default foo || bar",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default (foo) => foo.bar()",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default foo = 42",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default foo += 42",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },

    // Class fields
    {
        text: "class C { foo }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { foo\n[bar]; }",
        languageOptions: { ecmaVersion: 2022 },
    },
];

describe("semi", ({ describe }) => {

    const globalRules = { semi: ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules.semi = rules.semi.concat(options);
                }

                const res = lintText(file, rules, languageOptions);

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
            invalid.forEach(({ text, options, languageOptions, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules.semi = rules.semi.concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("semi", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
