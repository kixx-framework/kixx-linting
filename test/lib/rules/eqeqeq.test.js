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
    { text: "a === b" },
    { text: "a !== b" },
    { text: "a === b", options: ["always"] },
    { text: "typeof a == 'number'", options: ["smart"] },
    { text: "'string' != typeof a", options: ["smart"] },
    { text: "'hello' != 'world'", options: ["smart"] },
    { text: "2 == 3", options: ["smart"] },
    { text: "true == true", options: ["smart"] },
    { text: "null == a", options: ["smart"] },
    { text: "a == null", options: ["smart"] },
    { text: "null == a", options: ["allow-null"] },
    { text: "a == null", options: ["allow-null"] },
    { text: "a == null", options: ["always", { null: "ignore" }] },
    { text: "a != null", options: ["always", { null: "ignore" }] },
    { text: "a !== null", options: ["always", { null: "ignore" }] },
    { text: "a === null", options: ["always", { null: "always" }] },
    { text: "a !== null", options: ["always", { null: "always" }] },
    { text: "null === null", options: ["always", { null: "always" }] },
    { text: "null !== null", options: ["always", { null: "always" }] },
    { text: "a == null", options: ["always", { null: "never" }] },
    { text: "a != null", options: ["always", { null: "never" }] },
    { text: "null == null", options: ["always", { null: "never" }] },
    { text: "null != null", options: ["always", { null: "never" }] },

    // https://github.com/eslint/eslint/issues/8020
    {
        text: "foo === /abc/u",
        options: ["always", { null: "never" }],
        // languageOptions: { ecmaVersion: 2015 },
    },

    // bigint
    {
        text: "foo === 1n",
        options: ["always", { null: "never" }],
        // languageOptions: { ecmaVersion: 2020 },
    },
];

const invalid = [
    {
        text: "a == b",
    },
    {
        text: "a != b",
    },
    {
        text: "typeof a == 'number'",
    },
    {
        text: "typeof a == 'number'",
        options: ["always"],
    },
    {
        text: "'string' != typeof a",
    },
    {
        text: "true == true",
    },
    {
        text: "2 == 3",
    },
    {
        text: "2 == 3",
        options: ["always"],
    },
    {
        text: "'hello' != 'world'",
    },
    {
        text: "'hello' != 'world'",
        options: ["always"],
    },
    {
        text: "a == null",
    },
    {
        text: "a == null",
        options: ["always"],
    },
    {
        text: "null != a",
    },
    {
        text: "true == 1",
        options: ["smart"],
    },
    {
        text: "0 != '1'",
        options: ["smart"],
    },
    {
        text: "'wee' == /wee/",
        options: ["smart"],
    },
    {
        text: "typeof a == 'number'",
        options: ["allow-null"],
    },
    {
        text: "'string' != typeof a",
        options: ["allow-null"],
    },
    {
        text: "'hello' != 'world'",
        options: ["allow-null"],
    },
    {
        text: "2 == 3",
        options: ["allow-null"],
    },
    {
        text: "true == true",
        options: ["allow-null"],
    },
    {
        text: "true == null",
        options: ["always", { null: "always" }],
    },
    {
        text: "true != null",
        options: ["always", { null: "always" }],
    },
    {
        text: "null == null",
        options: ["always", { null: "always" }],
    },
    {
        text: "null != null",
        options: ["always", { null: "always" }],
    },
    {
        text: "true === null",
        options: ["always", { null: "never" }],
    },
    {
        text: "true !== null",
        options: ["always", { null: "never" }],
    },
    {
        text: "null === null",
        options: ["always", { null: "never" }],
    },
    {
        text: "null !== null",
        options: ["always", { null: "never" }],
    },
    {
        text: "a\n==\nb",
    },
    {
        text: "(a) == b",
    },
    {
        text: "(a) != b",
    },
    {
        text: "a == (b)",
    },
    {
        text: "a != (b)",
    },
    {
        text: "(a) == (b)",
    },
    {
        text: "(a) != (b)",
    },
    {
        text: "(a == b) == (c)",
    },
    {
        text: "(a != b) != (c)",
    },

    // location tests
    {
        text: "a == b;",
    },
    {
        text: "a!=b;",
    },
    {
        text: "(a + b) == c;",
    },
    {
        text: "(a + b)  !=  c;",
    },
    {
        text: "((1) )  ==  (2);",
    },
];

describe('eqeqeq', ({ describe }) => {

    const globalRules = { 'eqeqeq': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['eqeqeq'] = rules['eqeqeq'].concat(options);
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
                    rules['eqeqeq'] = rules['eqeqeq'].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('eqeqeq', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`)
            });
        });
    });
});
