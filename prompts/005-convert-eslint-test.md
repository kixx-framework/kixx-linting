We are in the process of porting old eslint tests into our new linter.

To see how we write tests, review the @skills/writing-tests/SKILL.md document.

Review some of the existing lint rule tests in `test/lib/rules/*.test.js` (Note: Only `*.test.js` files are tests, the other files in test/lib/rules/ should be ignored.)

Your task is to write tests in these test modules:

- no-else-return.test.js
- no-empty-character-class.test.js
- no-empty.test.js
- no-eq-null.test.js

If there are any languageOption attributes defined in the test data, comment them out so they are documented, but ignored.

Run your tests using:

```bash
node run-tests.js <path-to-test-file>
```

If you encounter failed tests, do not change to the tests to make them pass. Instead, evaluate the rule implementation for bugs and attempt to fix them.

If you are unable to fix failed tests before consuming 125,000 tokens of your context window, then stop and inform the user you are out of space to continue debugging.