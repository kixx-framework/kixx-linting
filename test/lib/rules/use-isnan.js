export default {
	valid: [
		"var x = NaN;",
		"isNaN(NaN) === true;",
		"isNaN(123) !== true;",
		"Number.isNaN(NaN) === true;",
		"Number.isNaN(123) !== true;",
		"foo(NaN + 1);",
		"foo(1 + NaN);",
		"foo(NaN - 1)",
		"foo(1 - NaN)",
		"foo(NaN * 2)",
		"foo(2 * NaN)",
		"foo(NaN / 2)",
		"foo(2 / NaN)",
		"var x; if (x = NaN) { }",
		"var x = Number.NaN;",
		"isNaN(Number.NaN) === true;",
		"Number.isNaN(Number.NaN) === true;",
		"foo(Number.NaN + 1);",
		"foo(1 + Number.NaN);",
		"foo(Number.NaN - 1)",
		"foo(1 - Number.NaN)",
		"foo(Number.NaN * 2)",
		"foo(2 * Number.NaN)",
		"foo(Number.NaN / 2)",
		"foo(2 / Number.NaN)",
		"var x; if (x = Number.NaN) { }",
		"x === Number[NaN];",
		"x === (NaN, 1)",
		"x === (doStuff(), NaN, 1)",
		"x === (doStuff(), Number.NaN, 1)",

		//------------------------------------------------------------------------------
		// enforceForSwitchCase
		//------------------------------------------------------------------------------

		{
			code: "switch(NaN) { case foo: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(foo) { case NaN: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(NaN) { case NaN: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(foo) { case bar: break; case NaN: break; default: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(foo) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: NaN; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { default: NaN; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Nan) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch('NaN') { default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo(NaN)) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo.NaN) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case Nan: break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case 'NaN': break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case foo(NaN): break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case foo.NaN: break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: break; case 1: break; default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.NaN) { case foo: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(foo) { case Number.NaN: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(NaN) { case Number.NaN: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(foo) { case bar: break; case Number.NaN: break; default: break; }",
			options: [{ enforceForSwitchCase: false }],
		},
		{
			code: "switch(foo) { case bar: Number.NaN; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { default: Number.NaN; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.Nan) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch('Number.NaN') { default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo(Number.NaN)) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo.Number.NaN) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case Number.Nan: break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case 'Number.NaN': break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case foo(Number.NaN): break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case foo.Number.NaN: break }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch((NaN, doStuff(), 1)) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch((Number.NaN, doStuff(), 1)) {}",
			options: [{ enforceForSwitchCase: true }],
		},

		//------------------------------------------------------------------------------
		// enforceForIndexOf
		//------------------------------------------------------------------------------

		"foo.indexOf(NaN)",
		"foo.lastIndexOf(NaN)",
		"foo.indexOf(Number.NaN)",
		"foo.lastIndexOf(Number.NaN)",
		{
			code: "foo.indexOf(NaN)",
			options: [{}],
		},
		{
			code: "foo.lastIndexOf(NaN)",
			options: [{}],
		},
		{
			code: "foo.indexOf(NaN)",
			options: [{ enforceForIndexOf: false }],
		},
		{
			code: "foo.lastIndexOf(NaN)",
			options: [{ enforceForIndexOf: false }],
		},
		{
			code: "indexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "lastIndexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "new foo.indexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.bar(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.IndexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo[indexOf](NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo[lastIndexOf](NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "indexOf.foo(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf()",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf()",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(a)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(Nan)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(a, NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(NaN, b, c)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(a, b)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(NaN, NaN, b)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(...NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo.lastIndexOf(NaN())",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(Number.NaN)",
			options: [{}],
		},
		{
			code: "foo.lastIndexOf(Number.NaN)",
			options: [{}],
		},
		{
			code: "foo.indexOf(Number.NaN)",
			options: [{ enforceForIndexOf: false }],
		},
		{
			code: "foo.lastIndexOf(Number.NaN)",
			options: [{ enforceForIndexOf: false }],
		},
		{
			code: "indexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "lastIndexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "new foo.indexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.bar(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.IndexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo[indexOf](Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo[lastIndexOf](Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "indexOf.foo(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(Number.Nan)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(a, Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(Number.NaN, b, c)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(Number.NaN, NaN, b)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf(...Number.NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo.lastIndexOf(Number.NaN())",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf((NaN, 1))",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf((NaN, 1))",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf((Number.NaN, 1))",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf((Number.NaN, 1))",
			options: [{ enforceForIndexOf: true }],
		},
	],
	invalid: [
		{
			code: "123 == NaN;",
		},
		{
			code: "123 === NaN;",
		},
		{
			code: 'NaN === "abc";',
		},
		{
			code: 'NaN == "abc";',
		},
		{
			code: "123 != NaN;",
		},
		{
			code: "123 !== NaN;",
		},
		{
			code: 'NaN !== "abc";',
		},
		{
			code: 'NaN != "abc";',
		},
		{
			code: 'NaN < "abc";',
		},
		{
			code: '"abc" < NaN;',
		},
		{
			code: 'NaN > "abc";',
		},
		{
			code: '"abc" > NaN;',
		},
		{
			code: 'NaN <= "abc";',
		},
		{
			code: '"abc" <= NaN;',
		},
		{
			code: 'NaN >= "abc";',
		},
		{
			code: '"abc" >= NaN;',
		},
		{
			code: "123 == Number.NaN;",
		},
		{
			code: "123 === Number.NaN;",
		},
		{
			code: 'Number.NaN === "abc";',
		},
		{
			code: 'Number.NaN == "abc";',
		},
		{
			code: "123 != Number.NaN;",
		},
		{
			code: "123 !== Number.NaN;",
		},
		{
			code: 'Number.NaN !== "abc";',
		},
		{
			code: 'Number.NaN != "abc";',
		},
		{
			code: 'Number.NaN < "abc";',
		},
		{
			code: '"abc" < Number.NaN;',
		},
		{
			code: 'Number.NaN > "abc";',
		},
		{
			code: '"abc" > Number.NaN;',
		},
		{
			code: 'Number.NaN <= "abc";',
		},
		{
			code: '"abc" <= Number.NaN;',
		},
		{
			code: 'Number.NaN >= "abc";',
		},
		{
			code: '"abc" >= Number.NaN;',
		},
		{
			code: "x === Number?.NaN;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "x !== Number?.NaN;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "x === Number['NaN'];",
		},
		{
			code: `/* just
                adding */ x /* some */ === /* comments */ NaN; // here`,
		},
		{
			code: "(1, 2) === NaN;",
		},
		{
			code: "x === (doStuff(), NaN);",
		},
		{
			code: "x === (doStuff(), Number.NaN);",
		},
		{
			code: "x == (doStuff(), NaN);",
		},
		{
			code: "x == (doStuff(), Number.NaN);",
		},

		//------------------------------------------------------------------------------
		// enforceForSwitchCase
		//------------------------------------------------------------------------------

		{
			code: "switch(NaN) { case foo: break; }",
		},
		{
			code: "switch(foo) { case NaN: break; }",
		},
		{
			code: "switch(NaN) { case foo: break; }",
			options: [{}],
		},
		{
			code: "switch(foo) { case NaN: break; }",
			options: [{}],
		},
		{
			code: "switch(NaN) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(NaN) { case foo: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(NaN) { default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(NaN) { case foo: break; default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case NaN: }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case NaN: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case (NaN): break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: break; case NaN: break; default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: case NaN: default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: break; case NaN: break; case baz: break; case NaN: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(NaN) { case NaN: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.NaN) { case foo: break; }",
		},
		{
			code: "switch(foo) { case Number.NaN: break; }",
		},
		{
			code: "switch(Number.NaN) { case foo: break; }",
			options: [{}],
		},
		{
			code: "switch(foo) { case Number.NaN: break; }",
			options: [{}],
		},
		{
			code: "switch(Number.NaN) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.NaN) { case foo: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.NaN) { default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.NaN) { case foo: break; default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case Number.NaN: }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case Number.NaN: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case (Number.NaN): break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: break; case Number.NaN: break; default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: case Number.NaN: default: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(foo) { case bar: break; case NaN: break; case baz: break; case Number.NaN: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch(Number.NaN) { case Number.NaN: break; }",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch((doStuff(), NaN)) {}",
			options: [{ enforceForSwitchCase: true }],
		},
		{
			code: "switch((doStuff(), Number.NaN)) {}",
			options: [{ enforceForSwitchCase: true }],
		},

		//------------------------------------------------------------------------------
		// enforceForIndexOf
		//------------------------------------------------------------------------------

		{
			code: "foo.indexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo['indexOf'](NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo[`indexOf`](NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo['lastIndexOf'](NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo().indexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.bar.lastIndexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf?.(NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo?.indexOf(NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(foo?.indexOf)(NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.lastIndexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo['indexOf'](Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo['lastIndexOf'](Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo().indexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.bar.lastIndexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
		},
		{
			code: "foo.indexOf?.(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo?.indexOf(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(foo?.indexOf)(Number.NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf((1, NaN))",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf((1, Number.NaN))",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.lastIndexOf((1, NaN))",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.lastIndexOf((1, Number.NaN))",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf(NaN, 1)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.lastIndexOf(NaN, 1)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf(NaN, b)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.lastIndexOf(NaN, b)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf(Number.NaN, b)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.lastIndexOf(Number.NaN, b)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.lastIndexOf(NaN, NaN)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo.indexOf((1, NaN), 1)",
			options: [{ enforceForIndexOf: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
