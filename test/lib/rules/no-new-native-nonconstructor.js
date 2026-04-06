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
		// Symbol
		"var foo = Symbol('foo');",
		"function bar(Symbol) { var baz = new Symbol('baz');}",
		"function Symbol() {} new Symbol();",
		"new foo(Symbol);",
		"new foo(bar, Symbol);",

		// BigInt
		"var foo = BigInt(9007199254740991);",
		"function bar(BigInt) { var baz = new BigInt(9007199254740991);}",
		"function BigInt() {} new BigInt();",
		"new foo(BigInt);",
		"new foo(bar, BigInt);",
	],
	invalid: [
		// Symbol
		{
			code: "var foo = new Symbol('foo');",
		},
		{
			code: "function bar() { return function Symbol() {}; } var baz = new Symbol('baz');",
		},

		// BigInt
		{
			code: "var foo = new BigInt(9007199254740991);",
		},
		{
			code: "function bar() { return function BigInt() {}; } var baz = new BigInt(9007199254740991);",
		},
	],
};
