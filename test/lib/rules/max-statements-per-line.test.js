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
    { text: "{ }", options: [{ max: 1 }] },
    { text: "var bar = 1;" },
    { text: "var bar = 1;", options: [{ max: 1 }] },
    { text: "var bar = 1;;" },
    { text: ";(function foo() {\n})()" },
    { text: "if (condition) var bar = 1;", options: [{ max: 1 }] },
    { text: "if (condition) { }", options: [{ max: 1 }] },
    { text: "if (condition) { } else { }", options: [{ max: 1 }] },
    {
        text: "if (condition) {\nvar bar = 1;\n} else {\nvar bar = 1;\n}",
        options: [{ max: 1 }],
    },
    { text: "for (var i = 0; i < length; ++i) { }", options: [{ max: 1 }] },
    {
        text: "for (var i = 0; i < length; ++i) {\nvar bar  = 1;\n}",
        options: [{ max: 1 }],
    },
    { text: "switch (discriminant) { default: }", options: [{ max: 1 }] },
    {
        text: "switch (discriminant) {\ndefault: break;\n}",
        options: [{ max: 1 }],
    },
    { text: "function foo() { }", options: [{ max: 1 }] },
    {
        text: "function foo() {\nif (condition) var bar = 1;\n}",
        options: [{ max: 1 }],
    },
    {
        text: "function foo() {\nif (condition) {\nvar bar = 1;\n}\n}",
        options: [{ max: 1 }],
    },
    { text: "(function() { })();", options: [{ max: 1 }] },
    { text: "(function() {\nvar bar = 1;\n})();", options: [{ max: 1 }] },
    { text: "var foo = function foo() { };", options: [{ max: 1 }] },
    {
        text: "var foo = function foo() {\nvar bar = 1;\n};",
        options: [{ max: 1 }],
    },
    {
        text: "var foo = { prop: () => { } };",
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6 }
    { text: "var bar = 1; var baz = 2;", options: [{ max: 2 }] },
    { text: "if (condition) { var bar = 1; }", options: [{ max: 2 }] },
    {
        text: "if (condition) {\nvar bar = 1; var baz = 2;\n} else {\nvar bar = 1; var baz = 2;\n}",
        options: [{ max: 2 }],
    },
    {
        text: "for (var i = 0; i < length; ++i) { var bar = 1; }",
        options: [{ max: 2 }],
    },
    {
        text: "for (var i = 0; i < length; ++i) {\nvar bar = 1; var baz = 2;\n}",
        options: [{ max: 2 }],
    },
    {
        text: "switch (discriminant) { default: break; }",
        options: [{ max: 2 }],
    },
    {
        text: "switch (discriminant) {\ncase 'test': var bar = 1; break;\ndefault: var bar = 1; break;\n}",
        options: [{ max: 2 }],
    },
    { text: "function foo() { var bar = 1; }", options: [{ max: 2 }] },
    {
        text: "function foo() {\nvar bar = 1; var baz = 2;\n}",
        options: [{ max: 2 }],
    },
    {
        text: "function foo() {\nif (condition) { var bar = 1; }\n}",
        options: [{ max: 2 }],
    },
    {
        text: "function foo() {\nif (condition) {\nvar bar = 1; var baz = 2;\n}\n}",
        options: [{ max: 2 }],
    },
    { text: "(function() { var bar = 1; })();", options: [{ max: 2 }] },
    {
        text: "(function() {\nvar bar = 1; var baz = 2;\n})();",
        options: [{ max: 2 }],
    },
    {
        text: "var foo = function foo() { var bar = 1; };",
        options: [{ max: 2 }],
    },
    {
        text: "var foo = function foo() {\nvar bar = 1; var baz = 2;\n};",
        options: [{ max: 2 }],
    },
    {
        text: "var foo = { prop: () => { var bar = 1; } };",
        options: [{ max: 2 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "var bar = 1; var baz = 2; var qux = 3;",
        options: [{ max: 3 }],
    },
    {
        text: "if (condition) { var bar = 1; var baz = 2; }",
        options: [{ max: 3 }],
    },
    {
        text: "if (condition) { var bar = 1; } else { var bar = 1; }",
        options: [{ max: 3 }],
    },
    {
        text: "switch (discriminant) { case 'test1': ; case 'test2': ; }",
        options: [{ max: 3 }],
    },
    {
        text: "let bar = bar => { a; }, baz = baz => { b; };",
        options: [{ max: 3 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "function foo({[bar => { a; }]: baz = qux => { b; }}) { }",
        options: [{ max: 3 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "bar => { a; }, baz => { b; }, qux => { c; };",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "[bar => { a; }, baz => { b; }, qux => { c; }];",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "foo(bar => { a; }, baz => { c; }, qux => { c; });",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "({ bar: bar => { a; }, baz: baz => { c; }, qux: qux => { ; }});",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "(bar => { a; }) ? (baz => { b; }) : (qux => { c; });",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: [
            "const name = 'ESLint'",
            "",
            ";(function foo() {",
            "})()",
        ].join("\n"),
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6 }
    { text: ["if (foo > 1)", "    foo--;", "else", "    foo++;"].join("\n") },
    {
        text: "export default foo = 0;",
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    {
        text: [
            "export default function foo() {",
            "   console.log('test');",
            "}",
        ].join("\n"),
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    {
        text: "export let foo = 0;",
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    {
        text: [
            "export function foo() {",
            "   console.log('test');",
            "}",
        ].join("\n"),
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
];

const invalid = [
    { text: "var foo; var bar;", options: [{ max: 1 }] },
    { text: "var bar = 1; var foo = 3;", options: [{ max: 1 }] },
    { text: "var bar = 1; var baz = 2;" },
    { text: "var bar = 1; var baz = 2;", options: [{ max: 1 }] },
    {
        text: "if (condition) var bar = 1; if (condition) var baz = 2;",
        options: [{ max: 1 }],
    },
    {
        text: "if (condition) var bar = 1; else var baz = 1;",
        options: [{ max: 1 }],
    },
    { text: "if (condition) { } if (condition) { }", options: [{ max: 1 }] },
    {
        text: "if (condition) { var bar = 1; } else { }",
        options: [{ max: 1 }],
    },
    {
        text: "if (condition) { } else { var bar = 1; }",
        options: [{ max: 1 }],
    },
    {
        text: "if (condition) { var bar = 1; } else { var bar = 1; }",
        options: [{ max: 1 }],
    },
    {
        text: "for (var i = 0; i < length; ++i) { var bar = 1; }",
        options: [{ max: 1 }],
    },
    {
        text: "switch (discriminant) { default: break; }",
        options: [{ max: 1 }],
    },
    { text: "function foo() { var bar = 1; }", options: [{ max: 1 }] },
    {
        text: "function foo() { if (condition) var bar = 1; }",
        options: [{ max: 1 }],
    },
    {
        text: "function foo() { if (condition) { var bar = 1; } }",
        options: [{ max: 1 }],
    },
    { text: "(function() { var bar = 1; })();", options: [{ max: 1 }] },
    {
        text: "var foo = function foo() { var bar = 1; };",
        options: [{ max: 1 }],
    },
    {
        text: "var foo = { prop: () => { var bar = 1; } };",
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "var bar = 1; var baz = 2; var qux = 3;",
        options: [{ max: 2 }],
    },
    {
        text: "if (condition) { var bar = 1; var baz = 2; }",
        options: [{ max: 2 }],
    },
    {
        text: "if (condition) { var bar = 1; } else { var bar = 1; }",
        options: [{ max: 2 }],
    },
    {
        text: "if (condition) { var bar = 1; var baz = 2; } else { var bar = 1; var baz = 2; }",
        options: [{ max: 2 }],
    },
    {
        text: "for (var i = 0; i < length; ++i) { var bar = 1; var baz = 2; }",
        options: [{ max: 2 }],
    },
    {
        text: "switch (discriminant) { case 'test': break; default: break; }",
        options: [{ max: 2 }],
    },
    {
        text: "function foo() { var bar = 1; var baz = 2; }",
        options: [{ max: 2 }],
    },
    {
        text: "function foo() { if (condition) { var bar = 1; } }",
        options: [{ max: 2 }],
    },
    {
        text: "(function() { var bar = 1; var baz = 2; })();",
        options: [{ max: 2 }],
    },
    {
        text: "var foo = function foo() { var bar = 1; var baz = 2; };",
        options: [{ max: 2 }],
    },
    {
        text: "var foo = { prop: () => { var bar = 1; var baz = 2; } };",
        options: [{ max: 2 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "var bar = 1; var baz = 2; var qux = 3; var waldo = 4;",
        options: [{ max: 3 }],
    },
    {
        text: "if (condition) { var bar = 1; var baz = 2; var qux = 3; }",
        options: [{ max: 3 }],
    },
    {
        text: "if (condition) { var bar = 1; var baz = 2; } else { var bar = 1; var baz = 2; }",
        options: [{ max: 3 }],
    },
    {
        text: "switch (discriminant) { case 'test': var bar = 1; break; default: var bar = 1; break; }",
        options: [{ max: 3 }],
    },
    {
        text: "let bar = bar => { a; }, baz = baz => { b; }, qux = qux => { c; };",
        options: [{ max: 3 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "(bar => { a; }) ? (baz => { b; }) : (qux => { c; });",
        options: [{ max: 3 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "bar => { a; }, baz => { b; }, qux => { c; }, quux => { d; };",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "[bar => { a; }, baz => { b; }, qux => { c; }, quux => { d; }];",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "foo(bar => { a; }, baz => { b; }, qux => { c; }, quux => { d; });",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "({ bar: bar => { a; }, baz: baz => { b; }, qux: qux => { c; }, quux: quux => { d; }});",
        options: [{ max: 4 }],
    }, // languageOptions: { ecmaVersion: 6 }
    {
        text: "a; if (b) { c; d; }\nz;",
        options: [{ max: 2 }],
    },
    {
        text: "export default function foo() { console.log('test') }",
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    {
        text: "export function foo() { console.log('test') }",
        options: [{ max: 1 }],
    }, // languageOptions: { ecmaVersion: 6, sourceType: "module" }
];


describe("max-statements-per-line", ({ describe }) => {

    const globalRules = { "max-statements-per-line": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["max-statements-per-line"] = rules["max-statements-per-line"].concat(options);
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
            invalid.forEach(({ text, options, errors = 1 }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["max-statements-per-line"] = rules["max-statements-per-line"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [message] = res.messages;

                assertEqual("max-statements-per-line", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
