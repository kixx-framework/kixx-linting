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
		"let x;",
		"var x;",
		"const x = undefined; log(x);",
		"let y = undefined; log(y);",
		"var y = undefined; log(y);",
		"let a = x, b = y; log(a, b);",
		"var a = x, b = y; log(a, b);",
		"const foo = (two) => { let one; if (one !== two) one = two; }",
	],
	invalid: [
		{
			code: "let x; let a = x, b; log(x, a, b);",
		},
		{
			code: "const foo = (two) => { let one; if (one === two) {} }",
		},
		{
			code: "let user; greet(user);",
		},
		{
			code: "function test() { let error; return error || 'Unknown error'; }",
		},
		{
			code: "let options; const { debug } = options || {};",
		},
		{
			code: "let flag; while (!flag) { }",
		},
		{
			code: "let config; function init() { return config?.enabled; }",
		},
	],
};
