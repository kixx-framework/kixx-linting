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
    { text: "var foo = /^abc[a-zA-Z]/;" },
    { text: 'var regExp = new RegExp("^abc[]");' },
    { text: "var foo = /^abc/;" },
    { text: "var foo = /[\\[]/;" },
    { text: "var foo = /[\\]]/;" },
    { text: "var foo = /\\[][\\]]/;" },
    { text: "var foo = /[a-zA-Z\\[]/;" },
    { text: "var foo = /[[]/;" },
    { text: "var foo = /[\\[a-z[]]/;" },
    { text: "var foo = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g;" },
    { text: "var foo = /\\s*:\\s*/gim;" },
    { text: "var foo = /[^]/;" }, // this rule allows negated empty character classes
    { text: "var foo = /\\[][^]/;" },
    { text: "var foo = /[\\]]/uy;" }, // languageOptions: { ecmaVersion: 6 }
    { text: "var foo = /[\\]]/s;" }, // languageOptions: { ecmaVersion: 2018 }
    { text: "var foo = /[\\]]/d;" }, // languageOptions: { ecmaVersion: 2022 }
    { text: "var foo = /\\[]/" },
    { text: "var foo = /[[^]]/v;" }, // languageOptions: { ecmaVersion: 2024 }
    {
        text: "var foo = /[[\\]]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[\\[]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[a--b]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[a&&b]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[a][b]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[\\q{}]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[^]--\\p{ASCII}]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
];

const invalid = [
    {
        text: "var foo = /^abc[]/;",
    },
    {
        text: "var foo = /foo[]bar/;",
    },
    {
        text: "if (foo.match(/^abc[]/)) {}",
    },
    {
        text: "if (/^abc[]/.test(foo)) {}",
    },
    {
        text: "var foo = /[]]/;",
    },
    {
        text: "var foo = /\\[[]/;",
    },
    {
        text: "var foo = /\\[\\[\\]a-z[]/;",
    },
    {
        text: "var foo = /[]]/d;",
        // languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "var foo = /[(]\\u{0}*[]/u;",
        // languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "var foo = /[]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[a][]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[a[[b[]c]]d]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[a--[]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[]--b]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[a&&[]]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
    {
        text: "var foo = /[[]&&b]/v;",
        // languageOptions: { ecmaVersion: 2024 },
    },
];

describe("no-empty-character-class", ({ describe }) => {

    const globalRules = { "no-empty-character-class": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-empty-character-class"] = rules["no-empty-character-class"].concat(options);
                }

                const res = lintText(file, rules);

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
            invalid.forEach(({ text, options, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-empty-character-class"] = rules["no-empty-character-class"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-empty-character-class", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
