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
		"var a = new Object();",
		"var a = String('test'), b = String.fromCharCode(32);",
		`
        function test(Number) {
            return new Number;
        }
        `,
		{
			code: `
            import String from "./string";
            const str = new String(42);
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		`
        if (foo) {
            result = new Boolean(bar);
        } else {
            var Boolean = CustomBoolean;
        }
        `,
		{
			code: "new String()",
			languageOptions: {
				globals: {
					String: "off",
				},
			},
		},
		`
        /* global Boolean:off */
        assert(new Boolean);
        `,
	],
	invalid: [
		{
			code: "var a = new String('hello');",
		},
		{
			code: "var a = new Number(10);",
		},
		{
			code: "var a = new Boolean(false);",
		},
		{
			code: `
            const a = new String('bar');
            {
                const String = CustomString;
                const b = new String('foo');
            }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
