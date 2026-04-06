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
		"var foo = /^abc[a-zA-Z]/;",
		'var regExp = new RegExp("^abc[]");',
		"var foo = /^abc/;",
		"var foo = /[\\[]/;",
		"var foo = /[\\]]/;",
		"var foo = /\\[][\\]]/;",
		"var foo = /[a-zA-Z\\[]/;",
		"var foo = /[[]/;",
		"var foo = /[\\[a-z[]]/;",
		"var foo = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g;",
		"var foo = /\\s*:\\s*/gim;",
		"var foo = /[^]/;", // this rule allows negated empty character classes
		"var foo = /\\[][^]/;",
		{ code: "var foo = /[\\]]/uy;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = /[\\]]/s;", languageOptions: { ecmaVersion: 2018 } },
		{ code: "var foo = /[\\]]/d;", languageOptions: { ecmaVersion: 2022 } },
		"var foo = /\\[]/",
		{ code: "var foo = /[[^]]/v;", languageOptions: { ecmaVersion: 2024 } },
		{
			code: "var foo = /[[\\]]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[\\[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a--b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a&&b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[a][b]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[\\q{}]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[^]--\\p{ASCII}]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
	],
	invalid: [
		{
			code: "var foo = /^abc[]/;",
		},
		{
			code: "var foo = /foo[]bar/;",
		},
		{
			code: "if (foo.match(/^abc[]/)) {}",
		},
		{
			code: "if (/^abc[]/.test(foo)) {}",
		},
		{
			code: "var foo = /[]]/;",
		},
		{
			code: "var foo = /\\[[]/;",
		},
		{
			code: "var foo = /\\[\\[\\]a-z[]/;",
		},
		{
			code: "var foo = /[]]/d;",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "var foo = /[(]\\u{0}*[]/u;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "var foo = /[]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[a][]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a[[b[]c]]d]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a--[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[]--b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a&&[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[]&&b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
	],
};
