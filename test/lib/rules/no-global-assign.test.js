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
		"string = 'hello world';",
		"var string;",
		{ code: "Object = 0;", options: [{ exceptions: ["Object"] }] },
		"top = 0;",
		{ code: "onload = 0;", languageOptions: { globals: globals.browser } },
		"require = 0;",
		{ code: "a = 1", languageOptions: { globals: { a: true } } },
		"/*global a:true*/ a = 1",
	],
	invalid: [
		{
			code: "String = 'hello world';",
		},
		{
			code: "String++;",
		},
		{
			code: "({Object = 0, String = 0} = {});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "top = 0;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "require = 0;",
			languageOptions: { sourceType: "commonjs" },
		},

		// Notifications of readonly are moved from no-undef: https://github.com/eslint/eslint/issues/4504
		{
			code: "/*global b:false*/ function f() { b = 1; }",
		},
		{
			code: "function f() { b = 1; }",
			languageOptions: { globals: { b: false } },
		},
		{
			code: "/*global b:false*/ function f() { b++; }",
		},
		{
			code: "/*global b*/ b = 1;",
		},
		{
			code: "Array = 1;",
		},
	],
};
