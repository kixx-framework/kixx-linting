export default {
	valid: [
		{
			code: "switch (a) { case 1: { let x = 1; break; } default: { let x = 2; break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: { const x = 1; break; } default: { const x = 2; break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: { function f() {} break; } default: { function f() {} break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: { class C {} break; } default: { class C {} break; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		`
            switch (a) {
                case 1:
                case 2: {}
            }
        `,
		`
            switch (a) {
                case 1: var x;
            }
        `,
	],
	invalid: [
		{
			code: `
                switch (a) {
                    case 1:
                        {}
                        function f() {}
                        break;
                }
            `,
		},
		{
			code: `
                switch (a) {
                    case 1:
                    case 2:
                        let x;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                switch (a) {
                    case 1:
                        let x;
                    case 2:
                        let y;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                switch (a) {
                    case 1:
                        let x;
                    default:
                        let y;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: let x = 1; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: let x = 2; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: const x = 1; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: const x = 2; break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: function f() {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: function f() {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { case 1: class C {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "switch (a) { default: class C {} break; }",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/pull/18388#issuecomment-2075356456
		{
			code: `
                switch ("foo") {
                    case "bar":
                        function baz() { }
                        break;
                    default:
                        baz();
                }
            `,
			languageOptions: { ecmaVersion: "latest" },
		},
	],
};
