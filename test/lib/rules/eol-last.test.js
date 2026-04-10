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
    { text: "" },
    { text: "\n" },
    { text: "var a = 123;\n" },
    { text: "var a = 123;\n\n" },
    { text: "var a = 123;\n   \n" },

    { text: "\r\n" },
    { text: "var a = 123;\r\n" },
    { text: "var a = 123;\r\n\r\n" },
    { text: "var a = 123;\r\n   \r\n" },

    { text: "var a = 123;", options: ["never"] },
    { text: "var a = 123;\nvar b = 456;", options: ["never"] },
    { text: "var a = 123;\r\nvar b = 456;", options: ["never"] },

    // Deprecated: `"unix"` parameter
    { text: "", options: ["unix"] },
    { text: "\n", options: ["unix"] },
    { text: "var a = 123;\n", options: ["unix"] },
    { text: "var a = 123;\n\n", options: ["unix"] },
    { text: "var a = 123;\n   \n", options: ["unix"] },

    // Deprecated: `"windows"` parameter
    { text: "", options: ["windows"] },
    { text: "\n", options: ["windows"] },
    { text: "\r\n", options: ["windows"] },
    { text: "var a = 123;\r\n", options: ["windows"] },
    { text: "var a = 123;\r\n\r\n", options: ["windows"] },
    { text: "var a = 123;\r\n   \r\n", options: ["windows"] },
];

const invalid = [
    {
        text: "var a = 123;",
    },
    {
        text: "var a = 123;\n   ",
    },
    {
        text: "var a = 123;\n",
        options: ["never"],
    },
    {
        text: "var a = 123;\r\n",
        options: ["never"],
    },
    {
        text: "var a = 123;\r\n\r\n",
        options: ["never"],
    },
    {
        text: "var a = 123;\nvar b = 456;\n",
        options: ["never"],
    },
    {
        text: "var a = 123;\r\nvar b = 456;\r\n",
        options: ["never"],
    },
    {
        text: "var a = 123;\n\n",
        options: ["never"],
    },

    // Deprecated: `"unix"` parameter
    {
        text: "var a = 123;",
        options: ["unix"],
    },
    {
        text: "var a = 123;\n   ",
        options: ["unix"],
    },

    // Deprecated: `"windows"` parameter
    {
        text: "var a = 123;",
        options: ["windows"],
    },
    {
        text: "var a = 123;\r\n   ",
        options: ["windows"],
    },
];

describe('eol-last', ({ describe }) => {

    const globalRules = { 'eol-last': [ 'error' ] };

    describe('valid code', ({ it }) => {
        it('has expected outcomes', () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules['eol-last'] = rules['eol-last'].concat(options);
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
                    rules['eol-last'] = rules['eol-last'].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual('eol-last', message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`)
            });
        });
    });
});
