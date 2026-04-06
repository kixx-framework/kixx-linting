export default {
	valid: [
		"var x = 0;",
		"let x;",
		"let x; { x = 0; } foo(x);",
		"let x = 0; x = 1;",
		{
			code: "using resource = fn();",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "await using resource = fn();",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		"const x = 0;",
		"for (let i = 0, end = 10; i < end; ++i) {}",
		"for (let i in [1,2,3]) { i = 0; }",
		"for (let x of [1,2,3]) { x = 0; }",
		"(function() { var x = 0; })();",
		"(function() { let x; })();",
		"(function() { let x; { x = 0; } foo(x); })();",
		"(function() { let x = 0; x = 1; })();",
		"(function() { const x = 0; })();",
		"(function() { for (let i = 0, end = 10; i < end; ++i) {} })();",
		"(function() { for (let i in [1,2,3]) { i = 0; } })();",
		"(function() { for (let x of [1,2,3]) { x = 0; } })();",
		"(function(x = 0) { })();",
		"let a; while (a = foo());",
		"let a; do {} while (a = foo());",
		"let a; for (; a = foo(); );",
		"let a; for (;; ++a);",
		"let a; for (const {b = ++a} in foo());",
		"let a; for (const {b = ++a} of foo());",
		"let a; for (const x of [1,2,3]) { if (a) {} a = foo(); }",
		"let a; for (const x of [1,2,3]) { a = a || foo(); bar(a); }",
		"let a; for (const x of [1,2,3]) { foo(++a); }",
		"let a; function foo() { if (a) {} a = bar(); }",
		"let a; function foo() { a = a || bar(); baz(a); }",
		"let a; function foo() { bar(++a); }",
		[
			"let id;",
			"function foo() {",
			"    if (typeof id !== 'undefined') {",
			"        return;",
			"    }",
			"    id = setInterval(() => {}, 250);",
			"}",
			"foo();",
		].join("\n"),
		"/*exported a*/ let a; function init() { a = foo(); }",
		"/*exported a*/ let a = 1",
		"let a; if (true) a = 0; foo(a);",
		`
        (function (a) {
            let b;
            ({ a, b } = obj);
        })();
        `,
		`
        (function (a) {
            let b;
            ([ a, b ] = obj);
        })();
        `,
		"var a; { var b; ({ a, b } = obj); }",
		"let a; { let b; ({ a, b } = obj); }",
		"var a; { var b; ([ a, b ] = obj); }",
		"let a; { let b; ([ a, b ] = obj); }",

		/*
		 * The assignment is located in a different scope.
		 * Those are warned by prefer-smaller-scope.
		 */
		"let x; { x = 0; foo(x); }",
		"(function() { let x; { x = 0; foo(x); } })();",
		"let x; for (const a of [1,2,3]) { x = foo(); bar(x); }",
		"(function() { let x; for (const a of [1,2,3]) { x = foo(); bar(x); } })();",
		"let x; for (x of array) { x; }",

		{
			code: "let {a, b} = obj; b = 0;",
			options: [{ destructuring: "all" }],
		},
		{
			code: "let a, b; ({a, b} = obj); b++;",
			options: [{ destructuring: "all" }],
		},

		// https://github.com/eslint/eslint/issues/8187
		{
			code: "let { name, ...otherStuff } = obj; otherStuff = {};",
			options: [{ destructuring: "all" }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { name, ...otherStuff } = obj; otherStuff = {};",
			options: [{ destructuring: "all" }],
			languageOptions: {
				parser: require(
					fixtureParser("babel-eslint5/destructuring-object-spread"),
				),
			},
		},

		// https://github.com/eslint/eslint/issues/8308
		{
			code: "let predicate; [typeNode.returnType, predicate] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [typeNode.returnType, ...predicate] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			// intentionally testing empty slot in destructuring assignment
			code: "let predicate; [typeNode.returnType,, predicate] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [typeNode.returnType=5, predicate] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [[typeNode.returnType=5], predicate] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [[typeNode.returnType, predicate]] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [typeNode.returnType, [predicate]] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [, [typeNode.returnType, predicate]] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [, {foo:typeNode.returnType, predicate}] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [, {foo:typeNode.returnType, ...predicate}] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let a; const b = {}; ({ a, c: b.c } = func());",
			languageOptions: { ecmaVersion: 2018 },
		},

		// ignoreReadBeforeAssign
		{
			code: "let x; function foo() { bar(x); } x = 0;",
			options: [{ ignoreReadBeforeAssign: true }],
		},

		// https://github.com/eslint/eslint/issues/10520
		"const x = [1,2]; let y; [,y] = x; y = 0;",
		"const x = [1,2,3]; let y, z; [y,,z] = x; y = 0; z = 0;",

		{
			code: "class C { static { let a = 1; a = 2; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; a = 1; a = 2; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "let a; class C { static { a = 1; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; if (foo) { a = 1; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; if (foo) a = 1; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a, b; if (foo) { ({ a, b } = foo); } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a, b; if (foo) ({ a, b } = foo); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { a; } } let a = 1; ",
			options: [{ ignoreReadBeforeAssign: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => a; let a = 1; } };",
			options: [{ ignoreReadBeforeAssign: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "let x = 1; foo(x);",
		},
		{
			code: "for (let i in [1,2,3]) { foo(i); }",
		},
		{
			code: "for (let x of [1,2,3]) { foo(x); }",
		},
		{
			code: "let [x = -1, y] = [1,2]; y = 0;",
		},
		{
			code: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
		},
		{
			code: "(function() { let x = 1; foo(x); })();",
		},
		{
			code: "(function() { for (let i in [1,2,3]) { foo(i); } })();",
		},
		{
			code: "(function() { for (let x of [1,2,3]) { foo(x); } })();",
		},
		{
			code: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
		},
		{
			code: "let f = (function() { let g = x; })(); f = 1;",
		},
		{
			code: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
		},
		{
			code: "let x = 0; { let x = 1; foo(x); } x = 0;",
		},
		{
			code: "for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }",
		},
		{
			code: "for (let i in [1,2,3]) { let x = 1; foo(x); }",
		},
		{
			code: [
				"var foo = function() {",
				"    for (const b of c) {",
				"       let a;",
				"       a = 1;",
				"   }",
				"};",
			].join("\n"),
		},
		{
			code: [
				"var foo = function() {",
				"    for (const b of c) {",
				"       let a;",
				"       ({a} = 1);",
				"   }",
				"};",
			].join("\n"),
		},

		{
			code: "let x; x = 0;",
		},
		{
			code: "switch (a) { case 0: let x; x = 0; }",
		},
		{
			code: "(function() { let x; x = 1; })();",
		},

		{
			code: "let {a = 0, b} = obj; b = 0; foo(a, b);",
			options: [{ destructuring: "any" }],
		},
		{
			code: "let {a: {b, c}} = {a: {b: 1, c: 2}}; b = 3;",
			options: [{ destructuring: "any" }],
		},
		{
			code: "let {a: {b, c}} = {a: {b: 1, c: 2}}",
			options: [{ destructuring: "all" }],
		},
		{
			code: "let a, b; ({a = 0, b} = obj); b = 0; foo(a, b);",
			options: [{ destructuring: "any" }],
		},
		{
			code: "let {a = 0, b} = obj; foo(a, b);",
			options: [{ destructuring: "all" }],
		},
		{
			code: "let [a] = [1]",
			options: [],
		},
		{
			code: "let {a} = obj",
			options: [],
		},
		{
			code: "let a, b; ({a = 0, b} = obj); foo(a, b);",
			options: [{ destructuring: "all" }],
		},
		{
			code: "let {a = 0, b} = obj, c = a; b = a;",
			options: [{ destructuring: "any" }],
		},
		{
			code: "let {a = 0, b} = obj, c = a; b = a;",
			options: [{ destructuring: "all" }],
		},

		// https://github.com/eslint/eslint/issues/8187
		{
			code: "let { name, ...otherStuff } = obj; otherStuff = {};",
			options: [{ destructuring: "any" }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let { name, ...otherStuff } = obj; otherStuff = {};",
			options: [{ destructuring: "any" }],
			languageOptions: {
				parser: require(
					fixtureParser("babel-eslint5/destructuring-object-spread"),
				),
			},
		},

		// Warnings are located at declaration if there are reading references before assignments.
		{
			code: "let x; function foo() { bar(x); } x = 0;",
		},

		// https://github.com/eslint/eslint/issues/5837
		{
			code: "/*eslint custom/use-x:error*/ let x = 1",
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: "/*eslint custom/use-x:error*/ { let x = 1 }",
		},
		{
			code: "let { foo, bar } = baz;",
		},

		// https://github.com/eslint/eslint/issues/10520
		{
			code: "const x = [1,2]; let [,y] = x;",
		},
		{
			code: "const x = [1,2,3]; let [y,,z] = x;",
		},

		// https://github.com/eslint/eslint/issues/8308
		{
			code: "let predicate; [, {foo:returnType, predicate}] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [, {foo:returnType, predicate}, ...bar ] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let predicate; [, {foo:returnType, ...predicate} ] = foo();",
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let x = 'x', y = 'y';",
		},
		{
			code: "let x = 'x', y = 'y'; x = 1",
		},
		{
			code: "let x = 1, y = 'y'; let z = 1;",
		},
		{
			code: "let { a, b, c} = obj; let { x, y, z} = anotherObj; x = 2;",
		},
		{
			code: "let x = 'x', y = 'y'; function someFunc() { let a = 1, b = 2; foo(a, b) }",
		},

		// The inner `let` will be auto-fixed in the second pass
		{
			code: "let someFunc = () => { let a = 1, b = 2; foo(a, b) }",
		},

		// https://github.com/eslint/eslint/issues/11699
		{
			code: "let {a, b} = c, d;",
		},
		{
			code: "let {a, b, c} = {}, e, f;",
		},
		{
			code: [
				"function a() {",
				"let foo = 0,",
				"  bar = 1;",
				"foo = 1;",
				"}",
				"function b() {",
				"let foo = 0,",
				"  bar = 2;",
				"foo = 2;",
				"}",
			].join("\n"),
		},

		// https://github.com/eslint/eslint/issues/13899
		{
			code: "/*eslint no-undef-init:error*/ let foo = undefined;",
		},

		{
			code: "let a = 1; class C { static { a; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			// this is a TDZ error with either `let` or `const`, but that isn't a concern of this rule
			code: "class C { static { a; } } let a = 1;",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a = 1; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { if (foo) { let a = 1; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a = 1; if (foo) { a; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { if (foo) { let a; a = 1; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; a = 1; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let { a, b } = foo; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a, b; ({ a, b } = foo); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; let b; ({ a, b } = foo); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; a = 0; console.log(a); } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// https://github.com/eslint/eslint/issues/16266
		{
			code: `
            let { itemId, list } = {},
            obj = [],
            total = 0;
            total = 9;
            console.log(itemId, list, obj, total);
            `,
			options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: `
            let { itemId, list } = {},
            obj = [];
            console.log(itemId, list, obj);
            `,
			options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: `
            let [ itemId, list ] = [],
            total = 0;
            total = 9;
            console.log(itemId, list, total);
            `,
			options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: `
            let [ itemId, list ] = [],
            obj = [];
            console.log(itemId, list, obj);
            `,
			options: [{ destructuring: "any", ignoreReadBeforeAssign: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
};
