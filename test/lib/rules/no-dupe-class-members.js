export default {
	valid: [
		"class A { foo() {} bar() {} }",
		"class A { static foo() {} foo() {} }",
		"class A { get foo() {} set foo(value) {} }",
		"class A { static foo() {} get foo() {} set foo(value) {} }",
		"class A { foo() { } } class B { foo() { } }",
		"class A { [foo]() {} foo() {} }",
		"class A { 'foo'() {} 'bar'() {} baz() {} }",
		"class A { *'foo'() {} *'bar'() {} *baz() {} }",
		"class A { get 'foo'() {} get 'bar'() {} get baz() {} }",
		"class A { 1() {} 2() {} }",
		"class A { ['foo']() {} ['bar']() {} }",
		"class A { [`foo`]() {} [`bar`]() {} }",
		"class A { [12]() {} [123]() {} }",
		"class A { [1.0]() {} ['1.0']() {} }",
		"class A { [0x1]() {} [`0x1`]() {} }",
		"class A { [null]() {} ['']() {} }",
		"class A { get ['foo']() {} set ['foo'](value) {} }",
		"class A { ['foo']() {} static ['foo']() {} }",

		// computed "constructor" key doesn't create constructor
		"class A { ['constructor']() {} constructor() {} }",
		"class A { 'constructor'() {} [`constructor`]() {} }",
		"class A { constructor() {} get [`constructor`]() {} }",
		"class A { 'constructor'() {} set ['constructor'](value) {} }",

		// not assumed to be statically-known values
		"class A { ['foo' + '']() {} ['foo']() {} }",
		"class A { [`foo${''}`]() {} [`foo`]() {} }",
		"class A { [-1]() {} ['-1']() {} }",

		// not supported by this rule
		"class A { [foo]() {} [foo]() {} }",

		// private and public
		"class A { foo; static foo; }",
		"class A { foo; #foo; }",
		"class A { '#foo'; #foo; }",
	],
	invalid: [
		{
			code: "class A { foo() {} foo() {} }",
		},
		{
			code: "!class A { foo() {} foo() {} };",
		},
		{
			code: "class A { 'foo'() {} 'foo'() {} }",
		},
		{
			code: "class A { 10() {} 1e1() {} }",
		},
		{
			code: "class A { ['foo']() {} ['foo']() {} }",
		},
		{
			code: "class A { static ['foo']() {} static foo() {} }",
		},
		{
			code: "class A { set 'foo'(value) {} set ['foo'](val) {} }",
		},
		{
			code: "class A { ''() {} ['']() {} }",
		},
		{
			code: "class A { [`foo`]() {} [`foo`]() {} }",
		},
		{
			code: "class A { static get [`foo`]() {} static get ['foo']() {} }",
		},
		{
			code: "class A { foo() {} [`foo`]() {} }",
		},
		{
			code: "class A { get [`foo`]() {} 'foo'() {} }",
		},
		{
			code: "class A { static 'foo'() {} static [`foo`]() {} }",
		},
		{
			code: "class A { ['constructor']() {} ['constructor']() {} }",
		},
		{
			code: "class A { static [`constructor`]() {} static constructor() {} }",
		},
		{
			code: "class A { static constructor() {} static 'constructor'() {} }",
		},
		{
			code: "class A { [123]() {} [123]() {} }",
		},
		{
			code: "class A { [0x10]() {} 16() {} }",
		},
		{
			code: "class A { [100]() {} [1e2]() {} }",
		},
		{
			code: "class A { [123.00]() {} [`123`]() {} }",
		},
		{
			code: "class A { static '65'() {} static [0o101]() {} }",
		},
		{
			code: "class A { [123n]() {} 123() {} }",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "class A { [null]() {} 'null'() {} }",
		},
		{
			code: "class A { foo() {} foo() {} foo() {} }",
		},
		{
			code: "class A { static foo() {} static foo() {} }",
		},
		{
			code: "class A { foo() {} get foo() {} }",
		},
		{
			code: "class A { set foo(value) {} foo() {} }",
		},
		{
			code: "class A { foo; foo; }",
		},

		/*
		 * This is syntax error
		 * { code: "class A { #foo; #foo; }" }
		 */
	],
};
