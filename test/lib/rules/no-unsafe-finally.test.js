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
    { text: "var foo = function() {\n try { \n return 1; \n } catch(err) { \n return 2; \n } finally { \n console.log('hola!') \n } \n }" },
    { text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { console.log('hola!') } }" },
    { text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { function a(x) { return x } } }" },
    { text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { var a = function(x) { if(!x) { throw new Error() } } } }" },
    { text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { var a = function(x) { while(true) { if(x) { break } else { continue } } } } }" },
    { text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { var a = function(x) { label: while(true) { if(x) { break label; } else { continue } } } } }" },
    { text: "var foo = function() { try {} finally { while (true) break; } }" },
    { text: "var foo = function() { try {} finally { while (true) continue; } }" },
    { text: "var foo = function() { try {} finally { switch (true) { case true: break; } } }" },
    { text: "var foo = function() { try {} finally { do { break; } while (true) } }" },
    {
        text: "var foo = function() { try { return 1; } catch(err) { return 2; } finally { var bar = () => { throw new Error(); }; } };",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var foo = function() { try { return 1; } catch(err) { return 2 } finally { (x) => x } }",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var foo = function() { try { return 1; } finally { class bar { constructor() {} static ehm() { return 'Hola!'; } } } };",
        languageOptions: { ecmaVersion: 6 },
    },
];

const invalid = [
    {
        text: "var foo = function() { \n try { \n return 1; \n } catch(err) { \n return 2; \n } finally { \n return 3; \n } \n }",
    },
    {
        text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { if(true) { return 3 } else { return 2 } } }",
    },
    {
        text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { return 3 } }",
    },
    {
        text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { return function(x) { return y } } }",
    },
    {
        text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { return { x: function(c) { return c } } } }",
    },
    {
        text: "var foo = function() { try { return 1 } catch(err) { return 2 } finally { throw new Error() } }",
    },
    {
        text: "var foo = function() { try { foo(); } finally { try { bar(); } finally { return; } } };",
    },
    {
        text: "var foo = function() { label: try { return 0; } finally { break label; } return 1; }",
    },
    {
        text: "var foo = function() { \n a: try { \n return 1; \n } catch(err) { \n return 2; \n } finally { \n break a; \n } \n }",
    },
    {
        text: "var foo = function() { while (true) try {} finally { break; } }",
    },
    {
        text: "var foo = function() { while (true) try {} finally { continue; } }",
    },
    {
        text: "var foo = function() { switch (true) { case true: try {} finally { break; } } }",
    },
    {
        text: "var foo = function() { a: while (true) try {} finally { switch (true) { case true: break a; } } }",
    },
    {
        text: "var foo = function() { a: while (true) try {} finally { switch (true) { case true: continue; } } }",
    },
    {
        text: "var foo = function() { a: switch (true) { case true: try {} finally { switch (true) { case true: break a; } } } }",
    },
];

describe("no-unsafe-finally", ({ describe }) => {

    const globalRules = { "no-unsafe-finally": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-unsafe-finally"] = rules["no-unsafe-finally"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
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
                    rules["no-unsafe-finally"] = rules["no-unsafe-finally"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-unsafe-finally", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
