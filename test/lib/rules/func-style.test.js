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
    { text: "function foo(){}\n function bar(){}", options: ["declaration"] },
    { text: "foo.bar = function(){};", options: ["declaration"] },
    { text: "(function() { /* code */ }());", options: ["declaration"] },
    { text: "var module = (function() { return {}; }());", options: ["declaration"] },
    { text: "var object = { foo: function(){} };", options: ["declaration"] },
    { text: "Array.prototype.foo = function(){};", options: ["declaration"] },
    { text: "foo.bar = function(){};", options: ["expression"] },
    { text: "var foo = function(){};\n var bar = function(){};", options: ["expression"] },
    { text: "var foo = () => {};\n var bar = () => {}", options: ["expression"] }, // languageOptions: { ecmaVersion: 6 }

    // https://github.com/eslint/eslint/issues/3819
    { text: "var foo = function() { this; }.bind(this);", options: ["declaration"] },
    { text: "var foo = () => { this; };", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "class C extends D { foo() { var bar = () => { super.baz(); }; } }", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var obj = { foo() { var bar = () => super.baz; } }", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export default function () {};" }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    { text: "var foo = () => {};", options: ["declaration", { allowArrowFunctions: true }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = () => { function foo() { this; } };", options: ["declaration", { allowArrowFunctions: true }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = () => ({ bar() { super.baz(); } });", options: ["declaration", { allowArrowFunctions: true }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export function foo() {};", options: ["declaration"] },
    { text: "export function foo() {};", options: ["expression", { overrides: { namedExports: "declaration" } }] },
    { text: "export function foo() {};", options: ["declaration", { overrides: { namedExports: "declaration" } }] },
    { text: "export function foo() {};", options: ["expression", { overrides: { namedExports: "ignore" } }] },
    { text: "export function foo() {};", options: ["declaration", { overrides: { namedExports: "ignore" } }] },
    { text: "export var foo = function(){};", options: ["expression"] },
    { text: "export var foo = function(){};", options: ["declaration", { overrides: { namedExports: "expression" } }] },
    { text: "export var foo = function(){};", options: ["expression", { overrides: { namedExports: "expression" } }] },
    { text: "export var foo = function(){};", options: ["declaration", { overrides: { namedExports: "ignore" } }] },
    { text: "export var foo = function(){};", options: ["expression", { overrides: { namedExports: "ignore" } }] },
    { text: "export var foo = () => {};", options: ["expression", { overrides: { namedExports: "expression" } }] },
    { text: "export var foo = () => {};", options: ["declaration", { overrides: { namedExports: "expression" } }] },
    { text: "export var foo = () => {};", options: ["declaration", { overrides: { namedExports: "ignore" } }] },
    { text: "export var foo = () => {};", options: ["expression", { overrides: { namedExports: "ignore" } }] },
    { text: "export var foo = () => {};", options: ["declaration", { allowArrowFunctions: true, overrides: { namedExports: "expression" } }] },
    { text: "export var foo = () => {};", options: ["expression", { allowArrowFunctions: true, overrides: { namedExports: "expression" } }] },
    { text: "export var foo = () => {};", options: ["declaration", { allowArrowFunctions: true, overrides: { namedExports: "ignore" } }] },
    // { text: "$1: function $2() { }", options: ["declaration"] }, // languageOptions: { sourceType: "script" }
    { text: "switch ($0) { case $1: function $2() { } }", options: ["declaration"] },
];

const invalid = [
    { text: "var foo = function(){};", options: ["declaration"] },
    { text: "var foo = () => {};", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = () => { function foo() { this; } };", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = () => ({ bar() { super.baz(); } });", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "function foo(){}", options: ["expression"] },
    { text: "export function foo(){}", options: ["expression"] },
    { text: "export function foo() {};", options: ["declaration", { overrides: { namedExports: "expression" } }] },
    { text: "export function foo() {};", options: ["expression", { overrides: { namedExports: "expression" } }] },
    { text: "export var foo = function(){};", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export var foo = function(){};", options: ["expression", { overrides: { namedExports: "declaration" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export var foo = function(){};", options: ["declaration", { overrides: { namedExports: "declaration" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export var foo = () => {};", options: ["declaration"] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export var b = () => {};", options: ["expression", { overrides: { namedExports: "declaration" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "export var c = () => {};", options: ["declaration", { overrides: { namedExports: "declaration" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "function foo() {};", options: ["expression", { overrides: { namedExports: "declaration" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = function() {};", options: ["declaration", { overrides: { namedExports: "expression" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = () => {};", options: ["declaration", { overrides: { namedExports: "expression" } }] }, // languageOptions: { ecmaVersion: 6 }
    { text: "const foo = function() {};", options: ["declaration", { allowTypeAnnotation: true }] },
    // { text: "$1: function $2() { }" }, // languageOptions: { sourceType: "script" }
    { text: "const foo = () => {};", options: ["declaration", { allowTypeAnnotation: true }] },
    { text: "export const foo = function() {};", options: ["expression", { allowTypeAnnotation: true, overrides: { namedExports: "declaration" } }] },
    { text: "export const foo = () => {};", options: ["expression", { allowTypeAnnotation: true, overrides: { namedExports: "declaration" } }] },
    // { text: "if (foo) function bar() {}" }, // languageOptions: { sourceType: "script" }
];


describe("func-style", ({ describe }) => {

    const globalRules = { "func-style": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["func-style"] = rules["func-style"].concat(options);
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
            invalid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["func-style"] = rules["func-style"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [message] = res.messages;

                assertEqual("func-style", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
