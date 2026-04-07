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


function unIndent(strings, ...values) {
    const text = strings
        .map((s, i) => (i === 0 ? s : values[i - 1] + s))
        .join("");
    const lines = text
        .replace(/^\n/u, "")
        .replace(/\n\s*$/u, "")
        .split("\n");
    const lineIndents = lines
        .filter(line => line.trim())
        .map(line => line.match(/ */u)[0].length);
    const minLineIndent = Math.min(...lineIndents);

    return lines.map(line => line.slice(minLineIndent)).join("\n");
}

const valid = [
    {
        text: unIndent`
            function test() {
              if (a) {
                b();
              }
            }
        `,
        options: [2],
    },
    {
        text: unIndent`
            if (a) {
              b();
            } else {
              c();
            }
        `,
        options: [2],
    },
    {
        text: unIndent`
            if (a)
              b();
        `,
        options: [2],
    },
    {
        text: unIndent`
            for (let i = 0; i < 3; i++)
              work(i);
        `,
        options: [2],
    },
    {
        text: unIndent`
            switch (value) {
              case 1:
                a();
                break;
              default:
                b();
            }
        `,
        options: [2, { SwitchCase: 1 }],
    },
    {
        text: unIndent`
            switch (value) {
            case 1:
              a();
              break;
            }
        `,
        options: [2, { SwitchCase: 0 }],
    },
    {
        text: unIndent`
            try {
              a();
            } catch (error) {
              b();
            } finally {
              c();
            }
        `,
        options: [2],
    },
    {
        text: unIndent`
            class A {
              method() {
                run();
              }
            }
        `,
        options: [2],
    },
    {
        text: unIndent`
            while (ready) {
                work();
            }
        `,
        options: [4],
    },
    {
        text: "if (a) {\n\tb();\n}",
        options: ["tab"],
    },
    {
        text: "const value = `line one\n    ${expr}\n      line three`;\nif (a) {\n  b();\n}",
        options: [2],
    },
    {
        text: unIndent`
            import foo from "foo";

            export function bar() {
              foo();
            }
        `,
        options: [2], // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    },
    {
        text: unIndent`
            function outer() {
              // comments are not tracked by this implementation
              if (a) {
                b();
              }
            }
        `,
        options: [2, { ignoreComments: true }],
    },
];

const invalid = [
    {
        text: unIndent`
            function test() {
                if (a) {
                  b();
                }
            }
        `,
        options: [2],
        errors: 3,
    },
    {
        text: unIndent`
            if (a) {
              b();
            } else {
                c();
            }
        `,
        options: [2],
    },
    {
        text: unIndent`
            if (a)
                b();
        `,
        options: [2],
    },
    {
        text: unIndent`
            for (let i = 0; i < 3; i++)
                work(i);
        `,
        options: [2],
    },
    {
        text: unIndent`
            switch (value) {
            case 1:
              a();
              break;
            }
        `,
        options: [2, { SwitchCase: 1 }],
        errors: 3,
    },
    {
        text: unIndent`
            switch (value) {
              case 1:
                a();
                break;
            }
        `,
        options: [2, { SwitchCase: 0 }],
        errors: 3,
    },
    {
        text: unIndent`
            try {
             a();
            } catch (error) {
              b();
            } finally {
             c();
            }
        `,
        options: [2],
        errors: 2,
    },
    {
        text: unIndent`
            class A {
                method() {
                  run();
                }
            }
        `,
        options: [2],
        errors: 3,
    },
    {
        text: "if (a) {\n    b();\n}",
        options: ["tab"],
    },
    {
        text: unIndent`
            import foo from "foo";

            export function bar() {
                foo();
            }
        `,
        options: [2], // languageOptions: { ecmaVersion: 6, sourceType: "module" }
    },
];


describe("indent", ({ describe }) => {

    const globalRules = { indent: ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules.indent = rules.indent.concat(options);
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
                    rules.indent = rules.indent.concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                const [message] = res.messages;

                assertEqual("indent", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
            });
        });
    });
});
