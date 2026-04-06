export default {
	valid: [
		"var foo = 0; foo=+1;",

		// With "allowForLoopAfterthoughts" allowed
		{
			code: "var foo = 0; foo=+1;",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (i = 0; i < l; i++) { console.log(i); }",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (var i = 0, j = i + 1; j < example.length; i++, j++) {}",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i--, foo());",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo(), --i);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo(), ++i, bar);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i++, (++j, k--));",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo(), (bar(), i++), baz());",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; (--i, j += 2), bar = j + 1);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; a, (i--, (b, ++j, c)), d);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
	],

	invalid: [
		{
			code: "var foo = 0; foo++;",
		},
		{
			code: "var foo = 0; foo--;",
		},
		{
			code: "for (i = 0; i < l; i++) { console.log(i); }",
		},
		{
			code: "for (i = 0; i < l; foo, i++) { console.log(i); }",
		},

		// With "allowForLoopAfterthoughts" allowed
		{
			code: "var foo = 0; foo++;",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (i = 0; i < l; i++) { v++; }",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (i++;;);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;--i;);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;;) ++i;",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i = j++);",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; i++, f(--j));",
			options: [{ allowForLoopAfterthoughts: true }],
		},
		{
			code: "for (;; foo + (i++, bar));",
			options: [{ allowForLoopAfterthoughts: true }],
		},
	],
};
