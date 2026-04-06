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
		"A: break A;",
		"A: { foo(); break A; bar(); }",
		"A: if (a) { foo(); if (b) break A; bar(); }",
		"A: for (var i = 0; i < 10; ++i) { foo(); if (a) break A; bar(); }",
		"A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue A; bar(); }",
		"A: { B: break B; C: for (var i = 0; i < 10; ++i) { foo(); if (a) break A; if (c) continue C; bar(); } }",
		"A: { var A = 0; console.log(A); break A; console.log(A); }",
	],
	invalid: [
		{
			code: "A: var foo = 0;",
		},
		{
			code: "A: { foo(); bar(); }",
		},
		{
			code: "A: if (a) { foo(); bar(); }",
		},
		{
			code: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) break; bar(); }",
		},
		{
			code: "A: for (var i = 0; i < 10; ++i) { foo(); if (a) continue; bar(); }",
		},
		{
			code: "A: for (var i = 0; i < 10; ++i) { B: break A; }",
		},
		{
			code: "A: { var A = 0; console.log(A); }",
		},
		{
			code: "A: /* comment */ foo",
		},
		{
			code: "A /* comment */: foo",
		},

		// https://github.com/eslint/eslint/issues/16988
		{
			code: 'A: "use strict"',
		},
		{
			code: '"use strict"; foo: "bar"',
		},
		{
			code: 'A: ("use strict")', // Parentheses may be removed by another rule.
		},
		{
			code: "A: `use strict`", // `use strict` may be changed to "use strict" by another rule.
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if (foo) { bar: 'baz' }",
		},
		{
			code: "A: B: 'foo'",
		},
		{
			code: "A: B: C: 'foo'",
		},
		{
			code: "A: B: C: D: 'foo'",
		},
		{
			code: "A: B: C: D: E: 'foo'",
		},
		{
			code: "A: 42",
		},

		/*
		 * Below is fatal errors.
		 * "A: break B",
		 * "A: function foo() { break A; }",
		 * "A: class Foo { foo() { break A; } }",
		 * "A: { A: { break A; } }"
		 */
	],
};
