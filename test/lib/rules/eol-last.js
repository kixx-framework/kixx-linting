export default {
	valid: [
		"",
		"\n",
		"var a = 123;\n",
		"var a = 123;\n\n",
		"var a = 123;\n   \n",

		"\r\n",
		"var a = 123;\r\n",
		"var a = 123;\r\n\r\n",
		"var a = 123;\r\n   \r\n",

		{ code: "var a = 123;", options: ["never"] },
		{ code: "var a = 123;\nvar b = 456;", options: ["never"] },
		{ code: "var a = 123;\r\nvar b = 456;", options: ["never"] },

		// Deprecated: `"unix"` parameter
		{ code: "", options: ["unix"] },
		{ code: "\n", options: ["unix"] },
		{ code: "var a = 123;\n", options: ["unix"] },
		{ code: "var a = 123;\n\n", options: ["unix"] },
		{ code: "var a = 123;\n   \n", options: ["unix"] },

		// Deprecated: `"windows"` parameter
		{ code: "", options: ["windows"] },
		{ code: "\n", options: ["windows"] },
		{ code: "\r\n", options: ["windows"] },
		{ code: "var a = 123;\r\n", options: ["windows"] },
		{ code: "var a = 123;\r\n\r\n", options: ["windows"] },
		{ code: "var a = 123;\r\n   \r\n", options: ["windows"] },
	],

	invalid: [
		{
			code: "var a = 123;",
		},
		{
			code: "var a = 123;\n   ",
		},
		{
			code: "var a = 123;\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\r\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\r\n\r\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\nvar b = 456;\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\r\nvar b = 456;\r\n",
			options: ["never"],
		},
		{
			code: "var a = 123;\n\n",
			options: ["never"],
		},

		// Deprecated: `"unix"` parameter
		{
			code: "var a = 123;",
			options: ["unix"],
		},
		{
			code: "var a = 123;\n   ",
			options: ["unix"],
		},

		// Deprecated: `"windows"` parameter
		{
			code: "var a = 123;",
			options: ["windows"],
		},
		{
			code: "var a = 123;\r\n   ",
			options: ["windows"],
		},
	],
};
