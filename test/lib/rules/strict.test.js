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
    // "never" mode
    { text: "foo();", options: ["never"] },
    { text: "function foo() { return; }", options: ["never"] },
    { text: "var foo = function() { return; };", options: ["never"] },
    { text: "foo(); 'use strict';", options: ["never"] },
    {
        text: "function foo() { bar(); 'use strict'; return; }",
        options: ["never"],
    },
    {
        text: "var foo = function() { { 'use strict'; } return; };",
        options: ["never"],
    },
    {
        text: "(function() { bar('use strict'); return; }());",
        options: ["never"],
    },
    {
        text: "var fn = x => 1;",
        options: ["never"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var fn = x => { return; };",
        options: ["never"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "foo();",
        options: ["never"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function foo() { return; }",
        options: ["never"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // "global" mode
    { text: "// Intentionally empty", options: ["global"] },
    { text: '"use strict"; foo();', options: ["global"] },
    {
        text: "/* license */\n/* eslint-disable rule-to-test/strict */\nfoo();",
        options: ["global"],
    },
    {
        text: "foo();",
        options: ["global"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function foo() { return; }",
        options: ["global"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "'use strict'; function foo() { return; }",
        options: ["global"],
    },
    {
        text: "'use strict'; var foo = function() { return; };",
        options: ["global"],
    },
    {
        text: "'use strict'; function foo() { bar(); 'use strict'; return; }",
        options: ["global"],
    },
    {
        text: "'use strict'; var foo = function() { bar(); 'use strict'; return; };",
        options: ["global"],
    },
    {
        text: "'use strict'; function foo() { return function() { bar(); 'use strict'; return; }; }",
        options: ["global"],
    },
    {
        text: "'use strict'; var foo = () => { return () => { bar(); 'use strict'; return; }; }",
        options: ["global"],
        languageOptions: { ecmaVersion: 6 },
    },

    // "function" mode
    {
        text: "function foo() { 'use strict'; return; }",
        options: ["function"],
    },
    {
        text: "function foo() { return; }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function foo() { return; }",
        options: ["function"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "var foo = function() { return; }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "var foo = function() { 'use strict'; return; }",
        options: ["function"],
    },
    {
        text: "function foo() { 'use strict'; return; } var bar = function() { 'use strict'; bar(); };",
        options: ["function"],
    },
    {
        text: "var foo = function() { 'use strict'; function bar() { return; } bar(); };",
        options: ["function"],
    },
    {
        text: "var foo = () => { 'use strict'; var bar = () => 1; bar(); };",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var foo = () => { var bar = () => 1; bar(); };",
        options: ["function"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "class A { constructor() { } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class A { foo() { } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class A { foo() { function bar() { } } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function() { 'use strict'; function foo(a = 0) { } }())",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },

    // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
    { text: "function foo() { 'use strict'; return; }", options: ["safe"] },
    {
        text: "'use strict'; function foo() { return; }",
        options: ["safe"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "function foo() { return; }",
        options: ["safe"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function foo() { return; }",
        options: ["safe"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // defaults to "safe" mode
    { text: "function foo() { 'use strict'; return; }" },
    {
        text: "'use strict'; function foo() { return; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "function foo() { return; }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "function foo() { return; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // class static blocks do not have directive prologues, therefore this rule should never require od disallow "use strict" statement in them.
    {
        text: "'use strict'; class C { static { foo; } }",
        options: ["global"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "'use strict'; class C { static { 'use strict'; } }",
        options: ["global"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "'use strict'; class C { static { 'use strict'; 'use strict'; } }",
        options: ["global"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo; } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { 'use strict'; } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { 'use strict'; 'use strict'; } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { foo; } }",
        options: ["never"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { 'use strict'; } }",
        options: ["never"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { 'use strict'; 'use strict'; } }",
        options: ["never"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { 'use strict'; } }",
        options: ["safe"],
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { 'use strict'; } }",
        options: ["safe"],
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
];

const invalid = [
    // "never" mode
    {
        text: '"use strict"; foo();',
        options: ["never"],
    },
    {
        text: "function foo() { 'use strict'; return; }",
        options: ["never"],
    },
    {
        text: "var foo = function() { 'use strict'; return; };",
        options: ["never"],
    },
    {
        text: "function foo() { return function() { 'use strict'; return; }; }",
        options: ["never"],
    },
    {
        text: "'use strict'; function foo() { \"use strict\"; return; }",
        options: ["never"],
    },
    {
        text: '"use strict"; foo();',
        options: ["never"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["never"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["never"],
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // "global" mode
    {
        text: "foo();",
        options: ["global"],
    },
    {
        text: "/* license */\nfunction foo() {}\nfunction bar() {}\n/* end */",
        options: ["global"],
    },
    {
        text: "function foo() { 'use strict'; return; }",
        options: ["global"],
    },
    {
        text: "var foo = function() { 'use strict'; return; }",
        options: ["global"],
    },
    {
        text: "var foo = () => { 'use strict'; return () => 1; }",
        options: ["global"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["global"],
    },
    {
        text: "'use strict'; var foo = function() { 'use strict'; return; };",
        options: ["global"],
    },
    {
        text: "'use strict'; 'use strict'; foo();",
        options: ["global"],
    },
    {
        text: "'use strict'; foo();",
        options: ["global"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["global"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["global"],
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // "function" mode
    {
        text: "'use strict'; foo();",
        options: ["function"],
    },
    {
        text: "'use strict'; (function() { 'use strict'; return true; }());",
        options: ["function"],
    },
    {
        text: "(function() { 'use strict'; function f() { 'use strict'; return } return true; }());",
        options: ["function"],
    },
    {
        text: "(function() { return true; }());",
        options: ["function"],
    },
    {
        text: "(() => { return true; })();",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(() => true)();",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var foo = function() { foo(); 'use strict'; return; }; function bar() { foo(); 'use strict'; }",
        options: ["function"],
    },
    {
        text: "function foo() { 'use strict'; 'use strict'; return; }",
        options: ["function"],
    },
    {
        text: "var foo = function() { 'use strict'; 'use strict'; return; }",
        options: ["function"],
    },
    {
        text: "var foo = function() {  'use strict'; return; }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["function"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["function"],
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "function foo() { return function() { 'use strict'; return; }; }",
        options: ["function"],
    },
    {
        text: "var foo = function() { function bar() { 'use strict'; return; } return; }",
        options: ["function"],
    },
    {
        text: "function foo() { 'use strict'; return; } var bar = function() { return; };",
        options: ["function"],
    },
    {
        text: "var foo = function() { 'use strict'; return; }; function bar() { return; };",
        options: ["function"],
    },
    {
        text: "function foo() { 'use strict'; return function() { 'use strict'; 'use strict'; return; }; }",
        options: ["function"],
    },
    {
        text: "var foo = function() { 'use strict'; function bar() { 'use strict'; 'use strict'; return; } }",
        options: ["function"],
    },
    {
        text: "var foo = () => { return; };",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },

    // Classes
    {
        text: 'class A { constructor() { "use strict"; } }',
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: 'class A { foo() { "use strict"; } }',
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: 'class A { foo() { function bar() { "use strict"; } } }',
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: 'class A { field = () => { "use strict"; } }',
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: 'class A { field = function() { "use strict"; } }',
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },

    // "safe" mode corresponds to "global" if ecmaFeatures.globalReturn is true, otherwise "function"
    {
        text: "'use strict'; function foo() { return; }",
        options: ["safe"],
    },
    {
        text: "function foo() { 'use strict'; return; }",
        options: ["safe"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["safe"],
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        options: ["safe"],
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // Default to "safe" mode
    {
        text: "'use strict'; function foo() { return; }",
    },
    {
        text: "function foo() { return; }",
    },
    {
        text: "function foo() { 'use strict'; return; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        languageOptions: {
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "'use strict'; function foo() { 'use strict'; return; }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },

    // Reports deprecated syntax: https://github.com/eslint/eslint/issues/6405
    {
        text: "function foo(a = 0) { 'use strict' }",
        options: [],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
        options: [],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 0) { 'use strict' }",
        options: [],
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "'use strict'; function foo(a = 0) { 'use strict' }",
        options: [],
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "function foo(a = 0) { 'use strict' }",
        options: ["never"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 0) { 'use strict' }",
        options: ["global"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "'use strict'; function foo(a = 0) { 'use strict' }",
        options: ["global"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 0) { 'use strict' }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function() { 'use strict'; function foo(a = 0) { 'use strict' } }())",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 0) { }",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function() { function foo(a = 0) { } }())",
        options: ["function"],
        languageOptions: { ecmaVersion: 6 },
    },

    // functions inside class static blocks should be checked
    {
        text: "'use strict'; class C { static { function foo() { \n'use strict'; } } }",
        options: ["global"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { function foo() { \n'use strict'; } } }",
        options: ["never"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { function foo() { \n'use strict'; } } }",
        options: ["safe"],
        languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    {
        text: "class C { static { function foo() { \n'use strict'; } } }",
        options: ["safe"],
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: { ecmaFeatures: { impliedStrict: true } },
        },
    },
    {
        text: "function foo() {'use strict'; class C { static { function foo() { \n'use strict'; } } } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { function foo() { \n'use strict'; } } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { function foo() { \n'use strict';\n'use strict'; } } }",
        options: ["function"],
        languageOptions: { ecmaVersion: 2022 },
    },
];
