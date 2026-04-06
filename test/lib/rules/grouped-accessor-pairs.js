export default {
	valid: [
		// no accessors
		"({})",
		"({ a })",
		"({ a(){}, b(){}, a(){} })",
		"({ a: 1, b: 2 })",
		"({ a, ...b, c: 1 })",
		"({ a, b, ...a })",
		"({ a: 1, [b]: 2, a: 3, [b]: 4 })",
		"({ a: function get(){}, b, a: function set(foo){} })",
		"({ get(){}, a, set(){} })",
		"class A {}",
		"(class { a(){} })",
		"class A { a(){} [b](){} a(){} [b](){} }",
		"(class { a(){} b(){} static a(){} static b(){} })",
		"class A { get(){} a(){} set(){} }",

		// no accessor pairs
		"({ get a(){} })",
		"({ set a(foo){} })",
		"({ a: 1, get b(){}, c, ...d })",
		"({ get a(){}, get b(){}, set c(foo){}, set d(foo){} })",
		"({ get a(){}, b: 1, set c(foo){} })",
		"({ set a(foo){}, b: 1, a: 2 })",
		"({ get a(){}, b: 1, a })",
		"({ set a(foo){}, b: 1, a(){} })",
		"({ get a(){}, b: 1, set [a](foo){} })",
		"({ set a(foo){}, b: 1, get 'a '(){} })",
		"({ get a(){}, b: 1, ...a })",
		"({ set a(foo){}, b: 1 }, { get a(){} })",
		"({ get a(){}, b: 1, ...{ set a(foo){} } })",
		{
			code: "({ set a(foo){}, get b(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ get a(){}, set b(foo){} })",
			options: ["setBeforeGet"],
		},
		"class A { get a(){} }",
		"(class { set a(foo){} })",
		"class A { static set a(foo){} }",
		"(class { static get a(){} })",
		"class A { a(){} set b(foo){} c(){} }",
		"(class { a(){} get b(){} c(){} })",
		"class A { get a(){} static get b(){} set c(foo){} static set d(bar){} }",
		"(class { get a(){} b(){} a(foo){} })",
		"class A { static set a(foo){} b(){} static a(){} }",
		"(class { get a(){} static b(){} set [a](foo){} })",
		"class A { static set a(foo){} b(){} static get ' a'(){} }",
		"(class { set a(foo){} b(){} static get a(){} })",
		"class A { static set a(foo){} b(){} get a(){} }",
		"(class { get a(){} }, class { b(){} set a(foo){} })",

		// correct grouping
		"({ get a(){}, set a(foo){} })",
		"({ a: 1, set b(foo){}, get b(){}, c: 2 })",
		"({ get a(){}, set a(foo){}, set b(bar){}, get b(){} })",
		"({ get [a](){}, set [a](foo){} })",
		"({ set a(foo){}, get 'a'(){} })",
		"({ a: 1, b: 2, get a(){}, set a(foo){}, c: 3, a: 4 })",
		"({ get a(){}, set a(foo){}, set b(bar){} })",
		"({ get a(){}, get b(){}, set b(bar){} })",
		"class A { get a(){} set a(foo){} }",
		"(class { set a(foo){} get a(){} })",
		"class A { static set a(foo){} static get a(){} }",
		"(class { static get a(){} static set a(foo){} })",
		"class A { a(){} set b(foo){} get b(){} c(){} get d(){} set d(bar){} }",
		"(class { set a(foo){} get a(){} get b(){} set b(bar){} })",
		"class A { static set [a](foo){} static get [a](){} }",
		"(class { get a(){} set [`a`](foo){} })",
		"class A { static get a(){} static set a(foo){} set a(bar){} static get a(){} }",
		"(class { static get a(){} get a(){} set a(foo){} })",

		// correct order
		{
			code: "({ get a(){}, set a(foo){} })",
			options: ["anyOrder"],
		},
		{
			code: "({ set a(foo){}, get a(){} })",
			options: ["anyOrder"],
		},
		{
			code: "({ get a(){}, set a(foo){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ set a(foo){}, get a(){} })",
			options: ["setBeforeGet"],
		},
		{
			code: "class A { get a(){} set a(foo){} }",
			options: ["anyOrder"],
		},
		{
			code: "(class { set a(foo){} get a(){} })",
			options: ["anyOrder"],
		},
		{
			code: "class A { get a(){} set a(foo){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "(class { static set a(foo){} static get a(){} })",
			options: ["setBeforeGet"],
		},

		// ignores properties with duplicate getters/setters
		"({ get a(){}, b: 1, get a(){} })",
		"({ set a(foo){}, b: 1, set a(foo){} })",
		"({ get a(){}, b: 1, set a(foo){}, c: 2, get a(){} })",
		"({ set a(foo){}, b: 1, set 'a'(bar){}, c: 2, get a(){} })",
		"class A { get [a](){} b(){} get [a](){} c(){} set [a](foo){} }",
		"(class { static set a(foo){} b(){} static get a(){} static c(){} static set a(bar){} })",

		// public and private
		"class A { get '#abc'(){} b(){} set #abc(foo){} }",
		"class A { get #abc(){} b(){} set '#abc'(foo){} }",
		{
			code: "class A { set '#abc'(foo){} get #abc(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { set #abc(foo){} get '#abc'(){} }",
			options: ["getBeforeSet"],
		},
	],

	invalid: [
		// basic grouping tests with full messages
		{
			code: "({ get a(){}, b:1, set a(foo){} })",
		},
		{
			code: "({ set 'abc'(foo){}, b:1, get 'abc'(){} })",
		},
		{
			code: "({ get [a](){}, b:1, set [a](foo){} })",
		},
		{
			code: "class A { get abc(){} b(){} set abc(foo){} }",
		},
		{
			code: "(class { set abc(foo){} b(){} get abc(){} })",
		},
		{
			code: "class A { static set a(foo){} b(){} static get a(){} }",
		},
		{
			code: "(class { static get 123(){} b(){} static set 123(foo){} })",
		},
		{
			code: "class A { static get [a](){} b(){} static set [a](foo){} }",
		},
		{
			code: "class A { get '#abc'(){} b(){} set '#abc'(foo){} }",
		},
		{
			code: "class A { get #abc(){} b(){} set #abc(foo){} }",
		},

		// basic ordering tests with full messages
		{
			code: "({ set a(foo){}, get a(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ get 123(){}, set 123(foo){} })",
			options: ["setBeforeGet"],
		},
		{
			code: "({ get [a](){}, set [a](foo){} })",
			options: ["setBeforeGet"],
		},
		{
			code: "class A { set abc(foo){} get abc(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "(class { get [`abc`](){} set [`abc`](foo){} })",
			options: ["setBeforeGet"],
		},
		{
			code: "class A { static get a(){} static set a(foo){} }",
			options: ["setBeforeGet"],
		},
		{
			code: "(class { static set 'abc'(foo){} static get 'abc'(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { static set [abc](foo){} static get [abc](){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { set '#abc'(foo){} get '#abc'(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { set #abc(foo){} get #abc(){} }",
			options: ["getBeforeSet"],
		},

		// ordering option does not affect the grouping check
		{
			code: "({ get a(){}, b: 1, set a(foo){} })",
			options: ["anyOrder"],
		},
		{
			code: "({ get a(){}, b: 1, set a(foo){} })",
			options: ["setBeforeGet"],
		},
		{
			code: "({ get a(){}, b: 1, set a(foo){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { set a(foo){} b(){} get a(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "(class { static set a(foo){} b(){} static get a(){} })",
			options: ["setBeforeGet"],
		},

		// various kinds of keys
		{
			code: "({ get 'abc'(){}, d(){}, set 'abc'(foo){} })",
		},
		{
			code: "({ set ''(foo){}, get [''](){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { set abc(foo){} get 'abc'(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "(class { set [`abc`](foo){} get abc(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ set ['abc'](foo){}, get [`abc`](){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ set 123(foo){}, get [123](){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { static set '123'(foo){} static get 123(){} }",
			options: ["getBeforeSet"],
		},
		{
			code: "(class { set [a+b](foo){} get [a+b](){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ set [f(a)](foo){}, get [f(a)](){} })",
			options: ["getBeforeSet"],
		},

		// multiple invalid
		{
			code: "({ get a(){}, b: 1, set a(foo){}, set c(foo){}, d(){}, get c(){} })",
		},
		{
			code: "({ get a(){}, set b(foo){}, set a(bar){}, get b(){} })",
		},
		{
			code: "({ get a(){}, set [a](foo){}, set a(bar){}, get [a](){} })",
		},
		{
			code: "({ a(){}, set b(foo){}, ...c, get b(){}, set c(bar){}, get c(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "({ set [a](foo){}, get [a](){}, set [-a](bar){}, get [-a](){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { get a(){} constructor (){} set a(foo){} get b(){} static c(){} set b(bar){} }",
		},
		{
			code: "(class { set a(foo){} static get a(){} get a(){} static set a(bar){} })",
		},
		{
			code: "class A { get a(){} set a(foo){} static get b(){} static set b(bar){} }",
			options: ["setBeforeGet"],
		},
		{
			code: "(class { set [a+b](foo){} get [a-b](){} get [a+b](){} set [a-b](bar){} })",
		},

		// combinations of valid and invalid
		{
			code: "({ get a(){}, set a(foo){}, get b(){}, c: function(){}, set b(bar){} })",
		},
		{
			code: "({ get a(){}, get b(){}, set a(foo){} })",
		},
		{
			code: "({ set a(foo){}, get [a](){}, get a(){} })",
		},
		{
			code: "({ set [a](foo){}, set a(bar){}, get [a](){} })",
		},
		{
			code: "({ get a(){}, set a(foo){}, set b(bar){}, get b(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { get a(){} static set b(foo){} static get b(){} set a(foo){} }",
		},
		{
			code: "(class { static get a(){} set a(foo){} static set a(bar){} })",
		},
		{
			code: "class A { set a(foo){} get a(){} static get a(){} static set a(bar){} }",
			options: ["setBeforeGet"],
		},

		// non-accessor duplicates do not affect this rule
		{
			code: "({ get a(){}, a: 1, set a(foo){} })",
		},
		{
			code: "({ a(){}, set a(foo){}, get a(){} })",
			options: ["getBeforeSet"],
		},
		{
			code: "class A { get a(){} a(){} set a(foo){} }",
		},
		{
			code: "class A { get a(){} a; set a(foo){} }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// full location tests
		{
			code: "({ get a(){},\n    b: 1,\n    set a(foo){}\n})",
		},
		{
			code: "class A { static set a(foo){} b(){} static get \n a(){}\n}",
		},
	],
};
