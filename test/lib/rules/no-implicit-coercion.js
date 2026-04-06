export default {
	valid: [
		"Boolean(foo)",
		"foo.indexOf(1) !== -1",
		"Number(foo)",
		"parseInt(foo)",
		"parseFloat(foo)",
		"String(foo)",
		"!foo",
		"~foo",
		"-foo",
		"+1234",
		"-1234",
		"- -1234",
		"+Number(lol)",
		"-parseFloat(lol)",
		"2 * foo",
		"1 * 1234",
		"123 - 0",
		"1 * Number(foo)",
		"1 * parseInt(foo)",
		"1 * parseFloat(foo)",
		"Number(foo) * 1",
		"Number(foo) - 0",
		"parseInt(foo) * 1",
		"parseFloat(foo) * 1",
		"- -Number(foo)",
		"1 * 1234 * 678 * Number(foo)",
		"1 * 1234 * 678 * parseInt(foo)",
		"(1 - 0) * parseInt(foo)",
		"1234 * 1 * 678 * Number(foo)",
		"1234 * 1 * Number(foo) * Number(bar)",
		"1234 * 1 * Number(foo) * parseInt(bar)",
		"1234 * 1 * Number(foo) * parseFloat(bar)",
		"1234 * 1 * parseInt(foo) * parseFloat(bar)",
		"1234 * 1 * parseInt(foo) * Number(bar)",
		"1234 * 1 * parseFloat(foo) * Number(bar)",
		"1234 * Number(foo) * 1 * Number(bar)",
		"1234 * parseInt(foo) * 1 * Number(bar)",
		"1234 * parseFloat(foo) * 1 * parseInt(bar)",
		"1234 * parseFloat(foo) * 1 * Number(bar)",
		"(- -1234) * (parseFloat(foo) - 0) * (Number(bar) - 0)",
		"1234*foo*1",
		"1234*1*foo",
		"1234*bar*1*foo",
		"1234*1*foo*bar",
		"1234*1*foo*Number(bar)",
		"1234*1*Number(foo)*bar",
		"1234*1*parseInt(foo)*bar",
		"0 + foo",
		"~foo.bar()",
		"foo + 'bar'",
		{ code: "foo + `${bar}`", languageOptions: { ecmaVersion: 6 } },

		{ code: "!!foo", options: [{ boolean: false }] },
		{ code: "~foo.indexOf(1)", options: [{ boolean: false }] },
		{ code: "+foo", options: [{ number: false }] },
		{ code: "-(-foo)", options: [{ number: false }] },
		{ code: "foo - 0", options: [{ number: false }] },
		{ code: "1*foo", options: [{ number: false }] },
		{ code: '""+foo', options: [{ string: false }] },
		{ code: 'foo += ""', options: [{ string: false }] },
		{ code: "var a = !!foo", options: [{ boolean: true, allow: ["!!"] }] },
		{
			code: "var a = ~foo.indexOf(1)",
			options: [{ boolean: true, allow: ["~"] }],
		},
		{ code: "var a = ~foo", options: [{ boolean: true }] },
		{ code: "var a = 1 * foo", options: [{ boolean: true, allow: ["*"] }] },
		{ code: "- -foo", options: [{ number: true, allow: ["- -"] }] },
		{ code: "foo - 0", options: [{ number: true, allow: ["-"] }] },
		{ code: "var a = +foo", options: [{ boolean: true, allow: ["+"] }] },
		{
			code: 'var a = "" + foo',
			options: [{ boolean: true, string: true, allow: ["+"] }],
		},

		// https://github.com/eslint/eslint/issues/7057
		"'' + 'foo'",
		{ code: "`` + 'foo'", languageOptions: { ecmaVersion: 6 } },
		{ code: "'' + `${foo}`", languageOptions: { ecmaVersion: 6 } },
		"'foo' + ''",
		{ code: "'foo' + ``", languageOptions: { ecmaVersion: 6 } },
		{ code: "`${foo}` + ''", languageOptions: { ecmaVersion: 6 } },
		"foo += 'bar'",
		{ code: "foo += `${bar}`", languageOptions: { ecmaVersion: 6 } },
		{
			code: "`a${foo}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${foo}b`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${foo}${bar}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "tag`${foo}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "`${foo}`", languageOptions: { ecmaVersion: 6 } },
		{
			code: "`${foo}`",
			options: [{}],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${foo}`",
			options: [{ disallowTemplateShorthand: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		"+42",

		// https://github.com/eslint/eslint/issues/14623
		"'' + String(foo)",
		"String(foo) + ''",
		{ code: "`` + String(foo)", languageOptions: { ecmaVersion: 6 } },
		{ code: "String(foo) + ``", languageOptions: { ecmaVersion: 6 } },
		{
			code: "`${'foo'}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${`foo`}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${String(foo)}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/16373
		"console.log(Math.PI * 1/4)",
		"a * 1 / 2",
		"a * 1 / b",
	],
	invalid: [
		{
			code: "!!foo",
		},
		{
			code: "!!(foo + bar)",
		},
		{
			code: "!!(foo + bar); var Boolean = null",
		},
		{
			code: "!!(foo + bar)",
			languageOptions: {
				globals: {
					Boolean: "off",
				},
			},
		},
		{
			code: "~foo.indexOf(1)",
		},
		{
			code: "~foo.bar.indexOf(2)",
		},
		{
			code: "+foo",
		},
		{
			code: "-(-foo)",
		},
		{
			code: "+foo.bar",
		},
		{
			code: "1*foo",
		},
		{
			code: "foo*1",
		},
		{
			code: "1*foo.bar",
		},
		{
			code: "foo.bar-0",
		},
		{
			code: '""+foo',
		},
		{
			code: "``+foo",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'foo+""',
		},
		{
			code: "foo+``",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '""+foo.bar',
		},
		{
			code: "``+foo.bar",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'foo.bar+""',
		},
		{
			code: "foo.bar+``",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${foo}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\\\n${foo}`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`${foo}\\\n`",
			options: [{ disallowTemplateShorthand: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'foo += ""',
		},
		{
			code: "foo += ``",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var a = !!foo",
			options: [{ boolean: true, allow: ["~"] }],
		},
		{
			code: "var a = ~foo.indexOf(1)",
			options: [{ boolean: true, allow: ["!!"] }],
		},
		{
			code: "var a = 1 * foo",
			options: [{ boolean: true, allow: ["+"] }],
		},
		{
			code: "var a = +foo",
			options: [{ boolean: true, allow: ["*"] }],
		},
		{
			code: 'var a = "" + foo',
			options: [{ boolean: true, allow: ["*"] }],
		},
		{
			code: "var a = `` + foo",
			options: [{ boolean: true, allow: ["*"] }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof+foo",
		},
		{
			code: "typeof +foo",
		},
		{
			code: "let x ='' + 1n;",
			languageOptions: { ecmaVersion: 2020 },
		},

		// Optional chaining
		{
			code: "~foo?.indexOf(1)",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "~(foo?.indexOf)(1)",
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/16373 regression tests
		{
			code: "1 * a / 2",
		},
		{
			code: "(a * 1) / 2",
		},
		{
			code: "a * 1 / (b * 1)",
		},
		{
			code: "a * 1 + 2",
		},
	],
};
