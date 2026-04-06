export default {
	valid: [
		"class Foo {}",
		`class Foo {
    publicMember = 42;
}`,
		`class Foo {
    #usedMember = 42;
    method() {
        return this.#usedMember;
    }
}`,
		`class Foo {
    #usedMember = 42;
    anotherMember = this.#usedMember;
}`,
		`class Foo {
    #usedMember = 42;
    foo() {
        anotherMember = this.#usedMember;
    }
}`,
		`class C {
    #usedMember;

    foo() {
        bar(this.#usedMember += 1);
    }
}`,
		`class Foo {
    #usedMember = 42;
    method() {
        return someGlobalMethod(this.#usedMember);
    }
}`,
		`class C {
    #usedInOuterClass;

    foo() {
        return class {};
    }

    bar() {
        return this.#usedInOuterClass;
    }
}`,
		`class Foo {
    #usedInForInLoop;
    method() {
        for (const bar in this.#usedInForInLoop) {

        }
    }
}`,
		`class Foo {
    #usedInForOfLoop;
    method() {
        for (const bar of this.#usedInForOfLoop) {

        }
    }
}`,
		`class Foo {
    #usedInAssignmentPattern;
    method() {
        [bar = 1] = this.#usedInAssignmentPattern;
    }
}`,
		`class Foo {
    #usedInArrayPattern;
    method() {
        [bar] = this.#usedInArrayPattern;
    }
}`,
		`class Foo {
    #usedInAssignmentPattern;
    method() {
        [bar] = this.#usedInAssignmentPattern;
    }
}`,
		`class C {
    #usedInObjectAssignment;

    method() {
        ({ [this.#usedInObjectAssignment]: a } = foo);
    }
}`,
		`class C {
    set #accessorWithSetterFirst(value) {
        doSomething(value);
    }
    get #accessorWithSetterFirst() {
        return something();
    }
    method() {
        this.#accessorWithSetterFirst += 1;
    }
}`,
		`class Foo {
    set #accessorUsedInMemberAccess(value) {}

    method(a) {
        [this.#accessorUsedInMemberAccess] = a;
    }
}`,
		`class C {
    get #accessorWithGetterFirst() {
        return something();
    }
    set #accessorWithGetterFirst(value) {
        doSomething(value);
    }
    method() {
        this.#accessorWithGetterFirst += 1;
    }
}`,
		`class C {
    #usedInInnerClass;

    method(a) {
        return class {
            foo = a.#usedInInnerClass;
        }
    }
}`,

		//--------------------------------------------------------------------------
		// Method definitions
		//--------------------------------------------------------------------------
		`class Foo {
    #usedMethod() {
        return 42;
    }
    anotherMethod() {
        return this.#usedMethod();
    }
}`,
		`class C {
    set #x(value) {
        doSomething(value);
    }

    foo() {
        this.#x = 1;
    }
}`,
	],
	invalid: [
		{
			code: `class Foo {
    #unusedMember = 5;
}`,
		},
		{
			code: `class First {}
class Second {
    #unusedMemberInSecondClass = 5;
}`,
		},
		{
			code: `class First {
    #unusedMemberInFirstClass = 5;
}
class Second {}`,
		},
		{
			code: `class First {
    #firstUnusedMemberInSameClass = 5;
    #secondUnusedMemberInSameClass = 5;
}`,
		},
		{
			code: `class Foo {
    #usedOnlyInWrite = 5;
    method() {
        this.#usedOnlyInWrite = 42;
    }
}`,
		},
		{
			code: `class Foo {
    #usedOnlyInWriteStatement = 5;
    method() {
        this.#usedOnlyInWriteStatement += 42;
    }
}`,
		},
		{
			code: `class C {
    #usedOnlyInIncrement;

    foo() {
        this.#usedOnlyInIncrement++;
    }
}`,
		},
		{
			code: `class C {
    #unusedInOuterClass;

    foo() {
        return class {
            #unusedInOuterClass;

            bar() {
                return this.#unusedInOuterClass;
            }
        };
    }
}`,
		},
		{
			code: `class C {
    #unusedOnlyInSecondNestedClass;

    foo() {
        return class {
            #unusedOnlyInSecondNestedClass;

            bar() {
                return this.#unusedOnlyInSecondNestedClass;
            }
        };
    }

    baz() {
        return this.#unusedOnlyInSecondNestedClass;
    }

    bar() {
        return class {
            #unusedOnlyInSecondNestedClass;
        }
    }
}`,
		},

		//--------------------------------------------------------------------------
		// Unused method definitions
		//--------------------------------------------------------------------------
		{
			code: `class Foo {
    #unusedMethod() {}
}`,
		},
		{
			code: `class Foo {
    #unusedMethod() {}
    #usedMethod() {
        return 42;
    }
    publicMethod() {
        return this.#usedMethod();
    }
}`,
		},
		{
			code: `class Foo {
    set #unusedSetter(value) {}
}`,
		},
		{
			code: `class Foo {
    #unusedForInLoop;
    method() {
        for (this.#unusedForInLoop in bar) {

        }
    }
}`,
		},
		{
			code: `class Foo {
    #unusedForOfLoop;
    method() {
        for (this.#unusedForOfLoop of bar) {

        }
    }
}`,
		},
		{
			code: `class Foo {
    #unusedInDestructuring;
    method() {
        ({ x: this.#unusedInDestructuring } = bar);
    }
}`,
		},
		{
			code: `class Foo {
    #unusedInRestPattern;
    method() {
        [...this.#unusedInRestPattern] = bar;
    }
}`,
		},
		{
			code: `class Foo {
    #unusedInAssignmentPattern;
    method() {
        [this.#unusedInAssignmentPattern = 1] = bar;
    }
}`,
		},
		{
			code: `class Foo {
    #unusedInAssignmentPattern;
    method() {
        [this.#unusedInAssignmentPattern] = bar;
    }
}`,
		},
		{
			code: `class C {
    #usedOnlyInTheSecondInnerClass;

    method(a) {
        return class {
            #usedOnlyInTheSecondInnerClass;

            method2(b) {
                foo = b.#usedOnlyInTheSecondInnerClass;
            }

            method3(b) {
                foo = b.#usedOnlyInTheSecondInnerClass;
            }
        }
    }
}`,
		},
	],
};
