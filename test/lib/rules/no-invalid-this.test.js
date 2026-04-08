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
    {
        text: "console.log(this); z(x => console.log(x, this));",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; console.log(this); z(x => console.log(x, this));",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "console.log(this); z(x => console.log(x, this));",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "() => { this }; this;",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; () => { this }; this;",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "() => { this }; this;",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "this.eval('foo');",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; this.eval('foo');",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "this.eval('foo');",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "return function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    globalReturn: true
                }
            }
        },
    },
    {
        text: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }).bar(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: function() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: function() { return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = function() { return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "class A {static foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; class A {static foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "class A {static foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class A {static foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {}
        ],
    },
    {
        text: "\"use strict\"; function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {}
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {}
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {}
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: true
            }
        ],
    },
    {
        text: "\"use strict\"; function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: true
            }
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: true
            }
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: true
            }
        ],
    },
    {
        text: "var Foo = function Foo() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var Foo = function Foo() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var Foo = function Foo() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var Foo = function Foo() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "class A {constructor() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; class A {constructor() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "class A {constructor() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class A {constructor() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var obj = {foo: function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var obj = {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var obj = {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var obj = {foo: foo || function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: foo || function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: foo || function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: foo || function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var obj = {foo: hasNative ? foo : function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: hasNative ? foo : function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: hasNative ? foo : function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: hasNative ? foo : function() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var obj = {foo: (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })()};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })()};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })()};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })()};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "Object.defineProperty(obj, \"foo\", {value: function() { console.log(this); z(x => console.log(x, this)); }})",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; Object.defineProperty(obj, \"foo\", {value: function() { console.log(this); z(x => console.log(x, this)); }})",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Object.defineProperty(obj, \"foo\", {value: function() { console.log(this); z(x => console.log(x, this)); }})",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Object.defineProperty(obj, \"foo\", {value: function() { console.log(this); z(x => console.log(x, this)); }})",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "Object.defineProperties(obj, {foo: {value: function() { console.log(this); z(x => console.log(x, this)); }}})",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; Object.defineProperties(obj, {foo: {value: function() { console.log(this); z(x => console.log(x, this)); }}})",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Object.defineProperties(obj, {foo: {value: function() { console.log(this); z(x => console.log(x, this)); }}})",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Object.defineProperties(obj, {foo: {value: function() { console.log(this); z(x => console.log(x, this)); }}})",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = foo || function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = foo || function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = foo || function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = foo || function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = foo ? bar : function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = foo ? bar : function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = foo ? bar : function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = foo ? bar : function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = (() => function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = (() => function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = (() => function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = (() => function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = (function() { return () => { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = (() => () => { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = (() => () => { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = (() => () => { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })?.();",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })?.();",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })?.();",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = (function() { return function() { console.log(this); z(x => console.log(x, this)); }; })?.();",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "class A {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; class A {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "class A {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class A {foo() { console.log(this); z(x => console.log(x, this)); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(null);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).call(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; (function() { console.log(this); z(x => console.log(x, this)); }).call(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).call(obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).call(obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).call(undefined);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; (function() { console.log(this); z(x => console.log(x, this)); }).apply(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(void 0);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Reflect.apply(function() { console.log(this); z(x => console.log(x, this)); }, obj, []);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; Reflect.apply(function() { console.log(this); z(x => console.log(x, this)); }, obj, []);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Reflect.apply(function() { console.log(this); z(x => console.log(x, this)); }, obj, []);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Reflect.apply(function() { console.log(this); z(x => console.log(x, this)); }, obj, []);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }?.bind(obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; var foo = function() { console.log(this); z(x => console.log(x, this)); }?.bind(obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }?.bind(obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }?.bind(obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }?.bind)(obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; var foo = (function() { console.log(this); z(x => console.log(x, this)); }?.bind)(obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }?.bind)(obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }?.bind)(obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind?.(obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind?.(obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind?.(obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind?.(obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.every(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.find(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findLast(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.map(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.some(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; Array.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.filter(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.find(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.find(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.find(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.find(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.findLast(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.findLast(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findLast(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.findLast(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.map(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.map(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.map(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.map(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.some(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo.some(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.some(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.some(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, null);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array?.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; Array?.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "Array?.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Array?.from([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "foo?.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; foo?.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "foo?.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo?.every(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "(Array?.from)([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; (Array?.from)([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "(Array?.from)([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(Array?.from)([], function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "(foo?.every)(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "\"use strict\"; (foo?.every)(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020
        },
    },
    {
        text: "(foo?.every)(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(foo?.every)(function() { console.log(this); z(x => console.log(x, this)); }, obj);",
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module"
        },
    },
    {
        text: "/** @this Obj */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; /** @this Obj */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "/** @this Obj */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "/** @this Obj */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "/**\n * @returns {void}\n * @this Obj\n */\nfunction foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; /**\n * @returns {void}\n * @this Obj\n */\nfunction foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "/**\n * @returns {void}\n * @this Obj\n */\nfunction foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "/**\n * @returns {void}\n * @this Obj\n */\nfunction foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "/** @returns {void} */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "/** @this Obj */ foo(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo(/* @this Obj */ function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; foo(/* @this Obj */ function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo(/* @this Obj */ function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo(/* @this Obj */ function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "function foo() { /** @this Obj*/ return function bar() { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; function foo() { /** @this Obj*/ return function bar() { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo() { /** @this Obj*/ return function bar() { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function foo() { /** @this Obj*/ return function bar() { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function foo(Ctor = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; function foo(Ctor = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo(Ctor = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function foo(Ctor = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "function foo(func = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "[obj.method = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; [obj.method = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "[obj.method = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "[obj.method = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "[func = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.method &&= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021
        },
    },
    {
        text: "\"use strict\"; obj.method &&= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021
        },
    },
    {
        text: "obj.method &&= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.method &&= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module"
        },
    },
    {
        text: "obj.method ||= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021
        },
    },
    {
        text: "\"use strict\"; obj.method ||= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021
        },
    },
    {
        text: "obj.method ||= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.method ||= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module"
        },
    },
    {
        text: "obj.method ??= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021
        },
    },
    {
        text: "\"use strict\"; obj.method ??= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021
        },
    },
    {
        text: "obj.method ??= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.method ??= function () { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module"
        },
    },
    {
        text: "class C { field = this }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { field = this }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { field = this }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { field = this }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static field = this }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static field = this }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static field = this }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static field = this }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { field = console.log(this); }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { field = console.log(this); }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { field = console.log(this); }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { field = console.log(this); }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { field = z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { field = z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { field = z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { field = z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { #field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { #field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { #field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { #field = function () { console.log(this); z(x => console.log(x, this)); }; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { [this.foo]; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { [this.foo]; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { [this.foo]; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { foo = () => this; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { foo = () => this; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { foo = () => this; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { foo = () => this; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { foo = () => { this }; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { foo = () => { this }; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { foo = () => { this }; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { foo = () => { this }; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static { this.x; } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static { this.x; } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static { this.x; } }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static { this.x; } }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static { () => { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static { () => { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static { () => { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static { () => { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static { class D { [this.x]; } } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static { class D { [this.x]; } } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static { class D { [this.x]; } } }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static { class D { [this.x]; } } }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static {} [this]; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static {} [this]; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static {} [this]; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static {} [this.x]; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static {} [this.x]; }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static {} [this.x]; }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function foo() { 'use strict'; this.eval(); }",
        languageOptions: {
            ecmaVersion: 3
        },
    },
    {
        text: "\"use strict\"; function foo() { 'use strict'; this.eval(); }",
        languageOptions: {
            ecmaVersion: 3
        },
    },
    {
        text: "function foo() { 'use strict'; this.eval(); }",
        languageOptions: {
            ecmaVersion: 3,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    }
];

const invalid = [
    {
        text: "console.log(this); z(x => console.log(x, this));",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "() => { this }; this;",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "this.eval('foo');",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; (function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function Foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; function foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "function Foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; function Foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function Foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "function Foo() { \"use strict\"; console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    globalReturn: true
                }
            }
        },
    },
    {
        text: "return function() { console.log(this); z(x => console.log(x, this)); };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    globalReturn: true,
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "\"use strict\"; var foo = (function() { console.log(this); z(x => console.log(x, this)); }).bar(obj);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }).bar(obj);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var foo = (function() { console.log(this); z(x => console.log(x, this)); }).bar(obj);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: function() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: function() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: function() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; var obj = {foo() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo() { function foo() { console.log(this); z(x => console.log(x, this)); } foo(); }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: function() { return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: function() { return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: function() { return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "var obj = {foo: function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; var obj = {foo: function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var obj = {foo: function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var obj = {foo: function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; }};",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; obj.foo = function() { return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = function() { return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = function() { return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; obj.foo = function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = function() { \"use strict\"; return function() { console.log(this); z(x => console.log(x, this)); }; };",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "class A { foo() { return function() { console.log(this); z(x => console.log(x, this)); }; } }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "\"use strict\"; class A { foo() { return function() { console.log(this); z(x => console.log(x, this)); }; } }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "class A { foo() { return function() { console.log(this); z(x => console.log(x, this)); }; } }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class A { foo() { return function() { console.log(this); z(x => console.log(x, this)); }; } }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; obj.foo = (function() { return () => { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "obj.foo = (function() { return () => { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "obj.foo = (function() { return () => { console.log(this); z(x => console.log(x, this)); }; })();",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "obj.foo = (() => () => { console.log(this); z(x => console.log(x, this)); })();",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(null);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(null);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var foo = function() { console.log(this); z(x => console.log(x, this)); }.bind(null);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; (function() { console.log(this); z(x => console.log(x, this)); }).call(undefined);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).call(undefined);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).call(undefined);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; (function() { console.log(this); z(x => console.log(x, this)); }).apply(void 0);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(void 0);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "(function() { console.log(this); z(x => console.log(x, this)); }).apply(void 0);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; Array.from([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Array.from([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "Array.fromAsync([], function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.every(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.every(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.every(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.filter(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.filter(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.find(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.find(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.find(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.findIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.findLast(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findLast(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.findLast(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.findLastIndex(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.flatMap(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.forEach(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.map(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.map(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.map(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.some(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.some(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.some(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, null);",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, null);",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "foo.forEach(function() { console.log(this); z(x => console.log(x, this)); }, null);",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; /** @returns {void} */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "/** @returns {void} */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "/** @returns {void} */ function foo() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; /** @this Obj */ foo(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "/** @this Obj */ foo(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "/** @this Obj */ foo(function() { console.log(this); z(x => console.log(x, this)); });",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "var Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "var func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "Ctor = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "func = function() { console.log(this); z(x => console.log(x, this)); }",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
        options: [
            {
                capIsConstructor: false
            }
        ],
    },
    {
        text: "\"use strict\"; function foo(func = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "function foo(func = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "function foo(func = function() { console.log(this); z(x => console.log(x, this)); }) {}",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "\"use strict\"; [func = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6
        },
    },
    {
        text: "[func = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "[func = function() { console.log(this); z(x => console.log(x, this)); }] = a",
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module"
        },
    },
    {
        text: "class C { [this.foo]; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static { function foo() { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static { function foo() { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static { function foo() { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static { function foo() { this.x; } } }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static { (function() { this.x; }); } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static { (function() { this.x; }); } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static { (function() { this.x; }); } }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static { (function() { this.x; }); } }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static { (function() { this.x; })(); } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "\"use strict\"; class C { static { (function() { this.x; })(); } }",
        languageOptions: {
            ecmaVersion: 2022
        },
    },
    {
        text: "class C { static { (function() { this.x; })(); } }",
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true
                }
            }
        },
    },
    {
        text: "class C { static { (function() { this.x; })(); } }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static {} [this]; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    },
    {
        text: "class C { static {} [this.x]; }",
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        },
    }
];
