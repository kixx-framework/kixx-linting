# Refactoring

Guidelines for refactoring existing code. These are specifically about changing code that already works, where a reader already holds the current shape in their head, and where the wrong move is as expensive as the right one.

For general principles about writing clean code, see `skills/clean-code/SKILL.md`. This document is the counterweight: how to decide *whether* to apply those principles to code that already exists.

## Start from a smell, not a principle

A refactor needs a concrete pain. Before proposing a change, be able to name at least one of:

- A bug that was caused by the current shape (e.g., leaked internals that let one module depend on another's private state).
- A change request that was hard to make because related logic was scattered.
- A file or function that a reader repeatedly gets lost in.
- A duplication that has already drifted out of sync at least once.
- A name that has already misled a reader.

"This could be an object" is not a smell. "This class has too many methods" is not a smell. "Rules read a private field prefixed with an underscore" *is* a smell, because it points to a concrete coupling.

If you cannot describe the current pain in one sentence using words from the actual codebase, stop. You are designing, not refactoring.

## Existing code is not a blank slate

The code you are refactoring is already loaded into the heads of the people who read it. That shape — even when imperfect — is a form of working memory you are asking readers to discard and rebuild.

Judge a refactor on whether it simplifies the *current* code, not on whether it would have been nicer from scratch. "Nicer from scratch" is almost always true and almost never sufficient.

Before recommending a change, ask: if a reader who knows the current code opens the new version, will they see it as an obvious improvement, or will they have to re-learn where things live? If it's the second, the refactor has to pay for that cost with a clear win.

## Abstractions have a cost

Every new class, file, module, or name costs reader attention. A system with twelve well-named objects is not automatically clearer than a system with four — the reader still has to learn the names, remember which object owns which responsibility, and trace indirections to find concrete behavior.

The question is never "does this abstraction have a benefit?" (most do). The question is "does the benefit exceed the cost of the extra name, the extra file, and the extra indirection?"

Signs the cost exceeds the benefit:

- The new object's only state is dependencies passed through its constructor.
- The new object has one public method and it's called from exactly one place.
- The "class" is a function with a `this` prefix.
- Explaining the new structure to a teammate takes longer than explaining the old one.
- The refactor's justification is "easier to test" but the old code was already testable with pure inputs.

## Delete before you extract

Before adding structure, look for code that shouldn't exist:

- Dead helpers with no callers.
- Duplicated logic that can be collapsed into one copy without introducing an abstraction.
- Speculative hooks ("in case we need X later") that were never wired up.
- Comments describing code that has since moved or changed.
- Backwards-compatibility shims for callers that no longer exist.
- Config options no one sets.

Rearranging code you should have deleted is wasted motion — and worse, it entrenches the dead code by making it part of the new structure. A refactor plan that doesn't start with a deletion pass is usually incomplete.

## No speculative generality

Don't design for:

- Future features that aren't on the roadmap.
- Hypothetical parser/database/transport swaps.
- "Easier to add X later" where X is not actually being added.
- "Testability" when the current code is already testable.
- Plugin points with no plugins.

Speculative generality is the most common way a refactor makes code worse. It adds indirection now for a payoff that may never come, and when the real future requirement arrives it rarely matches the shape you guessed.

If the future case is real and imminent, refactor when it arrives — you'll have better information then. If it isn't, don't pay for it now.

## Thin wrappers over the thing you just replaced are usually wrong

A common refactor pattern: introduce a new class, then keep the old function as a "compatibility wrapper" that calls into the class. This is almost always a mistake for *internal* code.

- If the new thing is better, migrate the callers. You control them.
- If it isn't better, don't add it.
- Wrappers are only right at real public/stable boundaries where you cannot migrate callers (published APIs, cross-repo contracts, plugin interfaces).

A wrapper over a function you control means you now have two things where there was one, and every reader has to learn both. The wrapper is a tell that the refactor was not confident enough to commit.

## Name-then-extract

Many urges to "extract a class" are actually urges to "give this thing a name."

Before extracting, try:

1. Renaming the variable or function so its purpose is obvious.
2. Extracting a single small helper function next to the current code.
3. Adding a one-line comment explaining the non-obvious *why* (not the what).

A rename costs nothing and often dissolves the smell entirely. A local helper is cheaper than a new class and can be promoted later if a second caller appears. Reach for the heavier move only after the lighter ones have failed.

## Two callers is not a pattern

Don't build an abstraction for two callers. Don't build one for three if the three are all in the same file. The rule of three ("wait until you have three copies") is a floor, not a ceiling — and even three is often too early if the copies are genuinely simple.

Premature abstraction locks in a shape before you know what variation actually matters. Three similar lines is better than a wrong abstraction; a wrong abstraction is harder to remove than three similar lines.

## Leave small working modules alone

A module with these properties is not a refactor target:

- Under ~150 lines.
- One clear job named by the filename.
- No known bugs.
- No reader has complained about it.
- No recent change was hard to make in it.

Even if you can see how it could be "three smaller classes," restructuring it is a regression in reader complexity. Spend the refactor budget on modules that are actually causing pain.

## Size alone is not a smell

A 500-line rule module or a 400-line facade is not automatically bad. Ask instead:

- Is there hidden state that has no name?
- Are related pieces of logic separated by unrelated pieces?
- Would a reader have to scroll between distant sections to understand one behavior?
- Does changing one concern force a change in another concern in the same file?

If none of those are true, the file is just long. Long is fine.

Conversely: a 50-line module can be a mess if it hides a state machine inside a cleverly named function. Read the code before judging it by its line count.

## Measure a refactor by behavior, not shape

"This is now a class" is not a success criterion. "This now has seven files instead of three" is not a success criterion. Success criteria should be observable:

- A specific coupling is removed (e.g., "no rule reads a SourceCode private field").
- A specific duplication is eliminated (e.g., "deep-merge logic exists in exactly one place").
- A specific file got shorter *and* easier to follow (not just shorter).
- A specific change that was previously hard is now easy, and you can name the change.
- A specific bug class is now impossible to reintroduce.

If the only way to describe the win is "the code is more object-oriented now," the refactor didn't improve anything measurable.

## Refactor in the direction of the next real change

The best refactors are the ones that make the change you are *about* to make easier. If you know the next feature, shape the refactor around it — you'll get immediate validation that the new structure is useful.

If you don't know the next change, refactor conservatively: fix the concrete smells you can name, and stop. Don't pre-shape the code for imagined work.

## Plan the smallest refactor that removes the smell

For each identified smell, find the smallest change that eliminates it. The smallest change is almost never "introduce a new layer of objects." It is usually one of:

- Move a function from module A to module B.
- Rename a private field to a public method.
- Delete an unused parameter.
- Inline a helper that's only called once and replace it with a better-named local variable.
- Extract one helper function (not a class).
- Replace a sequence of related procedural steps with a single named step.

Do the smallest change. Stop. Re-evaluate whether the next step still seems valuable. Often it won't, because the small change already removed most of the pain.

## Before proposing a plan, read the code

Refactoring advice written without reading the target code is almost always wrong. Before recommending that a file be split, extracted, or restructured:

- Open the file.
- Read it end to end.
- Quote specific lines that demonstrate the smell.
- Name specific functions, fields, or call sites that will move.

A recommendation that names candidate classes (`IndentationModel`, `StateTracker`, `ConfigArray`) without citing lines from the source is speculation, not analysis. "This file is probably too big" is not a finding; `rules/foo.js:220-310 contains an anonymous state machine with three fields and no name` is a finding.

## What to produce

A good refactor plan has these parts, in this order:

1. **The smells.** One sentence each, with file and line references. If you can't find any, stop — there's nothing to refactor.
2. **The deletions.** Dead code, dead options, dead helpers. Do these first; they change everything downstream.
3. **The smallest fix per smell.** Not a redesign — the minimal change that removes the concrete pain. Each fix should name specific files/functions that move.
4. **What you are explicitly *not* doing and why.** This is where you record the urges you resisted: "I am not extracting X because it has one caller," "I am not introducing layer Y because the current import graph already reflects it."
5. **Observable success criteria.** Behavioral, not structural. How will a reader a month from now know this refactor worked?
6. **Stop conditions.** When to re-evaluate whether further work is worth doing. Most refactors should stop earlier than planned.

If the plan is longer than the code it's refactoring, something is wrong.
