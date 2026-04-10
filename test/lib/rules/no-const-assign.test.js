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
    { text: "const x = 0; { let x; x = 1; }" },
    { text: "const x = 0; function a(x) { x = 1; }" },
    { text: "const x = 0; foo(x);" },
    { text: "for (const x in [1,2,3]) { foo(x); }" },
    { text: "for (const x of [1,2,3]) { foo(x); }" },
    { text: "const x = {key: 0}; x.key = 1;" },
    // { text: "using x = foo();" },
    // { text: "await using x = foo();" },
    // { text: "using x = foo(); bar(x);" },
    // { text: "await using x = foo(); bar(x);" },

    // ignores non constant.
    { text: "var x = 0; x = 1;" },
    { text: "let x = 0; x = 1;" },
    { text: "function x() {} x = 1;" },
    { text: "function foo(x) { x = 1; }" },
    { text: "class X {} X = 1;" },
    { text: "try {} catch (x) { x = 1; }" },
];
const invalid = [
    {
        text: "const x = 0; x = 1;",
    },
    {
        text: "const {a: x} = {a: 0}; x = 1;",
    },
    {
        text: "const x = 0; ({x} = {x: 1});",
    },
    {
        text: "const x = 0; ({a: x = 1} = {});",
    },
    {
        text: "const x = 0; x += 1;",
    },
    {
        text: "const x = 0; ++x;",
    },
    {
        text: "for (const i = 0; i < 10; ++i) { foo(i); }",
    },
    {
        text: "const x = 0; x = 1; x = 2;",
        errors: 2,
    },
    {
        text: "const x = 0; function foo() { x = x + 1; }",
    },
    {
        text: "const x = 0; function foo(a) { x = a; }",
    },
    {
        text: "const x = 0; while (true) { x = x + 1; }",
    },
    // { text: "using x = foo(); x = 1;" },
    // { text: "await using x = foo(); x = 1;" },
    // { text: "using x = foo(); x ??= bar();" },
    // { text: "await using x = foo(); x ||= bar();" },
    // { text: "using x = foo(); [x, y] = bar();" },
    // { text: "await using x = foo(); [x = baz, y] = bar();" },
];

describe("no-const-assign", ({ describe }) => {

    const globalRules = { "no-const-assign": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-const-assign"] = rules["no-const-assign"].concat(options);
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

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, options, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-const-assign"] = rules["no-const-assign"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-const-assign", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
