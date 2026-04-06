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
		"switch (foo) {}",
		"switch (foo) { case 1: bar(); break; }",
		"switch (foo) { case 1: break; }",
		"switch (foo) { case 1: }",
		"switch (foo) { case 1: bar(); break; case 2: baz(); break; }",
		"switch (foo) { case 1: break; case 2: break; }",
		"switch (foo) { case 1: case 2: break; }",
		"switch (foo) { case 1: case 2: }",
		"switch (foo) { default: bar(); break; }",
		"switch (foo) { default: bar(); }",
		"switch (foo) { default: break; }",
		"switch (foo) { default: }",
		"switch (foo) { case 1: break; default: break; }",
		"switch (foo) { case 1: break; default: }",
		"switch (foo) { case 1: default: break; }",
		"switch (foo) { case 1: default: }",
		"switch (foo) { case 1: baz(); break; case 2: quux(); break; default: quuux(); break; }",
		"switch (foo) { case 1: break; case 2: break; default: break; }",
		"switch (foo) { case 1: break; case 2: break; default: }",
		"switch (foo) { case 1: case 2: break; default: break; }",
		"switch (foo) { case 1: break; case 2: default: break; }",
		"switch (foo) { case 1: break; case 2: default: }",
		"switch (foo) { case 1: case 2: default: }",
	],

	invalid: [
		{
			code: "switch (foo) { default: bar(); break; case 1: baz(); break; }",
		},
		{
			code: "switch (foo) { default: break; case 1: break; }",
		},
		{
			code: "switch (foo) { default: break; case 1: }",
		},
		{
			code: "switch (foo) { default: case 1: break; }",
		},
		{
			code: "switch (foo) { default: case 1: }",
		},
		{
			code: "switch (foo) { default: break; case 1: break; case 2: break; }",
		},
		{
			code: "switch (foo) { default: case 1: break; case 2: break; }",
		},
		{
			code: "switch (foo) { default: case 1: case 2: break; }",
		},
		{
			code: "switch (foo) { default: case 1: case 2: }",
		},
		{
			code: "switch (foo) { case 1: break; default: break; case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: default: break; case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: break; default: case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: default: case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: default: case 2: }",
		},
	],
};
