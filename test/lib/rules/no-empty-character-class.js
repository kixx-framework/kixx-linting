export default {
	valid: [
		"var foo = /^abc[a-zA-Z]/;",
		'var regExp = new RegExp("^abc[]");',
		"var foo = /^abc/;",
		"var foo = /[\\[]/;",
		"var foo = /[\\]]/;",
		"var foo = /\\[][\\]]/;",
		"var foo = /[a-zA-Z\\[]/;",
		"var foo = /[[]/;",
		"var foo = /[\\[a-z[]]/;",
		"var foo = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g;",
		"var foo = /\\s*:\\s*/gim;",
		"var foo = /[^]/;", // this rule allows negated empty character classes
		"var foo = /\\[][^]/;",
		{ code: "var foo = /[\\]]/uy;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = /[\\]]/s;", languageOptions: { ecmaVersion: 2018 } },
		{ code: "var foo = /[\\]]/d;", languageOptions: { ecmaVersion: 2022 } },
		"var foo = /\\[]/",
		{ code: "var foo = /[[^]]/v;", languageOptions: { ecmaVersion: 2024 } },
		{
			code: "var foo = /[[\\]]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[\\[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a--b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a&&b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[a][b]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[\\q{}]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[^]--\\p{ASCII}]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
	],
	invalid: [
		{
			code: "var foo = /^abc[]/;",
		},
		{
			code: "var foo = /foo[]bar/;",
		},
		{
			code: "if (foo.match(/^abc[]/)) {}",
		},
		{
			code: "if (/^abc[]/.test(foo)) {}",
		},
		{
			code: "var foo = /[]]/;",
		},
		{
			code: "var foo = /\\[[]/;",
		},
		{
			code: "var foo = /\\[\\[\\]a-z[]/;",
		},
		{
			code: "var foo = /[]]/d;",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "var foo = /[(]\\u{0}*[]/u;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "var foo = /[]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[a][]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a[[b[]c]]d]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a--[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[]--b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[a&&[]]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "var foo = /[[]&&b]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},
	],
};
