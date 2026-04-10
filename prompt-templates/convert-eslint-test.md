We are in the process of porting old eslint tests into our new linter.

To see how we write tests, review the skills/writing-tests/SKILL.md document.

Review some of the existing lint rule tests in `test/lib/rules/*.test.js` (Note: Only `*.test.js` files are tests, the other files in test/lib/rules/ should be ignored.)

Your task is to write tests in these target test modules:

- test/lib/rules/use-isnan.test.js

Note: These target test modules are just data arrays without an executable test suite. Your approach should be to mirror the existing test harness pattern you see in other test modules in `test/lib/rules/*.test.js`.

Run your tests using:

```bash
node run-tests.js <path-to-test-file>
```

If you encounter failed tests, DO NOT remove or change the test data to make tests pass. Instead, evaluate the rule implementation for bugs and attempt to fix them.

If the implementation of a rule seems to be in conflict with failed tests, then stop working and inform the user.

If it will require more than incremental changes to a rule implementation to make the tests pass, then write a detailed refactoring plan in the todos/ directory, and then stop your work on that rule, leaving the tests in a broken state.

When you're deciding how to approach a problem, choose an approach and commit to it. Avoid revisiting decisions unless you encounter new information that directly contradicts your reasoning. If you're weighing two approaches, pick one and see it through. You can always course-correct later if the chosen approach fails.

Your token budget is 125,000 tokens. If you are unable to fix the implementation before consuming 125,000 tokens of your context window, then stop and inform the user you are out of space and cannot continue working.
