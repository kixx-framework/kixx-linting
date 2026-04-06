export default {
	valid: [
		"var foo = 5;\n\nlabel: while (true) {\n  console.log(foo);\n  break label;\n}",
		"var foo = 5;\n\nwhile (true) {\n  console.log(foo);\n  break;\n}",
		{
			code: "for (let prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
			languageOptions: { ecmaVersion: 6 },
		},
		"var box = {a: 2};\n    for (var prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
		"f({ set foo(a) { return; } });",
		{ code: "a; var a;", options: ["all"] },
		{ code: "var a=10; alert(a);", options: ["all"] },
		{ code: "var a=10; (function() { alert(a); })();", options: ["all"] },
		{
			code: "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();",
			options: ["all"],
		},
		{ code: "var a=10; d[a] = 0;", options: ["all"] },
		{ code: "(function() { var a=10; return a; })();", options: ["all"] },
		{ code: "(function g() {})()", options: ["all"] },
		{ code: "function f(a) {alert(a);}; f();", options: ["all"] },
		{
			code: "var c = 0; function f(a){ var b = a; return b; }; f(c);",
			options: ["all"],
		},
		{ code: "function a(x, y){ return y; }; a();", options: ["all"] },
		{
			code: "var arr1 = [1, 2]; var arr2 = [3, 4]; for (var i in arr1) { arr1[i] = 5; } for (var i in arr2) { arr2[i] = 10; }",
			options: ["all"],
		},
		{ code: "var a=10;", options: ["local"] },
		{ code: 'var min = "min"; Math[min];', options: ["all"] },
		{ code: "Foo.bar = function(baz) { return baz; };", options: ["all"] },
		"myFunc(function foo() {}.bind(this))",
		"myFunc(function foo(){}.toString())",
		"function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});}; foo()",
		"(function() { var doSomething = function doSomething() {}; doSomething() }())",
		"/*global a */ a;",
		{
			code: "var a=10; (function() { alert(a); })();",
			options: [{ vars: "all" }],
		},
		{
			code: "function g(bar, baz) { return baz; }; g();",
			options: [{ vars: "all" }],
		},
		{
			code: "function g(bar, baz) { return baz; }; g();",
			options: [{ vars: "all", args: "after-used" }],
		},
		{
			code: "function g(bar, baz) { return bar; }; g();",
			options: [{ vars: "all", args: "none" }],
		},
		{
			code: "function g(bar, baz) { return 2; }; g();",
			options: [{ vars: "all", args: "none" }],
		},
		{
			code: "function g(bar, baz) { return bar + baz; }; g();",
			options: [{ vars: "local", args: "all" }],
		},
		{
			code: "var g = function(bar, baz) { return 2; }; g();",
			options: [{ vars: "all", args: "none" }],
		},
		"(function z() { z(); })();",
		{ code: " ", languageOptions: { globals: { a: true } } },
		{
			code: 'var who = "Paul";\nmodule.exports = `Hello ${who}!`;',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var foo = 123;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function foo () {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export class foo {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "class Foo{}; var x = new Foo(); x.foo()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'const foo = "hello!";function bar(foobar = foo) {  foobar.replace(/!$/, " world!");}\nbar();',
			languageOptions: { ecmaVersion: 6 },
		},
		"function Foo(){}; var x = new Foo(); x.foo()",
		"function foo() {var foo = 1; return foo}; foo();",
		"function foo(foo) {return foo}; foo(1);",
		"function foo() {function foo() {return 1;}; return foo()}; foo();",
		{
			code: "function foo() {var foo = 1; return foo}; foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(foo) {return foo}; foo(1);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() {function foo() {return 1;}; return foo()}; foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; const [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; const {y = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; const {z: [y = x]} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = []; const {z: [y] = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; let y; [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; let y; ({z: [y = x]} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = []; let y; ({z: [y] = x} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo(y = x) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo({y = x} = {}) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo(y = function() { bar(x); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; var [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; var {y = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; var {z: [y = x]} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = []; var {z: [y] = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1, y; [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1, y; ({z: [y = x]} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = [], y; ({z: [y] = x} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo(y = x) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo({y = x} = {}) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo(y = function() { bar(x); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},

		// exported variables should work
		"/*exported toaster*/ var toaster = 'great'",
		"/*exported toaster, poster*/ var toaster = 1; poster = 0;",
		{
			code: "/*exported x*/ var { x } = y",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "/*exported x, y*/  var { x, y } = z",
			languageOptions: { ecmaVersion: 6 },
		},

		// Can mark variables as used via context.markVariableAsUsed()
		"/*eslint custom/use-every-a:1*/ var a;",
		"/*eslint custom/use-every-a:1*/ !function(a) { return 1; }",
		"/*eslint custom/use-every-a:1*/ !function() { var a; return 1 }",

		// ignore pattern
		{
			code: "var _a;",
			options: [{ vars: "all", varsIgnorePattern: "^_" }],
		},
		{
			code: "var a; function foo() { var _b; } foo();",
			options: [{ vars: "local", varsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(_a) { } foo();",
			options: [{ args: "all", argsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(a, _b) { return a; } foo();",
			options: [{ args: "after-used", argsIgnorePattern: "^_" }],
		},
		{
			code: "var [ firstItemIgnored, secondItem ] = items;\nconsole.log(secondItem);",
			options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [ a, _b, c ] = items;\nconsole.log(a+c);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [ [a, _b, c] ] = items;\nconsole.log(a+c);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { x: [_a, foo] } = bar;\nconsole.log(foo);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function baz([_b, foo]) { foo; };\nbaz()",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function baz({x: [_b, foo]}) {foo};\nbaz()",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function baz([{x: [_b, foo]}]) {foo};\nbaz()",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
            let _a, b;
            foo.forEach(item => {
                [_a, b] = item;
                doSomething(b);
            });
            `,
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            [_a, b] = foo;
            _a = 1;
            b;
            `,
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            _a = 1;
            ({_a, ...b } = foo);
            b;
            `,
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "try {} catch ([firstError]) {}",
			options: [{ destructuredArrayIgnorePattern: "Error$" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// for-in loops (see #2342)
		"(function(obj) { var name; for ( name in obj ) return; })({});",
		"(function(obj) { var name; for ( name in obj ) { return; } })({});",
		"(function(obj) { for ( var name in obj ) { return true } })({})",
		"(function(obj) { for ( var name in obj ) return true })({})",

		{
			code: "(function(obj) { let name; for ( name in obj ) return; })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { let name; for ( name in obj ) { return; } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { for ( let name in obj ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { for ( let name in obj ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "(function(obj) { for ( const name in obj ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { for ( const name in obj ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		// For-of loops
		{
			code: "(function(iter) { let name; for ( name of iter ) return; })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { let name; for ( name of iter ) { return; } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( let name of iter ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( let name of iter ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "(function(iter) { for ( const name of iter ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( const name of iter ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		// Sequence Expressions (See https://github.com/eslint/eslint/issues/14325)
		{
			code: "let x = 0; foo = (0, x++);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x = 0; foo = (0, x += 1);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x = 0; foo = (0, x = x + 1);",
			languageOptions: { ecmaVersion: 6 },
		},

		// caughtErrors
		{
			code: "try{}catch(err){}",
			options: [{ caughtErrors: "none" }],
		},
		{
			code: "try{}catch(err){console.error(err);}",
			options: [{ caughtErrors: "all" }],
		},
		{
			code: "try{}catch(ignoreErr){}",
			options: [{ caughtErrorsIgnorePattern: "^ignore" }],
		},
		{
			code: "try{}catch(ignoreErr){}",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
		},
		{
			code: "try {} catch ({ message, stack }) {}",
			options: [{ caughtErrorsIgnorePattern: "message|stack" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "try {} catch ({ errors: [firstError] }) {}",
			options: [{ caughtErrorsIgnorePattern: "Error$" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// caughtErrors with other combinations
		{
			code: "try{}catch(err){}",
			options: [{ caughtErrors: "none", vars: "all", args: "all" }],
		},

		// Using object rest for variable omission
		{
			code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "try {} catch ({ foo, ...bar }) { console.log(bar); }",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/6348
		"var a = 0, b; b = a = a + 1; foo(b);",
		"var a = 0, b; b = a += a + 1; foo(b);",
		"var a = 0, b; b = a++; foo(b);",
		"function foo(a) { var b = a = a + 1; bar(b) } foo();",
		"function foo(a) { var b = a += a + 1; bar(b) } foo();",
		"function foo(a) { var b = a++; bar(b) } foo();",

		// https://github.com/eslint/eslint/issues/6576
		[
			"var unregisterFooWatcher;",
			"// ...",
			'unregisterFooWatcher = $scope.$watch( "foo", function() {',
			"    // ...some code..",
			"    unregisterFooWatcher();",
			"});",
		].join("\n"),
		[
			"var ref;",
			"ref = setInterval(",
			"    function(){",
			"        clearInterval(ref);",
			"    }, 10);",
		].join("\n"),
		[
			"var _timer;",
			"function f() {",
			"    _timer = setTimeout(function () {}, _timer ? 100 : 0);",
			"}",
			"f();",
		].join("\n"),
		"function foo(cb) { cb = function() { function something(a) { cb(1 + a); } register(something); }(); } foo();",
		{
			code: "function* foo(cb) { cb = yield function(a) { cb(1 + a); }; } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(cb) { cb = tag`hello${function(a) { cb(1 + a); }}`; } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo(cb) { var b; cb = b = function(a) { cb(1 + a); }; b(); } foo();",

		// https://github.com/eslint/eslint/issues/6646
		[
			"function someFunction() {",
			"    var a = 0, i;",
			"    for (i = 0; i < 2; i++) {",
			"        a = myFunction(a);",
			"    }",
			"}",
			"someFunction();",
		].join("\n"),

		// https://github.com/eslint/eslint/issues/7124
		{
			code: "(function(a, b, {c, d}) { d })",
			options: [{ argsIgnorePattern: "c" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(a, b, {c, d}) { c })",
			options: [{ argsIgnorePattern: "d" }],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/7250
		{
			code: "(function(a, b, c) { c })",
			options: [{ argsIgnorePattern: "c" }],
		},
		{
			code: "(function(a, b, {c, d}) { c })",
			options: [{ argsIgnorePattern: "[cd]" }],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/7351
		{
			code: "(class { set foo(UNUSED) {} })",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class Foo { set bar(UNUSED) {} } console.log(Foo)",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/8119
		{
			code: "(({a, ...rest}) => rest)",
			options: [{ args: "all", ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/14163
		{
			code: "let foo, rest;\n({ foo, ...rest } = something);\nconsole.log(rest);",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/10952
		"/*eslint custom/use-every-a:1*/ !function(b, a) { return 1 }",

		// https://github.com/eslint/eslint/issues/10982
		"var a = function () { a(); }; a();",
		"var a = function(){ return function () { a(); } }; a();",
		{
			code: "const a = () => { a(); }; a();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const a = () => () => { a(); }; a();",
			languageOptions: { ecmaVersion: 2015 },
		},

		// export * as ns from "source"
		{
			code: 'export * as ns from "source"',
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},

		// import.meta
		{
			code: "import.meta",
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/17299
		{
			code: "var a; a ||= 1;",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var a; a &&= 1;",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var a; a ??= 1;",
			languageOptions: { ecmaVersion: 2021 },
		},

		// ignore class with static initialization block https://github.com/eslint/eslint/issues/17772
		{
			code: "class Foo { static {} }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static {} }",
			options: [
				{
					ignoreClassWithStaticInitBlock: true,
					varsIgnorePattern: "^_",
				},
			],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static {} }",
			options: [
				{
					ignoreClassWithStaticInitBlock: false,
					varsIgnorePattern: "^Foo",
				},
			],
			languageOptions: { ecmaVersion: 2022 },
		},

		// https://github.com/eslint/eslint/issues/17568
		{
			code: "const a = 5; const _c = a + 5;",
			options: [
				{
					args: "all",
					varsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function foo(a, _b) { return a + 5 })(5)",
			options: [
				{
					args: "all",
					argsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
		},
		{
			code: "const [ a, _b, c ] = items;\nconsole.log(a+c);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "using resource = getResource();\nresource;",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "using resource = getResource();",
			options: [{ ignoreUsingDeclarations: true }],
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "await using resource = getResource();",
			options: [{ ignoreUsingDeclarations: true }],
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "const MyComponent = () => <div />; <MyComponent />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "function Header() { return <header />; } <Header />;",
			languageOptions: {
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import { Card } from './card.jsx'; <Card />",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "const components = { Button: () => <button /> }; <components.Button />;",
			languageOptions: {
				ecmaVersion: 2020,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import * as Icons from './icons'; <Icons.Close />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import React from 'react'; <React.Fragment></React.Fragment>;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import { Card, Button } from './components.jsx'; export const Component = () => <Card><Button /></Card>;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
	],
	invalid: [
		{
			code: "function foox() { return foox(); }",
		},
		{
			code: "(function() { function foox() { if (true) { return foox(); } } }())",
		},
		{
			code: "var a=10",
		},
		{
			code: "function f() { var a = 1; return function(){ f(a *= 2); }; }",
		},
		{
			code: "function f() { var a = 1; return function(){ f(++a); }; }",
		},
		{
			code: "/*global a */",
		},
		{
			code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});}",
		},
		{
			code: "var a=10;",
			options: ["all"],
		},
		{
			code: "var a=10; a=20;",
			options: ["all"],
		},
		{
			code: "var a=10; (function() { var a = 1; alert(a); })();",
			options: ["all"],
		},
		{
			code: "var a=10, b=0, c=null; alert(a+b)",
			options: ["all"],
		},
		{
			code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);",
			options: ["all"],
		},
		{
			code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);",
			options: ["all"],
		},
		{
			code: "function f(){var a=[];return a.map(function(){});}",
			options: ["all"],
		},
		{
			code: "function f(){var a=[];return a.map(function g(){});}",
			options: ["all"],
		},
		{
			code: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }",
		},
		{
			code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}",
			options: ["all"],
		},
		{
			code: "function f(a) {}; f();",
			options: ["all"],
		},
		{
			code: "function a(x, y, z){ return y; }; a();",
			options: ["all"],
		},
		{
			code: "var min = Math.min",
			options: ["all"],
		},
		{
			code: "var min = {min: 1}",
			options: ["all"],
		},
		{
			code: "Foo.bar = function(baz) { return 1; }",
			options: ["all"],
		},
		{
			code: "var min = {min: 1}",
			options: [{ vars: "all" }],
		},
		{
			code: "function gg(baz, bar) { return baz; }; gg();",
			options: [{ vars: "all" }],
		},
		{
			code: "(function(foo, baz, bar) { return baz; })();",
			options: [{ vars: "all", args: "after-used" }],
		},
		{
			code: "(function(foo, baz, bar) { return baz; })();",
			options: [{ vars: "all", args: "all" }],
		},
		{
			code: "(function z(foo) { var bar = 33; })();",
			options: [{ vars: "all", args: "all" }],
		},
		{
			code: "(function z(foo) { z(); })();",
			options: [{}],
		},
		{
			code: "function f() { var a = 1; return function(){ f(a = 2); }; }",
			options: [{}],
		},
		{
			code: 'import x from "y";',
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function fn2({ x, y }) {\n console.log(x); \n};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function fn2( x, y ) {\n console.log(x); \n};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// exported
		{
			code: "/*exported max*/ var max = 1, min = {min: 1}",
		},
		{
			code: "/*exported x*/ var { x, y } = z",
			languageOptions: { ecmaVersion: 6 },
		},

		// ignore pattern
		{
			code: "var _a; var b;",
			options: [{ vars: "all", varsIgnorePattern: "^_" }],
		},
		{
			code: "var a; function foo() { var _b; var c_; } foo();",
			options: [{ vars: "local", varsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(a, _b) { } foo();",
			options: [{ args: "all", argsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(a, _b, c) { return a; } foo();",
			options: [{ args: "after-used", argsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(_a) { } foo();",
			options: [{ args: "all", argsIgnorePattern: "[iI]gnored" }],
		},
		{
			code: "var [ firstItemIgnored, secondItem ] = items;",
			options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/15611
		{
			code: "const array = ['a', 'b', 'c']; const [a, _b, c] = array; const newArray = [a, c];",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const array = ['a', 'b', 'c', 'd', 'e']; const [a, _b, c] = array;",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const array = ['a', 'b', 'c'];\nconst [a, _b, c] = array;\nconst fooArray = ['foo'];\nconst barArray = ['bar'];\nconst ignoreArray = ['ignore'];",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "ignore",
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const array = [obj]; const [{_a, foo}] = array; console.log(foo);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "function foo([{_a, bar}]) {bar;}foo();",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let _a, b; foo.forEach(item => { [a, b] = item; });",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
		},

		// for-in loops (see #2342)
		{
			code: "(function(obj) { var name; for ( name in obj ) { i(); return; } })({});",
		},
		{
			code: "(function(obj) { var name; for ( name in obj ) { } })({});",
		},
		{
			code: "(function(obj) { for ( var name in obj ) { } })({});",
		},
		{
			code: "for ( var { foo } in bar ) { }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for ( var [ foo ] in bar ) { }",
			languageOptions: { ecmaVersion: 6 },
		},

		// For-of loops
		{
			code: "(function(iter) { var name; for ( name of iter ) { i(); return; } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { var name; for ( name of iter ) { } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( var name of iter ) { } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for ( var { foo } of bar ) { }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for ( var [ foo ] of bar ) { }",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/3617
		{
			code: "\n/* global foobar, foo, bar */\nfoobar;",
		},
		{
			code: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar;",
		},

		// Rest property sibling without ignoreRestSiblings
		{
			code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
			languageOptions: { ecmaVersion: 2018 },
		},

		// Unused rest property with ignoreRestSiblings
		{
			code: "const data = { type: 'coords', x: 2, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let type, coords;\n({ type, ...coords } = data);\n console.log(type)",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},

		// Unused rest property without ignoreRestSiblings
		{
			code: "const data = { type: 'coords', x: 3, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
			languageOptions: { ecmaVersion: 2018 },
		},

		// Nested array destructuring with rest property
		{
			code: "const data = { vars: ['x','y'], x: 1, y: 2 };\nconst { vars: [x], ...coords } = data;\n console.log(coords)",
			languageOptions: { ecmaVersion: 2018 },
		},

		// Nested object destructuring with rest property
		{
			code: "const data = { defaults: { x: 0 }, x: 1, y: 2 };\nconst { defaults: { x }, ...coords } = data;\n console.log(coords)",
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/8119
		{
			code: "(({a, ...rest}) => {})",
			options: [{ args: "all", ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/3714
		{
			code: "/* global a$fooz,$foo */\na$fooz;",
		},
		{
			code: "/* globals a$fooz, $ */\na$fooz;",
		},
		{
			code: "/*globals $foo*/",
		},
		{
			code: "/* global global*/",
		},
		{
			code: "/*global foo:true*/",
		},

		// non ascii.
		{
			code: "/*global 変数, 数*/\n変数;",
		},

		// surrogate pair.
		{
			code: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/4047
		{
			code: "export default function(a) {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default function(a, b) { console.log(a); }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (function(a) {});",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (function(a, b) { console.log(a); });",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (a) => {};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (a, b) => { console.log(a); };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// caughtErrors
		{
			code: "try{}catch(err){};",
		},
		{
			code: "try{}catch(err){};",
			options: [{ caughtErrors: "all" }],
		},
		{
			code: "try{}catch(err){};",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
		},
		{
			code: "try{}catch(err){};",
			options: [{ caughtErrors: "all", varsIgnorePattern: "^err" }],
		},
		{
			code: "try{}catch(err){};",
			options: [{ caughtErrors: "all", varsIgnorePattern: "^." }],
		},

		// multiple try catch with one success
		{
			code: "try{}catch(ignoreErr){}try{}catch(err){};",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
		},

		// multiple try catch both fail
		{
			code: "try{}catch(error){}try{}catch(err){};",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
		},

		// caughtErrors with other configs
		{
			code: "try{}catch(err){};",
			options: [{ vars: "all", args: "all", caughtErrors: "all" }],
		},

		// no conflict in ignore patterns
		{
			code: "try{}catch(err){};",
			options: [
				{
					vars: "all",
					args: "all",
					caughtErrors: "all",
					argsIgnorePattern: "^er",
				},
			],
		},

		// Ignore reads for modifications to itself: https://github.com/eslint/eslint/issues/6348
		{ code: "var a = 0; a = a + 1;",},
		{ code: "var a = 0; a = a + a;",},
		{ code: "var a = 0; a += a + 1;",},
		{ code: "var a = 0; a++;",},
		{
			code: "function foo(a) { a = a + 1 } foo();",
		},
		{
			code: "function foo(a) { a += a + 1 } foo();",
		},
		{
			code: "function foo(a) { a++ } foo();",
		},
		{ code: "var a = 3; a = a * 5 + 6;",},
		{
			code: "var a = 2, b = 4; a = a * 2 + b;",
		},

		// https://github.com/eslint/eslint/issues/6576 (For coverage)
		{
			code: "function foo(cb) { cb = function(a) { cb(1 + a); }; bar(not_cb); } foo();",
		},
		{
			code: "function foo(cb) { cb = function(a) { return cb(1 + a); }(); } foo();",
		},
		{
			code: "function foo(cb) { cb = (function(a) { cb(1 + a); }, cb); } foo();",
		},
		{
			code: "function foo(cb) { cb = (0, function(a) { cb(1 + a); }); } foo();",
		},

		// https://github.com/eslint/eslint/issues/6646
		{
			code: [
				"while (a) {",
				"    function foo(b) {",
				"        b = b + 1;",
				"    }",
				"    foo()",
				"}",
			].join("\n"),
		},

		// https://github.com/eslint/eslint/issues/7124
		{
			code: "(function(a, b, c) {})",
			options: [{ argsIgnorePattern: "c" }],
		},
		{
			code: "(function(a, b, {c, d}) {})",
			options: [{ argsIgnorePattern: "[cd]" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(a, b, {c, d}) {})",
			options: [{ argsIgnorePattern: "c" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(a, b, {c, d}) {})",
			options: [{ argsIgnorePattern: "d" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "/*global\rfoo*/",
		},

		// https://github.com/eslint/eslint/issues/8442
		{
			code: "(function ({ a }, b ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "(function ({ a }, { b, c } ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
		},

		// https://github.com/eslint/eslint/issues/14325
		{
			code: "let x = 0;\nx++, x = 0;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0;\nx++, x = 0;\nx=3;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; x++, 0;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; 0, x++;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; 0, (1, x++);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; foo = (x++, 0);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; foo = ((0, x++), 0);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; x += 1, 0;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; 0, x += 1;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; 0, (1, x += 1);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; foo = (x += 1, 0);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let x = 0; foo = ((0, x += 1), 0);",
			languageOptions: { ecmaVersion: 2015 },
		},

		// https://github.com/eslint/eslint/issues/14866
		{
			code: "let z = 0;\nz = z + 1, z = 2;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let z = 0;\nz = z+1, z = 2;\nz = 3;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let z = 0;\nz = z+1, z = 2;\nz = z+3;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let x = 0; 0, x = x+1;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let x = 0; x = x+1, 0;",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let x = 0; foo = ((0, x = x + 1), 0);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let x = 0; foo = (x = x+1, 0);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let x = 0; 0, (1, x=x+1);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(function ({ a, b }, { c } ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "(function ([ a ], b ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "(function ([ a ], [ b, c ] ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "(function ([ a, b ], [ c ] ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
		},

		// https://github.com/eslint/eslint/issues/9774
		{
			code: "(function(_a) {})();",
			options: [{ args: "all", varsIgnorePattern: "^_" }],
		},
		{
			code: "(function(_a) {})();",
			options: [{ args: "all", caughtErrorsIgnorePattern: "^_" }],
		},

		// https://github.com/eslint/eslint/issues/10982
		{
			code: "var a = function() { a(); };",
		},
		{
			code: "var a = function(){ return function() { a(); } };",
		},
		{
			code: "const a = () => () => { a(); };",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let myArray = [1,2,3,4].filter((x) => x == 0);\nmyArray = myArray.filter((x) => x == 1);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const a = 1; a += 1;",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const a = () => { a(); };",
			languageOptions: { ecmaVersion: 2015 },
		},

		// https://github.com/eslint/eslint/issues/14324
		{
			code: "let x = [];\nx = x.concat(x);",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "let a = 'a';\na = 10;\nfunction foo(){a = 11;a = () => {a = 13}}",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let foo;\ninit();\nfoo = foo + 2;\nfunction init() {foo = 1;}",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "function foo(n) {\nif (n < 2) return 1;\nreturn n * foo(n - 1);}",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "let c = 'c';\nc = 10;\nfunction foo1() {c = 11; c = () => { c = 13 }} c = foo1",
			languageOptions: { ecmaVersion: 2020 },
		},

		// ignore class with static initialization block https://github.com/eslint/eslint/issues/17772
		{
			code: "class Foo { static {} }",
			options: [{ ignoreClassWithStaticInitBlock: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static { var bar; } }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo {}",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static bar; }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static bar() {} }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// https://github.com/eslint/eslint/issues/17568
		{
			code: "const _a = 5;const _b = _a + 5",
			options: [
				{
					args: "all",
					varsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const _a = 42; foo(() => _a);",
			options: [
				{
					args: "all",
					varsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: " (function foo(_a) { return _a + 5 })(5)",
			options: [
				{
					args: "all",
					argsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
		},
		{
			code: "const [ a, _b ] = items;\nconsole.log(a+_b);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let _x;\n[_x] = arr;\nfoo(_x);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
					varsIgnorePattern: "[iI]gnored",
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [ignored] = arr;\nfoo(ignored);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
					varsIgnorePattern: "[iI]gnored",
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "try{}catch(_err){console.error(_err)}",
			options: [
				{
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
		},
		{
			code: "try {} catch ({ message }) { console.error(message); }",
			options: [
				{
					caughtErrorsIgnorePattern: "message",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "try {} catch ([_a, _b]) { doSomething(_a, _b); }",
			options: [
				{
					caughtErrorsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "try {} catch ([_a, _b]) { doSomething(_a, _b); }",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
try {
} catch (_) {
  _ = 'foo'
}
            `,
			options: [{ caughtErrorsIgnorePattern: "foo" }],
		},
		{
			code: `
try {
} catch (_) {
  _ = 'foo'
}
            `,
			options: [
				{
					caughtErrorsIgnorePattern: "ignored",
					varsIgnorePattern: "_",
				},
			],
		},
		{
			code: "try {} catch ({ message, errors: [firstError] }) {}",
			options: [{ caughtErrorsIgnorePattern: "foo" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "try {} catch ({ stack: $ }) { $ = 'Something broke: ' + $; }",
			options: [{ caughtErrorsIgnorePattern: "\\w" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "_ => { _ = _ + 1 };",
			options: [
				{
					argsIgnorePattern: "ignored",
					varsIgnorePattern: "_",
				},
			],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const [a, b, c] = foo; alert(a + c);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [a = aDefault] = foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [[a = aDefault]]= foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [[a = aDefault], b]= foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [a = aDefault, b] = foo; alert(b);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a([a = aDefault]) { } a();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a([[a = aDefault]]) { } a();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a([a = aDefault, b]) { alert(b); } a();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a([[a = aDefault, b]]) { alert(b); } a();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a: a1 } = foo",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a: a1, b: b1 } = foo; alert(b1);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a: a1, b: b1 } = foo; alert(a1);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function a({ a: a1 }) {} a();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a: a1 = aDefault } = foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [{ a: a1 = aDefault }] = foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a = aDefault } = foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a = aDefault, b } = foo; alert(b);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a, b = bDefault } = foo; alert(a);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { a, b = bDefault, c } = foo; alert(a + c);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { [key]: a } = foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [...{ a, b }] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo (...rest) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo (a, ...rest) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const {...rest} = foo;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const {a, ...rest} = foo; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const {...rest} = foo, a = bar; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const a = bar, {...rest} = foo; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo ({...rest}) { } foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo (a, {...rest}) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo ({...rest}, a) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [...rest] = foo;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[...rest]] = foo;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, ...rest] = foo; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo ([...rest]) { } foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, ...{ b }] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[a, ...{ b }]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [...[a]] = array;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[...[a]]] = array;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [...[a, b]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, ...[b]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[a, ...[b]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, ...[b]] = array; alert(b);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, ...[[ b ]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, ...[{ b }]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo([a, ...[[ b ]]]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo([a, ...[{ b }]]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo(...[[ a ]]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo(...[{ a }]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo(a, ...[b]) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, [b]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[a, [b]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [a, [[b]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function a([[b]]) {} a();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function a([[b], c]) { alert(c); } a();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [{b}, a] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[{b}, a]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [[[{b}], a]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function a([{b}]) {} a();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function a([{b}, c]) { alert(c); } a();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { a: { b }, c } = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { c, a: { b } } = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { a: { b: { c }, d } } = foo; alert(d);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { a: { b: { c: { e } }, d } } = foo; alert(d);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [{ a: { b }, c }] = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { a: [{ b }]} = foo;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { a: [[ b ]]} = foo;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const [{ a: [{ b }]}] = foo;",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "const { a: [{ b }], c} = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo({ a: [{ b }]}) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "function foo({ a: [[ b ]]}) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "let a = foo, b = 'bar'; alert(b);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "let a = foo, b = 'bar'; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "let { a } = foo, bar = 'hello'; alert(bar);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "let bar = 'hello', { a } = foo; alert(bar);",
			languageOptions: { ecmaVersion: 2023 },
		},
		{
			code: "import a from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import * as foo from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import a, * as foo from 'module'; a();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import a, * as foo from 'module'; foo.hello;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { a } from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { a, b } from 'module'; alert(b);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { a, b } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { a as foo } from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { a as foo, b } from 'module'; alert(b);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { a, b as foo } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { default as foo, a } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, { a } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import foo, { a } from 'module'; foo();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "let a; a = foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "array.forEach(a => {})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if (foo()) var bar;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for (;;) var foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for (a in b) var foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for (a of b) var foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "while (a) var foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "do var foo; while (b);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "with (a) var foo;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var a;'use strict';b(00);",
		},
		{
			code: "var [a] = foo;'use strict';b(00);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [...a] = foo;'use strict';b(00);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var {a} = foo;'use strict';b(00);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "console.log('foo')\nvar a\n+b > 0 ? bar() : baz()",
		},
		{
			code: "console.log('foo')\nvar [a] = foo;\n+b > 0 ? bar() : baz()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "console.log('foo')\nvar {a} = foo;\n+b > 0 ? bar() : baz()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x;\n() => x = 1;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let [a = 1] = arr;\na = 2;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 1, b){alert(b);} foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 1) {a = 2;} foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = 1, b) {a = 2;} foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "using resource = getResource();",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "await using resource = getResource();",
			languageOptions: {
				sourceType: "module",
				ecmaVersion: 2026,
			},
		},
		{
			code: "const UnusedComponent = () => <div />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import { Card } from './card.jsx'; <MyCard />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import { Card, Button } from './components.jsx'; <Card />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import Card from './Card'; const Button = () => <button />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "import { Card as MyCard } from './card.jsx'; <Card />;",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
	],
};
