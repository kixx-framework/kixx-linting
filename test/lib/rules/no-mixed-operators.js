export default {
	valid: [
		"a && b && c && d",
		"a || b || c || d",
		"(a || b) && c && d",
		"a || (b && c && d)",
		"(a || b || c) && d",
		"a || b || (c && d)",
		"a + b + c + d",
		"a * b * c * d",
		"a == 0 && b == 1",
		"a == 0 || b == 1",
		{
			code: "(a == 0) && (b == 1)",
			options: [{ groups: [["&&", "=="]] }],
		},
		{
			code: "a + b - c * d / e",
			options: [{ groups: [["&&", "||"]] }],
		},
		"a + b - c",
		"a * b / c",
		{
			code: "a + b - c",
			options: [{ allowSamePrecedence: true }],
		},
		{
			code: "a * b / c",
			options: [{ allowSamePrecedence: true }],
		},
		{
			code: "(a || b) ? c : d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a ? (b || c) : d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a ? b : (c || d)",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a || (b ? c : d)",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "(a ? b : c) || d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		"a || (b ? c : d)",
		"(a || b) ? c : d",
		"a || b ? c : d",
		"a ? (b || c) : d",
		"a ? b || c : d",
		"a ? b : (c || d)",
		"a ? b : c || d",
	],
	invalid: [
		{
			code: "a && b || c",
		},
		{
			code: "a && b > 0 || c",
			options: [{ groups: [["&&", "||", ">"]] }],
		},
		{
			code: "a && b > 0 || c",
			options: [{ groups: [["&&", "||"]] }],
		},
		{
			code: "a && b + c - d / e || f",
			options: [
				{
					groups: [
						["&&", "||"],
						["+", "-", "*", "/"],
					],
				},
			],
		},
		{
			code: "a && b + c - d / e || f",
			options: [
				{
					groups: [
						["&&", "||"],
						["+", "-", "*", "/"],
					],
					allowSamePrecedence: true,
				},
			],
		},
		{
			code: "a + b - c",
			options: [{ allowSamePrecedence: false }],
		},
		{
			code: "a * b / c",
			options: [{ allowSamePrecedence: false }],
		},
		{
			code: "a || b ? c : d",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a && b ? 1 : 2",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "x ? a && b : 0",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "x ? 0 : a && b",
			options: [{ groups: [["&&", "||", "?:"]] }],
		},
		{
			code: "a + b ?? c",
			options: [{ groups: [["+", "??"]] }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
