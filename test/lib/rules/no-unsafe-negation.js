export default {
	valid: [
		"a in b",
		"a in b === false",
		"!(a in b)",
		"(!a) in b",
		"a instanceof b",
		"a instanceof b === false",
		"!(a instanceof b)",
		"(!a) instanceof b",

		// tests cases for enforceForOrderingRelations option:
		"if (! a < b) {}",
		"while (! a > b) {}",
		"foo = ! a <= b;",
		"foo = ! a >= b;",
		{
			code: "! a <= b",
			options: [{}],
		},
		{
			code: "foo = ! a >= b;",
			options: [{ enforceForOrderingRelations: false }],
		},
		{
			code: "foo = (!a) >= b;",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "a <= b",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "!(a < b)",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "foo = a > b;",
			options: [{ enforceForOrderingRelations: true }],
		},
	],
	invalid: [
		{
			code: "!a in b",
		},
		{
			code: "(!a in b)",
		},
		{
			code: "!(a) in b",
		},
		{
			code: "!a instanceof b",
		},
		{
			code: "(!a instanceof b)",
		},
		{
			code: "!(a) instanceof b",
		},
		{
			code: "if (! a < b) {}",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "while (! a > b) {}",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "foo = ! a <= b;",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "foo = ! a >= b;",
			options: [{ enforceForOrderingRelations: true }],
		},
		{
			code: "! a <= b",
			options: [{ enforceForOrderingRelations: true }],
		},
	],
};
