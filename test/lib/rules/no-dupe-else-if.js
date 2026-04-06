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
		// different test conditions
		"if (a) {} else if (b) {}",
		"if (a); else if (b); else if (c);",
		"if (true) {} else if (false) {} else {}",
		"if (1) {} else if (2) {}",
		"if (f) {} else if (f()) {}",
		"if (f(a)) {} else if (g(a)) {}",
		"if (f(a)) {} else if (f(b)) {}",
		"if (a === 1) {} else if (a === 2) {}",
		"if (a === 1) {} else if (b === 1) {}",

		// not an if-else-if chain
		"if (a) {}",
		"if (a);",
		"if (a) {} else {}",
		"if (a) if (a) {}",
		"if (a) if (a);",
		"if (a) { if (a) {} }",
		"if (a) {} else { if (a) {} }",
		"if (a) {} if (a) {}",
		"if (a); if (a);",
		"while (a) if (a);",
		"if (a); else a ? a : a;",

		// not same conditions in the chain
		"if (a) { if (b) {} } else if (b) {}",
		"if (a) if (b); else if (a);",

		// not equal tokens
		"if (a) {} else if (!!a) {}",
		"if (a === 1) {} else if (a === (1)) {}",

		// more complex valid chains (may contain redundant subconditions, but the branch can be executed)
		"if (a || b) {} else if (c || d) {}",
		"if (a || b) {} else if (a || c) {}",
		"if (a) {} else if (a || b) {}",
		"if (a) {} else if (b) {} else if (a || b || c) {}",
		"if (a && b) {} else if (a) {} else if (b) {}",
		"if (a && b) {} else if (b && c) {} else if (a && c) {}",
		"if (a && b) {} else if (b || c) {}",
		"if (a) {} else if (b && (a || c)) {}",
		"if (a) {} else if (b && (c || d && a)) {}",
		"if (a && b && c) {} else if (a && b && (c || d)) {}",
	],

	invalid: [
		// basic tests
		{
			code: "if (a) {} else if (a) {}",
		},
		{
			code: "if (a); else if (a);",
		},
		{
			code: "if (a) {} else if (a) {} else {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (a) {} else if (c) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (a) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (c) {} else if (a) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (b) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (b) {} else {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (c) {} else if (b) {}",
		},
		{
			code: "if (a); else if (b); else if (c); else if (b); else if (d); else;",
		},
		{
			code: "if (a); else if (b); else if (c); else if (d); else if (b); else if (e);",
		},

		// multiple duplicates of the same condition
		{
			code: "if (a) {} else if (a) {} else if (a) {}",
		},

		// multiple duplicates of different conditions
		{
			code: "if (a) {} else if (b) {} else if (a) {} else if (b) {} else if (a) {}",
		},

		// inner if statements do not affect chain
		{
			code: "if (a) { if (b) {} } else if (a) {}",
		},

		// various kinds of test conditions
		{
			code: "if (a === 1) {} else if (a === 1) {}",
		},
		{
			code: "if (1 < a) {} else if (1 < a) {}",
		},
		{
			code: "if (true) {} else if (true) {}",
		},
		{
			code: "if (a && b) {} else if (a && b) {}",
		},
		{
			code: "if (a && b || c)  {} else if (a && b || c) {}",
		},
		{
			code: "if (f(a)) {} else if (f(a)) {}",
		},

		// spaces and comments do not affect comparison
		{
			code: "if (a === 1) {} else if (a===1) {}",
		},
		{
			code: "if (a === 1) {} else if (a === /* comment */ 1) {}",
		},

		// extra parens around the whole test condition do not affect comparison
		{
			code: "if (a === 1) {} else if ((a === 1)) {}",
		},

		// more complex errors with `||` and `&&`
		{
			code: "if (a || b) {} else if (a) {}",
		},
		{
			code: "if (a || b) {} else if (a) {} else if (b) {}",
		},
		{
			code: "if (a || b) {} else if (b || a) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (a || b) {}",
		},
		{
			code: "if (a || b) {} else if (c || d) {} else if (a || d) {}",
		},
		{
			code: "if ((a === b && fn(c)) || d) {} else if (fn(c) && a === b) {}",
		},
		{
			code: "if (a) {} else if (a && b) {}",
		},
		{
			code: "if (a && b) {} else if (b && a) {}",
		},
		{
			code: "if (a && b) {} else if (a && b && c) {}",
		},
		{
			code: "if (a || c) {} else if (a && b || c) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (c && a || b) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (c && (a || b)) {}",
		},
		{
			code: "if (a) {} else if (b && c) {} else if (d && (a || e && c && b)) {}",
		},
		{
			code: "if (a || b && c) {} else if (b && c && d) {}",
		},
		{
			code: "if (a || b) {} else if (b && c) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if ((a || b) && c) {}",
		},
		{
			code: "if ((a && (b || c)) || d) {} else if ((c || b) && e && a) {}",
		},
		{
			code: "if (a && b || b && c) {} else if (a && b && c) {}",
		},
		{
			code: "if (a) {} else if (b && c) {} else if (d && (c && e && b || a)) {}",
		},
		{
			code: "if (a || (b && (c || d))) {} else if ((d || c) && b) {}",
		},
		{
			code: "if (a || b) {} else if ((b || a) && c) {}",
		},
		{
			code: "if (a || b) {} else if (c) {} else if (d) {} else if (b && (a || c)) {}",
		},
		{
			code: "if (a || b || c) {} else if (a || (b && d) || (c && e)) {}",
		},
		{
			code: "if (a || (b || c)) {} else if (a || (b && c)) {}",
		},
		{
			code: "if (a || b) {} else if (c) {} else if (d) {} else if ((a || c) && (b || d)) {}",
		},
		{
			code: "if (a) {} else if (b) {} else if (c && (a || d && b)) {}",
		},
		{
			code: "if (a) {} else if (a || a) {}",
		},
		{
			code: "if (a || a) {} else if (a || a) {}",
		},
		{
			code: "if (a || a) {} else if (a) {}",
		},
		{
			code: "if (a) {} else if (a && a) {}",
		},
		{
			code: "if (a && a) {} else if (a && a) {}",
		},
		{
			code: "if (a && a) {} else if (a) {}",
		},
	],
};
