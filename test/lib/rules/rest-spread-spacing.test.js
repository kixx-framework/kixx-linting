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
		"fn(...args)",
		"fn(...(args))",
		"fn(...( args ))",
		{ code: "fn(...args)", options: ["never"] },
		{ code: "fn(... args)", options: ["always"] },
		{ code: "fn(...\targs)", options: ["always"] },
		{ code: "fn(...\nargs)", options: ["always"] },
		"[...arr, 4, 5, 6]",
		"[...(arr), 4, 5, 6]",
		"[...( arr ), 4, 5, 6]",
		{ code: "[...arr, 4, 5, 6]", options: ["never"] },
		{ code: "[... arr, 4, 5, 6]", options: ["always"] },
		{ code: "[...\tarr, 4, 5, 6]", options: ["always"] },
		{ code: "[...\narr, 4, 5, 6]", options: ["always"] },
		"let [a, b, ...arr] = [1, 2, 3, 4, 5];",
		{ code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];", options: ["never"] },
		{ code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];", options: ["always"] },
		{
			code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
			options: ["always"],
		},
		{
			code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
			options: ["always"],
		},
		{
			code: "let n = { x, y, ...z };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...(z) };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...( z ) };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...z };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... z };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\tz };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\nz };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
	],

	invalid: [
		{
			code: "fn(... args)",
		},
		{
			code: "fn(...  args)",
		},
		{
			code: "fn(...\targs)",
		},
		{
			code: "fn(... \t args)",
		},
		{
			code: "fn(...\nargs)",
		},
		{
			code: "fn(...\n    args)",
		},
		{
			code: "fn(...\n\targs)",
		},
		{
			code: "fn(... args)",
			options: ["never"],
		},
		{
			code: "fn(...\targs)",
			options: ["never"],
		},
		{
			code: "fn(...\nargs)",
			options: ["never"],
		},
		{
			code: "fn(...args)",
			options: ["always"],
		},
		{
			code: "fn(... (args))",
		},
		{
			code: "fn(... ( args ))",
		},
		{
			code: "fn(...(args))",
			options: ["always"],
		},
		{
			code: "fn(...( args ))",
			options: ["always"],
		},
		{
			code: "[... arr, 4, 5, 6]",
		},
		{
			code: "[...\tarr, 4, 5, 6]",
		},
		{
			code: "[...\narr, 4, 5, 6]",
		},
		{
			code: "[... arr, 4, 5, 6]",
			options: ["never"],
		},
		{
			code: "[...\tarr, 4, 5, 6]",
			options: ["never"],
		},
		{
			code: "[...\narr, 4, 5, 6]",
			options: ["never"],
		},
		{
			code: "[...arr, 4, 5, 6]",
			options: ["always"],
		},
		{
			code: "[... (arr), 4, 5, 6]",
		},
		{
			code: "[... ( arr ), 4, 5, 6]",
		},
		{
			code: "[...(arr), 4, 5, 6]",
			options: ["always"],
		},
		{
			code: "[...( arr ), 4, 5, 6]",
			options: ["always"],
		},
		{
			code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
		},
		{
			code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
		},
		{
			code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
		},
		{
			code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
			options: ["never"],
		},
		{
			code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
			options: ["never"],
		},
		{
			code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
			options: ["never"],
		},
		{
			code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
			options: ["always"],
		},
		{
			code: "let n = { x, y, ... z };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\tz };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\nz };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... z };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\tz };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\nz };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...z };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... (z) };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... ( z ) };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...(z) };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...( z ) };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
	],
};
