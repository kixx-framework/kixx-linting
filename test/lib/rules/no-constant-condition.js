export default {
	valid: [
		"if(a);",
		"if(a == 0);",
		"if(a = f());",
		"if(a += 1);",
		"if(a |= 1);",
		"if(a |= true);",
		"if(a |= false);",
		"if(a &= 1);",
		"if(a &= true);",
		"if(a &= false);",
		"if(a >>= 1);",
		"if(a >>= true);",
		"if(a >>= false);",
		"if(a >>>= 1);",
		"if(a ??= 1);",
		"if(a ??= true);",
		"if(a ??= false);",
		"if(a ||= b);",
		"if(a ||= false);",
		"if(a ||= 0);",
		"if(a ||= void 0);",
		"if(+(a ||= 1));",
		"if(f(a ||= true));",
		"if((a ||= 1) + 2);",
		"if(1 + (a ||= true));",
		"if(a ||= '' || false);",
		"if(a ||= void 0 || null);",
		"if((a ||= false) || b);",
		"if(a || (b ||= false));",
		"if((a ||= true) && b);",
		"if(a && (b ||= true));",
		"if(a &&= b);",
		"if(a &&= true);",
		"if(a &&= 1);",
		"if(a &&= 'foo');",
		"if((a &&= '') + false);",
		"if('' + (a &&= null));",
		"if(a &&= 1 && 2);",
		"if((a &&= true) && b);",
		"if(a && (b &&= true));",
		"if((a &&= false) || b);",
		"if(a || (b &&= false));",
		"if(a ||= b ||= false);",
		"if(a &&= b &&= true);",
		"if(a ||= b &&= false);",
		"if(a ||= b &&= true);",
		"if(a &&= b ||= false);",
		"if(a &&= b ||= true);",
		"if(1, a);",
		"if ('every' in []);",
		"if (`\\\n${a}`) {}",
		"if (`${a}`);",
		"if (`${foo()}`);",
		"if (`${a === 'b' && b==='a'}`);",
		"if (`foo${a}` === 'fooa');",
		"if (tag`a`);",
		"if (tag`${a}`);",
		"if (+(a || true));",
		"if (-(a || true));",
		"if (~(a || 1));",
		"if (+(a && 0) === +(b && 0));",
		"while(~!a);",
		"while(a = b);",
		"while(`${a}`);",
		"for(;x < 10;);",
		"for(;;);",
		"for(;`${a}`;);",
		"do{ }while(x)",
		"q > 0 ? 1 : 2;",
		"`${a}` === a ? 1 : 2",
		"`foo${a}` === a ? 1 : 2",
		"tag`a` === a ? 1 : 2",
		"tag`${a}` === a ? 1 : 2",
		"while(x += 3) {}",
		"while(tag`a`) {}",
		"while(tag`${a}`) {}",
		"while(`\\\n${a}`) {}",

		// #5228, typeof conditions
		"if(typeof x === 'undefined'){}",
		"if(`${typeof x}` === 'undefined'){}",
		"if(a === 'str' && typeof b){}",
		"typeof a == typeof b",
		"typeof 'a' === 'string'|| typeof b === 'string'",
		"`${typeof 'a'}` === 'string'|| `${typeof b}` === 'string'",

		// #5726, void conditions
		"if (void a || a);",
		"if (a || void a);",

		// #5693
		"if(xyz === 'str1' && abc==='str2'){}",
		"if(xyz === 'str1' || abc==='str2'){}",
		"if(xyz === 'str1' || abc==='str2' && pqr === 5){}",
		"if(typeof abc === 'string' && abc==='str2'){}",
		"if(false || abc==='str'){}",
		"if(true && abc==='str'){}",
		"if(typeof 'str' && abc==='str'){}",
		"if(abc==='str' || false || def ==='str'){}",
		"if(true && abc==='str' || def ==='str'){}",
		"if(true && typeof abc==='string'){}",

		// #11181, string literals
		"if('str1' && a){}",
		"if(a && 'str'){}",

		// #11306
		"if ((foo || true) === 'baz') {}",
		"if ((foo || 'bar') === 'baz') {}",
		"if ((foo || 'bar') !== 'baz') {}",
		"if ((foo || 'bar') == 'baz') {}",
		"if ((foo || 'bar') != 'baz') {}",
		"if ((foo || 233) > 666) {}",
		"if ((foo || 233) < 666) {}",
		"if ((foo || 233) >= 666) {}",
		"if ((foo || 233) <= 666) {}",
		"if ((key || 'k') in obj) {}",
		"if ((foo || {}) instanceof obj) {}",
		"if ((foo || 'bar' || 'bar') === 'bar');",
		{
			code: "if ((foo || 1n) === 'baz') {}",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if (a && 0n || b);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(1n && a){};",
			languageOptions: { ecmaVersion: 11 },
		},

		// #12225
		"if ('' + [y] === '' + [ty]) {}",
		"if ('a' === '' + [ty]) {}",
		"if ('' + [y, m, d] === 'a') {}",
		"if ('' + [y, 'm'] === '' + [ty, 'tm']) {}",
		"if ('' + [y, 'm'] === '' + ['ty']) {}",
		"if ([,] in\n\n($2))\n ;\nelse\n ;",
		"if ([...x]+'' === 'y'){}",

		// { checkLoops: false }
		{ code: "while(true);", options: [{ checkLoops: false }] },
		{ code: "for(;true;);", options: [{ checkLoops: false }] },
		{ code: "do{}while(true)", options: [{ checkLoops: false }] },

		// { checkLoops: "none" }
		{ code: "while(true);", options: [{ checkLoops: "none" }] },
		{ code: "for(;true;);", options: [{ checkLoops: "none" }] },
		{ code: "do{}while(true)", options: [{ checkLoops: "none" }] },

		// { checkloops: "allExceptWhileTrue" }
		{
			code: "while(true);",
			options: [{ checkLoops: "allExceptWhileTrue" }],
		},
		"while(true);",

		// { checkloops: "all" }
		{ code: "while(a == b);", options: [{ checkLoops: "all" }] },
		{ code: "do{ }while(x);", options: [{ checkLoops: "all" }] },
		{
			code: "for (let x = 0; x <= 10; x++) {};",
			options: [{ checkLoops: "all" }],
		},

		"function* foo(){while(true){yield 'foo';}}",
		"function* foo(){for(;true;){yield 'foo';}}",
		"function* foo(){do{yield 'foo';}while(true)}",
		"function* foo(){while (true) { while(true) {yield;}}}",
		"function* foo() {for (; yield; ) {}}",
		"function* foo() {for (; ; yield) {}}",
		"function* foo() {while (true) {function* foo() {yield;}yield;}}",
		"function* foo() { for (let x = yield; x < 10; x++) {yield;}yield;}",
		"function* foo() { for (let x = yield; ; x++) { yield; }}",
		"if (new Number(x) + 1 === 2) {}",

		// #15467
		"if([a]==[b]) {}",
		"if (+[...a]) {}",
		"if (+[...[...a]]) {}",
		"if (`${[...a]}`) {}",
		"if (`${[a]}`) {}",
		"if (+[a]) {}",
		"if (0 - [a]) {}",
		"if (1 * [a]) {}",

		// Boolean function
		"if (Boolean(a)) {}",
		"if (Boolean(...args)) {}",
		"if (foo.Boolean(1)) {}",
		"function foo(Boolean) { if (Boolean(1)) {} }",
		"const Boolean = () => {}; if (Boolean(1)) {}",
		{
			code: "if (Boolean()) {}",
			languageOptions: { globals: { Boolean: "off" } },
		},
		"const undefined = 'lol'; if (undefined) {}",
		{
			code: "if (undefined) {}",
			languageOptions: { globals: { undefined: "off" } },
		},
	],
	invalid: [
		{
			code: "for(;true;);",
		},
		{
			code: "for(;``;);",
		},
		{
			code: "for(;`foo`;);",
		},
		{
			code: "for(;`foo${bar}`;);",
		},
		{
			code: "do{}while(true)",
		},
		{
			code: "do{}while('1')",
		},
		{
			code: "do{}while(0)",
		},
		{
			code: "do{}while(t = -2)",
		},
		{
			code: "do{}while(``)",
		},
		{
			code: "do{}while(`foo`)",
		},
		{
			code: "do{}while(`foo${bar}`)",
		},
		{
			code: "true ? 1 : 2;",
		},
		{
			code: "1 ? 1 : 2;",
		},
		{
			code: "q = 0 ? 1 : 2;",
		},
		{
			code: "(q = 0) ? 1 : 2;",
		},
		{
			code: "`` ? 1 : 2;",
		},
		{
			code: "`foo` ? 1 : 2;",
		},
		{
			code: "`foo${bar}` ? 1 : 2;",
		},
		{
			code: "if(-2);",
		},
		{
			code: "if(true);",
		},
		{
			code: "if(1);",
		},
		{
			code: "if({});",
		},
		{
			code: "if(0 < 1);",
		},
		{
			code: "if(0 || 1);",
		},
		{
			code: "if(a, 1);",
		},
		{
			code: "if(`foo`);",
		},
		{
			code: "if(``);",
		},
		{
			code: "if(`\\\n`);",
		},
		{
			code: "if(`${'bar'}`);",
		},
		{
			code: "if(`${'bar' + `foo`}`);",
		},
		{
			code: "if(`foo${false || true}`);",
		},
		{
			code: "if(`foo${0 || 1}`);",
		},
		{
			code: "if(`foo${bar}`);",
		},
		{
			code: "if(`${bar}foo`);",
		},
		{
			code: "if(!(true || a));",
		},
		{
			code: "if(!(a && void b && c));",
		},
		{
			code: "if(0 || !(a && null));",
		},
		{
			code: "if(1 + !(a || true));",
		},
		{
			code: "if(!(null && a) > 1);",
		},
		{
			code: "if(+(!(a && 0)));",
		},
		{
			code: "if(!typeof a === 'string');",
		},
		{
			code: "if(-('foo' || a));",
		},
		{
			code: "if(+(void a && b) === ~(1 || c));",
		},
		{
			code: "if(a ||= true);",
		},
		{
			code: "if(a ||= 5);",
		},
		{
			code: "if(a ||= 'foo' || b);",
		},
		{
			code: "if(a ||= b || /regex/);",
		},
		{
			code: "if(a ||= b ||= true);",
		},
		{
			code: "if(a ||= b ||= c || 1);",
		},
		{
			code: "if(!(a ||= true));",
		},
		{
			code: "if(!(a ||= 'foo') === true);",
		},
		{
			code: "if(!(a ||= 'foo') === false);",
		},
		{
			code: "if(a || (b ||= true));",
		},
		{
			code: "if((a ||= 1) || b);",
		},
		{
			code: "if((a ||= true) && true);",
		},
		{
			code: "if(true && (a ||= true));",
		},
		{
			code: "if(a &&= false);",
		},
		{
			code: "if(a &&= null);",
		},
		{
			code: "if(a &&= void b);",
		},
		{
			code: "if(a &&= 0 && b);",
		},
		{
			code: "if(a &&= b && '');",
		},
		{
			code: "if(a &&= b &&= false);",
		},
		{
			code: "if(a &&= b &&= c && false);",
		},
		{
			code: "if(!(a &&= false));",
		},
		{
			code: "if(!(a &&= 0) + 1);",
		},
		{
			code: "if(a && (b &&= false));",
		},
		{
			code: "if((a &&= null) && b);",
		},
		{
			code: "if(false || (a &&= false));",
		},
		{
			code: "if((a &&= false) || false);",
		},

		{
			code: "while([]);",
		},
		{
			code: "while(~!0);",
		},
		{
			code: "while(x = 1);",
		},
		{
			code: "while(function(){});",
		},
		{
			code: "while(true);",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "while(1);",
		},
		{
			code: "while(() => {});",
		},
		{
			code: "while(`foo`);",
		},
		{
			code: "while(``);",
		},
		{
			code: "while(`${'foo'}`);",
		},
		{
			code: "while(`${'foo' + 'bar'}`);",
		},

		// #5228 , typeof conditions
		{
			code: "if(typeof x){}",
		},
		{
			code: "if(typeof 'abc' === 'string'){}",
		},
		{
			code: "if(a = typeof b){}",
		},
		{
			code: "if(a, typeof b){}",
		},
		{
			code: "if(typeof 'a' == 'string' || typeof 'b' == 'string'){}",
		},
		{
			code: "while(typeof x){}",
		},

		// #5726, void conditions
		{
			code: "if(1 || void x);",
		},
		{
			code: "if(void x);",
		},
		{
			code: "if(y = void x);",
		},
		{
			code: "if(x, void x);",
		},
		{
			code: "if(void x === void y);",
		},
		{
			code: "if(void x && a);",
		},
		{
			code: "if(a && void x);",
		},

		// #5693
		{
			code: "if(false && abc==='str'){}",
		},
		{
			code: "if(true || abc==='str'){}",
		},
		{
			code: "if(1 || abc==='str'){}",
		},
		{
			code: "if(abc==='str' || true){}",
		},
		{
			code: "if(abc==='str' || true || def ==='str'){}",
		},
		{
			code: "if(false || true){}",
		},
		{
			code: "if(typeof abc==='str' || true){}",
		},

		// #11181, string literals
		{
			code: "if('str' || a){}",
		},
		{
			code: "if('str' || abc==='str'){}",
		},
		{
			code: "if('str1' || 'str2'){}",
		},
		{
			code: "if('str1' && 'str2'){}",
		},
		{
			code: "if(abc==='str' || 'str'){}",
		},
		{
			code: "if(a || 'str'){}",
		},

		{
			code: "while(x = 1);",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "do{ }while(x = 1)",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "for (;true;) {};",
			options: [{ checkLoops: "all" }],
		},

		{
			code: "function* foo(){while(true){} yield 'foo';}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "function* foo(){while(true){} yield 'foo';}",
			options: [{ checkLoops: true }],
		},
		{
			code: "function* foo(){while(true){if (true) {yield 'foo';}}}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "function* foo(){while(true){if (true) {yield 'foo';}}}",
			options: [{ checkLoops: true }],
		},
		{
			code: "function* foo(){while(true){yield 'foo';} while(true) {}}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "function* foo(){while(true){yield 'foo';} while(true) {}}",
			options: [{ checkLoops: true }],
		},
		{
			code: "var a = function* foo(){while(true){} yield 'foo';}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "var a = function* foo(){while(true){} yield 'foo';}",
			options: [{ checkLoops: true }],
		},
		{
			code: "while (true) { function* foo() {yield;}}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "while (true) { function* foo() {yield;}}",
			options: [{ checkLoops: true }],
		},
		{
			code: "function* foo(){if (true) {yield 'foo';}}",
		},
		{
			code: "function* foo() {for (let foo = yield; true;) {}}",
		},
		{
			code: "function* foo() {for (foo = yield; true;) {}}",
		},
		{
			code: "function foo() {while (true) {function* bar() {while (true) {yield;}}}}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "function foo() {while (true) {const bar = function*() {while (true) {yield;}}}}",
			options: [{ checkLoops: "all" }],
		},
		{
			code: "function* foo() { for (let foo = 1 + 2 + 3 + (yield); true; baz) {}}",
		},

		// #12225
		{
			code: "if([a]) {}",
		},
		{
			code: "if([]) {}",
		},
		{
			code: "if(''+['a']) {}",
		},
		{
			code: "if(''+[]) {}",
		},
		{
			code: "if(+1) {}",
		},
		{
			code: "if ([,] + ''){}",
		},

		// #13238
		{
			code: "if(/foo/ui);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0b0n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0o0n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0x0n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0b1n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0o1n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0x1n);",
			languageOptions: { ecmaVersion: 11 },
		},
		{
			code: "if(0x1n || foo);",
			languageOptions: { ecmaVersion: 11 },
		},

		// Classes and instances are always truthy
		{ code: "if(class {}) {}",},
		{ code: "if(new Foo()) {}",},

		// Boxed primitives are always truthy
		{
			code: "if(new Boolean(foo)) {}",
		},
		{
			code: "if(new String(foo)) {}",
		},
		{
			code: "if(new Number(foo)) {}",
		},

		// Spreading a constant array
		{
			code: "if(`${[...['a']]}`) {}",
		},

		/*
		 * undefined is always falsy (except in old browsers that let you
		 * re-assign, but that's an obscure enough edge case to not worry about)
		 */
		{ code: "if (undefined) {}",},

		// Coercion to boolean via Boolean function
		{ code: "if (Boolean(1)) {}",},
		{ code: "if (Boolean()) {}",},
		{ code: "if (Boolean([a])) {}",},
		{
			code: "if (Boolean(1)) { function Boolean() {}}",
		},
	],
};
