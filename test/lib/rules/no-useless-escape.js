/*
 * Copyright OpenJS Foundation and other contributors, <www.openjsf.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export default {
	valid: [
		"var foo = /\\./",
		"var foo = /\\//g",
		'var foo = /""/',
		"var foo = /''/",
		"var foo = /([A-Z])\\t+/g",
		"var foo = /([A-Z])\\n+/g",
		"var foo = /([A-Z])\\v+/g",
		"var foo = /\\D/",
		"var foo = /\\W/",
		"var foo = /\\w/",
		"var foo = /\\\\/g",
		"var foo = /\\w\\$\\*\\./",
		"var foo = /\\^\\+\\./",
		"var foo = /\\|\\}\\{\\./",
		"var foo = /]\\[\\(\\)\\//",
		'var foo = "\\x123"',
		'var foo = "\\u00a9"',
		'var foo = "\\377"',
		'var foo = "\\""',
		'var foo = "xs\\u2111"',
		'var foo = "foo \\\\ bar";',
		'var foo = "\\t";',
		'var foo = "foo \\b bar";',
		"var foo = '\\n';",
		"var foo = 'foo \\r bar';",
		"var foo = '\\v';",
		"var foo = '\\f';",
		"var foo = '\\\n';",
		"var foo = '\\\r\n';",
		{
			code: '<foo attr="\\d"/>',
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div> Testing: \\ </div>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<div> Testing: &#x5C </div>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<foo attr='\\d'></foo>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<> Testing: \\ </>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "<> Testing: &#x5C </>",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{ code: "var foo = `\\x123`", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `\\u00a9`", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `xs\\u2111`", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var foo = `foo \\\\ bar`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = `\\t`;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var foo = `foo \\b bar`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = `\\n`;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var foo = `foo \\r bar`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = `\\v`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `\\f`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `\\\n`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `\\\r\n`;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var foo = `${foo} \\x123`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `${foo} \\u00a9`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `${foo} xs\\u2111`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `${foo} \\\\ ${bar}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `${foo} \\b ${bar}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = `${foo}\\t`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `${foo}\\n`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `${foo}\\r`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `${foo}\\v`;", languageOptions: { ecmaVersion: 6 } },
		{ code: "var foo = `${foo}\\f`;", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var foo = `${foo}\\\n`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `${foo}\\\r\n`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = `\\``", languageOptions: { ecmaVersion: 6 } },
		{
			code: "var foo = `\\`${foo}\\``",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\${{${foo}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `$\\{{${foo}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = String.raw`\\.`",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = myFunc`\\.`", languageOptions: { ecmaVersion: 6 } },

		String.raw`var foo = /[\d]/`,
		String.raw`var foo = /[a\-b]/`,
		String.raw`var foo = /foo\?/`,
		String.raw`var foo = /example\.com/`,
		String.raw`var foo = /foo\|bar/`,
		String.raw`var foo = /\^bar/`,
		String.raw`var foo = /[\^bar]/`,
		String.raw`var foo = /\(bar\)/`,
		String.raw`var foo = /[[\]]/`, // A character class containing '[' and ']'
		String.raw`var foo = /[[]\./`, // A character class containing '[', followed by a '.' character
		String.raw`var foo = /[\]\]]/`, // A (redundant) character class containing ']'
		String.raw`var foo = /\[abc]/`, // Matches the literal string '[abc]'
		String.raw`var foo = /\[foo\.bar]/`, // Matches the literal string '[foo.bar]'
		String.raw`var foo = /vi/m`,
		String.raw`var foo = /\B/`,

		// https://github.com/eslint/eslint/issues/7472
		String.raw`var foo = /\0/`, // null character
		"var foo = /\\1/", // \x01 character (octal literal)
		"var foo = /(a)\\1/", // backreference
		"var foo = /(a)\\12/", // backreference
		"var foo = /[\\0]/", // null character in character class

		"var foo = 'foo \\\u2028 bar'",
		"var foo = 'foo \\\u2029 bar'",

		// https://github.com/eslint/eslint/issues/7789
		String.raw`/]/`,
		String.raw`/\]/`,
		{ code: String.raw`/\]/u`, languageOptions: { ecmaVersion: 6 } },
		String.raw`var foo = /foo\]/`,
		String.raw`var foo = /[[]\]/`, // A character class containing '[', followed by a ']' character
		String.raw`var foo = /\[foo\.bar\]/`,

		// ES2018
		{
			code: String.raw`var foo = /(?<a>)\k<a>/`,
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: String.raw`var foo = /(\\?<a>)/`,
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: String.raw`var foo = /\p{ASCII}/u`,
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: String.raw`var foo = /\P{ASCII}/u`,
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: String.raw`var foo = /[\p{ASCII}]/u`,
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: String.raw`var foo = /[\P{ASCII}]/u`,
			languageOptions: { ecmaVersion: 2018 },
		},

		// Carets
		String.raw`/[^^]/`,
		{ code: String.raw`/[^^]/u`, languageOptions: { ecmaVersion: 2015 } },

		// ES2024
		{
			code: String.raw`/[\q{abc}]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{ code: String.raw`/[\(]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\)]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\{]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\]]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\}]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\/]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\-]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\|]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\$$]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\&&]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\!!]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\##]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\%%]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\**]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\++]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\,,]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\..]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\::]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\;;]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\<<]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\==]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\>>]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\??]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\@@]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: "/[\\``]/v", languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[\~~]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[^\^^]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[_\^^]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[$\$]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[&\&]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[!\!]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[#\#]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[%\%]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[*\*]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[+\+]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[,\,]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[.\.]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[:\:]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[;\;]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[<\<]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[=\=]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[>\>]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[?\?]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[@\@]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: "/[`\\`]/v", languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[~\~]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[^^\^]/v`, languageOptions: { ecmaVersion: 2024 } },
		{ code: String.raw`/[_^\^]/v`, languageOptions: { ecmaVersion: 2024 } },
		{
			code: String.raw`/[\&&&\&]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[[\-]\-]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{ code: String.raw`/[\^]/v`, languageOptions: { ecmaVersion: 2024 } },
		{
			code: "var foo = /\\#/;",
			options: [{ allowRegexCharacters: ["#"] }],
		},
		{
			code: "var foo = /\\;/;",
			options: [{ allowRegexCharacters: [";"] }],
		},
		{
			code: "var foo = /\\#\\;/;",
			options: [{ allowRegexCharacters: ["#", ";"] }],
		},
		{
			code: String.raw`var foo = /[ab\-]/`,
			options: [{ allowRegexCharacters: ["-"] }],
		},
		{
			code: String.raw`var foo = /[\-ab]/`,
			options: [{ allowRegexCharacters: ["-"] }],
		},
		{
			code: String.raw`var foo = /[ab\?]/`,
			options: [{ allowRegexCharacters: ["?"] }],
		},
		{
			code: String.raw`var foo = /[ab\.]/`,
			options: [{ allowRegexCharacters: ["."] }],
		},
		{
			code: String.raw`var foo = /[a\|b]/`,
			options: [{ allowRegexCharacters: ["|"] }],
		},
		{
			code: String.raw`var foo = /\-/`,
			options: [{ allowRegexCharacters: ["-"] }],
		},
		{
			code: String.raw`var foo = /[\-]/`,
			options: [{ allowRegexCharacters: ["-"] }],
		},
		{
			code: String.raw`var foo = /[ab\$]/`,
			options: [{ allowRegexCharacters: ["$"] }],
		},
		{
			code: String.raw`var foo = /[\(paren]/`,
			options: [{ allowRegexCharacters: ["("] }],
		},
		{
			code: String.raw`var foo = /[\[]/`,
			options: [{ allowRegexCharacters: ["["] }],
		},
		{
			code: String.raw`var foo = /[\/]/`,
			options: [{ allowRegexCharacters: ["/"] }],
		},
		{
			code: String.raw`var foo = /[\B]/`,
			options: [{ allowRegexCharacters: ["B"] }],
		},
		{
			code: String.raw`var foo = /[a][\-b]/`,
			options: [{ allowRegexCharacters: ["-"] }],
		},
		{
			code: String.raw`var foo = /\-[]/`,
			options: [{ allowRegexCharacters: ["-"] }],
		},
		{
			code: String.raw`var foo = /[a\^]/`,
			options: [{ allowRegexCharacters: ["^"] }],
		},
		{
			code: String.raw`/[^\^]/`,
			options: [{ allowRegexCharacters: ["^"] }],
		},
		{
			code: String.raw`/[^\^]/u`,
			options: [{ allowRegexCharacters: ["^"] }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: String.raw`/[\$]/v`,
			options: [{ allowRegexCharacters: ["$"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\&\&]/v`,
			options: [{ allowRegexCharacters: ["&"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\!!]/v`,
			options: [{ allowRegexCharacters: ["!"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\##]/v`,
			options: [{ allowRegexCharacters: ["#"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\%%]/v`,
			options: [{ allowRegexCharacters: ["%"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\*\*]/v`,
			options: [{ allowRegexCharacters: ["*"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\+\+]/v`,
			options: [{ allowRegexCharacters: ["+"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\,,]/v`,
			options: [{ allowRegexCharacters: [","] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\..]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\:\:]/v`,
			options: [{ allowRegexCharacters: [":"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\;\;]/v`,
			options: [{ allowRegexCharacters: [";"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\<\<]/v`,
			options: [{ allowRegexCharacters: ["<"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\=\=]/v`,
			options: [{ allowRegexCharacters: ["="] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\>\>]/v`,
			options: [{ allowRegexCharacters: [">"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\?\?]/v`,
			options: [{ allowRegexCharacters: ["?"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\@\@]/v`,
			options: [{ allowRegexCharacters: ["@"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "/[\\``]/v",
			options: [{ allowRegexCharacters: ["`"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\~\~]/v`,
			options: [{ allowRegexCharacters: ["~"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[^\^\^]/v`,
			options: [{ allowRegexCharacters: ["^"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[_\^\^]/v`,
			options: [{ allowRegexCharacters: ["^"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\&\&&\&]/v`,
			options: [{ allowRegexCharacters: ["&"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\p{ASCII}--\.]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\p{ASCII}&&\.]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.--[.&]]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.&&[.&]]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.--\.--\.]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.&&\.&&\.]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[[\.&]--[\.&]]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[[\.&]&&[\.&]]/v`,
			options: [{ allowRegexCharacters: ["."] }],
			languageOptions: { ecmaVersion: 2024 },
		},
	],

	invalid: [
		{
			code: "var foo = /\\#/;",
		},
		{
			code: "var foo = /\\;/;",
		},
		{
			code: 'var foo = "\\\'";',
		},
		{
			code: 'var foo = "\\#/";',
		},
		{
			code: 'var foo = "\\a"',
		},
		{
			code: 'var foo = "\\B";',
		},
		{
			code: 'var foo = "\\@";',
		},
		{
			code: 'var foo = "foo \\a bar";',
		},
		{
			code: "var foo = '\\\"';",
		},
		{
			code: "var foo = '\\#';",
		},
		{
			code: "var foo = '\\$';",
		},
		{
			code: "var foo = '\\p';",
		},
		{
			code: "var foo = '\\p\\a\\@';",
		},
		{
			code: '<foo attr={"\\d"}/>',
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: "var foo = '\\`';",
		},
		{
			code: 'var foo = `\\"`;',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\'`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\#`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = '\\`foo\\`';",
		},
		{
			code: 'var foo = `\\"${foo}\\"`;',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\'${foo}\\'`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\#${foo}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let foo = '\\ ';",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let foo = /\\ /;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\$\\{{${foo}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\\$a${foo}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `a\\{{${foo}`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: String.raw`var foo = /[ab\-]/`,
		},
		{
			code: String.raw`var foo = /[\-ab]/`,
		},
		{
			code: String.raw`var foo = /[ab\?]/`,
		},
		{
			code: String.raw`var foo = /[ab\.]/`,
		},
		{
			code: String.raw`var foo = /[a\|b]/`,
		},
		{
			code: String.raw`var foo = /\-/`,
		},
		{
			code: String.raw`var foo = /[\-]/`,
		},
		{
			code: String.raw`var foo = /[ab\$]/`,
		},
		{
			code: String.raw`var foo = /[\(paren]/`,
		},
		{
			code: String.raw`var foo = /[\[]/`,
		},
		{
			code: String.raw`var foo = /[\/]/`, // A character class containing '/'
		},
		{
			code: String.raw`var foo = /[\B]/`,
		},
		{
			code: String.raw`var foo = /[a][\-b]/`,
		},
		{
			code: String.raw`var foo = /\-[]/`,
		},
		{
			code: String.raw`var foo = /[a\^]/`,
		},
		{
			code: "`multiline template\nliteral with useless \\escape`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`multiline template\r\nliteral with useless \\escape`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`template literal with line continuation \\\nand useless \\escape`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`template literal with line continuation \\\r\nand useless \\escape`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`template literal with mixed linebreaks \r\r\n\n\\and useless escape`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`template literal with mixed linebreaks in line continuations \\\n\\\r\\\r\n\\and useless escape`",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`\\a```",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/16988
		{
			code: String.raw`"use\ strict";`,
		},
		{
			code: String.raw`({ foo() { "foo"; "bar"; "ba\z" } })`,
			languageOptions: { ecmaVersion: 6 },
		},

		// Carets
		{
			code: String.raw`/[^\^]/`,
		},
		{
			code: String.raw`/[^\^]/u`,
			languageOptions: { ecmaVersion: 2015 },
		},

		// ES2024
		{
			code: String.raw`/[\$]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\&\&]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\!\!]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\#\#]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\%\%]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\*\*]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\+\+]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\,\,]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.\.]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\:\:]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\;\;]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\<\<]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\=\=]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\>\>]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\?\?]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\@\@]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: "/[\\`\\`]/v",
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\~\~]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[^\^\^]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[_\^\^]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\&\&&\&]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\p{ASCII}--\.]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\p{ASCII}&&\.]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.--[.&]]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.&&[.&]]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.--\.--\.]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[\.&&\.&&\.]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[[\.&]--[\.&]]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: String.raw`/[[\.&]&&[\.&]]/v`,
			languageOptions: { ecmaVersion: 2024 },
		},
		{
			code: 'var foo = "\\#/";',
			options: [{ allowRegexCharacters: ["#"] }],
		},
		{
			code: "var foo = /\\#\\@/;",
			options: [{ allowRegexCharacters: ["#"] }],
		},
		{
			code: String.raw`var foo = /[a\@b]/`,
			options: [{ allowRegexCharacters: ["#"] }],
		},
		{
			code: String.raw`/[\@\@]/v`,
			options: [{ allowRegexCharacters: ["#"] }],
			languageOptions: { ecmaVersion: 2024 },
		},
	],
};
