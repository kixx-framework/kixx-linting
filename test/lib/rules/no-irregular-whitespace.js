export default {
	valid: [
		"'\\u000B';",
		"'\\u000C';",
		"'\\u0085';",
		"'\\u00A0';",
		"'\\u180E';",
		"'\\ufeff';",
		"'\\u2000';",
		"'\\u2001';",
		"'\\u2002';",
		"'\\u2003';",
		"'\\u2004';",
		"'\\u2005';",
		"'\\u2006';",
		"'\\u2007';",
		"'\\u2008';",
		"'\\u2009';",
		"'\\u200A';",
		"'\\u200B';",
		"'\\u2028';",
		"'\\u2029';",
		"'\\u202F';",
		"'\\u205f';",
		"'\\u3000';",
		"'\u000B';",
		"'\u000C';",
		"'\u0085';",
		"'\u00A0';",
		"'\u180E';",
		"'\ufeff';",
		"'\u2000';",
		"'\u2001';",
		"'\u2002';",
		"'\u2003';",
		"'\u2004';",
		"'\u2005';",
		"'\u2006';",
		"'\u2007';",
		"'\u2008';",
		"'\u2009';",
		"'\u200A';",
		"'\u200B';",
		"'\\\u2028';", // multiline string
		"'\\\u2029';", // multiline string
		"'\u202F';",
		"'\u205f';",
		"'\u3000';",
		{ code: "// \u000B", options: [{ skipComments: true }] },
		{ code: "// \u000C", options: [{ skipComments: true }] },
		{ code: "// \u0085", options: [{ skipComments: true }] },
		{ code: "// \u00A0", options: [{ skipComments: true }] },
		{ code: "// \u180E", options: [{ skipComments: true }] },
		{ code: "// \ufeff", options: [{ skipComments: true }] },
		{ code: "// \u2000", options: [{ skipComments: true }] },
		{ code: "// \u2001", options: [{ skipComments: true }] },
		{ code: "// \u2002", options: [{ skipComments: true }] },
		{ code: "// \u2003", options: [{ skipComments: true }] },
		{ code: "// \u2004", options: [{ skipComments: true }] },
		{ code: "// \u2005", options: [{ skipComments: true }] },
		{ code: "// \u2006", options: [{ skipComments: true }] },
		{ code: "// \u2007", options: [{ skipComments: true }] },
		{ code: "// \u2008", options: [{ skipComments: true }] },
		{ code: "// \u2009", options: [{ skipComments: true }] },
		{ code: "// \u200A", options: [{ skipComments: true }] },
		{ code: "// \u200B", options: [{ skipComments: true }] },
		{ code: "// \u202F", options: [{ skipComments: true }] },
		{ code: "// \u205f", options: [{ skipComments: true }] },
		{ code: "// \u3000", options: [{ skipComments: true }] },
		{ code: "/* \u000B */", options: [{ skipComments: true }] },
		{ code: "/* \u000C */", options: [{ skipComments: true }] },
		{ code: "/* \u0085 */", options: [{ skipComments: true }] },
		{ code: "/* \u00A0 */", options: [{ skipComments: true }] },
		{ code: "/* \u180E */", options: [{ skipComments: true }] },
		{ code: "/* \ufeff */", options: [{ skipComments: true }] },
		{ code: "/* \u2000 */", options: [{ skipComments: true }] },
		{ code: "/* \u2001 */", options: [{ skipComments: true }] },
		{ code: "/* \u2002 */", options: [{ skipComments: true }] },
		{ code: "/* \u2003 */", options: [{ skipComments: true }] },
		{ code: "/* \u2004 */", options: [{ skipComments: true }] },
		{ code: "/* \u2005 */", options: [{ skipComments: true }] },
		{ code: "/* \u2006 */", options: [{ skipComments: true }] },
		{ code: "/* \u2007 */", options: [{ skipComments: true }] },
		{ code: "/* \u2008 */", options: [{ skipComments: true }] },
		{ code: "/* \u2009 */", options: [{ skipComments: true }] },
		{ code: "/* \u200A */", options: [{ skipComments: true }] },
		{ code: "/* \u200B */", options: [{ skipComments: true }] },
		{ code: "/* \u2028 */", options: [{ skipComments: true }] },
		{ code: "/* \u2029 */", options: [{ skipComments: true }] },
		{ code: "/* \u202F */", options: [{ skipComments: true }] },
		{ code: "/* \u205f */", options: [{ skipComments: true }] },
		{ code: "/* \u3000 */", options: [{ skipComments: true }] },
		{ code: "/\u000B/", options: [{ skipRegExps: true }] },
		{ code: "/\u000C/", options: [{ skipRegExps: true }] },
		{ code: "/\u0085/", options: [{ skipRegExps: true }] },
		{ code: "/\u00A0/", options: [{ skipRegExps: true }] },
		{ code: "/\u180E/", options: [{ skipRegExps: true }] },
		{ code: "/\ufeff/", options: [{ skipRegExps: true }] },
		{ code: "/\u2000/", options: [{ skipRegExps: true }] },
		{ code: "/\u2001/", options: [{ skipRegExps: true }] },
		{ code: "/\u2002/", options: [{ skipRegExps: true }] },
		{ code: "/\u2003/", options: [{ skipRegExps: true }] },
		{ code: "/\u2004/", options: [{ skipRegExps: true }] },
		{ code: "/\u2005/", options: [{ skipRegExps: true }] },
		{ code: "/\u2006/", options: [{ skipRegExps: true }] },
		{ code: "/\u2007/", options: [{ skipRegExps: true }] },
		{ code: "/\u2008/", options: [{ skipRegExps: true }] },
		{ code: "/\u2009/", options: [{ skipRegExps: true }] },
		{ code: "/\u200A/", options: [{ skipRegExps: true }] },
		{ code: "/\u200B/", options: [{ skipRegExps: true }] },
		{ code: "/\u202F/", options: [{ skipRegExps: true }] },
		{ code: "/\u205f/", options: [{ skipRegExps: true }] },
		{ code: "/\u3000/", options: [{ skipRegExps: true }] },
		{
			code: "`\u000B`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u000C`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u0085`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u00A0`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u180E`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\ufeff`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2000`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2001`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2002`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2003`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2004`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2005`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2006`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2007`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2008`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u2009`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u200A`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u200B`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u202F`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u205f`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u3000`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "`\u3000${foo}\u3000`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const error = ` \u3000 `;",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const error = `\n\u3000`;",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const error = `\u3000\n`;",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const error = `\n\u3000\n`;",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const error = `foo\u3000bar\nfoo\u3000bar`;",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "<div>\u000B</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u000C</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u0085</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u00A0</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u180E</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\ufeff</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2000</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2001</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2002</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2003</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2004</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2005</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2006</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2007</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2008</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u2009</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u200A</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u200B</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u202F</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u205f</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div>\u3000</div>;",
			options: [{ skipJSXText: true }],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},

		// Unicode BOM.
		"\uFEFFconsole.log('hello BOM');",
	],

	invalid: [
		{
			code: "var any \u000B = 'thing';",
		},
		{
			code: "var any \u000C = 'thing';",
		},
		{
			code: "var any \u00A0 = 'thing';",
		},

		/*
		 * it was moved out of General_Category=Zs (separator, space) in Unicode 6.3.0, so should not be considered a whitespace character.
		 * https://codeblog.jonskeet.uk/2014/12/01/when-is-an-identifier-not-an-identifier-attack-of-the-mongolian-vowel-separator/
		 * {
		 *     code: "var any \u180E = 'thing';",
		 *     errors: expectedErrors
		 * },
		 */
		{
			code: "var any \ufeff = 'thing';",
		},
		{
			code: "var any \u2000 = 'thing';",
		},
		{
			code: "var any \u2001 = 'thing';",
		},
		{
			code: "var any \u2002 = 'thing';",
		},
		{
			code: "var any \u2003 = 'thing';",
		},
		{
			code: "var any \u2004 = 'thing';",
		},
		{
			code: "var any \u2005 = 'thing';",
		},
		{
			code: "var any \u2006 = 'thing';",
		},
		{
			code: "var any \u2007 = 'thing';",
		},
		{
			code: "var any \u2008 = 'thing';",
		},
		{
			code: "var any \u2009 = 'thing';",
		},
		{
			code: "var any \u200A = 'thing';",
		},
		{
			code: "var any \u2028 = 'thing';",
		},
		{
			code: "var any \u2029 = 'thing';",
		},
		{
			code: "var any \u202F = 'thing';",
		},
		{
			code: "var any \u205f = 'thing';",
		},
		{
			code: "var any \u3000 = 'thing';",
		},
		{
			code: "var a = 'b',\u2028c = 'd',\ne = 'f'\u2028",
		},
		{
			code: "var any \u3000 = 'thing', other \u3000 = 'thing';\nvar third \u3000 = 'thing';",
		},
		{
			code: "// \u000B",
		},
		{
			code: "// \u000C",
		},
		{
			code: "// \u0085",
		},
		{
			code: "// \u00A0",
		},
		{
			code: "// \u180E",
		},
		{
			code: "// \ufeff",
		},
		{
			code: "// \u2000",
		},
		{
			code: "// \u2001",
		},
		{
			code: "// \u2002",
		},
		{
			code: "// \u2003",
		},
		{
			code: "// \u2004",
		},
		{
			code: "// \u2005",
		},
		{
			code: "// \u2006",
		},
		{
			code: "// \u2007",
		},
		{
			code: "// \u2008",
		},
		{
			code: "// \u2009",
		},
		{
			code: "// \u200A",
		},
		{
			code: "// \u200B",
		},
		{
			code: "// \u202F",
		},
		{
			code: "// \u205f",
		},
		{
			code: "// \u3000",
		},
		{
			code: "/* \u000B */",
		},
		{
			code: "/* \u000C */",
		},
		{
			code: "/* \u0085 */",
		},
		{
			code: "/* \u00A0 */",
		},
		{
			code: "/* \u180E */",
		},
		{
			code: "/* \ufeff */",
		},
		{
			code: "/* \u2000 */",
		},
		{
			code: "/* \u2001 */",
		},
		{
			code: "/* \u2002 */",
		},
		{
			code: "/* \u2003 */",
		},
		{
			code: "/* \u2004 */",
		},
		{
			code: "/* \u2005 */",
		},
		{
			code: "/* \u2006 */",
		},
		{
			code: "/* \u2007 */",
		},
		{
			code: "/* \u2008 */",
		},
		{
			code: "/* \u2009 */",
		},
		{
			code: "/* \u200A */",
		},
		{
			code: "/* \u200B */",
		},
		{
			code: "/* \u2028 */",
		},
		{
			code: "/* \u2029 */",
		},
		{
			code: "/* \u202F */",
		},
		{
			code: "/* \u205f */",
		},
		{
			code: "/* \u3000 */",
		},
		{
			code: "var any = /\u3000/, other = /\u000B/;",
		},
		{
			code: "var any = '\u3000', other = '\u000B';",
			options: [{ skipStrings: false }],
		},
		{
			code: "var any = `\u3000`, other = `\u000B`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var any = `\u3000`, other = `\u000B`;",
			options: [{ skipTemplates: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`something ${\u3000 10} another thing`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`something ${10\u3000} another thing`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "\u3000\n`\u3000template`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "\u3000\n`\u3000multiline\ntemplate`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "\u3000`\u3000template`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "\u3000`\u3000multiline\ntemplate`",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u3000template`\u3000",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u3000multiline\ntemplate`\u3000",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u3000template`\n\u3000",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\u3000multiline\ntemplate`\n\u3000",
			options: [{ skipTemplates: true }],
			languageOptions: { ecmaVersion: 6 },
		},

		// full location tests
		{
			code: "var foo = \u000B bar;",
		},
		{
			code: "var foo =\u000Bbar;",
		},
		{
			code: "var foo = \u000B\u000B bar;",
		},
		{
			code: "var foo = \u000B\u000C bar;",
		},
		{
			code: "var foo = \u000B \u000B bar;",
		},
		{
			code: "var foo = \u000Bbar\u000B;",
		},
		{
			code: "\u000B",
		},
		{
			code: "\u00A0\u2002\u2003",
		},
		{
			code: "var foo = \u000B\nbar;",
		},
		{
			code: "var foo =\u000B\n\u000Bbar;",
		},
		{
			code: "var foo = \u000C\u000B\n\u000C\u000B\u000Cbar\n;\u000B\u000C\n",
		},
		{
			code: "var foo = \u2028bar;",
		},
		{
			code: "var foo =\u2029 bar;",
		},
		{
			code: "var foo = bar;\u2028",
		},
		{
			code: "\u2029",
		},
		{
			code: "foo\u2028\u2028",
		},
		{
			code: "foo\u2029\u2028",
		},
		{
			code: "foo\u2028\n\u2028",
		},
		{
			code: "foo\u000B\u2028\u000B",
		},
		{
			code: "<div>\u000B</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u000C</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u0085</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u00A0</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u180E</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\ufeff</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2000</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2001</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2002</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2003</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2004</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2005</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2006</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2007</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2008</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u2009</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u200A</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u200B</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u202F</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u205f</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "<div>\u3000</div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
	],
};
