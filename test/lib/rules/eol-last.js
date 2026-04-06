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
		"",
		"\n",
		"var a = 123;\n",
		"var a = 123;\n\n",
		"var a = 123;\n   \n",

		"\r\n",
		"var a = 123;\r\n",
		"var a = 123;\r\n\r\n",
		"var a = 123;\r\n   \r\n",

		{ code: "var a = 123;", options: ["never"] },
		{ code: "var a = 123;\nvar b = 456;", options: ["never"] },
		{ code: "var a = 123;\r\nvar b = 456;", options: ["never"] },

		// Deprecated: `"unix"` parameter
		{ code: "", options: ["unix"] },
		{ code: "\n", options: ["unix"] },
		{ code: "var a = 123;\n", options: ["unix"] },
		{ code: "var a = 123;\n\n", options: ["unix"] },
		{ code: "var a = 123;\n   \n", options: ["unix"] },

		// Deprecated: `"windows"` parameter
		{ code: "", options: ["windows"] },
		{ code: "\n", options: ["windows"] },
		{ code: "\r\n", options: ["windows"] },
		{ code: "var a = 123;\r\n", options: ["windows"] },
		{ code: "var a = 123;\r\n\r\n", options: ["windows"] },
		{ code: "var a = 123;\r\n   \r\n", options: ["windows"] },
	],

	invalid: [
		{
			code: "var a = 123;",
		},
		{
			code: "var a = 123;\n   ",
		},
		{
			code: "var a = 123;\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\r\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\r\n\r\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\nvar b = 456;\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\r\nvar b = 456;\r\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\n\n",
			options: ["never"],
		},

		// Deprecated: `"unix"` parameter
		{
			code: "var a = 123;",
			options: ["unix"],
		},
		{
			code: "var a = 123;\n   ",
			options: ["unix"],
		},

		// Deprecated: `"windows"` parameter
		{
			code: "var a = 123;",
			options: ["windows"],
		},
		{
			code: "var a = 123;\r\n   ",
			options: ["windows"],
		},
	],
};
