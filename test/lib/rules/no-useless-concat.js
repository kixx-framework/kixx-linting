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
		"var a = 1 + 1;",
		"var a = 1 * '2';",
		"var a = 1 - 2;",
		"var a = foo + bar;",
		"var a = 'foo' + bar;",
		"var foo = 'foo' +\n 'bar';",

		// https://github.com/eslint/eslint/issues/3575
		"var string = (number + 1) + 'px';",
		"'a' + 1",
		"1 + '1'",
		{ code: "1 + `1`", languageOptions: { ecmaVersion: 6 } },
		{ code: "`1` + 1", languageOptions: { ecmaVersion: 6 } },
		{ code: "(1 + +2) + `b`", languageOptions: { ecmaVersion: 6 } },
	],

	invalid: [
		{
			code: "'a' + 'b'",
		},
		{
			code: "'a' +\n'b' + 'c'",
		},
		{
			code: "foo + 'a' + 'b'",
		},
		{
			code: "'a' + 'b' + 'c'",
		},
		{
			code: "(foo + 'a') + ('b' + 'c')",
		},
		{
			code: "`a` + 'b'",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`a` + `b`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo + `a` + `b`",
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
