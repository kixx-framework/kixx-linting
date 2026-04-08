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
			code: "// Trailing comment test.",
		},
		{
			code: "// Trailing comment test.",
			options: [],
		},
		{
			code: "/* \nTrailing comments test. \n*/",
		},
		{
			code: "#!/usr/bin/env node ",
		},
		{
			code: "/* \n */ // ",
		},
		{
			code: "/* \n */ /* \n */",
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

		// https://github.com/eslint/eslint/issues/6933
		{
			code: "    \nabcdefg ",
		},

		{
			code: "// Trailing comment test. ",
		},
		{
			code: "/* \nTrailing comments test. \n*/",
		},
		{
			code: "#!/usr/bin/env node ",
		},
		{
			code: "// Trailing comment default test. ",
		},
	],
};
