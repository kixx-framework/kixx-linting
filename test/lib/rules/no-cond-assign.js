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

const valid = [
    { text: "var x = 0; if (x == 0) { var b = 1; }" },
    { text: "var x = 0; if (x == 0) { var b = 1; }", options: ["always"] },
    { text: "var x = 5; while (x < 5) { x = x + 1; }" },
    { text: "if ((someNode = someNode.parentNode) !== null) { }" },
    {
        text: "if ((someNode = someNode.parentNode) !== null) { }",
        options: ["except-parens"],
    },
    { text: "if ((a = b));" },
    { text: "while ((a = b));" },
    { text: "do {} while ((a = b));" },
    { text: "for (;(a = b););" },
    { text: "for (;;) {}" },
    { text: "if (someNode || (someNode = parentNode)) { }" },
    { text: "while (someNode || (someNode = parentNode)) { }" },
    { text: "do { } while (someNode || (someNode = parentNode));" },
    { text: "for (;someNode || (someNode = parentNode););" },
    {
        text: "if ((function(node) { return node = parentNode; })(someNode)) { }",
        options: ["except-parens"],
    },
    {
        text: "if ((function(node) { return node = parentNode; })(someNode)) { }",
        options: ["always"],
    },
    {
        text: "if ((node => node = parentNode)(someNode)) { }",
        options: ["except-parens"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "if ((node => node = parentNode)(someNode)) { }",
        options: ["always"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "if (function(node) { return node = parentNode; }) { }",
        options: ["except-parens"],
    },
    {
        text: "if (function(node) { return node = parentNode; }) { }",
        options: ["always"],
    },
    { text: "x = 0;", options: ["always"] },
    { text: "var x; var b = (x === 0) ? 1 : 0;" },
    {
        text: "switch (foo) { case a = b: bar(); }",
        options: ["except-parens"],
    },
    { text: "switch (foo) { case a = b: bar(); }", options: ["always"] },
    {
        text: "switch (foo) { case baz + (a = b): bar(); }",
        options: ["always"],
    },
];
const invalid = [
    {
        text: "var x; if (x = 0) { var b = 1; }",
    },
    {
        text: "var x; while (x = 0) { var b = 1; }",
    },
    {
        text: "var x = 0, y; do { y = x; } while (x = x + 1);",
    },
    {
        text: "var x; for(; x+=1 ;){};",
    },
    {
        text: "var x; if ((x) = (0));",
    },
    {
        text: "if (someNode || (someNode = parentNode)) { }",
        options: ["always"],
    },
    {
        text: "while (someNode || (someNode = parentNode)) { }",
        options: ["always"],
    },
    {
        text: "do { } while (someNode || (someNode = parentNode));",
        options: ["always"],
    },
    {
        text: "for (; (typeof l === 'undefined' ? (l = 0) : l); i++) { }",
        options: ["always"],
    },
    {
        text: "if (x = 0) { }",
        options: ["always"],
    },
    {
        text: "while (x = 0) { }",
        options: ["always"],
    },
    {
        text: "do { } while (x = x + 1);",
        options: ["always"],
    },
    {
        text: "for(; x = y; ) { }",
        options: ["always"],
    },
    {
        text: "if ((x = 0)) { }",
        options: ["always"],
    },
    {
        text: "while ((x = 0)) { }",
        options: ["always"],
    },
    {
        text: "do { } while ((x = x + 1));",
        options: ["always"],
    },
    {
        text: "for(; (x = y); ) { }",
        options: ["always"],
    },
    {
        text: "var x; var b = (x = 0) ? 1 : 0;",
    },
    {
        text: "var x; var b = x && (y = 0) ? 1 : 0;",
        options: ["always"],
    },
    {
        text: "(((3496.29)).bkufyydt = 2e308) ? foo : bar;",
    },
];
