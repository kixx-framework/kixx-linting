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
    //------------------------------------------------------------------------------
    // General
    //------------------------------------------------------------------------------

    // not a setter
    { text: "function foo() { return 1; }" },
    { text: "function set(val) { return 1; }" },
    { text: "var foo = function() { return 1; };" },
    { text: "var foo = function set() { return 1; };" },
    { text: "var set = function() { return 1; };" },
    { text: "var set = function set(val) { return 1; };" },
    { text: "var set = val => { return 1; };" },
    { text: "var set = val => 1;" },

    // setters do not have effect on other functions (test function info tracking)
    { text: "({ set a(val) { }}); function foo() { return 1; }" },
    { text: "({ set a(val) { }}); (function () { return 1; });" },
    { text: "({ set a(val) { }}); (() => { return 1; });" },
    { text: "({ set a(val) { }}); (() => 1);" },

    // does not report global return
    {
        text: "return 1;",
        languageOptions: { sourceType: "commonjs" },
    },
    {
        text: "return 1;",
        languageOptions: {
            sourceType: "script",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
        },
    },
    {
        text: "return 1; function foo(){ return 1; } return 1;",
        languageOptions: { sourceType: "commonjs" },
    },
    {
        text: "function foo(){} return 1; var bar = function*(){ return 1; }; return 1; var baz = () => {}; return 1;",
        languageOptions: { sourceType: "commonjs" },
    },

    //------------------------------------------------------------------------------
    // Object literals and classes
    //------------------------------------------------------------------------------

    // return without a value is allowed
    { text: "({ set foo(val) { return; } })" },
    { text: "({ set foo(val) { if (val) { return; } } })" },
    { text: "class A { set foo(val) { return; } }" },
    { text: "(class { set foo(val) { if (val) { return; } else { return; } return; } })" },
    { text: "class A { set foo(val) { try {} catch(e) { return; } } }" },

    // not a setter
    { text: "({ get foo() { return 1; } })" },
    { text: "({ get set() { return 1; } })" },
    { text: "({ set(val) { return 1; } })" },
    { text: "({ set: function(val) { return 1; } })" },
    { text: "({ foo: function set(val) { return 1; } })" },
    { text: "({ set: function set(val) { return 1; } })" },
    { text: "({ set: (val) => { return 1; } })" },
    { text: "({ set: (val) => 1 })" },
    { text: "set = { foo(val) { return 1; } };" },
    { text: "class A { constructor(val) { return 1; } }" },
    { text: "class set { constructor(val) { return 1; } }" },
    { text: "class set { foo(val) { return 1; } }" },
    { text: "var set = class { foo(val) { return 1; } }" },
    { text: "(class set { foo(val) { return 1; } })" },
    { text: "class A { get foo() { return val; } }" },
    { text: "class A { get set() { return val; } }" },
    { text: "class A { set(val) { return 1; } }" },
    { text: "class A { static set(val) { return 1; } }" },
    { text: "({ set: set = function set(val) { return 1; } } = {})" },
    { text: "({ set: set = (val) => 1 } = {})" },
    { text: "class C { set; foo() { return 1; } }" },

    // not returning from the setter
    { text: "({ set foo(val) { function foo(val) { return 1; } } })" },
    { text: "({ set foo(val) { var foo = function(val) { return 1; } } })" },
    { text: "({ set foo(val) { var foo = (val) => { return 1; } } })" },
    { text: "({ set foo(val) { var foo = (val) => 1; } })" },
    { text: "({ set [function() { return 1; }](val) {} })" },
    { text: "({ set [() => { return 1; }](val) {} })" },
    { text: "({ set [() => 1](val) {} })" },
    { text: "({ set foo(val = function() { return 1; }) {} })" },
    { text: "({ set foo(val = v => 1) {} })" },
    { text: "(class { set foo(val) { function foo(val) { return 1; } } })" },
    { text: "(class { set foo(val) { var foo = function(val) { return 1; } } })" },
    { text: "(class { set foo(val) { var foo = (val) => { return 1; } } })" },
    { text: "(class { set foo(val) { var foo = (val) => 1; } })" },
    { text: "(class { set [function() { return 1; }](val) {} })" },
    { text: "(class { set [() => { return 1; }](val) {} })" },
    { text: "(class { set [() => 1](val) {} })" },
    { text: "(class { set foo(val = function() { return 1; }) {} })" },
    { text: "(class { set foo(val = (v) => 1) {} })" },

    //------------------------------------------------------------------------------
    // Property descriptors
    //------------------------------------------------------------------------------

    // return without a value is allowed
    { text: "Object.defineProperty(foo, 'bar', { set(val) { return; } })" },
    {
        text: "Reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return; } } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.defineProperties(foo, { bar: { set(val) { try { return; } catch(e){} } } })" },
    { text: "Object.create(foo, { bar: { set: function(val) { return; } } })" },

    // not a setter
    { text: "x = { set(val) { return 1; } }" },
    { text: "x = { foo: { set(val) { return 1; } } }" },
    { text: "Object.defineProperty(foo, 'bar', { value(val) { return 1; } })" },
    {
        text: "Reflect.defineProperty(foo, 'bar', { value: function set(val) { return 1; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.defineProperties(foo, { bar: { [set](val) { return 1; } } })" },
    { text: "Object.create(foo, { bar: { 'set ': function(val) { return 1; } } })" },
    { text: "Object.defineProperty(foo, 'bar', { [`set `]: (val) => { return 1; } })" },
    {
        text: "Reflect.defineProperty(foo, 'bar', { Set(val) { return 1; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.defineProperties(foo, { bar: { value: (val) => 1 } })" },
    { text: "Object.create(foo, { set: { value: function(val) { return 1; } } })" },
    { text: "Object.defineProperty(foo, 'bar', { baz(val) { return 1; } })" },
    {
        text: "Reflect.defineProperty(foo, 'bar', { get(val) { return 1; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.create(foo, { set: function(val) { return 1; } })" },
    { text: "Object.defineProperty(foo, { set: (val) => 1 })" },

    // not returning from the setter
    { text: "Object.defineProperty(foo, 'bar', { set(val) { function foo() { return 1; } } })" },
    {
        text: "Reflect.defineProperty(foo, 'bar', { set(val) { var foo = function() { return 1; } } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.defineProperties(foo, { bar: { set(val) { () => { return 1 }; } } })" },
    { text: "Object.create(foo, { bar: { set: (val) => { (val) => 1; } } })" },

    // invalid index
    { text: "Object.defineProperty(foo, 'bar', 'baz', { set(val) { return 1; } })" },
    { text: "Object.defineProperty(foo, { set(val) { return 1; } }, 'bar')" },
    { text: "Object.defineProperty({ set(val) { return 1; } }, foo, 'bar')" },
    {
        text: "Reflect.defineProperty(foo, 'bar', 'baz', { set(val) { return 1; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Reflect.defineProperty(foo, { set(val) { return 1; } }, 'bar')",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Reflect.defineProperty({ set(val) { return 1; } }, foo, 'bar')",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.defineProperties(foo, bar, { baz: { set(val) { return 1; } } })" },
    { text: "Object.defineProperties({ bar: { set(val) { return 1; } } }, foo)" },
    { text: "Object.create(foo, bar, { baz: { set(val) { return 1; } } })" },
    { text: "Object.create({ bar: { set(val) { return 1; } } }, foo)" },

    // not targeted method name
    { text: "Object.DefineProperty(foo, 'bar', { set(val) { return 1; } })" },
    {
        text: "Reflect.DefineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Object.DefineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } })" },
    { text: "Object.Create(foo, { bar: { set: function(val) { return 1; } } })" },

    // not targeted object name
    { text: "object.defineProperty(foo, 'bar', { set(val) { return 1; } })" },
    {
        text: "reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Reflect.defineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } })",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "object.create(foo, { bar: { set: function(val) { return 1; } } })" },

    // global object doesn't exist
    {
        text: "Reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } })",
        languageOptions: { globals: { Reflect: "off" } },
    },
    { text: "/* globals Object:off */ Object.defineProperty(foo, 'bar', { set(val) { return 1; } })" },
    {
        text: "Object.defineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } })",
        languageOptions: { globals: { Object: "off" } },
    },

    // global object is shadowed
    { text: "let Object; Object.defineProperty(foo, 'bar', { set(val) { return 1; } })" },
    {
        text: "function f() { Reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } }); var Reflect;}",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "function f(Object) { Object.defineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } }) }" },
    { text: "if (x) { const Object = getObject(); Object.create(foo, { bar: { set: function(val) { return 1; } } }) }" },
    { text: "x = function Object() { Object.defineProperty(foo, 'bar', { set(val) { return 1; } }) }" },
];

const invalid = [
    //------------------------------------------------------------------------------
    // Object literals and classes
    //------------------------------------------------------------------------------

    // full error test
    {
        text: "({ set a(val){ return val + 1; } })",
    },

    // basic tests
    {
        text: "({ set a(val) { return 1; } })",
    },
    {
        text: "class A { set a(val) { return 1; } }",
    },
    {
        text: "class A { static set a(val) { return 1; } }",
    },
    {
        text: "(class { set a(val) { return 1; } })",
    },

    // any value
    {
        text: "({ set a(val) { return val; } })",
    },
    {
        text: "class A { set a(val) { return undefined; } }",
    },
    {
        text: "(class { set a(val) { return null; } })",
    },
    {
        text: "({ set a(val) { return x + y; } })",
    },
    {
        text: "class A { set a(val) { return foo(); } }",
    },
    {
        text: "(class { set a(val) { return this._a; } })",
    },
    {
        text: "({ set a(val) { return this.a; } })",
    },

    // any location
    {
        text: "({ set a(val) { if (foo) { return 1; }; } })",
    },
    {
        text: "class A { set a(val) { try { return 1; } catch(e) {} } }",
    },
    {
        text: "(class { set a(val) { while (foo){ if (bar) break; else return 1; } } })",
    },

    // multiple invalid in same object literal/class
    {
        text: "({ set a(val) { return 1; }, set b(val) { return 1; } })",
    },
    {
        text: "class A { set a(val) { return 1; } set b(val) { return 1; } }",
    },
    {
        text: "(class { set a(val) { return 1; } static set b(val) { return 1; } })",
    },

    // multiple invalid in the same setter
    {
        text: "({ set a(val) { if(val) { return 1; } else { return 2 }; } })",
    },
    {
        text: "class A { set a(val) { switch(val) { case 1: return x; case 2: return y; default: return z } } }",
    },
    {
        text: "(class { static set a(val) { if (val > 0) { this._val = val; return val; } return false; } })",
    },

    // valid and invalid in the same setter
    {
        text: "({ set a(val) { if(val) { return 1; } else { return; }; } })",
    },
    {
        text: "class A { set a(val) { switch(val) { case 1: return x; case 2: return; default: return z } } }",
    },
    {
        text: "(class { static set a(val) { if (val > 0) { this._val = val; return; } return false; } })",
    },

    // inner functions do not have effect
    {
        text: "({ set a(val) { function b(){} return b(); } })",
    },
    {
        text: "class A { set a(val) { return () => {}; } }",
    },
    {
        text: "(class { set a(val) { function b(){ return 1; } return 2; } })",
    },
    {
        text: "({ set a(val) { function b(){ return; } return 1; } })",
    },
    {
        text: "class A { set a(val) { var x = function() { return 1; }; return 2; } }",
    },
    {
        text: "(class { set a(val) { var x = () => { return; }; return 2; } })",
    },

    // other functions and global returns do not have effect (test function info tracking)
    {
        text: "function f(){}; ({ set a(val) { return 1; } });",
    },
    {
        text: "x = function f(){}; class A { set a(val) { return 1; } };",
    },
    {
        text: "x = () => {}; A = class { set a(val) { return 1; } };",
    },
    {
        text: "return; ({ set a(val) { return 1; } }); return 2;",
        languageOptions: { sourceType: "commonjs" },
    },

    //------------------------------------------------------------------------------
    // Property descriptors
    //------------------------------------------------------------------------------

    // basic tests
    {
        text: "Object.defineProperty(foo, 'bar', { set(val) { return 1; } })",
    },
    {
        text: "Reflect.defineProperty(foo, 'bar', { set(val) { return 1; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Object.defineProperties(foo, { baz: { set(val) { return 1; } } })",
    },
    {
        text: "Object.create(null, { baz: { set(val) { return 1; } } })",
    },

    // arrow implicit return// basic tests
    {
        text: "Object.defineProperty(foo, 'bar', { set: val => val })",
    },
    {
        text: "Reflect.defineProperty(foo, 'bar', { set: val => f(val) })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Object.defineProperties(foo, { baz: { set: val => a + b } })",
    },
    {
        text: "Object.create({}, { baz: { set: val => this._val } })",
    },

    // various locations, value types and multiple invalid/valid in same setter.
    {
        text: "Object.defineProperty(foo, 'bar', { set(val) { if (val) { return; } return false; }, get(val) { return 1; } })",
    },
    {
        text: "Reflect.defineProperty(foo, 'bar', { set(val) { try { return f(val) } catch (e) { return e }; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Object.defineProperties(foo, { bar: { get(){ return null; }, set(val) { return null; } } })",
    },
    {
        text: "Object.create(null, { baz: { set(val) { return this._val; return; return undefined; } } })",
    },

    // multiple invalid in the same descriptors object
    {
        text: "Object.defineProperties(foo, { baz: { set(val) { return 1; } }, bar: { set(val) { return 1; } } })",
    },
    {
        text: "Object.create({}, { baz: { set(val) { return 1; } }, bar: { set: (val) => 1 } })",
    },

    // various syntax for properties
    {
        text: "Object['defineProperty'](foo, 'bar', { set: function bar(val) { return 1; } })",
    },
    {
        text: "Reflect.defineProperty(foo, 'bar', { 'set'(val) { return 1; } })",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Object[`defineProperties`](foo, { baz: { ['set'](val) { return 1; } } })",
    },
    {
        text: "Object.create({}, { baz: { [`set`]: (val) => { return 1; } } })",
    },

    // edge cases for global objects
    {
        text: "Object.defineProperty(foo, 'bar', { set: function Object(val) { return 1; } })",
    },
    {
        text: "Object.defineProperty(foo, 'bar', { set: function(Object) { return 1; } })",
    },

    // Optional chaining
    {
        text: "Object?.defineProperty(foo, 'bar', { set(val) { return 1; } })",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(Object?.defineProperty)(foo, 'bar', { set(val) { return 1; } })",
        languageOptions: { ecmaVersion: 2020 },
    },
];

describe("no-setter-return", ({ describe }) => {

    const globalRules = { "no-setter-return": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-setter-return"] = rules["no-setter-return"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, options, languageOptions, errors }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-setter-return"] = rules["no-setter-return"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-setter-return", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
