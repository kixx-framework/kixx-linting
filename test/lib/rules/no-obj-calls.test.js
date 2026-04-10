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

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const globalsJsonc = readFileSync(
    resolve(__dirname, "../../../vendor/globals/globals.json"),
    "utf8",
);
const globals = JSON.parse(globalsJsonc.replace(/^\/\*[\s\S]*?\*\/\s*/u, ""));

const valid = [
    { text: "var x = Math;" },
    { text: "var x = Math.random();" },
    { text: "var x = Math.PI;" },
    { text: "var x = foo.Math();" },
    { text: "var x = new foo.Math();" },
    { text: "var x = new Math.foo;" },
    { text: "var x = new Math.foo();" },
    { text: "JSON.parse(foo)" },
    { text: "new JSON.parse" },
    {
        text: "Reflect.get(foo, 'x')",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "new Reflect.foo(a, b)",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "Atomics.load(foo, 0)",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "new Atomics.foo()",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "new Intl.Segmenter()",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "Intl.foo()",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "Temporal.Now.instant()",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "new Temporal.Instant(0n)",
        languageOptions: { ecmaVersion: 2026 },
    },

    { text: "globalThis.Math();", languageOptions: { ecmaVersion: 6 } },
    {
        text: "var x = globalThis.Math();",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "f(globalThis.Math());", languageOptions: { ecmaVersion: 6 } },
    { text: "globalThis.Math().foo;", languageOptions: { ecmaVersion: 6 } },
    {
        text: "var x = globalThis.JSON();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "x = globalThis.JSON(str);",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "globalThis.Math( globalThis.JSON() );",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = globalThis.Reflect();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = globalThis.Reflect();",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "/*globals Reflect: true*/ globalThis.Reflect();",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "var x = globalThis.Atomics();",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "var x = globalThis.Atomics();",
        languageOptions: { ecmaVersion: 2017, globals: { Atomics: false } },
    },
    {
        text: "var x = globalThis.Intl();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "const x = globalThis.Temporal();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "const x = globalThis.Temporal();",
        languageOptions: {
            ecmaVersion: 2015,
            globals: { Temporal: false },
        },
    },

    // non-existing variables
    { text: "/*globals Math: off*/ Math();" },
    { text: "/*globals Math: off*/ new Math();" },
    {
        text: "JSON();",
        languageOptions: {
            globals: { JSON: "off" },
        },
    },
    {
        text: "new JSON();",
        languageOptions: {
            globals: { JSON: "off" },
        },
    },
    { text: "Reflect();" },
    { text: "Atomics();" },
    { text: "new Reflect();" },
    { text: "new Atomics();" },
    {
        text: "Atomics();",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "Intl()" },
    { text: "new Intl()" },
    { text: "Temporal();" },
    { text: "new Temporal();" },

    // shadowed variables
    { text: "var Math; Math();" },
    { text: "var Math; new Math();" },
    {
        text: "let JSON; JSON();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "let JSON; new JSON();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "if (foo) { const Reflect = 1; Reflect(); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "if (foo) { const Reflect = 1; new Reflect(); }",
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "function foo(Math) { Math(); }" },
    { text: "function foo(JSON) { new JSON(); }" },
    {
        text: "function foo(Atomics) { Atomics(); }",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "function foo() { if (bar) { let Atomics; if (baz) { new Atomics(); } } }",
        languageOptions: { ecmaVersion: 2017 },
    },
    { text: "function foo() { var JSON; JSON(); }" },
    {
        text: "function foo() { var Atomics = bar(); var baz = Atomics(5); }",
        languageOptions: { globals: { Atomics: false } },
    },
    {
        text: 'var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined; construct();',
        languageOptions: { globals: { Reflect: false } },
    },
    {
        text: "function foo(Intl) { Intl(); }",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "if (foo) { const Intl = 1; Intl(); }",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "if (foo) { const Intl = 1; new Intl(); }",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "function foo(Temporal) { Temporal(); }",
        languageOptions: { globals: { Temporal: false } },
    },
    {
        text: "if (foo) { const Temporal = 1; Temporal(); }",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "if (foo) { const Temporal = 1; new Temporal(); }",
        languageOptions: { ecmaVersion: 2026 },
    },
];
const invalid = [
    {
        text: "Math();",
    },
    {
        text: "var x = Math();",
    },
    {
        text: "f(Math());",
    },
    {
        text: "Math().foo;",
    },
    {
        text: "new Math;",
    },
    {
        text: "new Math();",
    },
    {
        text: "new Math(foo);",
    },
    {
        text: "new Math().foo;",
    },
    {
        text: "(new Math).foo();",
    },
    {
        text: "var x = JSON();",
    },
    {
        text: "x = JSON(str);",
    },
    {
        text: "var x = new JSON();",
    },
    {
        text: "Math( JSON() );",
    },
    {
        text: "var x = Reflect();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = new Reflect();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = Reflect();",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "/*globals Reflect: true*/ Reflect();",
    },
    {
        text: "/*globals Reflect: true*/ new Reflect();",
    },
    {
        text: "var x = Atomics();",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "var x = new Atomics();",
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        text: "var x = Atomics();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = Atomics();",
        languageOptions: { globals: { Atomics: false } },
    },
    {
        text: "var x = new Atomics();",
        languageOptions: { globals: { Atomics: "writable" } },
    },
    {
        text: "var x = Intl();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "var x = new Intl();",
        languageOptions: { ecmaVersion: 2015 },
    },
    {
        text: "/*globals Intl: true*/ Intl();",
    },
    {
        text: "/*globals Intl: true*/ new Intl();",
    },
    {
        text: "Temporal();",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "new Temporal();",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "/* global Temporal */ Temporal();",
        languageOptions: { ecmaVersion: 2025 },
    },
    {
        text: "/* global Temporal */ new Temporal();",
        languageOptions: { ecmaVersion: 2025 },
    },
    {
        text: "const x = globalThis.Temporal();",
        languageOptions: {
            ecmaVersion: 2020,
            globals: { Temporal: false },
        },
    },
    {
        text: "const x = new globalThis.Temporal;",
        languageOptions: {
            ecmaVersion: 2020,
            globals: { Temporal: false },
        },
    },
    {
        text: "var x = globalThis.Math();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = new globalThis.Math();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "f(globalThis.Math());",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "globalThis.Math().foo;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "new globalThis.Math().foo;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = globalThis.JSON();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "x = globalThis.JSON(str);",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "globalThis.Math( globalThis.JSON() );",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = globalThis.Reflect();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = new globalThis.Reflect;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "/*globals Reflect: true*/ Reflect();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = globalThis.Atomics();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = globalThis.Intl();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = new globalThis.Intl;",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "/*globals Intl: true*/ Intl();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var foo = bar ? baz: JSON; foo();",
    },
    {
        text: "var foo = bar ? baz: JSON; new foo();",
    },
    {
        text: "const foo = Temporal; foo();",
        languageOptions: {
            ecmaVersion: 2015,
            globals: { Temporal: false },
        },
    },
    {
        text: "const foo = Temporal; new foo();",
        languageOptions: {
            ecmaVersion: 2015,
            globals: { Temporal: false },
        },
    },
    {
        text: "var foo = bar ? baz: globalThis.JSON; foo();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var foo = bar ? baz: globalThis.JSON; new foo();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "const foo = bar ? baz: globalThis.Temporal; foo();",
        languageOptions: {
            ecmaVersion: 2020,
            globals: { Temporal: false },
        },
    },
    {
        text: "const foo = bar ? baz: globalThis.Temporal; new foo();",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "var foo = window.Atomics; foo();",
        languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    },
    {
        text: "var foo = window.Atomics; new foo;",
        languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    },
    {
        text: "var foo = window.Intl; foo();",
        languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    },
    {
        text: "var foo = window.Intl; new foo;",
        languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    },
    {
        text: "const foo = window.Temporal; foo();",
        languageOptions: { ecmaVersion: 2026, globals: globals.browser },
    },
    {
        text: "const foo = window.Temporal; new foo();",
        languageOptions: { ecmaVersion: 2026, globals: globals.browser },
    },

    // Optional chaining
    {
        text: "var x = globalThis?.Reflect();",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        text: "var x = (globalThis?.Reflect)();",
        languageOptions: { ecmaVersion: 2020 },
    },
];

describe("no-obj-calls", ({ describe }) => {

    const globalRules = { "no-obj-calls": ["error"] };
    const defaultLanguageOptions = { ecmaVersion: 5, sourceType: "script" };

    function getLanguageOptions(languageOptions) {
        return {
            ...defaultLanguageOptions,
            ...languageOptions,
            globals: {
                ...(defaultLanguageOptions.globals ?? {}),
                ...(languageOptions?.globals ?? {}),
            },
            parserOptions: {
                ...(defaultLanguageOptions.parserOptions ?? {}),
                ...(languageOptions?.parserOptions ?? {}),
            },
        };
    }

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-obj-calls"] = rules["no-obj-calls"].concat(options);
                }

                const res = lintText(file, rules, getLanguageOptions(languageOptions));

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
                    rules["no-obj-calls"] = rules["no-obj-calls"].concat(options);
                }

                const res = lintText(file, rules, getLanguageOptions(languageOptions));

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-obj-calls", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
