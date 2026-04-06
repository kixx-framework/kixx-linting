export default {
	valid: ["var x = 2.5;", 'var x = "2.5";'],
	invalid: [
		{
			code: "var x = .5;",
		},
		{
			code: "var x = -.5;",
		},
		{
			code: "var x = 2.;",
		},
		{
			code: "var x = -2.;",
		},
		{
			code: "typeof.2",
		},
		{
			code: "for(foo of.2);",
			languageOptions: { ecmaVersion: 2015 },
		},
	],
};
