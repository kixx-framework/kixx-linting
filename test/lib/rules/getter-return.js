export default {
	valid: [
		/*
		 * test obj: get
		 * option: {allowImplicit: false}
		 */
		"var foo = { get bar(){return true;} };",

		// option: {allowImplicit: true}
		{ code: "var foo = { get bar() {return;} };", options: [{ allowImplicit: true }] },
		{ code: "var foo = { get bar(){return true;} };", options: [{ allowImplicit: true }] },
		{
			code: "var foo = { get bar(){if(bar) {return;} return true;} };",
			options: [{ allowImplicit: true }],
		},

		/*
		 * test class: get
		 * option: {allowImplicit: false}
		 */
		"class foo { get bar(){return true;} }",
		"class foo { get bar(){if(baz){return true;} else {return false;} } }",
		"class foo { get(){return true;} }",

		// option: {allowImplicit: true}
		{ code: "class foo { get bar(){return true;} }", options: [{ allowImplicit: true }] },
		{ code: "class foo { get bar(){return;} }", options: [{ allowImplicit: true }] },

		/*
		 * test object.defineProperty(s)
		 * option: {allowImplicit: false}
		 */
		'Object.defineProperty(foo, "bar", { get: function () {return true;}});',
		'Object.defineProperty(foo, "bar", { get: function () { ~function (){ return true; }();return true;}});',
		"Object.defineProperties(foo, { bar: { get: function () {return true;}} });",
		"Object.defineProperties(foo, { bar: { get: function () { ~function (){ return true; }(); return true;}} });",

		/*
		 * test reflect.defineProperty(s)
		 * option: {allowImplicit: false}
		 */
		'Reflect.defineProperty(foo, "bar", { get: function () {return true;}});',
		'Reflect.defineProperty(foo, "bar", { get: function () { ~function (){ return true; }();return true;}});',

		/*
		 * test object.create(s)
		 * option: {allowImplicit: false}
		 */
		"Object.create(foo, { bar: { get() {return true;} } });",
		"Object.create(foo, { bar: { get: function () {return true;} } });",
		"Object.create(foo, { bar: { get: () => {return true;} } });",

		// option: {allowImplicit: true}
		{
			code: 'Object.defineProperty(foo, "bar", { get: function () {return true;}});',
			options: [{ allowImplicit: true }],
		},
		{
			code: 'Object.defineProperty(foo, "bar", { get: function (){return;}});',
			options: [{ allowImplicit: true }],
		},
		{
			code: "Object.defineProperties(foo, { bar: { get: function () {return true;}} });",
			options: [{ allowImplicit: true }],
		},
		{
			code: "Object.defineProperties(foo, { bar: { get: function () {return;}} });",
			options: [{ allowImplicit: true }],
		},
		{
			code: 'Reflect.defineProperty(foo, "bar", { get: function () {return true;}});',
			options: [{ allowImplicit: true }],
		},

		// not getter.
		"var get = function(){};",
		"var get = function(){ return true; };",
		"var foo = { bar(){} };",
		"var foo = { bar(){ return true; } };",
		"var foo = { bar: function(){} };",
		"var foo = { bar: function(){return;} };",
		"var foo = { bar: function(){return true;} };",
		"var foo = { get: function () {} }",
		"var foo = { get: () => {}};",
		"class C { get; foo() {} }",
		"foo.defineProperty(null, { get() {} });",
		"foo.defineProperties(null, { bar: { get() {} } });",
		"foo.create(null, { bar: { get() {} } });",
	],

	invalid: [
		/*
		 * test obj: get
		 * option: {allowImplicit: false}
		 */
		{
			code: "var foo = { get bar() {} };",
		},
		{
			code: "var foo = { get\n bar () {} };",
		},
		{
			code: "var foo = { get bar(){if(baz) {return true;}} };",
		},
		{
			code: "var foo = { get bar() { ~function () {return true;}} };",
		},
		{
			code: "var foo = { get bar() { return; } };",
		},

		// option: {allowImplicit: true}
		{
			code: "var foo = { get bar() {} };",
			options: [{ allowImplicit: true }],
		},
		{
			code: "var foo = { get bar() {if (baz) {return;}} };",
			options: [{ allowImplicit: true }],
		},

		/*
		 * test class: get
		 * option: {allowImplicit: false}
		 */
		{
			code: "class foo { get bar(){} }",
		},
		{
			code: "var foo = class {\n  static get\nbar(){} }",
		},
		{
			code: "class foo { get bar(){ if (baz) { return true; }}}",
		},
		{
			code: "class foo { get bar(){ ~function () { return true; }()}}",
		},

		// option: {allowImplicit: true}
		{ code: "class foo { get bar(){} }", options: [{ allowImplicit: true }],},
		{
			code: "class foo { get bar(){if (baz) {return true;} } }",
			options: [{ allowImplicit: true }],
		},

		/*
		 * test object.defineProperty(s)
		 * option: {allowImplicit: false}
		 */
		{
			code: "Object.defineProperty(foo, 'bar', { get: function (){}});",
		},
		{
			code: "Object.defineProperty(foo, 'bar', { get: function getfoo (){}});",
		},
		{
			code: "Object.defineProperty(foo, 'bar', { get(){} });",
		},
		{
			code: "Object.defineProperty(foo, 'bar', { get: () => {}});",
		},
		{
			code: 'Object.defineProperty(foo, "bar", { get: function (){if(bar) {return true;}}});',
		},
		{
			code: 'Object.defineProperty(foo, "bar", { get: function (){ ~function () { return true; }()}});',
		},

		/*
		 * test reflect.defineProperty(s)
		 * option: {allowImplicit: false}
		 */
		{
			code: "Reflect.defineProperty(foo, 'bar', { get: function (){}});",
		},

		/*
		 * test object.create(s)
		 * option: {allowImplicit: false}
		 */
		{
			code: "Object.create(foo, { bar: { get: function() {} } })",
		},
		{
			code: "Object.create(foo, { bar: { get() {} } })",
		},
		{
			code: "Object.create(foo, { bar: { get: () => {} } })",
		},

		// option: {allowImplicit: true}
		{
			code: "Object.defineProperties(foo, { bar: { get: function () {}} });",
			options: [{ allowImplicit: true }],
		},
		{
			code: "Object.defineProperties(foo, { bar: { get: function (){if(bar) {return true;}}}});",
			options: [{ allowImplicit: true }],
		},
		{
			code: "Object.defineProperties(foo, { bar: { get: function () {~function () { return true; }()}} });",
			options: [{ allowImplicit: true }],
		},
		{
			code: 'Object.defineProperty(foo, "bar", { get: function (){}});',
			options: [{ allowImplicit: true }],
		},
		{
			code: "Object.create(foo, { bar: { get: function (){} } });",
			options: [{ allowImplicit: true }],
		},
		{
			code: 'Reflect.defineProperty(foo, "bar", { get: function (){}});',
			options: [{ allowImplicit: true }],
		},

		// Optional chaining
		{
			code: "Object?.defineProperty(foo, 'bar', { get: function (){} });",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(Object?.defineProperty)(foo, 'bar', { get: function (){} });",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "Object?.defineProperty(foo, 'bar', { get: function (){} });",
			options: [{ allowImplicit: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(Object?.defineProperty)(foo, 'bar', { get: function (){} });",
			options: [{ allowImplicit: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "(Object?.create)(foo, { bar: { get: function (){} } });",
			options: [{ allowImplicit: true }],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
};
