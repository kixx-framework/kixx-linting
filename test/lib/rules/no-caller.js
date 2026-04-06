export default {
	valid: [
		"var x = arguments.length",
		"var x = arguments",
		"var x = arguments[0]",
		"var x = arguments[caller]",
	],
	invalid: [
		{
			code: "var x = arguments.callee",
		},
		{
			code: "var x = arguments.caller",
		},
	],
};
