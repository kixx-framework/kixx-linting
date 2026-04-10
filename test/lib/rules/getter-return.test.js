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
} from '../../deps.js';

import { lintText } from '../../../mod.js';


const valid = [
    /*
     * test obj: get
     * option: {allowImplicit: false}
     */
    { text: "var foo = { get bar(){return true;} };" },

    // option: {allowImplicit: true}
    { text: "var foo = { get bar() {return;} };", options: [{ allowImplicit: true }] },
    { text: "var foo = { get bar(){return true;} };", options: [{ allowImplicit: true }] },
    {
        text: "var foo = { get bar(){if(bar) {return;} return true;} };",
        options: [{ allowImplicit: true }],
    },

    /*
     * test class: get
     * option: {allowImplicit: false}
     */
    { text: "class foo { get bar(){return true;} }" },
    { text: "class foo { get bar(){if(baz){return true;} else {return false;} } }" },
    { text: "class foo { get(){return true;} }" },

    // option: {allowImplicit: true}
    { text: "class foo { get bar(){return true;} }", options: [{ allowImplicit: true }] },
    { text: "class foo { get bar(){return;} }", options: [{ allowImplicit: true }] },

    /*
     * test object.defineProperty(s)
     * option: {allowImplicit: false}
     */
    { text: 'Object.defineProperty(foo, "bar", { get: function () {return true;}});' },
    { text: 'Object.defineProperty(foo, "bar", { get: function () { ~function (){ return true; }();return true;}});' },
    { text: "Object.defineProperties(foo, { bar: { get: function () {return true;}} });" },
    { text: "Object.defineProperties(foo, { bar: { get: function () { ~function (){ return true; }(); return true;}} });" },

    /*
     * test reflect.defineProperty(s)
     * option: {allowImplicit: false}
     */
    { text: 'Reflect.defineProperty(foo, "bar", { get: function () {return true;}});' },
    { text: 'Reflect.defineProperty(foo, "bar", { get: function () { ~function (){ return true; }();return true;}});' },

    /*
     * test object.create(s)
     * option: {allowImplicit: false}
     */
    { text: "Object.create(foo, { bar: { get() {return true;} } });" },
    { text: "Object.create(foo, { bar: { get: function () {return true;} } });" },
    { text: "Object.create(foo, { bar: { get: () => {return true;} } });" },

    // option: {allowImplicit: true}
    {
        text: 'Object.defineProperty(foo, "bar", { get: function () {return true;}});',
        options: [{ allowImplicit: true }],
    },
    {
        text: 'Object.defineProperty(foo, "bar", { get: function (){return;}});',
        options: [{ allowImplicit: true }],
    },
    {
        text: "Object.defineProperties(foo, { bar: { get: function () {return true;}} });",
        options: [{ allowImplicit: true }],
    },
    {
        text: "Object.defineProperties(foo, { bar: { get: function () {return;}} });",
        options: [{ allowImplicit: true }],
    },
    {
        text: 'Reflect.defineProperty(foo, "bar", { get: function () {return true;}});',
        options: [{ allowImplicit: true }],
    },

    // not getter.
    { text: "var get = function(){};" },
    { text: "var get = function(){ return true; };" },
    { text: "var foo = { bar(){} };" },
    { text: "var foo = { bar(){ return true; } };" },
    { text: "var foo = { bar: function(){} };" },
    { text: "var foo = { bar: function(){return;} };" },
    { text: "var foo = { bar: function(){return true;} };" },
    { text: "var foo = { get: function () {} }" },
    { text: "var foo = { get: () => {}}"},
    { text: "class C { get; foo() {} }" },
    { text: "foo.defineProperty(null, { get() {} });" },
    { text: "foo.defineProperties(null, { bar: { get() {} } });" },
    { text: "foo.create(null, { bar: { get() {} } });" },
];

const invalid = [
    /*
     * test obj: get
     * option: {allowImplicit: false}
     */
    {
        text: "var foo = { get bar() {} };",
    },
    {
        text: "var foo = { get\n bar () {} };",
    },
    {
        text: "var foo = { get bar(){if(baz) {return true;}} };",
    },
    {
        text: "var foo = { get bar() { ~function () {return true;}} };",
    },
    {
        text: "var foo = { get bar() { return; } };",
    },

    // option: {allowImplicit: true}
    {
        text: "var foo = { get bar() {} };",
        options: [{ allowImplicit: true }],
    },
    {
        text: "var foo = { get bar() {if (baz) {return;}} };",
        options: [{ allowImplicit: true }],
    },

    /*
     * test class: get
     * option: {allowImplicit: false}
     */
    {
        text: "class foo { get bar(){} }",
    },
    {
        text: "var foo = class {\n  static get\nbar(){} }",
    },
    {
        text: "class foo { get bar(){ if (baz) { return true; }}}",
    },
    {
        text: "class foo { get bar(){ ~function () { return true; }()}}",
    },

    // option: {allowImplicit: true}
    { text: "class foo { get bar(){} }", options: [{ allowImplicit: true }]},
    {
        text: "class foo { get bar(){if (baz) {return true;} } }",
        options: [{ allowImplicit: true }],
    },

    /*
     * test object.defineProperty(s)
     * option: {allowImplicit: false}
     */
    {
        text: "Object.defineProperty(foo, 'bar', { get: function (){}});",
    },
    {
        text: "Object.defineProperty(foo, 'bar', { get: function getfoo (){}});",
    },
    {
        text: "Object.defineProperty(foo, 'bar', { get(){} });",
    },
    {
        text: "Object.defineProperty(foo, 'bar', { get: () => {}});",
    },
    {
        text: 'Object.defineProperty(foo, "bar", { get: function (){if(bar) {return true;}}});',
    },
    {
        text: 'Object.defineProperty(foo, "bar", { get: function (){ ~function () { return true; }()}});',
    },

    /*
     * test reflect.defineProperty(s)
     * option: {allowImplicit: false}
     */
    {
        text: "Reflect.defineProperty(foo, 'bar', { get: function (){}});",
    },

    /*
     * test object.create(s)
     * option: {allowImplicit: false}
     */
    {
        text: "Object.create(foo, { bar: { get: function() {} } })",
    },
    {
        text: "Object.create(foo, { bar: { get() {} } })",
    },
    {
        text: "Object.create(foo, { bar: { get: () => {} } })",
    },

    // option: {allowImplicit: true}
    {
        text: "Object.defineProperties(foo, { bar: { get: function () {}} });",
        options: [{ allowImplicit: true }],
    },
    {
        text: "Object.defineProperties(foo, { bar: { get: function (){if(bar) {return true;}}}});",
        options: [{ allowImplicit: true }],
    },
    {
        text: "Object.defineProperties(foo, { bar: { get: function () {~function () { return true; }()}} });",
        options: [{ allowImplicit: true }],
    },
    {
        text: 'Object.defineProperty(foo, "bar", { get: function (){}});',
        options: [{ allowImplicit: true }],
    },
    {
        text: "Object.create(foo, { bar: { get: function (){} } });",
        options: [{ allowImplicit: true }],
    },
    {
        text: 'Reflect.defineProperty(foo, "bar", { get: function (){}});',
        options: [{ allowImplicit: true }],
    },

    // Optional chaining
    {
        text: "Object?.defineProperty(foo, 'bar', { get: function (){} });",
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(Object?.defineProperty)(foo, 'bar', { get: function (){} });",
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "Object?.defineProperty(foo, 'bar', { get: function (){} });",
        options: [{ allowImplicit: true }],
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(Object?.defineProperty)(foo, 'bar', { get: function (){} });",
        options: [{ allowImplicit: true }],
        // languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "(Object?.create)(foo, { bar: { get: function (){} } });",
        options: [{ allowImplicit: true }],
        // languageOptions: { ecmaVersion: 2020 },
    },
];


describe('getter-return', ({ describe }) => {

    const globalRules = { 'getter-return': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['getter-return'] = rules['getter-return'].concat(options);
                }

                const res = lintText(file, rules);

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
            invalid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['getter-return'] = rules['getter-return'].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('getter-return', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
