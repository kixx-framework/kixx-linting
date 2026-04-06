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

export default {
	valid: [
		// While this _would_ be a constant condition in React, ESLint has a policy of not attributing any specific behavior to JSX.
		"<p /> && foo",
		"<></> && foo",
		"<p /> ?? foo",
		"<></> ?? foo",
		"arbitraryFunction(n) ?? foo",
		"foo.Boolean(n) ?? foo",
		"(x += 1) && foo",
		"`${bar}` && foo",
		"bar && foo",
		"delete bar.baz && foo",
		"true ? foo : bar", // We leave ConditionalExpression for `no-constant-condition`.
		"new Foo() == true",
		"foo == true",
		"`${foo}` == true",
		"`${foo}${bar}` == true",
		"`0${foo}` == true",
		"`00000000${foo}` == true",
		"`0${foo}.000` == true",
		"[n] == true",

		"delete bar.baz === true",

		"foo.Boolean(true) && foo",
		"function Boolean(n) { return n; }; Boolean(x) ?? foo",
		"function String(n) { return n; }; String(x) ?? foo",
		"function Number(n) { return n; }; Number(x) ?? foo",
		"function Boolean(n) { return Math.random(); }; Boolean(x) === 1",
		"function Boolean(n) { return Math.random(); }; Boolean(1) == true",

		"new Foo() === x",
		"x === new someObj.Promise()",
		"Boolean(foo) === true",
		"function foo(undefined) { undefined ?? bar;}",
		"function foo(undefined) { undefined == true;}",
		"function foo(undefined) { undefined === true;}",
		"[...arr, 1] == true",
		"[,,,] == true",
		{
			code: "new Foo() === bar;",
			languageOptions: { globals: { Foo: "writable" } },
		},
		"(foo && true) ?? bar",
		"foo ?? null ?? bar",
		"a ?? (doSomething(), undefined) ?? b",
		"a ?? (something = null) ?? b",
	],
	invalid: [
		// Error messages
		{
			code: "[] && greeting",
		},
		{
			code: "[] || greeting",
		},
		{
			code: "[] ?? greeting",
		},
		{
			code: "[] == true",
		},
		{
			code: "true == []",
		},
		{
			code: "[] != true",
		},
		{
			code: "[] === true",
		},
		{
			code: "[] !== true",
		},

		// Motivating examples from the original proposal https://github.com/eslint/eslint/issues/13752
		{
			code: "!foo == null",
		},
		{
			code: "!foo ?? bar",
		},
		{
			code: "(a + b) / 2 ?? bar",
		},
		{
			code: "String(foo.bar) ?? baz",
		},
		{
			code: '"hello" + name ?? ""',
		},
		{
			code: '[foo?.bar ?? ""] ?? []',
		},

		// Logical expression with constant truthiness
		{
			code: "true && hello",
		},
		{
			code: "true || hello",
		},
		{
			code: "true && foo",
		},
		{ code: "'' && foo",},
		{ code: "100 && foo",},
		{
			code: "+100 && foo",
		},
		{
			code: "-100 && foo",
		},
		{
			code: "~100 && foo",
		},
		{
			code: "/[a-z]/ && foo",
		},
		{
			code: "Boolean([]) && foo",
		},
		{
			code: "Boolean() && foo",
		},
		{
			code: "Boolean([], n) && foo",
		},
		{
			code: "({}) && foo",
		},
		{ code: "[] && foo",},
		{
			code: "(() => {}) && foo",
		},
		{
			code: "(function() {}) && foo",
		},
		{
			code: "(class {}) && foo",
		},
		{
			code: "(class { valueOf() { return x; } }) && foo",
		},
		{
			code: "(class { [x]() { return x; } }) && foo",
		},
		{
			code: "new Foo() && foo",
		},

		// (boxed values are always truthy)
		{
			code: "new Boolean(unknown) && foo",
		},
		{
			code: "(bar = false) && foo",
		},
		{
			code: "(bar.baz = false) && foo",
		},
		{
			code: "(bar[0] = false) && foo",
		},
		{
			code: "`hello ${hello}` && foo",
		},
		{
			code: "void bar && foo",
		},
		{
			code: "!true && foo",
		},
		{
			code: "typeof bar && foo",
		},
		{
			code: "(bar, baz, true) && foo",
		},
		{
			code: "undefined && foo",
		},

		// Logical expression with constant nullishness
		{
			code: "({}) ?? foo",
		},
		{
			code: "([]) ?? foo",
		},
		{
			code: "(() => {}) ?? foo",
		},
		{
			code: "(function() {}) ?? foo",
		},
		{
			code: "(class {}) ?? foo",
		},
		{
			code: "new Foo() ?? foo",
		},
		{ code: "1 ?? foo",},
		{
			code: "/[a-z]/ ?? foo",
		},
		{
			code: "`${''}` ?? foo",
		},
		{
			code: "(a = true) ?? foo",
		},
		{
			code: "(a += 1) ?? foo",
		},
		{
			code: "(a -= 1) ?? foo",
		},
		{
			code: "(a *= 1) ?? foo",
		},
		{
			code: "(a /= 1) ?? foo",
		},
		{
			code: "(a %= 1) ?? foo",
		},
		{
			code: "(a <<= 1) ?? foo",
		},
		{
			code: "(a >>= 1) ?? foo",
		},
		{
			code: "(a >>>= 1) ?? foo",
		},
		{
			code: "(a |= 1) ?? foo",
		},
		{
			code: "(a ^= 1) ?? foo",
		},
		{
			code: "(a &= 1) ?? foo",
		},
		{
			code: "undefined ?? foo",
		},
		{
			code: "!bar ?? foo",
		},
		{
			code: "void bar ?? foo",
		},
		{
			code: "typeof bar ?? foo",
		},
		{
			code: "+bar ?? foo",
		},
		{
			code: "-bar ?? foo",
		},
		{
			code: "~bar ?? foo",
		},
		{
			code: "++bar ?? foo",
		},
		{
			code: "bar++ ?? foo",
		},
		{
			code: "--bar ?? foo",
		},
		{
			code: "bar-- ?? foo",
		},
		{
			code: "(x == y) ?? foo",
		},
		{
			code: "(x + y) ?? foo",
		},
		{
			code: "(x / y) ?? foo",
		},
		{
			code: "(x instanceof String) ?? foo",
		},
		{
			code: "(x in y) ?? foo",
		},
		{
			code: "Boolean(x) ?? foo",
		},
		{
			code: "String(x) ?? foo",
		},
		{
			code: "Number(x) ?? foo",
		},

		// Binary expression with comparison to null
		{
			code: "({}) != null",
		},
		{
			code: "({}) == null",
		},
		{
			code: "null == ({})",
		},
		{
			code: "({}) == undefined",
		},
		{
			code: "undefined == ({})",
		},

		// Binary expression with loose comparison to boolean
		{
			code: "({}) != true",
		},
		{
			code: "({}) == true",
		},
		{
			code: "([]) == true",
		},
		{
			code: "([a, b]) == true",
		},
		{
			code: "(() => {}) == true",
		},
		{
			code: "(function() {}) == true",
		},
		{
			code: "void foo == true",
		},
		{
			code: "typeof foo == true",
		},
		{
			code: "![] == true",
		},
		{
			code: "true == class {}",
		},
		{ code: "true == 1",},
		{
			code: "undefined == true",
		},
		{
			code: "true == undefined",
		},
		{
			code: "`hello` == true",
		},
		{
			code: "/[a-z]/ == true",
		},
		{
			code: "({}) == Boolean({})",
		},
		{
			code: "({}) == Boolean()",
		},
		{
			code: "({}) == Boolean(() => {}, foo)",
		},

		// Binary expression with strict comparison to boolean
		{
			code: "({}) !== true",
		},
		{
			code: "({}) == !({})",
		},
		{
			code: "({}) === true",
		},
		{
			code: "([]) === true",
		},
		{
			code: "(function() {}) === true",
		},
		{
			code: "(() => {}) === true",
		},
		{
			code: "!{} === true",
		},
		{
			code: "typeof n === true",
		},
		{
			code: "void n === true",
		},
		{
			code: "+n === true",
		},
		{
			code: "-n === true",
		},
		{
			code: "~n === true",
		},
		{
			code: "true === true",
		},
		{
			code: "1 === true",
		},
		{
			code: "'hello' === true",
		},
		{
			code: "/[a-z]/ === true",
		},
		{
			code: "undefined === true",
		},
		{
			code: "(a = {}) === true",
		},
		{
			code: "(a += 1) === true",
		},
		{
			code: "(a -= 1) === true",
		},
		{
			code: "(a *= 1) === true",
		},
		{
			code: "(a %= 1) === true",
		},
		{
			code: "(a ** b) === true",
		},
		{
			code: "(a << b) === true",
		},
		{
			code: "(a >> b) === true",
		},
		{
			code: "(a >>> b) === true",
		},
		{
			code: "--a === true",
		},
		{
			code: "a-- === true",
		},
		{
			code: "++a === true",
		},
		{
			code: "a++ === true",
		},
		{
			code: "(a + b) === true",
		},
		{
			code: "(a - b) === true",
		},
		{
			code: "(a * b) === true",
		},
		{
			code: "(a / b) === true",
		},
		{
			code: "(a % b) === true",
		},
		{
			code: "(a | b) === true",
		},
		{
			code: "(a ^ b) === true",
		},
		{
			code: "(a & b) === true",
		},
		{
			code: "Boolean(0) === Boolean(1)",
		},
		{
			code: "true === String(x)",
		},
		{
			code: "true === Number(x)",
		},
		{
			code: "Boolean(0) == !({})",
		},

		// Binary expression with strict comparison to null
		{
			code: "({}) !== null",
		},
		{
			code: "({}) === null",
		},
		{
			code: "([]) === null",
		},
		{
			code: "(() => {}) === null",
		},
		{
			code: "(function() {}) === null",
		},
		{
			code: "(class {}) === null",
		},
		{
			code: "new Foo() === null",
		},
		{
			code: "`` === null",
		},
		{
			code: "1 === null",
		},
		{
			code: "'hello' === null",
		},
		{
			code: "/[a-z]/ === null",
		},
		{
			code: "true === null",
		},
		{
			code: "null === null",
		},
		{
			code: "a++ === null",
		},
		{
			code: "++a === null",
		},
		{
			code: "--a === null",
		},
		{
			code: "a-- === null",
		},
		{
			code: "!a === null",
		},
		{
			code: "typeof a === null",
		},
		{
			code: "delete a === null",
		},
		{
			code: "void a === null",
		},
		{
			code: "undefined === null",
		},
		{
			code: "(x = {}) === null",
		},
		{
			code: "(x += y) === null",
		},
		{
			code: "(x -= y) === null",
		},
		{
			code: "(a, b, {}) === null",
		},

		// Binary expression with strict comparison to undefined
		{
			code: "({}) !== undefined",
		},
		{
			code: "({}) === undefined",
		},
		{
			code: "([]) === undefined",
		},
		{
			code: "(() => {}) === undefined",
		},
		{
			code: "(function() {}) === undefined",
		},
		{
			code: "(class {}) === undefined",
		},
		{
			code: "new Foo() === undefined",
		},
		{
			code: "`` === undefined",
		},
		{
			code: "1 === undefined",
		},
		{
			code: "'hello' === undefined",
		},
		{
			code: "/[a-z]/ === undefined",
		},
		{
			code: "true === undefined",
		},
		{
			code: "null === undefined",
		},
		{
			code: "a++ === undefined",
		},
		{
			code: "++a === undefined",
		},
		{
			code: "--a === undefined",
		},
		{
			code: "a-- === undefined",
		},
		{
			code: "!a === undefined",
		},
		{
			code: "typeof a === undefined",
		},
		{
			code: "delete a === undefined",
		},
		{
			code: "void a === undefined",
		},
		{
			code: "undefined === undefined",
		},
		{
			code: "(x = {}) === undefined",
		},
		{
			code: "(x += y) === undefined",
		},
		{
			code: "(x -= y) === undefined",
		},
		{
			code: "(a, b, {}) === undefined",
		},

		/*
		 * If both sides are newly constructed objects, we can tell they will
		 * never be equal, even with == equality.
		 */
		{ code: "[a] == [a]",},
		{ code: "[a] != [a]",},
		{ code: "({}) == []",},

		// Comparing to always new objects
		{ code: "x === {}",},
		{ code: "x !== {}",},
		{ code: "x === []",},
		{ code: "x === (() => {})",},
		{ code: "x === (function() {})",},
		{ code: "x === (class {})",},
		{ code: "x === new Boolean()",},
		{
			code: "x === new Promise()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "x === new WeakSet()",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "x === (foo, {})",},
		{ code: "x === (y = {})",},
		{ code: "x === (y ? {} : [])",},
		{ code: "x === /[a-z]/",},

		// It's not obvious what this does, but it compares the old value of `x` to the new object.
		{ code: "x === (x = {})",},

		{
			code: "window.abc && false && anything",
		},
		{
			code: "window.abc || true || anything",
		},
		{
			code: "window.abc ?? 'non-nullish' ?? anything",
		},
	],
};
