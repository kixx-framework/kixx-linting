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

export default {
	valid: [
		{
			code: "function foo(){}\n function bar(){}",
			options: ["declaration"],
		},
		{
			code: "foo.bar = function(){};",
			options: ["declaration"],
		},
		{
			code: "(function() { /* code */ }());",
			options: ["declaration"],
		},
		{
			code: "var module = (function() { return {}; }());",
			options: ["declaration"],
		},
		{
			code: "var object = { foo: function(){} };",
			options: ["declaration"],
		},
		{
			code: "Array.prototype.foo = function(){};",
			options: ["declaration"],
		},
		{
			code: "foo.bar = function(){};",
			options: ["expression"],
		},
		{
			code: "var foo = function(){};\n var bar = function(){};",
			options: ["expression"],
		},
		{
			code: "var foo = () => {};\n var bar = () => {}",
			options: ["expression"],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/3819
		{
			code: "var foo = function() { this; }.bind(this);",
			options: ["declaration"],
		},
		{
			code: "var foo = () => { this; };",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends D { foo() { var bar = () => { super.baz(); }; } }",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var obj = { foo() { var bar = () => super.baz; } }",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export default function () {};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = () => {};",
			options: ["declaration", { allowArrowFunctions: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => { function foo() { this; } };",
			options: ["declaration", { allowArrowFunctions: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => ({ bar() { super.baz(); } });",
			options: ["declaration", { allowArrowFunctions: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export function foo() {};",
			options: ["declaration"],
		},
		{
			code: "export function foo() {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
		},
		{
			code: "export function foo() {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
		},
		{
			code: "export function foo() {};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export function foo() {};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = function(){};",
			options: ["expression"],
		},
		{
			code: "export var foo = function(){};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = function(){};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = function(){};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = function(){};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = () => {};",
			options: ["declaration", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = () => {};",
			options: ["expression", { overrides: { namedExports: "ignore" } }],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"declaration",
				{
					allowArrowFunctions: true,
					overrides: { namedExports: "expression" },
				},
			],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"expression",
				{
					allowArrowFunctions: true,
					overrides: { namedExports: "expression" },
				},
			],
		},
		{
			code: "export var foo = () => {};",
			options: [
				"declaration",
				{
					allowArrowFunctions: true,
					overrides: { namedExports: "ignore" },
				},
			],
		},
		{
			code: "$1: function $2() { }",
			options: ["declaration"],
			languageOptions: { sourceType: "script" },
		},
		{
			code: "switch ($0) { case $1: function $2() { } }",
			options: ["declaration"],
		},
	],

	invalid: [
		{
			code: "var foo = function(){};",
			options: ["declaration"],
		},
		{
			code: "var foo = () => {};",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => { function foo() { this; } };",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => ({ bar() { super.baz(); } });",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(){}",
			options: ["expression"],
		},
		{
			code: "export function foo(){}",
			options: ["expression"],
		},
		{
			code: "export function foo() {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export function foo() {};",
			options: [
				"expression",
				{ overrides: { namedExports: "expression" } },
			],
		},
		{
			code: "export var foo = function(){};",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var foo = function(){};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var foo = function(){};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var foo = () => {};",
			options: ["declaration"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var b = () => {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var c = () => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() {};",
			options: [
				"expression",
				{ overrides: { namedExports: "declaration" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = function() {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => {};",
			options: [
				"declaration",
				{ overrides: { namedExports: "expression" } },
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const foo = function() {};",
			options: ["declaration", { allowTypeAnnotation: true }],
		},
		{
			code: "$1: function $2() { }",
			languageOptions: { sourceType: "script" },
		},
		{
			code: "const foo = () => {};",
			options: ["declaration", { allowTypeAnnotation: true }],
		},
		{
			code: "export const foo = function() {};",
			options: [
				"expression",
				{
					allowTypeAnnotation: true,
					overrides: { namedExports: "declaration" },
				},
			],
		},
		{
			code: "export const foo = () => {};",
			options: [
				"expression",
				{
					allowTypeAnnotation: true,
					overrides: { namedExports: "declaration" },
				},
			],
		},
		{
			code: "if (foo) function bar() {}",
			languageOptions: { sourceType: "script" },
		},
	],
};
