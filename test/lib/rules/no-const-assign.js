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
		"const x = 0; { let x; x = 1; }",
		"const x = 0; function a(x) { x = 1; }",
		"const x = 0; foo(x);",
		"for (const x in [1,2,3]) { foo(x); }",
		"for (const x of [1,2,3]) { foo(x); }",
		"const x = {key: 0}; x.key = 1;",
		"using x = foo();",
		"await using x = foo();",
		"using x = foo(); bar(x);",
		"await using x = foo(); bar(x);",

		// ignores non constant.
		"var x = 0; x = 1;",
		"let x = 0; x = 1;",
		"function x() {} x = 1;",
		"function foo(x) { x = 1; }",
		"class X {} X = 1;",
		"try {} catch (x) { x = 1; }",
	],
	invalid: [
		{
			code: "const x = 0; x = 1;",
		},
		{
			code: "const {a: x} = {a: 0}; x = 1;",
		},
		{
			code: "const x = 0; ({x} = {x: 1});",
		},
		{
			code: "const x = 0; ({a: x = 1} = {});",
		},
		{
			code: "const x = 0; x += 1;",
		},
		{
			code: "const x = 0; ++x;",
		},
		{
			code: "for (const i = 0; i < 10; ++i) { foo(i); }",
		},
		{
			code: "const x = 0; x = 1; x = 2;",
		},
		{
			code: "const x = 0; function foo() { x = x + 1; }",
		},
		{
			code: "const x = 0; function foo(a) { x = a; }",
		},
		{
			code: "const x = 0; while (true) { x = x + 1; }",
		},
		{
			code: "using x = foo(); x = 1;",
		},
		{
			code: "await using x = foo(); x = 1;",
		},
		{
			code: "using x = foo(); x ??= bar();",
		},
		{
			code: "await using x = foo(); x ||= bar();",
		},
		{
			code: "using x = foo(); [x, y] = bar();",
		},
		{
			code: "await using x = foo(); [x = baz, y] = bar();",
		},
	],
};
