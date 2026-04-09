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
		"const JOE = 'schmoe';",
		"let moo = 'car';",
		{
			code: "const JOE = 'schmoe';",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "let moo = 'car';",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "using moo = 'car';",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "await using moo = 'car';",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
	],

	invalid: [
		{
			code: "var foo = bar;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var foo = bar, toast = most;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var foo = bar; let toast = most;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var a of b) { console.log(a); }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var a in b) { console.log(a); }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (let a of b) { var c = 1; console.log(c); }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var i = 0; i < list.length; ++i) { foo(i) }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var i = 0, i = 0; false;);",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var i = 0; for (var i = 1; false;); console.log(i);",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// Not fix if it's redeclared or it's used from outside of the scope or it's declared on a case chunk.
		{
			code: "var a, b, c; var a;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var a; if (b) { var a; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "if (foo) { var a, b, c; } a;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var i = 0; i < 10; ++i) {} i;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var a in obj) {} a;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (var a of list) {} a;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "switch (a) { case 0: var b = 1 }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// Don't fix if the variable is in a loop and the behavior might change.
		{
			code: "for (var a of b) { arr.push(() => a); }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "for (let a of b) { var c; console.log(c); c = 'hello'; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// https://github.com/eslint/eslint/issues/7950
		{
			code: "var a = a",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var {a = a} = {}",
			languageOptions: {
				ecmaVersion: 2015,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var {a = b, b} = {}",
			languageOptions: {
				ecmaVersion: 2015,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var {a, b = a} = {}",
			languageOptions: {
				ecmaVersion: 2015,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var a = b, b = 1",
			languageOptions: {
				ecmaVersion: 2015,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "var a = b; var b = 1",
			languageOptions: {
				ecmaVersion: 2015,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		/*
		 * This case is not in TDZ, but it's very hard to distinguish the reference is in TDZ or not.
		 * So this rule does not fix it for safe.
		 */
		{
			code: "function foo() { a } var a = 1; foo()",
			languageOptions: {
				ecmaVersion: 2015,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// https://github.com/eslint/eslint/issues/7961
		{
			code: "if (foo) var bar = 1;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// https://github.com/eslint/eslint/issues/9520
		{
			code: "var foo = 1",
		},
		{
			code: "{ var foo = 1 }",
		},
		{
			code: "if (true) { var foo = 1 }",
		},
		{
			code: "var foo = 1",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/11594
		{
			code: "declare var foo = 2;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parser: require("../../fixtures/parsers/typescript-parsers/declare-var"),
			},
		},

		// https://github.com/eslint/eslint/issues/11830
		{
			code: "function foo() { var let; }",
		},
		{
			code: "function foo() { var { let } = {}; }",
		},

		// https://github.com/eslint/eslint/issues/16610
		{
			code: "var fx = function (i = 0) { if (i < 5) { return fx(i + 1); } console.log(i); }; fx();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = function () { foo() };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = () => foo();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = (function () { foo(); })();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = bar(function () { foo(); });",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var bar = foo, foo = function () { foo(); };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var bar = foo; var foo = function () { foo(); };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var { foo = foo } = function () { foo(); };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var { bar = foo, foo } = function () { foo(); };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var bar = function () { foo(); }; var foo = function() {};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/20209
		{
			code: "export function a() { console.log(o); var o; return o; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function test() { console.log(x); var x = 1; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function test() { console.log(x); var x = 1; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "function test() { if (foo) { console.log(x); } var x = 1; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function a() { if (something) { console.log(o); } var o; return o; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function b() { if (something) { console.log(o); var o; return o; } }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function test() { var y = x; var x = 1; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var a = 1; function test() { console.log(a); var a = 2; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
	],
};
