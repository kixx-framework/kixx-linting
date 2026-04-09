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
    { text: "fn(...args)" },
    { text: "fn(...(args))" },
    { text: "fn(...( args ))" },
    { text: "fn(...args)", options: ["never"] },
    { text: "fn(... args)", options: ["always"] },
    { text: "fn(...\targs)", options: ["always"] },
    { text: "fn(...\nargs)", options: ["always"] },
    { text: "[...arr, 4, 5, 6]" },
    { text: "[...(arr), 4, 5, 6]" },
    { text: "[...( arr ), 4, 5, 6]" },
    { text: "[...arr, 4, 5, 6]", options: ["never"] },
    { text: "[... arr, 4, 5, 6]", options: ["always"] },
    { text: "[...\tarr, 4, 5, 6]", options: ["always"] },
    { text: "[...\narr, 4, 5, 6]", options: ["always"] },
    { text: "let [a, b, ...arr] = [1, 2, 3, 4, 5];" },
    { text: "let [a, b, ...arr] = [1, 2, 3, 4, 5];", options: ["never"] },
    { text: "let [a, b, ... arr] = [1, 2, 3, 4, 5];", options: ["always"] },
    {
        text: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
        options: ["always"],
    },
    {
        text: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
        options: ["always"],
    },
    {
        text: "let n = { x, y, ...z };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...(z) };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...( z ) };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...z };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ... z };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...\tz };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...\nz };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
];

const invalid = [
    {
        text: "fn(... args)",
    },
    {
        text: "fn(...  args)",
    },
    {
        text: "fn(...\targs)",
    },
    {
        text: "fn(... \t args)",
    },
    {
        text: "fn(...\nargs)",
    },
    {
        text: "fn(...\n    args)",
    },
    {
        text: "fn(...\n\targs)",
    },
    {
        text: "fn(... args)",
        options: ["never"],
    },
    {
        text: "fn(...\targs)",
        options: ["never"],
    },
    {
        text: "fn(...\nargs)",
        options: ["never"],
    },
    {
        text: "fn(...args)",
        options: ["always"],
    },
    {
        text: "fn(... (args))",
    },
    {
        text: "fn(... ( args ))",
    },
    {
        text: "fn(...(args))",
        options: ["always"],
    },
    {
        text: "fn(...( args ))",
        options: ["always"],
    },
    {
        text: "[... arr, 4, 5, 6]",
    },
    {
        text: "[...\tarr, 4, 5, 6]",
    },
    {
        text: "[...\narr, 4, 5, 6]",
    },
    {
        text: "[... arr, 4, 5, 6]",
        options: ["never"],
    },
    {
        text: "[...\tarr, 4, 5, 6]",
        options: ["never"],
    },
    {
        text: "[...\narr, 4, 5, 6]",
        options: ["never"],
    },
    {
        text: "[...arr, 4, 5, 6]",
        options: ["always"],
    },
    {
        text: "[... (arr), 4, 5, 6]",
    },
    {
        text: "[... ( arr ), 4, 5, 6]",
    },
    {
        text: "[...(arr), 4, 5, 6]",
        options: ["always"],
    },
    {
        text: "[...( arr ), 4, 5, 6]",
        options: ["always"],
    },
    {
        text: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
    },
    {
        text: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
    },
    {
        text: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
    },
    {
        text: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
        options: ["never"],
    },
    {
        text: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
        options: ["never"],
    },
    {
        text: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
        options: ["never"],
    },
    {
        text: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
        options: ["always"],
    },
    {
        text: "let n = { x, y, ... z };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...\tz };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...\nz };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ... z };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...\tz };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...\nz };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...z };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ... (z) };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ... ( z ) };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...(z) };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let n = { x, y, ...( z ) };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["never"],
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
        options: ["always"],
        languageOptions: { ecmaVersion: 2018 },
    },
];
