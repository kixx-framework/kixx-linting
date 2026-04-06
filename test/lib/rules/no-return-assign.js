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
		{
			code: "module.exports = {'a': 1};",
			languageOptions: {
				sourceType: "module",
			},
		},
		"var result = a * b;",
		"function x() { var result = a * b; return result; }",
		"function x() { return (result = a * b); }",
		{
			code: "function x() { var result = a * b; return result; }",
			options: ["except-parens"],
		},
		{
			code: "function x() { return (result = a * b); }",
			options: ["except-parens"],
		},
		{
			code: "function x() { var result = a * b; return result; }",
			options: ["always"],
		},
		{
			code: "function x() { return function y() { result = a * b }; }",
			options: ["always"],
		},
		{
			code: "() => { return (result = a * b); }",
			options: ["except-parens"],
		},
		{
			code: "() => (result = a * b)",
			options: ["except-parens"],
		},
		"const foo = (a,b,c) => ((a = b), c)",
		`function foo(){
            return (a = b)
        }`,
		`function bar(){
            return function foo(){
                return (a = b) && c
            }
        }`,
		{
			code: "const foo = (a) => (b) => (a = b)",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "function x() { return result = a * b; };",
		},
		{
			code: "function x() { return (result) = (a * b); };",
		},
		{
			code: "function x() { return result = a * b; };",
			options: ["except-parens"],
		},
		{
			code: "function x() { return (result) = (a * b); };",
			options: ["except-parens"],
		},
		{
			code: "() => { return result = a * b; }",
		},
		{
			code: "() => result = a * b",
		},
		{
			code: "function x() { return result = a * b; };",
			options: ["always"],
		},
		{
			code: "function x() { return (result = a * b); };",
			options: ["always"],
		},
		{
			code: "function x() { return result || (result = a * b); };",
			options: ["always"],
		},
		{
			code: `function foo(){
                return a = b
            }`,
		},
		{
			code: `function doSomething() {
                return foo = bar && foo > 0;
            }`,
		},
		{
			code: `function doSomething() {
                return foo = function(){
                    return (bar = bar1)
                }
            }`,
		},
		{
			code: `function doSomething() {
                return foo = () => a
            }`,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `function doSomething() {
                return () => a = () => b
            }`,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `function foo(a){
                return function bar(b){
                    return a = b
                }
            }`,
		},
		{
			code: "const foo = (a) => (b) => a = b",
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
