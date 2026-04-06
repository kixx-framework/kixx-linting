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
