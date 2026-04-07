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
    // different test conditions
    { text: "if (a) {} else if (b) {}" },
    { text: "if (a); else if (b); else if (c);" },
    { text: "if (true) {} else if (false) {} else {}" },
    { text: "if (1) {} else if (2) {}" },
    { text: "if (f) {} else if (f()) {}" },
    { text: "if (f(a)) {} else if (g(a)) {}" },
    { text: "if (f(a)) {} else if (f(b)) {}" },
    { text: "if (a === 1) {} else if (a === 2) {}" },
    { text: "if (a === 1) {} else if (b === 1) {}" },

    // not an if-else-if chain
    { text: "if (a) {}" },
    { text: "if (a);" },
    { text: "if (a) {} else {}" },
    { text: "if (a) if (a) {}" },
    { text: "if (a) if (a);" },
    { text: "if (a) { if (a) {} }" },
    { text: "if (a) {} else { if (a) {} }" },
    { text: "if (a) {} if (a) {}" },
    { text: "if (a); if (a);" },
    { text: "while (a) if (a);" },
    { text: "if (a); else a ? a : a;" },

    // not same conditions in the chain
    { text: "if (a) { if (b) {} } else if (b) {}" },
    { text: "if (a) if (b); else if (a);" },

    // not equal tokens
    { text: "if (a) {} else if (!!a) {}" },
    { text: "if (a === 1) {} else if (a === (1)) {}" },

    // more complex valid chains (may contain redundant subconditions, but the branch can be executed)
    { text: "if (a || b) {} else if (c || d) {}" },
    { text: "if (a || b) {} else if (a || c) {}" },
    { text: "if (a) {} else if (a || b) {}" },
    { text: "if (a) {} else if (b) {} else if (a || b || c) {}" },
    { text: "if (a && b) {} else if (a) {} else if (b) {}" },
    { text: "if (a && b) {} else if (b && c) {} else if (a && c) {}" },
    { text: "if (a && b) {} else if (b || c) {}" },
    { text: "if (a) {} else if (b && (a || c)) {}" },
    { text: "if (a) {} else if (b && (c || d && a)) {}" },
    { text: "if (a && b && c) {} else if (a && b && (c || d)) {}" },
];

const invalid = [
    // basic tests
    {
        text: "if (a) {} else if (a) {}",
    },
    {
        text: "if (a); else if (a);",
    },
    {
        text: "if (a) {} else if (a) {} else {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (a) {} else if (c) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (a) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (c) {} else if (a) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (b) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (b) {} else {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (c) {} else if (b) {}",
    },
    {
        text: "if (a); else if (b); else if (c); else if (b); else if (d); else;",
    },
    {
        text: "if (a); else if (b); else if (c); else if (d); else if (b); else if (e);",
    },

    // multiple duplicates of the same condition
    {
        text: "if (a) {} else if (a) {} else if (a) {}",
    },

    // multiple duplicates of different conditions
    {
        text: "if (a) {} else if (b) {} else if (a) {} else if (b) {} else if (a) {}",
    },

    // inner if statements do not affect chain
    {
        text: "if (a) { if (b) {} } else if (a) {}",
    },

    // various kinds of test conditions
    {
        text: "if (a === 1) {} else if (a === 1) {}",
    },
    {
        text: "if (1 < a) {} else if (1 < a) {}",
    },
    {
        text: "if (true) {} else if (true) {}",
    },
    {
        text: "if (a && b) {} else if (a && b) {}",
    },
    {
        text: "if (a && b || c)  {} else if (a && b || c) {}",
    },
    {
        text: "if (f(a)) {} else if (f(a)) {}",
    },

    // spaces and comments do not affect comparison
    {
        text: "if (a === 1) {} else if (a===1) {}",
    },
    {
        text: "if (a === 1) {} else if (a === /* comment */ 1) {}",
    },

    // extra parens around the whole test condition do not affect comparison
    {
        text: "if (a === 1) {} else if ((a === 1)) {}",
    },

    // more complex errors with `||` and `&&`
    {
        text: "if (a || b) {} else if (a) {}",
    },
    {
        text: "if (a || b) {} else if (a) {} else if (b) {}",
    },
    {
        text: "if (a || b) {} else if (b || a) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (a || b) {}",
    },
    {
        text: "if (a || b) {} else if (c || d) {} else if (a || d) {}",
    },
    {
        text: "if ((a === b && fn(c)) || d) {} else if (fn(c) && a === b) {}",
    },
    {
        text: "if (a) {} else if (a && b) {}",
    },
    {
        text: "if (a && b) {} else if (b && a) {}",
    },
    {
        text: "if (a && b) {} else if (a && b && c) {}",
    },
    {
        text: "if (a || c) {} else if (a && b || c) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (c && a || b) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (c && (a || b)) {}",
    },
    {
        text: "if (a) {} else if (b && c) {} else if (d && (a || e && c && b)) {}",
    },
    {
        text: "if (a || b && c) {} else if (b && c && d) {}",
    },
    {
        text: "if (a || b) {} else if (b && c) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if ((a || b) && c) {}",
    },
    {
        text: "if ((a && (b || c)) || d) {} else if ((c || b) && e && a) {}",
    },
    {
        text: "if (a && b || b && c) {} else if (a && b && c) {}",
    },
    {
        text: "if (a) {} else if (b && c) {} else if (d && (c && e && b || a)) {}",
    },
    {
        text: "if (a || (b && (c || d))) {} else if ((d || c) && b) {}",
    },
    {
        text: "if (a || b) {} else if ((b || a) && c) {}",
    },
    {
        text: "if (a || b) {} else if (c) {} else if (d) {} else if (b && (a || c)) {}",
    },
    {
        text: "if (a || b || c) {} else if (a || (b && d) || (c && e)) {}",
    },
    {
        text: "if (a || (b || c)) {} else if (a || (b && c)) {}",
    },
    {
        text: "if (a || b) {} else if (c) {} else if (d) {} else if ((a || c) && (b || d)) {}",
    },
    {
        text: "if (a) {} else if (b) {} else if (c && (a || d && b)) {}",
    },
    {
        text: "if (a) {} else if (a || a) {}",
    },
    {
        text: "if (a || a) {} else if (a || a) {}",
    },
    {
        text: "if (a || a) {} else if (a) {}",
    },
    {
        text: "if (a) {} else if (a && a) {}",
    },
    {
        text: "if (a && a) {} else if (a && a) {}",
    },
    {
        text: "if (a && a) {} else if (a) {}",
    },
];

describe("no-dupe-else-if", ({ describe }) => {

    const globalRules = { "no-dupe-else-if": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-dupe-else-if"] = rules["no-dupe-else-if"].concat(options);
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
                    rules["no-dupe-else-if"] = rules["no-dupe-else-if"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-dupe-else-if", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
