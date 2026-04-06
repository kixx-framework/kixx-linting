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
		"a in b",
		"a in b === false",
		"!(a in b)",
		"(!a) in b",
		"a instanceof b",
		"a instanceof b === false",
		"!(a instanceof b)",
		"(!a) instanceof b",

		// tests cases for enforceForOrderingRelations option:
		"if (! a < b) {}",
		"while (! a > b) {}",
		"foo = ! a <= b;",
		"foo = ! a >= b;",
		{
			code: "! a <= b",
			options: [{}],
		},
		{
			code: "foo = ! a >= b;",
			options: [{ enforceForOrderingRelations: false }],
		},
		{
			code: "foo = (!a) >= b;",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "a <= b",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "!(a < b)",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "foo = a > b;",
			options: [{ enforceForOrderingRelations: true }],
		},
	],
	invalid: [
		{
			code: "!a in b",
		},
		{
			code: "(!a in b)",
		},
		{
			code: "!(a) in b",
		},
		{
			code: "!a instanceof b",
		},
		{
			code: "(!a instanceof b)",
		},
		{
			code: "!(a) instanceof b",
		},
		{
			code: "if (! a < b) {}",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "while (! a > b) {}",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "foo = ! a <= b;",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "foo = ! a >= b;",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "! a <= b",
			options: [{ enforceForOrderingRelations: true }],
		},
	],
};
