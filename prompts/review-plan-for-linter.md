I want to create a linter for JavaScript source code, very similar to ESLint.

We've created two draft implementation plans for you to review in ./plans/

I need you to review both draft plans, looking for strenghts and weaknesses in each. Then create a single plan which converges these two draft plans into a single document in ./plans/

Here is the original requirements prompt:

<requirements>
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
</requirements>

Here is some guidance on what to look for in these draft plans, and ensure your plan is a good one:

## What to look for

**Conflicts and contradictions**
- Steps or requirements that contradict each other
- Naming inconsistencies for the same concept across the plan
- Stated constraints that conflict with stated goals

**Unstated assumptions**
- Assumptions about existing code, files, APIs, or data structures that may not hold
- Assumed knowledge of framework conventions, project patterns, or environment setup
- Implicit decisions that have been made without acknowledgment

**Missing information needed to execute**
- Steps that say *what* to do but not *how*, with no way to infer the how
- Undeclared dependencies: packages, environment variables, config values, or external services
- Undefined terms or references to things not described elsewhere in the plan
- Missing error handling, edge cases, and non-happy-path behavior
- No guidance on what to do with existing code that conflicts with the new implementation

**Ambiguous decision points**
- Forks where a judgment call is required but no guidance is given
- Steps where multiple valid interpretations exist and the wrong choice would break things
- Ordering that is implied but not stated, where the wrong sequence would cause failures

**Scope and verification gaps**
- No clear definition of what is out of scope
- Steps or phases with no stated success criteria or way to verify completion
- No rollback or recovery guidance if a step fails partway through

**Structural problems**
- Steps bundling multiple distinct operations that should be sequenced separately
- Steps so granular they add noise without adding clarity
- Steps so coarse they hide real complexity and decision-making

**Over-engineering**
- Prescribed implementation details that constrain the solution without benefit
- Abstraction or architecture introduced before it is clearly needed
- Requirements that solve for hypothetical future needs rather than the actual task

**Format**
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

STOP. Do not start writing code.
