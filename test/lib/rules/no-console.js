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
		"Console.info(foo)",

		// single array item
		{ code: "console.info(foo)", options: [{ allow: ["info"] }] },
		{ code: "console.warn(foo)", options: [{ allow: ["warn"] }] },
		{ code: "console.error(foo)", options: [{ allow: ["error"] }] },
		{ code: "console.log(foo)", options: [{ allow: ["log"] }] },

		// multiple array items
		{ code: "console.info(foo)", options: [{ allow: ["warn", "info"] }] },
		{ code: "console.warn(foo)", options: [{ allow: ["error", "warn"] }] },
		{ code: "console.error(foo)", options: [{ allow: ["log", "error"] }] },
		{
			code: "console.log(foo)",
			options: [{ allow: ["info", "log", "warn"] }],
		},

		// https://github.com/eslint/eslint/issues/7010
		"var console = require('myconsole'); console.log(foo)",
	],
	invalid: [
		// no options
		{
			code: "if (a) console.warn(foo)",
		},
		{
			code: "foo(console.log)",
		},
		{
			code: "console.log(foo)",
		},
		{
			code: "console.error(foo)",
		},
		{
			code: "console.info(foo)",
		},
		{
			code: "console.warn(foo)",
		},
		{
			code: "switch (a) { case 1: console.log(foo) }",
		},
		{
			code: "if (a) { console.warn(foo) }",
		},
		{
			code: "a();\nconsole.log(foo);\nb();",
		},
		{
			code: "class A { static { console.info(foo) } }",
			languageOptions: { ecmaVersion: "latest" },
		},
		{
			code: "a()\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a))",
			languageOptions: { ecmaVersion: "latest" },
		},
		{
			code: "a++\nconsole.log();\n/b/",
			languageOptions: { ecmaVersion: "latest" },
		},
		{
			code: "a();\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a));",
			languageOptions: { ecmaVersion: "latest" },
		},

		//  one option
		{
			code: "if (a) console.info(foo)",
			options: [{ allow: ["warn"] }],
		},
		{
			code: "foo(console.warn)",
			options: [{ allow: ["log"] }],
		},
		{
			code: "console.log(foo)",
			options: [{ allow: ["error"] }],
		},
		{
			code: "console.error(foo)",
			options: [{ allow: ["warn"] }],
		},
		{
			code: "console.info(foo)",
			options: [{ allow: ["log"] }],
		},
		{
			code: "console.warn(foo)",
			options: [{ allow: ["error"] }],
		},
		{
			code: "switch (a) { case 1: console.log(foo) }",
			options: [{ allow: ["error"] }],
		},
		{
			code: "if (a) { console.info(foo) }",
			options: [{ allow: ["warn"] }],
		},
		{
			code: "class A { static { console.error(foo) } }",
			options: [{ allow: ["log"] }],
			languageOptions: { ecmaVersion: "latest" },
		},

		// multiple options
		{
			code: "if (a) console.log(foo)",
			options: [{ allow: ["warn", "error"] }],
		},
		{
			code: "foo(console.info)",
			options: [{ allow: ["warn", "error"] }],
		},
		{
			code: "console.log(foo)",
			options: [{ allow: ["warn", "info"] }],
		},
		{
			code: "console.error(foo)",
			options: [{ allow: ["warn", "info", "log"] }],
		},
		{
			code: "console.info(foo)",
			options: [{ allow: ["warn", "error", "log"] }],
		},
		{
			code: "console.warn(foo)",
			options: [{ allow: ["info", "log"] }],
		},
		{
			code: "switch (a) { case 1: console.error(foo) }",
			options: [{ allow: ["info", "log"] }],
		},
		{
			code: "if (a) { console.log(foo) }",
			options: [{ allow: ["warn", "error"] }],
		},
		{
			code: "class A { static { console.info(foo) } }",
			options: [{ allow: ["log", "error", "warn"] }],
			languageOptions: { ecmaVersion: "latest" },
		},
		{
			code: "console[foo](bar)",
		},
		{
			code: "console[0](foo)",
		},

		// In case that implicit global variable of 'console' exists
		{
			code: "console.log(foo)",
			languageOptions: {
				globals: {
					console: "readonly",
				},
			},
		},
	],
};
