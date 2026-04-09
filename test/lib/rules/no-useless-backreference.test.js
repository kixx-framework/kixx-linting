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
    // not a regular expression
    { text: String.raw`'\1(a)'` },
    { text: String.raw`regExp('\\1(a)')` },
    { text: String.raw`new Regexp('\\1(a)', 'u')` },
    { text: String.raw`RegExp.foo('\\1(a)', 'u')` },
    { text: String.raw`new foo.RegExp('\\1(a)')` },

    // unknown pattern
    { text: String.raw`RegExp(p)` },
    { text: String.raw`new RegExp(p, 'u')` },
    { text: String.raw`RegExp('\\1(a)' + suffix)` },
    { text: "new RegExp(`${prefix}\\\\1(a)`)" },

    // not the global RegExp
    { text: String.raw`let RegExp; new RegExp('\\1(a)');` },
    { text: String.raw`function foo() { var RegExp; RegExp('\\1(a)', 'u'); }` },
    { text: String.raw`function foo(RegExp) { new RegExp('\\1(a)'); }` },
    { text: String.raw`if (foo) { const RegExp = bar; RegExp('\\1(a)'); }` },
    { text: String.raw`/* globals RegExp:off */ new RegExp('\\1(a)');` },
    {
        text: String.raw`RegExp('\\1(a)');`,
        languageOptions: {
            globals: { RegExp: "off" },
        },
    },

    // no capturing groups
    { text: String.raw`/(?:)/` },
    { text: String.raw`/(?:a)/` },
    { text: String.raw`new RegExp('')` },
    { text: String.raw`RegExp('(?:a)|(?:b)*')` },
    { text: String.raw`/^ab|[cd].\n$/` },

    // no backreferences
    { text: String.raw`/(a)/` },
    { text: String.raw`RegExp('(a)|(b)')` },
    { text: String.raw`new RegExp('\\n\\d(a)')` },
    { text: String.raw`/\0(a)/` },
    { text: String.raw`/\0(a)/u` },
    { text: String.raw`/(?<=(a))(b)(?=(c))/` },
    { text: String.raw`/(?<!(a))(b)(?!(c))/` },
    { text: String.raw`/(?<foo>a)/` },

    // not really a backreference
    { text: String.raw`RegExp('\1(a)')` }, // string octal escape
    { text: String.raw`RegExp('\\\\1(a)')` }, // escaped backslash
    { text: String.raw`/\\1(a)/` }, // // escaped backslash
    { text: String.raw`/\1/` }, // group 1 doesn't exist, this is a regex octal escape
    { text: String.raw`/^\1$/` }, // group 1 doesn't exist, this is a regex octal escape
    { text: String.raw`/\2(a)/` }, // group 2 doesn't exist, this is a regex octal escape
    { text: String.raw`/\1(?:a)/` }, // group 1 doesn't exist, this is a regex octal escape
    { text: String.raw`/\1(?=a)/` }, // group 1 doesn't exist, this is a regex octal escape
    { text: String.raw`/\1(?!a)/` }, // group 1 doesn't exist, this is a regex octal escape
    { text: String.raw`/^[\1](a)$/` }, // \N in a character class is a regex octal escape
    { text: String.raw`new RegExp('[\\1](a)')` }, // \N in a character class is a regex octal escape
    { text: String.raw`/\11(a)/` }, // regex octal escape \11, regex matches "\x09a"
    { text: String.raw`/\k<foo>(a)/` }, // without the 'u' flag and any named groups this isn't a syntax error, matches "k<foo>a"
    { text: String.raw`/^(a)\1\2$/` }, // \1 is a backreference, \2 is an octal escape sequence.

    // Valid backreferences: correct position, after the group
    { text: String.raw`/(a)\1/` },
    { text: String.raw`/(a).\1/` },
    { text: String.raw`RegExp('(a)\\1(b)')` },
    { text: String.raw`/(a)(b)\2(c)/` },
    { text: String.raw`/(?<foo>a)\k<foo>/` },
    { text: String.raw`new RegExp('(.)\\1')` },
    { text: String.raw`RegExp('(a)\\1(?:b)')` },
    { text: String.raw`/(a)b\1/` },
    { text: String.raw`/((a)\2)/` },
    { text: String.raw`/((a)b\2c)/` },
    { text: String.raw`/^(?:(a)\1)$/` },
    { text: String.raw`/^((a)\2)$/` },
    { text: String.raw`/^(((a)\3))|b$/` },
    { text: String.raw`/a(?<foo>(.)b\2)/` },
    { text: String.raw`/(a)?(b)*(\1)(c)/` },
    { text: String.raw`/(a)?(b)*(\2)(c)/` },
    { text: String.raw`/(?<=(a))b\1/` },
    { text: String.raw`/(?<=(?=(a)\1))b/` },

    // Valid backreferences: correct position before the group when they're both in the same lookbehind
    { text: String.raw`/(?<!\1(a))b/` },
    { text: String.raw`/(?<=\1(a))b/` },
    { text: String.raw`/(?<!\1.(a))b/` },
    { text: String.raw`/(?<=\1.(a))b/` },
    { text: String.raw`/(?<=(?:\1.(a)))b/` },
    { text: String.raw`/(?<!(?:\1)((a)))b/` },
    { text: String.raw`/(?<!(?:\2)((a)))b/` },
    { text: String.raw`/(?=(?<=\1(a)))b/` },
    { text: String.raw`/(?=(?<!\1(a)))b/` },
    { text: String.raw`/(.)(?<=\2(a))b/` },

    // Valid backreferences: not a reference into another alternative
    { text: String.raw`/^(a)\1|b/` },
    { text: String.raw`/^a|(b)\1/` },
    { text: String.raw`/^a|(b|c)\1/` },
    { text: String.raw`/^(a)|(b)\2/` },
    { text: String.raw`/^(?:(a)|(b)\2)$/` },
    { text: String.raw`/^a|(?:.|(b)\1)/` },
    { text: String.raw`/^a|(?:.|(b).(\1))/` },
    { text: String.raw`/^a|(?:.|(?:(b)).(\1))/` },
    { text: String.raw`/^a|(?:.|(?:(b)|c).(\1))/` },
    { text: String.raw`/^a|(?:.|(?:(b)).(\1|c))/` },
    { text: String.raw`/^a|(?:.|(?:(b)|c).(\1|d))/` },

    // Valid backreferences: not a reference into a negative lookaround (reference from within the same lookaround is allowed)
    { text: String.raw`/.(?=(b))\1/` },
    { text: String.raw`/.(?<=(b))\1/` },
    { text: String.raw`/a(?!(b)\1)./` },
    { text: String.raw`/a(?<!\1(b))./` },
    { text: String.raw`/a(?!(b)(\1))./` },
    { text: String.raw`/a(?!(?:(b)\1))./` },
    { text: String.raw`/a(?!(?:(b))\1)./` },
    { text: String.raw`/a(?<!(?:\1)(b))./` },
    { text: String.raw`/a(?<!(?:(?:\1)(b)))./` },
    { text: String.raw`/(?<!(a))(b)(?!(c))\2/` },
    { text: String.raw`/a(?!(b|c)\1)./` },

    // ignore regular expressions with syntax errors
    { text: String.raw`RegExp('\\1(a)[')` }, // \1 would be an error, but the unterminated [ is a syntax error
    { text: String.raw`new RegExp('\\1(a){', 'u')` }, // \1 would be an error, but the unterminated { is a syntax error because of the 'u' flag
    { text: String.raw`new RegExp('\\1(a)\\2', 'ug')` }, // \1 would be an error, but \2 is syntax error because of the 'u' flag
    { text: String.raw`const flags = 'gus'; RegExp('\\1(a){', flags);` }, // \1 would be an error, but the rule is aware of the 'u' flag so this is a syntax error
    { text: String.raw`RegExp('\\1(a)\\k<foo>', 'u')` }, // \1 would be an error, but \k<foo> produces syntax error because of the u flag
    { text: String.raw`new RegExp('\\k<foo>(?<foo>a)\\k<bar>')` }, // \k<foo> would be an error, but \k<bar> produces syntax error because group <bar> doesn't exist

    // ES2024
    { text: String.raw`new RegExp('([[A--B]])\\1', 'v')` },
    { text: String.raw`new RegExp('[[]\\1](a)', 'v')` }, // SyntaxError

    // ES2025
    { text: String.raw`/((?<foo>bar)\k<foo>|(?<foo>baz))/` },
];

const invalid = [
    // full message tests
    {
        text: String.raw`/(b)(\2a)/`,
    },
    {
        text: String.raw`/\k<foo>(?<foo>bar)/`,
    },
    {
        text: String.raw`RegExp('(a|bc)|\\1')`,
    },
    {
        text: String.raw`new RegExp('(?!(?<foo>\\n))\\1')`,
    },
    {
        text: String.raw`/(?<!(a)\1)b/`,
    },

    // nested
    {
        text: String.raw`new RegExp('(\\1)')`,
    },
    {
        text: String.raw`/^(a\1)$/`,
    },
    {
        text: String.raw`/^((a)\1)$/`,
    },
    {
        text: String.raw`new RegExp('^(a\\1b)$')`,
    },
    {
        text: String.raw`RegExp('^((\\1))$')`,
    },
    {
        text: String.raw`/((\2))/`,
    },
    {
        text: String.raw`/a(?<foo>(.)b\1)/`,
    },
    {
        text: String.raw`/a(?<foo>\k<foo>)b/`,
    },
    {
        text: String.raw`/^(\1)*$/`,
    },
    {
        text: String.raw`/^(?:a)(?:((?:\1)))*$/`,
    },
    {
        text: String.raw`/(?!(\1))/`,
    },
    {
        text: String.raw`/a|(b\1c)/`,
    },
    {
        text: String.raw`/(a|(\1))/`,
    },
    {
        text: String.raw`/(a|(\2))/`,
    },
    {
        text: String.raw`/(?:a|(\1))/`,
    },
    {
        text: String.raw`/(a)?(b)*(\3)/`,
    },
    {
        text: String.raw`/(?<=(a\1))b/`,
    },

    // forward
    {
        text: String.raw`/\1(a)/`,
    },
    {
        text: String.raw`/\1.(a)/`,
    },
    {
        text: String.raw`/(?:\1)(?:(a))/`,
    },
    {
        text: String.raw`/(?:\1)(?:((a)))/`,
    },
    {
        text: String.raw`/(?:\2)(?:((a)))/`,
    },
    {
        text: String.raw`/(?:\1)(?:((?:a)))/`,
    },
    {
        text: String.raw`/(\2)(a)/`,
    },
    {
        text: String.raw`RegExp('(a)\\2(b)')`,
    },
    {
        text: String.raw`/(?:a)(b)\2(c)/`,
    },
    {
        text: String.raw`/\k<foo>(?<foo>a)/`,
    },
    {
        text: String.raw`/(?:a(b)\2)(c)/`,
    },
    {
        text: String.raw`new RegExp('(a)(b)\\3(c)')`,
    },
    {
        text: String.raw`/\1(?<=(a))./`,
    },
    {
        text: String.raw`/\1(?<!(a))./`,
    },
    {
        text: String.raw`/(?<=\1)(?<=(a))/`,
    },
    {
        text: String.raw`/(?<!\1)(?<!(a))/`,
    },
    {
        text: String.raw`/(?=\1(a))./`,
    },
    {
        text: String.raw`/(?!\1(a))./`,
    },

    // backward in the same lookbehind
    {
        text: String.raw`/(?<=(a)\1)b/`,
    },
    {
        text: String.raw`/(?<!.(a).\1.)b/`,
    },
    {
        text: String.raw`/(.)(?<!(b|c)\2)d/`,
    },
    {
        text: String.raw`/(?<=(?:(a)\1))b/`,
    },
    {
        text: String.raw`/(?<=(?:(a))\1)b/`,
    },
    {
        text: String.raw`/(?<=(a)(?:\1))b/`,
    },
    {
        text: String.raw`/(?<!(?:(a))(?:\1))b/`,
    },
    {
        text: String.raw`/(?<!(?:(a))(?:\1)|.)b/`,
    },
    {
        text: String.raw`/.(?!(?<!(a)\1))./`,
    },
    {
        text: String.raw`/.(?=(?<!(a)\1))./`,
    },
    {
        text: String.raw`/.(?!(?<=(a)\1))./`,
    },
    {
        text: String.raw`/.(?=(?<=(a)\1))./`,
    },

    // into another alternative
    {
        text: String.raw`/(a)|\1b/`,
    },
    {
        text: String.raw`/^(?:(a)|\1b)$/`,
    },
    {
        text: String.raw`/^(?:(a)|b(?:c|\1))$/`,
    },
    {
        text: String.raw`/^(?:a|b(?:(c)|\1))$/`,
    },
    {
        text: String.raw`/^(?:(a(?!b))|\1b)+$/`,
    },
    {
        text: String.raw`/^(?:(?:(a)(?!b))|\1b)+$/`,
    },
    {
        text: String.raw`/^(?:(a(?=a))|\1b)+$/`,
    },
    {
        text: String.raw`/^(?:(a)(?=a)|\1b)+$/`,
    },
    {
        text: String.raw`/.(?:a|(b)).|(?:(\1)|c)./`,
    },
    {
        text: String.raw`/.(?!(a)|\1)./`,
    },
    {
        text: String.raw`/.(?<=\1|(a))./`,
    },

    // into a negative lookaround
    {
        text: String.raw`/a(?!(b)).\1/`,
    },
    {
        text: String.raw`/(?<!(a))b\1/`,
    },
    {
        text: String.raw`/(?<!(a))(?:\1)/`,
    },
    {
        text: String.raw`/.(?<!a|(b)).\1/`,
    },
    {
        text: String.raw`/.(?!(a)).(?!\1)./`,
    },
    {
        text: String.raw`/.(?<!(a)).(?<!\1)./`,
    },
    {
        text: String.raw`/.(?=(?!(a))\1)./`,
    },
    {
        text: String.raw`/.(?<!\1(?!(a)))/`,
    },

    // valid and invalid
    {
        text: String.raw`/\1(a)(b)\2/`,
    },
    {
        text: String.raw`/\1(a)\1/`,
    },

    // multiple invalid
    {
        text: String.raw`/\1(a)\2(b)/`,
    },
    {
        text: String.raw`/\1.(?<=(a)\1)/`,
    },
    {
        text: String.raw`/(?!\1(a)).\1/`,
    },
    {
        text: String.raw`/(a)\2(b)/; RegExp('(\\1)');`,
    },

    // when flags cannot be evaluated, it is assumed that the regex doesn't have 'u' flag set, so this will be a correct regex with a useless backreference
    {
        text: String.raw`RegExp('\\1(a){', flags);`,
    },

    // able to evaluate some statically known expressions
    {
        text: String.raw`const r = RegExp, p = '\\1', s = '(a)'; new r(p + s);`,
    },

    // ES2024
    {
        text: String.raw`new RegExp('\\1([[A--B]])', 'v')`,
    },

    // ES2025
    {
        text: String.raw`/\k<foo>((?<foo>bar)|(?<foo>baz))/`,
    },
    {
        text: String.raw`/((?<foo>bar)|\k<foo>(?<foo>baz))/`,
    },
    {
        text: String.raw`/\k<foo>((?<foo>bar)|(?<foo>baz)|(?<foo>qux))/`,
    },
    {
        text: String.raw`/((?<foo>bar)|\k<foo>(?<foo>baz)|(?<foo>qux))/`,
    },
    {
        text: String.raw`/((?<foo>bar)|\k<foo>|(?<foo>baz))/`,
    },
    {
        text: String.raw`/((?<foo>bar)|\k<foo>|(?<foo>baz)|(?<foo>qux))/`,
    },
    {
        text: String.raw`/((?<foo>bar)|(?<foo>baz\k<foo>)|(?<foo>qux\k<foo>))/`,
    },
    {
        text: String.raw`/(?<=((?<foo>bar)|(?<foo>baz))\k<foo>)/`,
    },
    {
        text: String.raw`/((?!(?<foo>bar))|(?!(?<foo>baz)))\k<foo>/`,
    },
];
