export default {
	valid: [
		"var foo = /foo/;",
		"var foo = RegExp('foo')",
		"var foo = / /;",
		"var foo = RegExp(' ')",
		"var foo = / a b c d /;",
		"var foo = /bar {3}baz/g;",
		"var foo = RegExp('bar {3}baz', 'g')",
		"var foo = new RegExp('bar {3}baz')",
		"var foo = /bar\t\t\tbaz/;",
		"var foo = RegExp('bar\t\t\tbaz');",
		"var foo = new RegExp('bar\t\t\tbaz');",
		"var RegExp = function() {}; var foo = new RegExp('bar   baz');",
		"var RegExp = function() {}; var foo = RegExp('bar   baz');",
		"var foo = /  +/;",
		"var foo = /  ?/;",
		"var foo = /  */;",
		"var foo = /  {2}/;",

		// don't report if there are no consecutive spaces in the source code
		"var foo = /bar \\ baz/;",
		"var foo = /bar\\ \\ baz/;",
		"var foo = /bar \\u0020 baz/;",
		"var foo = /bar\\u0020\\u0020baz/;",
		"var foo = new RegExp('bar \\ baz')",
		"var foo = new RegExp('bar\\ \\ baz')",
		"var foo = new RegExp('bar \\\\ baz')",
		"var foo = new RegExp('bar \\u0020 baz')",
		"var foo = new RegExp('bar\\u0020\\u0020baz')",
		"var foo = new RegExp('bar \\\\u0020 baz')",

		// don't report spaces in character classes
		"var foo = /[  ]/;",
		"var foo = /[   ]/;",
		"var foo = / [  ] /;",
		"var foo = / [  ] [  ] /;",
		"var foo = new RegExp('[  ]');",
		"var foo = new RegExp('[   ]');",
		"var foo = new RegExp(' [  ] ');",
		"var foo = RegExp(' [  ] [  ] ');",
		"var foo = new RegExp(' \\[   ');",
		"var foo = new RegExp(' \\[   \\] ');",

		// ES2024
		{ code: "var foo = /  {2}/v;", languageOptions: { ecmaVersion: 2024 } },
		{
			code: "var foo = /[\\q{    }]/v;",
			languageOptions: { ecmaVersion: 2024 },
		},

		// don't report invalid regex
		"var foo = new RegExp('[  ');",
		"var foo = new RegExp('{  ', 'u');",

		// don't report if flags cannot be determined
		"new RegExp('  ', flags)",
		"new RegExp('[[abc]  ]', flags + 'v')",
		"new RegExp('[[abc]\\\\q{  }]', flags + 'v')",
	],

	invalid: [
		{
			code: "var foo = /bar  baz/;",
		},
		{
			code: "var foo = /bar    baz/;",
		},
		{
			code: "var foo = / a b  c d /;",
		},
		{
			code: "var foo = RegExp(' a b c d  ');",
		},
		{
			code: "var foo = RegExp('bar    baz');",
		},
		{
			code: "var foo = new RegExp('bar    baz');",
		},
		{
			// `RegExp` is not shadowed in the scope where it's called
			code: "{ let RegExp = function() {}; } var foo = RegExp('bar    baz');",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = /bar   {3}baz/;",
		},
		{
			code: "var foo = /bar    ?baz/;",
		},
		{
			code: "var foo = new RegExp('bar   *baz')",
		},
		{
			code: "var foo = RegExp('bar   +baz')",
		},
		{
			code: "var foo = new RegExp('bar    ');",
		},
		{
			code: "var foo = /bar\\  baz/;",
		},
		{
			code: "var foo = /[   ]  /;",
		},
		{
			code: "var foo = /  [   ] /;",
		},
		{
			code: "var foo = new RegExp('[   ]  ');",
		},
		{
			code: "var foo = RegExp('  [ ]');",
		},
		{
			code: "var foo = /\\[  /;",
		},
		{
			code: "var foo = /\\[  \\]/;",
		},
		{
			code: "var foo = /(?:  )/;",
		},
		{
			code: "var foo = RegExp('^foo(?=   )');",
		},
		{
			code: "var foo = /\\  /",
		},
		{
			code: "var foo = / \\  /",
		},

		// report only the first occurrence of consecutive spaces
		{
			code: "var foo = /  foo   /;",
		},

		// don't fix strings with escape sequences
		{
			code: "var foo = new RegExp('\\\\d  ')",
		},
		{
			code: "var foo = RegExp('\\u0041   ')",
		},
		{
			code: "var foo = new RegExp('\\\\[  \\\\]');",
		},

		// ES2024
		{
			code: "var foo = /[[    ]    ]    /v;",
			languageOptions: {
				ecmaVersion: 2024,
			},
		},
		{
			code: "var foo = new RegExp('[[    ]    ]    ', 'v');",
		},
	],
};
