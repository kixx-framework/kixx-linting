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
    { text: "parseInt(1);" },
    { text: "parseInt(1, 3);" },
    { text: "Number.parseInt(1);" },
    { text: "Number.parseInt(1, 3);" },
    { text: "0b111110111 === 503;" },
    { text: "0o767 === 503;" },
    { text: "0x1F7 === 503;" },
    { text: "a[parseInt](1,2);" },
    { text: "parseInt(foo);" },
    { text: "parseInt(foo, 2);" },
    { text: "Number.parseInt(foo);" },
    { text: "Number.parseInt(foo, 2);" },
    { text: "parseInt(11, 2);" },
    { text: "Number.parseInt(1, 8);" },
    { text: "parseInt(1e5, 16);" },
    { text: "parseInt('11', '2');" },
    { text: "Number.parseInt('11', '8');" },
    { text: "parseInt(/foo/, 2);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "parseInt(`11${foo}`, 2);" },
    {
        text: "parseInt('11', 2n);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "Number.parseInt('11', 8n);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "parseInt('11', 16n);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "parseInt(`11`, 16n);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "parseInt(1n, 2);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: 'class C { #parseInt; foo() { Number.#parseInt("111110111", 2); } }',
        languageOptions: { ecmaVersion: 2022 },
    },
];

const invalid = [
    {
        text: 'parseInt("111110111", 2) === 503;',
    },
    {
        text: 'parseInt("767", 8) === 503;',
    },
    {
        text: 'parseInt("1F7", 16) === 255;',
    },
    {
        text: 'Number.parseInt("111110111", 2) === 503;',
    },
    {
        text: 'Number.parseInt("767", 8) === 503;',
    },
    {
        text: 'Number.parseInt("1F7", 16) === 255;',
    },
    {
        text: "parseInt('7999', 8);",
    },
    {
        text: "parseInt('1234', 2);",
    },
    {
        text: "parseInt('1234.5', 8);",
    },
    {
        text: "parseInt('1️⃣3️⃣3️⃣7️⃣', 16);",
    },
    {
        text: "Number.parseInt('7999', 8);",
    },
    {
        text: "Number.parseInt('1234', 2);",
    },
    {
        text: "Number.parseInt('1234.5', 8);",
    },
    {
        text: "Number.parseInt('1️⃣3️⃣3️⃣7️⃣', 16);",
    },
    {
        text: "parseInt(`111110111`, 2) === 503;",
    },
    {
        text: "parseInt(`767`, 8) === 503;",
    },
    {
        text: "parseInt(`1F7`, 16) === 255;",
    },
    {
        text: "parseInt('', 8);",
    },
    {
        text: "parseInt(``, 8);",
    },
    {
        text: "parseInt(`7999`, 8);",
    },
    {
        text: "parseInt(`1234`, 2);",
    },
    {
        text: "parseInt(`1234.5`, 8);",
    },

    // Adjacent tokens tests
    {
        text: "parseInt('11', 2)",
    },
    {
        text: "Number.parseInt('67', 8)",
    },
    {
        text: "5+parseInt('A', 16)",
    },
    {
        text: "function *f(){ yield(Number).parseInt('11', 2) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function *f(){ yield(Number.parseInt)('67', 8) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function *f(){ yield(parseInt)('A', 16) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function *f(){ yield Number.parseInt('11', 2) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function *f(){ yield/**/Number.parseInt('67', 8) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "function *f(){ yield(parseInt('A', 16)) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "parseInt('11', 2)+5",
    },
    {
        text: "Number.parseInt('17', 8)+5",
    },
    {
        text: "parseInt('A', 16)+5",
    },
    {
        text: "parseInt('11', 2)in foo",
    },
    {
        text: "Number.parseInt('17', 8)in foo",
    },
    {
        text: "parseInt('A', 16)in foo",
    },
    {
        text: "parseInt('11', 2) in foo",
    },
    {
        text: "Number.parseInt('17', 8)/**/in foo",
    },
    {
        text: "(parseInt('A', 16))in foo",
    },

    // Should not autofix if it would remove comments
    {
        text: "/* comment */Number.parseInt('11', 2);",
    },
    {
        text: "Number/**/.parseInt('11', 2);",
    },
    {
        text: "Number//\n.parseInt('11', 2);",
    },
    {
        text: "Number./**/parseInt('11', 2);",
    },
    {
        text: "Number.parseInt(/**/'11', 2);",
    },
    {
        text: "Number.parseInt('11', /**/2);",
    },
    {
        text: "Number.parseInt('11', 2)/* comment */;",
    },
    {
        text: "parseInt/**/('11', 2);",
    },
    {
        text: "parseInt(//\n'11', 2);",
    },
    {
        text: "parseInt('11'/**/, 2);",
    },
    {
        text: "parseInt(`11`/**/, 2);",
    },
    {
        text: "parseInt('11', 2 /**/);",
    },
    {
        text: "parseInt('11', 2)//comment\n;",
    },

    // Optional chaining
    {
        text: 'parseInt?.("1F7", 16) === 255;',
    },
    {
        text: 'Number?.parseInt("1F7", 16) === 255;',
    },
    {
        text: 'Number?.parseInt?.("1F7", 16) === 255;',
    },
    {
        text: '(Number?.parseInt)("1F7", 16) === 255;',
    },
    {
        text: '(Number?.parseInt)?.("1F7", 16) === 255;',
    },

    // `parseInt` doesn't support numeric separators. The rule shouldn't autofix in those cases.
    {
        text: "parseInt('1_0', 2);",
    },
    {
        text: "Number.parseInt('5_000', 8);",
    },
    {
        text: "parseInt('0_1', 16);",
    },
    {
        // this would be indeed the same as `0x0_0`, but there's no need to autofix this edge case that looks more like a mistake.
        text: "Number.parseInt('0_0', 16);",
    },
];

describe("prefer-numeric-literals", ({ describe }) => {

    const globalRules = { "prefer-numeric-literals": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["prefer-numeric-literals"] = rules["prefer-numeric-literals"].concat(options);
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
                    rules["prefer-numeric-literals"] = rules["prefer-numeric-literals"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("prefer-numeric-literals", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
