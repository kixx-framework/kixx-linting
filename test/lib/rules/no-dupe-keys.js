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
		"var foo = { __proto__: 1, two: 2};",
		"var x = { foo: 1, bar: 2 };",
		"var x = { '': 1, bar: 2 };",
		"var x = { '': 1, ' ': 2 };",
		{
			code: "var x = { '': 1, [null]: 2 };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { '': 1, [a]: 2 };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { [a]: 1, [a]: 2 };",
			languageOptions: { ecmaVersion: 6 },
		},
		"+{ get a() { }, set a(b) { } };",
		{
			code: "var x = { a: b, [a]: b };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { a: b, ...c }",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = { get a() {}, set a (value) {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { a: 1, b: { a: 2 } };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = ({ null: 1, [/(?<zero>0)/]: 2 })",
			languageOptions: { ecmaVersion: 2018 },
		},
		{ code: "var {a, a} = obj", languageOptions: { ecmaVersion: 6 } },
		"var x = { 012: 1, 12: 2 };",
		{
			code: "var x = { 1_0: 1, 1: 2 };",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = { __proto__: null, ['__proto__']: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { ['__proto__']: null, __proto__: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { '__proto__': null, ['__proto__']: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { ['__proto__']: null, '__proto__': null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__: null, __proto__ };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__, __proto__: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__: null, __proto__() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__() {}, __proto__: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__: null, get __proto__() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { get __proto__() {}, __proto__: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__: null, set __proto__(value) {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { set __proto__(value) {}, __proto__: null };",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "var x = { a: b, ['a']: b };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { y: 1, y: 2 };",
		},
		{
			code: "var x = { '': 1, '': 2 };",
		},
		{
			code: "var x = { '': 1, [``]: 2 };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = { 0x1: 1, 1: 2};",
		},
		{
			code: "var x = { 012: 1, 10: 2 };",
		},
		{
			code: "var x = { 0b1: 1, 1: 2 };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { 0o1: 1, 1: 2 };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { 1n: 1, 1: 2 };",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = { 1_0: 1, 10: 2 };",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: 'var x = { "z": 1, z: 2 };',
		},
		{
			code: "var foo = {\n  bar: 1,\n  bar: 1,\n}",
		},
		{
			code: "var x = { a: 1, get a() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { a: 1, set a(value) {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { a: 1, b: { a: 2 }, get b() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = ({ '/(?<zero>0)/': 1, [/(?<zero>0)/]: 2 })",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = { ['__proto__']: null, ['__proto__']: null };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { ['__proto__']: null, __proto__ };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { ['__proto__']: null, __proto__() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { ['__proto__']: null, get __proto__() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { ['__proto__']: null, set __proto__(value) {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = { __proto__: null, a: 5, a: 6 };",
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
