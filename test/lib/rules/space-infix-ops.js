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
		"a + b",
		"a + ++b",
		"a++ + b",
		"a++ + ++b",
		"a     + b",
		"(a) + (b)",
		"((a)) + ((b))",
		"(((a))) + (((b)))",
		"a + +b",
		"a + (b)",
		"a + +(b)",
		"a + (+(b))",
		"(a + b) + (c + d)",
		"a = b",
		"a ? b : c",
		"var a = b",
		{
			code: "const my_object = {key: 'value'};",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var {a = 0} = bar;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "function foo(a = 0) { }",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "a ** b", languageOptions: { ecmaVersion: 7 } },
		{ code: "a|0", options: [{ int32Hint: true }] },
		{ code: "a |0", options: [{ int32Hint: true }] },

		// Type Annotations
		{
			code: "function foo(a: number = 0) { }",
			languageOptions: {
				ecmaVersion: 6,
				parser: require(
					parser(
						"type-annotations/function-parameter-type-annotation",
					),
				),
			},
		},
		{
			code: "function foo(): Bar { }",
			languageOptions: {
				ecmaVersion: 6,
				parser: require(
					parser("type-annotations/function-return-type-annotation"),
				),
			},
		},
		{
			code: "var foo: Bar = '';",
			languageOptions: {
				ecmaVersion: 6,
				parser: require(
					parser(
						"type-annotations/variable-declaration-init-type-annotation",
					),
				),
			},
		},
		{
			code: "const foo = function(a: number = 0): Bar { };",
			languageOptions: {
				ecmaVersion: 6,
				parser: require(
					parser(
						"type-annotations/function-expression-type-annotation",
					),
				),
			},
		},

		// TypeScript Type Aliases
		{
			code: "type Foo<T> = T;",
			languageOptions: {
				ecmaVersion: 6,
				parser: require(parser("typescript-parsers/type-alias")),
			},
		},

		// Logical Assignments
		{ code: "a &&= b", languageOptions: { ecmaVersion: 2021 } },
		{ code: "a ||= b", languageOptions: { ecmaVersion: 2021 } },
		{ code: "a ??= b", languageOptions: { ecmaVersion: 2021 } },

		// Class Fields
		{ code: "class C { a; }", languageOptions: { ecmaVersion: 2022 } },
		{ code: "class C { a = b; }", languageOptions: { ecmaVersion: 2022 } },
		{
			code: "class C { 'a' = b; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [a] = b; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{ code: "class C { #a = b; }", languageOptions: { ecmaVersion: 2022 } },
	],
	invalid: [
		{
			code: "a+b",
		},
		{
			code: "a +b",
		},
		{
			code: "a+ b",
		},
		{
			code: "a||b",
		},
		{
			code: "a ||b",
		},
		{
			code: "a|| b",
		},
		{
			code: "a=b",
		},
		{
			code: "a= b",
		},
		{
			code: "a =b",
		},
		{
			code: "a?b:c",
		},
		{
			code: "a? b :c",
		},
		{
			code: "a ?b: c",
		},
		{
			code: "a?b : c",
		},
		{
			code: "a ? b:c",
		},
		{
			code: "a? b : c",
		},
		{
			code: "a ?b : c",
		},
		{
			code: "a ? b: c",
		},
		{
			code: "a ? b :c",
		},
		{
			code: "var a=b;",
		},
		{
			code: "var a= b;",
		},
		{
			code: "var a =b;",
		},
		{
			code: "var a = b, c=d;",
		},
		{
			code: "a| 0",
			options: [
				{
					int32Hint: true,
				},
			],
		},
		{
			code: "var output = test || (test && test.value) ||(test2 && test2.value);",
		},
		{
			code: "var output = a ||(b && c.value) || (d && e.value);",
		},
		{
			code: "var output = a|| (b && c.value) || (d && e.value);",
		},
		{
			code: "const my_object={key: 'value'}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var {a=0}=bar;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a=0) { }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "a**b",
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "'foo'in{}",
		},
		{
			code: "'foo'instanceof{}",
		},

		// Type Annotations
		{
			code: "var a: Foo= b;",
			languageOptions: {
				parser: require(
					parser(
						"type-annotations/variable-declaration-init-type-annotation-no-space",
					),
				),
			},
		},
		{
			code: "function foo(a: number=0): Foo { }",
			languageOptions: {
				ecmaVersion: 6,
				parser: require(
					parser(
						"type-annotations/function-declaration-type-annotation-no-space",
					),
				),
			},
		},

		// Logical Assignments
		{
			code: "a&&=b",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "a ||=b",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "a??= b",
			languageOptions: { ecmaVersion: 2021 },
		},

		// Class Fields
		{
			code: "class C { a=b; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [a ]= b; }",
			languageOptions: { ecmaVersion: 2022 },
		},
	],
};
