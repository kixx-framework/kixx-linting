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
		"var foo = 0; foo=+1;",

		// With "allowForLoopAfterthoughts" allowed
		{
			code: "var foo = 0; foo=+1;",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (i = 0; i < l; i++) { console.log(i); }",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (var i = 0, j = i + 1; j < example.length; i++, j++) {}",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i--, foo());",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo(), --i);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo(), ++i, bar);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i++, (++j, k--));",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo(), (bar(), i++), baz());",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; (--i, j += 2), bar = j + 1);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; a, (i--, (b, ++j, c)), d);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
	],

	invalid: [
		{
			code: "var foo = 0; foo++;",
		},
		{
			code: "var foo = 0; foo--;",
		},
		{
			code: "for (i = 0; i < l; i++) { console.log(i); }",
		},
		{
			code: "for (i = 0; i < l; foo, i++) { console.log(i); }",
		},

		// With "allowForLoopAfterthoughts" allowed
		{
			code: "var foo = 0; foo++;",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (i = 0; i < l; i++) { v++; }",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (i++;;);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;--i;);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;;) ++i;",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i = j++);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i++, f(--j));",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo + (i++, bar));",
			options: [{ allowForLoopAfterthoughts: true }],
		},
	],
};
