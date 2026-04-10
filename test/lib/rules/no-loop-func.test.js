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
    { text: "string = 'function a() {}';" },
    { text: "for (var i=0; i<l; i++) { } var a = function() { i; };" },
    { text: "for (var i=0, a=function() { i; }; i<l; i++) { }" },
    { text: "for (var x in xs.filter(function(x) { return x != upper; })) { }" },
    {
        text: "for (var x of xs.filter(function(x) { return x != upper; })) { }",
        languageOptions: { ecmaVersion: 6 },
    },

    // no refers to variables that declared on upper scope.
    { text: "for (var i=0; i<l; i++) { (function() {}) }" },
    { text: "for (var i in {}) { (function() {}) }" },
    {
        text: "for (var i of {}) { (function() {}) }",
        languageOptions: { ecmaVersion: 6 },
    },

    // functions which are using unmodified variables are OK.
    {
        text: "for (let i=0; i<l; i++) { (function() { i; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (let i in {}) { i = 7; (function() { i; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (const i of {}) { (function() { i; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (using i of foo) { (function() { i; }) }",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "for (await using i of foo) { (function() { i; }) }",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "for (var i = 0; i < 10; ++i) { using foo = bar(i); (function() { foo; }) }",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "for (var i = 0; i < 10; ++i) { await using foo = bar(i); (function() { foo; }) }",
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: "for (let i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != i)) {  } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a = 0; for (let i=0; i<l; i++) { (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a = 0; for (let i in {}) { (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a = 0; for (let i of {}) { (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a = 0; for (let i=0; i<l; i++) { (function() { (function() { a; }); }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a = 0; for (let i in {}) { function foo() { (function() { a; }); } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a = 0; for (let i of {}) { (() => { (function() { a; }); }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var a = 0; for (let i=0; i<l; i++) { (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var a = 0; for (let i in {}) { (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var a = 0; for (let i of {}) { (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: [
            "let result = {};",
            "for (const score in scores) {",
            "  const letters = scores[score];",
            "  letters.split('').forEach(letter => {",
            "    result[letter] = score;",
            "  });",
            "}",
            "result.__default = 6;",
        ].join("\n"),
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: [
            "while (true) {",
            "    (function() { a; });",
            "}",
            "let a;",
        ].join("\n"),
        languageOptions: { ecmaVersion: 6 },
    },

    /*
		 * These loops _look_ like they might be unsafe, but because i is undeclared, they're fine
		 * at least as far as this rule is concerned - the loop doesn't declare/generate the variable.
		 */
    { text: "while(i) { (function() { i; }) }" },
    { text: "do { (function() { i; }) } while (i)" },

    /**
		 * These loops _look_ like they might be unsafe, but because i is declared outside the loop
		 * and is not updated in or after the loop, they're fine as far as this rule is concerned.
		 * The variable that's captured is just the one variable shared by all the loops, but that's
		 * explicitly expected in these cases.
		 */
    { text: "var i; while(i) { (function() { i; }) }" },
    { text: "var i; do { (function() { i; }) } while (i)" },

    /**
		 * These loops use an undeclared variable, and so shouldn't be flagged by this rule,
		 * they'll be picked up by no-undef.
		 */
    {
        text: "for (var i=0; i<l; i++) { (function() { undeclared; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (let i=0; i<l; i++) { (function() { undeclared; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var i in {}) { i = 7; (function() { undeclared; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (let i in {}) { i = 7; (function() { undeclared; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (const i of {}) { (function() { undeclared; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (let i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != undeclared)) {  } }",
        languageOptions: { ecmaVersion: 6 },
    },

    // IIFE
    {
        text: `
            let current = getStart();
            while (current) {
            (() => {
                current;
                current.a;
                current.b;
                current.c;
                current.d;
            })();

            current = current.upper;
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    { text: "for (var i=0; (function() { i; })(), i<l; i++) { }" },
    { text: "for (var i=0; i<l; (function() { i; })(), i++) { }" },
    {
        text: "for (var i = 0; i < 10; ++i) { (()=>{ i;})() }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var i = 0; i < 10; ++i) { (function a(){i;})() }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((f => f)((() => i)()));
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((() => {
                    return (() => i)();
                })());
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            const foo = bar;

            for (var i = 0; i < 5; i++) {
                arr.push(() => foo);
            }

			foo = baz; // This is a runtime error, but not concern of this rule. For this rule, variable 'foo' is constant.
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            using foo = bar;

            for (var i = 0; i < 5; i++) {
                arr.push(() => foo);
            }

			foo = baz; // This is a runtime error, but not concern of this rule. For this rule, variable 'foo' is constant.
            `,
        languageOptions: { ecmaVersion: 2026 },
    },
    {
        text: `
            await using foo = bar;

            for (var i = 0; i < 5; i++) {
                arr.push(() => foo);
            }

			foo = baz; // This is a runtime error, but not concern of this rule. For this rule, variable 'foo' is constant.
            `,
        languageOptions: { ecmaVersion: 2026 },
    },
];

const invalid = [
    {
        text: "for (var i=0; i<l; i++) { (function() { i; }) }",
    },
    {
        text: "for (var i=0; i<l; i++) { for (var j=0; j<m; j++) { (function() { i+j; }) } }",
    },
    {
        text: "for (var i in {}) { (function() { i; }) }",
    },
    {
        text: "for (var i of {}) { (function() { i; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var i=0; i < l; i++) { (() => { i; }) }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var i=0; i < l; i++) { var a = function() { i; } }",
    },
    {
        text: "for (var i=0; i < l; i++) { function a() { i; }; a(); }",
    },

    // Warns functions which are using modified variables.
    {
        text: "let a; for (let i=0; i<l; i++) { a = 1; (function() { a; });}",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; for (let i in {}) { (function() { a; }); a = 1; }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; for (let i of {}) { (function() { a; }); } a = 1; ",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; for (let i=0; i<l; i++) { (function() { (function() { a; }); }); a = 1; }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; for (let i in {}) { a = 1; function foo() { (function() { a; }); } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; for (let i of {}) { (() => { (function() { a; }); }); } a = 1;",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != i)) {  } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (let x of xs) { let a; for (let y of ys) { a = 1; (function() { a; }); } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var x of xs) { for (let y of ys) { (function() { x; }); } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "for (var x of xs) { (function() { x; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var a; for (let x of xs) { a = 1; (function() { a; }); }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var a; for (let x of xs) { (function() { a; }); a = 1; }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; function foo() { a = 10; } for (let x of xs) { (function() { a; }); } foo();",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; function foo() { a = 10; for (let x of xs) { (function() { a; }); } } foo();",
        languageOptions: { ecmaVersion: 6 },
    },

    // IIFE
    {
        text: "let a; for (var i=0; i<l; i++) { (function* (){i;})() }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "let a; for (var i=0; i<l; i++) { (async function (){i;})() }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            let current = getStart();
            const arr = [];
            while (current) {
                (function f() {
                    current;
                    arr.push(f);
                })();

                current = current.upper;
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                (function fun () {
                    if (arr.includes(fun)) return i;
                    else arr.push(fun);
                })();
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            let current = getStart();
            const arr = [];
            while (current) {
                const p = (async () => {
                    await someDelay();
                    current;
                })();

                arr.push(p);
                current = current.upper;
            }
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((f => f)(
                    () => i
                ));
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((() => {
                    return () => i;
                })());
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((() => {
                    return () => { return i };
                })());
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((() => {
                    return () => {
                        return () => i
                    };
                })());
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i++) {
                arr.push((() => {
                    return () =>
                        (() => i)();
                })());
            }
            `,
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i ++) {
                (() => {
                    arr.push((async () => {
                        await 1;
                        return i;
                    })());
                })();
            }
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i ++) {
                (() => {
                    (function f() {
                        if (!arr.includes(f)) {
                            arr.push(f);
                        }
                        return i;
                    })();
                })();

            }
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            var arr1 = [], arr2 = [];

            for (var [i, j] of ["a", "b", "c"].entries()) {
                (() => {
                    arr1.push((() => i)());
                    arr2.push(() => j);
                })();
            }
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            var arr = [];

            for (var i = 0; i < 5; i ++) {
                ((f) => {
                    arr.push(f);
                })(() => {
                    return (() => i)();
                });

            }
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            for (var i = 0; i < 5; i++) {
                (async () => {
                    () => i;
                })();
            }
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: `
            for (var i = 0; i < 10; i++) {
				items.push({
					id: i,
					name: "Item " + i
				});

				const process = function (callback){
					callback({ id: i, name: "Item " + i });
				};
			}
            `,
        languageOptions: { ecmaVersion: 2022 },
    },
];

describe("no-loop-func", ({ describe }) => {

    const globalRules = { "no-loop-func": ["error"] };
    const normalizeLanguageOptions = (languageOptions) => ({
        ecmaVersion: 2024,
        ...(languageOptions || {}),
    });

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-loop-func"] = rules["no-loop-func"].concat(options);
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
                    rules["no-loop-func"] = rules["no-loop-func"].concat(options);
                }

                const res = lintText(file, rules, normalizeLanguageOptions(languageOptions));

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-loop-func", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
