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
    { text: "unresolved" },
    { text: "Array" },
    { text: "function foo () { arguments; }" },
    { text: "var a=10; alert(a);" },
    { text: "function b(a) { alert(a); }" },
    { text: "Object.hasOwnProperty.call(a);" },
    { text: "function a() { alert(arguments);}" },
    {
        text: "a(); function a() { alert(arguments); }",
        options: ["nofunc"],
    },
    {
        text: "(() => { var a = 42; alert(a); })();",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "a(); try { throw new Error() } catch (a) {}" },
    { text: "class A {} new A();", languageOptions: { ecmaVersion: 6 } },
    { text: "var a = 0, b = a;" },
    {
        text: "var {a = 0, b = a} = {};",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var [a = 0, b = a] = {};",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "function foo() { foo(); }" },
    { text: "var foo = function() { foo(); };" },
    { text: "var a; for (a in a) {}" },
    { text: "var a; for (a of a) {}", languageOptions: { ecmaVersion: 6 } },
    {
        text: "let a; class C { static { a; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { let a; a; } }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // Block-level bindings
    {
        text: '"use strict"; a(); { function a() {} }',
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: '"use strict"; { a(); function a() {} }',
        options: ["nofunc"],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "switch (foo) { case 1:  { a(); } default: { let a; }}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "a(); { let a = function () {}; }",
        languageOptions: { ecmaVersion: 6 },
    },

    // object style options
    {
        text: "a(); function a() { alert(arguments); }",
        options: [{ functions: false }],
    },
    {
        text: '"use strict"; { a(); function a() {} }',
        options: [{ functions: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { new A(); } class A {};",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },

    // "variables" option
    {
        text: "function foo() { bar; } var bar;",
        options: [{ variables: false }],
    },
    {
        text: "var foo = () => bar; var bar;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { static { () => foo; let foo; } }",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },

    // Tests related to class definition evaluation. These are not TDZ errors.
    {
        text: "class C extends (class { method() { C; } }) {}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class extends (class { method() { C; } }) {});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = (class extends (class { method() { C; } }) {});",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C extends (class { field = C; }) {}",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class extends (class { field = C; }) {});",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = (class extends (class { field = C; }) {});",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { [() => C](){} }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C { [() => C](){} });",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class { [() => C](){} };",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { static [() => C](){} }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C { static [() => C](){} });",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class { static [() => C](){} };",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { [() => C]; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { [() => C]; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { [() => C]; };",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static [() => C]; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static [() => C]; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static [() => C]; };",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { method() { C; } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C { method() { C; } });",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class { method() { C; } };",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { static method() { C; } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C { static method() { C; } });",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class { static method() { C; } };",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { field = C; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { field = C; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { field = C; };",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = C; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static field = C; });",
        languageOptions: { ecmaVersion: 2022 },
    }, // `const C = class { static field = C; };` is TDZ error
    {
        text: "class C { static field = class { static field = C; }; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static field = class { static field = C; }; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { field = () => C; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { field = () => C; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { field = () => C; };",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = () => C; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static field = () => C; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static field = () => C; };",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { field = class extends C {}; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { field = class extends C {}; });",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { field = class extends C {}; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = class extends C {}; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static field = class extends C {}; });",
        languageOptions: { ecmaVersion: 2022 },
    }, // `const C = class { static field = class extends C {}; };` is TDZ error
    {
        text: "class C { static field = class { [C]; }; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static field = class { [C]; }; });",
        languageOptions: { ecmaVersion: 2022 },
    }, // `const C = class { static field = class { [C]; } };` is TDZ error
    {
        text: "const C = class { static field = class { field = C; }; };",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { method() { a; } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { static method() { a; } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { field = a; } let a;", // `class C { static field = a; } let a;` is TDZ error
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { field = D; } class D {}", // `class C { static field = D; } class D {}` is TDZ error
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { field = class extends D {}; } class D {}", // `class C { static field = class extends D {}; } class D {}` is TDZ error
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { field = () => a; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = () => a; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { field = () => D; } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = () => D; } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = class { field = a; }; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { C; } }", // `const C = class { static { C; } }` is TDZ error
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { C; } static {} static { C; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static { C; } })",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { class D extends C {} } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { (class { static { C } }) } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { () => C; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static { () => C; } })",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static { () => C; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { () => D; } } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { () => a; } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class C { static { C.x; } }",
        languageOptions: { ecmaVersion: 2022 },
    },

    // "allowNamedExports" option
    {
        text: "export { a }; const a = 1;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a as b }; const a = 1;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a, b }; let a, b;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a }; var a;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { f }; function f() {}",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { C }; class C {}",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
];

const invalid = [
    {
        text: "a++; var a=19;",
        languageOptions: { ecmaVersion: 6, sourceType: "module" },
    },
    {
        text: "a++; var a=19;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "a++; var a=19;",
    },
    {
        text: "a(); var a=function() {};",
    },
    {
        text: "alert(a[1]); var a=[1,3];",
    },
    {
        text: "a(); function a() { alert(b); var b=10; a(); }",
    },
    {
        text: "a(); var a=function() {};",
        options: ["nofunc"],
    },
    {
        text: "(() => { alert(a); var a = 42; })();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(() => a())(); function a() { }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: '"use strict"; a(); { function a() {} }',
    },
    {
        text: "a(); try { throw new Error() } catch (foo) {var a;}",
    },
    {
        text: "var f = () => a; var a;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "new A(); class A {};",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { new A(); } class A {};",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "new A(); var A = class {};",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { new A(); } var A = class {};",
        languageOptions: { ecmaVersion: 6 },
    },

    // Block-level bindings
    {
        text: "a++; { var a; }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: '"use strict"; { a(); function a() {} }',
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "{a; let a = 1}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "switch (foo) { case 1: a();\n default: \n let a;}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "if (true) { function foo() { a; } let a;}",
        languageOptions: { ecmaVersion: 6 },
    },

    // object style options
    {
        text: "a(); var a=function() {};",
        options: [{ functions: false, classes: false }],
    },
    {
        text: "new A(); class A {};",
        options: [{ functions: false, classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "new A(); var A = class {};",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo() { new A(); } var A = class {};",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },

    // invalid initializers
    {
        text: "var a = a;",
    },
    {
        text: "let a = a + b;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const a = foo(a);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function foo(a = a) {}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var {a = a} = [];",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var [a = a] = [];",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var {b = a, a} = {};",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var [b = a, a] = {};",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var {a = 0} = a;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var [a = 0] = a;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var a in a) {}",
    },
    {
        text: "for (var a of a) {}",
        languageOptions: { ecmaVersion: 6 },
    },

    // "variables" option
    {
        text: "function foo() { bar; var bar = 1; } var bar;",
        options: [{ variables: false }],
    },
    {
        text: "foo; var foo;",
        options: [{ variables: false }],
    },

    // https://github.com/eslint/eslint/issues/10227
    {
        text: "for (let x = x;;); let x = 0",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "for (let x in xs); let xs = []",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "for (let x of xs); let xs = []",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "try {} catch ({message = x}) {} let x = ''",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "with (obj) x; let x = {}",
        languageOptions: { ecmaVersion: 2015 },
    },

    // WithStatements.
    {
        text: "with (x); let x = {}",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "with (obj) { x } let x = {}",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "with (obj) { if (a) { x } } let x = {}",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "with (obj) { (() => { if (a) { x } })() } let x = {}",
        languageOptions: { ecmaVersion: 2015 },
    },

    // Tests related to class definition evaluation. These are TDZ errors.
    {
        text: "class C extends C {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class extends C {};",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C extends (class { [C](){} }) {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class extends (class { [C](){} }) {};",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C extends (class { static field = C; }) {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class extends (class { static field = C; }) {};",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { [C](){} }",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C { [C](){} });",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class { [C](){} };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { static [C](){} }",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C { static [C](){} });",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "const C = class { static [C](){} };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { [C]; }",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { [C]; });",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { [C]; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { [C] = foo; }",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { [C] = foo; });",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { [C] = foo; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static [C]; }",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static [C]; });",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static [C]; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static [C] = foo; }",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C { static [C] = foo; });",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static [C] = foo; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static field = C; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static field = class extends C {}; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static field = class { [C]; } };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static field = class { static field = C; }; };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends D {} class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C extends (class { [a](){} }) {} let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C extends (class { static field = a; }) {} let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { [a]() {} } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { static [a]() {} } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "class C { [a]; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static [a]; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { [a] = foo; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static [a] = foo; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = a; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = D; } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = class extends D {}; } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = class { [a](){} } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static field = class { static field = a; }; } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static { C; } };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "const C = class { static { (class extends C {}); } };",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { a; } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { D; } } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { (class extends D {}); } } class D {}",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { (class { [a](){} }); } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { (class { static field = a; }); } } let a;",
        options: [{ variables: false }],
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "(class C extends C {});",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C extends (class { [C](){} }) {});",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "(class C extends (class { static field = C; }) {});",
        options: [{ classes: false }],
        languageOptions: { ecmaVersion: 2022 },
    },

    // "allowNamedExports" option
    {
        text: "export { a }; const a = 1;",
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a }; const a = 1;",
        options: [{}],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a }; const a = 1;",
        options: [{ allowNamedExports: false }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a }; const a = 1;",
        options: ["nofunc"],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a as b }; const a = 1;",
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a, b }; let a, b;",
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { a }; var a;",
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { f }; function f() {}",
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export { C }; class C {}",
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export const foo = a; const a = 1;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export default a; const a = 1;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export function foo() { return a; }; const a = 1;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
    {
        text: "export class C { foo() { return a; } }; const a = 1;",
        options: [{ allowNamedExports: true }],
        languageOptions: { ecmaVersion: 2015, sourceType: "module" },
    },
];

describe("no-use-before-define", ({ describe }) => {

    const globalRules = { "no-use-before-define": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };
                const effectiveLanguageOptions = {
                    sourceType: "script",
                    ...languageOptions,
                };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-use-before-define"] = rules["no-use-before-define"].concat(options);
                }

                const res = lintText(file, rules, effectiveLanguageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
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
                const effectiveLanguageOptions = {
                    sourceType: "script",
                    ...languageOptions,
                };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-use-before-define"] = rules["no-use-before-define"].concat(options);
                }

                const res = lintText(file, rules, effectiveLanguageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-use-before-define", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
