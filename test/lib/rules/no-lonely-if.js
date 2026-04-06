export default {
	// Examples of code that should not trigger the rule
	valid: [
		"if (a) {;} else if (b) {;}",
		"if (a) {;} else { if (b) {;} ; }",
		"if (a) if (a) {} else { if (b) {} } else {}",
	],

	// Examples of code that should trigger the rule
	invalid: [
		{
			code: "if (a) {;} else { if (b) {;} }",
		},
		{
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
		},
		{
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else /* comment */ {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
		},
		{
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  /* otherwise, do the other thing */ if (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
		},
		{
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if /* this comment is ok */ (b) {\n" +
				"    bar();\n" +
				"  }\n" +
				"}",
		},
		{
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  } /* this comment will prevent this test case from being autofixed. */\n" +
				"}",
		},
		{
			code: "if (foo) {} else { if (bar) baz(); }",
		},
		{
			// Not fixed; removing the braces would cause a SyntaxError.
			code: "if (foo) {} else { if (bar) baz() } qux();",
		},
		{
			// This is fixed because there is a semicolon after baz().
			code: "if (foo) {} else { if (bar) baz(); } qux();",
		},
		{
			// Not fixed; removing the braces would change the semantics due to ASI.
			code:
				"if (foo) {\n" +
				"} else {\n" +
				"  if (bar) baz()\n" +
				"}\n" +
				"[1, 2, 3].forEach(foo);",
		},
		{
			// Not fixed; removing the braces would change the semantics due to ASI.
			code:
				"if (foo) {\n" +
				"} else {\n" +
				"  if (bar) baz++\n" +
				"}\n" +
				"foo;",
		},
		{
			// This is fixed because there is a semicolon after baz++
			code:
				"if (foo) {\n" +
				"} else {\n" +
				"  if (bar) baz++;\n" +
				"}\n" +
				"foo;",
		},
		{
			// Not fixed; bar() would be interpreted as a template literal tag
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) bar()\n" +
				"}\n" +
				"`template literal`;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code:
				"if (a) {\n" +
				"  foo();\n" +
				"} else {\n" +
				"  if (b) {\n" +
				"    bar();\n" +
				"  } else if (c) {\n" +
				"    baz();\n" +
				"  } else {\n" +
				"    qux();\n" +
				"  }\n" +
				"}",
		},
	],
};
