export default {
	valid: [
		"try { } catch (e) { three = 2 + 1; }",
		{
			code: "try { } catch ({e}) { this.something = 2; }",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo() { try { } catch (e) { return false; } }",
	],
	invalid: [
		{
			code: "try { } catch (e) { e = 10; }",
		},
		{
			code: "try { } catch (ex) { ex = 10; }",
		},
		{
			code: "try { } catch (ex) { [ex] = []; }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "try { } catch (ex) { ({x: ex = 0} = {}); }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "try { } catch ({message}) { message = 10; }",
			languageOptions: { ecmaVersion: 6 },
		},
	],
};
