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
		"if (foo) { bar() }",
		"while (foo) { bar() }",
		"for (;foo;) { bar() }",
		"try { foo() } catch (ex) { foo() }",
		"switch(foo) {case 'foo': break;}",
		"(function() { }())",
		{ code: "var foo = () => {};", languageOptions: { ecmaVersion: 6 } },
		"function foo() { }",
		"if (foo) {/* empty */}",
		"while (foo) {/* empty */}",
		"switch (foo) {/* empty */}",
		"for (;foo;) {/* empty */}",
		"try { foo() } catch (ex) {/* empty */}",
		"try { foo() } catch (ex) {// empty\n}",
		"try { foo() } finally {// empty\n}",
		"try { foo() } finally {// test\n}",
		"try { foo() } finally {\n \n // hi i am off no use\n}",
		"try { foo() } catch (ex) {/* test111 */}",
		"if (foo) { bar() } else { // nothing in me \n}",
		"if (foo) { bar() } else { /**/ \n}",
		"if (foo) { bar() } else { // \n}",
		{
			code: "try { foo(); } catch (ex) {}",
			options: [{ allowEmptyCatch: true }],
		},
		{
			code: "try { foo(); } catch (ex) {} finally { bar(); }",
			options: [{ allowEmptyCatch: true }],
		},
	],
	invalid: [
		{
			code: "try {} catch (ex) {throw ex}",
		},
		{
			code: "try { foo() } catch (ex) {}",
		},
		{
			code: "try { foo() } catch (ex) {throw ex} finally {}",
		},
		{
			code: "if (foo) {}",
		},
		{
			code: "while (foo) {}",
		},
		{
			code: "for (;foo;) {}",
		},
		{
			code: "switch(foo) {}",
		},
		{
			code: "switch /* empty */ (/* empty */ foo /* empty */) /* empty */ {} /* empty */",
		},
		{
			code: "try {} catch (ex) {}",
			options: [{ allowEmptyCatch: true }],
		},
		{
			code: "try { foo(); } catch (ex) {} finally {}",
			options: [{ allowEmptyCatch: true }],
		},
		{
			code: "try {} catch (ex) {} finally {}",
			options: [{ allowEmptyCatch: true }],
		},
		{
			code: "try { foo(); } catch (ex) {} finally {}",
		},
	],
};
