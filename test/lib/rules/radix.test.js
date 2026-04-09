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
		'parseInt("10", 10);',
		'parseInt("10", 2);',
		'parseInt("10", 36);',
		'parseInt("10", 0x10);',
		'parseInt("10", 1.6e1);',
		'parseInt("10", 10.0);',
		'parseInt("10", foo);',
		'Number.parseInt("10", foo);',
		"parseInt",
		"Number.foo();",
		"Number[parseInt]();",
		{
			code: "class C { #parseInt; foo() { Number.#parseInt(); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #parseInt; foo() { Number.#parseInt(foo); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #parseInt; foo() { Number.#parseInt(foo, 'bar'); } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// Ignores if it's shadowed or disabled.
		"var parseInt; parseInt();",
		"var Number; Number.parseInt();",
		"/* globals parseInt:off */ parseInt(foo);",
		{
			code: "Number.parseInt(foo);",
			languageOptions: { globals: { Number: "off" } },
		},

		// Deprecated options "always" and "as-needed" should work the same as the default behavior of this rule
		{
			code: 'parseInt("10", 10);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", 10);',
			options: ["as-needed"],
		},
		{
			code: 'parseInt("10", 8);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", 8);',
			options: ["as-needed"],
		},
		{
			code: 'parseInt("10", foo);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", foo);',
			options: ["as-needed"],
		},
	],

	invalid: [
		{
			code: "parseInt();",
		},
		{
			code: 'parseInt("10");',
		},
		{
			code: 'parseInt("10",);', // Function parameter with trailing comma
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: 'parseInt((0, "10"));', // Sequence expression (no trailing comma).
		},
		{
			code: 'parseInt((0, "10"),);', // Sequence expression (with trailing comma).
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: 'parseInt("10", null);',
		},
		{
			code: 'parseInt("10", undefined);',
		},
		{
			code: 'parseInt("10", true);',
		},
		{
			code: 'parseInt("10", "foo");',
		},
		{
			code: 'parseInt("10", "123");',
		},
		{
			code: 'parseInt("10", 1);',
		},
		{
			code: 'parseInt("10", 37);',
		},
		{
			code: 'parseInt("10", 10.5);',
		},
		{
			code: "Number.parseInt();",
		},
		{
			code: 'Number.parseInt("10");',
		},
		{
			code: 'Number.parseInt("10", 1);',
		},
		{
			code: 'Number.parseInt("10", 37);',
		},
		{
			code: 'Number.parseInt("10", 10.5);',
		},

		// Optional chaining
		{
			code: 'parseInt?.("10");',
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: 'Number.parseInt?.("10");',
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: 'Number?.parseInt("10");',
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: '(Number?.parseInt)("10");',
			languageOptions: { ecmaVersion: 2020 },
		},

		// Deprecated options "always" and "as-needed" should work the same as the default behavior of this rule
		{
			code: "parseInt();",
			options: ["always"],
		},
		{
			code: "parseInt();",
			options: ["as-needed"],
		},
		{
			code: 'parseInt("10");',
			options: ["always"],
		},
		{
			code: 'parseInt("10");',
			options: ["as-needed"],
		},
		{
			code: 'parseInt("10", 1);',
			options: ["always"],
		},
		{
			code: 'parseInt("10", 1);',
			options: ["as-needed"],
		},
		{
			code: "Number.parseInt();",
			options: ["always"],
		},
		{
			code: "Number.parseInt();",
			options: ["as-needed"],
		},
	],
};
