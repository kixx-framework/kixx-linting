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
    // non derived classes.
    `class A { }`,
    `class A { constructor() { } }`,

    /*
     * inherit from non constructors.
     * those are valid if we don't define the constructor.
     */
    `class A extends null { }`,

    // derived classes.
    `class A extends B { }`,
    `class A extends B { constructor() { super(); } }`,
    `class A extends B { constructor() { if (true) { super(); } else { super(); } } }`,
    `class A extends (class B {}) { constructor() { super(); } }`,
    `class A extends (B = C) { constructor() { super(); } }`,
    `class A extends (B &&= C) { constructor() { super(); } }`,
    `class A extends (B ||= C) { constructor() { super(); } }`,
    `class A extends (B ??= C) { constructor() { super(); } }`,
    `class A extends (B ||= 5) { constructor() { super(); } }`,
    `class A extends (B ??= 5) { constructor() { super(); } }`,
    `class A extends (B || C) { constructor() { super(); } }`,
    `class A extends (5 && B) { constructor() { super(); } }`,

    // A future improvement could detect the left side as statically falsy, making this invalid.
    `class A extends (false && B) { constructor() { super(); } }`,
    `class A extends (B || 5) { constructor() { super(); } }`,
    `class A extends (B ?? 5) { constructor() { super(); } }`,

    `class A extends (a ? B : C) { constructor() { super(); } }`,
    `class A extends (B, C) { constructor() { super(); } }`,

    // nested.
    `class A { constructor() { class B extends C { constructor() { super(); } } } }`,
    `class A extends B { constructor() { super(); class C extends D { constructor() { super(); } } } }`,
    `class A extends B { constructor() { super(); class C { constructor() { } } } }`,

    // multi code path.
    `class A extends B { constructor() { a ? super() : super(); } }`,
    `class A extends B { constructor() { if (a) super(); else super(); } }`,
    `class A extends B { constructor() { switch (a) { case 0: super(); break; default: super(); } } }`,
    `class A extends B { constructor() { try {} finally { super(); } } }`,
    `class A extends B { constructor() { if (a) throw Error(); super(); } }`,

    // returning value is a substitute of 'super()'.
    `class A extends B { constructor() { if (true) return a; super(); } }`,
    // `class A extends null { constructor() { return a; } }`,
    `class A { constructor() { return a; } }`,

    // https://github.com/eslint/eslint/issues/5261
    `class A extends B { constructor(a) { super(); for (const b of a) { this.a(); } } }`,
    `class A extends B { constructor(a) { super(); for (b in a) ( foo(b) ); } }`,

    // https://github.com/eslint/eslint/issues/5319
    `class Foo extends Object { constructor(method) { super(); this.method = method || function() {}; } }`,

    // https://github.com/eslint/eslint/issues/5394
    `class A extends Object {
        constructor() {
            super();
            for (let i = 0; i < 0; i++);
        }
    }`,
    `class A extends Object {
        constructor() {
            super();
            for (; i < 0; i++);
            for (let i = 0;; i++) {
                if (foo) break;
            }
        }
    }`,
    `class A extends Object {
        constructor() {
            super();
            for (let i = 0; i < 0;);
            for (let i = 0;; i++) {
                if (foo) break;
            }
        }
    }`,

    // https://github.com/eslint/eslint/issues/8848
    `
        class A extends B {
            constructor(props) {
                super(props);

                try {
                    let arr = [];
                    for (let a of arr) {
                    }
                } catch (err) {
                }
            }
        }
    `,

    // Optional chaining
    `class A extends obj?.prop { constructor() { super(); } }`,

    `
        class A extends Base {
            constructor(list) {
                for (const a of list) {
                    if (a.foo) {
                        super(a);
                        return;
                    }
                }
                super();
            }
        }
    `,
];

const invalid = [
    // inherit from non constructors.
    // `class A extends null { constructor() { super(); } }`,
    `class A extends null { constructor() { } }`,
    // `class A extends 100 { constructor() { super(); } }`,
    // `class A extends 'test' { constructor() { super(); } }`,
    // `class A extends (B = 5) { constructor() { super(); } }`,
    // `class A extends (B && 5) { constructor() { super(); } }`,
    // `class A extends (B &&= 5) { constructor() { super(); } }`,
    // `class A extends (B += C) { constructor() { super(); } }`,
    // `class A extends (B -= C) { constructor() { super(); } }`,
    // `class A extends (B **= C) { constructor() { super(); } }`,
    // `class A extends (B |= C) { constructor() { super(); } }`,
    // `class A extends (B &= C) { constructor() { super(); } }`,

    // derived classes.
    `class A extends B { constructor() { } }`,
    `class A extends B { constructor() { for (var a of b) super.foo(); } }`,
    `class A extends B { constructor() { for (var i = 1; i < 10; i++) super.foo(); } }`,

    // nested execution scope.
    `class A extends B { constructor() { var c = class extends D { constructor() { super(); } } } }`,
    `class A extends B { constructor() { var c = () => super(); } }`,
    `class A extends B { constructor() { class C extends D { constructor() { super(); } } } }`,
    `class A extends B { constructor() { var C = class extends D { constructor() { super(); } } } }`,
    `class A extends B { constructor() { super(); class C extends D { constructor() { } } } }`,
    `class A extends B { constructor() { super(); var C = class extends D { constructor() { } } } }`,

    // lacked in some code path.
    `class A extends B { constructor() { if (a) super(); } }`,
    `class A extends B { constructor() { if (a); else super(); } }`,
    `class A extends B { constructor() { a && super(); } }`,
    `class A extends B { constructor() { switch (a) { case 0: super(); } } }`,
    `class A extends B { constructor() { switch (a) { case 0: break; default: super(); } } }`,
    `class A extends B { constructor() { try { super(); } catch (err) {} } }`,
    `class A extends B { constructor() { try { a; } catch (err) { super(); } } }`,
    `class A extends B { constructor() { if (a) return; super(); } }`,
    `class A extends B { constructor() { super(); super(); } }`,
    `class A extends B { constructor() { super() || super(); } }`,
    `class A extends B { constructor() { if (a) super(); super(); } }`,
    `class A extends B { constructor() { switch (a) { case 0: super(); default: super(); } } }`,
    `class A extends B { constructor(a) { while (a) super(); } }`,

    // ignores `super()` on unreachable paths.
    `class A extends B { constructor() { return; super(); } }`,

    // https://github.com/eslint/eslint/issues/8248
    `class Foo extends Bar {
        constructor() {
            for (a in b) for (c in d);
        }
    }`,

    `class C extends D {
        constructor() {
            do {
                something();
            } while (foo);
        }
    }`,
    `class C extends D {
        constructor() {
            for (let i = 1;;i++) {
                if (bar) {
                    break;
                }
            }
        }
    }`,
    `class C extends D {

        constructor() {
            do {
                super();
            } while (foo);
        }
    }`,
    `class C extends D {
        constructor() {
            while (foo) {
                if (bar) {
                    super();
                    break;
                }
            }
        }
    }`,
];

describe('constructor-super', ({ describe }) => {

    const rules = { 'constructor-super': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach((text, i) => {
                const file = { text };
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
            invalid.forEach((text, i) => {
                const file = { text };
                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('constructor-super', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`)
            });
        });
    });
});
