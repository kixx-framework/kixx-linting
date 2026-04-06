export default {
	valid: [
		"typeof foo === 'string'",
		"typeof foo === 'object'",
		"typeof foo === 'function'",
		"typeof foo === 'undefined'",
		"typeof foo === 'boolean'",
		"typeof foo === 'number'",
		"typeof foo === 'bigint'",
		"'string' === typeof foo",
		"'object' === typeof foo",
		"'function' === typeof foo",
		"'undefined' === typeof foo",
		"'boolean' === typeof foo",
		"'number' === typeof foo",
		"typeof foo === typeof bar",
		"typeof foo === baz",
		"typeof foo !== someType",
		"typeof bar != someType",
		"someType === typeof bar",
		"someType == typeof bar",
		"typeof foo == 'string'",
		"typeof(foo) === 'string'",
		"typeof(foo) !== 'string'",
		"typeof(foo) == 'string'",
		"typeof(foo) != 'string'",
		"var oddUse = typeof foo + 'thing'",
		"function f(undefined) { typeof x === undefined }",
		{
			code: "typeof foo === 'number'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: 'typeof foo === "number"',
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "var baz = typeof foo + 'thing'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === typeof bar",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === `string`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "`object` === typeof foo",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo === `str${somethingElse}`",
			languageOptions: { ecmaVersion: 6 },
		},
	],

	invalid: [
		{
			code: "typeof foo === 'strnig'",
		},
		{
			code: "'strnig' === typeof foo",
		},
		{
			code: "if (typeof bar === 'umdefined') {}",
		},
		{
			code: "typeof foo !== 'strnig'",
		},
		{
			code: "'strnig' !== typeof foo",
		},
		{
			code: "if (typeof bar !== 'umdefined') {}",
		},
		{
			code: "typeof foo != 'strnig'",
		},
		{
			code: "'strnig' != typeof foo",
		},
		{
			code: "if (typeof bar != 'umdefined') {}",
		},
		{
			code: "typeof foo == 'strnig'",
		},
		{
			code: "'strnig' == typeof foo",
		},
		{
			code: "if (typeof bar == 'umdefined') {}",
		},
		{
			code: "if (typeof bar === `umdefined`) {}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo == 'invalid string'",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "if (typeof bar !== undefined) {}",
		},
		{
			code: "typeof foo == Object",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === undefined",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "undefined === typeof foo",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "undefined == typeof foo",
			options: [{ requireStringLiterals: true }],
		},
		{
			code: "typeof foo === `undefined${foo}`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "typeof foo === `${string}`",
			options: [{ requireStringLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
