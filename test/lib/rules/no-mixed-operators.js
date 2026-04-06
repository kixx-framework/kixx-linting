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
		"a && b && c && d",
		"a || b || c || d",
		"(a || b) && c && d",
		"a || (b && c && d)",
		"(a || b || c) && d",
		"a || b || (c && d)",
		"a + b + c + d",
		"a * b * c * d",
		"a == 0 && b == 1",
		"a == 0 || b == 1",
		{
			code: "(a == 0) && (b == 1)",
			options: [{ groups: [["&&", "=="]] }],
		},
		{
			code: "a + b - c * d / e",
			options: [{ groups: [["&&", "||"]] }],
		},
		"a + b - c",
		"a * b / c",
		{
			code: "a + b - c",
			options: [{ allowSamePrecedence: true }],
		},
		{
			code: "a * b / c",
			options: [{ allowSamePrecedence: true }],
		},
		{
			code: "(a || b) ? c : d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a ? (b || c) : d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a ? b : (c || d)",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a || (b ? c : d)",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "(a ? b : c) || d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		"a || (b ? c : d)",
		"(a || b) ? c : d",
		"a || b ? c : d",
		"a ? (b || c) : d",
		"a ? b || c : d",
		"a ? b : (c || d)",
		"a ? b : c || d",
	],
	invalid: [
		{
			code: "a && b || c",
		},
		{
			code: "a && b > 0 || c",
			options: [{ groups: [["&&", "||", ">"]] }],
		},
		{
			code: "a && b > 0 || c",
			options: [{ groups: [["&&", "||"]] }],
		},
		{
			code: "a && b + c - d / e || f",
			options: [
				{
					groups: [
						["&&", "||"],
						["+", "-", "*", "/"],
					],
				},
			],
		},
		{
			code: "a && b + c - d / e || f",
			options: [
				{
					groups: [
						["&&", "||"],
						["+", "-", "*", "/"],
					],
					allowSamePrecedence: true,
				},
			],
		},
		{
			code: "a + b - c",
			options: [{ allowSamePrecedence: false }],
		},
		{
			code: "a * b / c",
			options: [{ allowSamePrecedence: false }],
		},
		{
			code: "a || b ? c : d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a && b ? 1 : 2",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "x ? a && b : 0",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "x ? 0 : a && b",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a + b ?? c",
			options: [{ groups: [["+", "??"]] }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
