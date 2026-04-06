export default {
	valid: [
		"`Hello, ${name}`;",
		"templateFunction`Hello, ${name}`;",
		"`Hello, name`;",
		"'Hello, name';",
		"'Hello, ' + name;",
		"`Hello, ${index + 1}`",
		'`Hello, ${name + " foo"}`',
		'`Hello, ${name || "foo"}`',
		'`Hello, ${{foo: "bar"}.foo}`',
		"'$2'",
		"'${'",
		"'$}'",
		"'{foo}'",
		"'{foo: \"bar\"}'",
		"const number = 3",
	],
	invalid: [
		{
			code: "'Hello, ${name}'",
		},
		{
			code: '"Hello, ${name}"',
		},
		{
			code: "'${greeting}, ${name}'",
		},
		{
			code: "'Hello, ${index + 1}'",
		},
		{
			code: "'Hello, ${name + \" foo\"}'",
		},
		{
			code: "'Hello, ${name || \"foo\"}'",
		},
		{
			code: "'Hello, ${{foo: \"bar\"}.foo}'",
		},
	],
};
