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
			code: "switch (a) { case 1: { let x = 1; break; } default: { let x = 2; break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: { const x = 1; break; } default: { const x = 2; break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: { function f() {} break; } default: { function f() {} break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: { class C {} break; } default: { class C {} break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		`
            switch (a) {
                case 1:
                case 2: {}
            }
        `,
		`
            switch (a) {
                case 1: var x;
            }
        `,
	],
	invalid: [
		{
			code: `
                switch (a) {
                    case 1:
                        {}
                        function f() {}
                        break;
                }
            `,
		},
		{
			code: `
                switch (a) {
                    case 1:
                    case 2:
                        let x;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                switch (a) {
                    case 1:
                        let x;
                    case 2:
                        let y;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                switch (a) {
                    case 1:
                        let x;
                    default:
                        let y;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: let x = 1; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: let x = 2; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: const x = 1; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: const x = 2; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: function f() {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: function f() {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: class C {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: class C {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/pull/18388#issuecomment-2075356456
		{
			code: `
                switch ("foo") {
                    case "bar":
                        function baz() { }
                        break;
                    default:
                        baz();
                }
            `,
			languageOptions: { ecmaVersion: "latest" },
		},
	],
};
