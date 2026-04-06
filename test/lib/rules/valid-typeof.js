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
		"typeof foo === 'string'",
		"typeof foo === 'object'",
		"typeof foo === 'function'",
		"typeof foo === 'undefined'",
		"typeof foo === 'boolean'",
		"typeof foo === 'number'",
		"typeof foo === 'bigint'",
		"'string' === typeof foo",
		"'object' === typeof foo",
		"'function' === typeof foo",
		"'undefined' === typeof foo",
		"'boolean' === typeof foo",
		"'number' === typeof foo",
		"typeof foo === typeof bar",
		"typeof foo === baz",
		"typeof foo !== someType",
		"typeof bar != someType",
		"someType === typeof bar",
		"someType == typeof bar",
		"typeof foo == 'string'",
		"typeof(foo) === 'string'",
		"typeof(foo) !== 'string'",
		"typeof(foo) == 'string'",
		"typeof(foo) != 'string'",
		"var oddUse = typeof foo + 'thing'",
		"function f(undefined) { typeof x === undefined }",
		{
			code: "typeof foo === 'number'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: 'typeof foo === "number"',
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "var baz = typeof foo + 'thing'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === typeof bar",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === `string`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`object` === typeof foo",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo === `str${somethingElse}`",
			languageOptions: { ecmaVersion: 6 },
		},
	],

	invalid: [
		{
			code: "typeof foo === 'strnig'",
		},
		{
			code: "'strnig' === typeof foo",
		},
		{
			code: "if (typeof bar === 'umdefined') {}",
		},
		{
			code: "typeof foo !== 'strnig'",
		},
		{
			code: "'strnig' !== typeof foo",
		},
		{
			code: "if (typeof bar !== 'umdefined') {}",
		},
		{
			code: "typeof foo != 'strnig'",
		},
		{
			code: "'strnig' != typeof foo",
		},
		{
			code: "if (typeof bar != 'umdefined') {}",
		},
		{
			code: "typeof foo == 'strnig'",
		},
		{
			code: "'strnig' == typeof foo",
		},
		{
			code: "if (typeof bar == 'umdefined') {}",
		},
		{
			code: "if (typeof bar === `umdefined`) {}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo == 'invalid string'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "if (typeof bar !== undefined) {}",
		},
		{
			code: "typeof foo == Object",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === undefined",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "undefined === typeof foo",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "undefined == typeof foo",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === `undefined${foo}`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo === `${string}`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
