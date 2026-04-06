export default {
	valid: [
		"class A { }",
		"class A { constructor(){ doSomething(); } }",
		"class A extends B { constructor(){} }",
		"class A extends B { constructor(){ super('foo'); } }",
		"class A extends B { constructor(foo, bar){ super(foo, bar, 1); } }",
		"class A extends B { constructor(){ super(); doSomething(); } }",
		"class A extends B { constructor(...args){ super(...args); doSomething(); } }",
		"class A { dummyMethod(){ doSomething(); } }",
		"class A extends B.C { constructor() { super(foo); } }",
		"class A extends B.C { constructor([a, b, c]) { super(...arguments); } }",
		"class A extends B.C { constructor(a = f()) { super(...arguments); } }",
		"class A extends B { constructor(a, b, c) { super(a, b); } }",
		"class A extends B { constructor(foo, bar){ super(foo); } }",
		"class A extends B { constructor(test) { super(); } }",
		"class A extends B { constructor() { foo; } }",
		"class A extends B { constructor(foo, bar) { super(bar); } }",
		{
			code: "declare class A { constructor(options: any); }",
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/declare-class"),
			},
		},
	],
	invalid: [
		{
			code: "class A { constructor(){} }",
		},
		{
			code: "class A { constructor     (){} }",
		},
		{
			code: "class A { 'constructor'(){} }",
		},
		{
			code: "class A extends B { constructor() { super(); } }",
		},
		{
			code: "class A extends B { constructor(foo){ super(foo); } }",
		},
		{
			code: "class A extends B { constructor(foo, bar){ super(foo, bar); } }",
		},
		{
			code: "class A extends B { constructor(...args){ super(...args); } }",
		},
		{
			code: "class A extends B.C { constructor() { super(...arguments); } }",
		},
		{
			code: "class A extends B { constructor(a, b, ...c) { super(...arguments); } }",
		},
		{
			code: "class A extends B { constructor(a, b, ...c) { super(a, b, ...c); } }",
		},
		{
			code: unIndent`
              class A {
                foo = 'bar'
                constructor() { }
                [0]() { }
              }`,
			languageOptions: { ecmaVersion: 2022 },
		},
	],
};
