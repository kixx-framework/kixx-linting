export default {
	valid: [
		// "never" mode
		{ code: "foo();", options: ["never"] },
		{ code: "function foo() { return; }", options: ["never"] },
		{ code: "var foo = function() { return; };", options: ["never"] },
		{ code: "foo(); 'use strict';", options: ["never"] },
		{
			code: "function foo() { bar(); 'use strict'; return; }",
			options: ["never"],
		},
		{
			code: "var foo = function() { { 'use strict'; } return; };",
			options: ["never"],
		},
		{
			code: "(function() { bar('use strict'); return; }());",
			options: ["never"],
		},
		{
			code: "var fn = x => 1;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var fn = x => { return; };",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo();",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() { return; }",
			options: ["never"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// "global" mode
		{ code: "// Intentionally empty", options: ["global"] },
		{ code: '"use strict"; foo();', options: ["global"] },
		{
			code: "/* license */\n/* eslint-disable rule-to-test/strict */\nfoo();",
			options: ["global"],
		},
		{
			code: "foo();",
			options: ["global"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() { return; }",
			options: ["global"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; function foo() { return; }",
			options: ["global"],
		},
		{
			code: "'use strict'; var foo = function() { return; };",
			options: ["global"],
		},
		{
			code: "'use strict'; function foo() { bar(); 'use strict'; return; }",
			options: ["global"],
		},
		{
			code: "'use strict'; var foo = function() { bar(); 'use strict'; return; };",
			options: ["global"],
		},
		{
			code: "'use strict'; function foo() { return function() { bar(); 'use strict'; return; }; }",
			options: ["global"],
		},
		{
			code: "'use strict'; var foo = () => { return () => { bar(); 'use strict'; return; }; }",
			options: ["global"],
			languageOptions: { ecmaVersion: 6 },
		},

		// "function" mode
		{
			code: "function foo() { 'use strict'; return; }",
			options: ["function"],
		},
		{
			code: "function foo() { return; }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() { return; }",
			options: ["function"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "var foo = function() { return; }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = function() { 'use strict'; return; }",
			options: ["function"],
		},
		{
			code: "function foo() { 'use strict'; return; } var bar = function() { 'use strict'; bar(); };",
			options: ["function"],
		},
		{
			code: "var foo = function() { 'use strict'; function bar() { return; } bar(); };",
			options: ["function"],
		},
		{
			code: "var foo = () => { 'use strict'; var bar = () => 1; bar(); };",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = () => { var bar = () => 1; bar(); };",
			options: ["function"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "class A { constructor() { } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() { } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() { function bar() { } } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { 'use strict'; function foo(a = 0) { } }())",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},

		// "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
		{ code: "function foo() { 'use strict'; return; }", options: ["safe"] },
		{
			code: "'use strict'; function foo() { return; }",
			options: ["safe"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "function foo() { return; }",
			options: ["safe"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() { return; }",
			options: ["safe"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// defaults to "safe" mode
		"function foo() { 'use strict'; return; }",
		{
			code: "'use strict'; function foo() { return; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "function foo() { return; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() { return; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// class static blocks do not have directive prologues, therefore this rule should never require od disallow "use strict" statement in them.
		{
			code: "'use strict'; class C { static { foo; } }",
			options: ["global"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "'use strict'; class C { static { 'use strict'; } }",
			options: ["global"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "'use strict'; class C { static { 'use strict'; 'use strict'; } }",
			options: ["global"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo; } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { 'use strict'; } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { 'use strict'; 'use strict'; } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo; } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { 'use strict'; } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { 'use strict'; 'use strict'; } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { 'use strict'; } }",
			options: ["safe"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { 'use strict'; } }",
			options: ["safe"],
			languageOptions: {
				ecmaVersion: 2022,
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; module.exports = function identity (value) { return value; }",
			languageOptions: {
				sourceType: "commonjs",
			},
		},
		{
			code: "'use strict'; module.exports = function identity (value) { return value; }",
			options: ["safe"],
			languageOptions: {
				sourceType: "commonjs",
			},
		},
	],
	invalid: [
		// "never" mode
		{
			code: '"use strict"; foo();',
			options: ["never"],
		},
		{
			code: "function foo() { 'use strict'; return; }",
			options: ["never"],
		},
		{
			code: "var foo = function() { 'use strict'; return; };",
			options: ["never"],
		},
		{
			code: "function foo() { return function() { 'use strict'; return; }; }",
			options: ["never"],
		},
		{
			code: "'use strict'; function foo() { \"use strict\"; return; }",
			options: ["never"],
		},
		{
			code: '"use strict"; foo();',
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["never"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["never"],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// "global" mode
		{
			code: "foo();",
			options: ["global"],
		},
		{
			code: "/* license */\nfunction foo() {}\nfunction bar() {}\n/* end */",
			options: ["global"],
		},
		{
			code: "function foo() { 'use strict'; return; }",
			options: ["global"],
		},
		{
			code: "var foo = function() { 'use strict'; return; }",
			options: ["global"],
		},
		{
			code: "var foo = () => { 'use strict'; return () => 1; }",
			options: ["global"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["global"],
		},
		{
			code: "'use strict'; var foo = function() { 'use strict'; return; };",
			options: ["global"],
		},
		{
			code: "'use strict'; 'use strict'; foo();",
			options: ["global"],
		},
		{
			code: "'use strict'; foo();",
			options: ["global"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["global"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["global"],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// "function" mode
		{
			code: "'use strict'; foo();",
			options: ["function"],
		},
		{
			code: "'use strict'; (function() { 'use strict'; return true; }());",
			options: ["function"],
		},
		{
			code: "(function() { 'use strict'; function f() { 'use strict'; return } return true; }());",
			options: ["function"],
		},
		{
			code: "(function() { return true; }());",
			options: ["function"],
		},
		{
			code: "(() => { return true; })();",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(() => true)();",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = function() { foo(); 'use strict'; return; }; function bar() { foo(); 'use strict'; }",
			options: ["function"],
		},
		{
			code: "function foo() { 'use strict'; 'use strict'; return; }",
			options: ["function"],
		},
		{
			code: "var foo = function() { 'use strict'; 'use strict'; return; }",
			options: ["function"],
		},
		{
			code: "var foo = function() {  'use strict'; return; }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["function"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["function"],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "function foo() { return function() { 'use strict'; return; }; }",
			options: ["function"],
		},
		{
			code: "var foo = function() { function bar() { 'use strict'; return; } return; }",
			options: ["function"],
		},
		{
			code: "function foo() { 'use strict'; return; } var bar = function() { return; };",
			options: ["function"],
		},
		{
			code: "var foo = function() { 'use strict'; return; }; function bar() { return; };",
			options: ["function"],
		},
		{
			code: "function foo() { 'use strict'; return function() { 'use strict'; 'use strict'; return; }; }",
			options: ["function"],
		},
		{
			code: "var foo = function() { 'use strict'; function bar() { 'use strict'; 'use strict'; return; } }",
			options: ["function"],
		},
		{
			code: "var foo = () => { return; };",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},

		// Classes
		{
			code: 'class A { constructor() { "use strict"; } }',
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'class A { foo() { "use strict"; } }',
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'class A { foo() { function bar() { "use strict"; } } }',
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'class A { field = () => { "use strict"; } }',
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: 'class A { field = function() { "use strict"; } }',
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},

		// "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
		{
			code: "'use strict'; function foo() { return; }",
			options: ["safe"],
		},
		{
			code: "function foo() { 'use strict'; return; }",
			options: ["safe"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["safe"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			options: ["safe"],
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// Default to "safe" mode
		{
			code: "'use strict'; function foo() { return; }",
		},
		{
			code: "function foo() { return; }",
		},
		{
			code: "function foo() { 'use strict'; return; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			languageOptions: {
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "'use strict'; function foo() { 'use strict'; return; }",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},

		// Reports deprecated syntax: https://github.com/eslint/eslint/issues/6405
		{
			code: "function foo(a = 0) { 'use strict' }",
			options: [],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
			options: [],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 0) { 'use strict' }",
			options: [],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "'use strict'; function foo(a = 0) { 'use strict' }",
			options: [],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "function foo(a = 0) { 'use strict' }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 0) { 'use strict' }",
			options: ["global"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "'use strict'; function foo(a = 0) { 'use strict' }",
			options: ["global"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 0) { 'use strict' }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 0) { }",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { function foo(a = 0) { } }())",
			options: ["function"],
			languageOptions: { ecmaVersion: 6 },
		},

		// functions inside class static blocks should be checked
		{
			code: "'use strict'; class C { static { function foo() { \n'use strict'; } } }",
			options: ["global"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { function foo() { \n'use strict'; } } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { function foo() { \n'use strict'; } } }",
			options: ["safe"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C { static { function foo() { \n'use strict'; } } }",
			options: ["safe"],
			languageOptions: {
				ecmaVersion: 2022,
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{
			code: "function foo() {'use strict'; class C { static { function foo() { \n'use strict'; } } } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { function foo() { \n'use strict'; } } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { function foo() { \n'use strict';\n'use strict'; } } }",
			options: ["function"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "module.exports = function identity (value) { return value; }",
			options: ["safe"],
			languageOptions: {
				sourceType: "commonjs",
			},
		},
		{
			code: "module.exports = function identity (value) { return value; }",
			languageOptions: {
				sourceType: "commonjs",
			},
		},
	],
};
