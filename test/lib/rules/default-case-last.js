export default {
	valid: [
		"switch (foo) {}",
		"switch (foo) { case 1: bar(); break; }",
		"switch (foo) { case 1: break; }",
		"switch (foo) { case 1: }",
		"switch (foo) { case 1: bar(); break; case 2: baz(); break; }",
		"switch (foo) { case 1: break; case 2: break; }",
		"switch (foo) { case 1: case 2: break; }",
		"switch (foo) { case 1: case 2: }",
		"switch (foo) { default: bar(); break; }",
		"switch (foo) { default: bar(); }",
		"switch (foo) { default: break; }",
		"switch (foo) { default: }",
		"switch (foo) { case 1: break; default: break; }",
		"switch (foo) { case 1: break; default: }",
		"switch (foo) { case 1: default: break; }",
		"switch (foo) { case 1: default: }",
		"switch (foo) { case 1: baz(); break; case 2: quux(); break; default: quuux(); break; }",
		"switch (foo) { case 1: break; case 2: break; default: break; }",
		"switch (foo) { case 1: break; case 2: break; default: }",
		"switch (foo) { case 1: case 2: break; default: break; }",
		"switch (foo) { case 1: break; case 2: default: break; }",
		"switch (foo) { case 1: break; case 2: default: }",
		"switch (foo) { case 1: case 2: default: }",
	],

	invalid: [
		{
			code: "switch (foo) { default: bar(); break; case 1: baz(); break; }",
		},
		{
			code: "switch (foo) { default: break; case 1: break; }",
		},
		{
			code: "switch (foo) { default: break; case 1: }",
		},
		{
			code: "switch (foo) { default: case 1: break; }",
		},
		{
			code: "switch (foo) { default: case 1: }",
		},
		{
			code: "switch (foo) { default: break; case 1: break; case 2: break; }",
		},
		{
			code: "switch (foo) { default: case 1: break; case 2: break; }",
		},
		{
			code: "switch (foo) { default: case 1: case 2: break; }",
		},
		{
			code: "switch (foo) { default: case 1: case 2: }",
		},
		{
			code: "switch (foo) { case 1: break; default: break; case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: default: break; case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: break; default: case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: default: case 2: break; }",
		},
		{
			code: "switch (foo) { case 1: default: case 2: }",
		},
	],
};
