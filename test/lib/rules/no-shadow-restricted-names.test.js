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
    { text: "function foo(bar){ var baz; }" },
    { text: "!function foo(bar){ var baz; }" },
    { text: "!function(bar){ var baz; }" },
    { text: "try {} catch(e) {}" },
    {
        text: "export default function() {}",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "try {} catch {}",
        languageOptions: { ecmaVersion: 2019 },
    },
    { text: "var undefined;" },
    { text: "var undefined; doSomething(undefined);" },
    { text: "var undefined; var undefined;" },
    {
        text: "let undefined",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "import { undefined as undef } from 'foo';",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2015,
        },
    },
    {
        text: "let globalThis;",
        options: [{ reportGlobalThis: false }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "class globalThis {}",
        options: [{ reportGlobalThis: false }],
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "import { baz as globalThis } from 'foo';",
        options: [{ reportGlobalThis: false }],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
        },
    },
    {
        text: "globalThis.foo",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "const foo = globalThis",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "function foo() { return globalThis; }",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "import { globalThis as foo } from 'bar'",
        languageOptions: { ecmaVersion: 2020, sourceType: "module" },
    },
];
const invalid = [
    {
        text: "function NaN(NaN) { var NaN; !function NaN(NaN) { try {} catch(NaN) {} }; }",
    },
    {
        text: "function undefined(undefined) { !function undefined(undefined) { try {} catch(undefined) {} }; }",
    },
    {
        text: "function Infinity(Infinity) { var Infinity; !function Infinity(Infinity) { try {} catch(Infinity) {} }; }",
    },
    {
        text: "function arguments(arguments) { var arguments; !function arguments(arguments) { try {} catch(arguments) {} }; }",
    },
    {
        text: "function eval(eval) { var eval; !function eval(eval) { try {} catch(eval) {} }; }",
    },
    {
        text: "var eval = (eval) => { var eval; !function eval(eval) { try {} catch(eval) {} }; }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var [undefined] = [1]",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var {undefined} = obj; var {a: undefined} = obj; var {a: {b: {undefined}}} = obj; var {a, ...undefined} = obj;",
        languageOptions: { ecmaVersion: 9 },
    },
    {
        text: "var undefined; undefined = 5;",
    },
    {
        text: "class undefined {}",
        languageOptions: {
            ecmaVersion: 2015,
        },
    },
    {
        text: "(class undefined {})",
        languageOptions: {
            ecmaVersion: 2015,
        },
    },
    {
        text: "import undefined from 'foo';",
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: "module",
        },
    },
    {
        text: "import { undefined } from 'foo';",
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: "module",
        },
    },
    {
        text: "import { baz as undefined } from 'foo';",
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: "module",
        },
    },
    {
        text: "import * as undefined from 'foo';",
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: "module",
        },
    },
    {
        text: "function globalThis(globalThis) { var globalThis; !function globalThis(globalThis) { try {} catch(globalThis) {} }; }",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "function globalThis(globalThis) { var globalThis; !function globalThis(globalThis) { try {} catch(globalThis) {} }; }",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "const [globalThis] = [1]",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var {globalThis} = obj; var {a: globalThis} = obj; var {a: {b: {globalThis}}} = obj; var {a, ...globalThis} = obj;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let globalThis; globalThis = 5;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "class globalThis {}",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(class globalThis {})",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "import globalThis from 'foo';",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
        },
    },
    {
        text: "import { globalThis } from 'foo';",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
        },
    },
    {
        text: "import { baz as globalThis } from 'foo';",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
        },
    },
    {
        text: "import * as globalThis from 'foo';",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
        },
    },
];
