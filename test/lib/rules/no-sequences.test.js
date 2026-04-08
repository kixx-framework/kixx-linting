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

// Examples of code that should not trigger the rule
const valid = [
    { text: "var arr = [1, 2];" },
    { text: "var obj = {a: 1, b: 2};" },
    { text: "var a = 1, b = 2;" },
    { text: "var foo = (1, 2);" },
    { text: '(0,eval)("foo()");' },
    { text: "for (i = 1, j = 2;; i++, j++);" },
    { text: "foo(a, (b, c), d);" },
    { text: "do {} while ((doSomething(), !!test));" },
    { text: "for ((doSomething(), somethingElse()); (doSomething(), !!test); );" },
    { text: "if ((doSomething(), !!test));" },
    { text: "switch ((doSomething(), val)) {}" },
    { text: "while ((doSomething(), !!test));" },
    { text: "with ((doSomething(), val)) {}" },
    {
        text: "a => ((doSomething(), a))",
        languageOptions: { ecmaVersion: 6 },
    },

    // options object without "allowInParentheses" property
    { text: "var foo = (1, 2);", options: [{}] },

    // explicitly set option "allowInParentheses" to default value
    { text: "var foo = (1, 2);", options: [{ allowInParentheses: true }] },

    // valid code with "allowInParentheses" set to `false`
    {
        text: "for ((i = 0, j = 0); test; );",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "for (; test; (i++, j++));",
        options: [{ allowInParentheses: false }],
    },

    // https://github.com/eslint/eslint/issues/14572
    {
        text: "const foo = () => { return ((bar = 123), 10) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const foo = () => (((bar = 123), 10));",
        languageOptions: { ecmaVersion: 6 },
    },
];

// Examples of code that should trigger the rule
const invalid = [
    {
        text: "1, 2;",
    },
    { text: "a = 1, 2"},
    { text: "do {} while (doSomething(), !!test);"},
    { text: "for (; doSomething(), !!test; );"},
    { text: "if (doSomething(), !!test);"},
    { text: "switch (doSomething(), val) {}"},
    { text: "while (doSomething(), !!test);"},
    { text: "with (doSomething(), val) {}"},
    {
        text: "a => (doSomething(), a)",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "(1), 2"},
    { text: "((1)) , (2)"},
    { text: "while((1) , 2);"},

    // option "allowInParentheses": do not allow sequence in parentheses
    {
        text: "var foo = (1, 2);",
        options: [{ allowInParentheses: false }],
    },
    {
        text: '(0,eval)("foo()");',
        options: [{ allowInParentheses: false }],
    },
    {
        text: "foo(a, (b, c), d);",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "do {} while ((doSomething(), !!test));",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "for (; (doSomething(), !!test); );",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "if ((doSomething(), !!test));",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "switch ((doSomething(), val)) {}",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "while ((doSomething(), !!test));",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "with ((doSomething(), val)) {}",
        options: [{ allowInParentheses: false }],
    },
    {
        text: "a => ((doSomething(), a))",
        options: [{ allowInParentheses: false }],
        languageOptions: { ecmaVersion: 6 },
    },
];
