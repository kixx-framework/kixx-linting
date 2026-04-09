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
		"foo(a => a);",
		"foo(function*() {});",
		"foo(function() { this; });",
		{
			code: "foo(function bar() {});",
			options: [{ allowNamedFunctions: true }],
		},
		"foo(function() { (() => this); });",
		"foo(function() { this; }.bind(obj));",
		"foo(function() { this; }.call(this));",
		"foo(a => { (function() {}); });",
		"var foo = function foo() {};",
		"(function foo() {})();",
		"foo(function bar() { bar; });",
		"foo(function bar() { arguments; });",
		"foo(function bar() { arguments; }.bind(this));",
		"foo(function bar() { new.target; });",
		"foo(function bar() { new.target; }.bind(this));",
		"foo(function bar() { this; }.bind(this, somethingElse));",
		"foo((function() {}).bind.bar)",
		"foo((function() { this.bar(); }).bind(obj).bind(this))",
	],
	invalid: [
		{
			code: "foo(function bar() {});",
		},
		{
			code: "foo(function() {});",
			options: [{ allowNamedFunctions: true }],
		},
		{
			code: "foo(function bar() {});",
			options: [{ allowNamedFunctions: false }],
		},
		{
			code: "foo(function() {});",
		},
		{
			code: "foo(nativeCb || function() {});",
		},
		{
			code: "foo(bar ? function() {} : function() {});",
		},
		{
			code: "foo(function() { (function() { this; }); });",
		},
		{
			code: "foo(function() { this; }.bind(this));",
		},
		{
			code: "foo(bar || function() { this; }.bind(this));",
		},
		{
			code: "foo(function() { (() => this); }.bind(this));",
		},
		{
			code: "foo(function bar(a) { a; });",
		},
		{
			code: "foo(function(a) { a; });",
		},
		{
			code: "foo(function(arguments) { arguments; });",
		},
		{
			code: "foo(function() { this; });",
			options: [{ allowUnboundThis: false }],
		},
		{
			code: "foo(function() { (() => this); });",
			options: [{ allowUnboundThis: false }],
		},
		{
			code: "qux(function(foo, bar, baz) { return foo * 2; })",
		},
		{
			code: "qux(function(foo, bar, baz) { return foo * bar; }.bind(this))",
		},
		{
			code: "qux(function(foo, bar, baz) { return foo * this.qux; }.bind(this))",
		},
		{
			code: "foo(function() {}.bind(this, somethingElse))",
		},
		{
			code: "qux(function(foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) { return foo + bar; });",
		},
		{
			code: "qux(function(baz, baz) { })",
		},
		{
			code: "qux(function( /* no params */ ) { })",
		},
		{
			code: "qux(function( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) { return foo; })",
		},
		{
			code: "qux(async function (foo = 1, bar = 2, baz = 3) { return baz; })",
		},
		{
			code: "qux(async function (foo = 1, bar = 2, baz = 3) { return this; }.bind(this))",
		},
		{
			code: "foo((bar || function() {}).bind(this))",
		},
		{
			code: "foo(function() {}.bind(this).bind(obj))",
		},

		// Optional chaining
		{
			code: "foo?.(function() {});",
		},
		{
			code: "foo?.(function() { return this; }.bind(this));",
		},
		{
			code: "foo(function() { return this; }?.bind(this));",
		},
		{
			code: "foo((function() { return this; }?.bind)(this));",
		},

		// https://github.com/eslint/eslint/issues/16718
		{
			code: `
            test(
                function ()
                { }
            );
            `,
		},
		{
			code: `
            test(
                function (
                    ...args
                ) /* Lorem ipsum
                dolor sit amet. */ {
                    return args;
                }
            );
            `,
		},
	],
};
