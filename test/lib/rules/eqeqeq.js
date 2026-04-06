export default {
	valid: [
		"a === b",
		"a !== b",
		{ code: "a === b", options: ["always"] },
		{ code: "typeof a == 'number'", options: ["smart"] },
		{ code: "'string' != typeof a", options: ["smart"] },
		{ code: "'hello' != 'world'", options: ["smart"] },
		{ code: "2 == 3", options: ["smart"] },
		{ code: "true == true", options: ["smart"] },
		{ code: "null == a", options: ["smart"] },
		{ code: "a == null", options: ["smart"] },
		{ code: "null == a", options: ["allow-null"] },
		{ code: "a == null", options: ["allow-null"] },
		{ code: "a == null", options: ["always", { null: "ignore" }] },
		{ code: "a != null", options: ["always", { null: "ignore" }] },
		{ code: "a !== null", options: ["always", { null: "ignore" }] },
		{ code: "a === null", options: ["always", { null: "always" }] },
		{ code: "a !== null", options: ["always", { null: "always" }] },
		{ code: "null === null", options: ["always", { null: "always" }] },
		{ code: "null !== null", options: ["always", { null: "always" }] },
		{ code: "a == null", options: ["always", { null: "never" }] },
		{ code: "a != null", options: ["always", { null: "never" }] },
		{ code: "null == null", options: ["always", { null: "never" }] },
		{ code: "null != null", options: ["always", { null: "never" }] },

		// https://github.com/eslint/eslint/issues/8020
		{
			code: "foo === /abc/u",
			options: ["always", { null: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// bigint
		{
			code: "foo === 1n",
			options: ["always", { null: "never" }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		{
			code: "a == b",
		},
		{
			code: "a != b",
		},
		{
			code: "typeof a == 'number'",
		},
		{
			code: "typeof a == 'number'",
			options: ["always"],
		},
		{
			code: "'string' != typeof a",
		},
		{
			code: "true == true",
		},
		{
			code: "2 == 3",
		},
		{
			code: "2 == 3",
			options: ["always"],
		},
		{
			code: "'hello' != 'world'",
		},
		{
			code: "'hello' != 'world'",
			options: ["always"],
		},
		{
			code: "a == null",
		},
		{
			code: "a == null",
			options: ["always"],
		},
		{
			code: "null != a",
		},
		{
			code: "true == 1",
			options: ["smart"],
		},
		{
			code: "0 != '1'",
			options: ["smart"],
		},
		{
			code: "'wee' == /wee/",
			options: ["smart"],
		},
		{
			code: "typeof a == 'number'",
			options: ["allow-null"],
		},
		{
			code: "'string' != typeof a",
			options: ["allow-null"],
		},
		{
			code: "'hello' != 'world'",
			options: ["allow-null"],
		},
		{
			code: "2 == 3",
			options: ["allow-null"],
		},
		{
			code: "true == true",
			options: ["allow-null"],
		},
		{
			code: "true == null",
			options: ["always", { null: "always" }],
		},
		{
			code: "true != null",
			options: ["always", { null: "always" }],
		},
		{
			code: "null == null",
			options: ["always", { null: "always" }],
		},
		{
			code: "null != null",
			options: ["always", { null: "always" }],
		},
		{
			code: "true === null",
			options: ["always", { null: "never" }],
		},
		{
			code: "true !== null",
			options: ["always", { null: "never" }],
		},
		{
			code: "null === null",
			options: ["always", { null: "never" }],
		},
		{
			code: "null !== null",
			options: ["always", { null: "never" }],
		},
		{
			code: "a\n==\nb",
		},
		{
			code: "(a) == b",
		},
		{
			code: "(a) != b",
		},
		{
			code: "a == (b)",
		},
		{
			code: "a != (b)",
		},
		{
			code: "(a) == (b)",
		},
		{
			code: "(a) != (b)",
		},
		{
			code: "(a == b) == (c)",
		},
		{
			code: "(a != b) != (c)",
		},

		// location tests
		{
			code: "a == b;",
		},
		{
			code: "a!=b;",
		},
		{
			code: "(a + b) == c;",
		},
		{
			code: "(a + b)  !=  c;",
		},
		{
			code: "((1) )  ==  (2);",
		},
	]
};
