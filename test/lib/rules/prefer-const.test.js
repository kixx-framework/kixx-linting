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

import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";

const valid = [
    { text: "var x = 0;" },
    { text: "let x;" },
    { text: "let x; { x = 0; } foo(x);" },
    { text: "let x = 0; x = 1;" },
    {
        text: "using resource = fn();",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
    {
        text: "await using resource = fn();",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
    { text: "const x = 0;" },
    { text: "for (let i = 0, end = 10; i < end; ++i) {}" },
    { text: "for (let i in [1,2,3]) { i = 0; }" },
    { text: "for (let x of [1,2,3]) { x = 0; }" },
    { text: "(function() { var x = 0; })();" },
    { text: "(function() { let x; })();" },
    { text: "(function() { let x; { x = 0; } foo(x); })();" },
    { text: "(function() { let x = 0; x = 1; })();" },
    { text: "(function() { const x = 0; })();" },
    { text: "(function() { for (let i = 0, end = 10; i < end; ++i) {} })();" },
    { text: "(function() { for (let i in [1,2,3]) { i = 0; } })();" },
    { text: "(function() { for (let x of [1,2,3]) { x = 0; } })();" },
    { text: "(function(x = 0) { })();" },
    { text: "let a; while (a = foo());" },
    { text: "let a; do {} while (a = foo());" },
    { text: "let a; for (; a = foo(); );" },
    { text: "let a; for (;; ++a);" },
    { text: "let a; for (const {b = ++a} in foo());" },
    { text: "let a; for (const {b = ++a} of foo());" },
    { text: "let a; for (const x of [1,2,3]) { if (a) {} a = foo(); }" },
    { text: "let a; for (const x of [1,2,3]) { a = a || foo(); bar(a); }" },
    { text: "let a; for (const x of [1,2,3]) { foo(++a); }" },
    { text: "let a; function foo() { if (a) {} a = bar(); }" },
    { text: "let a; function foo() { a = a || bar(); baz(a); }" },
    { text: "let a; function foo() { bar(++a); }" },
    {
        text: [
            "let id;",
            "function foo() {",
            "    if (typeof id !== 'undefined') {",
            "        return;",
            "    }",
            "    id = setInterval(() => {}, 250);",
            "}",
            "foo();",
        ].join("\n"),
    },
    { text: "/*exported a*/ let a; function init() { a = foo(); }" },
    { text: "/*exported a*/ let a = 1" },
    { text: "let a; if (true) a = 0; foo(a);" },
    {
        text: `
        (function (a) {
            let b;
            ({ a, b } = obj);
        })();
        `,
    },
    {
        text: `
        (function (a) {
            let b;
            ([ a, b ] = obj);
        })();
        `,
    },
    { text: "var a; { var b; ({ a, b } = obj); }" },
    { text: "let a; { let b; ({ a, b } = obj); }" },
    { text: "var a; { var b; ([ a, b ] = obj); }" },
    { text: "let a; { let b; ([ a, b ] = obj); }" },

    /*
		 * The assignment is located in a different scope.
		 * Those are warned by prefer-smaller-scope.
		 */
    { text: "let x; { x = 0; foo(x); }" },
    { text: "(function() { let x; { x = 0; foo(x); } })();" },
    { text: "let x; for (const a of [1,2,3]) { x = foo(); bar(x); }" },
    { text: "(function() { let x; for (const a of [1,2,3]) { x = foo(); bar(x); } })();" },
    { text: "let x; for (x of array) { x; }" },

    {
        text: "let {a, b} = obj; b = 0;",
        options: [{ destructuring: "all" }],
    },
    {
        text: "let a, b; ({a, b} = obj); b++;",
        options: [{ destructuring: "all" }],
    },

    // https://github.com/eslint/eslint/issues/8187
    {
        text: "let { name, ...otherStuff } = obj; otherStuff = {};",
        options: [{ destructuring: "all" }],
        languageOptions: { ecmaVersion: 2018 },
    },

    // https://github.com/eslint/eslint/issues/8308
    {
        text: "let predicate; [typeNode.returnType, predicate] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [typeNode.returnType, ...predicate] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        // intentionally testing empty slot in destructuring assignment
        text: "let predicate; [typeNode.returnType,, predicate] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [typeNode.returnType=5, predicate] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [[typeNode.returnType=5], predicate] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [[typeNode.returnType, predicate]] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [typeNode.returnType, [predicate]] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [, [typeNode.returnType, predicate]] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [, {foo:typeNode.returnType, predicate}] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [, {foo:typeNode.returnType, ...predicate}] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let a; const b = {}; ({ a, c: b.c } = func());",
        languageOptions: { ecmaVersion: 2018 },
    },

    // ignoreReadBeforeAssign
    {
        text: "let x; function foo() { bar(x); } x = 0;",
        options: [{ ignoreReadBeforeAssign: true }],
    },

    // https://github.com/eslint/eslint/issues/10520
    { text: "const x = [1,2]; let y; [,y] = x; y = 0;" },
    { text: "const x = [1,2,3]; let y, z; [y,,z] = x; y = 0; z = 0;" },

    {
        text: "class C { static { let a = 1; a = 2; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; a = 1; a = 2; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "let a; class C { static { a = 1; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; if (foo) { a = 1; } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; if (foo) a = 1; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a, b; if (foo) { ({ a, b } = foo); } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a, b; if (foo) ({ a, b } = foo); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { a; } } let a = 1; ",
        options: [{ ignoreReadBeforeAssign: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { () => a; let a = 1; } };",
        options: [{ ignoreReadBeforeAssign: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
];

const invalid = [
    {
        text: "let x = 1; foo(x);",
    },
    {
        text: "for (let i in [1,2,3]) { foo(i); }",
    },
    {
        text: "for (let x of [1,2,3]) { foo(x); }",
    },
    {
        text: "let [x = -1, y] = [1,2]; y = 0;",
    },
    {
        text: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
    },
    {
        text: "(function() { let x = 1; foo(x); })();",
    },
    {
        text: "(function() { for (let i in [1,2,3]) { foo(i); } })();",
    },
    {
        text: "(function() { for (let x of [1,2,3]) { foo(x); } })();",
    },
    {
        text: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
    },
    {
        text: "let f = (function() { let g = x; })(); f = 1;",
    },
    {
        text: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
    },
    {
        text: "let x = 0; { let x = 1; foo(x); } x = 0;",
    },
    {
        text: "for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }",
    },
    {
        text: "for (let i in [1,2,3]) { let x = 1; foo(x); }",
    },
    {
        text: [
            "var foo = function() {",
            "    for (const b of c) {",
            "       let a;",
            "       a = 1;",
            "   }",
            "};",
        ].join("\n"),
    },
    {
        text: [
            "var foo = function() {",
            "    for (const b of c) {",
            "       let a;",
            "       ({a} = 1);",
            "   }",
            "};",
        ].join("\n"),
    },

    {
        text: "let x; x = 0;",
    },
    {
        text: "switch (a) { case 0: let x; x = 0; }",
    },
    {
        text: "(function() { let x; x = 1; })();",
    },

    {
        text: "let {a = 0, b} = obj; b = 0; foo(a, b);",
        options: [{ destructuring: "any" }],
    },
    {
        text: "let {a: {b, c}} = {a: {b: 1, c: 2}}; b = 3;",
        options: [{ destructuring: "any" }],
    },
    {
        text: "let {a: {b, c}} = {a: {b: 1, c: 2}}",
        options: [{ destructuring: "all" }],
    },
    {
        text: "let a, b; ({a = 0, b} = obj); b = 0; foo(a, b);",
        options: [{ destructuring: "any" }],
    },
    {
        text: "let {a = 0, b} = obj; foo(a, b);",
        options: [{ destructuring: "all" }],
    },
    {
        text: "let [a] = [1]",
        options: [],
    },
    {
        text: "let {a} = obj",
        options: [],
    },
    {
        text: "let a, b; ({a = 0, b} = obj); foo(a, b);",
        options: [{ destructuring: "all" }],
    },
    {
        text: "let {a = 0, b} = obj, c = a; b = a;",
        options: [{ destructuring: "any" }],
    },
    {
        text: "let {a = 0, b} = obj, c = a; b = a;",
        options: [{ destructuring: "all" }],
    },

    // https://github.com/eslint/eslint/issues/8187
    {
        text: "let { name, ...otherStuff } = obj; otherStuff = {};",
        options: [{ destructuring: "any" }],
        languageOptions: { ecmaVersion: 2018 },
    },

    // Warnings are located at declaration if there are reading references before assignments.
    {
        text: "let x; function foo() { bar(x); } x = 0;",
    },

    // https://github.com/eslint/eslint/issues/5837
    {
        text: "/*eslint custom/use-x:error*/ let x = 1",
        languageOptions: {
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "/*eslint custom/use-x:error*/ { let x = 1 }",
    },
    {
        text: "let { foo, bar } = baz;",
    },

    // https://github.com/eslint/eslint/issues/10520
    {
        text: "const x = [1,2]; let [,y] = x;",
    },
    {
        text: "const x = [1,2,3]; let [y,,z] = x;",
    },

    // https://github.com/eslint/eslint/issues/8308
    {
        text: "let predicate; [, {foo:returnType, predicate}] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [, {foo:returnType, predicate}, ...bar ] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let predicate; [, {foo:returnType, ...predicate} ] = foo();",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        text: "let x = 'x', y = 'y';",
    },
    {
        text: "let x = 'x', y = 'y'; x = 1",
    },
    {
        text: "let x = 1, y = 'y'; let z = 1;",
    },
    {
        text: "let { a, b, c} = obj; let { x, y, z} = anotherObj; x = 2;",
    },
    {
        text: "let x = 'x', y = 'y'; function someFunc() { let a = 1, b = 2; foo(a, b) }",
    },

    // The inner `let` will be auto-fixed in the second pass
    {
        text: "let someFunc = () => { let a = 1, b = 2; foo(a, b) }",
    },

    // https://github.com/eslint/eslint/issues/11699
    {
        text: "let {a, b} = c, d;",
    },
    {
        text: "let {a, b, c} = {}, e, f;",
    },
    {
        text: [
            "function a() {",
            "let foo = 0,",
            "  bar = 1;",
            "foo = 1;",
            "}",
            "function b() {",
            "let foo = 0,",
            "  bar = 2;",
            "foo = 2;",
            "}",
        ].join("\n"),
    },

    // https://github.com/eslint/eslint/issues/13899
    {
        text: "/*eslint no-undef-init:error*/ let foo = undefined;",
    },

    {
        text: "let a = 1; class C { static { a; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        // this is a TDZ error with either `let` or `const`, but that isn't a concern of this rule
        text: "class C { static { a; } } let a = 1;",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a = 1; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { if (foo) { let a = 1; } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a = 1; if (foo) { a; } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { if (foo) { let a; a = 1; } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; a = 1; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let { a, b } = foo; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a, b; ({ a, b } = foo); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; let b; ({ a, b } = foo); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; a = 0; console.log(a); } }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // https://github.com/eslint/eslint/issues/16266
    {
        text: `
            let { itemId, list } = {},
            obj = [],
            total = 0;
            total = 9;
            console.log(itemId, list, obj, total);
            `,
        options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            let { itemId, list } = {},
            obj = [];
            console.log(itemId, list, obj);
            `,
        options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            let [ itemId, list ] = [],
            total = 0;
            total = 9;
            console.log(itemId, list, total);
            `,
        options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            let [ itemId, list ] = [],
            obj = [];
            console.log(itemId, list, obj);
            `,
        options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
        languageOptions: { ecmaVersion: 2022 },
    },
];

describe("prefer-const", ({ describe }) => {

    const globalRules = { "prefer-const": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["prefer-const"] = rules["prefer-const"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    // eslint-disable-next-line no-console
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["prefer-const"] = rules["prefer-const"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("prefer-const", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
