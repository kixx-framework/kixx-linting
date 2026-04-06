export default {
	valid: [
		"arguments;",
		"function foo(arguments) { arguments; }",
		"function foo() { var arguments; arguments; }",
		"var foo = () => arguments;", // Arrows don't have "arguments".,
		"function foo(...args) { args; }",
		"function foo() { arguments.length; }",
		"function foo() { arguments.callee; }",
	],
	invalid: [
		{
			code: "function foo() { arguments; }",
		},
		{
			code: "function foo() { arguments[0]; }",
		},
		{
			code: "function foo() { arguments[1]; }",
		},
		{
			code: "function foo() { arguments[Symbol.iterator]; }",
		},
	],
};
