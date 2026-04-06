export default {
	valid: [
		"var foo = { bar: 'baz' }",
		"var foo = {\nbar: 'baz'\n}",
		"var foo = [ 'baz' ]",
		"var foo = [\n'baz'\n]",
		"[,,]",
		"[\n,\n,\n]",
		"[,]",
		"[\n,\n]",
		"[]",
		"[\n]",
		{
			code: "var foo = [\n      (bar ? baz : qux),\n    ];",
			options: ["always-multiline"],
		},
		{ code: "var foo = { bar: 'baz' }", options: ["never"] },
		{ code: "var foo = {\nbar: 'baz'\n}", options: ["never"] },
		{ code: "var foo = [ 'baz' ]", options: ["never"] },
		{
			code: "var { a, b } = foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [ a, b ] = foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var { a,\n b, \n} = foo;",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [ a,\n b, \n] = foo;",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6 },
		},

		{ code: "[(1),]", options: ["always"] },
		{ code: "var x = { foo: (1),};", options: ["always"] },
		{ code: "var foo = { bar: 'baz', }", options: ["always"] },
		{ code: "var foo = {\nbar: 'baz',\n}", options: ["always"] },
		{ code: "var foo = {\nbar: 'baz'\n,}", options: ["always"] },
		{ code: "var foo = [ 'baz', ]", options: ["always"] },
		{ code: "var foo = [\n'baz',\n]", options: ["always"] },
		{ code: "var foo = [\n'baz'\n,]", options: ["always"] },
		{ code: "[,,]", options: ["always"] },
		{ code: "[\n,\n,\n]", options: ["always"] },
		{ code: "[,]", options: ["always"] },
		{ code: "[\n,\n]", options: ["always"] },
		{ code: "[]", options: ["always"] },
		{ code: "[\n]", options: ["always"] },

		{ code: "var foo = { bar: 'baz' }", options: ["always-multiline"] },
		{ code: "var foo = { bar: 'baz' }", options: ["only-multiline"] },
		{ code: "var foo = {\nbar: 'baz',\n}", options: ["always-multiline"] },
		{ code: "var foo = {\nbar: 'baz',\n}", options: ["only-multiline"] },
		{ code: "var foo = [ 'baz' ]", options: ["always-multiline"] },
		{ code: "var foo = [ 'baz' ]", options: ["only-multiline"] },
		{ code: "var foo = [\n'baz',\n]", options: ["always-multiline"] },
		{ code: "var foo = [\n'baz',\n]", options: ["only-multiline"] },
		{ code: "var foo = { bar:\n\n'bar' }", options: ["always-multiline"] },
		{ code: "var foo = { bar:\n\n'bar' }", options: ["only-multiline"] },
		{
			code: "var foo = {a: 1, b: 2, c: 3, d: 4}",
			options: ["always-multiline"],
		},
		{
			code: "var foo = {a: 1, b: 2, c: 3, d: 4}",
			options: ["only-multiline"],
		},
		{
			code: "var foo = {a: 1, b: 2,\n c: 3, d: 4}",
			options: ["always-multiline"],
		},
		{
			code: "var foo = {a: 1, b: 2,\n c: 3, d: 4}",
			options: ["only-multiline"],
		},
		{
			code: "var foo = {x: {\nfoo: 'bar',\n}}",
			options: ["always-multiline"],
		},
		{
			code: "var foo = {x: {\nfoo: 'bar',\n}}",
			options: ["only-multiline"],
		},
		{
			code: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])",
			options: ["always-multiline"],
		},
		{
			code: "var foo = new Map([\n[key, {\na: 1,\nb: 2,\nc: 3,\n}],\n])",
			options: ["only-multiline"],
		},

		// https://github.com/eslint/eslint/issues/3627
		{
			code: "var [a, ...rest] = [];",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [\n    a,\n    ...rest\n] = [];",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [\n    a,\n    ...rest\n] = [];",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [\n    a,\n    ...rest\n] = [];",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "[a, ...rest] = [];",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for ([a, ...rest] of []);",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var a = [b, ...spread,];",
			options: ["always"],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/7297
		{
			code: "var {foo, ...bar} = baz",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/3794
		{
			code: "import {foo,} from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, {abc,} from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import * as foo from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo,} from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo} from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, {abc} from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import * as foo from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo} from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {\n  foo,\n} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {\n  foo,\n} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {\n  foo,\n} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {\n  foo,\n} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo} from \n'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo} from \n'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo(a) {}",
			options: ["always"],
		},
		{
			code: "foo(a)",
			options: ["always"],
		},
		{
			code: "function foo(a) {}",
			options: ["never"],
		},
		{
			code: "foo(a)",
			options: ["never"],
		},
		{
			code: "function foo(a,\nb) {}",
			options: ["always-multiline"],
		},
		{
			code: "foo(a,\nb\n)",
			options: ["always-multiline"],
		},
		{
			code: "function foo(a,\nb\n) {}",
			options: ["always-multiline"],
		},
		{
			code: "foo(a,\nb)",
			options: ["always-multiline"],
		},
		{
			code: "function foo(a,\nb) {}",
			options: ["only-multiline"],
		},
		{
			code: "foo(a,\nb)",
			options: ["only-multiline"],
		},
		{
			code: "function foo(a) {}",
			options: ["always"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "foo(a)",
			options: ["always"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "function foo(a) {}",
			options: ["never"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "foo(a)",
			options: ["never"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "function foo(a,\nb) {}",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "foo(a,\nb)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "function foo(a,\nb\n) {}",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "foo(a,\nb\n)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "function foo(a,\nb) {}",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "foo(a,\nb)",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 7 },
		},
		{
			code: "function foo(a) {}",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a,) {}",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\nb,\n) {}",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,b)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a,b) {}",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,b)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a,b) {}",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,b)",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},

		// trailing comma in functions
		{
			code: "function foo(a) {} ",
			options: [{}],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: [{}],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a) {} ",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a,) {}",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function bar(a, ...b) {}",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 9 },
		},
		{
			code: "bar(...a,)",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a) {} ",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\nb,\n) {} ",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\n...b\n) {} ",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,\nb,\n)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,\n...b,\n)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a) {} ",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\nb,\n) {} ",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,\nb,\n)",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\nb\n) {} ",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,\nb\n)",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},

		// https://github.com/eslint/eslint/issues/7370
		{
			code: "function foo({a}: {a: string,}) {}",
			options: ["never"],
			languageOptions: {
				parser: parser("object-pattern-1"),
			},
		},
		{
			code: "function foo({a,}: {a: string}) {}",
			options: ["always"],
			languageOptions: {
				parser: parser("object-pattern-2"),
			},
		},
		{
			code: "function foo(a): {b: boolean,} {}",
			options: [{ functions: "never" }],
			languageOptions: {
				parser: parser("return-type-1"),
			},
		},
		{
			code: "function foo(a,): {b: boolean} {}",
			options: [{ functions: "always" }],
			languageOptions: {
				parser: parser("return-type-2"),
			},
		},

		// https://github.com/eslint/eslint/issues/16442
		{
			code: "function f(\n a,\n b\n) {}",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: 5,
				sourceType: "script",
			},
		},
		{
			code: "f(\n a,\n b\n);",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: 5,
				sourceType: "script",
			},
		},
		{
			code: "function f(\n a,\n b\n) {}",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: 2016,
			},
		},
		{
			code: "f(\n a,\n b\n);",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: 2016,
			},
		},
	],
	invalid: [
		{
			code: "var foo = { bar: 'baz', }",
		},
		{
			code: "var foo = {\nbar: 'baz',\n}",
		},
		{
			code: "foo({ bar: 'baz', qux: 'quux', });",
		},
		{
			code: "foo({\nbar: 'baz',\nqux: 'quux',\n});",
		},
		{
			code: "var foo = [ 'baz', ]",
		},
		{
			code: "var foo = [ 'baz',\n]",
		},
		{
			code: "var foo = { bar: 'bar'\n\n, }",
		},

		{
			code: "var foo = { bar: 'baz', }",
			options: ["never"],
		},
		{
			code: "var foo = { bar: 'baz', }",
			options: ["only-multiline"],
		},
		{
			code: "var foo = {\nbar: 'baz',\n}",
			options: ["never"],
		},
		{
			code: "foo({ bar: 'baz', qux: 'quux', });",
			options: ["never"],
		},
		{
			code: "foo({ bar: 'baz', qux: 'quux', });",
			options: ["only-multiline"],
		},

		{
			code: "var foo = { bar: 'baz' }",
			options: ["always"],
		},
		{
			code: "var foo = {\nbar: 'baz'\n}",
			options: ["always"],
		},
		{
			code: "var foo = {\nbar: 'baz'\r\n}",
			options: ["always"],
		},
		{
			code: "foo({ bar: 'baz', qux: 'quux' });",
			options: ["always"],
		},
		{
			code: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
			options: ["always"],
		},
		{
			code: "var foo = [ 'baz' ]",
			options: ["always"],
		},
		{
			code: "var foo = ['baz']",
			options: ["always"],
		},
		{
			code: "var foo = [ 'baz'\n]",
			options: ["always"],
		},
		{
			code: "var foo = { bar:\n\n'bar' }",
			options: ["always"],
		},

		{
			code: "var foo = {\nbar: 'baz'\n}",
			options: ["always-multiline"],
		},
		{
			code:
				"var foo = [\n" +
				"  bar,\n" +
				"  (\n" +
				"    baz\n" +
				"  )\n" +
				"];",
			options: ["always"],
		},
		{
			code:
				"var foo = {\n" +
				"  foo: 'bar',\n" +
				"  baz: (\n" +
				"    qux\n" +
				"  )\n" +
				"};",
			options: ["always"],
		},
		{
			// https://github.com/eslint/eslint/issues/7291
			code:
				"var foo = [\n" +
				"  (bar\n" +
				"    ? baz\n" +
				"    : qux\n" +
				"  )\n" +
				"];",
			options: ["always"],
		},
		{
			code: "var foo = { bar: 'baz', }",
			options: ["always-multiline"],
		},
		{
			code: "foo({\nbar: 'baz',\nqux: 'quux'\n});",
			options: ["always-multiline"],
		},
		{
			code: "foo({ bar: 'baz', qux: 'quux', });",
			options: ["always-multiline"],
		},
		{
			code: "var foo = [\n'baz'\n]",
			options: ["always-multiline"],
		},
		{
			code: "var foo = ['baz',]",
			options: ["always-multiline"],
		},
		{
			code: "var foo = ['baz',]",
			options: ["only-multiline"],
		},
		{
			code: "var foo = {x: {\nfoo: 'bar',\n},}",
			options: ["always-multiline"],
		},
		{
			code: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}",
			options: ["always-multiline"],
		},
		{
			code: "var foo = {a: 1, b: 2,\nc: 3, d: 4,}",
			options: ["only-multiline"],
		},
		{
			code: "var foo = [{\na: 1,\nb: 2,\nc: 3,\nd: 4,\n},]",
			options: ["always-multiline"],
		},
		{
			code: "var { a, b, } = foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var { a, b, } = foo;",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [ a, b, ] = foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [ a, b, ] = foo;",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "[(1),]",
			options: ["never"],
		},
		{
			code: "[(1),]",
			options: ["only-multiline"],
		},
		{
			code: "var x = { foo: (1),};",
			options: ["never"],
		},
		{
			code: "var x = { foo: (1),};",
			options: ["only-multiline"],
		},

		// https://github.com/eslint/eslint/issues/3794
		{
			code: "import {foo} from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, {abc} from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo} from 'foo';",
			options: ["always"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo,} from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo,} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, {abc,} from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, {abc,} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo,} from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo,} from 'foo';",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {foo,} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {foo,} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import {\n  foo\n} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export {\n  foo\n} from 'foo';",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/6233
		{
			code: "var foo = {a: (1)}",
			options: ["always"],
		},
		{
			code: "var foo = [(1)]",
			options: ["always"],
		},
		{
			code: "var foo = [\n1,\n(2)\n]",
			options: ["always-multiline"],
		},

		// trailing commas in functions
		{
			code: "function foo(a,) {}",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a,) {})",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a,) => a",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a,) => (a)",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({foo(a,) {}})",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class A {foo(a,) {}}",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a,)",
			options: [{ functions: "never" }],
			languageOptions: { ecmaVersion: 8 },
		},

		{
			code: "function foo(a) {}",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a) {})",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a) => a",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a) => (a)",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({foo(a) {}})",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class A {foo(a) {}}",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a)",
			options: [{ functions: "always" }],
			languageOptions: { ecmaVersion: 8 },
		},

		{
			code: "function foo(a,) {}",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a,) {})",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a,)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\nb\n) {}",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,\nb\n)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\n...a,\n...b\n)",
			options: [{ functions: "always-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},

		{
			code: "function foo(a,) {}",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a,) {})",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a,)",
			options: [{ functions: "only-multiline" }],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a,) {}",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a,) {})",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a,) => a",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a,) => (a)",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({foo(a,) {}})",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class A {foo(a,) {}}",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a,)",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
		},

		{
			code: "function foo(a) {}",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a) {})",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a) => a",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(a) => (a)",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "({foo(a) {}})",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "class A {foo(a) {}}",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a)",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a)",
			options: ["always"],
			languageOptions: { ecmaVersion: 8 },
		},

		{
			code: "function foo(a,) {}",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a,) {})",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a,)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(\na,\nb\n) {}",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\na,\nb\n)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(\n...a,\n...b\n)",
			options: ["always-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},

		{
			code: "function foo(a,) {}",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "(function foo(a,) {})",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(a,)",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "foo(...a,)",
			options: ["only-multiline"],
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: "function foo(a) {}",
			options: ["always"],
			languageOptions: { ecmaVersion: 9 },
		},

		// separated options
		{
			code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
			options: [
				{
					objects: "never",
					arrays: "ignore",
					imports: "ignore",
					exports: "ignore",
					functions: "ignore",
				},
			],
			languageOptions: { ecmaVersion: 8, sourceType: "module" },
		},
		{
			code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
			options: [
				{
					objects: "ignore",
					arrays: "never",
					imports: "ignore",
					exports: "ignore",
					functions: "ignore",
				},
			],
			languageOptions: { ecmaVersion: 8, sourceType: "module" },
		},
		{
			code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
			options: [
				{
					objects: "ignore",
					arrays: "ignore",
					imports: "never",
					exports: "ignore",
					functions: "ignore",
				},
			],
			languageOptions: { ecmaVersion: 8, sourceType: "module" },
		},
		{
			code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
			options: [
				{
					objects: "ignore",
					arrays: "ignore",
					imports: "ignore",
					exports: "never",
					functions: "ignore",
				},
			],
			languageOptions: { ecmaVersion: 8, sourceType: "module" },
		},
		{
			code: `let {a,} = {a: 1,};
let [b,] = [1,];
import {c,} from "foo";
let d = 0;export {d,};
(function foo(e,) {})(f,);`,
			options: [
				{
					objects: "ignore",
					arrays: "ignore",
					imports: "ignore",
					exports: "ignore",
					functions: "never",
				},
			],
			languageOptions: { ecmaVersion: 8, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/7370
		{
			code: "function foo({a}: {a: string,}) {}",
			options: ["always"],
			languageOptions: {
				parser: parser("object-pattern-1"),
			},
		},
		{
			code: "function foo({a,}: {a: string}) {}",
			options: ["never"],
			languageOptions: {
				parser: parser("object-pattern-2"),
			},
		},
		{
			code: "function foo(a): {b: boolean,} {}",
			options: [{ functions: "always" }],
			languageOptions: {
				parser: parser("return-type-1"),
			},
		},
		{
			code: "function foo(a,): {b: boolean} {}",
			options: [{ functions: "never" }],
			languageOptions: {
				parser: parser("return-type-2"),
			},
		},

		// https://github.com/eslint/eslint/issues/11502
		{
			code: "foo(a,)",
			languageOptions: { ecmaVersion: 8 },
		},

		// https://github.com/eslint/eslint/issues/15660
		{
			code: unIndent`
                /*eslint custom/add-named-import:1*/
                import {
                    StyleSheet,
                    View,
                    TextInput,
                    ImageBackground,
                    Image,
                    TouchableOpacity,
                    SafeAreaView
                } from 'react-native';
            `,
			options: [{ imports: "always-multiline" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                /*eslint custom/add-named-import:1*/
                import {
                    StyleSheet,
                    View,
                    TextInput,
                    ImageBackground,
                    Image,
                    TouchableOpacity,
                    SafeAreaView,
                } from 'react-native';
            `,
			options: [{ imports: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/16442
		{
			code: "function f(\n a,\n b\n) {}",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: 2017,
			},
		},
		{
			code: "f(\n a,\n b\n);",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: 2017,
			},
		},
		{
			code: "function f(\n a,\n b\n) {}",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: "latest",
			},
		},
		{
			code: "f(\n a,\n b\n);",
			options: ["always-multiline"],
			languageOptions: {
				ecmaVersion: "latest",
			},
		},
	],
};
