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
		"function foo(bar){ var baz; }",
		"!function foo(bar){ var baz; }",
		"!function(bar){ var baz; }",
		"try {} catch(e) {}",
		{
			code: "export default function() {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "try {} catch {}",
			languageOptions: { ecmaVersion: 2019 },
		},
		"var undefined;",
		"var undefined; doSomething(undefined);",
		"var undefined; var undefined;",
		{
			code: "let undefined",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "import { undefined as undef } from 'foo';",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2015,
			},
		},
		{
			code: "let globalThis;",
			options: [{ reportGlobalThis: false }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "class globalThis {}",
			options: [{ reportGlobalThis: false }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "import { baz as globalThis } from 'foo';",
			options: [{ reportGlobalThis: false }],
			languageOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
		{
			code: "globalThis.foo",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const foo = globalThis",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "function foo() { return globalThis; }",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "import { globalThis as foo } from 'bar'",
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},
	],
	invalid: [
		{
			code: "function NaN(NaN) { var NaN; !function NaN(NaN) { try {} catch(NaN) {} }; }",
		},
		{
			code: "function undefined(undefined) { !function undefined(undefined) { try {} catch(undefined) {} }; }",
		},
		{
			code: "function Infinity(Infinity) { var Infinity; !function Infinity(Infinity) { try {} catch(Infinity) {} }; }",
		},
		{
			code: "function arguments(arguments) { var arguments; !function arguments(arguments) { try {} catch(arguments) {} }; }",
		},
		{
			code: "function eval(eval) { var eval; !function eval(eval) { try {} catch(eval) {} }; }",
		},
		{
			code: "var eval = (eval) => { var eval; !function eval(eval) { try {} catch(eval) {} }; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [undefined] = [1]",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var {undefined} = obj; var {a: undefined} = obj; var {a: {b: {undefined}}} = obj; var {a, ...undefined} = obj;",
			languageOptions: { ecmaVersion: 9 },
		},
		{
			code: "var undefined; undefined = 5;",
		},
		{
			code: "class undefined {}",
			languageOptions: {
				ecmaVersion: 2015,
			},
		},
		{
			code: "(class undefined {})",
			languageOptions: {
				ecmaVersion: 2015,
			},
		},
		{
			code: "import undefined from 'foo';",
			languageOptions: {
				ecmaVersion: 2015,
				sourceType: "module",
			},
		},
		{
			code: "import { undefined } from 'foo';",
			languageOptions: {
				ecmaVersion: 2015,
				sourceType: "module",
			},
		},
		{
			code: "import { baz as undefined } from 'foo';",
			languageOptions: {
				ecmaVersion: 2015,
				sourceType: "module",
			},
		},
		{
			code: "import * as undefined from 'foo';",
			languageOptions: {
				ecmaVersion: 2015,
				sourceType: "module",
			},
		},
		{
			code: "function globalThis(globalThis) { var globalThis; !function globalThis(globalThis) { try {} catch(globalThis) {} }; }",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "function globalThis(globalThis) { var globalThis; !function globalThis(globalThis) { try {} catch(globalThis) {} }; }",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const [globalThis] = [1]",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var {globalThis} = obj; var {a: globalThis} = obj; var {a: {b: {globalThis}}} = obj; var {a, ...globalThis} = obj;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let globalThis; globalThis = 5;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "class globalThis {}",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(class globalThis {})",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "import globalThis from 'foo';",
			languageOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
		{
			code: "import { globalThis } from 'foo';",
			languageOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
		{
			code: "import { baz as globalThis } from 'foo';",
			languageOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
		{
			code: "import * as globalThis from 'foo';",
			languageOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
	],
};
