export default {
	valid: [
		...getBasicValidTests(),

		// out of scope for the code path analysis and consequently out of scope for this rule
		"while (false) { foo(); }",
		"while (bar) { foo(); if (true) { break; } }",
		"do foo(); while (false)",
		"for (x = 1; x < 10; i++) { if (x > 0) { foo(); throw err; } }",
		"for (x of []);",
		"for (x of [1]);",

		// doesn't report unreachable loop statements, regardless of whether they would be valid or not in a reachable position
		"function foo() { return; while (a); }",
		"function foo() { return; while (a) break; }",
		"while(true); while(true);",
		"while(true); while(true) break;",

		// "ignore"
		{
			code: "while (a) break;",
			options: [{ ignore: ["WhileStatement"] }],
		},
		{
			code: "do break; while (a)",
			options: [{ ignore: ["DoWhileStatement"] }],
		},
		{
			code: "for (a; b; c) break;",
			options: [{ ignore: ["ForStatement"] }],
		},
		{
			code: "for (a in b) break;",
			options: [{ ignore: ["ForInStatement"] }],
		},
		{
			code: "for (a of b) break;",
			options: [{ ignore: ["ForOfStatement"] }],
		},
		{
			code: "for (var key in obj) { hasEnumerableProperties = true; break; } for (const a of b) break;",
			options: [{ ignore: ["ForInStatement", "ForOfStatement"] }],
		},
	],

	invalid: [
		...getBasicInvalidTests(),

		// invalid loop nested in a valid loop (valid in valid, and valid in invalid are covered by basic tests)
		{
			code: "while (foo) { for (a of b) { if (baz) { break; } else { throw err; } } }",
		},
		{
			code: "lbl: for (var i = 0; i < 10; i++) { while (foo) break lbl; } /* outer is valid because inner can have 0 iterations */",
		},

		// invalid loop nested in another invalid loop
		{
			code: "for (a in b) { while (foo) { if(baz) { break; } else { break; } } break; }",
		},

		// loop and nested loop both invalid because of the same exit statement
		{
			code: "function foo() { for (var i = 0; i < 10; i++) { do { return; } while(i) } }",
		},
		{
			code: "lbl: while(foo) { do { break lbl; } while(baz) }",
		},

		// inner loop has continue, but to an outer loop
		{
			code: "lbl: for (a in b) { while(foo) { continue lbl; } }",
		},

		// edge cases - inner loop has only one exit path, but at the same time it exits the outer loop in the first iteration
		{
			code: "for (a of b) { for(;;) { if (foo) { throw err; } } }",
		},
		{
			code: "function foo () { for (a in b) { while (true) { if (bar) { return; } } } }",
		},

		// edge cases where parts of the loops belong to the same code path segment, tests for false negatives
		{
			code: "do for (var i = 1; i < 10; i++) break; while(foo)",
		},
		{
			code: "do { for (var i = 1; i < 10; i++) continue; break; } while(foo)",
		},
		{
			code: "for (;;) { for (var i = 1; i < 10; i ++) break; if (foo) break; continue; }",
		},

		// "ignore"
		{
			code: "while (a) break; do break; while (b); for (;;) break; for (c in d) break; for (e of f) break;",
			options: [{ ignore: [] }],
		},
		{
			code: "while (a) break;",
			options: [{ ignore: ["DoWhileStatement"] }],
		},
		{
			code: "do break; while (a)",
			options: [{ ignore: ["WhileStatement"] }],
		},
		{
			code: "for (a in b) break; for (c of d) break;",
			options: [{ ignore: ["ForStatement"] }],
		},
		{
			code: "for (a in b) break; for (;;) break; for (c of d) break;",
			options: [{ ignore: ["ForInStatement", "ForOfStatement"] }],
		},
	],
};
