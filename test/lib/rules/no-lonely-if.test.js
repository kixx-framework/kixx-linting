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

// Examples of code that should not trigger the rule
const valid = [
    { text: "if (a) {;} else if (b) {;}" },
    { text: "if (a) {;} else { if (b) {;} ; }" },
    { text: "if (a) if (a) {} else { if (b) {} } else {}" },
];

// Examples of code that should trigger the rule
const invalid = [
    {
        text: "if (a) {;} else { if (b) {;} }",
    },
    {
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
    },
    {
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else /* comment */ {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
    },
    {
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  /* otherwise, do the other thing */ if (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
    },
    {
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if /* this comment is ok */ (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
    },
    {
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  } /* this comment will prevent this test case from being autofixed. */\n" +
				"}",
    },
    {
        text: "if (foo) {} else { if (bar) baz(); }",
    },
    {
        // Not fixed; removing the braces would cause a SyntaxError.
        text: "if (foo) {} else { if (bar) baz() } qux();",
    },
    {
        // This is fixed because there is a semicolon after baz().
        text: "if (foo) {} else { if (bar) baz(); } qux();",
    },
    {
        // Not fixed; removing the braces would change the semantics due to ASI.
        text:
				"if (foo) {\n" +
				"} else {\n" +
				"  if (bar) baz()\n" +
				"}\n" +
				"[1, 2, 3].forEach(foo);",
    },
    {
        // Not fixed; removing the braces would change the semantics due to ASI.
        text:
				"if (foo) {\n" +
				"} else {\n" +
				"  if (bar) baz++\n" +
				"}\n" +
				"foo;",
    },
    {
        // This is fixed because there is a semicolon after baz++
        text:
				"if (foo) {\n" +
				"} else {\n" +
				"  if (bar) baz++;\n" +
				"}\n" +
				"foo;",
    },
    {
        // Not fixed; bar() would be interpreted as a template literal tag
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) bar()\n" +
				"}\n" +
				"`template literal`;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  } else if (c) {\n" +
				"    baz();\n" +
				"  } else {\n" +
				"    qux();\n" +
				"  }\n" +
				"}",
    },
];

describe("no-lonely-if", ({ describe }) => {

    const globalRules = { "no-lonely-if": ["error"] };
    const normalizeLanguageOptions = (languageOptions) => ({
        ecmaVersion: 2024,
        sourceType: "script",
        ...(languageOptions || {}),
    });

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-lonely-if"] = rules["no-lonely-if"].concat(options);
                }

                const res = lintText(file, rules, normalizeLanguageOptions(languageOptions));

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
                    rules["no-lonely-if"] = rules["no-lonely-if"].concat(options);
                }

                const res = lintText(file, rules, normalizeLanguageOptions(languageOptions));

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-lonely-if", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
