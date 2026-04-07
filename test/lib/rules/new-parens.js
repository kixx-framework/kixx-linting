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
    // Default (Always)
    "var a = new Date();",
    "var a = new Date(function() {});",
    "var a = new (Date)();",
    "var a = new ((Date))();",
    "var a = (new Date());",
    "var a = new foo.Bar();",
    "var a = (new Foo()).bar;",

    // Explicit Always
    { text: "var a = new Date();", options: ["always"] },
    { text: "var a = new foo.Bar();", options: ["always"] },
    { text: "var a = (new Foo()).bar;", options: ["always"] },

    // Never
    { text: "var a = new Date;", options: ["never"] },
    { text: "var a = new Date(function() {});", options: ["never"] },
    { text: "var a = new (Date);", options: ["never"] },
    { text: "var a = new ((Date));", options: ["never"] },
    { text: "var a = (new Date);", options: ["never"] },
    { text: "var a = new foo.Bar;", options: ["never"] },
    { text: "var a = (new Foo).bar;", options: ["never"] },
    { text: "var a = new Person('Name')", options: ["never"] },
    { text: "var a = new Person('Name', 12)", options: ["never"] },
    { text: "var a = new ((Person))('Name');", options: ["never"] },
];
const invalid = [
    // Default (Always)
    {
        text: "var a = new Date;",
    },
    {
        text: "var a = new Date",
    },
    {
        text: "var a = new (Date);",
    },
    {
        text: "var a = new (Date)",
    },
    {
        text: "var a = (new Date)",
    },
    {
        // This `()` is `CallExpression`'s. This is a call of the result of `new Date`.
        text: "var a = (new Date)()",
    },
    {
        text: "var a = new foo.Bar;",
    },
    {
        text: "var a = (new Foo).bar;",
    },

    // Explicit always
    {
        text: "var a = new Date;",
        options: ["always"],
    },
    {
        text: "var a = new foo.Bar;",
        options: ["always"],
    },
    {
        text: "var a = (new Foo).bar;",
        options: ["always"],
    },
    {
        text: "var a = new new Foo()",
        options: ["always"],
    },

    // Never
    {
        text: "var a = new Date();",
        options: ["never"],
    },
    {
        text: "var a = new Date()",
        options: ["never"],
    },
    {
        text: "var a = new (Date)();",
        options: ["never"],
    },
    {
        text: "var a = new (Date)()",
        options: ["never"],
    },
    {
        text: "var a = (new Date())",
        options: ["never"],
    },
    {
        text: "var a = (new Date())()",
        options: ["never"],
    },
    {
        text: "var a = new foo.Bar();",
        options: ["never"],
    },
    {
        text: "var a = (new Foo()).bar;",
        options: ["never"],
    },
    {
        text: "var a = new new Foo()",
        options: ["never"],
    },
];
