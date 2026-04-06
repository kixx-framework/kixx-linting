export default {
	valid: [
		"string = 'hello world';",
		"var string;",
		{ code: "Object = 0;", options: [{ exceptions: ["Object"] }] },
		"top = 0;",
		{ code: "onload = 0;", languageOptions: { globals: globals.browser } },
		"require = 0;",
		{ code: "a = 1", languageOptions: { globals: { a: true } } },
		"/*global a:true*/ a = 1",
	],
	invalid: [
		{
			code: "String = 'hello world';",
		},
		{
			code: "String++;",
		},
		{
			code: "({Object = 0, String = 0} = {});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "top = 0;",
			languageOptions: { globals: globals.browser },
		},
		{
			code: "require = 0;",
			languageOptions: { sourceType: "commonjs" },
		},

		// Notifications of readonly are moved from no-undef: https://github.com/eslint/eslint/issues/4504
		{
			code: "/*global b:false*/ function f() { b = 1; }",
		},
		{
			code: "function f() { b = 1; }",
			languageOptions: { globals: { b: false } },
		},
		{
			code: "/*global b:false*/ function f() { b++; }",
		},
		{
			code: "/*global b*/ b = 1;",
		},
		{
			code: "Array = 1;",
		},
	],
};
