export default {
	valid: [
		"function foo() { return 0; }",
		"function* foo() { yield 0; }",
		"function* foo() { }",
		"(function* foo() { yield 0; })();",
		"(function* foo() { })();",
		"var obj = { *foo() { yield 0; } };",
		"var obj = { *foo() { } };",
		"class A { *foo() { yield 0; } };",
		"class A { *foo() { } };",
	],
	invalid: [
		{
			code: "function* foo() { return 0; }",
		},
		{
			code: "(function* foo() { return 0; })();",
		},
		{
			code: "var obj = { *foo() { return 0; } }",
		},
		{
			code: "class A { *foo() { return 0; } }",
		},
		{
			code: "function* foo() { function* bar() { yield 0; } }",
		},
		{
			code: "function* foo() { function* bar() { return 0; } yield 0; }",
		},
	],
};
