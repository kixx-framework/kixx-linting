export default {
	valid: [
		"var a = 1 + 1;",
		"var a = 1 * '2';",
		"var a = 1 - 2;",
		"var a = foo + bar;",
		"var a = 'foo' + bar;",
		"var foo = 'foo' +\n 'bar';",

		// https://github.com/eslint/eslint/issues/3575
		"var string = (number + 1) + 'px';",
		"'a' + 1",
		"1 + '1'",
		{ code: "1 + `1`", languageOptions: { ecmaVersion: 6 } },
		{ code: "`1` + 1", languageOptions: { ecmaVersion: 6 } },
		{ code: "(1 + +2) + `b`", languageOptions: { ecmaVersion: 6 } },
	],

	invalid: [
		{
			code: "'a' + 'b'",
		},
		{
			code: "'a' +\n'b' + 'c'",
		},
		{
			code: "foo + 'a' + 'b'",
		},
		{
			code: "'a' + 'b' + 'c'",
		},
		{
			code: "(foo + 'a') + ('b' + 'c')",
		},
		{
			code: "`a` + 'b'",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`a` + `b`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo + `a` + `b`",
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
