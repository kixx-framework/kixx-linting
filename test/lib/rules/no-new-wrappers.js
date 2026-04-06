export default {
	valid: [
		"var a = new Object();",
		"var a = String('test'), b = String.fromCharCode(32);",
		`
        function test(Number) {
            return new Number;
        }
        `,
		{
			code: `
            import String from "./string";
            const str = new String(42);
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		`
        if (foo) {
            result = new Boolean(bar);
        } else {
            var Boolean = CustomBoolean;
        }
        `,
		{
			code: "new String()",
			languageOptions: {
				globals: {
					String: "off",
				},
			},
		},
		`
        /* global Boolean:off */
        assert(new Boolean);
        `,
	],
	invalid: [
		{
			code: "var a = new String('hello');",
		},
		{
			code: "var a = new Number(10);",
		},
		{
			code: "var a = new Boolean(false);",
		},
		{
			code: `
            const a = new String('bar');
            {
                const String = CustomString;
                const b = new String('foo');
            }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
