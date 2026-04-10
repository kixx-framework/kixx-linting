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
    // default ("never")
    { text: "f();" },
    { text: "f(a, b);" },
    { text: "f.b();", options: ["never"] },
    { text: "f.b().c();", options: ["never"] },
    { text: "f()()", options: ["never"] },
    { text: "(function() {}())", options: ["never"] },
    { text: "var f = new Foo()", options: ["never"] },
    { text: "var f = new Foo", options: ["never"] },
    { text: "f( (0) )", options: ["never"] },
    { text: "( f )( 0 )", options: ["never"] },
    { text: "( (f) )( (0) )", options: ["never"] },
    { text: "( f()() )(0)", options: ["never"] },
    { text: "(function(){ if (foo) { bar(); } }());", options: ["never"] },
    { text: "f(0, (1))", options: ["never"] },
    { text: "describe/**/('foo', function () {});", options: ["never"] },
    { text: "new (foo())", options: ["never"] },
    { text: "import(source)" }, // languageOptions: { ecmaVersion: 2020 }

    // "never"
    { text: "f();", options: ["never"] },
    { text: "f(a, b);", options: ["never"] },
    { text: "f.b();", options: ["never"] },
    { text: "f.b().c();", options: ["never"] },
    { text: "f()()", options: ["never"] },
    { text: "(function() {}())", options: ["never"] },
    { text: "var f = new Foo()", options: ["never"] },
    { text: "var f = new Foo", options: ["never"] },
    { text: "f( (0) )", options: ["never"] },
    { text: "( f )( 0 )", options: ["never"] },
    { text: "( (f) )( (0) )", options: ["never"] },
    { text: "( f()() )(0)", options: ["never"] },
    { text: "(function(){ if (foo) { bar(); } }());", options: ["never"] },
    { text: "f(0, (1))", options: ["never"] },
    { text: "describe/**/('foo', function () {});", options: ["never"] },
    { text: "new (foo())", options: ["never"] },
    { text: "import(source)", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }

    // "always"
    { text: "f ();", options: ["always"] },
    { text: "f (a, b);", options: ["always"] },
    { text: "f.b ();", options: ["always"] },
    { text: "f.b ().c ();", options: ["always"] },
    { text: "f () ()", options: ["always"] },
    { text: "(function() {} ())", options: ["always"] },
    { text: "var f = new Foo ()", options: ["always"] },
    { text: "var f = new Foo", options: ["always"] },
    { text: "f ( (0) )", options: ["always"] },
    { text: "f (0) (1)", options: ["always"] },
    { text: "(f) (0)", options: ["always"] },
    { text: "f ();\n t   ();", options: ["always"] },
    { text: "import (source)", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }

    // "always", "allowNewlines": true
    { text: "f\n();", options: ["always", { allowNewlines: true }] },
    { text: "f.b \n ();", options: ["always", { allowNewlines: true }] },
    { text: "f\n() ().b \n()\n ()", options: ["always", { allowNewlines: true }] },
    { text: "var f = new Foo\n();", options: ["always", { allowNewlines: true }] },
    { text: "f// comment\n()", options: ["always", { allowNewlines: true }] },
    { text: "f // comment\n ()", options: ["always", { allowNewlines: true }] },
    { text: "f\n/*\n*/\n()", options: ["always", { allowNewlines: true }] },
    { text: "f\r();", options: ["always", { allowNewlines: true }] },
    { text: "f\u2028();", options: ["always", { allowNewlines: true }] },
    { text: "f\u2029();", options: ["always", { allowNewlines: true }] },
    { text: "f\r\n();", options: ["always", { allowNewlines: true }] },
    { text: "import\n(source)", options: ["always", { allowNewlines: true }] }, // languageOptions: { ecmaVersion: 2020 }

    // Optional chaining
    { text: "func?.()", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func ?.()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func?. ()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func ?. ()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
];

const invalid = [
    // default ("never")
    { text: "f ();" },
    { text: "f (a, b);" },
    { text: "f.b ();" },
    { text: "f.b().c ();" },
    { text: "f() ()" },
    { text: "(function() {} ())" },
    { text: "var f = new Foo ()" },
    { text: "f ( (0) )" },
    { text: "f(0) (1)" },
    { text: "(f) (0)" },
    { text: "f ();\n t   ();", errors: 2 },
    { text: "import (source);" }, // languageOptions: { ecmaVersion: 2020 }

    // https://github.com/eslint/eslint/issues/7787
    { text: "f\n();" },
    { text: "f\r();" },
    { text: "f\u2028();" },
    { text: "f\u2029();" },
    { text: "f\r\n();" },
    { text: "import\n(source);" }, // languageOptions: { ecmaVersion: 2020 }

    // "never"
    { text: "f ();", options: ["never"] },
    { text: "f (a, b);", options: ["never"] },
    { text: "f.b  ();", options: ["never"] },
    { text: "f.b().c ();", options: ["never"] },
    { text: "f() ()", options: ["never"] },
    { text: "(function() {} ())", options: ["never"] },
    { text: "var f = new Foo ()", options: ["never"] },
    { text: "f ( (0) )", options: ["never"] },
    { text: "f(0) (1)", options: ["never"] },
    { text: "(f) (0)", options: ["never"] },
    { text: "f ();\n t   ();", options: ["never"], errors: 2 },
    { text: "import (source);", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "f\n();", options: ["never"] },
    {
        text: [
            "this.cancelled.add(request)",
            "this.decrement(request)",
            "(0, request.reject)(new api.Cancel())",
        ].join("\n"),
        options: ["never"],
    },
    {
        text: ["var a = foo", "(function(global) {}(this));"].join("\n"),
        options: ["never"],
    },
    {
        text: ["var a = foo", "(0, baz())"].join("\n"),
        options: ["never"],
    },
    { text: "f\r();", options: ["never"] },
    { text: "f\u2028();", options: ["never"] },
    { text: "f\u2029();", options: ["never"] },
    { text: "f\r\n();", options: ["never"] },

    // "always"
    { text: "f();", options: ["always"] },
    { text: "f\n();", options: ["always"] },
    { text: "f(a, b);", options: ["always"] },
    { text: "f\n(a, b);", options: ["always"] },
    { text: "f.b();", options: ["always"] },
    { text: "f.b\n();", options: ["always"] },
    { text: "f.b().c ();", options: ["always"] },
    { text: "f.b\n().c ();", options: ["always"] },
    { text: "f() ()", options: ["always"] },
    { text: "f\n() ()", options: ["always"] },
    { text: "f\n()()", options: ["always"], errors: 2 },
    { text: "(function() {}())", options: ["always"] },
    { text: "var f = new Foo()", options: ["always"] },
    { text: "f( (0) )", options: ["always"] },
    { text: "f(0) (1)", options: ["always"] },
    { text: "(f)(0)", options: ["always"] },
    { text: "import(source);", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "f();\n t();", options: ["always"], errors: 2 },
    { text: "f\r();", options: ["always"] },
    { text: "f\u2028();", options: ["always"] },
    { text: "f\u2029();", options: ["always"] },
    { text: "f\r\n();", options: ["always"] },

    // "always", "allowNewlines": true
    { text: "f();", options: ["always", { allowNewlines: true }] },
    { text: "f(a, b);", options: ["always", { allowNewlines: true }] },
    { text: "f.b();", options: ["always", { allowNewlines: true }] },
    { text: "f.b().c ();", options: ["always", { allowNewlines: true }] },
    { text: "f() ()", options: ["always", { allowNewlines: true }] },
    { text: "(function() {}())", options: ["always", { allowNewlines: true }] },
    { text: "var f = new Foo()", options: ["always", { allowNewlines: true }] },
    { text: "f( (0) )", options: ["always", { allowNewlines: true }] },
    { text: "f(0) (1)", options: ["always", { allowNewlines: true }] },
    { text: "(f)(0)", options: ["always", { allowNewlines: true }] },
    { text: "f();\n t();", options: ["always", { allowNewlines: true }], errors: 2 },
    { text: "f    ();" },
    { text: "f\n ();" },
    { text: "fn();", options: ["always"] },
    { text: "fnn\n (a, b);", options: ["always"] },
    { text: "f /*comment*/ ()", options: ["never"] },
    { text: "f /*\n*/ ()", options: ["never"] },
    { text: "f/*comment*/()", options: ["always"] },

    // Optional chaining
    { text: "func ?.()", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func?. ()", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func ?. ()", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func\n?.()", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func\n//comment\n?.()", options: ["never"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func?.()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func\n  ?.()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func?.\n  ()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func  ?.\n  ()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
    { text: "func\n /*comment*/ ?.()", options: ["always"] }, // languageOptions: { ecmaVersion: 2020 }
];


describe("func-call-spacing", ({ describe }) => {

    const globalRules = { "func-call-spacing": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["func-call-spacing"] = rules["func-call-spacing"].concat(options);
                }

                const res = lintText(file, rules);

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
            invalid.forEach(({ text, options, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["func-call-spacing"] = rules["func-call-spacing"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [message] = res.messages;

                assertEqual("func-call-spacing", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
