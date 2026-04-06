export default {
	valid: [
		"({ 'a': 0, b(){} })",
		"({ [x]: 0 });",
		"({ a: 0, [b](){} })",
		"({ ['__proto__']: [] })",
		"var { 'a': foo } = obj",
		"var { [a]: b } = obj;",
		"var { a } = obj;",
		"var { a: a } = obj;",
		"var { a: b } = obj;",
		{
			code: "class Foo { a() {} }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { 'a'() {} }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { [x]() {} }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { ['constructor']() {} }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { static ['prototype']() {} }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "(class { 'a'() {} })",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "(class { [x]() {} })",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "(class { ['constructor']() {} })",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "(class { static ['prototype']() {} })",
			options: [{ enforceForClassMembers: true }],
		},
		"class Foo { 'x'() {} }",
		"(class { [x]() {} })",
		"class Foo { static constructor() {} }",
		"class Foo { prototype() {} }",
		{
			code: "class Foo { ['x']() {} }",
			options: [{ enforceForClassMembers: false }],
		},
		{
			code: "(class { ['x']() {} })",
			options: [{ enforceForClassMembers: false }],
		},
		{
			code: "class Foo { static ['constructor']() {} }",
			options: [{ enforceForClassMembers: false }],
		},
		{
			code: "class Foo { ['prototype']() {} }",
			options: [{ enforceForClassMembers: false }],
		},
		{
			code: "class Foo { a }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { ['constructor'] }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { static ['constructor'] }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { static ['prototype'] }",
			options: [{ enforceForClassMembers: true }],
		},

		/*
		 * Well-known browsers throw syntax error bigint literals on property names,
		 * so, this rule doesn't touch those for now.
		 */
		{
			code: "({ [99999999999999999n]: 0 })",
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		{
			code: "({ ['0']: 0 })",
		},
		{
			code: "var { ['0']: a } = obj",
		},
		{
			code: "({ ['0+1,234']: 0 })",
		},
		{
			code: "({ [0]: 0 })",
		},
		{
			code: "var { [0]: a } = obj",
		},
		{
			code: "({ ['x']: 0 })",
		},
		{
			code: "var { ['x']: a } = obj",
		},
		{
			code: "var { ['__proto__']: a } = obj",
		},
		{
			code: "({ ['x']() {} })",
		},
		{
			code: "({ [/* this comment prevents a fix */ 'x']: 0 })",
		},
		{
			code: "({ ['x' /* this comment also prevents a fix */]: 0 })",
		},
		{
			code: "({ [('x')]: 0 })",
		},
		{
			code: "var { [('x')]: a } = obj",
		},
		{
			code: "({ *['x']() {} })",
		},
		{
			code: "({ async ['x']() {} })",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({ get[.2]() {} })",
		},
		{
			code: "({ set[.2](value) {} })",
		},
		{
			code: "({ async[.2]() {} })",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({ [2]() {} })",
		},
		{
			code: "({ get [2]() {} })",
		},
		{
			code: "({ set [2](value) {} })",
		},
		{
			code: "({ async [2]() {} })",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({ get[2]() {} })",
		},
		{
			code: "({ set[2](value) {} })",
		},
		{
			code: "({ async[2]() {} })",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({ get['foo']() {} })",
		},
		{
			code: "({ *[2]() {} })",
		},
		{
			code: "({ async*[2]() {} })",
		},
		{
			code: "({ ['constructor']: 1 })",
		},
		{
			code: "({ ['prototype']: 1 })",
		},
		{
			code: "class Foo { ['0']() {} }",
			options: [{ enforceForClassMembers: true }],
		},
		{
			code: "class Foo { ['0+1,234']() {} }",
			options: [{}],
		},
		{
			code: "class Foo { ['x']() {} }",
			options: [{ enforceForClassMembers: void 0 }],
		},
		{
			code: "class Foo { [/* this comment prevents a fix */ 'x']() {} }",
		},
		{
			code: "class Foo { ['x' /* this comment also prevents a fix */]() {} }",
		},
		{
			code: "class Foo { [('x')]() {} }",
		},
		{
			code: "class Foo { *['x']() {} }",
		},
		{
			code: "class Foo { async ['x']() {} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class Foo { get[.2]() {} }",
		},
		{
			code: "class Foo { set[.2](value) {} }",
		},
		{
			code: "class Foo { async[.2]() {} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class Foo { [2]() {} }",
		},
		{
			code: "class Foo { get [2]() {} }",
		},
		{
			code: "class Foo { set [2](value) {} }",
		},
		{
			code: "class Foo { async [2]() {} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class Foo { get[2]() {} }",
		},
		{
			code: "class Foo { set[2](value) {} }",
		},
		{
			code: "class Foo { async[2]() {} }",
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class Foo { get['foo']() {} }",
		},
		{
			code: "class Foo { *[2]() {} }",
		},
		{
			code: "class Foo { async*[2]() {} }",
		},
		{
			code: "class Foo { static ['constructor']() {} }",
		},
		{
			code: "class Foo { ['prototype']() {} }",
		},
		{
			code: "(class { ['x']() {} })",
		},
		{
			code: "(class { ['__proto__']() {} })",
		},
		{
			code: "(class { static ['__proto__']() {} })",
		},
		{
			code: "(class { static ['constructor']() {} })",
		},
		{
			code: "(class { ['prototype']() {} })",
		},
		{
			code: "class Foo { ['0'] }",
		},
		{
			code: "class Foo { ['0'] = 0 }",
		},
		{
			code: "class Foo { static[0] }",
		},
		{
			code: "class Foo { ['#foo'] }",
		},
		{
			code: "(class { ['__proto__'] })",
		},
		{
			code: "(class { static ['__proto__'] })",
		},
		{
			code: "(class { ['prototype'] })",
		},
	],
};
