export default {
	valid: [
		"new Promise((resolve, reject) => {})",
		"new Promise((resolve, reject) => {}, async function unrelated() {})",
		"new Foo(async (resolve, reject) => {})",
	],

	invalid: [
		{
			code: "new Promise(async function foo(resolve, reject) {})",
		},
		{
			code: "new Promise(async (resolve, reject) => {})",
		},
		{
			code: "new Promise(((((async () => {})))))",
		},
	],
};
