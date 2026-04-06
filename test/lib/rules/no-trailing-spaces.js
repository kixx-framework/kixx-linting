export default {
	valid: [
		{
			code: "var a = 5;",
			options: [{}],
		},
		{
			code: "var a = 5,\n    b = 3;",
			options: [{}],
		},
		"var a = 5;",
		"var a = 5,\n    b = 3;",
		{
			code: "var a = 5,\n    b = 3;",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "     ",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "\t",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "     \n    var c = 1;",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "\t\n\tvar c = 2;",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "\n   var c = 3;",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "\n\tvar c = 4;",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "let str = `${a}\n   \n${b}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let str = `${a}\n   \n${b}`;\n   \n   ",
			options: [{ skipBlankLines: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "// Trailing comment test. ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "// Trailing comment test.",
			options: [{ ignoreComments: false }],
		},
		{
			code: "// Trailing comment test.",
			options: [],
		},
		{
			code: "/* \nTrailing comments test. \n*/",
			options: [{ ignoreComments: true }],
		},
		{
			code: "#!/usr/bin/env node ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "/* \n */ // ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "/* \n */ /* \n */",
			options: [{ ignoreComments: true }],
		},
	],

	invalid: [
		{
			code:
				"var short2 = true;\r\n" +
				"\r\n" +
				"module.exports = {\r\n" +
				"  short: short,    \r\n" +
				"  short2: short\r\n" +
				"}",
		},
		{
			code:
				"var short2 = true;\n" +
				"\r\n" +
				"module.exports = {\r\n" +
				"  short: short,    \r\n" +
				"  short2: short\n" +
				"}",
		},
		{
			code:
				"var short2 = true;\n" +
				"\n" +
				"module.exports = {\n" +
				"  short: short,    \n" +
				"  short2: short\n" +
				"}\n",
		},
		{
			code:
				"var short2 = true;\n" +
				"\n" +
				"module.exports = {\n" +
				"  short,    \n" +
				"  short2\n" +
				"}\n",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code:
				"\n" +
				'measAr.push("<dl></dl>",  \n' +
				"         \" </dt><dd class ='pta-res'>\");",
		},
		{
			code:
				'measAr.push("<dl></dl>",  \n' +
				"         \" </dt><dd class ='pta-res'>\");",
		},
		{
			code: "var a = 5;      \n",
		},
		{
			code: "var a = 5; \n b = 3; ",
		},
		{
			code: "var a = 5; \n\n b = 3; ",
		},
		{
			code: "var a = 5;\t\n  b = 3;",
		},
		{
			code: "     \n    var c = 1;",
		},
		{
			code: "\t\n\tvar c = 2;",
		},
		{
			code: "var a = 5;      \n",
			options: [{}],
		},
		{
			code: "var a = 5; \n b = 3; ",
			options: [{}],
		},
		{
			code: "var a = 5;\t\n  b = 3;",
			options: [{}],
		},
		{
			code: "     \n    var c = 1;",
			options: [{}],
		},
		{
			code: "\t\n\tvar c = 2;",
			options: [{}],
		},
		{
			code: "var a = 'bar';  \n \n\t",
			options: [
				{
					skipBlankLines: true,
				},
			],
		},
		{
			code: "var a = 'foo';   \nvar b = 'bar';  \n  \n",
			options: [
				{
					skipBlankLines: true,
				},
			],
		},
		{
			code: "let str = `${a}\n  \n${b}`;  \n",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let str = `\n${a}\n  \n${b}`;  \n\t",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let str = `  \n  ${a}\n  \n${b}`;  \n",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let str = `${a}\n  \n${b}`;  \n  \n",
			options: [
				{
					skipBlankLines: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/6933
		{
			code: "    \nabcdefg ",
			options: [{ skipBlankLines: true }],
		},
		{
			code: "    \nabcdefg ",
		},

		// Tests for ignoreComments flag.
		{
			code: "var foo = 'bar'; ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "/* */ ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "/* */foo ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "/* \n */ ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "/* \n */ foo ",
			options: [{ ignoreComments: true }],
		},
		{
			code: "// Trailing comment test. ",
			options: [{ ignoreComments: false }],
		},
		{
			code: "/* \nTrailing comments test. \n*/",
			options: [{ ignoreComments: false }],
		},
		{
			code: "#!/usr/bin/env node ",
			options: [{ ignoreComments: false }],
		},
		{
			code: "// Trailing comment default test. ",
			options: [],
		},
	],
};
