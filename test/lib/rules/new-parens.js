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
		// Default (Always)
		"var a = new Date();",
		"var a = new Date(function() {});",
		"var a = new (Date)();",
		"var a = new ((Date))();",
		"var a = (new Date());",
		"var a = new foo.Bar();",
		"var a = (new Foo()).bar;",
		{
			code: "new Storage<RootState>('state');",
			languageOptions: {
				parser: require(parser("typescript-parsers/new-parens")),
			},
		},

		// Explicit Always
		{ code: "var a = new Date();", options: ["always"] },
		{ code: "var a = new foo.Bar();", options: ["always"] },
		{ code: "var a = (new Foo()).bar;", options: ["always"] },

		// Never
		{ code: "var a = new Date;", options: ["never"] },
		{ code: "var a = new Date(function() {});", options: ["never"] },
		{ code: "var a = new (Date);", options: ["never"] },
		{ code: "var a = new ((Date));", options: ["never"] },
		{ code: "var a = (new Date);", options: ["never"] },
		{ code: "var a = new foo.Bar;", options: ["never"] },
		{ code: "var a = (new Foo).bar;", options: ["never"] },
		{ code: "var a = new Person('Name')", options: ["never"] },
		{ code: "var a = new Person('Name', 12)", options: ["never"] },
		{ code: "var a = new ((Person))('Name');", options: ["never"] },
	],
	invalid: [
		// Default (Always)
		{
			code: "var a = new Date;",
		},
		{
			code: "var a = new Date",
		},
		{
			code: "var a = new (Date);",
		},
		{
			code: "var a = new (Date)",
		},
		{
			code: "var a = (new Date)",
		},
		{
			// This `()` is `CallExpression`'s. This is a call of the result of `new Date`.
			code: "var a = (new Date)()",
		},
		{
			code: "var a = new foo.Bar;",
		},
		{
			code: "var a = (new Foo).bar;",
		},

		// Explicit always
		{
			code: "var a = new Date;",
			options: ["always"],
		},
		{
			code: "var a = new foo.Bar;",
			options: ["always"],
		},
		{
			code: "var a = (new Foo).bar;",
			options: ["always"],
		},
		{
			code: "var a = new new Foo()",
			options: ["always"],
		},

		// Never
		{
			code: "var a = new Date();",
			options: ["never"],
		},
		{
			code: "var a = new Date()",
			options: ["never"],
		},
		{
			code: "var a = new (Date)();",
			options: ["never"],
		},
		{
			code: "var a = new (Date)()",
			options: ["never"],
		},
		{
			code: "var a = (new Date())",
			options: ["never"],
		},
		{
			code: "var a = (new Date())()",
			options: ["never"],
		},
		{
			code: "var a = new foo.Bar();",
			options: ["never"],
		},
		{
			code: "var a = (new Foo()).bar;",
			options: ["never"],
		},
		{
			code: "var a = new new Foo()",
			options: ["never"],
		},
	],
};
