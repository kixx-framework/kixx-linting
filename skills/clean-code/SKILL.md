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
