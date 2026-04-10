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
		{ text: "var foo = 0; while (foo) { ++foo; }" },
		{
			text: "let foo = 0; while (foo) { ++foo; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{ text: "var foo = 0; while (foo) { foo += 1; }" },
		{ text: "var foo = 0; while (foo++) { }" },
		{ text: "var foo = 0; while (foo = next()) { }" },
		{ text: "var foo = 0; while (ok(foo)) { }" },
		{ text: "var foo = 0, bar = 0; while (++foo < bar) { }" },
		{ text: "var foo = 0, obj = {}; while (foo === obj.bar) { }" },
		{ text: "var foo = 0, f = {}, bar = {}; while (foo === f(bar)) { }" },
		{ text: "var foo = 0, f = {}; while (foo === f()) { }" },
		{
			text: "var foo = 0, tag = 0; while (foo === tag`abc`) { }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			text: "function* foo() { var foo = 0; while (yield foo) { } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			text: "function* foo() { var foo = 0; while (foo === (yield)) { } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{ text: "var foo = 0; while (foo.ok) { }" },
		{ text: "var foo = 0; while (foo) { update(); } function update() { ++foo; }" },
		{ text: "var foo = 0, bar = 9; while (foo < bar) { foo += 1; }" },
		{ text: "var foo = 0, bar = 1, baz = 2; while (foo ? bar : baz) { foo += 1; }" },
		{ text: "var foo = 0, bar = 0; while (foo && bar) { ++foo; ++bar; }" },
		{ text: "var foo = 0, bar = 0; while (foo || bar) { ++foo; ++bar; }" },
		{ text: "var foo = 0; do { ++foo; } while (foo);" },
		{ text: "var foo = 0; do { } while (foo++);" },
		{ text: "for (var foo = 0; foo; ++foo) { }" },
		{ text: "for (var foo = 0; foo;) { ++foo }" },
		{ text: "var foo = 0, bar = 0; for (bar; foo;) { ++foo }" },
		{ text: "var foo; if (foo) { }" },
		{ text: "var a = [1, 2, 3]; var len = a.length; for (var i = 0; i < len - 1; i++) {}" },
];

const invalid = [
		{
			text: "var foo = 0; while (foo) { } foo = 1;",
		},
		{
			text: "var foo = 0; while (!foo) { } foo = 1;",
		},
		{
			text: "var foo = 0; while (foo != null) { } foo = 1;",
		},
		{
			text: "var foo = 0, bar = 9; while (foo < bar) { } foo = 1;",
		},
		{
			text: "var foo = 0, bar = 0; while (foo && bar) { ++bar; } foo = 1;",
		},
		{
			text: "var foo = 0, bar = 0; while (foo && bar) { ++foo; } foo = 1;",
		},
		{
			text: "var a, b, c; while (a < c && b < c) { ++a; } foo = 1;",
		},
		{
			text: "var foo = 0; while (foo ? 1 : 0) { } foo = 1;",
		},
		{
			text: "var foo = 0; while (foo) { update(); } function update(foo) { ++foo; }",
		},
		{
			text: "var foo; do { } while (foo);",
		},
		{
			text: "for (var foo = 0; foo < 10; ) { } foo = 1;",
		},
	];

describe("no-unmodified-loop-condition", ({ describe }) => {

    const globalRules = { "no-unmodified-loop-condition": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unmodified-loop-condition"] = rules["no-unmodified-loop-condition"].concat(options);
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
                    rules["no-unmodified-loop-condition"] = rules["no-unmodified-loop-condition"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-unmodified-loop-condition", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
