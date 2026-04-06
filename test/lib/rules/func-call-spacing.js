export default {
	valid: [
		// default ("never")
		"f();",
		"f(a, b);",
		"f.b();",
		"f.b().c();",
		"f()()",
		"(function() {}())",
		"var f = new Foo()",
		"var f = new Foo",
		"f( (0) )",
		"( f )( 0 )",
		"( (f) )( (0) )",
		"( f()() )(0)",
		"(function(){ if (foo) { bar(); } }());",
		"f(0, (1))",
		"describe/**/('foo', function () {});",
		"new (foo())",
		{
			code: "import(source)",
			languageOptions: { ecmaVersion: 2020 },
		},

		// "never"
		{
			code: "f();",
			options: ["never"],
		},
		{
			code: "f(a, b);",
			options: ["never"],
		},
		{
			code: "f.b();",
			options: ["never"],
		},
		{
			code: "f.b().c();",
			options: ["never"],
		},
		{
			code: "f()()",
			options: ["never"],
		},
		{
			code: "(function() {}())",
			options: ["never"],
		},
		{
			code: "var f = new Foo()",
			options: ["never"],
		},
		{
			code: "var f = new Foo",
			options: ["never"],
		},
		{
			code: "f( (0) )",
			options: ["never"],
		},
		{
			code: "( f )( 0 )",
			options: ["never"],
		},
		{
			code: "( (f) )( (0) )",
			options: ["never"],
		},
		{
			code: "( f()() )(0)",
			options: ["never"],
		},
		{
			code: "(function(){ if (foo) { bar(); } }());",
			options: ["never"],
		},
		{
			code: "f(0, (1))",
			options: ["never"],
		},
		{
			code: "describe/**/('foo', function () {});",
			options: ["never"],
		},
		{
			code: "new (foo())",
			options: ["never"],
		},
		{
			code: "import(source)",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},

		// "always"
		{
			code: "f ();",
			options: ["always"],
		},
		{
			code: "f (a, b);",
			options: ["always"],
		},
		{
			code: "f.b ();",
			options: ["always"],
		},
		{
			code: "f.b ().c ();",
			options: ["always"],
		},
		{
			code: "f () ()",
			options: ["always"],
		},
		{
			code: "(function() {} ())",
			options: ["always"],
		},
		{
			code: "var f = new Foo ()",
			options: ["always"],
		},
		{
			code: "var f = new Foo",
			options: ["always"],
		},
		{
			code: "f ( (0) )",
			options: ["always"],
		},
		{
			code: "f (0) (1)",
			options: ["always"],
		},
		{
			code: "(f) (0)",
			options: ["always"],
		},
		{
			code: "f ();\n t   ();",
			options: ["always"],
		},
		{
			code: "import (source)",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},

		// "always", "allowNewlines": true
		{
			code: "f\n();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f.b \n ();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f\n() ().b \n()\n ()",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "var f = new Foo\n();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f// comment\n()",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f // comment\n ()",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f\n/*\n*/\n()",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f\r();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f\u2028();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f\u2029();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f\r\n();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "import\n(source)",
			options: ["always", { allowNewlines: true }],
			languageOptions: { ecmaVersion: 2020 },
		},

		// Optional chaining
		{
			code: "func?.()",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func ?.()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func?. ()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func ?. ()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		// default ("never")
		{
			code: "f ();",
		},
		{
			code: "f (a, b);",
		},
		{
			code: "f.b ();",
		},
		{
			code: "f.b().c ();",
		},
		{
			code: "f() ()",
		},
		{
			code: "(function() {} ())",
		},
		{
			code: "var f = new Foo ()",
		},
		{
			code: "f ( (0) )",
		},
		{
			code: "f(0) (1)",
		},
		{
			code: "(f) (0)",
		},
		{
			code: "f ();\n t   ();",
		},
		{
			code: "import (source);",
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/7787
		{
			code: "f\n();",
		},
		{
			code: "f\r();",
		},
		{
			code: "f\u2028();",
		},
		{
			code: "f\u2029();",
		},
		{
			code: "f\r\n();",
		},
		{
			code: "import\n(source);",
			languageOptions: { ecmaVersion: 2020 },
		},

		// "never"
		{
			code: "f ();",
			options: ["never"],
		},
		{
			code: "f (a, b);",
			options: ["never"],
		},
		{
			code: "f.b  ();",
			options: ["never"],
		},
		{
			code: "f.b().c ();",
			options: ["never"],
		},
		{
			code: "f() ()",
			options: ["never"],
		},
		{
			code: "(function() {} ())",
			options: ["never"],
		},
		{
			code: "var f = new Foo ()",
			options: ["never"],
		},
		{
			code: "f ( (0) )",
			options: ["never"],
		},
		{
			code: "f(0) (1)",
			options: ["never"],
		},
		{
			code: "(f) (0)",
			options: ["never"],
		},
		{
			code: "f ();\n t   ();",
			options: ["never"],
		},
		{
			code: "import (source);",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/7787
		{
			code: "f\n();",
			options: ["never"],
		},
		{
			code: [
				"this.cancelled.add(request)",
				"this.decrement(request)",
				"(0, request.reject)(new api.Cancel())",
			].join("\n"),
			options: ["never"],
		},
		{
			code: ["var a = foo", "(function(global) {}(this));"].join("\n"),
			options: ["never"],
		},
		{
			code: ["var a = foo", "(0, baz())"].join("\n"),
			options: ["never"],
		},
		{
			code: "f\r();",
			options: ["never"],
		},
		{
			code: "f\u2028();",
			options: ["never"],
		},
		{
			code: "f\u2029();",
			options: ["never"],
		},
		{
			code: "f\r\n();",
			options: ["never"],
		},

		// "always"
		{
			code: "f();",
			options: ["always"],
		},
		{
			code: "f\n();",
			options: ["always"],
		},
		{
			code: "f(a, b);",
			options: ["always"],
		},
		{
			code: "f\n(a, b);",
			options: ["always"],
		},
		{
			code: "f.b();",
			options: ["always"],
		},
		{
			code: "f.b\n();",
			options: ["always"],
		},
		{
			code: "f.b().c ();",
			options: ["always"],
		},
		{
			code: "f.b\n().c ();",
			options: ["always"],
		},
		{
			code: "f() ()",
			options: ["always"],
		},
		{
			code: "f\n() ()",
			options: ["always"],
		},
		{
			code: "f\n()()",
			options: ["always"],
		},
		{
			code: "(function() {}())",
			options: ["always"],
		},
		{
			code: "var f = new Foo()",
			options: ["always"],
		},
		{
			code: "f( (0) )",
			options: ["always"],
		},
		{
			code: "f(0) (1)",
			options: ["always"],
		},
		{
			code: "(f)(0)",
			options: ["always"],
		},
		{
			code: "import(source);",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "f();\n t();",
			options: ["always"],
		},
		{
			code: "f\r();",
			options: ["always"],
		},
		{
			code: "f\u2028();",
			options: ["always"],
		},
		{
			code: "f\u2029();",
			options: ["always"],
		},
		{
			code: "f\r\n();",
			options: ["always"],
		},

		// "always", "allowNewlines": true
		{
			code: "f();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f(a, b);",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f.b();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f.b().c ();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f() ()",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "(function() {}())",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "var f = new Foo()",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f( (0) )",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f(0) (1)",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "(f)(0)",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f();\n t();",
			options: ["always", { allowNewlines: true }],
		},
		{
			code: "f    ();",
		},
		{
			code: "f\n ();",
		},
		{
			code: "fn();",
			options: ["always"],
		},
		{
			code: "fnn\n (a, b);",
			options: ["always"],
		},
		{
			code: "f /*comment*/ ()",
			options: ["never"],
		},
		{
			code: "f /*\n*/ ()",
			options: ["never"],
		},
		{
			code: "f/*comment*/()",
			options: ["always"],
		},

		// Optional chaining
		{
			code: "func ?.()",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func?. ()",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func ?. ()",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func\n?.()",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func\n//comment\n?.()",
			options: ["never"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func?.()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func\n  ?.()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func?.\n  ()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func  ?.\n  ()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "func\n /*comment*/ ?.()",
			options: ["always"],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
