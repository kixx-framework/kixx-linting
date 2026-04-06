export default {
	valid: ["if (x === null) { }", "if (null === f()) { }"],
	invalid: [
		{
			code: "if (x == null) { }",
		},
		{
			code: "if (x != null) { }",
		},
		{
			code: "do {} while (null == x)",
		},
	],
};
