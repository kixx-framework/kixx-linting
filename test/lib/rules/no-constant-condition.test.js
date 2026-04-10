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
    { text: "if(a);" },
    { text: "if(a == 0);" },
    { text: "if(a = f());" },
    { text: "if(a += 1);" },
    { text: "if(a |= 1);" },
    { text: "if(a |= true);" },
    { text: "if(a |= false);" },
    { text: "if(a &= 1);" },
    { text: "if(a &= true);" },
    { text: "if(a &= false);" },
    { text: "if(a >>= 1);" },
    { text: "if(a >>= true);" },
    { text: "if(a >>= false);" },
    { text: "if(a >>>= 1);" },
    { text: "if(a ??= 1);" },
    { text: "if(a ??= true);" },
    { text: "if(a ??= false);" },
    { text: "if(a ||= b);" },
    { text: "if(a ||= false);" },
    { text: "if(a ||= 0);" },
    { text: "if(a ||= void 0);" },
    { text: "if(+(a ||= 1));" },
    { text: "if(f(a ||= true));" },
    { text: "if((a ||= 1) + 2);" },
    { text: "if(1 + (a ||= true));" },
    { text: "if(a ||= '' || false);" },
    { text: "if(a ||= void 0 || null);" },
    { text: "if((a ||= false) || b);" },
    { text: "if(a || (b ||= false));" },
    { text: "if((a ||= true) && b);" },
    { text: "if(a && (b ||= true));" },
    { text: "if(a &&= b);" },
    { text: "if(a &&= true);" },
    { text: "if(a &&= 1);" },
    { text: "if(a &&= 'foo');" },
    { text: "if((a &&= '') + false);" },
    { text: "if('' + (a &&= null));" },
    { text: "if(a &&= 1 && 2);" },
    { text: "if((a &&= true) && b);" },
    { text: "if(a && (b &&= true));" },
    { text: "if((a &&= false) || b);" },
    { text: "if(a || (b &&= false));" },
    { text: "if(a ||= b ||= false);" },
    { text: "if(a &&= b &&= true);" },
    { text: "if(a ||= b &&= false);" },
    { text: "if(a ||= b &&= true);" },
    { text: "if(a &&= b ||= false);" },
    { text: "if(a &&= b ||= true);" },
    { text: "if(1, a);" },
    { text: "if ('every' in []);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`\\\n${a}`) {}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`${a}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`${foo()}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`${a === 'b' && b==='a'}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`foo${a}` === 'fooa');" },
    { text: "if (tag`a`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (tag`${a}`);" },
    { text: "if (+(a || true));" },
    { text: "if (-(a || true));" },
    { text: "if (~(a || 1));" },
    { text: "if (+(a && 0) === +(b && 0));" },
    { text: "while(~!a);" },
    { text: "while(a = b);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "while(`${a}`);" },
    { text: "for(;x < 10;);" },
    { text: "for(;;);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "for(;`${a}`;);" },
    { text: "do{ }while(x)" },
    { text: "q > 0 ? 1 : 2;" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "`${a}` === a ? 1 : 2" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "`foo${a}` === a ? 1 : 2" },
    { text: "tag`a` === a ? 1 : 2" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "tag`${a}` === a ? 1 : 2" },
    { text: "while(x += 3) {}" },
    { text: "while(tag`a`) {}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "while(tag`${a}`) {}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "while(`\\\n${a}`) {}" },

    // #5228, typeof conditions
    { text: "if(typeof x === 'undefined'){}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`${typeof x}` === 'undefined'){}" },
    { text: "if(a === 'str' && typeof b){}" },
    { text: "typeof a == typeof b" },
    { text: "typeof 'a' === 'string'|| typeof b === 'string'" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "`${typeof 'a'}` === 'string'|| `${typeof b}` === 'string'" },

    // #5726, void conditions
    { text: "if (void a || a);" },
    { text: "if (a || void a);" },

    // #5693
    { text: "if(xyz === 'str1' && abc==='str2'){}" },
    { text: "if(xyz === 'str1' || abc==='str2'){}" },
    { text: "if(xyz === 'str1' || abc==='str2' && pqr === 5){}" },
    { text: "if(typeof abc === 'string' && abc==='str2'){}" },
    { text: "if(false || abc==='str'){}" },
    { text: "if(true && abc==='str'){}" },
    { text: "if(typeof 'str' && abc==='str'){}" },
    { text: "if(abc==='str' || false || def ==='str'){}" },
    { text: "if(true && abc==='str' || def ==='str'){}" },
    { text: "if(true && typeof abc==='string'){}" },

    // #11181, string literals
    { text: "if('str1' && a){}" },
    { text: "if(a && 'str'){}" },

    // #11306
    { text: "if ((foo || true) === 'baz') {}" },
    { text: "if ((foo || 'bar') === 'baz') {}" },
    { text: "if ((foo || 'bar') !== 'baz') {}" },
    { text: "if ((foo || 'bar') == 'baz') {}" },
    { text: "if ((foo || 'bar') != 'baz') {}" },
    { text: "if ((foo || 233) > 666) {}" },
    { text: "if ((foo || 233) < 666) {}" },
    { text: "if ((foo || 233) >= 666) {}" },
    { text: "if ((foo || 233) <= 666) {}" },
    { text: "if ((key || 'k') in obj) {}" },
    { text: "if ((foo || {}) instanceof obj) {}" },
    { text: "if ((foo || 'bar' || 'bar') === 'bar');" },
    {
        text: "if ((foo || 1n) === 'baz') {}", // languageOptions: { ecmaVersion: 11 }
    },
    {
        text: "if (a && 0n || b);", // languageOptions: { ecmaVersion: 11 }
    },
    {
        text: "if(1n && a){};", // languageOptions: { ecmaVersion: 11 }
    },

    // #12225
    { text: "if ('' + [y] === '' + [ty]) {}" },
    { text: "if ('a' === '' + [ty]) {}" },
    { text: "if ('' + [y, m, d] === 'a') {}" },
    { text: "if ('' + [y, 'm'] === '' + [ty, 'tm']) {}" },
    { text: "if ('' + [y, 'm'] === '' + ['ty']) {}" },
    { text: "if ([,] in\n\n($2))\n ;\nelse\n ;" },
    { text: "if ([...x]+'' === 'y'){}" },

    // { checkLoops: false }
    { text: "while(true);", options: [{ checkLoops: false }] },
    { text: "for(;true;);", options: [{ checkLoops: false }] },
    { text: "do{}while(true)", options: [{ checkLoops: false }] },

    // { checkLoops: "none" }
    { text: "while(true);", options: [{ checkLoops: "none" }] },
    { text: "for(;true;);", options: [{ checkLoops: "none" }] },
    { text: "do{}while(true)", options: [{ checkLoops: "none" }] },

    // { checkloops: "allExceptWhileTrue" }
    {
        text: "while(true);",
        options: [{ checkLoops: "allExceptWhileTrue" }],
    },
    { text: "while(true);" },

    // { checkloops: "all" }
    { text: "while(a == b);", options: [{ checkLoops: "all" }] },
    { text: "do{ }while(x);", options: [{ checkLoops: "all" }] },
    {
        text: "for (let x = 0; x <= 10; x++) {};",
        options: [{ checkLoops: "all" }],
    },

    { text: "function* foo(){while(true){yield 'foo';}}" },
    { text: "function* foo(){for(;true;){yield 'foo';}}" },
    { text: "function* foo(){do{yield 'foo';}while(true)}" },
    { text: "function* foo(){while (true) { while(true) {yield;}}}" },
    { text: "function* foo() {for (; yield; ) {}}" },
    { text: "function* foo() {for (; ; yield) {}}" },
    { text: "function* foo() {while (true) {function* foo() {yield;}yield;}}" },
    { text: "function* foo() { for (let x = yield; x < 10; x++) {yield;}yield;}" },
    { text: "function* foo() { for (let x = yield; ; x++) { yield; }}" },
    { text: "if (new Number(x) + 1 === 2) {}" },

    // #15467
    { text: "if([a]==[b]) {}" },
    { text: "if (+[...a]) {}" },
    { text: "if (+[...[...a]]) {}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`${[...a]}`) {}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if (`${[a]}`) {}" },
    { text: "if (+[a]) {}" },
    { text: "if (0 - [a]) {}" },
    { text: "if (1 * [a]) {}" },

    // Boolean function
    { text: "if (Boolean(a)) {}" },
    { text: "if (Boolean(...args)) {}" },
    { text: "if (foo.Boolean(1)) {}" },
    { text: "function foo(Boolean) { if (Boolean(1)) {} }" },
    { text: "const Boolean = () => {}; if (Boolean(1)) {}" },
    { text: "const undefined = 'lol'; if (undefined) {}" },
];

const invalid = [
    { text: "for(;true;);" },
    { text: "for(;``;);" },
    { text: "for(;`foo`;);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "for(;`foo${bar}`;);" },
    { text: "do{}while(true)" },
    { text: "do{}while('1')" },
    { text: "do{}while(0)" },
    { text: "do{}while(t = -2)" },
    { text: "do{}while(``)" },
    { text: "do{}while(`foo`)" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "do{}while(`foo${bar}`)" },
    { text: "true ? 1 : 2;" },
    { text: "1 ? 1 : 2;" },
    { text: "q = 0 ? 1 : 2;" },
    { text: "(q = 0) ? 1 : 2;" },
    { text: "`` ? 1 : 2;" },
    { text: "`foo` ? 1 : 2;" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "`foo${bar}` ? 1 : 2;" },
    { text: "if(-2);" },
    { text: "if(true);" },
    { text: "if(1);" },
    { text: "if({});" },
    { text: "if(0 < 1);" },
    { text: "if(0 || 1);" },
    { text: "if(a, 1);" },
    { text: "if(`foo`);" },
    { text: "if(``);" },
    { text: "if(`\\\n`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`${'bar'}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`${'bar' + `foo`}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`foo${false || true}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`foo${0 || 1}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`foo${bar}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`${bar}foo`);" },
    { text: "if(!(true || a));" },
    { text: "if(!(a && void b && c));" },
    { text: "if(0 || !(a && null));" },
    { text: "if(1 + !(a || true));" },
    { text: "if(!(null && a) > 1);" },
    { text: "if(+(!(a && 0)));" },
    { text: "if(!typeof a === 'string');" },
    { text: "if(-('foo' || a));" },
    { text: "if(+(void a && b) === ~(1 || c));" },
    { text: "if(a ||= true);" },
    { text: "if(a ||= 5);" },
    { text: "if(a ||= 'foo' || b);" },
    { text: "if(a ||= b || /regex/);" },
    { text: "if(a ||= b ||= true);" },
    { text: "if(a ||= b ||= c || 1);" },
    { text: "if(!(a ||= true));" },
    { text: "if(!(a ||= 'foo') === true);" },
    { text: "if(!(a ||= 'foo') === false);" },
    { text: "if(a || (b ||= true));" },
    { text: "if((a ||= 1) || b);" },
    { text: "if((a ||= true) && true);" },
    { text: "if(true && (a ||= true));" },
    { text: "if(a &&= false);" },
    { text: "if(a &&= null);" },
    { text: "if(a &&= void b);" },
    { text: "if(a &&= 0 && b);" },
    { text: "if(a &&= b && '');" },
    { text: "if(a &&= b &&= false);" },
    { text: "if(a &&= b &&= c && false);" },
    { text: "if(!(a &&= false));" },
    { text: "if(!(a &&= 0) + 1);" },
    { text: "if(a && (b &&= false));" },
    { text: "if((a &&= null) && b);" },
    { text: "if(false || (a &&= false));" },
    { text: "if((a &&= false) || false);" },
    { text: "while([]);" },
    { text: "while(~!0);" },
    { text: "while(x = 1);" },
    { text: "while(function(){});" },
    { text: "while(true);", options: [{ checkLoops: "all" }] },
    { text: "while(1);" },
    { text: "while(() => {});" },
    { text: "while(`foo`);" },
    { text: "while(``);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "while(`${'foo'}`);" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "while(`${'foo' + 'bar'}`);" },
    { text: "if(typeof x){}" },
    { text: "if(typeof 'abc' === 'string'){}" },
    { text: "if(a = typeof b){}" },
    { text: "if(a, typeof b){}" },
    { text: "if(typeof 'a' == 'string' || typeof 'b' == 'string'){}" },
    { text: "while(typeof x){}" },
    { text: "if(1 || void x);" },
    { text: "if(void x);" },
    { text: "if(y = void x);" },
    { text: "if(x, void x);" },
    { text: "if(void x === void y);" },
    { text: "if(void x && a);" },
    { text: "if(a && void x);" },
    { text: "if(false && abc==='str'){}" },
    { text: "if(true || abc==='str'){}" },
    { text: "if(1 || abc==='str'){}" },
    { text: "if(abc==='str' || true){}" },
    { text: "if(abc==='str' || true || def ==='str'){}" },
    { text: "if(false || true){}" },
    { text: "if(typeof abc==='str' || true){}" },
    { text: "if('str' || a){}" },
    { text: "if('str' || abc==='str'){}" },
    { text: "if('str1' || 'str2'){}" },
    { text: "if('str1' && 'str2'){}" },
    { text: "if(abc==='str' || 'str'){}" },
    { text: "if(a || 'str'){}" },
    { text: "while(x = 1);", options: [{ checkLoops: "all" }] },
    { text: "do{ }while(x = 1)", options: [{ checkLoops: "all" }] },
    { text: "for (;true;) {};", options: [{ checkLoops: "all" }] },
    { text: "function* foo(){while(true){} yield 'foo';}", options: [{ checkLoops: "all" }] },
    { text: "function* foo(){while(true){} yield 'foo';}", options: [{ checkLoops: true }] },
    { text: "function* foo(){while(true){if (true) {yield 'foo';}}}", options: [{ checkLoops: "all" }] },
    { text: "function* foo(){while(true){if (true) {yield 'foo';}}}", options: [{ checkLoops: true }] },
    { text: "function* foo(){while(true){yield 'foo';} while(true) {}}", options: [{ checkLoops: "all" }] },
    { text: "function* foo(){while(true){yield 'foo';} while(true) {}}", options: [{ checkLoops: true }] },
    { text: "var a = function* foo(){while(true){} yield 'foo';}", options: [{ checkLoops: "all" }] },
    { text: "var a = function* foo(){while(true){} yield 'foo';}", options: [{ checkLoops: true }] },
    { text: "while (true) { function* foo() {yield;}}", options: [{ checkLoops: "all" }] },
    { text: "while (true) { function* foo() {yield;}}", options: [{ checkLoops: true }] },
    { text: "function* foo(){if (true) {yield 'foo';}}" },
    { text: "function* foo() {for (let foo = yield; true;) {}}" },
    { text: "function* foo() {for (foo = yield; true;) {}}" },
    { text: "function foo() {while (true) {function* bar() {while (true) {yield;}}}}", options: [{ checkLoops: "all" }] },
    { text: "function foo() {while (true) {const bar = function*() {while (true) {yield;}}}}", options: [{ checkLoops: "all" }] },
    { text: "function* foo() { for (let foo = 1 + 2 + 3 + (yield); true; baz) {}}" },
    { text: "if([a]) {}" },
    { text: "if([]) {}" },
    { text: "if(''+['a']) {}" },
    { text: "if(''+[]) {}" },
    { text: "if(+1) {}" },
    { text: "if ([,] + ''){}" },
    { text: "if(/foo/ui);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0b0n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0o0n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0x0n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0b1n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0o1n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0x1n);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(0x1n || foo);", /* languageOptions: { ecmaVersion: 11 } */ },
    { text: "if(class {}) {}" },
    { text: "if(new Foo()) {}" },
    { text: "if(new Boolean(foo)) {}" },
    { text: "if(new String(foo)) {}" },
    { text: "if(new Number(foo)) {}" },
    // eslint-disable-next-line no-template-curly-in-string
    { text: "if(`${[...['a']]}`) {}" },
    { text: "if (undefined) {}" },
    { text: "if (Boolean(1)) {}" },
    { text: "if (Boolean()) {}" },
    { text: "if (Boolean([a])) {}" },
    { text: "if (Boolean(1)) { function Boolean() {}}" },
];

describe("no-constant-condition", ({ describe }) => {

    const globalRules = { "no-constant-condition": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, options }, i) => {
                const file = { text };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-constant-condition"] = rules["no-constant-condition"].concat(options);
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
                    rules["no-constant-condition"] = rules["no-constant-condition"].concat(options);
                }

                const res = lintText(file, rules);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${text.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${text.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-constant-condition", message.ruleId, `message.ruleId:[${i}]:${text.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${text.slice(0, 52)} ...`);
                });
            });
        });
    });
});
