# Clean Code

## Use Object Oriented Programming (OOP)

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

