We are in the process of porting old eslint tests into our new linter.

To see how we write tests, review the @skills/writing-tests/SKILL.md document.

Use the @test/lib/rules/comma-dangle.test.js test module as an example of how to write tests for rules.

Your task is to reformat the @test/lib/rules/func-call-spacing.test.js test module to match comma-dangle.test.js and write the tests for it.

For the func-call-spacing.test.js tests, you'll comment out the languageOptions so they are documented, but ignored.

Commenting out language options may result in errors, but do not change the tests to make it pass. Instead, evaluate the rule implementation for bugs.

Write the tests for func-call-spacing, and work on any bugs which are discovered, but DO NOT move on to writing tests for any other rules.
