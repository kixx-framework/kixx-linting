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
		"function foo() { if (true) { if (false) { return x; } } else { return y; } }",
		"function foo() { if (true) { return x; } return y; }",
		"function foo() { if (true) { for (;;) { return x; } } else { return y; } }",
		"function foo() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
		"function foo() { if (true) notAReturn(); else return y; }",
		"function foo() {if (x) { notAReturn(); } else if (y) { return true; } else { notAReturn(); } }",
		"function foo() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
		"if (0) { if (0) {} else {} } else {}",
		`
            function foo() {
                if (foo)
                    if (bar) return;
                    else baz;
                else qux;
            }
        `,
		`
            function foo() {
                while (foo)
                    if (bar) return;
                    else baz;
            }
        `,
		{
			code: "function foo19() { if (true) { return x; } else if (false) { return y; } }",
			options: [{ allowElseIf: true }],
		},
		{
			code: "function foo20() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
			options: [{ allowElseIf: true }],
		},
		{
			code: "function foo21() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
			options: [{ allowElseIf: true }],
		},
	],
	invalid: [
		{
			code: "function foo1() { if (true) { return x; } else { return y; } }",
		},
		{
			code: "function foo2() { if (true) { var x = bar; return x; } else { var y = baz; return y; } }",
		},
		{
			code: "function foo3() { if (true) return x; else return y; }",
		},
		{
			code: "function foo4() { if (true) { if (false) return x; else return y; } else { return z; } }",
		},
		{
			code: "function foo5() { if (true) { if (false) { if (true) return x; else { w = y; } } else { w = x; } } else { return z; } }",
		},
		{
			code: "function foo6() { if (true) { if (false) { if (true) return x; else return y; } } else { return z; } }",
		},
		{
			code: "function foo7() { if (true) { if (false) { if (true) return x; else return y; } return w; } else { return z; } }",
		},
		{
			code: "function foo8() { if (true) { if (false) { if (true) return x; else return y; } else { w = x; } } else { return z; } }",
		},
		{
			code: "function foo9() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
		},
		{
			code: "function foo9a() {if (x) { return true; } else if (y) { return true; } else { notAReturn(); } }",
			options: [{ allowElseIf: false }],
		},
		{
			code: "function foo9b() {if (x) { return true; } if (y) { return true; } else { notAReturn(); } }",
			options: [{ allowElseIf: false }],
		},
		{
			code: "function foo10() { if (foo) return bar; else (foo).bar(); }",
		},
		{
			code: "function foo11() { if (foo) return bar \nelse { [1, 2, 3].map(foo) } }",
		},
		{
			code: "function foo12() { if (foo) return bar \nelse { baz() } \n[1, 2, 3].map(foo) }",
		},
		{
			code: "function foo13() { if (foo) return bar; \nelse { [1, 2, 3].map(foo) } }",
		},
		{
			code: "function foo14() { if (foo) return bar \nelse { baz(); } \n[1, 2, 3].map(foo) }",
		},
		{
			code: "function foo15() { if (foo) return bar; else { baz() } qaz() }",
		},
		{
			code: "function foo16() { if (foo) return bar \nelse { baz() } qaz() }",
		},
		{
			code: "function foo17() { if (foo) return bar \nelse { baz() } \nqaz() }",
		},
		{
			code: "function foo18() { if (foo) return function() {} \nelse [1, 2, 3].map(bar) }",
		},
		{
			code: "function foo19() { if (true) { return x; } else if (false) { return y; } }",
			options: [{ allowElseIf: false }],
		},
		{
			code: "function foo20() {if (x) { return true; } else if (y) { notAReturn() } else { notAReturn(); } }",
			options: [{ allowElseIf: false }],
		},
		{
			code: "function foo21() { var x = true; if (x) { return x; } else if (x === false) { return false; } }",
			options: [{ allowElseIf: false }],
		},

		// https://github.com/eslint/eslint/issues/11069
		{
			code: "function foo() { var a; if (bar) { return true; } else { var a; } }",
		},
		{
			code: "function foo() { if (bar) { var a; if (baz) { return true; } else { var a; } } }",
		},
		{
			code: "function foo() { var a; if (bar) { return true; } else { var a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { var a; if (baz) { return true; } else { var a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; if (bar) { return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class foo { bar() { let a; if (baz) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { let a; if (baz) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() {let a; if (bar) { if (baz) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { const a = 1; if (bar) { return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { const a = 1; if (baz) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; if (bar) { return true; } else { const a = 1 } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { let a; if (baz) { return true; } else { const a = 1; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { class a {}; if (bar) { return true; } else { const a = 1; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { class a {}; if (baz) { return true; } else { const a = 1; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { const a = 1; if (bar) { return true; } else { class a {} } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { const a = 1; if (baz) { return true; } else { class a {} } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; if (bar) { return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { var a; return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let a; }  while (baz) { var a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a) { if (bar) { return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 1) { if (bar) { return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a, b = a) { if (bar) { return true; } else { let a; }  if (bar) { return true; } else { let b; }}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(...args) { if (bar) { return true; } else { let args; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { try {} catch (a) { if (bar) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { try {} catch (a) { if (bar) { if (baz) { return true; } else { let a; } } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { try {} catch ({bar, a = 1}) { if (baz) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let arguments; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let arguments; } return arguments[0]; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let arguments; } if (baz) { return arguments[0]; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let arguments; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let a; } a; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let a; } if (baz) { a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } a; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } if (quux) { a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a() { if (foo) { return true; } else { let a; } a(); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a() { if (a) { return true; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a() { if (foo) { return a; } else { let a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let a; } function baz() { a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } (() => a) } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let a; } var a; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } var a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } var { a } = {}; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } if (quux) { var a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } if (quux) { var a; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (quux) { var a; } if (bar) { if (baz) { return true; } else { let a; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else { let a; } function a(){} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (baz) { if (bar) { return true; } else { let a; } function a(){} } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } if (quux) { function a(){}  } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { if (baz) { return true; } else { let a; } } function a(){} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { let a; if (bar) { return true; } else { function a(){} } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { var a; if (bar) { return true; } else { function a(){} } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { if (bar) { return true; } else function baz() {} };",
		},
		{
			code: "if (foo) { return true; } else { let a; }",
			languageOptions: { ecmaVersion: 6, sourceType: "commonjs" },
		},
		{
			code: "let a; if (foo) { return true; } else { let a; }",
			languageOptions: { ecmaVersion: 6, sourceType: "commonjs" },
		},
	],
};
