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
    { text: 'import os from "os";\nimport fs from "fs";' },
    { text: 'import { merge } from "lodash-es";' },
    { text: 'import _, { merge } from "lodash-es";' },
    { text: 'import * as Foobar from "async";' },
    { text: 'import "foo"' },
    { text: 'import os from "os";\nexport { something } from "os";' },
    { text: 'import * as bar from "os";\nimport { baz } from "os";' },
    { text: 'import foo, * as bar from "os";\nimport { baz } from "os";' },
    { text: 'import foo, { bar } from "os";\nimport * as baz from "os";' },
    {
        text: 'import os from "os";\nexport { hello } from "hello";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport * from "hello";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport { hello as hi } from "hello";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport default function(){};',
        options: [{ includeExports: true }],
    },
    {
        text: 'import { merge } from "lodash-es";\nexport { merge as lodashMerge }',
        options: [{ includeExports: true }],
    },
    {
        text: 'export { something } from "os";\nexport * as os from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import { something } from "os";\nexport * as os from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import * as os from "os";\nexport { something } from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport * from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'export { something } from "os";\nexport * from "os";',
        options: [{ includeExports: true }],
    },
];
const invalid = [
    {
        text: 'import "fs";\nimport "fs"',
    },
    {
        text: 'import { merge } from "lodash-es";\nimport { find } from "lodash-es";',
    },
    {
        text: 'import { merge } from "lodash-es";\nimport _ from "lodash-es";',
    },
    {
        text: 'import os from "os";\nimport { something } from "os";\nimport * as foobar from "os";',
    },
    {
        text: 'import * as modns from "lodash-es";\nimport { merge } from "lodash-es";\nimport { baz } from "lodash-es";',
    },
    {
        text: 'export { os } from "os";\nexport { something } from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport { os as foobar } from "os";\nexport { something } from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport { something } from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import os from "os";\nexport * as os from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'export * as os from "os";\nimport os from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import * as modns from "mod";\nexport * as  modns from "mod";',
        options: [{ includeExports: true }],
    },
    {
        text: 'export * from "os";\nexport * from "os";',
        options: [{ includeExports: true }],
    },
    {
        text: 'import "os";\nexport * from "os";',
        options: [{ includeExports: true }],
    },
];

describe("no-duplicate-imports", ({ describe }) => {

    const globalRules = { "no-duplicate-imports": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-duplicate-imports"] = rules["no-duplicate-imports"].concat(options);
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
                    rules["no-duplicate-imports"] = rules["no-duplicate-imports"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-duplicate-imports", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
