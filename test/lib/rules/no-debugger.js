export default {
	valid: ["var test = { debugger: 1 }; test.debugger;"],
	invalid: [
		{
			code: "if (foo) debugger",
		},
	],
};
