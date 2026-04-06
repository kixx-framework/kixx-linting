export default {
	valid: [
		"var regex = /x1f/",
		String.raw`var regex = /\\x1f/`,
		"var regex = new RegExp('x1f')",
		"var regex = RegExp('x1f')",
		"new RegExp('[')",
		"RegExp('[')",
		"new (function foo(){})('\\x1f')",
		{ code: String.raw`/\u{20}/u`, languageOptions: { ecmaVersion: 2015 } },
		String.raw`/\u{1F}/`,
		String.raw`/\u{1F}/g`,
		String.raw`new RegExp("\\u{20}", "u")`,
		String.raw`new RegExp("\\u{1F}")`,
		String.raw`new RegExp("\\u{1F}", "g")`,
		String.raw`new RegExp("\\u{1F}", flags)`, // when flags are unknown, this rule assumes there's no `u` flag
		String.raw`new RegExp("[\\q{\\u{20}}]", "v")`,
		{
			code: String.raw`/[\u{20}--B]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
	],
	invalid: [
		{
			code: String.raw`var regex = /\x1f/`,
		},
		{
			code: String.raw`var regex = /\\\x1f\\x1e/`,
		},
		{
			code: String.raw`var regex = /\\\x1fFOO\\x00/`,
		},
		{
			code: String.raw`var regex = /FOO\\\x1fFOO\\x1f/`,
		},
		{
			code: "var regex = new RegExp('\\x1f\\x1e')",
		},
		{
			code: "var regex = new RegExp('\\x1fFOO\\x00')",
		},
		{
			code: "var regex = new RegExp('FOO\\x1fFOO\\x1f')",
		},
		{
			code: "var regex = RegExp('\\x1f')",
		},
		{
			code: "var regex = /(?<a>\\x1f)/",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: String.raw`var regex = /(?<\u{1d49c}>.)\x1f/`,
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: String.raw`new RegExp("\\u001F", flags)`,
		},
		{
			code: String.raw`/\u{1111}*\x1F/u`,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: String.raw`new RegExp("\\u{1111}*\\x1F", "u")`,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: String.raw`/\u{1F}/u`,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: String.raw`/\u{1F}/gui`,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: String.raw`new RegExp("\\u{1F}", "u")`,
		},
		{
			code: String.raw`new RegExp("\\u{1F}", "gui")`,
		},
		{
			code: String.raw`new RegExp("[\\q{\\u{1F}}]", "v")`,
		},
		{
			code: String.raw`/[\u{1F}--B]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/\x11/; RegExp("foo", "uv");`,
			languageOptions: { ecmaVersion: 2024 },
		},
	],
};
