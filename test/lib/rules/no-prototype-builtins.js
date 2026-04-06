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
		"Object.prototype.hasOwnProperty.call(foo, 'bar')",
		"Object.prototype.isPrototypeOf.call(foo, 'bar')",
		"Object.prototype.propertyIsEnumerable.call(foo, 'bar')",
		"Object.prototype.hasOwnProperty.apply(foo, ['bar'])",
		"Object.prototype.isPrototypeOf.apply(foo, ['bar'])",
		"Object.prototype.propertyIsEnumerable.apply(foo, ['bar'])",
		"foo.hasOwnProperty",
		"foo.hasOwnProperty.bar()",
		"foo(hasOwnProperty)",
		"hasOwnProperty(foo, 'bar')",
		"isPrototypeOf(foo, 'bar')",
		"propertyIsEnumerable(foo, 'bar')",
		"({}.hasOwnProperty.call(foo, 'bar'))",
		"({}.isPrototypeOf.call(foo, 'bar'))",
		"({}.propertyIsEnumerable.call(foo, 'bar'))",
		"({}.hasOwnProperty.apply(foo, ['bar']))",
		"({}.isPrototypeOf.apply(foo, ['bar']))",
		"({}.propertyIsEnumerable.apply(foo, ['bar']))",
		"foo[hasOwnProperty]('bar')",
		"foo['HasOwnProperty']('bar')",
		{
			code: "foo[`isPrototypeOff`]('bar')",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "foo?.['propertyIsEnumerabl']('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		"foo[1]('bar')",
		"foo[null]('bar')",
		{
			code: "class C { #hasOwnProperty; foo() { obj.#hasOwnProperty('bar'); } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// out of scope for this rule
		"foo['hasOwn' + 'Property']('bar')",
		{
			code: "foo[`hasOwnProperty${''}`]('bar')",
			languageOptions: { ecmaVersion: 2015 },
		},
	],

	invalid: [
		{
			code: "foo.hasOwnProperty('bar')",
		},
		{
			code: "foo.isPrototypeOf('bar')",
		},
		{
			code: "foo.propertyIsEnumerable('bar')",
		},
		{
			code: "foo.bar.hasOwnProperty('bar')",
		},
		{
			code: "foo.bar.baz.isPrototypeOf('bar')",
		},
		{
			code: "foo['hasOwnProperty']('bar')",
		},
		{
			code: "foo[`isPrototypeOf`]('bar').baz",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: String.raw`foo.bar["propertyIsEnumerable"]('baz')`,
		},
		{
			// Can't suggest Object.prototype when Object is shadowed
			code: "(function(Object) {return foo.hasOwnProperty('bar');})",
		},
		{
			name: "Can't suggest Object.prototype when there is no Object global variable",
			code: "foo.hasOwnProperty('bar')",
			languageOptions: {
				globals: {
					Object: "off",
				},
			},
		},

		// Optional chaining
		{
			code: "foo?.hasOwnProperty('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo?.bar.hasOwnProperty('baz')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.hasOwnProperty?.('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			/*
			 * If hasOwnProperty is part of a ChainExpression
			 * and the optional part is before it, then don't suggest the fix
			 */
			code: "foo?.hasOwnProperty('bar').baz",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			/*
			 * If hasOwnProperty is part of a ChainExpression
			 * but the optional part is after it, then the fix is safe
			 */
			code: "foo.hasOwnProperty('bar')?.baz",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(a,b).hasOwnProperty('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			// No suggestion where no-unsafe-optional-chaining is reported on the call
			code: "(foo?.hasOwnProperty)('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(foo?.hasOwnProperty)?.('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo?.['hasOwnProperty']('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			// No suggestion where no-unsafe-optional-chaining is reported on the call
			code: "(foo?.[`hasOwnProperty`])('bar')",
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
