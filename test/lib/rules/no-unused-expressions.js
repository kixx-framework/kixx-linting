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
		"function f(){}",
		"a = b",
		"new a",
		"{}",
		"f(); g()",
		"i++",
		"a()",
		{ code: "a && a()", options: [{ allowShortCircuit: true }] },
		{ code: "a() || (b = c)", options: [{ allowShortCircuit: true }] },
		{ code: "a ? b() : c()", options: [{ allowTernary: true }] },
		{
			code: "a ? b() || (c = d) : e()",
			options: [{ allowShortCircuit: true, allowTernary: true }],
		},
		"delete foo.bar",
		"void new C",
		'"use strict";',
		'"directive one"; "directive two"; f();',
		'function foo() {"use strict"; return true; }',
		{
			code: 'var foo = () => {"use strict"; return true; }',
			languageOptions: { ecmaVersion: 6 },
		},
		'function foo() {"directive one"; "directive two"; f(); }',
		'function foo() { var foo = "use strict"; return true; }',
		{
			code: "function* foo(){ yield 0; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "async function foo() { await 5; }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await foo.bar; }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { bar && await baz; }",
			options: [{ allowShortCircuit: true }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { foo ? await bar : await baz; }",
			options: [{ allowTernary: true }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "tag`tagged template literal`",
			options: [{ allowTaggedTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "shouldNotBeAffectedByAllowTemplateTagsOption()",
			options: [{ allowTaggedTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'import("foo")',
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: 'func?.("foo")',
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: 'obj?.foo("bar")',
			languageOptions: { ecmaVersion: 11 },
		},

		// JSX
		{
			code: "<div />",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<></>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var partial = <div />",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var partial = <div />",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var partial = <></>",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: '"use strict";',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: '"directive one"; "directive two"; f();',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: 'function foo() {"use strict"; return true; }',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: 'function foo() {"directive one"; "directive two"; f(); }',
			options: [{ ignoreDirectives: true }],
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: '"use strict";',
			options: [{ ignoreDirectives: true }],
		},
		{
			code: '"directive one"; "directive two"; f();',
			options: [{ ignoreDirectives: true }],
		},
		{
			code: 'function foo() {"use strict"; return true; }',
			options: [{ ignoreDirectives: true }],
		},
		{
			code: 'function foo() {"directive one"; "directive two"; f(); }',
			options: [{ ignoreDirectives: true }],
		},
	],
	invalid: [
		{
			code: "0",
		},
		{
			code: "a",
		},
		{
			code: "f(), 0",
		},
		{
			code: "{0}",
		},
		{
			code: "[]",
		},
		{
			code: "a && b();",
		},
		{
			code: "a() || false",
		},
		{
			code: "a || (b = c)",
		},
		{
			code: "a ? b() || (c = d) : e",
		},
		{
			code: "`untagged template literal`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "tag`tagged template literal`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "a && b()",
			options: [{ allowTernary: true }],
		},
		{
			code: "a ? b() : c()",
			options: [{ allowShortCircuit: true }],
		},
		{
			code: "a || b",
			options: [{ allowShortCircuit: true }],
		},
		{
			code: "a() && b",
			options: [{ allowShortCircuit: true }],
		},
		{
			code: "a ? b : 0",
			options: [{ allowTernary: true }],
		},
		{
			code: "a ? b : c()",
			options: [{ allowTernary: true }],
		},
		{
			code: "foo.bar;",
		},
		{
			code: "!a",
		},
		{
			code: "+a",
		},
		{
			code: '"directive one"; f(); "directive two";',
		},
		{
			code: 'function foo() {"directive one"; f(); "directive two"; }',
		},
		{
			code: 'if (0) { "not a directive"; f(); }',
		},
		{
			code: 'function foo() { var foo = true; "use strict"; }',
		},
		{
			code: 'var foo = () => { var foo = true; "use strict"; }',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`untagged template literal`",
			options: [{ allowTaggedTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`untagged template literal`",
			options: [{ allowTaggedTemplates: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "tag`tagged template literal`",
			options: [{ allowTaggedTemplates: false }],
			languageOptions: { ecmaVersion: 6 },
		},

		// Optional chaining
		{
			code: "obj?.foo",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "obj?.foo.bar",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "obj?.foo().bar",
			languageOptions: { ecmaVersion: 2020 },
		},

		// JSX
		{
			code: "<div />",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<></>",
			options: [{ enforceForJSX: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},

		// class static blocks do not have directive prologues
		{
			code: "class C { static { 'use strict'; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { \n'foo'\n'bar'\n } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "foo;",
			options: [{ ignoreDirectives: true }],
		},
		{
			code: '"use strict";',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: '"directive one"; "directive two"; f();',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: 'function foo() {"use strict"; return true; }',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
		{
			code: 'function foo() {"directive one"; "directive two"; f(); }',
			languageOptions: { ecmaVersion: 3, sourceType: "script" },
		},
	],
};
