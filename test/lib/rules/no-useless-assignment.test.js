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
    // Basic tests
    { text: `let v = 'used';
        console.log(v);
        v = 'used-2'
        console.log(v);` },
    { text: `function foo() {
            let v = 'used';
            console.log(v);
            v = 'used-2';
            console.log(v);
        }` },
    { text: `function foo() {
            let v = 'used';
            if (condition) {
                v = 'used-2';
                console.log(v);
                return
            }
            console.log(v);
        }` },
    { text: `function foo() {
            let v = 'used';
            if (condition) {
                console.log(v);
            } else {
                v = 'used-2';
                console.log(v);
            }
        }` },
    { text: `function foo() {
            let v = 'used';
            if (condition) {
                //
            } else {
                v = 'used-2';
            }
            console.log(v);
        }` },
    { text: `var foo = function () {
            let v = 'used';
            console.log(v);
            v = 'used-2'
            console.log(v);
        }` },
    { text: `var foo = () => {
            let v = 'used';
            console.log(v);
            v = 'used-2'
            console.log(v);
        }` },
    { text: `class foo {
            static {
                let v = 'used';
                console.log(v);
                v = 'used-2'
                console.log(v);
            }
        }` },
    { text: `function foo () {
            let v = 'used';
            for (let i = 0; i < 10; i++) {
                console.log(v);
                v = 'used in next iteration';
            }
        }` },
    { text: `function foo () {
            let i = 0;
            i++;
            i++;
            console.log(i);
        }` },

    // Exported
    { text: `export let foo = 'used';
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `export function foo () {};
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `export class foo {};
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `export default function foo () {};
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `export default class foo {};
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `let foo = 'used';
        export { foo };
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `function foo () {};
        export { foo };
        console.log(foo);
        foo = 'unused like but exported';` },
    { text: `class foo {};
        export { foo };
        console.log(foo);
        foo = 'unused like but exported';` },
    {
        code: `/* exported foo */
            let foo = 'used';
            console.log(foo);
            foo = 'unused like but exported with directive';`,
        languageOptions: { sourceType: "script" },
    },

    // Mark variables as used via markVariableAsUsed()
    { text: `/*eslint test/use-a:1*/
        let a = 'used';
        console.log(a);
        a = 'unused like but marked by markVariableAsUsed()';
        ` },

    // Unknown variable
    { text: `v = 'used';
        console.log(v);
        v = 'unused'` },

    // Unused variable
    { text: "let v = 'used variable';" },

    // Unreachable
    { text: `function foo() {
            return;

            const x = 1;
            if (y) {
                bar(x);
            }
        }` },
    { text: `function foo() {
            const x = 1;
            console.log(x);
            return;

            x = 'Foo'
        }` },

    // Update
    { text: `function foo() {
            let a = 42;
            console.log(a);
            a++;
            console.log(a);
        }` },
    { text: `function foo() {
            let a = 42;
            console.log(a);
            a--;
            console.log(a);
        }` },

    // Assign with update
    { text: `function foo() {
            let a = 42;
            console.log(a);
            a = 10;
            a = a + 1;
            console.log(a);
        }` },
    { text: `function foo() {
            let a = 42;
            console.log(a);
            a = 10;
            if (cond) {
                a = a + 1;
            } else {
                a = 2 + a;
            }
            console.log(a);
        }` },

    // Assign to complex patterns
    { text: `function foo() {
            let a = 'used', b = 'used', c = 'used', d = 'used';
            console.log(a, b, c, d);
            ({ a, arr: [b, c, ...d] } = fn());
            console.log(a, b, c, d);
        }` },
    { text: `function foo() {
            let a = 'used', b = 'used', c = 'used';
            console.log(a, b, c);
            ({ a = 'unused', foo: b, ...c } = fn());
            console.log(a, b, c);
        }` },
    { text: `function foo() {
            let a = {};
            console.log(a);
            a.b = 'unused like, but maybe used in setter';
        }` },
    { text: `function foo() {
            let a = { b: 42 };
            console.log(a);
            a.b++;
        }` },

    // Value may be used in other scopes.
    { text: `function foo () {
            let v = 'used';
            console.log(v);
            function bar() {
                v = 'used in outer scope';
            }
            bar();
            console.log(v);
        }` },
    { text: `function foo () {
            let v = 'used';
            console.log(v);
            setTimeout(() => console.log(v), 1);
            v = 'used in other scope';
        }` },

    // Loops
    { text: `function foo () {
            let v = 'used';
            console.log(v);
            for (let i = 0; i < 10; i++) {
                if (condition) {
                    v = 'maybe used';
                    continue;
                }
                console.log(v);
            }
        }` },

    // Ignore known globals
    { text: `/* globals foo */
        const bk = foo;
        foo = 42;
        try {
            // process
        } finally {
            foo = bk;
        }` },
    {
        code: `
            const bk = console;
            console = { log () {} };
            try {
                // process
            } finally {
                console = bk;
            }`,
        languageOptions: {
            globals: { console: false },
        },
    },

    // Try catch finally
    { text: `let message = 'init';
        try {
            const result = call();
            message = result.message;
        } catch (e) {
            // ignore
        }
        console.log(message)` },
    { text: `let message = 'init';
        try {
            message = call().message;
        } catch (e) {
            // ignore
        }
        console.log(message)` },
    { text: `let v = 'init';
        try {
            v = callA();
            try {
                v = callB();
            } catch (e) {
                // ignore
            }
        } catch (e) {
            // ignore
        }
        console.log(v)` },
    { text: `let v = 'init';
        try {
            try {
                v = callA();
            } catch (e) {
                // ignore
            }
        } catch (e) {
            // ignore
        }
        console.log(v)` },
    { text: `let a;
        try {
            foo();
        } finally {
            a = 5;
        }
        console.log(a);` },

    // An expression within an assignment.
    { text: `const obj = { a: 5 };
        const { a, b = a } = obj;
        console.log(b); // 5` },
    { text: `const arr = [6];
        const [c, d = c] = arr;
        console.log(d); // 6` },
    { text: `const obj = { a: 1 };
        let {
            a,
            b = (a = 2)
        } = obj;
        console.log(a, b);` },
    { text: `let { a, b: {c = a} = {} } = obj;
        console.log(c);` },

    // ignore assignments in try block
    { text: `function foo(){
            let bar;
            try {
                bar = 2;
                unsafeFn();
                return { error: undefined };
            } catch {
                return { bar }; 
            }
        }   
        function unsafeFn() {
            throw new Error();
        }` },
    { text: `function foo(){
            let bar, baz;
            try {
                bar = 2;
                unsafeFn();
                return { error: undefined };
            } catch {
               baz = bar;
            }
            return baz;
        }   
        function unsafeFn() {
            throw new Error();
        }` },
    { text: `function foo(){
            let bar;
            try {
                bar = 2;
                unsafeFn();
                bar = 4;
            } catch {
               // handle error
            }
            return bar;
        }   
        function unsafeFn() {
            throw new Error();
        }` },
    { text: `/*eslint test/unknown-ref:1*/
        let a = "used";
		console.log(a);
		a = "unused";` },
    { text: `/*eslint test/unknown-ref:1*/
		function foo() {
			let a = "used";
			console.log(a);
			a = "unused";
		}` },
    { text: `/*eslint test/unknown-ref:1*/
		function foo() {
			let a = "used";
			if (condition) {
				a = "unused";
				return
			}
			console.log(a);
        }` },
];

const invalid = [
    {
        code: `let v = 'used';
            console.log(v);
            v = 'unused'`,
    },
    {
        code: `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
            }`,
    },
    {
        code: `function foo() {
                let v = 'used';
                if (condition) {
                    v = 'unused';
                    return
                }
                console.log(v);
            }`,
    },
    {
        code: `function foo() {
                let v = 'used';
                if (condition) {
                    console.log(v);
                } else {
                    v = 'unused';
                }
            }`,
    },
    {
        code: `var foo = function () {
                let v = 'used';
                console.log(v);
                v = 'unused'
            }`,
    },
    {
        code: `var foo = () => {
                let v = 'used';
                console.log(v);
                v = 'unused'
            }`,
    },
    {
        code: `class foo {
                static {
                    let v = 'used';
                    console.log(v);
                    v = 'unused'
                }
            }`,
    },
    {
        code: `function foo() {
                let v = 'unused';
                if (condition) {
                    v = 'used';
                    console.log(v);
                    return
                }
            }`,
    },
    {
        code: `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
                v = 'unused';
            }`,
    },
    {
        code: `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
                v = 'used';
                console.log(v);
                v = 'used';
                console.log(v);
            }`,
    },
    {
        code: `
            let v;
            v = 'unused';
            if (foo) {
                v = 'used';
            } else {
                v = 'used';
            }
            console.log(v);`,
    },
    {
        code: `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
                v = 'unused';
                v = 'used';
                console.log(v);
            }`,
    },
    {
        code: `function foo() {
                let v = 'unused';
                if (condition) {
                    if (condition2) {
                        v = 'used-2';
                    } else {
                        v = 'used-3';
                    }
                } else {
                    v = 'used-4';
                }
                console.log(v);
            }`,
    },
    {
        code: `function foo() {
                let v;
                if (condition) {
                    v = 'unused';
                } else {
                    //
                }
                if (condition2) {
                    v = 'used-1';
                } else {
                    v = 'used-2';
                }
                console.log(v);
            }`,
    },
    {
        code: `function foo() {
                let v = 'used';
                if (condition) {
                    v = 'unused';
                    v = 'unused';
                    v = 'used';
                }
                console.log(v);
            }`,
    },

    // Update
    {
        code: `function foo() {
                let a = 42;
                console.log(a);
                a++;
            }`,
    },
    {
        code: `function foo() {
                let a = 42;
                console.log(a);
                a--;
            }`,
    },

    // Assign to complex patterns
    {
        code: `function foo() {
                let a = 'used', b = 'used', c = 'used', d = 'used';
                console.log(a, b, c, d);
                ({ a, arr: [b, c,, ...d] } = fn());
                console.log(c);
            }`,
    },
    {
        code: `function foo() {
                let a = 'used', b = 'used', c = 'used';
                console.log(a, b, c);
                ({ a = 'unused', foo: b, ...c } = fn());
            }`,
    },

    // Variable used in other scopes, but write only.
    {
        code: `function foo () {
                let v = 'used';
                console.log(v);
                setTimeout(() => v = 42, 1);
                v = 'unused and variable is only updated in other scopes';
            }`,
    },

    // Code Path Segment End Statements
    {
        code: `function foo() {
                let v = 'used';
                if (condition) {
                    let v = 'used';
                    console.log(v);
                    v = 'unused';
                }
                console.log(v);
                v = 'unused';
            }`,
    },
    {
        code: `function foo() {
                let v = 'used';
                if (condition) {
                    console.log(v);
                    v = 'unused';
                } else {
                    v = 'unused';
                }
            }`,
    },
    {
        code: `function foo () {
                let v = 'used';
                console.log(v);
                v = 'unused';
                return;
                console.log(v);
            }`,
    },
    {
        code: `function foo () {
                let v = 'used';
                console.log(v);
                v = 'unused';
                throw new Error();
                console.log(v);
            }`,
    },
    {
        code: `function foo () {
                let v = 'used';
                console.log(v);
                for (let i = 0; i < 10; i++) {
                    v = 'unused';
                    continue;
                    console.log(v);
                }
            }
            function bar () {
                let v = 'used';
                console.log(v);
                for (let i = 0; i < 10; i++) {
                    v = 'unused';
                    break;
                    console.log(v);
                }
            }`,
    },
    {
        code: `function foo () {
                let v = 'used';
                console.log(v);
                for (let i = 0; i < 10; i++) {
                    if (condition) {
                        v = 'unused';
                        break;
                    }
                    console.log(v);
                }
            }`,
    },

    // Try catch
    {
        code: `let message = 'unused';
            try {
                const result = call();
                message = result.message;
            } catch (e) {
                message = 'used';
            }
            console.log(message)`,
    },
    {
        code: `let message = 'unused';
            try {
                message = 'used';
                console.log(message)
            } catch (e) {
            }`,
    },
    {
        code: `let message = 'unused';
            try {
                message = call();
            } catch (e) {
                message = 'used';
            }
            console.log(message)`,
    },
    {
        code: `let v = 'unused';
            try {
                v = callA();
                try {
                    v = callB();
                } catch (e) {
                    // ignore
                }
            } catch (e) {
                v = 'used';
            }
            console.log(v)`,
    },

    // An expression within an assignment.
    {
        code: `
            var x = 1; // used
            x = x + 1; // unused
            x = 5; // used
            f(x);`,
    },
    {
        code: `
            var x = 1; // used
            x = // used
                x++; // unused
            f(x);`,
    },
    {
        code: `const obj = { a: 1 };
            let {
                a,
                b = (a = 2)
            } = obj;
            a = 3
            console.log(a, b);`,
    },
];

describe("no-useless-assignment", ({ describe }) => {

    const globalRules = { "no-useless-assignment": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-useless-assignment"] = rules["no-useless-assignment"].concat(options);
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
            invalid.forEach(({ text, code, options, languageOptions, errors }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-useless-assignment"] = rules["no-useless-assignment"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (errors === undefined) {
                    assertEqual(true, res.errorCount > 0, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                } else {
                    assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                }
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-useless-assignment", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
