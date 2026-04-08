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
    { text: "a in b" },
    { text: "a in b === false" },
    { text: "!(a in b)" },
    { text: "(!a) in b" },
    { text: "a instanceof b" },
    { text: "a instanceof b === false" },
    { text: "!(a instanceof b)" },
    { text: "(!a) instanceof b" },

    // tests cases for enforceForOrderingRelations option:
    { text: "if (! a < b) {}" },
    { text: "while (! a > b) {}" },
    { text: "foo = ! a <= b;" },
    { text: "foo = ! a >= b;" },
    {
        text: "! a <= b",
        options: [{}],
    },
    {
        text: "foo = ! a >= b;",
        options: [{ enforceForOrderingRelations: false }],
    },
    {
        text: "foo = (!a) >= b;",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "a <= b",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "!(a < b)",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "foo = a > b;",
        options: [{ enforceForOrderingRelations: true }],
    },
];
const invalid = [
    {
        text: "!a in b",
    },
    {
        text: "(!a in b)",
    },
    {
        text: "!(a) in b",
    },
    {
        text: "!a instanceof b",
    },
    {
        text: "(!a instanceof b)",
    },
    {
        text: "!(a) instanceof b",
    },
    {
        text: "if (! a < b) {}",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "while (! a > b) {}",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "foo = ! a <= b;",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "foo = ! a >= b;",
        options: [{ enforceForOrderingRelations: true }],
    },
    {
        text: "! a <= b",
        options: [{ enforceForOrderingRelations: true }],
    },
];
