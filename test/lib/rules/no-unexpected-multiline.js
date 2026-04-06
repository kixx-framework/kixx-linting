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
		"(x || y).aFunction()",
		"[a, b, c].forEach(doSomething)",
		"var a = b;\n(x || y).doSomething()",
		"var a = b\n;(x || y).doSomething()",
		"var a = b\nvoid (x || y).doSomething()",
		"var a = b;\n[1, 2, 3].forEach(console.log)",
		"var a = b\nvoid [1, 2, 3].forEach(console.log)",
		'"abc\\\n(123)"',
		"var a = (\n(123)\n)",
		"f(\n(x)\n)",
		"(\nfunction () {}\n)[1]",
		{
			code: "let x = function() {};\n   `hello`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x = function() {}\nx `hello`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "String.raw `Hi\n${2+3}!`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "x\n.y\nz `Valid Test Case`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "f(x\n)`Valid Test Case`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "x.\ny `Valid Test Case`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(x\n)`Valid Test Case`",
			languageOptions: { ecmaVersion: 6 },
		},
		`
            foo
            / bar /2
        `,
		`
            foo
            / bar / mgy
        `,
		`
            foo
            / bar /
            gym
        `,
		`
            foo
            / bar
            / ygm
        `,
		`
            foo
            / bar /GYM
        `,
		`
            foo
            / bar / baz
        `,
		"foo /bar/g",
		`
            foo
            /denominator/
            2
        `,
		`
            foo
            / /abc/
        `,
		`
            5 / (5
            / 5)
        `,

		// https://github.com/eslint/eslint/issues/11650
		{
			code: `
                tag<generic>\`
                    multiline
                \`;
            `,
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-1"),
			},
		},
		{
			code: `
                tag<
                  generic
                >\`
                    multiline
                \`;
            `,
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-2"),
			},
		},
		{
			code: `
                tag<
                  generic
                >\`multiline\`;
            `,
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-3"),
			},
		},

		// Optional chaining
		{
			code: "var a = b\n  ?.(x || y).doSomething()",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var a = b\n  ?.[a, b, c].forEach(doSomething)",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var a = b?.\n  (x || y).doSomething()",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var a = b?.\n  [a, b, c].forEach(doSomething)",
			languageOptions: { ecmaVersion: 2020 },
		},

		// Class fields
		{
			code: "class C { field1\n[field2]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field1\n*gen() {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			// ArrowFunctionExpression doesn't connect to computed properties.
			code: "class C { field1 = () => {}\n[field2]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			// ArrowFunctionExpression doesn't connect to binary operators.
			code: "class C { field1 = () => {}\n*gen() {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "var a = b\n(x || y).doSomething()",
		},
		{
			code: "var a = (a || b)\n(x || y).doSomething()",
		},
		{
			code: "var a = (a || b)\n(x).doSomething()",
		},
		{
			code: "var a = b\n[a, b, c].forEach(doSomething)",
		},
		{
			code: "var a = b\n    (x || y).doSomething()",
		},
		{
			code: "var a = b\n  [a, b, c].forEach(doSomething)",
		},
		{
			code: "let x = function() {}\n `hello`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x = function() {}\nx\n`hello`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "x\n.y\nz\n`Invalid Test Case`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                foo
                / bar /gym
            `,
		},
		{
			code: `
                foo
                / bar /g
            `,
		},
		{
			code: `
                foo
                / bar /g.test(baz)
            `,
		},
		{
			code: `
                foo
                /bar/gimuygimuygimuy.test(baz)
            `,
		},
		{
			code: `
                foo
                /bar/s.test(baz)
            `,
		},

		// https://github.com/eslint/eslint/issues/11650
		{
			code: ["const x = aaaa<", "  test", ">/*", "test", "*/`foo`"].join(
				"\n",
			),
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/tagged-template-with-generic/tagged-template-with-generic-and-comment"),
			},
		},

		// Class fields
		{
			code: "class C { field1 = obj\n[field2]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field1 = function() {}\n[field2]; }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// "class C { field1 = obj\n*gen() {} }" is syntax error: Unexpected token '{'
	],
};
