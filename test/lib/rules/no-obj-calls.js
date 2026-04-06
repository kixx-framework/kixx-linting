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
		"var x = Math;",
		"var x = Math.random();",
		"var x = Math.PI;",
		"var x = foo.Math();",
		"var x = new foo.Math();",
		"var x = new Math.foo;",
		"var x = new Math.foo();",
		"JSON.parse(foo)",
		"new JSON.parse",
		{
			code: "Reflect.get(foo, 'x')",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "new Reflect.foo(a, b)",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "Atomics.load(foo, 0)",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "new Atomics.foo()",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "new Intl.Segmenter()",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "Intl.foo()",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "Temporal.Now.instant()",
			languageOptions: { ecmaVersion: 2026 },
		},
		{
			code: "new Temporal.Instant(0n)",
			languageOptions: { ecmaVersion: 2026 },
		},

		{ code: "globalThis.Math();", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var x = globalThis.Math();",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "f(globalThis.Math());", languageOptions: { ecmaVersion: 6 } },
		{ code: "globalThis.Math().foo;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var x = globalThis.JSON();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "x = globalThis.JSON(str);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "globalThis.Math( globalThis.JSON() );",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = globalThis.Reflect();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = globalThis.Reflect();",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "/*globals Reflect: true*/ globalThis.Reflect();",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "var x = globalThis.Atomics();",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "var x = globalThis.Atomics();",
			languageOptions: { ecmaVersion: 2017, globals: { Atomics: false } },
		},
		{
			code: "var x = globalThis.Intl();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const x = globalThis.Temporal();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const x = globalThis.Temporal();",
			languageOptions: {
				ecmaVersion: 2015,
				globals: { Temporal: false },
			},
		},

		// non-existing variables
		"/*globals Math: off*/ Math();",
		"/*globals Math: off*/ new Math();",
		{
			code: "JSON();",
			languageOptions: {
				globals: { JSON: "off" },
			},
		},
		{
			code: "new JSON();",
			languageOptions: {
				globals: { JSON: "off" },
			},
		},
		"Reflect();",
		"Atomics();",
		"new Reflect();",
		"new Atomics();",
		{
			code: "Atomics();",
			languageOptions: { ecmaVersion: 6 },
		},
		"Intl()",
		"new Intl()",
		"Temporal();",
		"new Temporal();",

		// shadowed variables
		"var Math; Math();",
		"var Math; new Math();",
		{
			code: "let JSON; JSON();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let JSON; new JSON();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "if (foo) { const Reflect = 1; Reflect(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if (foo) { const Reflect = 1; new Reflect(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo(Math) { Math(); }",
		"function foo(JSON) { new JSON(); }",
		{
			code: "function foo(Atomics) { Atomics(); }",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "function foo() { if (bar) { let Atomics; if (baz) { new Atomics(); } } }",
			languageOptions: { ecmaVersion: 2017 },
		},
		"function foo() { var JSON; JSON(); }",
		{
			code: "function foo() { var Atomics = bar(); var baz = Atomics(5); }",
			languageOptions: { globals: { Atomics: false } },
		},
		{
			code: 'var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined; construct();',
			languageOptions: { globals: { Reflect: false } },
		},
		{
			code: "function foo(Intl) { Intl(); }",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "if (foo) { const Intl = 1; Intl(); }",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "if (foo) { const Intl = 1; new Intl(); }",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "function foo(Temporal) { Temporal(); }",
			languageOptions: { globals: { Temporal: false } },
		},
		{
			code: "if (foo) { const Temporal = 1; Temporal(); }",
			languageOptions: { ecmaVersion: 2026 },
		},
		{
			code: "if (foo) { const Temporal = 1; new Temporal(); }",
			languageOptions: { ecmaVersion: 2026 },
		},
	],
	invalid: [
		{
			code: "Math();",
		},
		{
			code: "var x = Math();",
		},
		{
			code: "f(Math());",
		},
		{
			code: "Math().foo;",
		},
		{
			code: "new Math;",
		},
		{
			code: "new Math();",
		},
		{
			code: "new Math(foo);",
		},
		{
			code: "new Math().foo;",
		},
		{
			code: "(new Math).foo();",
		},
		{
			code: "var x = JSON();",
		},
		{
			code: "x = JSON(str);",
		},
		{
			code: "var x = new JSON();",
		},
		{
			code: "Math( JSON() );",
		},
		{
			code: "var x = Reflect();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = new Reflect();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = Reflect();",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "/*globals Reflect: true*/ Reflect();",
		},
		{
			code: "/*globals Reflect: true*/ new Reflect();",
		},
		{
			code: "var x = Atomics();",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "var x = new Atomics();",
			languageOptions: { ecmaVersion: 2017 },
		},
		{
			code: "var x = Atomics();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = Atomics();",
			languageOptions: { globals: { Atomics: false } },
		},
		{
			code: "var x = new Atomics();",
			languageOptions: { globals: { Atomics: "writable" } },
		},
		{
			code: "var x = Intl();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "var x = new Intl();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "/*globals Intl: true*/ Intl();",
		},
		{
			code: "/*globals Intl: true*/ new Intl();",
		},
		{
			code: "Temporal();",
			languageOptions: { ecmaVersion: 2026 },
		},
		{
			code: "new Temporal();",
			languageOptions: { ecmaVersion: 2026 },
		},
		{
			code: "/* global Temporal */ Temporal();",
			languageOptions: { ecmaVersion: 2025 },
		},
		{
			code: "/* global Temporal */ new Temporal();",
			languageOptions: { ecmaVersion: 2025 },
		},
		{
			code: "const x = globalThis.Temporal();",
			languageOptions: {
				ecmaVersion: 2020,
				globals: { Temporal: false },
			},
		},
		{
			code: "const x = new globalThis.Temporal;",
			languageOptions: {
				ecmaVersion: 2020,
				globals: { Temporal: false },
			},
		},
		{
			code: "var x = globalThis.Math();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = new globalThis.Math();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "f(globalThis.Math());",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "globalThis.Math().foo;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "new globalThis.Math().foo;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = globalThis.JSON();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "x = globalThis.JSON(str);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "globalThis.Math( globalThis.JSON() );",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = globalThis.Reflect();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = new globalThis.Reflect;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "/*globals Reflect: true*/ Reflect();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = globalThis.Atomics();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = globalThis.Intl();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = new globalThis.Intl;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "/*globals Intl: true*/ Intl();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var foo = bar ? baz: JSON; foo();",
		},
		{
			code: "var foo = bar ? baz: JSON; new foo();",
		},
		{
			code: "const foo = Temporal; foo();",
			languageOptions: {
				ecmaVersion: 2015,
				globals: { Temporal: false },
			},
		},
		{
			code: "const foo = Temporal; new foo();",
			languageOptions: {
				ecmaVersion: 2015,
				globals: { Temporal: false },
			},
		},
		{
			code: "var foo = bar ? baz: globalThis.JSON; foo();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var foo = bar ? baz: globalThis.JSON; new foo();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const foo = bar ? baz: globalThis.Temporal; foo();",
			languageOptions: {
				ecmaVersion: 2020,
				globals: { Temporal: false },
			},
		},
		{
			code: "const foo = bar ? baz: globalThis.Temporal; new foo();",
			languageOptions: { ecmaVersion: 2026 },
		},
		{
			code: "var foo = window.Atomics; foo();",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},
		{
			code: "var foo = window.Atomics; new foo;",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},
		{
			code: "var foo = window.Intl; foo();",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},
		{
			code: "var foo = window.Intl; new foo;",
			languageOptions: { ecmaVersion: 2020, globals: globals.browser },
		},
		{
			code: "const foo = window.Temporal; foo();",
			languageOptions: { ecmaVersion: 2026, globals: globals.browser },
		},
		{
			code: "const foo = window.Temporal; new foo();",
			languageOptions: { ecmaVersion: 2026, globals: globals.browser },
		},

		// Optional chaining
		{
			code: "var x = globalThis?.Reflect();",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = (globalThis?.Reflect)();",
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
