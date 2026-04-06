export default {
	valid: [
		//------------------------------------------------------------------------------
		// General
		//------------------------------------------------------------------------------

		// not a promise executor
		"function foo(resolve, reject) { return 1; }",
		"function Promise(resolve, reject) { return 1; }",
		"(function (resolve, reject) { return 1; })",
		"(function foo(resolve, reject) { return 1; })",
		"(function Promise(resolve, reject) { return 1; })",
		"var foo = function (resolve, reject) { return 1; }",
		"var foo = function Promise(resolve, reject) { return 1; }",
		"var Promise = function (resolve, reject) { return 1; }",
		"(resolve, reject) => { return 1; }",
		"(resolve, reject) => 1",
		"var foo = (resolve, reject) => { return 1; }",
		"var Promise = (resolve, reject) => { return 1; }",
		"var foo = (resolve, reject) => 1",
		"var Promise = (resolve, reject) => 1",
		"var foo = { bar(resolve, reject) { return 1; } }",
		"var foo = { Promise(resolve, reject) { return 1; } }",
		"new foo(function (resolve, reject) { return 1; });",
		"new foo(function bar(resolve, reject) { return 1; });",
		"new foo(function Promise(resolve, reject) { return 1; });",
		"new foo((resolve, reject) => { return 1; });",
		"new foo((resolve, reject) => 1);",
		"new promise(function foo(resolve, reject) { return 1; });",
		"new Promise.foo(function foo(resolve, reject) { return 1; });",
		"new foo.Promise(function foo(resolve, reject) { return 1; });",
		"new Promise.Promise(function foo(resolve, reject) { return 1; });",
		"new Promise()(function foo(resolve, reject) { return 1; });",

		// not a promise executor - Promise() without new
		"Promise(function (resolve, reject) { return 1; });",
		"Promise((resolve, reject) => { return 1; });",
		"Promise((resolve, reject) => 1);",

		// not a promise executor - not the first argument
		"new Promise(foo, function (resolve, reject) { return 1; });",
		"new Promise(foo, (resolve, reject) => { return 1; });",
		"new Promise(foo, (resolve, reject) => 1);",

		// global Promise doesn't exist
		"/* globals Promise:off */ new Promise(function (resolve, reject) { return 1; });",
		{
			code: "new Promise((resolve, reject) => { return 1; });",
			languageOptions: {
				globals: { Promise: "off" },
			},
		},

		// global Promise is shadowed
		"let Promise; new Promise(function (resolve, reject) { return 1; });",
		"function f() { new Promise((resolve, reject) => { return 1; }); var Promise; }",
		"function f(Promise) { new Promise((resolve, reject) => 1); }",
		"if (x) { const Promise = foo(); new Promise(function (resolve, reject) { return 1; }); }",
		"x = function Promise() { new Promise((resolve, reject) => { return 1; }); }",

		// return without a value is allowed
		"new Promise(function (resolve, reject) { return; });",
		"new Promise(function (resolve, reject) { reject(new Error()); return; });",
		"new Promise(function (resolve, reject) { if (foo) { return; } });",
		"new Promise((resolve, reject) => { return; });",
		"new Promise((resolve, reject) => { if (foo) { resolve(1); return; } reject(new Error()); });",

		// throw is allowed
		"new Promise(function (resolve, reject) { throw new Error(); });",
		"new Promise((resolve, reject) => { throw new Error(); });",

		// not returning from the promise executor
		"new Promise(function (resolve, reject) { function foo() { return 1; } });",
		"new Promise((resolve, reject) => { (function foo() { return 1; })(); });",
		"new Promise(function (resolve, reject) { () => { return 1; } });",
		"new Promise((resolve, reject) => { () => 1 });",
		"function foo() { return new Promise(function (resolve, reject) { resolve(bar); }) };",
		"foo => new Promise((resolve, reject) => { bar(foo, (err, data) => { if (err) { reject(err); return; } resolve(data); })});",

		// promise executors do not have effect on other functions (tests function info tracking)
		"new Promise(function (resolve, reject) {}); function foo() { return 1; }",
		"new Promise((resolve, reject) => {}); (function () { return 1; });",
		"new Promise(function (resolve, reject) {}); () => { return 1; };",
		"new Promise((resolve, reject) => {}); () => 1;",

		// does not report global return
		{
			code: "return 1;",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "return 1;",
			languageOptions: {
				sourceType: "script",
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "return 1; function foo(){ return 1; } return 1;",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "function foo(){} return 1; var bar = function*(){ return 1; }; return 1; var baz = () => {}; return 1;",
			languageOptions: { sourceType: "commonjs" },
		},
		{
			code: "new Promise(function (resolve, reject) {}); return 1;",
			languageOptions: { sourceType: "commonjs" },
		},

		/*
		 * allowVoid: true
		 * `=> void` and `return void` are allowed
		 */
		{
			code: "new Promise((r) => void cbf(r));",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => void 0)",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => { return void 0 })",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => { if (foo) { return void 0 } return void 0 })",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		"new Promise(r => {0})",
	],

	invalid: [
		// full error tests
		{
			code: "new Promise(function (resolve, reject) { return 1; })",
		},
		{
			code: "new Promise((resolve, reject) => resolve(1))",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise((resolve, reject) => { return 1 })",
			options: [
				{
					allowVoid: true,
				},
			],
		},

		// suggestions arrow function expression
		{
			code: "new Promise(r => 1)",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => 1 ? 2 : 3)",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => (1 ? 2 : 3))",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => (1))",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => () => {})",
			options: [
				{
					allowVoid: true,
				},
			],
		},

		// primitives
		{
			code: "new Promise(r => null)",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => null)",
			options: [
				{
					allowVoid: false,
				},
			],
		},

		// inline comments
		{
			code: "new Promise(r => /*hi*/ ~0)",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => /*hi*/ ~0)",
			options: [
				{
					allowVoid: false,
				},
			],
		},

		// suggestions function
		{
			code: "new Promise(r => { return 0 })",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r => { return 0 })",
			options: [
				{
					allowVoid: false,
				},
			],
		},

		// multiple returns
		{
			code: "new Promise(r => { if (foo) { return void 0 } return 0 })",
			options: [
				{
					allowVoid: true,
				},
			],
		},

		// return assignment
		{
			code: "new Promise(resolve => { return (foo = resolve(1)); })",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(resolve => r = resolve)",
			options: [
				{
					allowVoid: true,
				},
			],
		},

		// return<immediate token> (range check)
		{
			code: "new Promise(r => { return(1) })",
			options: [
				{
					allowVoid: true,
				},
			],
		},
		{
			code: "new Promise(r =>1)",
			options: [
				{
					allowVoid: true,
				},
			],
		},

		// snapshot
		{
			code: "new Promise(r => ((1)))",
			options: [
				{
					allowVoid: true,
				},
			],
		},

		// other basic tests
		{
			code: "new Promise(function foo(resolve, reject) { return 1; })",
		},
		{
			code: "new Promise((resolve, reject) => { return 1; })",
		},

		// any returned value
		{
			code: "new Promise(function (resolve, reject) { return undefined; })",
		},
		{
			code: "new Promise((resolve, reject) => { return null; })",
		},
		{
			code: "new Promise(function (resolve, reject) { return false; })",
		},
		{
			code: "new Promise((resolve, reject) => resolve)",
		},
		{
			code: "new Promise((resolve, reject) => null)",
		},
		{
			code: "new Promise(function (resolve, reject) { return resolve(foo); })",
		},
		{
			code: "new Promise((resolve, reject) => { return reject(foo); })",
		},
		{
			code: "new Promise((resolve, reject) => x + y)",
		},
		{
			code: "new Promise((resolve, reject) => { return Promise.resolve(42); })",
		},

		// any return statement location
		{
			code: "new Promise(function (resolve, reject) { if (foo) { return 1; } })",
		},
		{
			code: "new Promise((resolve, reject) => { try { return 1; } catch(e) {} })",
		},
		{
			code: "new Promise(function (resolve, reject) { while (foo){ if (bar) break; else return 1; } })",
		},

		// `return void` is not allowed without `allowVoid: true`
		{
			code: "new Promise(() => { return void 1; })",
		},

		{
			code: "new Promise(() => (1))",
		},
		{
			code: "() => new Promise(() => ({}));",
		},

		// absence of arguments has no effect
		{
			code: "new Promise(function () { return 1; })",
		},
		{
			code: "new Promise(() => { return 1; })",
		},
		{
			code: "new Promise(() => 1)",
		},

		// various scope tracking tests
		{
			code: "function foo() {} new Promise(function () { return 1; });",
		},
		{
			code: "function foo() { return; } new Promise(() => { return 1; });",
		},
		{
			code: "function foo() { return 1; } new Promise(() => { return 2; });",
		},
		{
			code: "function foo () { return new Promise(function () { return 1; }); }",
		},
		{
			code: "function foo() { return new Promise(() => { bar(() => { return 1; }); return false; }); }",
		},
		{
			code: "() => new Promise(() => { if (foo) { return 0; } else bar(() => { return 1; }); })",
		},
		{
			code: "function foo () { return 1; return new Promise(function () { return 2; }); return 3;}",
		},
		{
			code: "() => 1; new Promise(() => { return 1; })",
		},
		{
			code: "new Promise(function () { return 1; }); function foo() { return 1; } ",
		},
		{
			code: "() => new Promise(() => { return 1; });",
		},
		{
			code: "() => new Promise(() => 1);",
		},
		{
			code: "() => new Promise(() => () => 1);",
		},
		{
			code: "() => new Promise(() => async () => 1);",
			languageOptions: { ecmaVersion: 2017 },

			// for async
		},
		{
			// No suggestion since an unnamed FunctionExpression inside braces is invalid syntax.
			code: "() => new Promise(() => function () {});",
		},
		{
			code: "() => new Promise(() => function foo() {});",
		},
		{
			code: "() => new Promise(() => []);",
		},

		// edge cases for global Promise reference
		{
			code: "new Promise((Promise) => { return 1; })",
		},
		{
			code: "new Promise(function Promise(resolve, reject) { return 1; })",
		},
	],
};
