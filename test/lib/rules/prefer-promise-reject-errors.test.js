/*
 * Copyright OpenJS Foundation and other contributors, <www.openjsf.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const valid = [
    { text: "Promise.resolve(5)" },
    { text: "Foo.reject(5)" },
    { text: "Promise.reject(foo)" },
    { text: "Promise.reject(foo.bar)" },
    { text: "Promise.reject(foo.bar())" },
    { text: "Promise.reject(new Error())" },
    { text: "Promise.reject(new TypeError)" },
    { text: "Promise.reject(new Error('foo'))" },
    { text: "Promise.reject(foo || 5)" },
    { text: "Promise.reject(5 && foo)" },
    { text: "new Foo((resolve, reject) => reject(5))" },
    { text: "new Promise(function(resolve, reject) { return function(reject) { reject(5) } })" },
    { text: "new Promise(function(resolve, reject) { if (foo) { const reject = somethingElse; reject(5) } })" },
    { text: "new Promise(function(resolve, {apply}) { apply(5) })" },
    { text: "new Promise(function(resolve, reject) { resolve(5, reject) })" },
    { text: "async function foo() { Promise.reject(await foo); }" },
    {
        text: "Promise.reject()",
        options: [{ allowEmptyReject: true }],
    },
    {
        text: "new Promise(function(resolve, reject) { reject() })",
        options: [{ allowEmptyReject: true }],
    },

    // Optional chaining
    { text: "Promise.reject(obj?.foo)" },
    { text: "Promise.reject(obj?.foo())" },

    // Assignments
    { text: "Promise.reject(foo = new Error())" },
    { text: "Promise.reject(foo ||= 5)" },
    { text: "Promise.reject(foo.bar ??= 5)" },
    { text: "Promise.reject(foo[bar] ??= 5)" },

    // Private fields
    { text: "class C { #reject; foo() { Promise.#reject(5); } }" },
    { text: "class C { #error; foo() { Promise.reject(this.#error); } }" },
];

const invalid = [
    { text: "Promise.reject(5)" },
    { text: "Promise.reject('foo')" },
    { text: "Promise.reject(`foo`)" },
    { text: "Promise.reject(!foo)" },
    { text: "Promise.reject(void foo)" },
    { text: "Promise.reject()" },
    { text: "Promise.reject(undefined)" },
    { text: "Promise.reject({ foo: 1 })" },
    { text: "Promise.reject([1, 2, 3])" },
    {
        text: "Promise.reject()",
        options: [{ allowEmptyReject: false }],
    },
    {
        text: "new Promise(function(resolve, reject) { reject() })",
        options: [{ allowEmptyReject: false }],
    },
    {
        text: "Promise.reject(undefined)",
        options: [{ allowEmptyReject: true }],
    },
    { text: "Promise.reject('foo', somethingElse)" },
    { text: "new Promise(function(resolve, reject) { reject(5) })" },
    { text: "new Promise((resolve, reject) => { reject(5) })" },
    { text: "new Promise((resolve, reject) => reject(5))" },
    { text: "new Promise((resolve, reject) => reject())" },
    { text: "new Promise(function(yes, no) { no(5) })" },
    {
        text: `
          new Promise((resolve, reject) => {
            fs.readFile('foo.txt', (err, file) => {
              if (err) reject('File not found')
              else resolve(file)
            })
          })
        `,
    },
    { text: "new Promise(({foo, bar, baz}, reject) => reject(5))" },
    { text: "new Promise(function(reject, reject) { reject(5) })" },
    { text: "new Promise(function(foo, arguments) { arguments(5) })" },
    { text: "new Promise((foo, arguments) => arguments(5))" },
    { text: "new Promise(function({}, reject) { reject(5) })" },
    { text: "new Promise(({}, reject) => reject(5))" },
    { text: "new Promise((resolve, reject, somethingElse = reject(5)) => {})" },

    // Optional chaining
    { text: "Promise.reject?.(5)" },
    { text: "Promise?.reject(5)" },
    { text: "Promise?.reject?.(5)" },
    { text: "(Promise?.reject)(5)" },
    { text: "(Promise?.reject)?.(5)" },

    // Assignments with mathematical operators will either evaluate to a primitive value or throw a TypeError
    { text: "Promise.reject(foo += new Error())" },
    { text: "Promise.reject(foo -= new Error())" },
    { text: "Promise.reject(foo **= new Error())" },
    { text: "Promise.reject(foo <<= new Error())" },
    { text: "Promise.reject(foo |= new Error())" },
    { text: "Promise.reject(foo &= new Error())" },

    // evaluates either to a falsy value of `foo` (which, then, cannot be an Error object), or to `5`
    { text: "Promise.reject(foo && 5)" },
    { text: "Promise.reject(foo &&= 5)" },
];
