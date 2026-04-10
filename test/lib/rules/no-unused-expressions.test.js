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
    { text: "function f(){}" },
    { text: "a = b" },
    { text: "new a" },
    { text: "{}" },
    { text: "f(); g()" },
    { text: "i++" },
    { text: "a()" },
    { text: "a && a()", options: [{ allowShortCircuit: true }] },
    { text: "a() || (b = c)", options: [{ allowShortCircuit: true }] },
    { text: "a ? b() : c()", options: [{ allowTernary: true }] },
    {
        text: "a ? b() || (c = d) : e()",
        options: [{ allowShortCircuit: true, allowTernary: true }],
    },
    { text: "delete foo.bar" },
    { text: "void new C" },
    { text: '"use strict";' },
    { text: '"directive one"; "directive two"; f();' },
    { text: 'function foo() {"use strict"; return true; }' },
    {
        text: 'var foo = () => {"use strict"; return true; }',
        languageOptions: { ecmaVersion: 6 },
    },
    { text: 'function foo() {"directive one"; "directive two"; f(); }' },
    { text: 'function foo() { var foo = "use strict"; return true; }' },
    {
        text: "function* foo(){ yield 0; }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "async function foo() { await 5; }",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "async function foo() { await foo.bar; }",
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "async function foo() { bar && await baz; }",
        options: [{ allowShortCircuit: true }],
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "async function foo() { foo ? await bar : await baz; }",
        options: [{ allowTernary: true }],
        languageOptions: { ecmaVersion: 8 },
    },
    {
        text: "tag`tagged template literal`",
        options: [{ allowTaggedTemplates: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "shouldNotBeAffectedByAllowTemplateTagsOption()",
        options: [{ allowTaggedTemplates: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: 'import("foo")',
        languageOptions: { ecmaVersion: 11 },
    },
    {
        text: 'func?.("foo")',
        languageOptions: { ecmaVersion: 11 },
    },
    {
        text: 'obj?.foo("bar")',
        languageOptions: { ecmaVersion: 11 },
    },
];

const invalid = [
    {
        text: "0",
    },
    {
        text: "a",
    },
    {
        text: "f(), 0",
    },
    {
        text: "{0}",
    },
    {
        text: "[]",
    },
    {
        text: "a && b();",
    },
    {
        text: "a() || false",
    },
    {
        text: "a || (b = c)",
    },
    {
        text: "a ? b() || (c = d) : e",
    },
    {
        text: "`untagged template literal`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "tag`tagged template literal`",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "a && b()",
        options: [{ allowTernary: true }],
    },
    {
        text: "a ? b() : c()",
        options: [{ allowShortCircuit: true }],
    },
    {
        text: "a || b",
        options: [{ allowShortCircuit: true }],
    },
    {
        text: "a() && b",
        options: [{ allowShortCircuit: true }],
    },
    {
        text: "a ? b : 0",
        options: [{ allowTernary: true }],
    },
    {
        text: "a ? b : c()",
        options: [{ allowTernary: true }],
    },
    {
        text: "foo.bar;",
    },
    {
        text: "!a",
    },
    {
        text: "+a",
    },
    {
        text: '"directive one"; f(); "directive two";',
    },
    {
        text: 'function foo() {"directive one"; f(); "directive two"; }',
    },
    {
        text: 'if (0) { "not a directive"; f(); }',
    },
    {
        text: 'function foo() { var foo = true; "use strict"; }',
    },
    {
        text: 'var foo = () => { var foo = true; "use strict"; }',
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "`untagged template literal`",
        options: [{ allowTaggedTemplates: true }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "`untagged template literal`",
        options: [{ allowTaggedTemplates: false }],
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "tag`tagged template literal`",
        options: [{ allowTaggedTemplates: false }],
        languageOptions: { ecmaVersion: 6 },
    },

    // Optional chaining
    {
        text: "obj?.foo",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "obj?.foo.bar",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "obj?.foo().bar",
        languageOptions: { ecmaVersion: 2020 },
    },

    // class static blocks do not have directive prologues
    {
        text: "class C { static { 'use strict'; } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { static { \n'foo'\n'bar'\n } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: '"use strict";',
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
    {
        text: '"directive one"; "directive two"; f();',
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
    {
        text: 'function foo() {"use strict"; return true; }',
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
    {
        text: 'function foo() {"directive one"; "directive two"; f(); }',
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
];

describe("no-unused-expressions", ({ describe }) => {

    const globalRules = { "no-unused-expressions": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unused-expressions"] = rules["no-unused-expressions"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    // eslint-disable-next-line no-console
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, code, options, languageOptions, errors = 1 }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unused-expressions"] = rules["no-unused-expressions"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-unused-expressions", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
