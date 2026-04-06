export default {
	valid: [
		"var a, b, c,\nd = 0;",
		"var a = 1; var b = 2; var c = 3;\nvar d = 0;",
		"var a = 1 + (b === 10 ? 5 : 4);",
		{
			code: "const a = 1, b = 2, c = 3;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = 1;\nconst b = 2;\n const c = 3;",
			languageOptions: { ecmaVersion: 6 },
		},
		"for(var a = 0, b = 0;;){}",
		{
			code: "for(let a = 0, b = 0;;){}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for(const a = 0, b = 0;;){}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export let a, b;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export let a,\n b = 0;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "const x = {};const y = {};x.one = y.one = 1;",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let a, b;a = b = 1",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { [foo = 0] = 0 }",
			languageOptions: { ecmaVersion: 2022 },
		},
	],

	invalid: [
		{
			code: "var a = b = c;",
		},
		{
			code: "var a = b = c = d;",
		},
		{
			code: "let foo = bar = cee = 100;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "a=b=c=d=e",
		},
		{
			code: "a=b=c",
		},

		{
			code: "a\n=b\n=c",
		},

		{
			code: "var a = (b) = (((c)))",
		},

		{
			code: "var a = ((b)) = (c)",
		},

		{
			code: "var a = b = ( (c * 12) + 2)",
		},

		{
			code: "var a =\n((b))\n = (c)",
		},

		{
			code: "a = b = '=' + c + 'foo';",
		},
		{
			code: "a = b = 7 * 12 + 5;",
		},
		{
			code: "const x = {};\nconst y = x.one = 1;",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let a, b;a = b = 1",
			options: [{}],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x, y;x = y = 'baz'",
			options: [{ ignoreNonDeclaration: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = b = 1",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { field = foo = 0 }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = foo = 0 }",
			options: [{ ignoreNonDeclaration: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
};
