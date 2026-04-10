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
    // no default clause
    `switch (foo) {}`,
    `switch (foo) { case 1: bar(); break; }`,
    `switch (foo) { case 1: break; }`,
    `switch (foo) { case 1: }`,
    `switch (foo) { case 1: bar(); break; case 2: baz(); break; }`,
    `switch (foo) { case 1: break; case 2: break; }`,
    `switch (foo) { case 1: case 2: break; }`,
    `switch (foo) { case 1: case 2: }`,

    // default is the only clause
    `switch (foo) { default: bar(); break; }`,
    `switch (foo) { default: bar(); }`,
    `switch (foo) { default: break; }`,
    `switch (foo) { default: }`,

    // default is last
    `switch (foo) { case 1: break; default: break; }`,
    `switch (foo) { case 1: break; default: }`,
    `switch (foo) { case 1: default: break; }`,
    `switch (foo) { case 1: default: }`,
    `switch (foo) { case 1: baz(); break; case 2: quux(); break; default: quuux(); break; }`,
    `switch (foo) { case 1: break; case 2: break; default: break; }`,
    `switch (foo) { case 1: break; case 2: break; default: }`,
    `switch (foo) { case 1: case 2: break; default: break; }`,
    `switch (foo) { case 1: break; case 2: default: break; }`,
    `switch (foo) { case 1: break; case 2: default: }`,
    `switch (foo) { case 1: case 2: default: }`,
];

const invalid = [
    // default is first
    `switch (foo) { default: bar(); break; case 1: baz(); break; }`,
    `switch (foo) { default: break; case 1: break; }`,
    `switch (foo) { default: break; case 1: }`,
    `switch (foo) { default: case 1: break; }`,
    `switch (foo) { default: case 1: }`,
    `switch (foo) { default: break; case 1: break; case 2: break; }`,
    `switch (foo) { default: case 1: break; case 2: break; }`,
    `switch (foo) { default: case 1: case 2: break; }`,
    `switch (foo) { default: case 1: case 2: }`,

    // default is in the middle
    `switch (foo) { case 1: break; default: break; case 2: break; }`,
    `switch (foo) { case 1: default: break; case 2: break; }`,
    `switch (foo) { case 1: break; default: case 2: break; }`,
    `switch (foo) { case 1: default: case 2: break; }`,
    `switch (foo) { case 1: default: case 2: }`,
];

describe('default-case-last', ({ describe }) => {

    const rules = { 'default-case-last': [ 'error' ] };

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

                assertEqual('default-case-last', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
