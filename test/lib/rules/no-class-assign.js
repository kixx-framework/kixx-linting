export default {
	valid: [
		"class A { } foo(A);",
		"let A = class A { }; foo(A);",
		"class A { b(A) { A = 0; } }",
		"class A { b() { let A; A = 0; } }",
		"let A = class { b() { A = 0; } }",

		// ignores non class.
		"var x = 0; x = 1;",
		"let x = 0; x = 1;",
		"const x = 0; x = 1;",
		"function x() {} x = 1;",
		"function foo(x) { x = 1; }",
		"try {} catch (x) { x = 1; }",
	],
	invalid: [
		{
			code: "class A { } A = 0;",
		},
		{
			code: "class A { } ({A} = 0);",
		},
		{
			code: "class A { } ({b: A = 0} = {});",
		},
		{
			code: "A = 0; class A { }",
		},
		{
			code: "class A { b() { A = 0; } }",
		},
		{
			code: "let A = class A { b() { A = 0; } }",
		},
		{
			code: "class A { } A = 0; A = 1;",
		},
	],
};
