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
    "class A { } foo(A);",
    "let A = class A { }; foo(A);",
    "class A { b(A) { A = 0; } }",
    "class A { b() { let A; A = 0; } }",
    "let A = class { b() { A = 0; } }",

    // ignores non class.
    "var x = 0; x = 1;",
    "let x = 0; x = 1;",
    "const x = 0; x = 1;",
    "function x() {} x = 1;",
    "function foo(x) { x = 1; }",
    "try {} catch (x) { x = 1; }",
];
const invalid = [
    {
        text: "class A { } A = 0;",
    },
    {
        text: "class A { } ({A} = 0);",
    },
    {
        text: "class A { } ({b: A = 0} = {});",
    },
    {
        text: "A = 0; class A { }",
    },
    {
        text: "class A { b() { A = 0; } }",
    },
    {
        text: "let A = class A { b() { A = 0; } }",
    },
    {
        text: "class A { } A = 0; A = 1;",
    },
];
