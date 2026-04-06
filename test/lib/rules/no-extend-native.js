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
		"x.prototype.p = 0",
		"x.prototype['p'] = 0",
		"Object.p = 0",
		"Object.toString.bind = 0",
		"Object['toString'].bind = 0",
		"Object.defineProperty(x, 'p', {value: 0})",
		"Object.defineProperties(x, {p: {value: 0}})",
		"global.Object.prototype.toString = 0",
		"this.Object.prototype.toString = 0",
		"with(Object) { prototype.p = 0; }",
		"o = Object; o.prototype.toString = 0",
		"eval('Object.prototype.toString = 0')",
		"parseFloat.prototype.x = 1",
		{
			code: "Object.prototype.g = 0",
			options: [{ exceptions: ["Object"] }],
		},
		"obj[Object.prototype] = 0",

		// https://github.com/eslint/eslint/issues/4438
		"Object.defineProperty()",
		"Object.defineProperties()",

		// https://github.com/eslint/eslint/issues/8461
		"function foo() { var Object = function() {}; Object.prototype.p = 0 }",
		{
			code: "{ let Object = function() {}; Object.prototype.p = 0 }",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "Object.prototype.p = 0",
		},
		{
			code: "BigInt.prototype.p = 0",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "WeakRef.prototype.p = 0",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "FinalizationRegistry.prototype.p = 0",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "AggregateError.prototype.p = 0",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "Function.prototype['p'] = 0",
		},
		{
			code: "String['prototype'].p = 0",
		},
		{
			code: "Number['prototype']['p'] = 0",
		},
		{
			code: "Object.defineProperty(Array.prototype, 'p', {value: 0})",
		},
		{
			code: "Object.defineProperties(Array.prototype, {p: {value: 0}})",
		},
		{
			code: "Object.defineProperties(Array.prototype, {p: {value: 0}, q: {value: 0}})",
		},
		{
			code: "Number['prototype']['p'] = 0",
			options: [{ exceptions: ["Object"] }],
		},
		{
			code: "Object.prototype.p = 0; Object.prototype.q = 0",
		},
		{
			code: "function foo() { Object.prototype.p = 0 }",
		},

		// Optional chaining
		{
			code: "(Object?.prototype).p = 0",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "Object.defineProperty(Object?.prototype, 'p', { value: 0 })",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "Object?.defineProperty(Object.prototype, 'p', { value: 0 })",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(Object?.defineProperty)(Object.prototype, 'p', { value: 0 })",
			languageOptions: { ecmaVersion: 2020 },
		},

		// Logical assignments
		{
			code: "Array.prototype.p &&= 0",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "Array.prototype.p ||= 0",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "Array.prototype.p ??= 0",
			languageOptions: { ecmaVersion: 2021 },
		},
	],
};
