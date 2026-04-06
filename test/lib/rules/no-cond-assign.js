export default {
	valid: [
		"var x = 0; if (x == 0) { var b = 1; }",
		{ code: "var x = 0; if (x == 0) { var b = 1; }", options: ["always"] },
		"var x = 5; while (x < 5) { x = x + 1; }",
		"if ((someNode = someNode.parentNode) !== null) { }",
		{
			code: "if ((someNode = someNode.parentNode) !== null) { }",
			options: ["except-parens"],
		},
		"if ((a = b));",
		"while ((a = b));",
		"do {} while ((a = b));",
		"for (;(a = b););",
		"for (;;) {}",
		"if (someNode || (someNode = parentNode)) { }",
		"while (someNode || (someNode = parentNode)) { }",
		"do { } while (someNode || (someNode = parentNode));",
		"for (;someNode || (someNode = parentNode););",
		{
			code: "if ((function(node) { return node = parentNode; })(someNode)) { }",
			options: ["except-parens"],
		},
		{
			code: "if ((function(node) { return node = parentNode; })(someNode)) { }",
			options: ["always"],
		},
		{
			code: "if ((node => node = parentNode)(someNode)) { }",
			options: ["except-parens"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if ((node => node = parentNode)(someNode)) { }",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if (function(node) { return node = parentNode; }) { }",
			options: ["except-parens"],
		},
		{
			code: "if (function(node) { return node = parentNode; }) { }",
			options: ["always"],
		},
		{ code: "x = 0;", options: ["always"] },
		"var x; var b = (x === 0) ? 1 : 0;",
		{
			code: "switch (foo) { case a = b: bar(); }",
			options: ["except-parens"],
		},
		{ code: "switch (foo) { case a = b: bar(); }", options: ["always"] },
		{
			code: "switch (foo) { case baz + (a = b): bar(); }",
			options: ["always"],
		},
	],
	invalid: [
		{
			code: "var x; if (x = 0) { var b = 1; }",
		},
		{
			code: "var x; while (x = 0) { var b = 1; }",
		},
		{
			code: "var x = 0, y; do { y = x; } while (x = x + 1);",
		},
		{
			code: "var x; for(; x+=1 ;){};",
		},
		{
			code: "var x; if ((x) = (0));",
		},
		{
			code: "if (someNode || (someNode = parentNode)) { }",
			options: ["always"],
		},
		{
			code: "while (someNode || (someNode = parentNode)) { }",
			options: ["always"],
		},
		{
			code: "do { } while (someNode || (someNode = parentNode));",
			options: ["always"],
		},
		{
			code: "for (; (typeof l === 'undefined' ? (l = 0) : l); i++) { }",
			options: ["always"],
		},
		{
			code: "if (x = 0) { }",
			options: ["always"],
		},
		{
			code: "while (x = 0) { }",
			options: ["always"],
		},
		{
			code: "do { } while (x = x + 1);",
			options: ["always"],
		},
		{
			code: "for(; x = y; ) { }",
			options: ["always"],
		},
		{
			code: "if ((x = 0)) { }",
			options: ["always"],
		},
		{
			code: "while ((x = 0)) { }",
			options: ["always"],
		},
		{
			code: "do { } while ((x = x + 1));",
			options: ["always"],
		},
		{
			code: "for(; (x = y); ) { }",
			options: ["always"],
		},
		{
			code: "var x; var b = (x = 0) ? 1 : 0;",
		},
		{
			code: "var x; var b = x && (y = 0) ? 1 : 0;",
			options: ["always"],
		},
		{
			code: "(((3496.29)).bkufyydt = 2e308) ? foo : bar;",
		},
	],
};
