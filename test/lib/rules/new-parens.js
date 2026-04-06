export default {
	valid: [
		// Default (Always)
		"var a = new Date();",
		"var a = new Date(function() {});",
		"var a = new (Date)();",
		"var a = new ((Date))();",
		"var a = (new Date());",
		"var a = new foo.Bar();",
		"var a = (new Foo()).bar;",
		{
			code: "new Storage<RootState>('state');",
			languageOptions: {
				parser: require(parser("typescript-parsers/new-parens")),
			},
		},

		// Explicit Always
		{ code: "var a = new Date();", options: ["always"] },
		{ code: "var a = new foo.Bar();", options: ["always"] },
		{ code: "var a = (new Foo()).bar;", options: ["always"] },

		// Never
		{ code: "var a = new Date;", options: ["never"] },
		{ code: "var a = new Date(function() {});", options: ["never"] },
		{ code: "var a = new (Date);", options: ["never"] },
		{ code: "var a = new ((Date));", options: ["never"] },
		{ code: "var a = (new Date);", options: ["never"] },
		{ code: "var a = new foo.Bar;", options: ["never"] },
		{ code: "var a = (new Foo).bar;", options: ["never"] },
		{ code: "var a = new Person('Name')", options: ["never"] },
		{ code: "var a = new Person('Name', 12)", options: ["never"] },
		{ code: "var a = new ((Person))('Name');", options: ["never"] },
	],
	invalid: [
		// Default (Always)
		{
			code: "var a = new Date;",
		},
		{
			code: "var a = new Date",
		},
		{
			code: "var a = new (Date);",
		},
		{
			code: "var a = new (Date)",
		},
		{
			code: "var a = (new Date)",
		},
		{
			// This `()` is `CallExpression`'s. This is a call of the result of `new Date`.
			code: "var a = (new Date)()",
		},
		{
			code: "var a = new foo.Bar;",
		},
		{
			code: "var a = (new Foo).bar;",
		},

		// Explicit always
		{
			code: "var a = new Date;",
			options: ["always"],
		},
		{
			code: "var a = new foo.Bar;",
			options: ["always"],
		},
		{
			code: "var a = (new Foo).bar;",
			options: ["always"],
		},
		{
			code: "var a = new new Foo()",
			options: ["always"],
		},

		// Never
		{
			code: "var a = new Date();",
			options: ["never"],
		},
		{
			code: "var a = new Date()",
			options: ["never"],
		},
		{
			code: "var a = new (Date)();",
			options: ["never"],
		},
		{
			code: "var a = new (Date)()",
			options: ["never"],
		},
		{
			code: "var a = (new Date())",
			options: ["never"],
		},
		{
			code: "var a = (new Date())()",
			options: ["never"],
		},
		{
			code: "var a = new foo.Bar();",
			options: ["never"],
		},
		{
			code: "var a = (new Foo()).bar;",
			options: ["never"],
		},
		{
			code: "var a = new new Foo()",
			options: ["never"],
		},
	],
};
