I want to create a linter for JavaScript source code, very similar to ESLint. I need you to write an implementation plan for building this linter.

Start by rethinking linter design from first principles, keeping these objectives and requirements in mind:

- Be as small as possible. No extra features. We **do not** want to re-implement or clone ESLint. We want something which is smaller, lighter, faster, and more targeted to our specific use cases.
- Target JavaScript only. TypeScript linting is not supported.
- Only implement the lint rules listed in reference-lint.config.js
- Only support ECMAScript 262 version 2024 and newer.
- Implement source text linting through a single entrypoint function or method. **Do not** support CLI commands or tools, configuration reading or parsing, or file system access (finding, writing, or reading files).
- Emit errors and warnings only. *Do not* attempt to fix broken code in files.

We are rethinking linter design from first principles, but we can take some influence and lessons from prior work.

Investigate how the ESLint linter works. Start by looking at the public function lintFile() in @reference-libraries/eslint/lib/eslint/eslint-helpers.js

There shoud be some important differences between the ESLint implementation of this entry point and your design:

- Your design should *not* attempt to look up configurations for a file. It should assume the configurations for the file will be passed in.
- Result caching is not needed, since our implementation does not read or write files.
- Support source text verification but *do not* support fixing problems in the source text.
- Verify the file text, but *do not* read the file. The file name and source text should be passed in.
- Retry support is not needed, since our implementation does not read or write files.
- Error propagation is not needed, since our implementation will not be async.

Start your implementation plan from the lintFile() entry point, with exceptions noted above.

Notice that source text verification is delegated to the espree parser, which wraps the acorn JavaScript parser. Is there a way to collapse this dependency chain in your implementation?

Also, should we consider simply re-using the acorn JavaScript parser as a vendored dependency? You can find the source code for the acorn parser at ~/Projects/eslint/acorn/acorn/

<system>
After reviewing the user prompt above, create an implementation plan document.

If the user prompt does not have enough detail for you, you'll need to ask some questions to get more information from the user to fill in the gaps. Provide the user options and alternative ideas with tradeoffs.

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
