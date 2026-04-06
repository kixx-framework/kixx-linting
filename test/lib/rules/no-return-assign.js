export default {
	valid: [
		{
			code: "module.exports = {'a': 1};",
			languageOptions: {
				sourceType: "module",
			},
		},
		"var result = a * b;",
		"function x() { var result = a * b; return result; }",
		"function x() { return (result = a * b); }",
		{
			code: "function x() { var result = a * b; return result; }",
			options: ["except-parens"],
		},
		{
			code: "function x() { return (result = a * b); }",
			options: ["except-parens"],
		},
		{
			code: "function x() { var result = a * b; return result; }",
			options: ["always"],
		},
		{
			code: "function x() { return function y() { result = a * b }; }",
			options: ["always"],
		},
		{
			code: "() => { return (result = a * b); }",
			options: ["except-parens"],
		},
		{
			code: "() => (result = a * b)",
			options: ["except-parens"],
		},
		"const foo = (a,b,c) => ((a = b), c)",
		`function foo(){
            return (a = b)
        }`,
		`function bar(){
            return function foo(){
                return (a = b) && c
            }
        }`,
		{
			code: "const foo = (a) => (b) => (a = b)",
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "function x() { return result = a * b; };",
		},
		{
			code: "function x() { return (result) = (a * b); };",
		},
		{
			code: "function x() { return result = a * b; };",
			options: ["except-parens"],
		},
		{
			code: "function x() { return (result) = (a * b); };",
			options: ["except-parens"],
		},
		{
			code: "() => { return result = a * b; }",
		},
		{
			code: "() => result = a * b",
		},
		{
			code: "function x() { return result = a * b; };",
			options: ["always"],
		},
		{
			code: "function x() { return (result = a * b); };",
			options: ["always"],
		},
		{
			code: "function x() { return result || (result = a * b); };",
			options: ["always"],
		},
		{
			code: `function foo(){
                return a = b
            }`,
		},
		{
			code: `function doSomething() {
                return foo = bar && foo > 0;
            }`,
		},
		{
			code: `function doSomething() {
                return foo = function(){
                    return (bar = bar1)
                }
            }`,
		},
		{
			code: `function doSomething() {
                return foo = () => a
            }`,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `function doSomething() {
                return () => a = () => b
            }`,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `function foo(a){
                return function bar(b){
                    return a = b
                }
            }`,
		},
		{
			code: "const foo = (a) => (b) => a = b",
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
