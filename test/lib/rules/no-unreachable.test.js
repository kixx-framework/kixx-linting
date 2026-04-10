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
    { text: "function foo() { function bar() { return 1; } return bar(); }" },
    { text: "function foo() { return bar(); function bar() { return 1; } }" },
    { text: "function foo() { return x; var x; }" },
    { text: "function foo() { var x = 1; var y = 2; }" },
    { text: "function foo() { var x = 1; var y = 2; return; }" },
    { text: "while (true) { switch (foo) { case 1: x = 1; x = 2;} }" },
    { text: "while (true) { break; var x; }" },
    { text: "while (true) { continue; var x, y; }" },
    { text: "while (true) { throw 'message'; var x; }" },
    { text: "while (true) { if (true) break; var x = 1; }" },
    { text: "while (true) continue;" },
    { text: "switch (foo) { case 1: break; var x; }" },
    { text: "switch (foo) { case 1: break; var x; default: throw true; };" },
    {
        text: "const arrow_direction = arrow => {  switch (arrow) { default: throw new Error();  };}",
        languageOptions: {
            ecmaVersion: 6,
        },
    },
    { text: "var x = 1; y = 2; throw 'uh oh'; var y;" },
    { text: "function foo() { var x = 1; if (x) { return; } x = 2; }" },
    { text: "function foo() { var x = 1; if (x) { } else { return; } x = 2; }" },
    { text: "function foo() { var x = 1; switch (x) { case 0: break; default: return; } x = 2; }" },
    { text: "function foo() { var x = 1; while (x) { return; } x = 2; }" },
    { text: "function foo() { var x = 1; for (x in {}) { return; } x = 2; }" },
    { text: "function foo() { var x = 1; try { return; } finally { x = 2; } }" },
    { text: "function foo() { var x = 1; for (;;) { if (x) break; } x = 2; }" },
    { text: "A: { break A; } foo()" },
    {
        text: "function* foo() { try { yield 1; return; } catch (err) { return err; } }",
        languageOptions: {
            ecmaVersion: 6,
        },
    },
    {
        text: "function foo() { try { bar(); return; } catch (err) { return err; } }",
        languageOptions: {
            ecmaVersion: 6,
        },
    },
    {
        text: "function foo() { try { a.b.c = 1; return; } catch (err) { return err; } }",
        languageOptions: {
            ecmaVersion: 6,
        },
    },
    {
        text: "class C { foo = reachable; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C { foo = reachable; constructor() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends B { foo = reachable; }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends B { foo = reachable; constructor() { super(); } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends B { static foo = reachable; constructor() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
];

const invalid = [
    {
        text: "function foo() { return x; var x = 1; }",
    },
    {
        text: "function foo() { return x; var x, y = 1; }",
    },
    {
        text: "while (true) { continue; var x = 1; }",
    },
    {
        text: "function foo() { return; x = 1; }",
    },
    {
        text: "function foo() { throw error; x = 1; }",
    },
    {
        text: "while (true) { break; x = 1; }",
    },
    {
        text: "while (true) { continue; x = 1; }",
    },
    {
        text: "function foo() { switch (foo) { case 1: return; x = 1; } }",
    },
    {
        text: "function foo() { switch (foo) { case 1: throw e; x = 1; } }",
    },
    {
        text: "while (true) { switch (foo) { case 1: break; x = 1; } }",
    },
    {
        text: "while (true) { switch (foo) { case 1: continue; x = 1; } }",
    },
    {
        text: "var x = 1; throw 'uh oh'; var y = 2;",
    },
    {
        text: "function foo() { var x = 1; if (x) { return; } else { throw e; } x = 2; }",
    },
    {
        text: "function foo() { var x = 1; if (x) return; else throw -1; x = 2; }",
    },
    {
        text: "function foo() { var x = 1; try { return; } finally {} x = 2; }",
    },
    {
        text: "function foo() { var x = 1; try { } finally { return; } x = 2; }",
    },
    {
        text: "function foo() { var x = 1; do { return; } while (x); x = 2; }",
    },
    {
        text: "function foo() { var x = 1; while (x) { if (x) break; else continue; x = 2; } }",
    },
    {
        text: "function foo() { var x = 1; for (;;) { if (x) continue; } x = 2; }",
    },
    {
        text: "function foo() { var x = 1; while (true) { } x = 2; }",
    },
    {
        text: "const arrow_direction = arrow => {  switch (arrow) { default: throw new Error();  }; g() }",
        languageOptions: { ecmaVersion: 6 },
    },

    // Merge the warnings of continuous unreachable nodes.
    {
        text: `
                function foo() {
                    return;

                    a();  // ← ERROR: Unreachable code. (no-unreachable)

                    b()   // ↑ ';' token is included in the unreachable code, so this statement will be merged.
                    // comment
                    c();  // ↑ ')' token is included in the unreachable code, so this statement will be merged.
                }
            `,
    },
    {
        text: `
                function foo() {
                    return;

                    a();

                    if (b()) {
                        c()
                    } else {
                        d()
                    }
                }
            `,
    },
    {
        text: `
                function foo() {
                    if (a) {
                        return
                        b();
                        c();
                    } else {
                        throw err
                        d();
                    }
                }
            `,
        errors: 2,
    },
    {
        text: `
                function foo() {
                    if (a) {
                        return
                        b();
                        c();
                    } else {
                        throw err
                        d();
                    }
                    e();
                }
            `,
        errors: 3,
    },
    {
        text: `
                function* foo() {
                    try {
                        return;
                    } catch (err) {
                        return err;
                    }
                }`,
        languageOptions: {
            ecmaVersion: 6,
        },
    },
    {
        text: `
                function foo() {
                    try {
                        return;
                    } catch (err) {
                        return err;
                    }
                }`,
        languageOptions: {
            ecmaVersion: 6,
        },
    },
    {
        text: `
                function foo() {
                    try {
                        return;
                        let a = 1;
                    } catch (err) {
                        return err;
                    }
                }`,
        languageOptions: {
            ecmaVersion: 6,
        },
        errors: 2,
    },

    /*
		 * If `extends` exists, constructor exists, and the constructor doesn't
		 * contain `super()`, then the fields are unreachable because the
		 * evaluation of `super()` initializes fields in that case.
		 * In most cases, such an instantiation throws runtime errors, but
		 * doesn't throw if the constructor returns a value.
		 */
    {
        text: "class C extends B { foo; constructor() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends B { foo = unreachable + code; constructor() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends B { foo; bar; constructor() {} }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class C extends B { foo; constructor() {} bar; }",
        languageOptions: { ecmaVersion: 2022 },
        errors: 2,
    },
    {
        text: "(class extends B { foo; constructor() {} bar; })",
        languageOptions: { ecmaVersion: 2022 },
        errors: 2,
    },
    {
        text: "class B extends A { x; constructor() { class C extends D { [super().x]; constructor() {} } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class B extends A { x; constructor() { class C extends super().x { y; constructor() {} } } }",
        languageOptions: { ecmaVersion: 2022 },
    },
    {
        text: "class B extends A { x; static y; z; static q; constructor() {} }",
        languageOptions: { ecmaVersion: 2022 },
        errors: 2,
    },
];

describe("no-unreachable", ({ describe }) => {

    const globalRules = { "no-unreachable": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unreachable"] = rules["no-unreachable"].concat(options);
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
                    rules["no-unreachable"] = rules["no-unreachable"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-unreachable", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
