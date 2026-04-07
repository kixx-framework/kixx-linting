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
    { text: "var regex = /x1f/" },
    { text: String.raw`var regex = /\\x1f/` },
    { text: "var regex = new RegExp('x1f')" },
    { text: "var regex = RegExp('x1f')" },
    { text: "new RegExp('[')" },
    { text: "RegExp('[')" },
    { text: "new (function foo(){})('\\x1f')" },
    { text: String.raw`/\u{20}/u`, languageOptions: { ecmaVersion: 2015 } },
    { text: String.raw`/\u{1F}/` },
    { text: String.raw`/\u{1F}/g` },
    { text: String.raw`new RegExp("\\u{20}", "u")` },
    { text: String.raw`new RegExp("\\u{1F}")` },
    { text: String.raw`new RegExp("\\u{1F}", "g")` },
    { text: String.raw`new RegExp("\\u{1F}", flags)` }, // when flags are unknown, this rule assumes there's no `u` flag
    { text: String.raw`new RegExp("[\\q{\\u{20}}]", "v")` },
    {
        text: String.raw`/[\u{20}--B]/v`,
        languageOptions: { ecmaVersion: 2024 },
    },
];
const invalid = [
    {
        code: String.raw`var regex = /\x1f/`,
    },
    {
        code: String.raw`var regex = /\\\x1f\\x1e/`,
    },
    {
        code: String.raw`var regex = /\\\x1fFOO\\x00/`,
    },
    {
        code: String.raw`var regex = /FOO\\\x1fFOO\\x1f/`,
    },
    {
        code: "var regex = new RegExp('\\x1f\\x1e')",
    },
    {
        code: "var regex = new RegExp('\\x1fFOO\\x00')",
    },
    {
        code: "var regex = new RegExp('FOO\\x1fFOO\\x1f')",
    },
    {
        code: "var regex = RegExp('\\x1f')",
    },
    {
        code: "var regex = /(?<a>\\x1f)/",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        code: String.raw`var regex = /(?<\u{1d49c}>.)\x1f/`,
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: String.raw`new RegExp("\\u001F", flags)`,
    },
    {
        code: String.raw`/\u{1111}*\x1F/u`,
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        code: String.raw`new RegExp("\\u{1111}*\\x1F", "u")`,
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        code: String.raw`/\u{1F}/u`,
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        code: String.raw`/\u{1F}/gui`,
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        code: String.raw`new RegExp("\\u{1F}", "u")`,
    },
    {
        code: String.raw`new RegExp("\\u{1F}", "gui")`,
    },
    {
        code: String.raw`new RegExp("[\\q{\\u{1F}}]", "v")`,
    },
    {
        code: String.raw`/[\u{1F}--B]/v`,
        languageOptions: { ecmaVersion: 2024 },
    },
    {
        code: String.raw`/\x11/; RegExp("foo", "uv");`,
        languageOptions: { ecmaVersion: 2024 },
    },
];
