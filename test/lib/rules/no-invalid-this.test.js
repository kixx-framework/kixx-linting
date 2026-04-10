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
    assert,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";

const valid = [
    { text: "console.log(this);" },
    { text: "function foo() { this.value = 1; }" },
    { text: "\"use strict\"; function Foo() { this.value = 1; }" },
    { text: "\"use strict\"; var obj = { foo: function() { return this; } };" },
    { text: "\"use strict\"; var obj = { foo() { return this; } };" },
    { text: "class A { constructor() { this.value = 1; } }" },
    { text: "class A { static foo() { return this; } }" },
    { text: "\"use strict\"; var foo = function() { return this; }.bind(obj);" },
    { text: "\"use strict\"; (function() { return this; }).call(obj);" },
    { text: "\"use strict\"; (function() { return this; }).apply(obj);" },
    { text: "\"use strict\"; [1].map(function() { return this; }, obj);" },
    { text: "\"use strict\"; var x = () => this;" },
    { text: "\"use strict\"; class C { static { this.x = 1; } }" },
    { text: "\"use strict\"; obj.foo = function() { return this; };" },
    { text: "\"use strict\"; function foo() { return function() { return this; }.call(obj); }" },
    { text: "\"use strict\"; function foo(Ctor = function Bar() { return this; }) {}" },
];

const invalid = [
    { text: "\"use strict\"; function foo() { return this; }" },
    { text: "\"use strict\"; (function() { return this; })();" },
    { text: "\"use strict\"; var foo = function() { return this; };" },
    { text: "console.log(this);", languageOptions: { sourceType: "module" } },
    { text: "(() => this)();", languageOptions: { sourceType: "module" } },
    { text: "this.eval('foo');", languageOptions: { sourceType: "module" } },
    {
        text: "\"use strict\"; function foo() { return this; }",
        options: [{ capIsConstructor: false }],
    },
    { text: "\"use strict\"; [1].map(function() { return this; });" },
    { text: "\"use strict\"; function foo() { return (() => this)(); }" },
];

describe("no-invalid-this", ({ describe }) => {

    const globalRules = { "no-invalid-this": ["error"] };
    const normalizeLanguageOptions = (languageOptions) => ({
        sourceType: "script",
        ...(languageOptions && languageOptions.sourceType ? { sourceType: languageOptions.sourceType } : {}),
    });

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-invalid-this"] = rules["no-invalid-this"].concat(options);
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
            invalid.forEach(({ text, options, languageOptions }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-invalid-this"] = rules["no-invalid-this"].concat(options);
                }

                const res = lintText(file, rules, normalizeLanguageOptions(languageOptions));

                assert(res.errorCount > 0, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-invalid-this", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
