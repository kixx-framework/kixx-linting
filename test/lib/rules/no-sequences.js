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
	// Examples of code that should not trigger the rule
	valid: [
		"var arr = [1, 2];",
		"var obj = {a: 1, b: 2};",
		"var a = 1, b = 2;",
		"var foo = (1, 2);",
		'(0,eval)("foo()");',
		"for (i = 1, j = 2;; i++, j++);",
		"foo(a, (b, c), d);",
		"do {} while ((doSomething(), !!test));",
		"for ((doSomething(), somethingElse()); (doSomething(), !!test); );",
		"if ((doSomething(), !!test));",
		"switch ((doSomething(), val)) {}",
		"while ((doSomething(), !!test));",
		"with ((doSomething(), val)) {}",
		{
			code: "a => ((doSomething(), a))",
			languageOptions: { ecmaVersion: 6 },
		},

		// options object without "allowInParentheses" property
		{ code: "var foo = (1, 2);", options: [{}] },

		// explicitly set option "allowInParentheses" to default value
		{ code: "var foo = (1, 2);", options: [{ allowInParentheses: true }] },

		// valid code with "allowInParentheses" set to `false`
		{
			code: "for ((i = 0, j = 0); test; );",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "for (; test; (i++, j++));",
			options: [{ allowInParentheses: false }],
		},

		// https://github.com/eslint/eslint/issues/14572
		{
			code: "const foo = () => { return ((bar = 123), 10) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const foo = () => (((bar = 123), 10));",
			languageOptions: { ecmaVersion: 6 },
		},
	],

	// Examples of code that should trigger the rule
	invalid: [
		{
			code: "1, 2;",
		},
		{ code: "a = 1, 2",},
		{ code: "do {} while (doSomething(), !!test);",},
		{ code: "for (; doSomething(), !!test; );",},
		{ code: "if (doSomething(), !!test);",},
		{ code: "switch (doSomething(), val) {}",},
		{ code: "while (doSomething(), !!test);",},
		{ code: "with (doSomething(), val) {}",},
		{
			code: "a => (doSomething(), a)",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "(1), 2",},
		{ code: "((1)) , (2)",},
		{ code: "while((1) , 2);",},

		// option "allowInParentheses": do not allow sequence in parentheses
		{
			code: "var foo = (1, 2);",
			options: [{ allowInParentheses: false }],
		},
		{
			code: '(0,eval)("foo()");',
			options: [{ allowInParentheses: false }],
		},
		{
			code: "foo(a, (b, c), d);",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "do {} while ((doSomething(), !!test));",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "for (; (doSomething(), !!test); );",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "if ((doSomething(), !!test));",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "switch ((doSomething(), val)) {}",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "while ((doSomething(), !!test));",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "with ((doSomething(), val)) {}",
			options: [{ allowInParentheses: false }],
		},
		{
			code: "a => ((doSomething(), a))",
			options: [{ allowInParentheses: false }],
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
