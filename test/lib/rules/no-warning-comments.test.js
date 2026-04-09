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
    { text: "// any comment", options: [{ terms: ["fixme"] }] },
    { text: "// any comment", options: [{ terms: ["fixme", "todo"] }] },
    { text: "// any comment" },
    { text: "// any comment", options: [{ location: "anywhere" }] },
    {
        text: "// any comment with TODO, FIXME or XXX",
        options: [{ location: "start" }],
    },
    { text: "// any comment with TODO, FIXME or XXX" },
    { text: "/* any block comment */", options: [{ terms: ["fixme"] }] },
    {
        text: "/* any block comment */",
        options: [{ terms: ["fixme", "todo"] }],
    },
    { text: "/* any block comment */" },
    {
        text: "/* any block comment */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/* any block comment with TODO, FIXME or XXX */",
        options: [{ location: "start" }],
    },
    { text: "/* any block comment with TODO, FIXME or XXX */" },
    { text: "/* any block comment with (TODO, FIXME's or XXX!) */" },
    {
        text: "// comments containing terms as substrings like TodoMVC",
        options: [{ terms: ["todo"], location: "anywhere" }],
    },
    {
        text: "// special regex characters don't cause a problem",
        options: [{ terms: ["[aeiou]"], location: "anywhere" }],
    },
    { text: '/*eslint no-warning-comments: [2, { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]*/\n\nvar x = 10;\n' },
    {
        text: '/*eslint no-warning-comments: [2, { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]*/\n\nvar x = 10;\n',
        options: [{ location: "anywhere" }],
    },
    { text: "// foo", options: [{ terms: ["foo-bar"] }] },
    { text: "/** multi-line block comment with lines starting with\nTODO\nFIXME or\nXXX\n*/" },
    { text: "//!TODO ", options: [{ decoration: ["*"] }] },
];

const invalid = [
    {
        text: "// fixme",
    },
    {
        text: "// any fixme",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// any fixme",
        options: [{ terms: ["fixme"], location: "anywhere" }],
    },
    {
        text: "// any FIXME",
        options: [{ terms: ["fixme"], location: "anywhere" }],
    },
    {
        text: "// any fIxMe",
        options: [{ terms: ["fixme"], location: "anywhere" }],
    },
    {
        text: "/* any fixme */",
        options: [{ terms: ["FIXME"], location: "anywhere" }],
    },
    {
        text: "/* any FIXME */",
        options: [{ terms: ["FIXME"], location: "anywhere" }],
    },
    {
        text: "/* any fIxMe */",
        options: [{ terms: ["FIXME"], location: "anywhere" }],
    },
    {
        text: "// any fixme or todo",
        options: [{ terms: ["fixme", "todo"], location: "anywhere" }],
    },
    {
        text: "/* any fixme or todo */",
        options: [{ terms: ["fixme", "todo"], location: "anywhere" }],
    },
    {
        text: "/* any fixme or todo */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/* fixme and todo */",
    },
    {
        text: "/* fixme and todo */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/* any fixme */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/* fixme! */",
        options: [{ terms: ["fixme"] }],
    },
    {
        text: "// regex [litera|$]",
        options: [{ terms: ["[litera|$]"], location: "anywhere" }],
    },
    {
        text: "/* eslint one-var: 2 */",
        options: [{ terms: ["eslint"] }],
    },
    {
        text: "/* eslint one-var: 2 */",
        options: [{ terms: ["one"], location: "anywhere" }],
    },
    {
        text: "/* any block comment with TODO, FIXME or XXX */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/* any block comment with (TODO, FIXME's or XXX!) */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/** \n *any block comment \n*with (TODO, FIXME's or XXX!) **/",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// any comment with TODO, FIXME or XXX",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// TODO: something small",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// TODO: something really longer than 40 characters",
        options: [{ location: "anywhere" }],
    },
    {
        text: "/* TODO: something \n really longer than 40 characters \n and also a new line */",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// TODO: small",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// https://github.com/eslint/eslint/pull/13522#discussion_r470293411 TODO",
        options: [{ location: "anywhere" }],
    },
    {
        text: "// Comment ending with term followed by punctuation TODO!",
        options: [{ terms: ["todo"], location: "anywhere" }],
    },
    {
        text: "// Comment ending with term including punctuation TODO!",
        options: [{ terms: ["todo!"], location: "anywhere" }],
    },
    {
        text: "// Comment ending with term including punctuation followed by more TODO!!!",
        options: [{ terms: ["todo!"], location: "anywhere" }],
    },
    {
        text: "// !TODO comment starting with term preceded by punctuation",
        options: [{ terms: ["todo"], location: "anywhere" }],
    },
    {
        text: "// !TODO comment starting with term including punctuation",
        options: [{ terms: ["!todo"], location: "anywhere" }],
    },
    {
        text: "// !!!TODO comment starting with term including punctuation preceded by more",
        options: [{ terms: ["!todo"], location: "anywhere" }],
    },
    {
        text: "// FIX!term ending with punctuation followed word character",
        options: [{ terms: ["FIX!"], location: "anywhere" }],
    },
    {
        text: "// Term starting with punctuation preceded word character!FIX",
        options: [{ terms: ["!FIX"], location: "anywhere" }],
    },
    {
        text: "//!XXX comment starting with no spaces (anywhere)",
        options: [{ terms: ["!xxx"], location: "anywhere" }],
    },
    {
        text: "//!XXX comment starting with no spaces (start)",
        options: [{ terms: ["!xxx"], location: "start" }],
    },
    {
        text: "/*\nTODO undecorated multi-line block comment (start)\n*/",
        options: [{ terms: ["todo"], location: "start" }],
    },
    {
        text: "///// TODO decorated single-line comment with decoration array \n /////",
        options: [
            { terms: ["todo"], location: "start", decoration: ["*", "/"] },
        ],
    },
    {
        text: "///*/*/ TODO decorated single-line comment with multiple decoration characters (start) \n /////",
        options: [
            { terms: ["todo"], location: "start", decoration: ["*", "/"] },
        ],
    },
    {
        text: "//**TODO term starts with a decoration character",
        options: [
            { terms: ["*todo"], location: "start", decoration: ["*"] },
        ],
    },
];
