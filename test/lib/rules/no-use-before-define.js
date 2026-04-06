export default {
	valid: [
		"unresolved",
		"Array",
		"function foo () { arguments; }",
		"var a=10; alert(a);",
		"function b(a) { alert(a); }",
		"Object.hasOwnProperty.call(a);",
		"function a() { alert(arguments);}",
		{
			code: "a(); function a() { alert(arguments); }",
			options: ["nofunc"],
		},
		{
			code: "(() => { var a = 42; alert(a); })();",
			languageOptions: { ecmaVersion: 6 },
		},
		"a(); try { throw new Error() } catch (a) {}",
		{ code: "class A {} new A();", languageOptions: { ecmaVersion: 6 } },
		"var a = 0, b = a;",
		{
			code: "var {a = 0, b = a} = {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [a = 0, b = a] = {};",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo() { foo(); }",
		"var foo = function() { foo(); };",
		"var a; for (a in a) {}",
		{ code: "var a; for (a of a) {}", languageOptions: { ecmaVersion: 6 } },
		{
			code: "let a; class C { static { a; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { let a; a; } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// Block-level bindings
		{
			code: '"use strict"; a(); { function a() {} }',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '"use strict"; { a(); function a() {} }',
			options: ["nofunc"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (foo) { case 1:  { a(); } default: { let a; }}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "a(); { let a = function () {}; }",
			languageOptions: { ecmaVersion: 6 },
		},

		// object style options
		{
			code: "a(); function a() { alert(arguments); }",
			options: [{ functions: false }],
		},
		{
			code: '"use strict"; { a(); function a() {} }',
			options: [{ functions: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { new A(); } class A {};",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},

		// "variables" option
		{
			code: "function foo() { bar; } var bar;",
			options: [{ variables: false }],
		},
		{
			code: "var foo = () => bar; var bar;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static { () => foo; let foo; } }",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// Tests related to class definition evaluation. These are not TDZ errors.
		{
			code: "class C extends (class { method() { C; } }) {}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class extends (class { method() { C; } }) {});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = (class extends (class { method() { C; } }) {});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends (class { field = C; }) {}",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class extends (class { field = C; }) {});",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = (class extends (class { field = C; }) {});",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [() => C](){} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { [() => C](){} });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { [() => C](){} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static [() => C](){} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { static [() => C](){} });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { static [() => C](){} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { [() => C]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { [() => C]; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { [() => C]; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static [() => C]; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static [() => C]; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static [() => C]; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { method() { C; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { method() { C; } });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { method() { C; } };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static method() { C; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { static method() { C; } });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { static method() { C; } };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { field = C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { field = C; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { field = C; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = C; });",
			languageOptions: { ecmaVersion: 2022 },
		}, // `const C = class { static field = C; };` is TDZ error
		{
			code: "class C { static field = class { static field = C; }; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = class { static field = C; }; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = () => C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { field = () => C; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { field = () => C; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = () => C; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = () => C; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static field = () => C; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = class extends C {}; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { field = class extends C {}; });",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { field = class extends C {}; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class extends C {}; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = class extends C {}; });",
			languageOptions: { ecmaVersion: 2022 },
		}, // `const C = class { static field = class extends C {}; };` is TDZ error
		{
			code: "class C { static field = class { [C]; }; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static field = class { [C]; }; });",
			languageOptions: { ecmaVersion: 2022 },
		}, // `const C = class { static field = class { [C]; } };` is TDZ error
		{
			code: "const C = class { static field = class { field = C; }; };",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { method() { a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static method() { a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { field = a; } let a;", // `class C { static field = a; } let a;` is TDZ error
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = D; } class D {}", // `class C { static field = D; } class D {}` is TDZ error
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = class extends D {}; } class D {}", // `class C { static field = class extends D {}; } class D {}` is TDZ error
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = () => a; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = () => a; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { field = () => D; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = () => D; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class { field = a; }; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { C; } }", // `const C = class { static { C; } }` is TDZ error
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { C; } static {} static { C; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static { C; } })",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { class D extends C {} } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { (class { static { C } }) } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => C; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static { () => C; } })",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static { () => C; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => D; } } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { () => a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class C { static { C.x; } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		// "allowNamedExports" option
		{
			code: "export { a }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a as b }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a, b }; let a, b;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a }; var a;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { f }; function f() {}",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { C }; class C {}",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "const App = () => <div/>; <App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "let Foo, Bar; <Foo><Bar /></Foo>;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "function App() { return <div/> } <App />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "<App />; function App() { return <div/> }",
			options: [{ functions: false }],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
	],
	invalid: [
		{
			code: "a++; var a=19;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "a++; var a=19;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "a++; var a=19;",
		},
		{
			code: "a(); var a=function() {};",
		},
		{
			code: "alert(a[1]); var a=[1,3];",
		},
		{
			code: "a(); function a() { alert(b); var b=10; a(); }",
		},
		{
			code: "a(); var a=function() {};",
			options: ["nofunc"],
		},
		{
			code: "(() => { alert(a); var a = 42; })();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(() => a())(); function a() { }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '"use strict"; a(); { function a() {} }',
		},
		{
			code: "a(); try { throw new Error() } catch (foo) {var a;}",
		},
		{
			code: "var f = () => a; var a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "new A(); class A {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { new A(); } class A {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "new A(); var A = class {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { new A(); } var A = class {};",
			languageOptions: { ecmaVersion: 6 },
		},

		// Block-level bindings
		{
			code: "a++; { var a; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '"use strict"; { a(); function a() {} }',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{a; let a = 1}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (foo) { case 1: a();\n default: \n let a;}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "if (true) { function foo() { a; } let a;}",
			languageOptions: { ecmaVersion: 6 },
		},

		// object style options
		{
			code: "a(); var a=function() {};",
			options: [{ functions: false, classes: false }],
		},
		{
			code: "new A(); class A {};",
			options: [{ functions: false, classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "new A(); var A = class {};",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() { new A(); } var A = class {};",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},

		// invalid initializers
		{
			code: "var a = a;",
		},
		{
			code: "let a = a + b;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const a = foo(a);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(a = a) {}",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var {a = a} = [];",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [a = a] = [];",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var {b = a, a} = {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [b = a, a] = {};",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var {a = 0} = a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var [a = 0] = a;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "for (var a in a) {}",
		},
		{
			code: "for (var a of a) {}",
			languageOptions: { ecmaVersion: 6 },
		},

		// "variables" option
		{
			code: "function foo() { bar; var bar = 1; } var bar;",
			options: [{ variables: false }],
		},
		{
			code: "foo; var foo;",
			options: [{ variables: false }],
		},

		// https://github.com/eslint/eslint/issues/10227
		{
			code: "for (let x = x;;); let x = 0",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "for (let x in xs); let xs = []",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "for (let x of xs); let xs = []",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "try {} catch ({message = x}) {} let x = ''",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "with (obj) x; let x = {}",
			languageOptions: { ecmaVersion: 2015 },
		},

		// WithStatements.
		{
			code: "with (x); let x = {}",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "with (obj) { x } let x = {}",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "with (obj) { if (a) { x } } let x = {}",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "with (obj) { (() => { if (a) { x } })() } let x = {}",
			languageOptions: { ecmaVersion: 2015 },
		},

		// Tests related to class definition evaluation. These are TDZ errors.
		{
			code: "class C extends C {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class extends C {};",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends (class { [C](){} }) {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class extends (class { [C](){} }) {};",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends (class { static field = C; }) {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class extends (class { static field = C; }) {};",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [C](){} }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { [C](){} });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { [C](){} };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static [C](){} }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C { static [C](){} });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const C = class { static [C](){} };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { [C]; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { [C]; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { [C]; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [C] = foo; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { [C] = foo; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { [C] = foo; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static [C]; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static [C]; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static [C]; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static [C] = foo; }",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C { static [C] = foo; });",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static [C] = foo; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static field = C; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static field = class extends C {}; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static field = class { [C]; } };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static field = class { static field = C; }; };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C extends D {} class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends (class { [a](){} }) {} let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C extends (class { static field = a; }) {} let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [a]() {} } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { static [a]() {} } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { [a]; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static [a]; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [a] = foo; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static [a] = foo; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = a; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = D; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class extends D {}; } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class { [a](){} } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static field = class { static field = a; }; } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static { C; } };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "const C = class { static { (class extends C {}); } };",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { a; } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { D; } } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { (class extends D {}); } } class D {}",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { (class { [a](){} }); } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { (class { static field = a; }); } } let a;",
			options: [{ variables: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "(class C extends C {});",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C extends (class { [C](){} }) {});",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(class C extends (class { static field = C; }) {});",
			options: [{ classes: false }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// "allowNamedExports" option
		{
			code: "export { a }; const a = 1;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a }; const a = 1;",
			options: [{}],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a }; const a = 1;",
			options: [{ allowNamedExports: false }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a }; const a = 1;",
			options: ["nofunc"],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a as b }; const a = 1;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a, b }; let a, b;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { a }; var a;",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { f }; function f() {}",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export { C }; class C {}",
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export const foo = a; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export default a; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export function foo() { return a; }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "export class C { foo() { return a; } }; const a = 1;",
			options: [{ allowNamedExports: true }],
			languageOptions: { ecmaVersion: 2015, sourceType: "module" },
		},
		{
			code: "<App />; const App = () => <div />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "function render() { return <Widget /> }; const Widget = () => <span />;",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "<Foo.Bar />; const Foo = { Bar: () => <div/> };",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
	],
};
