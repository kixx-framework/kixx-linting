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
    { text: "`Hello, ${name}`;" },
    { text: "templateFunction`Hello, ${name}`;" },
    { text: "`Hello, name`;" },
    { text: "'Hello, name';" },
    { text: "'Hello, ' + name;" },
    { text: "`Hello, ${index + 1}`" },
    { text: '`Hello, ${name + " foo"}`' },
    { text: '`Hello, ${name || "foo"}`' },
    { text: '`Hello, ${{foo: "bar"}.foo}`' },
    { text: "'$2'" },
    { text: "'${'" },
    { text: "'$}'" },
    { text: "'{foo}'" },
    { text: "'{foo: \"bar\"}'" },
    { text: "const number = 3" },
];

const invalid = [
    {
        text: "'Hello, ${name}'",
    },
    {
        text: '"Hello, ${name}"',
    },
    {
        text: "'${greeting}, ${name}'",
    },
    {
        text: "'Hello, ${index + 1}'",
    },
    {
        text: "'Hello, ${name + \" foo\"}'",
    },
    {
        text: "'Hello, ${name || \"foo\"}'",
    },
    {
        text: "'Hello, ${{foo: \"bar\"}.foo}'",
    },
];

describe("no-template-curly-in-string", ({ describe }) => {

    const globalRules = { "no-template-curly-in-string": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-template-curly-in-string"] = rules["no-template-curly-in-string"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

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
            invalid.forEach(({ text, options, languageOptions, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-template-curly-in-string"] = rules["no-template-curly-in-string"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-template-curly-in-string", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
