export default {
	valid: [
		"parseInt(1);",
		"parseInt(1, 3);",
		"Number.parseInt(1);",
		"Number.parseInt(1, 3);",
		"0b111110111 === 503;",
		"0o767 === 503;",
		"0x1F7 === 503;",
		"a[parseInt](1,2);",
		"parseInt(foo);",
		"parseInt(foo, 2);",
		"Number.parseInt(foo);",
		"Number.parseInt(foo, 2);",
		"parseInt(11, 2);",
		"Number.parseInt(1, 8);",
		"parseInt(1e5, 16);",
		"parseInt('11', '2');",
		"Number.parseInt('11', '8');",
		"parseInt(/foo/, 2);",
		"parseInt(`11${foo}`, 2);",
		{
			code: "parseInt('11', 2n);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "Number.parseInt('11', 8n);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "parseInt('11', 16n);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "parseInt(`11`, 16n);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "parseInt(1n, 2);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: 'class C { #parseInt; foo() { Number.#parseInt("111110111", 2); } }',
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: 'parseInt("111110111", 2) === 503;',
		},
		{
			code: 'parseInt("767", 8) === 503;',
		},
		{
			code: 'parseInt("1F7", 16) === 255;',
		},
		{
			code: 'Number.parseInt("111110111", 2) === 503;',
		},
		{
			code: 'Number.parseInt("767", 8) === 503;',
		},
		{
			code: 'Number.parseInt("1F7", 16) === 255;',
		},
		{
			code: "parseInt('7999', 8);",
		},
		{
			code: "parseInt('1234', 2);",
		},
		{
			code: "parseInt('1234.5', 8);",
		},
		{
			code: "parseInt('1️⃣3️⃣3️⃣7️⃣', 16);",
		},
		{
			code: "Number.parseInt('7999', 8);",
		},
		{
			code: "Number.parseInt('1234', 2);",
		},
		{
			code: "Number.parseInt('1234.5', 8);",
		},
		{
			code: "Number.parseInt('1️⃣3️⃣3️⃣7️⃣', 16);",
		},
		{
			code: "parseInt(`111110111`, 2) === 503;",
		},
		{
			code: "parseInt(`767`, 8) === 503;",
		},
		{
			code: "parseInt(`1F7`, 16) === 255;",
		},
		{
			code: "parseInt('', 8);",
		},
		{
			code: "parseInt(``, 8);",
		},
		{
			code: "parseInt(`7999`, 8);",
		},
		{
			code: "parseInt(`1234`, 2);",
		},
		{
			code: "parseInt(`1234.5`, 8);",
		},

		// Adjacent tokens tests
		{
			code: "parseInt('11', 2)",
		},
		{
			code: "Number.parseInt('67', 8)",
		},
		{
			code: "5+parseInt('A', 16)",
		},
		{
			code: "function *f(){ yield(Number).parseInt('11', 2) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *f(){ yield(Number.parseInt)('67', 8) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *f(){ yield(parseInt)('A', 16) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *f(){ yield Number.parseInt('11', 2) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *f(){ yield/**/Number.parseInt('67', 8) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *f(){ yield(parseInt('A', 16)) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "parseInt('11', 2)+5",
		},
		{
			code: "Number.parseInt('17', 8)+5",
		},
		{
			code: "parseInt('A', 16)+5",
		},
		{
			code: "parseInt('11', 2)in foo",
		},
		{
			code: "Number.parseInt('17', 8)in foo",
		},
		{
			code: "parseInt('A', 16)in foo",
		},
		{
			code: "parseInt('11', 2) in foo",
		},
		{
			code: "Number.parseInt('17', 8)/**/in foo",
		},
		{
			code: "(parseInt('A', 16))in foo",
		},

		// Should not autofix if it would remove comments
		{
			code: "/* comment */Number.parseInt('11', 2);",
		},
		{
			code: "Number/**/.parseInt('11', 2);",
		},
		{
			code: "Number//\n.parseInt('11', 2);",
		},
		{
			code: "Number./**/parseInt('11', 2);",
		},
		{
			code: "Number.parseInt(/**/'11', 2);",
		},
		{
			code: "Number.parseInt('11', /**/2);",
		},
		{
			code: "Number.parseInt('11', 2)/* comment */;",
		},
		{
			code: "parseInt/**/('11', 2);",
		},
		{
			code: "parseInt(//\n'11', 2);",
		},
		{
			code: "parseInt('11'/**/, 2);",
		},
		{
			code: "parseInt(`11`/**/, 2);",
		},
		{
			code: "parseInt('11', 2 /**/);",
		},
		{
			code: "parseInt('11', 2)//comment\n;",
		},

		// Optional chaining
		{
			code: 'parseInt?.("1F7", 16) === 255;',
		},
		{
			code: 'Number?.parseInt("1F7", 16) === 255;',
		},
		{
			code: 'Number?.parseInt?.("1F7", 16) === 255;',
		},
		{
			code: '(Number?.parseInt)("1F7", 16) === 255;',
		},
		{
			code: '(Number?.parseInt)?.("1F7", 16) === 255;',
		},

		// `parseInt` doesn't support numeric separators. The rule shouldn't autofix in those cases.
		{
			code: "parseInt('1_0', 2);",
		},
		{
			code: "Number.parseInt('5_000', 8);",
		},
		{
			code: "parseInt('0_1', 16);",
		},
		{
			// this would be indeed the same as `0x0_0`, but there's no need to autofix this edge case that looks more like a mistake.
			code: "Number.parseInt('0_0', 16);",
		},
	],
};
