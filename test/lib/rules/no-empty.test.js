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
    { text: "if (foo) { bar() }" },
    { text: "while (foo) { bar() }" },
    { text: "for (;foo;) { bar() }" },
    { text: "try { foo() } catch (ex) { foo() }" },
    { text: "switch(foo) {case 'foo': break;}" },
    { text: "(function() { }())" },
    { text: "var foo = () => {};" }, // languageOptions: { ecmaVersion: 6 }
    { text: "function foo() { }" },
    { text: "if (foo) {/* empty */}" },
    { text: "while (foo) {/* empty */}" },
    { text: "switch (foo) {/* empty */}" },
    { text: "for (;foo;) {/* empty */}" },
    { text: "try { foo() } catch (ex) {/* empty */}" },
    { text: "try { foo() } catch (ex) {// empty\n}" },
    { text: "try { foo() } finally {// empty\n}" },
    { text: "try { foo() } finally {// test\n}" },
    { text: "try { foo() } finally {\n \n // hi i am off no use\n}" },
    { text: "try { foo() } catch (ex) {/* test111 */}" },
    { text: "if (foo) { bar() } else { // nothing in me \n}" },
    { text: "if (foo) { bar() } else { /**/ \n}" },
    { text: "if (foo) { bar() } else { // \n}" },
    {
        text: "try { foo(); } catch (ex) {}",
        options: [{ allowEmptyCatch: true }],
    },
    {
        text: "try { foo(); } catch (ex) {} finally { bar(); }",
        options: [{ allowEmptyCatch: true }],
    },
];

const invalid = [
    {
        text: "try {} catch (ex) {throw ex}",
    },
    {
        text: "try { foo() } catch (ex) {}",
    },
    {
        text: "try { foo() } catch (ex) {throw ex} finally {}",
    },
    {
        text: "if (foo) {}",
    },
    {
        text: "while (foo) {}",
    },
    {
        text: "for (;foo;) {}",
    },
    {
        text: "switch(foo) {}",
    },
    {
        text: "switch /* empty */ (/* empty */ foo /* empty */) /* empty */ {} /* empty */",
    },
    {
        text: "try {} catch (ex) {}",
        options: [{ allowEmptyCatch: true }],
    },
    {
        text: "try { foo(); } catch (ex) {} finally {}",
        options: [{ allowEmptyCatch: true }],
    },
    {
        text: "try {} catch (ex) {} finally {}",
        options: [{ allowEmptyCatch: true }],
        errors: 2,
    },
    {
        text: "try { foo(); } catch (ex) {} finally {}",
        errors: 2,
    },
];

describe("no-empty", ({ describe }) => {

    const globalRules = { "no-empty": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-empty"] = rules["no-empty"].concat(options);
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
                    rules["no-empty"] = rules["no-empty"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-empty", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
