export default {
	valid: [
		{
			code: "++this.a",
			options: [{ words: true }],
		},
		{
			code: "--this.a",
			options: [{ words: true }],
		},
		{
			code: "this.a++",
			options: [{ words: true }],
		},
		{
			code: "this.a--",
			options: [{ words: true }],
		},
		"foo .bar++",
		{
			code: "foo.bar --",
			options: [{ nonwords: true }],
		},

		{
			code: "delete foo.bar",
			options: [{ words: true }],
		},
		{
			code: 'delete foo["bar"]',
			options: [{ words: true }],
		},
		{
			code: "delete foo.bar",
			options: [{ words: false }],
		},
		{
			code: "delete(foo.bar)",
			options: [{ words: false }],
		},

		{
			code: "new Foo",
			options: [{ words: true }],
		},
		{
			code: "new Foo()",
			options: [{ words: true }],
		},
		{
			code: "new [foo][0]",
			options: [{ words: true }],
		},
		{
			code: "new[foo][0]",
			options: [{ words: false }],
		},

		{
			code: "typeof foo",
			options: [{ words: true }],
		},
		{
			code: "typeof{foo:true}",
			options: [{ words: false }],
		},
		{
			code: "typeof {foo:true}",
			options: [{ words: true }],
		},
		{
			code: "typeof (foo)",
			options: [{ words: true }],
		},
		{
			code: "typeof(foo)",
			options: [{ words: false }],
		},
		{
			code: "typeof!foo",
			options: [{ words: false }],
		},

		{
			code: "void 0",
			options: [{ words: true }],
		},
		{
			code: "(void 0)",
			options: [{ words: true }],
		},
		{
			code: "(void (0))",
			options: [{ words: true }],
		},
		{
			code: "void foo",
			options: [{ words: true }],
		},
		{
			code: "void foo",
			options: [{ words: false }],
		},
		{
			code: "void(foo)",
			options: [{ words: false }],
		},

		{
			code: "-1",
			options: [{ nonwords: false }],
		},
		{
			code: "!foo",
			options: [{ nonwords: false }],
		},
		{
			code: "!!foo",
			options: [{ nonwords: false }],
		},
		{
			code: "foo++",
			options: [{ nonwords: false }],
		},
		{
			code: "foo ++",
			options: [{ nonwords: true }],
		},
		{
			code: "++foo",
			options: [{ nonwords: false }],
		},
		{
			code: "++ foo",
			options: [{ nonwords: true }],
		},
		{
			code: "function *foo () { yield (0) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield +1 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield* 0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield * 0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { (yield)*0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { (yield) * 0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield*0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield *0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "async function foo() { await {foo: 1} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await {bar: 2} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await{baz: 3} }",
			options: [{ words: false }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await {qux: 4} }",
			options: [{ words: false, overrides: { await: true } }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await{foo: 5} }",
			options: [{ words: true, overrides: { await: false } }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo++",
			options: [{ nonwords: true, overrides: { "++": false } }],
		},
		{
			code: "foo++",
			options: [{ nonwords: false, overrides: { "++": false } }],
		},
		{
			code: "++foo",
			options: [{ nonwords: true, overrides: { "++": false } }],
		},
		{
			code: "++foo",
			options: [{ nonwords: false, overrides: { "++": false } }],
		},
		{
			code: "!foo",
			options: [{ nonwords: true, overrides: { "!": false } }],
		},
		{
			code: "!foo",
			options: [{ nonwords: false, overrides: { "!": false } }],
		},
		{
			code: "new foo",
			options: [{ words: true, overrides: { new: false } }],
		},
		{
			code: "new foo",
			options: [{ words: false, overrides: { new: false } }],
		},
		{
			code: "function *foo () { yield(0) }",
			options: [{ words: true, overrides: { yield: false } }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo () { yield(0) }",
			options: [{ words: false, overrides: { yield: false } }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { #x; *foo(bar) { yield#x in bar; } }",
			options: [{ words: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
	],

	invalid: [
		{
			code: "delete(foo.bar)",
			options: [{ words: true }],
		},
		{
			code: 'delete(foo["bar"]);',
			options: [{ words: true }],
		},
		{
			code: "delete (foo.bar)",
			options: [{ words: false }],
		},
		{
			code: "new(Foo)",
			options: [{ words: true }],
		},
		{
			code: "new (Foo)",
			options: [{ words: false }],
		},
		{
			code: "new(Foo())",
			options: [{ words: true }],
		},
		{
			code: "new [foo][0]",
			options: [{ words: false }],
		},

		{
			code: "typeof(foo)",
			options: [{ words: true }],
		},
		{
			code: "typeof (foo)",
			options: [{ words: false }],
		},
		{
			code: "typeof[foo]",
			options: [{ words: true }],
		},
		{
			code: "typeof [foo]",
			options: [{ words: false }],
		},
		{
			code: "typeof{foo:true}",
			options: [{ words: true }],
		},
		{
			code: "typeof {foo:true}",
			options: [{ words: false }],
		},
		{
			code: "typeof!foo",
			options: [{ words: true }],
		},

		{
			code: "void(0);",
			options: [{ words: true }],
		},
		{
			code: "void(foo);",
			options: [{ words: true }],
		},
		{
			code: "void[foo];",
			options: [{ words: true }],
		},
		{
			code: "void{a:0};",
			options: [{ words: true }],
		},
		{
			code: "void (foo)",
			options: [{ words: false }],
		},
		{
			code: "void [foo]",
			options: [{ words: false }],
		},

		{
			code: "! foo",
			options: [{ nonwords: false }],
		},
		{
			code: "!foo",
			options: [{ nonwords: true }],
		},

		{
			code: "!! foo",
			options: [{ nonwords: false }],
		},
		{
			code: "!!foo",
			options: [{ nonwords: true }],
		},

		{
			code: "- 1",
			options: [{ nonwords: false }],
		},
		{
			code: "-1",
			options: [{ nonwords: true }],
		},

		{
			code: "foo++",
			options: [{ nonwords: true }],
		},
		{
			code: "foo ++",
			options: [{ nonwords: false }],
		},
		{
			code: "++ foo",
			options: [{ nonwords: false }],
		},
		{
			code: "++foo",
			options: [{ nonwords: true }],
		},
		{
			code: "foo .bar++",
			options: [{ nonwords: true }],
		},
		{
			code: "foo.bar --",
		},
		{
			code: "+ +foo",
			options: [{ nonwords: false }],
		},
		{
			code: "+ ++foo",
			options: [{ nonwords: false }],
		},
		{
			code: "- -foo",
			options: [{ nonwords: false }],
		},
		{
			code: "- --foo",
			options: [{ nonwords: false }],
		},
		{
			code: "+ -foo",
			options: [{ nonwords: false }],
		},
		{
			code: "function *foo() { yield(0) }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield (0) }",
			options: [{ words: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield+0 }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "foo++",
			options: [{ nonwords: true, overrides: { "++": true } }],
		},
		{
			code: "foo++",
			options: [{ nonwords: false, overrides: { "++": true } }],
		},
		{
			code: "++foo",
			options: [{ nonwords: true, overrides: { "++": true } }],
		},
		{
			code: "++foo",
			options: [{ nonwords: false, overrides: { "++": true } }],
		},
		{
			code: "!foo",
			options: [{ nonwords: true, overrides: { "!": true } }],
		},
		{
			code: "!foo",
			options: [{ nonwords: false, overrides: { "!": true } }],
		},
		{
			code: "new(Foo)",
			options: [{ words: true, overrides: { new: true } }],
		},
		{
			code: "new(Foo)",
			options: [{ words: false, overrides: { new: true } }],
		},
		{
			code: "function *foo() { yield(0) }",
			options: [{ words: true, overrides: { yield: true } }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function *foo() { yield(0) }",
			options: [{ words: false, overrides: { yield: true } }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "async function foo() { await{foo: 'bar'} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await{baz: 'qux'} }",
			options: [{ words: false, overrides: { await: true } }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await {foo: 1} }",
			options: [{ words: false }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "async function foo() { await {bar: 2} }",
			options: [{ words: true, overrides: { await: false } }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class C { #x; *foo(bar) { yield #x in bar; } }",
			options: [{ words: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
};
