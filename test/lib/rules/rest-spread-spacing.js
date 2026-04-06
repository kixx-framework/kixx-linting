export default {
	valid: [
		"fn(...args)",
		"fn(...(args))",
		"fn(...( args ))",
		{ code: "fn(...args)", options: ["never"] },
		{ code: "fn(... args)", options: ["always"] },
		{ code: "fn(...\targs)", options: ["always"] },
		{ code: "fn(...\nargs)", options: ["always"] },
		"[...arr, 4, 5, 6]",
		"[...(arr), 4, 5, 6]",
		"[...( arr ), 4, 5, 6]",
		{ code: "[...arr, 4, 5, 6]", options: ["never"] },
		{ code: "[... arr, 4, 5, 6]", options: ["always"] },
		{ code: "[...\tarr, 4, 5, 6]", options: ["always"] },
		{ code: "[...\narr, 4, 5, 6]", options: ["always"] },
		"let [a, b, ...arr] = [1, 2, 3, 4, 5];",
		{ code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];", options: ["never"] },
		{ code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];", options: ["always"] },
		{
			code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
			options: ["always"],
		},
		{
			code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
			options: ["always"],
		},
		{
			code: "let n = { x, y, ...z };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...(z) };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...( z ) };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...z };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... z };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\tz };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\nz };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
	],

	invalid: [
		{
			code: "fn(... args)",
		},
		{
			code: "fn(...  args)",
		},
		{
			code: "fn(...\targs)",
		},
		{
			code: "fn(... \t args)",
		},
		{
			code: "fn(...\nargs)",
		},
		{
			code: "fn(...\n    args)",
		},
		{
			code: "fn(...\n\targs)",
		},
		{
			code: "fn(... args)",
			options: ["never"],
		},
		{
			code: "fn(...\targs)",
			options: ["never"],
		},
		{
			code: "fn(...\nargs)",
			options: ["never"],
		},
		{
			code: "fn(...args)",
			options: ["always"],
		},
		{
			code: "fn(... (args))",
		},
		{
			code: "fn(... ( args ))",
		},
		{
			code: "fn(...(args))",
			options: ["always"],
		},
		{
			code: "fn(...( args ))",
			options: ["always"],
		},
		{
			code: "[... arr, 4, 5, 6]",
		},
		{
			code: "[...\tarr, 4, 5, 6]",
		},
		{
			code: "[...\narr, 4, 5, 6]",
		},
		{
			code: "[... arr, 4, 5, 6]",
			options: ["never"],
		},
		{
			code: "[...\tarr, 4, 5, 6]",
			options: ["never"],
		},
		{
			code: "[...\narr, 4, 5, 6]",
			options: ["never"],
		},
		{
			code: "[...arr, 4, 5, 6]",
			options: ["always"],
		},
		{
			code: "[... (arr), 4, 5, 6]",
		},
		{
			code: "[... ( arr ), 4, 5, 6]",
		},
		{
			code: "[...(arr), 4, 5, 6]",
			options: ["always"],
		},
		{
			code: "[...( arr ), 4, 5, 6]",
			options: ["always"],
		},
		{
			code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
		},
		{
			code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
		},
		{
			code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
		},
		{
			code: "let [a, b, ... arr] = [1, 2, 3, 4, 5];",
			options: ["never"],
		},
		{
			code: "let [a, b, ...\tarr] = [1, 2, 3, 4, 5];",
			options: ["never"],
		},
		{
			code: "let [a, b, ...\narr] = [1, 2, 3, 4, 5];",
			options: ["never"],
		},
		{
			code: "let [a, b, ...arr] = [1, 2, 3, 4, 5];",
			options: ["always"],
		},
		{
			code: "let n = { x, y, ... z };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\tz };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\nz };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... z };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\tz };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...\nz };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...z };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... (z) };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ... ( z ) };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...(z) };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let n = { x, y, ...( z ) };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\tz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...\nz } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},
	],
};
