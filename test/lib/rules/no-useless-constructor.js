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
		"class A { }",
		"class A { constructor(){ doSomething(); } }",
		"class A extends B { constructor(){} }",
		"class A extends B { constructor(){ super('foo'); } }",
		"class A extends B { constructor(foo, bar){ super(foo, bar, 1); } }",
		"class A extends B { constructor(){ super(); doSomething(); } }",
		"class A extends B { constructor(...args){ super(...args); doSomething(); } }",
		"class A { dummyMethod(){ doSomething(); } }",
		"class A extends B.C { constructor() { super(foo); } }",
		"class A extends B.C { constructor([a, b, c]) { super(...arguments); } }",
		"class A extends B.C { constructor(a = f()) { super(...arguments); } }",
		"class A extends B { constructor(a, b, c) { super(a, b); } }",
		"class A extends B { constructor(foo, bar){ super(foo); } }",
		"class A extends B { constructor(test) { super(); } }",
		"class A extends B { constructor() { foo; } }",
		"class A extends B { constructor(foo, bar) { super(bar); } }",
		{
			code: "declare class A { constructor(options: any); }",
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/declare-class"),
			},
		},
	],
	invalid: [
		{
			code: "class A { constructor(){} }",
		},
		{
			code: "class A { constructor     (){} }",
		},
		{
			code: "class A { 'constructor'(){} }",
		},
		{
			code: "class A extends B { constructor() { super(); } }",
		},
		{
			code: "class A extends B { constructor(foo){ super(foo); } }",
		},
		{
			code: "class A extends B { constructor(foo, bar){ super(foo, bar); } }",
		},
		{
			code: "class A extends B { constructor(...args){ super(...args); } }",
		},
		{
			code: "class A extends B.C { constructor() { super(...arguments); } }",
		},
		{
			code: "class A extends B { constructor(a, b, ...c) { super(...arguments); } }",
		},
		{
			code: "class A extends B { constructor(a, b, ...c) { super(a, b, ...c); } }",
		},
		{
			code: unIndent`
              class A {
                foo = 'bar'
                constructor() { }
                [0]() { }
              }`,
			languageOptions: { ecmaVersion: 2022 },
		},
	],
};
