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
    { text: "Console.info(foo)" },

    // single array item
    { text: "console.info(foo)", options: [{ allow: ["info"] }] },
    { text: "console.warn(foo)", options: [{ allow: ["warn"] }] },
    { text: "console.error(foo)", options: [{ allow: ["error"] }] },
    { text: "console.log(foo)", options: [{ allow: ["log"] }] },

    // multiple array items
    { text: "console.info(foo)", options: [{ allow: ["warn", "info"] }] },
    { text: "console.warn(foo)", options: [{ allow: ["error", "warn"] }] },
    { text: "console.error(foo)", options: [{ allow: ["log", "error"] }] },
    {
        text: "console.log(foo)",
        options: [{ allow: ["info", "log", "warn"] }],
    },

    // https://github.com/eslint/eslint/issues/7010
    { text: "var console = require('myconsole'); console.log(foo)" },
];

const invalid = [
    // no options
    {
        text: "if (a) console.warn(foo)",
    },
    {
        text: "foo(console.log)",
    },
    {
        text: "console.log(foo)",
    },
    {
        text: "console.error(foo)",
    },
    {
        text: "console.info(foo)",
    },
    {
        text: "console.warn(foo)",
    },
    {
        text: "switch (a) { case 1: console.log(foo) }",
    },
    {
        text: "if (a) { console.warn(foo) }",
    },
    {
        text: "a();\nconsole.log(foo);\nb();",
    },
    {
        text: "class A { static { console.info(foo) } }", // languageOptions: { ecmaVersion: "latest" }
    },
    {
        text: "a()\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a))", // languageOptions: { ecmaVersion: "latest" }
    },
    {
        text: "a++\nconsole.log();\n/b/", // languageOptions: { ecmaVersion: "latest" }
    },
    {
        text: "a();\nconsole.log(foo);\n[1, 2, 3].forEach(a => doSomething(a));", // languageOptions: { ecmaVersion: "latest" }
    },

    //  one option
    {
        text: "if (a) console.info(foo)",
        options: [{ allow: ["warn"] }],
    },
    {
        text: "foo(console.warn)",
        options: [{ allow: ["log"] }],
    },
    {
        text: "console.log(foo)",
        options: [{ allow: ["error"] }],
    },
    {
        text: "console.error(foo)",
        options: [{ allow: ["warn"] }],
    },
    {
        text: "console.info(foo)",
        options: [{ allow: ["log"] }],
    },
    {
        text: "console.warn(foo)",
        options: [{ allow: ["error"] }],
    },
    {
        text: "switch (a) { case 1: console.log(foo) }",
        options: [{ allow: ["error"] }],
    },
    {
        text: "if (a) { console.info(foo) }",
        options: [{ allow: ["warn"] }],
    },
    {
        text: "class A { static { console.error(foo) } }",
        options: [{ allow: ["log"] }], // languageOptions: { ecmaVersion: "latest" }
    },

    // multiple options
    {
        text: "if (a) console.log(foo)",
        options: [{ allow: ["warn", "error"] }],
    },
    {
        text: "foo(console.info)",
        options: [{ allow: ["warn", "error"] }],
    },
    {
        text: "console.log(foo)",
        options: [{ allow: ["warn", "info"] }],
    },
    {
        text: "console.error(foo)",
        options: [{ allow: ["warn", "info", "log"] }],
    },
    {
        text: "console.info(foo)",
        options: [{ allow: ["warn", "error", "log"] }],
    },
    {
        text: "console.warn(foo)",
        options: [{ allow: ["info", "log"] }],
    },
    {
        text: "switch (a) { case 1: console.error(foo) }",
        options: [{ allow: ["info", "log"] }],
    },
    {
        text: "if (a) { console.log(foo) }",
        options: [{ allow: ["warn", "error"] }],
    },
    {
        text: "class A { static { console.info(foo) } }",
        options: [{ allow: ["log", "error", "warn"] }], // languageOptions: { ecmaVersion: "latest" }
    },
    {
        text: "console[foo](bar)",
    },
    {
        text: "console[0](foo)",
    },

    // In case that implicit global variable of 'console' exists
    {
        text: "console.log(foo)", // languageOptions: { globals: { console: "readonly" } }
    },
];

describe("no-console", ({ describe }) => {

    const globalRules = { "no-console": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-console"] = rules["no-console"].concat(options);
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
            invalid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-console"] = rules["no-console"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(1, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [ message ] = res.messages;

                assertEqual("no-console", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
