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
    { text: "throw new Error();" },
    { text: "throw new Error('error');" },
    { text: "throw Error('error');" },
    { text: "var e = new Error(); throw e;" },
    { text: "try {throw new Error();} catch (e) {throw e;};" },
    { text: "throw a;" }, // Identifier
    { text: "throw foo();" }, // CallExpression
    { text: "throw new foo();" }, // NewExpression
    { text: "throw foo.bar;" }, // MemberExpression
    { text: "throw foo[bar];" }, // MemberExpression
    {
        text: "class C { #field; foo() { throw foo.#field; } }",
        languageOptions: { ecmaVersion: 2022 },
    }, // MemberExpression
    { text: "throw foo = new Error();" }, // AssignmentExpression with the `=` operator
    {
        text: "throw foo.bar ||= 'literal'",
        languageOptions: { ecmaVersion: 2021 },
    }, // AssignmentExpression with a logical operator
    {
        text: "throw foo[bar] ??= 'literal'",
        languageOptions: { ecmaVersion: 2021 },
    }, // AssignmentExpression with a logical operator
    { text: "throw 1, 2, new Error();" }, // SequenceExpression
    { text: "throw 'literal' && new Error();" }, // LogicalExpression (right)
    { text: "throw new Error() || 'literal';" }, // LogicalExpression (left)
    { text: "throw foo ? new Error() : 'literal';" }, // ConditionalExpression (consequent)
    { text: "throw foo ? 'literal' : new Error();" }, // ConditionalExpression (alternate)
    { text: "throw tag `${foo}`;", languageOptions: { ecmaVersion: 6 } }, // TaggedTemplateExpression
    {
        text: "function* foo() { var index = 0; throw yield index++; }",
        languageOptions: { ecmaVersion: 6 },
    }, // YieldExpression
    {
        text: "async function foo() { throw await bar; }",
        languageOptions: { ecmaVersion: 8 },
    }, // AwaitExpression
    { text: "throw obj?.foo", languageOptions: { ecmaVersion: 2020 } }, // ChainExpression
    { text: "throw obj?.foo()", languageOptions: { ecmaVersion: 2020 } }, // ChainExpression
];
const invalid = [
    {
        text: "throw 'error';",
    },
    {
        text: "throw 0;",
    },
    {
        text: "throw false;",
    },
    {
        text: "throw null;",
    },
    {
        text: "throw {};",
    },
    {
        text: "throw undefined;",
    },

    // String concatenation
    {
        text: "throw 'a' + 'b';",
    },
    {
        text: "var b = new Error(); throw 'a' + b;",
    },

    // AssignmentExpression
    {
        text: "throw foo = 'error';", // RHS is a literal
    },
    {
        text: "throw foo += new Error();", // evaluates to a primitive value, or throws while evaluating
    },
    {
        text: "throw foo &= new Error();", // evaluates to a primitive value, or throws while evaluating
    },
    {
        text: "throw foo &&= 'literal'", // evaluates either to a falsy value of `foo` (which, then, cannot be an Error object), or to 'literal'
        languageOptions: { ecmaVersion: 2021 },
    },

    // SequenceExpression
    {
        text: "throw new Error(), 1, 2, 3;",
    },

    // LogicalExpression
    {
        text: "throw 'literal' && 'not an Error';",
    },
    {
        text: "throw foo && 'literal'", // evaluates either to a falsy value of `foo` (which, then, cannot be an Error object), or to 'literal'
    },

    // ConditionalExpression
    {
        text: "throw foo ? 'not an Error' : 'literal';",
    },

    // TemplateLiteral
    {
        text: "throw `${err}`;",
        languageOptions: { ecmaVersion: 6 },
    },
];

describe("no-throw-literal", ({ describe }) => {

    const globalRules = { "no-throw-literal": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-throw-literal"] = rules["no-throw-literal"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-throw-literal"] = rules["no-throw-literal"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-throw-literal", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
