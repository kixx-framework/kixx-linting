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
		"function foo() { var foo = bar; }",
		"function foo(foo) { foo = bar; }",
		"function foo() { var foo; foo = bar; }",
		{
			code: "var foo = () => {}; foo = bar;",
			languageOptions: { ecmaVersion: 6 },
		},
		"var foo = function() {}; foo = bar;",
		"var foo = function() { foo = bar; };",
		{
			code: "import bar from 'bar'; function foo() { var foo = bar; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
	],
	invalid: [
		{
			code: "function foo() {}; foo = bar;",
		},
		{
			code: "function foo() { foo = bar; }",
		},
		{
			code: "foo = bar; function foo() { };",
		},
		{
			code: "[foo] = bar; function foo() { };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "({x: foo = 0} = bar); function foo() { };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { [foo] = bar; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { ({x: foo = 0} = bar); function foo() { }; })();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var a = function foo() { foo = 123; };",
		},
	],
};
