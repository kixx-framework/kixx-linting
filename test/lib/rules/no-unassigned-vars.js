export default {
	valid: [
		"let x;",
		"var x;",
		"const x = undefined; log(x);",
		"let y = undefined; log(y);",
		"var y = undefined; log(y);",
		"let a = x, b = y; log(a, b);",
		"var a = x, b = y; log(a, b);",
		"const foo = (two) => { let one; if (one !== two) one = two; }",
	],
	invalid: [
		{
			code: "let x; let a = x, b; log(x, a, b);",
		},
		{
			code: "const foo = (two) => { let one; if (one === two) {} }",
		},
		{
			code: "let user; greet(user);",
		},
		{
			code: "function test() { let error; return error || 'Unknown error'; }",
		},
		{
			code: "let options; const { debug } = options || {};",
		},
		{
			code: "let flag; while (!flag) { }",
		},
		{
			code: "let config; function init() { return config?.enabled; }",
		},
	],
};
