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
    {
        text: "var a = 5;",
        options: [{}],
    },
    {
        text: "var a = 5,\n    b = 3;",
        options: [{}],
    },
    { text: "var a = 5;" },
    { text: "var a = 5,\n    b = 3;" },
    {
        text: "// Trailing comment test.",
    },
    {
        text: "// Trailing comment test.",
        options: [],
    },
];

const invalid = [
    {
        text:
				"var short2 = true;\r\n" +
				"\r\n" +
				"module.exports = {\r\n" +
				"  short: short,    \r\n" +
				"  short2: short\r\n" +
				"}",
    },
    {
        text:
				"var short2 = true;\n" +
				"\r\n" +
				"module.exports = {\r\n" +
				"  short: short,    \r\n" +
				"  short2: short\n" +
				"}",
    },
    {
        text:
				"var short2 = true;\n" +
				"\n" +
				"module.exports = {\n" +
				"  short: short,    \n" +
				"  short2: short\n" +
				"}\n",
    },
    {
        text:
				"var short2 = true;\n" +
				"\n" +
				"module.exports = {\n" +
				"  short,    \n" +
				"  short2\n" +
				"}\n",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text:
				"\n" +
				'measAr.push("<dl></dl>",  \n' +
				"         \" </dt><dd class ='pta-res'>\");",
    },
    {
        text:
				'measAr.push("<dl></dl>",  \n' +
				"         \" </dt><dd class ='pta-res'>\");",
    },
    {
        text: "var a = 5;      \n",
    },
    {
        text: "var a = 5; \n b = 3; ",
    },
    {
        text: "var a = 5; \n\n b = 3; ",
    },
    {
        text: "var a = 5;\t\n  b = 3;",
    },
    {
        text: "     \n    var c = 1;",
    },
    {
        text: "\t\n\tvar c = 2;",
    },
    {
        text: "var a = 5;      \n",
        options: [{}],
    },
    {
        text: "var a = 5; \n b = 3; ",
        options: [{}],
    },
    {
        text: "var a = 5;\t\n  b = 3;",
        options: [{}],
    },
    {
        text: "     \n    var c = 1;",
        options: [{}],
    },
    {
        text: "\t\n\tvar c = 2;",
        options: [{}],
    },
    {
        // eslint-disable-next-line no-template-curly-in-string
        text: "let str = `${a}\n  \n${b}`;  \n",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        // eslint-disable-next-line no-template-curly-in-string
        text: "let str = `\n${a}\n  \n${b}`;  \n\t",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        // eslint-disable-next-line no-template-curly-in-string
        text: "let str = `  \n  ${a}\n  \n${b}`;  \n",
        languageOptions: { ecmaVersion: 6 },
    },

    // https://github.com/eslint/eslint/issues/6933
    {
        text: "    \nabcdefg ",
    },

    {
        text: "// Trailing comment test. ",
    },
    {
        text: "/* \nTrailing comments test. \n*/",
    },
    {
        text: "#!/usr/bin/env node ",
    },
    {
        text: "// Trailing comment default test. ",
    },
];

describe("no-trailing-spaces", ({ describe }) => {

    const globalRules = { "no-trailing-spaces": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-trailing-spaces"] = rules["no-trailing-spaces"].concat(options);
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
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-trailing-spaces"] = rules["no-trailing-spaces"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-trailing-spaces", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
