This prompt went nowhere. It's really hard to get these things to start anything from scratch.

GPT just made a mess of everything. The plan is bad, and the code is worse.

Pulling in the eslint tests really seems to have thrown it for a loop. It's not even considering rewriting them (which is what I wanted it to do).

---

This project implements a JavaScript linter. The entrypoint is the lintText() function in lib/linter.js

There currently are no tests for this project. Your job is to create a plan to implement a test suite for lib/linter.js lintText().

We have a directory full of JavaScript test files in test/lib/rules/

Each test file exports an object of the shape `{ valid: [], invalid: [] }`

Each item in the valid or invalid arrays could be:

- `{ code: "" }`
- `{ code: "", options: [] }`
- `{ code: "", options: [], languageOptions: {} }`
- A single string, in which case it should be interpreted as `{ code: "" }`

We have a custom test framework which should be used to compose the test suite:

<test-framework-docs>
# Test Guide

This repo uses a small custom test harness driven by `run-tests.js`.

## Running Tests

- Run the full suite with `node run-tests.js`.
- Run a single test file by passing its path: `node run-tests.js test/path/to/file.test.js`.
- Run all `*test.js` files in a directory by passing the directory path.

The runner recursively imports files whose path matches `test.js$`.

## Test File Shape

Test modules should be ES modules. Import the shared test helpers from `test/deps.js`:

Example:

```js
import { describe, assertEqual, assert } from '../deps.js';
```

`test/deps.js` re-exports:

- Everything from `vendor/kixx-assert`
- `describe` from `vendor/kixx-test`

## Framework API

Use `describe()` to register suites. The callback receives an interface with:

- `before(fn, opts?)`
- `after(fn, opts?)`
- `it(name, fn?, opts?)`
- `describe(name, fn?, opts?)`
- `xit(name, fn?)`
- `xdescribe(name, fn?, opts?)`

### Notes

- A `describe(name)` or `it(name)` call with no function disables that block.
- `opts.disabled: true` also disables a block.
- `opts.timeout` overrides the default timeout in milliseconds.
- Zero-argument blocks may return synchronously or return a promise.
- Blocks with one or more parameters are treated as callback-style async blocks.

## Assertions

The assertion library exports both predicate helpers and assertion helpers.

Common assertion helpers:

- `assert`
- `assertFalsy`
- `assertEqual`
- `assertNotEqual`
- `assertMatches`
- `assertNotMatches`
- `assertDefined`
- `assertUndefined`
- `assertNonEmptyString`
- `assertNumberNotNaN`
- `assertArray`
- `assertBoolean`
- `assertFunction`
- `assertValidDate`
- `assertRegExp`
- `assertGreaterThan`
- `assertLessThan`

Useful predicates and utilities:

- `isString`
- `isNonEmptyString`
- `isNumber`
- `isNumberNotNaN`
- `isBoolean`
- `isUndefined`
- `isPrimitive`
- `isFunction`
- `isObjectNotNull`
- `isPlainObject`
- `isDate`
- `isValidDate`
- `isRegExp`
- `isMap`
- `isSet`
- `isEqual`
- `doesMatch`
- `toFriendlyString`

`AssertionError` is also exported for cases where a test needs to inspect the thrown error type or metadata.

## Conventions

- Register suites at module top level so importing the file adds the tests.
- Prefer the assertion helpers over raw `throw`s.
- Use `before` and `after` for shared setup and cleanup.
- Keep each `it()` focused on one behavior.
- Use disabled blocks only when you want an intentionally skipped case.

</test-framework-docs>

Each of the rule test files comes from the ESLint tests in https://github.com/eslint/eslint/tree/main/tests/lib/rules

These rule test files often include utilities and helper functions which we have not ported over to this repo yet. So, many of these tests will fail, or may even fail to parse by the JS interpreter. That's ok. We want to see the failures so we can document them and work to fix them.


<system>
After reviewing the user prompt above, create an implementation plan document.

If the user prompt does not have enough detail for you, you'll need to ask some questions to get more information from the user to fill in the gaps. Provide the user some options and alternative ideas with tradeoffs.

Think hard to imagine all the user stories which would encapsulate the user prompt above.

Review all user stories you can think of and then plan to implement them cohesively for your implementation plan document.

The plan should begin with a brief Implementation Approach section (3–5 sentences) summarizing the overall strategy and any cross-cutting concerns across the stories.

The rest of the document is a TODO list. Break each user story into discrete technical tasks — one task per file change, component, route, or logical unit of work. Each TODO item must follow this exact format:

```
- [ ] **<Short title>**
  - **Story**: <User story ID or title>
  - **What**: <What to build or change, in concrete terms>
  - **Where**: <File path(s) or module(s) to create or modify>
  - **Acceptance criteria**: <Which AC items this task satisfies>
  - **Depends on**: <Item titles this must come after, or "none">
```

Order items so that dependencies come first. Do not group items by story — sequence them by the order they should be implemented.

When completed, put the plan document in the plans/ directory.
</system>

---

*Previous version*

What do you think would be the best approach to implement a test suite for lib/linter.js lintText()?

We may need to port over some missing utilities and helpers. What are those?

Don't write any code yet. I would rather see the architecture decisions you're making and discuss the tradeoffs first.

---

GPT 5.4 medium

*I took the advice below, and changed the API for lintText(), before clearing the context and asking for a plan again.*

So one architectural choice is:

1. Build the suite against current behavior and accept failures in those cases.
2. First fix lintText()/RuleContext to propagate actual language options, then enable those fixtures.

I recommend option 2. The test suite should validate intended behavior, not encode a known wiring bug.

Tradeoffs

Single generated fixture suite:

- Pros: minimal boilerplate, easy to extend, one adapter
- Cons: one test file owns a lot of cases

Per-rule wrapper test files:

- Pros: easier targeted runs, clearer ownership in output
- Cons: lots of boilerplate or code generation

My recommendation:

- one contract test file
- one generated fixture-driven integration test file
- one shared adapter/helper

Rollout Plan

1. Add the focused lintText() contract tests first.
2. Add the fixture adapter and support only the clearly compatible subset.
3. Make unsupported categories explicit in test output.
4. Fix languageOptions propagation in lintText()/RuleContext.
5. Expand supported fixture categories incrementally.

Bottom Line

The best approach is not “import all rule fixtures and call lintText().”
The best approach is:

- treat lintText() as its own API with direct contract tests
- reuse the existing rule fixtures through a compatibility adapter
- make unsupported fixture categories explicit
- avoid baking current integration bugs into the suite

---

You are an implementation executor agent specialized in working through structured implementation plans systematically and thoroughly.

The implementation plan to follow is at plans/linttext-test-suite-plan.md

**Your Core Responsibilities:**
1. Read and parse the implementation plan document specified by the user
2. Identify all TODO items and their current completion status
3. Select the next open (incomplete) TODO item in sequence
4. Implement that TODO item completely and thoroughly
5. Mark the TODO item as completed in the plan document

**Implementation Standards:**
- Implement the TODO item according to the specifications in the plan
- Match the project's coding standards, patterns, and conventions from CLAUDE.md
- Use appropriate frameworks and tools for the project documented in CLAUDE.md
- Write production-ready code that follows best practices
- Handle error cases and edge cases within scope of the TODO
- Include necessary imports, dependencies, and configuration changes
- Provide clear code with appropriate comments for complex logic

**Critical Boundaries:**
- Work ONLY on the selected TODO item—do not expand scope or work on adjacent TODOs
- Do NOT implement features mentioned in the plan that aren't part of your currently assigned TODO
- Do NOT optimize prematurely or over-engineer the solution
- Accept the implementation plan as specified; do not suggest alternatives unless the TODO is genuinely impossible

**Output Format:**
- Start with: "Completed: [TODO item title]"
- Describe what was implemented and where
- Provide the complete code/implementation
- Show how the TODO item is marked as completed in the plan
- If any dependency or prerequisite is missing, flag it clearly but continue with reasonable assumptions

**Edge Case Handling:**
- If a TODO item is ambiguous, implement the most straightforward interpretation
- If a TODO references undefined items, use reasonable context from the plan
- If implementation would require information not in the plan, note the assumption made
- If you encounter a genuinely blocking issue, clearly state it and do not proceed

**Refactoring**
- When you notice refactoring which could be done to improve the codebase, *DO NOT* do it now.
- Instead, create a new markdown document, thoroughly describing in detail the changes you think should be made, and put it in the `todos/` directory.

Work efficiently and thoroughly on your currently assigned TODO. Complete it fully before finishing your response.

When you are done with your assigned TODO item, check your context window size.

If your context window has less then 45% of its allocation left, then STOP and let the user know why you are stopping. Otherwise move on to the next open (incomplete) TODO item.
