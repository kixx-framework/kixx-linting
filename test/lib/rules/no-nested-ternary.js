export default {
	valid: ["foo ? doBar() : doBaz();", "var foo = bar === baz ? qux : quxx;"],
	invalid: [
		{
			code: "foo ? bar : baz === qux ? quxx : foobar;",
		},
		{
			code: "foo ? baz === qux ? quxx : foobar : bar;",
		},
	],
};
