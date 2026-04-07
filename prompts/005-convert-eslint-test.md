We are in the process of porting old eslint tests into our new linter.

To see how we write tests, review the @skills/writing-tests/SKILL.md document.

Use the @test/lib/rules/eol-last.test.js test module as an example of how to write tests for rules.

Your task is to write tests in the @test/lib/rules/new-parens.test.js test module to match the format and patterns in eol-last.test.js.

If there are any languageOption attributes defined in the test data, comment them out so they are documented, but ignored.

Run your tests using:

```bash
node run-tests.js <path-to-test-file>
```

If you encounter failed tests, do not change to the tests to make them pass. Instead, evaluate the rule implementation for bugs and attempt to fix those first.

If you are unable to fix failed tests before consuming 125,000 tokens of your context window, then stop and inform the user you are out of space to continue debugging.