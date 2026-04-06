export default {
	valid: [
		"function foo() { var foo = bar; }",
		"function foo(foo) { foo = bar; }",
		"function foo() { var foo; foo = bar; }",
		{
			code: "var foo = () => {}; foo = bar;",
			languageOptions: { ecmaVersion: 6 },
		},
		"var foo = function() {}; foo = bar;",
		"var foo = function() { foo = bar; };",
		{
			code: "import bar from 'bar'; function foo() { var foo = bar; }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
	],
	invalid: [
		{
			code: "function foo() {}; foo = bar;",
		},
		{
			code: "function foo() { foo = bar; }",
		},
		{
			code: "foo = bar; function foo() { };",
		},
		{
			code: "[foo] = bar; function foo() { };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "({x: foo = 0} = bar); function foo() { };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { [foo] = bar; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { ({x: foo = 0} = bar); function foo() { }; })();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var a = function foo() { foo = 123; };",
		},
	],
};
