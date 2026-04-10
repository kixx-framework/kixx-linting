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
    /*
		 * if the class has no extends or `extends null`, just ignore.
		 * those classes cannot call `super()`.
		 */
    { text: "class A { }" },
    { text: "class A { constructor() { } }" },
    { text: "class A { constructor() { this.b = 0; } }" },
    { text: "class A { constructor() { this.b(); } }" },
    { text: "class A extends null { }" },
    { text: "class A extends null { constructor() { } }" },

    // allows `this`/`super` after `super()`.
    { text: "class A extends B { }" },
    { text: "class A extends B { constructor() { super(); } }" },
    { text: "class A extends B { constructor() { super(); this.c = this.d; } }" },
    { text: "class A extends B { constructor() { super(); this.c(); } }" },
    { text: "class A extends B { constructor() { super(); super.c(); } }" },
    { text: "class A extends B { constructor() { if (true) { super(); } else { super(); } this.c(); } }" },
    { text: "class A extends B { constructor() { foo = super(); this.c(); } }" },
    { text: "class A extends B { constructor() { foo += super().a; this.c(); } }" },
    { text: "class A extends B { constructor() { foo |= super().a; this.c(); } }" },
    { text: "class A extends B { constructor() { foo &= super().a; this.c(); } }" },

    // allows `this`/`super` in nested executable scopes, even if before `super()`.
    { text: "class A extends B { constructor() { class B extends C { constructor() { super(); this.d = 0; } } super(); } }" },
    { text: "class A extends B { constructor() { var B = class extends C { constructor() { super(); this.d = 0; } }; super(); } }" },
    { text: "class A extends B { constructor() { function c() { this.d(); } super(); } }" },
    { text: "class A extends B { constructor() { var c = function c() { this.d(); }; super(); } }" },
    { text: "class A extends B { constructor() { var c = () => this.d(); super(); } }" },

    // ignores out of constructors.
    { text: "class A { b() { this.c = 0; } }" },
    { text: "class A extends B { c() { this.d = 0; } }" },
    { text: "function a() { this.b = 0; }" },

    // multi code path.
    { text: "class A extends B { constructor() { if (a) { super(); this.a(); } else { super(); this.b(); } } }" },
    { text: "class A extends B { constructor() { if (a) super(); else super(); this.a(); } }" },
    { text: "class A extends B { constructor() { try { super(); } finally {} this.a(); } }" },
    {
        text: `class A extends B {
            constructor() {
                while (foo) {
                    super();
                    this.a();
                }
            }
        }`,
    },
    {
        text: `class A extends B {
            constructor() {
                while (foo) {
                    if (init) {
                        super();
                        this.a();
                    }
                }
            }
        }`,
    },

    // https://github.com/eslint/eslint/issues/5261
    { text: "class A extends B { constructor(a) { super(); for (const b of a) { this.a(); } } }" },
    { text: "class A extends B { constructor(a) { for (const b of a) { foo(b); } super(); } }" },

    // https://github.com/eslint/eslint/issues/5319
    { text: "class A extends B { constructor(a) { super(); this.a = a && function(){} && this.foo; } }" },

    // https://github.com/eslint/eslint/issues/5394
    [
        "class A extends Object {",
        "    constructor() {",
        "        super();",
        "        for (let i = 0; i < 0; i++);",
        "        this;",
        "    }",
        "}",
    ].join("\n"),

    // https://github.com/eslint/eslint/issues/5894
    { text: "class A { constructor() { return; this; } }" },
    { text: "class A extends B { constructor() { return; this; } }" },

    // https://github.com/eslint/eslint/issues/8848
    {
        text: `
            class A extends B {
                constructor(props) {
                    super(props);

                    try {
                        let arr = [];
                        for (let a of arr) {
                        }
                    } catch (err) {
                    }
                }
            }
        `,
    },

    // Class field initializers are always evaluated after `super()`.
    { text: "class C { field = this.toString(); }" },
    { text: "class C extends B { field = this.foo(); }" },
    { text: "class C extends B { field = this.foo(); constructor() { super(); } }" },
    { text: "class C extends B { field = this.foo(); constructor() { } }" }, // < in this case, initializers are never evaluated.
];

const invalid = [
    // disallows all `this`/`super` if `super()` is missing.
    {
        text: "class A extends B { constructor() { this.c = 0; } }",
    },
    {
        text: "class A extends B { constructor() { this.c(); } }",
    },
    {
        text: "class A extends B { constructor() { super.c(); } }",
    },

    // disallows `this`/`super` before `super()`.
    {
        text: "class A extends B { constructor() { this.c = 0; super(); } }",
    },
    {
        text: "class A extends B { constructor() { this.c(); super(); } }",
    },
    {
        text: "class A extends B { constructor() { super.c(); super(); } }",
    },

    // disallows `this`/`super` in arguments of `super()`.
    {
        text: "class A extends B { constructor() { super(this.c); } }",
    },
    {
        text: "class A extends B { constructor() { super(this.c()); } }",
    },
    {
        text: "class A extends B { constructor() { super(super.c()); } }",
    },

    // even if is nested, reports correctly.
    {
        text: "class A extends B { constructor() { class C extends D { constructor() { super(); this.e(); } } this.f(); super(); } }",
    },
    {
        text: "class A extends B { constructor() { class C extends D { constructor() { this.e(); super(); } } super(); this.f(); } }",
    },

    // multi code path.
    {
        text: "class A extends B { constructor() { if (a) super(); this.a(); } }",
    },
    {
        text: "class A extends B { constructor() { try { super(); } finally { this.a; } } }",
    },
    {
        text: "class A extends B { constructor() { try { super(); } catch (err) { } this.a; } }",
    },
    {
        text: "class A extends B { constructor() { foo &&= super().a; this.c(); } }",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "class A extends B { constructor() { foo ||= super().a; this.c(); } }",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "class A extends B { constructor() { foo ??= super().a; this.c(); } }",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: `
            class A extends B {
                constructor() {
                    if (foo) {
                        if (bar) { }
                        super();
                    }
                    this.a();
                }
            }`,
    },
    {
        text: `
            class A extends B {
                constructor() {
                    if (foo) {
                    } else {
                      super();
                    }
                    this.a();
                }
            }`,
    },
    {
        text: `
            class A extends B {
                constructor() {
                    try {
                        call();
                    } finally {
                        this.a();
                    }
                }
            }`,
    },
    {
        text: `
            class A extends B {
                constructor() {
                    while (foo) {
                        super();
                    }
                    this.a();
                }
            }`,
    },
    {
        text: `
            class A extends B {
                constructor() {
                    while (foo) {
                        this.a();
                        super();
                    }
                }
            }`,
    },
    {
        text: `
            class A extends B {
                constructor() {
                    while (foo) {
                        if (init) {
                            this.a();
                            super();
                        }
                    }
                }
            }`,
    },
];

describe("no-this-before-super", ({ describe }) => {

    const globalRules = { "no-this-before-super": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach((entry, i) => {
                const testCase = typeof entry === "string" ? { text: entry } : entry;
                const { text, options, languageOptions } = testCase;
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-this-before-super"] = rules["no-this-before-super"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

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
                    rules["no-this-before-super"] = rules["no-this-before-super"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-this-before-super", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
