export default {
	valid: [
		"var x = 5;",
		"var x =5, y;",
		"foo();",
		"x = foo();",
		'setTimeout(function() {foo = "bar"; });',
		'setTimeout(function() {foo = "bar";});',
		"for (var a in b){}",
		"for (var i;;){}",
		"if (true) {}\n;[global, extended].forEach(function(){});",
		"throw new Error('foo');",
		{ code: "throw new Error('foo')", options: ["never"] },
		{ code: "var x = 5", options: ["never"] },
		{ code: "var x =5, y", options: ["never"] },
		{ code: "foo()", options: ["never"] },
		{ code: "debugger", options: ["never"] },
		{ code: "for (var a in b){}", options: ["never"] },
		{ code: "for (var i;;){}", options: ["never"] },
		{ code: "x = foo()", options: ["never"] },
		{
			code: "if (true) {}\n;[global, extended].forEach(function(){})",
			options: ["never"],
		},
		{
			code: "(function bar() {})\n;(function foo(){})",
			options: ["never"],
		},
		{ code: ";/foo/.test('bar')", options: ["never"] },
		{ code: ";+5", options: ["never"] },
		{ code: ";-foo()", options: ["never"] },
		{ code: "a++\nb++", options: ["never"] },
		{ code: "a++; b++", options: ["never"] },
		{
			code: "for (let thing of {}) {\n  console.log(thing);\n}",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "do{}while(true)", options: ["never"] },
		{ code: "do{}while(true);", options: ["always"] },
		{
			code: "class C { static {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static {} }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); } }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); bar(); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); bar(); baz();} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo() } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\nbar() } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\nbar()\nbaz() } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); bar() } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\n (a) } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\n ;(a) } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\n [a] } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\n ;[a] } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\n +a } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\n ;+a } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\n -a } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\n ;-a } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\n /a/ } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\n ;/a/} }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\n (a) } }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { do ; while (foo)\n (a)} }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { do ; while (foo)\n ;(a)} }",
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// omitLastInOneLineBlock: true
		{
			code: "if (foo) { bar() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo) { bar(); baz() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo)\n{ bar(); baz() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo) {\n bar(); baz(); }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo) { bar(); baz(); \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo() { bar(); baz() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo()\n{ bar(); baz() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo(){\n bar(); baz(); }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo(){ bar(); baz(); \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "() => { bar(); baz() };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "() =>\n { bar(); baz() };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "() => {\n bar(); baz(); };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "() => { bar(); baz(); \n};",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const obj = { method() { bar(); baz() } };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const obj = { method()\n { bar(); baz() } };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const obj = { method() {\n bar(); baz(); } };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const obj = { method() { bar(); baz(); \n} };",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\n method() { bar(); baz() } \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\n method()\n { bar(); baz() } \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\n method() {\n bar(); baz(); } \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\n method() { bar(); baz(); \n} \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\n static { bar(); baz() } \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {\n static\n { bar(); baz() } \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {\n static {\n bar(); baz(); } \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {\n static { bar(); baz(); \n} \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// omitLastInOneLineClassBody: true
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
                export class Variant2 extends SomeClass{type=2}
                export class Variant3 extends SomeClass{type=3}
                export class Variant4 extends SomeClass{type=4}
                export class Variant5 extends SomeClass{type=5}
            `,
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                        console.log(this.anotherType);
                    }
                }

                export class Variant1 extends SomeClass{type=1; anotherType=2}
            `,
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1;}
                export class Variant2 extends SomeClass{type=2;}
                export class Variant3 extends SomeClass{type=3;}
                export class Variant4 extends SomeClass{type=4;}
                export class Variant5 extends SomeClass{type=5;}
            `,
			options: ["always", { omitLastInOneLineClassBody: false }],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "class C {\nfoo;}",
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {foo;\n}",
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {foo;\nbar;}",
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "{ foo; }",
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C\n{ foo }",
			options: ["always", { omitLastInOneLineClassBody: true }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// method definitions and static blocks don't have a semicolon.
		{
			code: "class A { a() {} b() {} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var A = class { a() {} b() {} };",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { static {} }",
			languageOptions: { ecmaVersion: 2022 },
		},

		{
			code: "import theDefault, { named1, named2 } from 'src/mylib';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import theDefault, { named1, named2 } from 'src/mylib'",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// exports, "always"
		{
			code: "export * from 'foo';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export { foo } from 'foo';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = 0;export { foo };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export var foo;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function foo () { }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function* foo () { }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export class Foo { }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export let foo;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export const FOO = 42;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default function() { }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default function* () { }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default class { }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo || bar;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (foo) => foo.bar();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo = 42;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo += 42;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// exports, "never"
		{
			code: "export * from 'foo'",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export { foo } from 'foo'",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = 0; export { foo }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export var foo",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function foo () { }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function* foo () { }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export class Foo { }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export let foo",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export const FOO = 42",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default function() { }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default function* () { }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default class { }",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo || bar",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (foo) => foo.bar()",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo = 42",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo += 42",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{ code: "++\nfoo;", options: ["always"] },
		{ code: "var a = b;\n+ c", options: ["never"] },

		// https://github.com/eslint/eslint/issues/7782
		{ code: "var a = b;\n/foo/.test(c)", options: ["never"] },
		{
			code: "var a = b;\n`foo`",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/9521
		{
			code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "any" }],
		},
		{
			code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "any" }],
		},
		{
			code: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                var a = 0; export {a};
                [a] = b
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                while (true) {
                    break;
                    +i
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
		},
		{
			code: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
		},
		{
			code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
		},
		{
			code: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                var a = 0; export {a}
                [a] = b
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                while (true) {
                    break
                    +i
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// Class fields
		{
			code: "class C { foo; }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = obj\n;[bar] }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo;\n[bar]; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n;[bar] }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n[bar] }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n;[bar] }",
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n[bar] }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = () => {}\n;[bar] }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = () => {}\n[bar] }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = () => {}\n;[bar] }",
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = () => {}\n[bar] }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo() {} }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo() {}; }", // no-extra-semi reports it
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static {}; }", // no-extra-semi reports it
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { a=b;\n*foo() {} }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { get;\nfoo() {} }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { set;\nfoo() {} }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static;\nfoo() {} }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { a=b;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { a=b;\ninstanceof }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: `
                class C {
                    x
                    [foo]

                    x;
                    [foo]

                    x = "a";
                    [foo]
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: `
                class C {
                    x
                    [foo]

                    x;
                    [foo]

                    x = 1;
                    [foo]
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n[bar] }",
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = () => {}\n[bar] }",
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n;[bar] }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = () => {}\n;[bar] }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [foo] = bar;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #foo = bar;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static static = bar;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [foo];\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [get];\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [get] = 5;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #get;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #set = 5;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static static;\nin }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "import * as utils from './utils'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { square, diag } from 'lib'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import { default as foo } from 'lib'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import 'src/mylib'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import theDefault, { named1, named2 } from 'src/mylib'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "function foo() { return [] }",
		},
		{
			code: "while(true) { break }",
		},
		{
			code: "while(true) { continue }",
		},
		{
			code: "let x = 5",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 5",
		},
		{
			code: "var x = 5, y",
		},
		{
			code: "debugger",
		},
		{
			code: "foo()",
		},
		{
			code: "foo()\n",
		},
		{
			code: "foo()\r\n",
		},
		{
			code: "foo()\nbar();",
		},
		{
			code: "foo()\r\nbar();",
		},
		{
			code: "for (var a in b) var i ",
		},
		{
			code: "for (;;){var i}",
		},
		{
			code: "for (;;) var i ",
		},
		{
			code: "for (var j;;) {var i}",
		},
		{
			code: "var foo = {\n bar: baz\n}",
		},
		{
			code: "var foo\nvar bar;",
		},
		{
			code: "throw new Error('foo')",
		},
		{
			code: "do{}while(true)",
		},
		{
			code: "if (foo) {bar()}",
		},
		{
			code: "if (foo) {bar()} ",
		},
		{
			code: "if (foo) {bar()\n}",
		},

		{
			code: "throw new Error('foo');",
			options: ["never"],
		},
		{
			code: "function foo() { return []; }",
			options: ["never"],
		},
		{
			code: "while(true) { break; }",
			options: ["never"],
		},
		{
			code: "while(true) { continue; }",
			options: ["never"],
		},
		{
			code: "let x = 5;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 5;",
			options: ["never"],
		},
		{
			code: "var x = 5, y;",
			options: ["never"],
		},
		{
			code: "debugger;",
			options: ["never"],
		},
		{
			code: "foo();",
			options: ["never"],
		},
		{
			code: "for (var a in b) var i; ",
			options: ["never"],
		},
		{
			code: "for (;;){var i;}",
			options: ["never"],
		},
		{
			code: "for (;;) var i; ",
			options: ["never"],
		},
		{
			code: "for (var j;;) {var i;}",
			options: ["never"],
		},
		{
			code: "var foo = {\n bar: baz\n};",
			options: ["never"],
		},
		{
			code: "import theDefault, { named1, named2 } from 'src/mylib';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "do{}while(true);",
			options: ["never"],
		},
		{
			code: "class C { static { foo() } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo() } }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); bar() } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\nbar(); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); bar()\nbaz(); } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo(); } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo();\nbar() } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\nbar(); } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo()\nbar();\nbaz() } }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { do ; while (foo)\n (a)} }",
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { do ; while (foo)\n ;(a)} }",
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// omitLastInOneLineBlock: true
		{
			code: "if (foo) { bar()\n }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo) {\n bar() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo) {\n bar(); baz() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "if (foo) { bar(); }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo() { bar(); baz(); }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo()\n{ bar(); baz(); }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo() {\n bar(); baz() }",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "function foo() { bar(); baz() \n}",
			options: ["always", { omitLastInOneLineBlock: true }],
		},
		{
			code: "class C {\nfoo() { bar(); baz(); }\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\nfoo() \n{ bar(); baz(); }\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\nfoo() {\n bar(); baz() }\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\nfoo() { bar(); baz() \n}\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C {\nstatic { bar(); baz(); }\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {\nstatic \n{ bar(); baz(); }\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {\nstatic {\n bar(); baz() }\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C {\nfoo() { bar(); baz() \n}\n}",
			options: ["always", { omitLastInOneLineBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},

		// exports, "always"
		{
			code: "export * from 'foo'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export { foo } from 'foo'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = 0;export { foo }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export var foo",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export let foo",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export const FOO = 42",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo || bar",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (foo) => foo.bar()",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo = 42",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo += 42",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// exports, "never"
		{
			code: "export * from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export { foo } from 'foo';",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "var foo = 0;export { foo };",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export var foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export let foo;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export const FOO = 42;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo || bar;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default (foo) => foo.bar();",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo = 42;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export default foo += 42;",
			options: ["never"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "a;\n++b",
			options: ["never"],
		},

		// https://github.com/eslint/eslint/issues/7928
		{
			code: [
				"/*eslint no-extra-semi: error */",
				"foo();",
				";[0,1,2].forEach(bar)",
			].join("\n"),
.join("\n"),
			options: ["never"],
		},

		// https://github.com/eslint/eslint/issues/9521
		{
			code: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                var a = 0; export {a}
                [a] = b
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                while (true) {
                    break
                   +i
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
		},
		{
			code: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
		},
		{
			code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
		},
		{
			code: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "always" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                var a = 0; export {a};
                [a] = b
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                while (true) {
                    break;
                    +i
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: `
                import a from "a"
                ;[1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                var a = 0; export {a}
                ;[1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: `
                function wrap() {
                    return
                    ;[1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                while (true) {
                    break
                    ;[1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                while (true) {
                    continue
                    ;[1,2,3].forEach(doSomething)
                }
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                do; while(a)
                ;[1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
		},
		{
			code: `
                const f = () => {}
                ;[1,2,3].forEach(doSomething)
            `,
			options: ["never", { beforeStatementContinuationChars: "never" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// Class fields
		{
			code: "class C { foo }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo; }",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo\n[bar]; }",
			options: ["always"],
			languageOptions: { ecmaVersion: 2022 },
		},

		// class fields
		{
			code: "class C { [get];\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { [set];\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #get;\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #set;\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #static;\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { get=1;\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static static;\nfoo\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static;\n}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2022 },
		},

		// omitLastInOneLineClassBody
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
            `,
			options: ["always", { omitLastInOneLineClassBody: false }],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
            `,
			options: [
				"always",
				{
					omitLastInOneLineClassBody: false,
					omitLastInOneLineBlock: true,
				},
			],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1;}
            `,
			options: [
				"always",
				{
					omitLastInOneLineClassBody: true,
					omitLastInOneLineBlock: false,
				},
			],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                        console.log(this.anotherType);
                    }
                }

                export class Variant1 extends SomeClass{type=1; anotherType=2}
            `,
			options: [
				"always",
				{
					omitLastInOneLineClassBody: false,
					omitLastInOneLineBlock: true,
				},
			],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
	],
};
