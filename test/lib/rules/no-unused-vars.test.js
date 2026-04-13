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
    "var foo = 5;\n\nlabel: while (true) {\n  console.log(foo);\n  break label;\n}",
    "var foo = 5;\n\nwhile (true) {\n  console.log(foo);\n  break;\n}",
    {
        text: "for (let prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
        languageOptions: { ecmaVersion: 6 },
    },
    "var box = {a: 2};\n    for (var prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
    { text: "a; var a;" },
    { text: "var a=10; alert(a);" },
    { text: "var a=10; (function() { alert(a); })();" },
    {
        text: "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();",
    },
    { text: "var a=10; d[a] = 0;" },
    { text: "(function() { var a=10; return a; })();" },
    { text: "(function g() {})()" },
    { text: "function f(a) {alert(a);}; f();" },
    {
        text: "var c = 0; function f(a){ var b = a; return b; }; f(c);",
    },
    {
        text: "var arr1 = [1, 2]; var arr2 = [3, 4]; for (var i in arr1) { arr1[i] = 5; } for (var i in arr2) { arr2[i] = 10; }",
    },
    { text: 'var min = "min"; Math[min];' },
    { text: "Foo.bar = function(baz) { return baz; };" },
    "myFunc(function foo() {}.bind(this))",
    "myFunc(function foo(){}.toString())",
    "(function() { var doSomething = function doSomething() {}; doSomething() }())",
    "/*global a */ a;",
    {
        text: "var a=10; (function() { alert(a); })();",
    },
    "(function z() { z(); })();",
    {
        text: 'var who = "Paul";\nmodule.exports = `Hello ${who}!`;',
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "export var foo = 123;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export function foo () {}",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export class foo {}",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "class Foo{}; var x = new Foo(); x.foo()",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: 'const foo = "hello!";function bar(foobar = foo) {  foobar.replace(/!$/, " world!");}\nbar();',
        languageOptions: { ecmaVersion: 6 },
    },
    "function Foo(){}; var x = new Foo(); x.foo()",
    "function foo() {var foo = 1; return foo}; foo();",
    "function foo(foo) {return foo}; foo(1);",
    "function foo() {function foo() {return 1;}; return foo()}; foo();",
    {
        text: "function foo() {var foo = 1; return foo}; foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(foo) {return foo}; foo(1);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() {function foo() {return 1;}; return foo()}; foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; const [y = x] = []; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; const {y = x} = {}; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; const {z: [y = x]} = {}; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = []; const {z: [y] = x} = {}; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; let y; [y = x] = []; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; let y; ({z: [y = x]} = {}); foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = []; let y; ({z: [y] = x} = {}); foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; function foo(y = x) { bar(y); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; function foo({y = x} = {}) { bar(y); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const x = 1; function foo(y = function() { bar(x); }) { y(); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; var [y = x] = []; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; var {y = x} = {}; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; var {z: [y = x]} = {}; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = []; var {z: [y] = x} = {}; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1, y; [y = x] = []; foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1, y; ({z: [y = x]} = {}); foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = [], y; ({z: [y] = x} = {}); foo(y);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; function foo(y = x) { bar(y); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; function foo({y = x} = {}) { bar(y); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 1; function foo(y = function() { bar(x); }) { y(); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },

    // exported variables should work
    "/*exported toaster*/ var toaster = 'great'",
    "/*exported toaster, poster*/ var toaster = 1; poster = 0;",
    {
        text: "/*exported x*/ var { x } = y",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "/*exported x, y*/  var { x, y } = z",
        languageOptions: { ecmaVersion: 6 },
    },

    // Can mark variables as used via context.markVariableAsUsed()
    "/*eslint custom/use-every-a:1*/ var a;",
    "/*eslint custom/use-every-a:1*/ !function(a) { return 1; }",
    "/*eslint custom/use-every-a:1*/ !function() { var a; return 1 }",

    // ignore pattern
    {
        text: "var _a;",
    },
    {
        text: "function foo() { var _b; } foo();",
    },
    {
        text: "function foo(_a) { } foo();",
    },
    {
        text: "function foo(a, _b) { return a; } foo();",
    },
    {
        text: "const [ a, _b, c ] = items;\nconsole.log(a+c);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [ [a, _b, c] ] = items;\nconsole.log(a+c);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { x: [_a, foo] } = bar;\nconsole.log(foo);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function baz([_b, foo]) { foo; };\nbaz()",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function baz({x: [_b, foo]}) {foo};\nbaz()",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function baz([{x: [_b, foo]}]) {foo};\nbaz()",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            let _a, b;
            foo.forEach(item => {
                [_a, b] = item;
                doSomething(b);
            });
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            [_a, b] = foo;
            _a = 1;
            b;
            `,
        languageOptions: { ecmaVersion: 2018 },
    },

    // for-in loops (see #2342)
    "(function(obj) { var name; for ( name in obj ) return; })({});",
    "(function(obj) { var name; for ( name in obj ) { return; } })({});",
    "(function(obj) { for ( var name in obj ) { return true } })({})",
    "(function(obj) { for ( var name in obj ) return true })({})",

    {
        text: "(function(obj) { let name; for ( name in obj ) return; })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(obj) { let name; for ( name in obj ) { return; } })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(obj) { for ( let name in obj ) { return true } })({})",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(obj) { for ( let name in obj ) return true })({})",
        languageOptions: { ecmaVersion: 6 },
    },

    {
        text: "(function(obj) { for ( const name in obj ) { return true } })({})",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(obj) { for ( const name in obj ) return true })({})",
        languageOptions: { ecmaVersion: 6 },
    },

    // For-of loops
    {
        text: "(function(iter) { let name; for ( name of iter ) return; })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(iter) { let name; for ( name of iter ) { return; } })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(iter) { for ( let name of iter ) { return true } })({})",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(iter) { for ( let name of iter ) return true })({})",
        languageOptions: { ecmaVersion: 6 },
    },

    {
        text: "(function(iter) { for ( const name of iter ) { return true } })({})",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(iter) { for ( const name of iter ) return true })({})",
        languageOptions: { ecmaVersion: 6 },
    },

    // Sequence Expressions (See https://github.com/eslint/eslint/issues/14325)
    {
        text: "let x = 0; foo = (0, x++);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let x = 0; foo = (0, x += 1);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let x = 0; foo = (0, x = x + 1);",
        languageOptions: { ecmaVersion: 6 },
    },

    // caughtErrors
    {
        text: "try{}catch(err){console.error(err);}",
    },
    // catch variables with _ prefix are still reported (no caughtErrorsIgnorePattern)
    {
        text: "try{}catch(_err){console.error(_err);}",
    },

    // https://github.com/eslint/eslint/issues/6348
    "var a = 0, b; b = a = a + 1; foo(b);",
    "var a = 0, b; b = a += a + 1; foo(b);",
    "var a = 0, b; b = a++; foo(b);",
    "function foo(a) { var b = a = a + 1; bar(b) } foo();",
    "function foo(a) { var b = a += a + 1; bar(b) } foo();",
    "function foo(a) { var b = a++; bar(b) } foo();",

    // https://github.com/eslint/eslint/issues/6576
    [
        "var unregisterFooWatcher;",
        "// ...",
        'unregisterFooWatcher = $scope.$watch( "foo", function() {',
        "    // ...some code..",
        "    unregisterFooWatcher();",
        "});",
    ].join("\n"),
    [
        "var ref;",
        "ref = setInterval(",
        "    function(){",
        "        clearInterval(ref);",
        "    }, 10);",
    ].join("\n"),
    [
        "var _timer;",
        "function f() {",
        "    _timer = setTimeout(function () {}, _timer ? 100 : 0);",
        "}",
        "f();",
    ].join("\n"),
    "function foo(cb) { cb = function() { function something(a) { cb(1 + a); } register(something); }(); } foo();",
    {
        text: "function* foo(cb) { cb = yield function(a) { cb(1 + a); }; } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(cb) { cb = tag`hello${function(a) { cb(1 + a); }}`; } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    "function foo(cb) { var b; cb = b = function(a) { cb(1 + a); }; b(); } foo();",

    // https://github.com/eslint/eslint/issues/6646
    [
        "function someFunction() {",
        "    var a = 0, i;",
        "    for (i = 0; i < 2; i++) {",
        "        a = myFunction(a);",
        "    }",
        "}",
        "someFunction();",
    ].join("\n"),

    // https://github.com/eslint/eslint/issues/7351
    {
        text: "(class { set foo(UNUSED) {} })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class Foo { set bar(UNUSED) {} } console.log(Foo)",
        languageOptions: { ecmaVersion: 6 },
    },

    // https://github.com/eslint/eslint/issues/10952
    "/*eslint custom/use-every-a:1*/ !function(b, a) { return 1 }",

    // https://github.com/eslint/eslint/issues/10982
    "var a = function () { a(); }; a();",
    "var a = function(){ return function () { a(); } }; a();",
    {
        text: "const a = () => { a(); }; a();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "const a = () => () => { a(); }; a();",
        languageOptions: { ecmaVersion: 2015 },
    },

    // export * as ns from "source"
    {
        text: 'export * as ns from "source"',
        languageOptions: { ecmaVersion: 2020, sourceType: "module" },
    },

    // import.meta
    {
        text: "import.meta",
        languageOptions: { ecmaVersion: 2020, sourceType: "module" },
    },

    // https://github.com/eslint/eslint/issues/17299
    {
        text: "var a; a ||= 1;",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var a; a &&= 1;",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var a; a ??= 1;",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "using resource = getResource();\nresource;",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
];

const invalid = [
    {
        text: "function foox() { return foox(); }",
    },
    {
        text: "(function() { function foox() { if (true) { return foox(); } } }())",
    },
    {
        text: "var a=10",
    },
    {
        text: "function f() { var a = 1; return function(){ f(a *= 2); }; }",
    },
    {
        text: "function f() { var a = 1; return function(){ f(++a); }; }",
    },
    {
        text: "/*global a */",
    },
    {
        text: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);}); }; foo();",
    },
    {
        text: "var a=10;",
    },
    {
        text: "var a=10; a=20;",
    },
    {
        text: "var a=10; (function() { var a = 1; alert(a); })();",
    },
    {
        text: "var a=10, b=0, c=null; alert(a+b)",
    },
    {
        text: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);",
    },
    {
        text: "var a=10, b=0, c=null; alert(c); setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);",
    },
    {
        text: "function f(){var a=[];return a.map(function(){});}",
    },
    {
        text: "function f(){var a=[];return a.map(function g(){});}",
    },
    {
        text: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }",
    },
    {
        text: "function f(){var x;function a(){x=42;}function b(){alert(x);} b(); } f();",
    },
    {
        text: "function f(a) {}; f();",
    },
    {
        text: "function a(y, z){ return y; }; a();",
    },
    {
        text: "var min = Math.min",
    },
    {
        text: "var min = {min: 1}",
    },
    {
        text: "Foo.bar = function(baz) { return 1; }",
    },
    {
        text: "var min = {min: 1}",
    },
    {
        text: "function gg(baz, bar) { return baz; }; gg();",
    },
    {
        text: "(function(baz, bar) { return baz; })();",
    },
    {
        text: "(function z() { var bar = 33; })();",
    },
    {
        text: "(function z(foo) { z(); })();",
    },
    {
        text: "function f() { var a = 1; return function(){ f(a = 2); }; }; f();",
    },
    {
        text: 'import x from "y";',
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export function fn2({ x, y }) {\n console.log(x); \n};",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export function fn2( x, y ) {\n console.log(x); \n};",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },

    // exported
    {
        text: "/*exported max*/ var max = 1, min = {min: 1}",
    },
    {
        text: "/*exported x*/ var { x, y } = z",
        languageOptions: { ecmaVersion: 6 },
    },

    // ignore pattern
    {
        text: "var _a; var b;",
    },
    {
        text: "function foo() { var _b; var c_; } foo();",
    },
    {
        text: "function foo(a, _b) { } foo();",
    },

    // https://github.com/eslint/eslint/issues/15611
    {
        text: "const array = ['a', 'b', 'c']; const [a, _b, c] = array; const newArray = [a]; console.log(newArray);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "const array = ['a', 'b', 'c', 'd', 'e']; const [a, _b] = array;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "const array = [obj]; const [{a, foo}] = array; console.log(foo);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "function foo([{a, bar}]) {bar;}foo();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let _a, b; foo.forEach(item => { [a, b] = item; });",
        languageOptions: { ecmaVersion: 2020 },
    },

    // for-in loops (see #2342)
    {
        text: "(function(obj) { var name; for ( name in obj ) { i(); return; } })({});",
    },
    {
        text: "(function(obj) { var name; for ( name in obj ) { } })({});",
    },
    {
        text: "(function(obj) { for ( var name in obj ) { } })({});",
    },
    {
        text: "for ( var { foo } in bar ) { }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for ( var [ foo ] in bar ) { }",
        languageOptions: { ecmaVersion: 6 },
    },

    // For-of loops
    {
        text: "(function(iter) { var name; for ( name of iter ) { i(); return; } })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(iter) { var name; for ( name of iter ) { } })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(function(iter) { for ( var name of iter ) { } })({});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for ( var { foo } of bar ) { }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for ( var [ foo ] of bar ) { }",
        languageOptions: { ecmaVersion: 6 },
    },

    // https://github.com/eslint/eslint/issues/3617
    {
        text: "\n/* global foobar, foo, bar */\nfoobar; foo;",
    },
    {
        text: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar; foo;",
    },

    // Rest property sibling without ignoreRestSiblings
    {
        text: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
        languageOptions: { ecmaVersion: 2018 },
    },

    // Unused rest property without ignoreRestSiblings
    {
        text: "const data = { type: 'coords', x: 3, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
        languageOptions: { ecmaVersion: 2018 },
    },

    // Nested array destructuring with rest property
    {
        text: "const data = { vars: ['x','y'], x: 1, y: 2 };\nconst { vars: [x], ...coords } = data;\n console.log(coords)",
        languageOptions: { ecmaVersion: 2018 },
    },

    // Nested object destructuring with rest property
    {
        text: "const data = { defaults: { x: 0 }, x: 1, y: 2 };\nconst { defaults: { x }, ...coords } = data;\n console.log(coords)",
        languageOptions: { ecmaVersion: 2018 },
    },

    // https://github.com/eslint/eslint/issues/3714
    {
        text: "/* global a$fooz,$foo */\na$fooz;",
    },
    {
        text: "/* globals a$fooz, $ */\na$fooz;",
    },
    {
        text: "/*globals $foo*/",
    },
    {
        text: "/* global global*/",
    },
    {
        text: "/*global foo:true*/",
    },

    // non ascii.
    {
        text: "/*global 変数, 数*/\n変数;",
    },

    // surrogate pair.
    {
        text: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
        languageOptions: { ecmaVersion: 6 },
    },

    // https://github.com/eslint/eslint/issues/4047
    {
        text: "export default function(a) {}",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default function(a, b) { console.log(a); }",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default (function(a) {});",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default (function(a, b) { console.log(a); });",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default (a) => {};",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "export default (a, b) => { console.log(a); };",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },

    // caughtErrors
    {
        text: "try{}catch(err){};",
    },
    {
        text: "try{}catch(err){};",
        options: [{ caughtErrors: "all" }],
    },
    // catch variables with _ prefix are still reported (no caughtErrorsIgnorePattern)
    {
        text: "try{}catch(_err){};",
    },

    // caughtErrors with other configs
    {
        text: "try{}catch(err){};",
    },

    // Ignore reads for modifications to itself: https://github.com/eslint/eslint/issues/6348
    { text: "var a = 0; a = a + 1;" },
    { text: "var a = 0; a = a + a;" },
    { text: "var a = 0; a += a + 1;" },
    { text: "var a = 0; a++;" },
    {
        text: "function foo(a) { a = a + 1 } foo();",
    },
    {
        text: "function foo(a) { a += a + 1 } foo();",
    },
    {
        text: "function foo(a) { a++ } foo();",
    },
    { text: "var a = 3; a = a * 5 + 6;" },
    {
        text: "var a = 2, b = 4; a = a * 2 + b;",
    },

    // https://github.com/eslint/eslint/issues/6576 (For coverage)
    {
        text: "function foo(cb) { cb = function(a) { cb(1 + a); }; bar(not_cb); } foo();",
    },
    {
        text: "function foo(cb) { cb = function(a) { return cb(1 + a); }(); } foo();",
    },
    {
        text: "function foo(cb) { cb = (function(a) { cb(1 + a); }, cb); } foo();",
    },
    {
        text: "function foo(cb) { cb = (0, function(a) { cb(1 + a); }); } foo();",
    },

    // https://github.com/eslint/eslint/issues/6646
    {
        text: [
            "while (a) {",
            "    function foo(b) {",
            "        b = b + 1;",
            "    }",
            "    foo()",
            "}",
        ].join("\n"),
    },

    {
        text: "/*global\rfoo*/",
    },

    // https://github.com/eslint/eslint/issues/8442
    {
        text: "(function ({ a }, b ) { return b; })();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "(function ({ b, c } ) { return b; })();",
        languageOptions: { ecmaVersion: 2015 },
    },

    // https://github.com/eslint/eslint/issues/14325
    {
        text: "let x = 0;\nx++, x = 0;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0;\nx++, x = 0;\nx=3;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; x++, 0;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; 0, x++;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; 0, (1, x++);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; foo = (x++, 0);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; foo = ((0, x++), 0);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; x += 1, 0;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; 0, x += 1;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; 0, (1, x += 1);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; foo = (x += 1, 0);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let x = 0; foo = ((0, x += 1), 0);",
        languageOptions: { ecmaVersion: 2015 },
    },

    // https://github.com/eslint/eslint/issues/14866
    {
        text: "let z = 0;\nz = z + 1, z = 2;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let z = 0;\nz = z+1, z = 2;\nz = 3;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let z = 0;\nz = z+1, z = 2;\nz = z+3;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let x = 0; 0, x = x+1;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let x = 0; x = x+1, 0;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let x = 0; foo = ((0, x = x + 1), 0);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let x = 0; foo = (x = x+1, 0);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let x = 0; 0, (1, x=x+1);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(function ({ a, b } ) { return b; })();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "(function ([ a ], b ) { return b; })();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "(function ([ a ], [ b ] ) { return b; })();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "(function ([ b ], [ c ] ) { return b; })();",
        languageOptions: { ecmaVersion: 2015 },
    },

    // https://github.com/eslint/eslint/issues/9774
    {
        text: "(function(a) {})();",
    },
    {
        text: "(function(a) {})();",
    },

    // https://github.com/eslint/eslint/issues/10982
    {
        text: "var a = function() { a(); };",
    },
    {
        text: "var a = function(){ return function() { a(); } };",
    },
    {
        text: "const a = () => () => { a(); };",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let myArray = [1,2,3,4].filter((x) => x == 0);\nmyArray = myArray.filter((x) => x == 1);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "const a = 1; a += 1;",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "const a = () => { a(); };",
        languageOptions: { ecmaVersion: 2015 },
    },

    // https://github.com/eslint/eslint/issues/14324
    {
        text: "let x = [];\nx = x.concat(x);",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let a = 'a';\na = 10;\nfunction foo(){a = 11;a = () => {a = 13}}; foo();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let foo;\ninit();\nfoo = foo + 2;\nfunction init() {foo = 1;}",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "function foo(n) {\nif (n < 2) return 1;\nreturn n * foo(n - 1);}",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "let c = 'c';\nc = 10;\nfunction foo1() {c = 11; c = () => { c = 13 }} c = foo1",
        languageOptions: { ecmaVersion: 2020 },
    },

    // ignore class with static initialization block https://github.com/eslint/eslint/issues/17772
    {
        text: "class Foo { static {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const [a, b, c] = foo; alert(a + c);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [a = aDefault] = foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [[a = aDefault]]= foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [[a = aDefault], b]= foo; console.log(b);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [a = aDefault, b] = foo; alert(b);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a([a = aDefault]) { } a();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a([[a = aDefault]]) { } a();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a([a = aDefault, b]) { alert(b); } a();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a([[a = aDefault, b]]) { alert(b); } a();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a: a1 } = foo",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a: a1, b: b1 } = foo; alert(b1);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a: a1, b: b1 } = foo; alert(a1);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function a({ a: a1 }) {} a();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a: a1 = aDefault } = foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [{ a: a1 = aDefault }] = foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a = aDefault } = foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a = aDefault, b } = foo; alert(b);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a, b = bDefault } = foo; alert(a);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { a, b = bDefault, c } = foo; alert(a + c);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const { [key]: a } = foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const [...{ a, b }] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo (...rest) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo (a, ...rest) { alert(a); } foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const {...rest} = foo;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const {a, ...rest} = foo; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const {...rest} = foo, a = bar; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const a = bar, {...rest} = foo; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo ({...rest}) { } foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo (a, {...rest}) { alert(a); } foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo ({...rest}, a) { alert(a); } foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [...rest] = foo;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[...rest]] = foo;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, ...rest] = foo; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo ([...rest]) { } foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, ...{ b }] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[a, ...{ b }]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [...[a]] = array;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[...[a]]] = array;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [...[a, b]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, ...[b]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[a, ...[b]]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, ...[b]] = array; alert(b);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, ...[[ b ]]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, ...[{ b }]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo([_a, ...[[ b ]]]) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo([_a, ...[{ b }]]) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo(...[[ a ]]) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo(...[{ a }]) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo(a, ...[b]) { alert(a); } foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, [b]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[a, [b]]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [a, [[b]]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function a([[b]]) {} a();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function a([[b], c]) { alert(c); } a();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [{b}, a] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[{b}, a]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [[[{b}], a]] = array; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function a([{b}]) {} a();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function a([{b}, c]) { alert(c); } a();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { a: { b }, c } = foo; alert(c);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { c, a: { b } } = foo; alert(c);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { a: { b: { c }, d } } = foo; alert(d);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { a: { b: { c: { e } }, d } } = foo; alert(d);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [{ a: { b }, c }] = foo; alert(c);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { a: [{ b }]} = foo;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { a: [[ b ]]} = foo;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const [{ a: [{ b }]}] = foo;",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "const { a: [{ b }], c} = foo; alert(c);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo({ a: [{ b }]}) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "function foo({ a: [[ b ]]}) {} foo();",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "let a = foo, b = 'bar'; alert(b);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "let a = foo, b = 'bar'; alert(a);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "let { a } = foo, bar = 'hello'; alert(bar);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "let bar = 'hello', { a } = foo; alert(bar);",
        languageOptions: { ecmaVersion: 2023 },
    },
    {
        text: "import a from 'module';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import * as foo from 'module';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import a, * as foo from 'module'; a();",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import a, * as foo from 'module'; foo.hello;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { a } from 'module';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { a, b } from 'module'; alert(b);",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { a, b } from 'module'; alert(a);",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { a as foo } from 'module';",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { a as foo, b } from 'module'; alert(b);",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { a, b as foo } from 'module'; alert(a);",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import { default as foo, a } from 'module'; alert(a);",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import foo, { a } from 'module'; alert(a);",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "import foo, { a } from 'module'; foo();",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "let a; a = foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "array.forEach(a => {})",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "if (foo()) var bar;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (;;) var foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (a in b) var foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (a of b) var foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "while (a) var foo;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "do var foo; while (b);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "with (a) var foo;",
        languageOptions: { ecmaVersion: 6, sourceType: "script" },
    },
    {
        text: "var a;'use strict';b(00);",
        languageOptions: { sourceType: "script" },
    },
    {
        text: "var [a] = foo;'use strict';b(00);",
        languageOptions: { ecmaVersion: 6, sourceType: "script" },
    },
    {
        text: "var [...a] = foo;'use strict';b(00);",
        languageOptions: { ecmaVersion: 6, sourceType: "script" },
    },
    {
        text: "var {a} = foo;'use strict';b(00);",
        languageOptions: { ecmaVersion: 6, sourceType: "script" },
    },
    {
        text: "console.log('foo')\nvar a\n+b > 0 ? bar() : baz()",
    },
    {
        text: "console.log('foo')\nvar [a] = foo;\n+b > 0 ? bar() : baz()",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "console.log('foo')\nvar {a} = foo;\n+b > 0 ? bar() : baz()",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let x;\n() => x = 1;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let [a = 1] = arr;\na = 2;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 1, b){alert(b);} foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 1) {a = 2;} foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = 1, _b) {a = 2;} foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "using resource = getResource();",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
    {
        text: "await using resource = getResource();",
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2026,
        },
    },
];

describe('no-unused-vars', ({ describe }) => {

    const globalRules = { 'no-unused-vars': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach((item, i) => {
                let text;
                let options;
                let languageOptions;

                if (typeof item === 'string') {
                    text = item;
                    options = {};
                    languageOptions = {};
                } else {
                    text = item.text;
                    options = item.options;
                    languageOptions = item.languageOptions || {};
                }

                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['no-unused-vars'] = rules['no-unused-vars'].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    // eslint-disable-next-line no-console
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });

    describe('invalid code', ({ it }) => {
        it('has expected outcomes', () => {
            invalid.forEach((item, i) => {
                let text;
                let options;
                let languageOptions;

                if (typeof item === 'string') {
                    text = item;
                    options = {};
                    languageOptions = {};
                } else {
                    text = item.text;
                    options = item.options;
                    languageOptions = item.languageOptions || {};
                }

                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['no-unused-vars'] = rules['no-unused-vars'].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('no-unused-vars', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
