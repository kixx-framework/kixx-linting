We have made a lot of changes and fixed a lot of bugs in this code base. Now it is time to review the code and clean it up and so that it is less complex and easier to modify in the future.

Here are some guidelines for refactoring existing code into clean code:

<guidelines>

# Writing and Maintaining Clean Code

Your first objective when writing code and making changes to this codebase is removing complexity so it is easier to modify the codebase in the future. You always want to leave code cleaner than you found it after making changes.

**Lean into Object Oriented Programming (OOP).**

Design the system and write your code as a collection of interacting objects rather than a mere list of instructions or functions. When coding, shift your focus from how a task is done to what entity is responsible for doing it.

You can think of an object in the code as a machine capable of performing specific tasks. You assign tasks for the object to perform, it is responsible for those tasks, and has access to all the knowledge and resources required to perform those tasks.

**Think of everything as an object.**

Start by assuming that every aspect of the problem domain can be modeled as an object.

- Think of data as objects. Whatever manipulations and transformations are required of an object, are realized by that object itself instead of some other kind of thing acting upon that object.
- Think of relationships between data and concepts as objects with their own responsibilities and capabilities.
- Think of procedures as objects. Procedures are the vital force which compose other objects together and allows them to interact.
- An object can be a component made up of several JavaScript modules.
- An object can be a single JavaScript module.
- An object can be a class, or instances of a class.
- An object can even be a method on a class, or a conditional logic within that method.

**Use information hiding (encapsulation).**

If your code could be perfect, each object would be independent of the others: You could work in any of the objects without knowing anything about any of the other objects. In this world, the complexity of a system would be the complexity of its worst object.

Encapsulating complexity in an object is also known as "information hiding". The information hidden within a module usually consists of details about how to implement some mechanism which other parts of the system don't need to know about.

Encapsulate your code in two ways:

1. Your interfaces - classes, method signatures, function signatures - should reflect a simpler, more abstract view of the object's functionality and hide the details.
2. There are no dependencies on that internal information from outside the object.

Your objects should hide their data and information behind abstractions and expose simple method signatures which operate on that data.

**Separate specialized code from general purpose code.**

One way to separate specialized code is to push it downwards. An example of this is device drivers: An operating system typically must support many different device types of devices. Each of these device types has its own specialized command set. In order to prevent specialized device characteristics from leaking into the main operating system code, operating systems define an interface with general-purpose operations that any secondary storage device must implement. You should follow this pattern in your code as well.

Another way to separate specialized code is to pull it upwards. The top-level classes of an application, which provide specific features, will necessarily be specialized for those features. That specialization should be contained in those classes. You can usually find these kinds of specific features by thinking of the user stories. If the code seems to be directly associated to a specific thing the user would want to do, like sending an invoice, then it can probably be pulled upward into a separate class or routine.

**Smaller modules, classes, and methods are NOT always better.**

Creating small classes and small methods is NOT your goal when writing or refactoring code; making the code simpler is your goal. There are times when you should bring code together instead of decomposing it.

Bringing pieces of code together when they are closely related:

- They share information; for example, both pieces of code might depend on information about a common protocol.
- They are used together: anyone using one of the pieces of code is likely to use the other as well.
- They overlap conceptually, in that there is a simple higher-level category that includes both of the pieces of code.
- It is hard to understand one of the pieces of code without looking at the other.

**Separate your code under certain circumstances:**

- Separate your code when information is not shared.
- Separate your code when it does not address the same concern.
- Separate your code so that specialized code is separate from general purpose code.

**Methods and functions should do one thing.**

The methods and functions you write should do one thing and only that thing. A good method or function should do something or answer something, but not both. A method should change the state of an object, or it should return some information about that object.

In order to make sure our functions are doing one thing, you need to make sure that the statements within your method are all at the same level of abstraction. You want every method to be followed by those at the next level of abstraction so that we can read the program, descending one level of abstraction at a time as we read down the list of methods.

**Minimize the number of arguments for methods and functions.**

The ideal number of arguments for a method is zero. Next comes one, followed closely by two. Three arguments should be avoided where possible. More than three arguments should not be used. When a method seems to need more than two or three arguments, it is likely that some of those arguments ought to be wrapped into a class or object of their own.

**Choose good names.**

Names for constants, classes, methods, and variables are important to reducing accidental complexity. A good name conveys a lot of information about what the underlying entity is, and, just as important, what it is not. When considering a particular name, ask yourself: "When I see this name in the future, how closely will I be able to guess what the name refers to and what it does?".

Name your constants, classes, methods, and variables so that when you read them in the future, there should be no surprises in what they are and what they do. A good name should be a dead giveaway.

## Refactoring
Guidelines for refactoring existing code. These are specifically about changing code which already works and has regression tests.

**Refactor in the direction of the next real change.**

The best refactors are the ones that make the change you are *about* to make easier. If you know the next feature, shape the refactor around it — you'll get immediate validation that the new structure is useful.

There are times when you need to clean existing code and may not have the context to know about the next change, and that's ok too.

**Look for code smells to signal refactoring opportunities.**

- Leaked module, class, method, or function internals where another object depends on internal private state.
- Code that is likely going to change when adding new features; ensure that it can be extended.
- Code which is complex and hard to understand.
- Duplicated logic.
- Misleading names.

**Read the code before planning or coding.**

- Open source files and read them end to end.
- Find specific lines or sections of code which have code smells.

**Refactor for future agents.**

Coding agents which work on this codebase in the future will have no background or context other than that which they get from reading the code. So, there is no need worry about breaking developers' working memory of this codebase.

**Do not overengineer abstractions or generality.**

A system with twelve well-named objects is not automatically clearer than a system with four — the reader still has to learn the names, remember which object owns which responsibility, and trace indirections to find concrete behavior.

The question is "does the benefit exceed the cost of the extra name, the extra file, and the extra indirection?"

Don't design for:

- Future features that aren't on the roadmap.
- Hypothetical parser/database/transport swaps.
- "Easier to add X later" where X is not actually being added.
- "Testability" when the current code is already testable.
- Plugin points with no plugins.

Speculative generality adds indirection now for a payoff that may never come, and when the real future requirement arrives it rarely matches the shape you guessed. If the future case is real and imminent, refactor when it arrives — you'll have better information then. If it isn't, don't pay for it now.

**Delete before you extract.**

Before adding structure, look for code that shouldn't exist:

- Dead helpers with no callers.
- Duplicated logic that can be collapsed into one copy without introducing an abstraction.
- Speculative hooks ("in case we need X later") that were never wired up.
- Comments describing code that has since moved or changed.
- Backwards-compatibility shims for callers that no longer exist.
- Config options no one sets.

Rearranging code you should have deleted is wasted motion — and worse, it entrenches the dead code by making it part of the new structure. A refactor plan that doesn't start with a deletion pass is usually incomplete.

**Avoid thin wrappers over exiting objects, methods, or functions.**

A wrapper over code you control means you now have two things where there was one, and future agents have to learn both.

- If the new wrapper interface is better, migrate the callers. You control them.
- If it isn't better, don't add it.
- Wrappers are only right at real public/stable boundaries where you cannot migrate callers (published APIs, cross-repo contracts, plugin interfaces).

**Name-then-extract.**

Many urges to "extract a class" are actually urges to "give this thing a name."

Before extracting, try:

1. Renaming the variable or function so its purpose is obvious.
2. Extracting a single small helper function next to the current code.
3. Adding a one-line comment explaining the non-obvious *why* (not the what).

**Lazily build new abstractions.**

Premature abstraction locks in a shape before you know what variations actually matter.

Don't assume you need to build an abstraction for two or three callers, especially if they are all in the same file. The rule of three ("wait until you have three copies") is a floor, not a ceiling.

**Large files, classes, methods, and functions are not always a code smell.**

A 500-line rule module or a 400-line facade is not automatically bad. Instead look for code smells:

- Does the code address too many concerns?
- Does changing one concern force a change in another concern in the same file?
- Is specialized logic mixed with general logic?
- Are related pieces of logic separated by unrelated pieces?
- Would a reader have to scroll between distant sections to understand one behavior?

Conversely: a 50-line module can be a mess if it hides a state machine inside a cleverly named function. Read the code before judging it by its line count.

**Measure a refactor by behavior, not shape.**

Success criteria should be observable:

- A specific coupling is removed (e.g., "An object no longer reads the private field of another").
- A specific duplication is eliminated.
- A specific file got shorter *and* easier to follow (not just shorter).
- A specific change that was previously hard is now easy, and you can name the change.
- A specific bug class is now impossible to reintroduce.

</guidelines>

Keep the scope of your refactoring confined to the lib/ directory.

Do not starting writing code yet, but think hard about the changes we need to make. Write a detailed document describing each of your recommendations and put them in the todos/ directory.
