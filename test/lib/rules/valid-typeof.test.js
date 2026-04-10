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
    { text: "typeof foo === 'string'" },
    { text: "typeof foo === 'object'" },
    { text: "typeof foo === 'function'" },
    { text: "typeof foo === 'undefined'" },
    { text: "typeof foo === 'boolean'" },
    { text: "typeof foo === 'number'" },
    { text: "typeof foo === 'bigint'" },
    { text: "'string' === typeof foo" },
    { text: "'object' === typeof foo" },
    { text: "'function' === typeof foo" },
    { text: "'undefined' === typeof foo" },
    { text: "'boolean' === typeof foo" },
    { text: "'number' === typeof foo" },
    { text: "typeof foo === typeof bar" },
    { text: "typeof foo === baz" },
    { text: "typeof foo !== someType" },
    { text: "typeof bar != someType" },
    { text: "someType === typeof bar" },
    { text: "someType == typeof bar" },
    { text: "typeof foo == 'string'" },
    { text: "typeof(foo) === 'string'" },
    { text: "typeof(foo) !== 'string'" },
    { text: "typeof(foo) == 'string'" },
    { text: "typeof(foo) != 'string'" },
    { text: "var oddUse = typeof foo + 'thing'" },
    { text: "function f(undefined) { typeof x === undefined }" },
    {
        text: "typeof foo === 'number'",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: 'typeof foo === "number"',
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "var baz = typeof foo + 'thing'",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "typeof foo === typeof bar",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "typeof foo === `string`",
        options: [{ requireStringLiterals: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "`object` === typeof foo",
        options: [{ requireStringLiterals: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "typeof foo === `str${somethingElse}`",
        languageOptions: { ecmaVersion: 6 },
    },
];

const invalid = [
    {
        text: "typeof foo === 'strnig'",
    },
    {
        text: "'strnig' === typeof foo",
    },
    {
        text: "if (typeof bar === 'umdefined') {}",
    },
    {
        text: "typeof foo !== 'strnig'",
    },
    {
        text: "'strnig' !== typeof foo",
    },
    {
        text: "if (typeof bar !== 'umdefined') {}",
    },
    {
        text: "typeof foo != 'strnig'",
    },
    {
        text: "'strnig' != typeof foo",
    },
    {
        text: "if (typeof bar != 'umdefined') {}",
    },
    {
        text: "typeof foo == 'strnig'",
    },
    {
        text: "'strnig' == typeof foo",
    },
    {
        text: "if (typeof bar == 'umdefined') {}",
    },
    {
        text: "if (typeof bar === `umdefined`) {}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "typeof foo == 'invalid string'",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "if (typeof bar !== undefined) {}",
    },
    {
        text: "typeof foo == Object",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "typeof foo === undefined",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "undefined === typeof foo",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "undefined == typeof foo",
        options: [{ requireStringLiterals: true }],
    },
    {
        text: "typeof foo === `undefined${foo}`",
        options: [{ requireStringLiterals: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "typeof foo === `${string}`",
        options: [{ requireStringLiterals: true }],
        languageOptions: { ecmaVersion: 6 },
    },
];
