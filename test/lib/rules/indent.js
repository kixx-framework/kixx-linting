
/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @param {any[]} values The interpolation values in the template literal.
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings, ...values) {
    const text = strings
        .map((s, i) => (i === 0 ? s : values[i - 1] + s))
        .join("");
    const lines = text
        .replace(/^\n/u, "")
        .replace(/\n\s*$/u, "")
        .split("\n");
    const lineIndents = lines
        .filter(line => line.trim())
        .map(line => line.match(/ */u)[0].length);
    const minLineIndent = Math.min(...lineIndents);

    return lines.map(line => line.slice(minLineIndent)).join("\n");
}

export default {
	valid: [
		{
			code: unIndent`
                bridge.callHandler(
                  'getAppVersion', 'test23', function(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  }
                );
            `,
			options: [2],
		},
		{
			code: unIndent`
                bridge.callHandler(
                  'getAppVersion', 'test23', function(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  });
            `,
			options: [2],
		},
		{
			code: unIndent`
                bridge.callHandler(
                  'getAppVersion',
                  null,
                  function responseCallback(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  }
                );
            `,
			options: [2],
		},
		{
			code: unIndent`
                bridge.callHandler(
                  'getAppVersion',
                  null,
                  function responseCallback(responseData) {
                    window.ah.mobileAppVersion = responseData;
                  });
            `,
			options: [2],
		},
		{
			code: unIndent`
                function doStuff(keys) {
                    _.forEach(
                        keys,
                        key => {
                            doSomething(key);
                        }
                    );
                }
            `,
			options: [4],
		},
		{
			code: unIndent`
                example(
                    function () {
                        console.log('example');
                    }
                );
            `,
			options: [4],
		},
		{
			code: unIndent`
                let foo = somethingList
                    .filter(x => {
                        return x;
                    })
                    .map(x => {
                        return 100 * x;
                    });
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = 0 &&
                    {
                        a: 1,
                        b: 2
                    };
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = 0 &&
                \t{
                \t\ta: 1,
                \t\tb: 2
                \t};
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                var x = 0 &&
                    {
                        a: 1,
                        b: 2
                    }||
                    {
                        c: 3,
                        d: 4
                    };
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = [
                    'a',
                    'b',
                    'c'
                ];
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = ['a',
                    'b',
                    'c',
                ];
            `,
			options: [4],
		},
		{
			code: "var x = 0 && 1;",
			options: [4],
		},
		{
			code: "var x = 0 && { a: 1, b: 2 };",
			options: [4],
		},
		{
			code: unIndent`
                var x = 0 &&
                    (
                        1
                    );
            `,
			options: [4],
		},
		{
			code: unIndent`
                require('http').request({hostname: 'localhost',
                  port: 80}, function(res) {
                  res.end();
                });
            `,
			options: [2],
		},
		{
			code: unIndent`
                function test() {
                  return client.signUp(email, PASSWORD, { preVerified: true })
                    .then(function (result) {
                      // hi
                    })
                    .then(function () {
                      return FunctionalHelpers.clearBrowserState(self, {
                        contentServer: true,
                        contentServer1: true
                      });
                    });
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                it('should... some lengthy test description that is forced to be' +
                  'wrapped into two lines since the line length limit is set', () => {
                  expect(true).toBe(true);
                });
            `,
			options: [2],
		},
		{
			code: unIndent`
                function test() {
                    return client.signUp(email, PASSWORD, { preVerified: true })
                        .then(function (result) {
                            var x = 1;
                            var y = 1;
                        }, function(err){
                            var o = 1 - 2;
                            var y = 1 - 2;
                            return true;
                        })
                }
            `,
			options: [4],
		},
		{
			// https://github.com/eslint/eslint/issues/11802
			code: unIndent`
                import foo from "foo"

                ;(() => {})()
            `,
			options: [4],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                function test() {
                    return client.signUp(email, PASSWORD, { preVerified: true })
                    .then(function (result) {
                        var x = 1;
                        var y = 1;
                    }, function(err){
                        var o = 1 - 2;
                        var y = 1 - 2;
                        return true;
                    });
                }
            `,
			options: [4, { MemberExpression: 0 }],
		},

		{
			code: "// hi",
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var Command = function() {
                  var fileList = [],
                      files = []

                  files.concat(fileList)
                };
            `,
			options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
		},
		{
			code: "  ",
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                if(data) {
                  console.log('hi');
                  b = true;};
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                foo = () => {
                  console.log('hi');
                  return true;};
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                function test(data) {
                  console.log('hi');
                  return true;};
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var test = function(data) {
                  console.log('hi');
                };
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                arr.forEach(function(data) {
                  otherdata.forEach(function(zero) {
                    console.log('hi');
                  }) });
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                a = [
                    ,3
                ]
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                [
                  ['gzip', 'gunzip'],
                  ['gzip', 'unzip'],
                  ['deflate', 'inflate'],
                  ['deflateRaw', 'inflateRaw'],
                ].forEach(function(method) {
                  console.log(method);
                });
            `,
			options: [2, { SwitchCase: 1, VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                test(123, {
                    bye: {
                        hi: [1,
                            {
                                b: 2
                            }
                        ]
                    }
                });
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var xyz = 2,
                    lmn = [
                        {
                            a: 1
                        }
                    ];
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                lmnn = [{
                    a: 1
                },
                {
                    b: 2
                }, {
                    x: 2
                }];
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		unIndent`
            [{
                foo: 1
            }, {
                foo: 2
            }, {
                foo: 3
            }]
        `,
		unIndent`
            foo([
                bar
            ], [
                baz
            ], [
                qux
            ]);
        `,
		{
			code: unIndent`
                abc({
                    test: [
                        [
                            c,
                            xyz,
                            2
                        ].join(',')
                    ]
                });
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                abc = {
                  test: [
                    [
                      c,
                      xyz,
                      2
                    ]
                  ]
                };
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                abc(
                  {
                    a: 1,
                    b: 2
                  }
                );
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                abc({
                    a: 1,
                    b: 2
                });
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var abc =
                  [
                    c,
                    xyz,
                    {
                      a: 1,
                      b: 2
                    }
                  ];
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var abc = [
                  c,
                  xyz,
                  {
                    a: 1,
                    b: 2
                  }
                ];
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var abc = 5,
                    c = 2,
                    xyz =
                    {
                      a: 1,
                      b: 2
                    };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		unIndent`
            var
                x = {
                    a: 1,
                },
                y = {
                    b: 2
                }
        `,
		unIndent`
            const
                x = {
                    a: 1,
                },
                y = {
                    b: 2
                }
        `,
		unIndent`
            let
                x = {
                    a: 1,
                },
                y = {
                    b: 2
                }
        `,
		unIndent`
            var foo = { a: 1 }, bar = {
                b: 2
            };
        `,
		unIndent`
            var foo = { a: 1 }, bar = {
                    b: 2
                },
                baz = {
                    c: 3
                }
        `,
		unIndent`
            const {
                    foo
                } = 1,
                bar = 2
        `,
		{
			code: unIndent`
                var foo = 1,
                  bar =
                    2
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var foo = 1,
                  bar
                    = 2
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var foo
                  = 1,
                  bar
                    = 2
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var foo
                  =
                  1,
                  bar
                    =
                    2
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var foo
                  = (1),
                  bar
                    = (2)
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                let foo = 'foo',
                    bar = bar;
                const a = 'a',
                      b = 'b';
            `,
			options: [2, { VariableDeclarator: "first" }],
		},
		{
			code: unIndent`
                let foo = 'foo',
                    bar = bar  // <-- no semicolon here
                const a = 'a',
                      b = 'b'  // <-- no semicolon here
            `,
			options: [2, { VariableDeclarator: "first" }],
		},
		{
			code: unIndent`
                var foo = 1,
                    bar = 2,
                    baz = 3
                ;
            `,
			options: [2, { VariableDeclarator: { var: 2 } }],
		},
		{
			code: unIndent`
                var foo = 1,
                    bar = 2,
                    baz = 3
                    ;
            `,
			options: [2, { VariableDeclarator: { var: 2 } }],
		},
		{
			code: unIndent`
                var foo = 'foo',
                    bar = bar;
            `,
			options: [2, { VariableDeclarator: { var: "first" } }],
		},
		{
			code: unIndent`
                var foo = 'foo',
                    bar = 'bar'  // <-- no semicolon here
            `,
			options: [2, { VariableDeclarator: { var: "first" } }],
		},
		{
			code: unIndent`
            let foo = 1,
                bar = 2,
                baz
            `,
			options: [2, { VariableDeclarator: "first" }],
		},
		{
			code: unIndent`
            let
                foo
            `,
			options: [4, { VariableDeclarator: "first" }],
		},
		{
			code: unIndent`
            let foo = 1,
                bar =
                2
            `,
			options: [2, { VariableDeclarator: "first" }],
		},
		{
			code: unIndent`
                var abc =
                    {
                      a: 1,
                      b: 2
                    };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = new abc({
                        a: 1,
                        b: 2
                    }),
                    b = 2;
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = 2,
                  c = {
                    a: 1,
                    b: 2
                  },
                  b = 2;
            `,
			options: [2, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var x = 2,
                    y = {
                      a: 1,
                      b: 2
                    },
                    b = 2;
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var e = {
                      a: 1,
                      b: 2
                    },
                    b = 2;
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = {
                  a: 1,
                  b: 2
                };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                function test() {
                  if (true ||
                            false){
                    console.log(val);
                  }
                }
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		unIndent`
            var foo = bar ||
                !(
                    baz
                );
        `,
		unIndent`
            for (var foo = 1;
                foo < 10;
                foo++) {}
        `,
		unIndent`
            for (
                var foo = 1;
                foo < 10;
                foo++
            ) {}
        `,
		{
			code: unIndent`
                for (var val in obj)
                  if (true)
                    console.log(val);
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                with (a)
                    b();
            `,
			options: [4],
		},
		{
			code: unIndent`
                with (a)
                    b();
                c();
            `,
			options: [4],
		},
		{
			code: unIndent`
                if(true)
                  if (true)
                    if (true)
                      console.log(val);
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                function hi(){     var a = 1;
                  y++;                   x++;
                }
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                for(;length > index; index++)if(NO_HOLES || index in self){
                  x++;
                }
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                function test(){
                  switch(length){
                    case 1: return function(a){
                      return fn.call(that, a);
                    };
                  }
                }
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var geometry = 2,
                rotate = 2;
            `,
			options: [2, { VariableDeclarator: 0 }],
		},
		{
			code: unIndent`
                var geometry,
                    rotate;
            `,
			options: [4, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var geometry,
                \trotate;
            `,
			options: ["tab", { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var geometry,
                  rotate;
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var geometry,
                    rotate;
            `,
			options: [2, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                let geometry,
                    rotate;
            `,
			options: [2, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                const geometry = 2,
                    rotate = 3;
            `,
			options: [2, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
                  height, rotate;
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			code: "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth;",
			options: [2, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                if (1 < 2){
                //hi sd
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                while (1 < 2){
                  //hi sd
                }
            `,
			options: [2],
		},
		{
			code: "while (1 < 2) console.log('hi');",
			options: [2],
		},

		{
			code: unIndent`
                [a, boop,
                    c].forEach((index) => {
                    index;
                });
            `,
			options: [4],
		},
		{
			code: unIndent`
                [a, b,
                    c].forEach(function(index){
                    return index;
                });
            `,
			options: [4],
		},
		{
			code: unIndent`
                [a, b, c].forEach((index) => {
                    index;
                });
            `,
			options: [4],
		},
		{
			code: unIndent`
                [a, b, c].forEach(function(index){
                    return index;
                });
            `,
			options: [4],
		},
		{
			code: unIndent`
                (foo)
                    .bar([
                        baz
                    ]);
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                switch (x) {
                    case "foo":
                        a();
                        break;
                    case "bar":
                        switch (y) {
                            case "1":
                                break;
                            case "2":
                                a = 6;
                                break;
                        }
                    case "test":
                        break;
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                switch (x) {
                        case "foo":
                            a();
                            break;
                        case "bar":
                            switch (y) {
                                    case "1":
                                        break;
                                    case "2":
                                        a = 6;
                                        break;
                            }
                        case "test":
                            break;
                }
            `,
			options: [4, { SwitchCase: 2 }],
		},
		unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                switch(x){
                case '1':
                    break;
                case '2':
                    a = 6;
                    break;
                }
            }
        `,
		unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                if(x){
                    a = 2;
                }
                else{
                    a = 6;
                }
            }
        `,
		unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                if(x){
                    a = 2;
                }
                else
                    a = 6;
            }
        `,
		unIndent`
            switch (a) {
            case "foo":
                a();
                break;
            case "bar":
                a(); break;
            case "baz":
                a(); break;
            }
        `,
		unIndent`
            switch (0) {
            }
        `,
		unIndent`
            function foo() {
                var a = "a";
                switch(a) {
                case "a":
                    return "A";
                case "b":
                    return "B";
                }
            }
            foo();
        `,
		{
			code: unIndent`
                switch(value){
                    case "1":
                    case "2":
                        a();
                        break;
                    default:
                        a();
                        break;
                }
                switch(value){
                    case "1":
                        a();
                        break;
                    case "2":
                        break;
                    default:
                        break;
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		unIndent`
            var obj = {foo: 1, bar: 2};
            with (obj) {
                console.log(foo + bar);
            }
        `,
		unIndent`
            if (a) {
                (1 + 2 + 3); // no error on this line
            }
        `,
		"switch(value){ default: a(); break; }",
		{
			code: unIndent`
                import {addons} from 'react/addons'
                import React from 'react'
            `,
			options: [2],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import {
                    foo,
                    bar,
                    baz
                } from 'qux';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                var foo = 0, bar = 0; baz = 0;
                export {
                    foo,
                    bar,
                    baz
                } from 'qux';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                var a = 1,
                    b = 2,
                    c = 3;
            `,
			options: [4],
		},
		{
			code: unIndent`
                var a = 1
                    ,b = 2
                    ,c = 3;
            `,
			options: [4],
		},
		{
			code: "while (1 < 2) console.log('hi')",
			options: [2],
		},
		{
			code: unIndent`
                function salutation () {
                  switch (1) {
                    case 0: return console.log('hi')
                    case 1: return console.log('hey')
                  }
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var items = [
                  {
                    foo: 'bar'
                  }
                ];
            `,
			options: [2, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                const a = 1,
                      b = 2;
                const items1 = [
                  {
                    foo: 'bar'
                  }
                ];
                const items2 = Items(
                  {
                    foo: 'bar'
                  }
                );
            `,
			options: [2, { VariableDeclarator: 3 }],
		},
		{
			code: unIndent`
                const geometry = 2,
                      rotate = 3;
                var a = 1,
                  b = 2;
                let light = true,
                    shadow = false;
            `,
			options: [2, { VariableDeclarator: { const: 3, let: 2 } }],
		},
		{
			code: unIndent`
                const abc = 5,
                      c = 2,
                      xyz =
                      {
                        a: 1,
                        b: 2
                      };
                let abc2 = 5,
                  c2 = 2,
                  xyz2 =
                  {
                    a: 1,
                    b: 2
                  };
                var abc3 = 5,
                    c3 = 2,
                    xyz3 =
                    {
                      a: 1,
                      b: 2
                    };
            `,
			options: [
				2,
				{ VariableDeclarator: { var: 2, const: 3 }, SwitchCase: 1 },
			],
		},
		{
			code: unIndent`
                module.exports = {
                  'Unit tests':
                  {
                    rootPath: './',
                    environment: 'node',
                    tests:
                    [
                      'test/test-*.js'
                    ],
                    sources:
                    [
                      '*.js',
                      'test/**.js'
                    ]
                  }
                };
            `,
			options: [2],
		},
		{
			code: unIndent`
                foo =
                  bar;
            `,
			options: [2],
		},
		{
			code: unIndent`
                foo = (
                  bar
                );
            `,
			options: [2],
		},
		{
			code: unIndent`
                var path     = require('path')
                  , crypto    = require('crypto')
                  ;
            `,
			options: [2],
		},
		unIndent`
            var a = 1
                ,b = 2
                ;
        `,
		{
			code: unIndent`
                export function create (some,
                                        argument) {
                  return Object.create({
                    a: some,
                    b: argument
                  });
                };
            `,
			options: [2, { FunctionDeclaration: { parameters: "first" } }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                export function create (id, xfilter, rawType,
                                        width=defaultWidth, height=defaultHeight,
                                        footerHeight=defaultFooterHeight,
                                        padding=defaultPadding) {
                  // ... function body, indented two spaces
                }
            `,
			options: [2, { FunctionDeclaration: { parameters: "first" } }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                var obj = {
                  foo: function () {
                    return new p()
                      .then(function (ok) {
                        return ok;
                      }, function () {
                        // ignore things
                      });
                  }
                };
            `,
			options: [2],
		},
		{
			code: unIndent`
                a.b()
                  .c(function(){
                    var a;
                  }).d.e;
            `,
			options: [2],
		},
		{
			code: unIndent`
                const YO = 'bah',
                      TE = 'mah'

                var res,
                    a = 5,
                    b = 4
            `,
			options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
		},
		{
			code: unIndent`
                const YO = 'bah',
                      TE = 'mah'

                var res,
                    a = 5,
                    b = 4

                if (YO) console.log(TE)
            `,
			options: [2, { VariableDeclarator: { var: 2, let: 2, const: 3 } }],
		},
		{
			code: unIndent`
                var foo = 'foo',
                  bar = 'bar',
                  baz = function() {

                  }

                function hello () {

                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                var obj = {
                  send: function () {
                    return P.resolve({
                      type: 'POST'
                    })
                      .then(function () {
                        return true;
                      }, function () {
                        return false;
                      });
                  }
                };
            `,
			options: [2],
		},
		{
			code: unIndent`
                var obj = {
                  send: function () {
                    return P.resolve({
                      type: 'POST'
                    })
                    .then(function () {
                      return true;
                    }, function () {
                      return false;
                    });
                  }
                };
            `,
			options: [2, { MemberExpression: 0 }],
		},
		unIndent`
            const someOtherFunction = argument => {
                    console.log(argument);
                },
                someOtherValue = 'someOtherValue';
        `,
		{
			code: unIndent`
                [
                  'a',
                  'b'
                ].sort().should.deepEqual([
                  'x',
                  'y'
                ]);
            `,
			options: [2],
		},
		{
			code: unIndent`
                var a = 1,
                    B = class {
                      constructor(){}
                      a(){}
                      get b(){}
                    };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = 1,
                    B =
                    class {
                      constructor(){}
                      a(){}
                      get b(){}
                    },
                    c = 3;
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                class A{
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var A = class {
                    constructor(){}
                    a(){}
                    get b(){}
                }
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = {
                  some: 1
                  , name: 2
                };
            `,
			options: [2],
		},
		{
			code: unIndent`
                a.c = {
                    aa: function() {
                        'test1';
                        return 'aa';
                    }
                    , bb: function() {
                        return this.bb();
                    }
                };
            `,
			options: [4],
		},
		{
			code: unIndent`
                var a =
                {
                    actions:
                    [
                        {
                            name: 'compile'
                        }
                    ]
                };
            `,
			options: [4, { VariableDeclarator: 0, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a =
                [
                    {
                        name: 'compile'
                    }
                ];
            `,
			options: [4, { VariableDeclarator: 0, SwitchCase: 1 }],
		},
		unIndent`
            [[
            ], function(
                foo
            ) {}
            ]
        `,
		unIndent`
            define([
                'foo'
            ], function(
                bar
            ) {
                baz;
            }
            )
        `,
		{
			code: unIndent`
                const func = function (opts) {
                    return Promise.resolve()
                    .then(() => {
                        [
                            'ONE', 'TWO'
                        ].forEach(command => { doSomething(); });
                    });
                };
            `,
			options: [4, { MemberExpression: 0 }],
		},
		{
			code: unIndent`
                const func = function (opts) {
                    return Promise.resolve()
                        .then(() => {
                            [
                                'ONE', 'TWO'
                            ].forEach(command => { doSomething(); });
                        });
                };
            `,
			options: [4],
		},
		{
			code: unIndent`
                var haveFun = function () {
                    SillyFunction(
                        {
                            value: true,
                        },
                        {
                            _id: true,
                        }
                    );
                };
            `,
			options: [4],
		},
		{
			code: unIndent`
                var haveFun = function () {
                    new SillyFunction(
                        {
                            value: true,
                        },
                        {
                            _id: true,
                        }
                    );
                };
            `,
			options: [4],
		},
		{
			code: unIndent`
                let object1 = {
                  doThing() {
                    return _.chain([])
                      .map(v => (
                        {
                          value: true,
                        }
                      ))
                      .value();
                  }
                };
            `,
			options: [2],
		},
		{
			code: unIndent`
                var foo = {
                    bar: 1,
                    baz: {
                      qux: 2
                    }
                  },
                  bar = 1;
            `,
			options: [2],
		},
		{
			code: unIndent`
                class Foo
                  extends Bar {
                  baz() {}
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                class Foo extends
                  Bar {
                  baz() {}
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                class Foo extends
                  (
                    Bar
                  ) {
                  baz() {}
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                fs.readdirSync(path.join(__dirname, '../rules')).forEach(name => {
                  files[name] = foo;
                });
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                (function(){
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                (function(){
                        function foo(x) {
                            return x + 1;
                        }
                })();
            `,
			options: [4, { outerIIFEBody: 2 }],
		},
		{
			code: unIndent`
                (function(x, y){
                function foo(x) {
                  return x + 1;
                }
                })(1, 2);
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                (function(){
                function foo(x) {
                  return x + 1;
                }
                }());
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                !function(){
                function foo(x) {
                  return x + 1;
                }
                }();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                !function(){
                \t\t\tfunction foo(x) {
                \t\t\t\treturn x + 1;
                \t\t\t}
                }();
            `,
			options: ["tab", { outerIIFEBody: 3 }],
		},
		{
			code: unIndent`
                var out = function(){
                  function fooVar(x) {
                    return x + 1;
                  }
                };
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                var ns = function(){
                function fooVar(x) {
                  return x + 1;
                }
                }();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                ns = function(){
                function fooVar(x) {
                  return x + 1;
                }
                }();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                var ns = (function(){
                function fooVar(x) {
                  return x + 1;
                }
                }(x));
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                var ns = (function(){
                        function fooVar(x) {
                            return x + 1;
                        }
                }(x));
            `,
			options: [4, { outerIIFEBody: 2 }],
		},
		{
			code: unIndent`
                var obj = {
                  foo: function() {
                    return true;
                  }
                };
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                while (
                  function() {
                    return true;
                  }()) {

                  x = x + 1;
                };
            `,
			options: [2, { outerIIFEBody: 20 }],
		},
		{
			code: unIndent`
                (() => {
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                function foo() {
                }
            `,
			options: ["tab", { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                ;(() => {
                function foo(x) {
                  return x + 1;
                }
                })();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                if(data) {
                  console.log('hi');
                }
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                (function(x) {
                    return x + 1;
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                (function(x) {
                return x + 1;
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                ;(() => {
                    function x(y) {
                        return y + 1;
                    }
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                ;(() => {
                function x(y) {
                    return y + 1;
                }
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                function foo() {
                }
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: "Buffer.length",
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer
                    .indexOf('a')
                    .toString()
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer.
                    length
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer
                    .foo
                    .bar
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer
                \t.foo
                \t.bar
            `,
			options: ["tab", { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer
                    .foo
                    .bar
            `,
			options: [2, { MemberExpression: 2 }],
		},
		unIndent`
            (
                foo
                    .bar
            )
        `,
		unIndent`
            (
                (
                    foo
                        .bar
                )
            )
        `,
		unIndent`
            (
                foo
            )
                .bar
        `,
		unIndent`
            (
                (
                    foo
                )
                    .bar
            )
        `,
		unIndent`
            (
                (
                    foo
                )
                    [
                        (
                            bar
                        )
                    ]
            )
        `,
		unIndent`
            (
                foo[bar]
            )
                .baz
        `,
		unIndent`
            (
                (foo.bar)
            )
                .baz
        `,
		{
			code: unIndent`
                MemberExpression
                .can
                  .be
                    .turned
                 .off();
            `,
			options: [4, { MemberExpression: "off" }],
		},
		{
			code: unIndent`
                foo = bar.baz()
                    .bip();
            `,
			options: [4, { MemberExpression: 1 }],
		},
		unIndent`
            function foo() {
                new
                    .target
            }
        `,
		unIndent`
            function foo() {
                new.
                    target
            }
        `,
		{
			code: unIndent`
                if (foo) {
                  bar();
                } else if (baz) {
                  foobar();
                } else if (qux) {
                  qux();
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo(aaa,
                  bbb, ccc, ddd) {
                    bar();
                }
            `,
			options: [2, { FunctionDeclaration: { parameters: 1, body: 2 } }],
		},
		{
			code: unIndent`
                function foo(aaa, bbb,
                      ccc, ddd) {
                  bar();
                }
            `,
			options: [2, { FunctionDeclaration: { parameters: 3, body: 1 } }],
		},
		{
			code: unIndent`
                function foo(aaa,
                    bbb,
                    ccc) {
                            bar();
                }
            `,
			options: [4, { FunctionDeclaration: { parameters: 1, body: 3 } }],
		},
		{
			code: unIndent`
                function foo(aaa,
                             bbb, ccc,
                             ddd, eee, fff) {
                  bar();
                }
            `,
			options: [
				2,
				{ FunctionDeclaration: { parameters: "first", body: 1 } },
			],
		},
		{
			code: unIndent`
                function foo(aaa, bbb)
                {
                      bar();
                }
            `,
			options: [2, { FunctionDeclaration: { body: 3 } }],
		},
		{
			code: unIndent`
                function foo(
                  aaa,
                  bbb) {
                    bar();
                }
            `,
			options: [
				2,
				{ FunctionDeclaration: { parameters: "first", body: 2 } },
			],
		},
		{
			code: unIndent`
                var foo = function(aaa,
                    bbb,
                    ccc,
                    ddd) {
                bar();
                }
            `,
			options: [2, { FunctionExpression: { parameters: 2, body: 0 } }],
		},
		{
			code: unIndent`
                var foo = function(aaa,
                  bbb,
                  ccc) {
                                    bar();
                }
            `,
			options: [2, { FunctionExpression: { parameters: 1, body: 10 } }],
		},
		{
			code: unIndent`
                var foo = function(aaa,
                                   bbb, ccc, ddd,
                                   eee, fff) {
                    bar();
                }
            `,
			options: [
				4,
				{ FunctionExpression: { parameters: "first", body: 1 } },
			],
		},
		{
			code: unIndent`
                var foo = function(
                  aaa, bbb, ccc,
                  ddd, eee) {
                      bar();
                }
            `,
			options: [
				2,
				{ FunctionExpression: { parameters: "first", body: 3 } },
			],
		},
		{
			code: unIndent`
                foo.bar(
                      baz, qux, function() {
                            qux;
                      }
                );
            `,
			options: [
				2,
				{
					FunctionExpression: { body: 3 },
					CallExpression: { arguments: 3 },
				},
			],
		},
		{
			code: unIndent`
                function foo() {
                  bar();
                  \tbaz();
                \t   \t\t\t  \t\t\t  \t   \tqux();
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  function bar() {
                    baz();
                  }
                }
            `,
			options: [2, { FunctionDeclaration: { body: 1 } }],
		},
		{
			code: unIndent`
                function foo() {
                  bar();
                   \t\t}
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  function bar(baz,
                      qux) {
                    foobar();
                  }
                }
            `,
			options: [2, { FunctionDeclaration: { body: 1, parameters: 2 } }],
		},
		{
			code: unIndent`
                ((
                    foo
                ))
            `,
			options: [4],
		},

		// ternary expressions (https://github.com/eslint/eslint/issues/7420)
		{
			code: unIndent`
                foo
                  ? bar
                  : baz
            `,
			options: [2],
		},
		{
			code: unIndent`
                foo = (bar ?
                  baz :
                  qux
                );
            `,
			options: [2],
		},
		{
			code: unIndent`
              condition
                ? () => {
                  return true
                }
                : condition2
                  ? () => {
                    return true
                  }
                  : () => {
                    return false
                  }
            `,
			options: [2],
		},
		{
			code: unIndent`
              condition
                ? () => {
                  return true
                }
                : condition2
                  ? () => {
                    return true
                  }
                  : () => {
                    return false
                  }
            `,
			options: [2, { offsetTernaryExpressions: false }],
		},
		{
			code: unIndent`
              condition
                ? () => {
                    return true
                  }
                : condition2
                  ? () => {
                      return true
                    }
                  : () => {
                      return false
                    }
            `,
			options: [2, { offsetTernaryExpressions: true }],
		},
		{
			code: unIndent`
              condition
                  ? () => {
                          return true
                      }
                  : condition2
                      ? () => {
                              return true
                          }
                      : () => {
                              return false
                          }
            `,
			options: [4, { offsetTernaryExpressions: true }],
		},
		{
			code: unIndent`
              condition1
                ? condition2
                  ? Promise.resolve(1)
                  : Promise.resolve(2)
                : Promise.resolve(3)
            `,
			options: [2, { offsetTernaryExpressions: true }],
		},
		{
			code: unIndent`
              condition1
                ? Promise.resolve(1)
                : condition2
                  ? Promise.resolve(2)
                  : Promise.resolve(3)
            `,
			options: [2, { offsetTernaryExpressions: true }],
		},
		{
			code: unIndent`
              condition
              \t? () => {
              \t\t\treturn true
              \t\t}
              \t: condition2
              \t\t? () => {
              \t\t\t\treturn true
              \t\t\t}
              \t\t: () => {
              \t\t\t\treturn false
              \t\t\t}
            `,
			options: ["tab", { offsetTernaryExpressions: true }],
		},
		unIndent`
            [
                foo ?
                    bar :
                    baz,
                qux
            ];
        `,
		{
			/*
			 * Checking comments:
			 * https://github.com/eslint/eslint/issues/3845, https://github.com/eslint/eslint/issues/6571
			 */
			code: unIndent`
                foo();
                // Line
                /* multiline
                  Line */
                bar();
                // trailing comment
            `,
			options: [2],
		},
		{
			code: unIndent`
                switch (foo) {
                  case bar:
                    baz();
                    // call the baz function
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                switch (foo) {
                  case bar:
                    baz();
                  // no default
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},
		unIndent`
            [
                // no elements
            ]
        `,
		{
			/*
			 * Destructuring assignments:
			 * https://github.com/eslint/eslint/issues/6813
			 */
			code: unIndent`
                var {
                  foo,
                  bar,
                  baz: qux,
                  foobar: baz = foobar
                } = qux;
            `,
			options: [2],
		},
		{
			code: unIndent`
                var [
                  foo,
                  bar,
                  baz,
                  foobar = baz
                ] = qux;
            `,
			options: [2],
		},
		{
			code: unIndent`
                const {
                  a
                }
                =
                {
                  a: 1
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                const {
                  a
                } = {
                  a: 1
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                const
                  {
                    a
                  } = {
                    a: 1
                  };
            `,
			options: [2],
		},
		{
			code: unIndent`
                const
                  foo = {
                    bar: 1
                  }
            `,
			options: [2],
		},
		{
			code: unIndent`
                const [
                  a
                ] = [
                  1
                ]
            `,
			options: [2],
		},
		{
			// https://github.com/eslint/eslint/issues/7233
			code: unIndent`
                var folder = filePath
                    .foo()
                    .bar;
            `,
			options: [2, { MemberExpression: 2 }],
		},
		{
			code: unIndent`
                for (const foo of bar)
                  baz();
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = () =>
                  5;
            `,
			options: [2],
		},
		unIndent`
            (
                foo
            )(
                bar
            )
        `,
		unIndent`
            (() =>
                foo
            )(
                bar
            )
        `,
		unIndent`
            (() => {
                foo();
            })(
                bar
            )
        `,
		{
			// Don't lint the indentation of the first token after a :
			code: unIndent`
                ({code:
                  "foo.bar();"})
            `,
			options: [2],
		},
		{
			// Don't lint the indentation of the first token after a :
			code: unIndent`
                ({code:
                "foo.bar();"})
            `,
			options: [2],
		},
		unIndent`
            ({
                foo:
                    bar
            })
        `,
		unIndent`
            ({
                [foo]:
                    bar
            })
        `,
		{
			// Comments in switch cases
			code: unIndent`
                switch (foo) {
                  // comment
                  case study:
                    // comment
                    bar();
                  case closed:
                    /* multiline comment
                    */
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			// Comments in switch cases
			code: unIndent`
                switch (foo) {
                  // comment
                  case study:
                  // the comment can also be here
                  case closed:
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			// BinaryExpressions with parens
			code: unIndent`
                foo && (
                    bar
                )
            `,
			options: [4],
		},
		{
			// BinaryExpressions with parens
			code: unIndent`
                foo && ((
                    bar
                ))
            `,
			options: [4],
		},
		{
			code: unIndent`
                foo &&
                    (
                        bar
                    )
            `,
			options: [4],
		},
		unIndent`
            foo &&
                !bar(
                )
        `,
		unIndent`
            foo &&
                ![].map(() => {
                    bar();
                })
        `,
		{
			code: unIndent`
                foo =
                    bar;
            `,
			options: [4],
		},
		{
			code: unIndent`
                function foo() {
                  var bar = function(baz,
                        qux) {
                    foobar();
                  };
                }
            `,
			options: [2, { FunctionExpression: { parameters: 3 } }],
		},
		unIndent`
            function foo() {
                return (bar === 1 || bar === 2 &&
                    (/Function/.test(grandparent.type))) &&
                    directives(parent).indexOf(node) >= 0;
            }
        `,
		{
			code: unIndent`
                function foo() {
                    return (foo === bar || (
                        baz === qux && (
                            foo === foo ||
                            bar === bar ||
                            baz === baz
                        )
                    ))
                }
            `,
			options: [4],
		},
		unIndent`
            if (
                foo === 1 ||
                bar === 1 ||
                // comment
                (baz === 1 && qux === 1)
            ) {}
        `,
		{
			code: unIndent`
                foo =
                  (bar + baz);
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  return (bar === 1 || bar === 2) &&
                    (z === 3 || z === 4);
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                /* comment */ if (foo) {
                  bar();
                }
            `,
			options: [2],
		},
		{
			// Comments at the end of if blocks that have `else` blocks can either refer to the lines above or below them
			code: unIndent`
                if (foo) {
                  bar();
                // Otherwise, if foo is false, do baz.
                // baz is very important.
                } else {
                  baz();
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  return ((bar === 1 || bar === 2) &&
                    (z === 3 || z === 4));
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                foo(
                  bar,
                  baz,
                  qux
                );
            `,
			options: [2, { CallExpression: { arguments: 1 } }],
		},
		{
			code: unIndent`
                foo(
                \tbar,
                \tbaz,
                \tqux
                );
            `,
			options: ["tab", { CallExpression: { arguments: 1 } }],
		},
		{
			code: unIndent`
                foo(bar,
                        baz,
                        qux);
            `,
			options: [4, { CallExpression: { arguments: 2 } }],
		},
		{
			code: unIndent`
                foo(
                bar,
                baz,
                qux
                );
            `,
			options: [2, { CallExpression: { arguments: 0 } }],
		},
		{
			code: unIndent`
                foo(bar,
                    baz,
                    qux
                );
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                foo(bar, baz,
                    qux, barbaz,
                    barqux, bazqux);
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                foo(bar,
                        1 + 2,
                        !baz,
                        new Car('!')
                );
            `,
			options: [2, { CallExpression: { arguments: 4 } }],
		},
		unIndent`
            foo(
                (bar)
            );
        `,
		{
			code: unIndent`
                foo(
                    (bar)
                );
            `,
			options: [4, { CallExpression: { arguments: 1 } }],
		},

		// https://github.com/eslint/eslint/issues/7484
		{
			code: unIndent`
                var foo = function() {
                  return bar(
                    [{
                    }].concat(baz)
                  );
                };
            `,
			options: [2],
		},

		// https://github.com/eslint/eslint/issues/7573
		{
			code: unIndent`
                return (
                    foo
                );
            `,
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: unIndent`
                return (
                    foo
                )
            `,
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		unIndent`
            var foo = [
                bar,
                baz
            ]
        `,
		unIndent`
            var foo = [bar,
                baz,
                qux
            ]
        `,
		{
			code: unIndent`
                var foo = [bar,
                baz,
                qux
                ]
            `,
			options: [2, { ArrayExpression: 0 }],
		},
		{
			code: unIndent`
                var foo = [bar,
                                baz,
                                qux
                ]
            `,
			options: [2, { ArrayExpression: 8 }],
		},
		{
			code: unIndent`
                var foo = [bar,
                           baz,
                           qux
                ]
            `,
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = [bar,
                           baz, qux
                ]
            `,
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = [
                        { bar: 1,
                          baz: 2 },
                        { bar: 3,
                          baz: 4 }
                ]
            `,
			options: [4, { ArrayExpression: 2, ObjectExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = {
                bar: 1,
                baz: 2
                };
            `,
			options: [2, { ObjectExpression: 0 }],
		},
		{
			code: unIndent`
                var foo = { foo: 1, bar: 2,
                            baz: 3 }
            `,
			options: [2, { ObjectExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = [
                        {
                            foo: 1
                        }
                ]
            `,
			options: [4, { ArrayExpression: 2 }],
		},
		{
			code: unIndent`
                function foo() {
                  [
                          foo
                  ]
                }
            `,
			options: [2, { ArrayExpression: 4 }],
		},
		{
			code: "[\n]",
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: "[\n]",
			options: [2, { ArrayExpression: 1 }],
		},
		{
			code: "{\n}",
			options: [2, { ObjectExpression: "first" }],
		},
		{
			code: "{\n}",
			options: [2, { ObjectExpression: 1 }],
		},
		{
			code: unIndent`
                var foo = [
                  [
                    1
                  ]
                ]
            `,
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = [ 1,
                            [
                              2
                            ]
                ];
            `,
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = bar(1,
                              [ 2,
                                3
                              ]
                );
            `,
			options: [
				4,
				{
					ArrayExpression: "first",
					CallExpression: { arguments: "first" },
				},
			],
		},
		{
			code: unIndent`
                var foo =
                    [
                    ]()
            `,
			options: [
				4,
				{
					CallExpression: { arguments: "first" },
					ArrayExpression: "first",
				},
			],
		},

		// https://github.com/eslint/eslint/issues/7732
		{
			code: unIndent`
                const lambda = foo => {
                  Object.assign({},
                    filterName,
                    {
                      display
                    }
                  );
                }
            `,
			options: [2, { ObjectExpression: 1 }],
		},
		{
			code: unIndent`
                const lambda = foo => {
                  Object.assign({},
                    filterName,
                    {
                      display
                    }
                  );
                }
            `,
			options: [2, { ObjectExpression: "first" }],
		},

		// https://github.com/eslint/eslint/issues/7733
		{
			code: unIndent`
                var foo = function() {
                \twindow.foo('foo',
                \t\t{
                \t\t\tfoo: 'bar',
                \t\t\tbar: {
                \t\t\t\tfoo: 'bar'
                \t\t\t}
                \t\t}
                \t);
                }
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                echo = spawn('cmd.exe',
                             ['foo', 'bar',
                              'baz']);
            `,
			options: [
				2,
				{
					ArrayExpression: "first",
					CallExpression: { arguments: "first" },
				},
			],
		},
		{
			code: unIndent`
                if (foo)
                  bar();
                // Otherwise, if foo is false, do baz.
                // baz is very important.
                else {
                  baz();
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                if (
                    foo && bar ||
                    baz && qux // This line is ignored because BinaryExpressions are not checked.
                ) {
                    qux();
                }
            `,
			options: [4],
		},
		unIndent`
            [
            ] || [
            ]
        `,
		unIndent`
            (
                [
                ] || [
                ]
            )
        `,
		unIndent`
            1
            + (
                1
            )
        `,
		unIndent`
            (
                foo && (
                    bar ||
                    baz
                )
            )
        `,
		unIndent`
            foo
                || (
                    bar
                )
        `,
		unIndent`
            foo
                            || (
                                bar
                            )
        `,
		{
			code: unIndent`
                var foo =
                        1;
            `,
			options: [4, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                var foo = 1,
                    bar =
                    2;
            `,
			options: [4],
		},
		{
			code: unIndent`
                switch (foo) {
                  case bar:
                  {
                    baz();
                  }
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},

		// Template curlies
		{
			code: unIndent`
                \`foo\${
                  bar}\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                \`foo\${
                  \`bar\${
                    baz}\`}\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                \`foo\${
                  \`bar\${
                    baz
                  }\`
                }\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                \`foo\${
                  (
                    bar
                  )
                }\`
            `,
			options: [2],
		},
		unIndent`
            foo(\`
                bar
            \`, {
                baz: 1
            });
        `,
		unIndent`
            function foo() {
                \`foo\${bar}baz\${
                    qux}foo\${
                    bar}baz\`
            }
        `,
		unIndent`
            JSON
                .stringify(
                    {
                        ok: true
                    }
                );
        `,

		// Don't check AssignmentExpression assignments
		unIndent`
            foo =
                bar =
                baz;
        `,
		unIndent`
            foo =
            bar =
                baz;
        `,
		unIndent`
            function foo() {
                const template = \`this indentation is not checked
            because it's part of a template literal.\`;
            }
        `,
		unIndent`
                function foo() {
                    const template = \`the indentation of a \${
                        node.type
                    } node is checked.\`;
                }
            `,
		{
			// https://github.com/eslint/eslint/issues/7320
			code: unIndent`
                JSON
                    .stringify(
                        {
                            test: 'test'
                        }
                    );
            `,
			options: [4, { CallExpression: { arguments: 1 } }],
		},
		unIndent`
            [
                foo,
                // comment
                // another comment
                bar
            ]
        `,
		unIndent`
            if (foo) {
                /* comment */ bar();
            }
        `,
		unIndent`
            function foo() {
                return (
                    1
                );
            }
        `,
		unIndent`
            function foo() {
                return (
                    1
                )
            }
        `,
		unIndent`
            if (
                foo &&
                !(
                    bar
                )
            ) {}
        `,
		{
			// https://github.com/eslint/eslint/issues/6007
			code: unIndent`
                var abc = [
                  (
                    ''
                  ),
                  def,
                ]
            `,
			options: [2],
		},
		{
			code: unIndent`
                var abc = [
                  (
                    ''
                  ),
                  (
                    'bar'
                  )
                ]
            `,
			options: [2],
		},
		unIndent`
            function f() {
                return asyncCall()
                    .then(
                        'some string',
                        [
                            1,
                            2,
                            3
                        ]
                    );
            }
        `,
		{
			// https://github.com/eslint/eslint/issues/6670
			code: unIndent`
                function f() {
                    return asyncCall()
                        .then(
                            'some string',
                            [
                                1,
                                2,
                                3
                            ]
                        );
                }
            `,
			options: [4, { MemberExpression: 1 }],
		},

		// https://github.com/eslint/eslint/issues/7242
		unIndent`
            var x = [
                [1],
                [2]
            ]
        `,
		unIndent`
            var y = [
                {a: 1},
                {b: 2}
            ]
        `,
		unIndent`
            foo(
            )
        `,
		{
			// https://github.com/eslint/eslint/issues/7616
			code: unIndent`
                foo(
                    bar,
                    {
                        baz: 1
                    }
                )
            `,
			options: [4, { CallExpression: { arguments: "first" } }],
		},
		"new Foo",
		"new (Foo)",
		unIndent`
            if (Foo) {
                new Foo
            }
        `,
		{
			code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                    foo,
                    bar,
                    baz
                }
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                foo
                    ? bar
                    : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ?
                    bar :
                    baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ?
                    bar
                    : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo
                    ? bar :
                    baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo
                    ? bar
                    : baz
                        ? qux
                        : foobar
                            ? boop
                            : beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ?
                    bar :
                    baz ?
                        qux :
                        foobar ?
                            boop :
                            beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                var a =
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                var a = foo
                    ? bar
                    : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                var a =
                    foo
                        ? bar
                        : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                a =
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                a = foo
                    ? bar
                    : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                a =
                    foo
                        ? bar
                        : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo(
                    foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    /*else*/ beep
                )
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                function wrap() {
                    return (
                        foo ? bar :
                        baz ? qux :
                        foobar ? boop :
                        /*else*/ beep
                    )
                }
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                function wrap() {
                    return foo
                        ? bar
                        : baz
                }
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                function wrap() {
                    return (
                        foo
                            ? bar
                            : baz
                    )
                }
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo(
                    foo
                        ? bar
                        : baz
                )
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo(foo
                    ? bar
                    : baz
                )
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo
                    ? bar
                    : baz
                        ? qux
                        : foobar
                            ? boop
                            : beep
            `,
			options: [4, { flatTernaryExpressions: false }],
		},
		{
			code: unIndent`
                foo ?
                    bar :
                    baz ?
                        qux :
                        foobar ?
                            boop :
                            beep
            `,
			options: [4, { flatTernaryExpressions: false }],
		},
		{
			code: "[,]",
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: "[,]",
			options: [2, { ArrayExpression: "off" }],
		},
		{
			code: unIndent`
                [
                    ,
                    foo
                ]
            `,
			options: [4, { ArrayExpression: "first" }],
		},
		{
			code: "[sparse, , array];",
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                foo.bar('baz', function(err) {
                  qux;
                });
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                foo.bar(function() {
                  cookies;
                }).baz(function() {
                  cookies;
                });
            `,
			options: [2, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                foo.bar().baz(function() {
                  cookies;
                }).qux(function() {
                  cookies;
                });
            `,
			options: [2, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                (
                  {
                    foo: 1,
                    baz: 2
                  }
                );
            `,
			options: [2, { ObjectExpression: "first" }],
		},
		{
			code: unIndent`
                foo(() => {
                    bar;
                }, () => {
                    baz;
                })
            `,
			options: [4, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                [ foo,
                  bar ].forEach(function() {
                  baz;
                })
            `,
			options: [2, { ArrayExpression: "first", MemberExpression: 1 }],
		},
		unIndent`
            foo = bar[
                baz
            ];
        `,
		{
			code: unIndent`
                foo[
                    bar
                ];
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                foo[
                    (
                        bar
                    )
                ];
            `,
			options: [4, { MemberExpression: 1 }],
		},
		unIndent`
            if (foo)
                bar;
            else if (baz)
                qux;
        `,
		unIndent`
            if (foo) bar()

            ; [1, 2, 3].map(baz)
        `,
		unIndent`
            if (foo)
                ;
        `,
		"x => {}",
		{
			code: unIndent`
                import {foo}
                    from 'bar';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import 'foo'",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import { foo,
                    bar,
                    baz,
                } from 'qux';
            `,
			options: [4, { ImportDeclaration: 1 }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import {
                    foo,
                    bar,
                    baz,
                } from 'qux';
            `,
			options: [4, { ImportDeclaration: 1 }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import { apple as a,
                         banana as b } from 'fruits';
                import { cat } from 'animals';
            `,
			options: [4, { ImportDeclaration: "first" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import { declaration,
                                 can,
                                  be,
                              turned } from 'off';
            `,
			options: [4, { ImportDeclaration: "off" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/8455
		unIndent`
            (
                a
            ) => b => {
                c
            }
        `,
		unIndent`
            (
                a
            ) => b => c => d => {
                e
            }
        `,
		unIndent`
            (
                a
            ) =>
                (
                    b
                ) => {
                    c
                }
        `,
		unIndent`
            if (
                foo
            ) bar(
                baz
            );
        `,
		unIndent`
            if (foo)
            {
                bar();
            }
        `,
		unIndent`
            function foo(bar)
            {
                baz();
            }
        `,
		unIndent`
            () =>
                ({})
        `,
		unIndent`
            () =>
                (({}))
        `,
		unIndent`
            (
                () =>
                    ({})
            )
        `,
		unIndent`
            var x = function foop(bar)
            {
                baz();
            }
        `,
		unIndent`
            var x = (bar) =>
            {
                baz();
            }
        `,
		unIndent`
            class Foo
            {
                constructor()
                {
                    foo();
                }

                bar()
                {
                    baz();
                }
            }
        `,
		unIndent`
            class Foo
                extends Bar
            {
                constructor()
                {
                    foo();
                }

                bar()
                {
                    baz();
                }
            }
        `,
		unIndent`
            (
                class Foo
                {
                    constructor()
                    {
                        foo();
                    }

                    bar()
                    {
                        baz();
                    }
                }
            )
        `,
		{
			code: unIndent`
                switch (foo)
                {
                    case 1:
                        bar();
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		unIndent`
            foo
                .bar(function() {
                    baz
                })
        `,
		{
			code: unIndent`
                foo
                        .bar(function() {
                            baz
                        })
            `,
			options: [4, { MemberExpression: 2 }],
		},
		unIndent`
            foo
                [bar](function() {
                    baz
                })
        `,
		unIndent`
            foo.
                bar.
                baz
        `,
		{
			code: unIndent`
                foo
                    .bar(function() {
                        baz
                    })
            `,
			options: [4, { MemberExpression: "off" }],
		},
		{
			code: unIndent`
                foo
                                .bar(function() {
                                    baz
                                })
            `,
			options: [4, { MemberExpression: "off" }],
		},
		{
			code: unIndent`
                foo
                                [bar](function() {
                                    baz
                                })
            `,
			options: [4, { MemberExpression: "off" }],
		},
		{
			code: unIndent`
                  foo.
                          bar.
                                      baz
            `,
			options: [4, { MemberExpression: "off" }],
		},
		{
			code: unIndent`
                  foo = bar(
                  ).baz(
                  )
            `,
			options: [4, { MemberExpression: "off" }],
		},
		{
			code: unIndent`
                foo[
                    bar ? baz :
                    qux
                ]
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                function foo() {
                    return foo ? bar :
                        baz
                }
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                throw foo ? bar :
                    baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo(
                    bar
                ) ? baz :
                    qux
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		unIndent`
                foo
                    [
                        bar
                    ]
                    .baz(function() {
                        quz();
                    })
        `,
		unIndent`
                [
                    foo
                ][
                    "map"](function() {
                    qux();
                })
        `,
		unIndent`
            (
                a.b(function() {
                    c;
                })
            )
        `,
		unIndent`
            (
                foo
            ).bar(function() {
                baz();
            })
        `,
		unIndent`
            new Foo(
                bar
                    .baz
                    .qux
            )
        `,
		unIndent`
            const foo = a.b(),
                longName =
                    (baz(
                        'bar',
                        'bar'
                    ));
        `,
		unIndent`
            const foo = a.b(),
                longName =
                (baz(
                    'bar',
                    'bar'
                ));
        `,
		unIndent`
            const foo = a.b(),
                longName =
                    baz(
                        'bar',
                        'bar'
                    );
        `,
		unIndent`
            const foo = a.b(),
                longName =
                baz(
                    'bar',
                    'bar'
                );
        `,
		unIndent`
            const foo = a.b(),
                longName
                    = baz(
                        'bar',
                        'bar'
                    );
        `,
		unIndent`
            const foo = a.b(),
                longName
                = baz(
                    'bar',
                    'bar'
                );
        `,
		unIndent`
            const foo = a.b(),
                longName =
                    ('fff');
        `,
		unIndent`
            const foo = a.b(),
                longName =
                ('fff');
        `,
		unIndent`
            const foo = a.b(),
                longName
                    = ('fff');

        `,
		unIndent`
            const foo = a.b(),
                longName
                = ('fff');

        `,
		unIndent`
            const foo = a.b(),
                longName =
                    (
                        'fff'
                    );
        `,
		unIndent`
            const foo = a.b(),
                longName =
                (
                    'fff'
                );
        `,
		unIndent`
            const foo = a.b(),
                longName
                    =(
                        'fff'
                    );
        `,
		unIndent`
            const foo = a.b(),
                longName
                =(
                    'fff'
                );
        `,

		//----------------------------------------------------------------------
		// Ignore Unknown Nodes
		//----------------------------------------------------------------------

		{
			code: unIndent`
                interface Foo {
                    bar: string;
                    baz: number;
                }
            `,
			languageOptions: {
				parser: require(parser("unknown-nodes/interface")),
			},
		},
		{
			code: unIndent`
                namespace Foo {
                    const bar = 3,
                        baz = 2;

                    if (true) {
                        const bax = 3;
                    }
                }
            `,
			languageOptions: {
				parser: require(parser("unknown-nodes/namespace-valid")),
			},
		},
		{
			code: unIndent`
                abstract class Foo {
                    public bar() {
                        let aaa = 4,
                            boo;

                        if (true) {
                            boo = 3;
                        }

                        boo = 3 + 2;
                    }
                }
            `,
			languageOptions: {
				parser: require(parser("unknown-nodes/abstract-class-valid")),
			},
		},
		{
			code: unIndent`
                function foo() {
                    function bar() {
                        abstract class X {
                            public baz() {
                                if (true) {
                                    qux();
                                }
                            }
                        }
                    }
                }
            `,
			languageOptions: {
				parser: require(
					parser("unknown-nodes/functions-with-abstract-class-valid"),
				),
			},
		},
		{
			code: unIndent`
                namespace Unknown {
                    function foo() {
                        function bar() {
                            abstract class X {
                                public baz() {
                                    if (true) {
                                        qux();
                                    }
                                }
                            }
                        }
                    }
                }
            `,
			languageOptions: {
				parser: require(
					parser(
						"unknown-nodes/namespace-with-functions-with-abstract-class-valid",
					),
				),
			},
		},
		{
			code: unIndent`
                type httpMethod = 'GET'
                  | 'POST'
                  | 'PUT';
            `,
			options: [2, { VariableDeclarator: 0 }],
			languageOptions: {
				parser: require(
					parser(
						"unknown-nodes/variable-declarator-type-indent-two-spaces",
					),
				),
			},
		},
		{
			code: unIndent`
                type httpMethod = 'GET'
                | 'POST'
                | 'PUT';
            `,
			options: [2, { VariableDeclarator: 1 }],
			languageOptions: {
				parser: require(
					parser("unknown-nodes/variable-declarator-type-no-indent"),
				),
			},
		},
		unIndent`
            foo(\`foo
                    \`, {
                ok: true
            },
            {
                ok: false
            })
        `,
		unIndent`
            foo(tag\`foo
                    \`, {
                ok: true
            },
            {
                ok: false
            }
            )
        `,

		// https://github.com/eslint/eslint/issues/8815
		unIndent`
            async function test() {
                const {
                    foo,
                    bar,
                } = await doSomethingAsync(
                    1,
                    2,
                    3,
                );
            }
        `,
		unIndent`
            function* test() {
                const {
                    foo,
                    bar,
                } = yield doSomethingAsync(
                    1,
                    2,
                    3,
                );
            }
        `,
		unIndent`
            ({
                a: b
            } = +foo(
                bar
            ));
        `,
		unIndent`
            const {
                foo,
                bar,
            } = typeof foo(
                1,
                2,
                3,
            );
        `,
		unIndent`
            const {
                foo,
                bar,
            } = +(
                foo
            );
        `,

		//----------------------------------------------------------------------
		// JSX tests
		// https://github.com/eslint/eslint/issues/8425
		// Some of the following tests are adapted from the tests in eslint-plugin-react.
		// License: https://github.com/yannickcr/eslint-plugin-react/blob/7ca9841f22d599f447a27ef5b2a97def9229d6c8/LICENSE
		//----------------------------------------------------------------------

		'<Foo a="b" c="d"/>;',
		unIndent`
            <Foo
                a="b"
                c="d"
            />;
        `,
		'var foo = <Bar a="b" c="d"/>;',
		unIndent`
            var foo = <Bar
                a="b"
                c="d"
            />;
        `,
		unIndent`
            var foo = (<Bar
                a="b"
                c="d"
            />);
        `,
		unIndent`
            var foo = (
                <Bar
                    a="b"
                    c="d"
                />
            );
        `,
		unIndent`
            <
                Foo
                a="b"
                c="d"
            />;
        `,
		unIndent`
            <Foo
                a="b"
                c="d"/>;
        `,
		unIndent`
            <
                Foo
                a="b"
                c="d"/>;
        `,
		'<a href="foo">bar</a>;',
		unIndent`
            <a href="foo">
                bar
            </a>;
        `,
		unIndent`
            <a
                href="foo"
            >
                bar
            </a>;
        `,
		unIndent`
            <a
                href="foo">
                bar
            </a>;
        `,
		unIndent`
            <
                a
                href="foo">
                bar
            </a>;
        `,
		unIndent`
            <a
                href="foo">
                bar
            </
                a>;
        `,
		unIndent`
            <a
                href="foo">
                bar
            </a
            >;
        `,
		unIndent`
                var foo = <a href="bar">
                    baz
                </a>;
            `,
		unIndent`
            var foo = <a
                href="bar"
            >
                baz
            </a>;
        `,
		unIndent`
            var foo = <a
                href="bar">
                baz
            </a>;
        `,
		unIndent`
            var foo = <
                a
                href="bar">
                baz
            </a>;
        `,
		unIndent`
            var foo = <a
                href="bar">
                baz
            </
                a>;
        `,
		unIndent`
            var foo = <a
                href="bar">
                baz
            </a
            >
        `,
		unIndent`
            var foo = (<a
                href="bar">
                baz
            </a>);
        `,
		unIndent`
            var foo = (
                <a href="bar">baz</a>
            );
        `,
		unIndent`
            var foo = (
                <a href="bar">
                    baz
                </a>
            );
        `,
		unIndent`
            var foo = (
                <a
                    href="bar">
                    baz
                </a>
            );
        `,
		'var foo = <a href="bar">baz</a>;',
		unIndent`
            <a>
                {
                }
            </a>
        `,
		unIndent`
            <a>
                {
                    foo
                }
            </a>
        `,
		unIndent`
            function foo() {
                return (
                    <a>
                        {
                            b.forEach(() => {
                                // comment
                                a = c
                                    .d()
                                    .e();
                            })
                        }
                    </a>
                );
            }
        `,
		"<App></App>",
		unIndent`
            <App>
            </App>
        `,
		{
			code: unIndent`
                <App>
                  <Foo />
                </App>
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App>
                <Foo />
                </App>
            `,
			options: [0],
		},
		{
			code: unIndent`
                <App>
                \t<Foo />
                </App>
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                function App() {
                  return <App>
                    <Foo />
                  </App>;
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function App() {
                  return (<App>
                    <Foo />
                  </App>);
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function App() {
                  return (
                    <App>
                      <Foo />
                    </App>
                  );
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                it(
                  (
                    <div>
                      <span />
                    </div>
                  )
                )
            `,
			options: [2],
		},
		{
			code: unIndent`
                it(
                  (<div>
                    <span />
                    <span />
                    <span />
                  </div>)
                )
            `,
			options: [2],
		},
		{
			code: unIndent`
                (
                  <div>
                    <span />
                  </div>
                )
            `,
			options: [2],
		},
		{
			code: unIndent`
                {
                  head.title &&
                  <h1>
                    {head.title}
                  </h1>
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                {
                  head.title &&
                    <h1>
                      {head.title}
                    </h1>
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                {
                  head.title && (
                    <h1>
                      {head.title}
                    </h1>)
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                {
                  head.title && (
                    <h1>
                      {head.title}
                    </h1>
                  )
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                [
                  <div />,
                  <div />
                ]
            `,
			options: [2],
		},
		unIndent`
            <div>
                {
                    [
                        <Foo />,
                        <Bar />
                    ]
                }
            </div>
        `,
		unIndent`
            <div>
                {foo &&
                    [
                        <Foo />,
                        <Bar />
                    ]
                }
            </div>
        `,
		unIndent`
            <div>
            bar <div>
                bar
                bar {foo}
            bar </div>
            </div>
        `,
		unIndent`
            foo ?
                <Foo /> :
                <Bar />
        `,
		unIndent`
            foo ?
                <Foo />
                : <Bar />
        `,
		unIndent`
            foo ?
                <Foo />
                :
                <Bar />
        `,
		unIndent`
            <div>
                {!foo ?
                    <Foo
                        onClick={this.onClick}
                    />
                    :
                    <Bar
                        onClick={this.onClick}
                    />
                }
            </div>
        `,
		{
			code: unIndent`
                <span>
                  {condition ?
                    <Thing
                      foo={\`bar\`}
                    /> :
                    <Thing/>
                  }
                </span>
            `,
			options: [2],
		},
		{
			code: unIndent`
                <span>
                  {condition ?
                    <Thing
                      foo={"bar"}
                    /> :
                    <Thing/>
                  }
                </span>
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  <span>
                    {condition ?
                      <Thing
                        foo={bar}
                      /> :
                      <Thing/>
                    }
                  </span>
                }
            `,
			options: [2],
		},
		unIndent`
              <App foo
              />
            `,
		{
			code: unIndent`
              <App
                foo
              />
            `,
			options: [2],
		},
		{
			code: unIndent`
              <App
              foo
              />
            `,
			options: [0],
		},
		unIndent`
                <App
                    foo
                />
            `,
		unIndent`
                <App
                    foo
                ></App>
            `,
		{
			code: unIndent`
                <App
                  foo={function() {
                    console.log('bar');
                  }}
                />
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App foo={function() {
                  console.log('bar');
                }}
                />
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = function() {
                  return <App
                    foo={function() {
                      console.log('bar');
                    }}
                  />
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = <App
                  foo={function() {
                    console.log('bar');
                  }}
                />
            `,
			options: [2],
		},
		{
			code: unIndent`
                <Provider
                  store
                >
                  <App
                    foo={function() {
                      console.log('bar');
                    }}
                  />
                </Provider>
            `,
			options: [2],
		},
		{
			code: unIndent`
                <Provider
                  store
                >
                  {baz && <App
                    foo={function() {
                      console.log('bar');
                    }}
                  />}
                </Provider>
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App
                \tfoo
                />
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                <App
                \tfoo
                ></App>
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                <App foo={function() {
                \tconsole.log('bar');
                }}
                />
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                var x = <App
                \tfoo={function() {
                \t\tconsole.log('bar');
                \t}}
                />
            `,
			options: ["tab"],
		},
		unIndent`
                <App
                    foo />
            `,
		unIndent`
                <div>
                   unrelated{
                        foo
                    }
                </div>
            `,
		unIndent`
                <div>unrelated{
                    foo
                }
                </div>
            `,
		unIndent`
                <
                    foo
                        .bar
                        .baz
                >
                    foo
                </
                    foo.
                        bar.
                        baz
                >
            `,
		unIndent`
                <
                    input
                    type=
                        "number"
                />
            `,
		unIndent`
                <
                    input
                    type=
                        {'number'}
                />
            `,
		unIndent`
                <
                    input
                    type
                        ="number"
                />
            `,
		unIndent`
                foo ? (
                    bar
                ) : (
                    baz
                )
            `,
		unIndent`
                foo ? (
                    <div>
                    </div>
                ) : (
                    <span>
                    </span>
                )
            `,
		unIndent`
                <div>
                    {
                        /* foo */
                    }
                </div>
            `,

		/*
		 * JSX Fragments
		 * https://github.com/eslint/eslint/issues/12208
		 */
		unIndent`
            <>
                <A />
            </>
        `,
		unIndent`
            <
            >
                <A />
            </>
        `,
		unIndent`
            <>
                <A />
            <
            />
        `,
		unIndent`
            <>
                <A />
            </
            >
        `,
		unIndent`
            <
            >
                <A />
            </
            >
        `,
		unIndent`
            <
            >
                <A />
            <
            />
        `,
		unIndent`
            < // Comment
            >
                <A />
            </>
        `,
		unIndent`
            <
                // Comment
            >
                <A />
            </>
        `,
		unIndent`
            <
            // Comment
            >
                <A />
            </>
        `,
		unIndent`
            <>
                <A />
            < // Comment
            />
        `,
		unIndent`
            <>
                <A />
            <
                // Comment
            />
        `,
		unIndent`
            <>
                <A />
            <
            // Comment
            />
        `,
		unIndent`
            <>
                <A />
            </ // Comment
            >
        `,
		unIndent`
            <>
                <A />
            </
                // Comment
            >
        `,
		unIndent`
            <>
                <A />
            </
            // Comment
            >
        `,
		unIndent`
            < /* Comment */
            >
                <A />
            </>
        `,
		unIndent`
            <
                /* Comment */
            >
                <A />
            </>
        `,
		unIndent`
            <
            /* Comment */
            >
                <A />
            </>
        `,
		unIndent`
            <
                /*
                 * Comment
                 */
            >
                <A />
            </>
        `,
		unIndent`
            <
            /*
             * Comment
             */
            >
                <A />
            </>
        `,
		unIndent`
            <>
                <A />
            < /* Comment */
            />
        `,
		unIndent`
            <>
                <A />
            <
                /* Comment */ />
        `,
		unIndent`
            <>
                <A />
            <
            /* Comment */ />
        `,
		unIndent`
            <>
                <A />
            <
                /* Comment */
            />
        `,
		unIndent`
            <>
                <A />
            <
            /* Comment */
            />
        `,
		unIndent`
            <>
                <A />
            </ /* Comment */
            >
        `,
		unIndent`
            <>
                <A />
            </
                /* Comment */ >
        `,
		unIndent`
            <>
                <A />
            </
            /* Comment */ >
        `,
		unIndent`
            <>
                <A />
            </
                /* Comment */
            >
        `,
		unIndent`
            <>
                <A />
            </
            /* Comment */
            >
        `,

		// https://github.com/eslint/eslint/issues/8832
		unIndent`
                <div>
                    {
                        (
                            1
                        )
                    }
                </div>
            `,
		unIndent`
                function A() {
                    return (
                        <div>
                            {
                                b && (
                                    <div>
                                    </div>
                                )
                            }
                        </div>
                    );
                }
            `,
		unIndent`
            <div>foo
                <div>bar</div>
            </div>
        `,
		unIndent`
            <small>Foo bar&nbsp;
                <a>baz qux</a>.
            </small>
        `,
		unIndent`
            <div
                {...props}
            />
        `,
		unIndent`
            <div
                {
                    ...props
                }
            />
        `,
		{
			code: unIndent`
                a(b
                  , c
                )
            `,
			options: [2, { CallExpression: { arguments: "off" } }],
		},
		{
			code: unIndent`
                a(
                  new B({
                    c,
                  })
                );
            `,
			options: [2, { CallExpression: { arguments: "off" } }],
		},
		{
			code: unIndent`
                foo
                ? bar
                            : baz
            `,
			options: [4, { ignoredNodes: ["ConditionalExpression"] }],
		},
		{
			code: unIndent`
                class Foo {
                foo() {
                    bar();
                }
                }
            `,
			options: [4, { ignoredNodes: ["ClassBody"] }],
		},
		{
			code: unIndent`
                class Foo {
                foo() {
                bar();
                }
                }
            `,
			options: [4, { ignoredNodes: ["ClassBody", "BlockStatement"] }],
		},
		{
			code: unIndent`
                foo({
                        bar: 1
                    },
                    {
                        baz: 2
                    },
                    {
                        qux: 3
                })
            `,
			options: [
				4,
				{ ignoredNodes: ["CallExpression > ObjectExpression"] },
			],
		},
		{
			code: unIndent`
                foo
                                            .bar
            `,
			options: [4, { ignoredNodes: ["MemberExpression"] }],
		},
		{
			code: unIndent`
                $(function() {

                foo();
                bar();

                });
            `,
			options: [
				4,
				{
					ignoredNodes: [
						"Program > ExpressionStatement > CallExpression[callee.name='$'] > FunctionExpression > BlockStatement",
					],
				},
			],
		},
		{
			code: unIndent`
                <Foo
                            bar="1" />
            `,
			options: [4, { ignoredNodes: ["JSXOpeningElement"] }],
		},
		{
			code: unIndent`
                foo &&
                <Bar
                >
                </Bar>
            `,
			options: [4, { ignoredNodes: ["JSXElement", "JSXOpeningElement"] }],
		},
		{
			code: unIndent`
                (function($) {
                $(function() {
                    foo;
                });
                }())
            `,
			options: [
				4,
				{
					ignoredNodes: [
						"ExpressionStatement > CallExpression > FunctionExpression.callee > BlockStatement",
					],
				},
			],
		},
		{
			code: unIndent`
                const value = (
                    condition ?
                    valueIfTrue :
                    valueIfFalse
                );
            `,
			options: [4, { ignoredNodes: ["ConditionalExpression"] }],
		},
		{
			code: unIndent`
                var a = 0, b = 0, c = 0;
                export default foo(
                    a,
                    b, {
                    c
                    }
                )
            `,
			options: [
				4,
				{
					ignoredNodes: [
						"ExportDefaultDeclaration > CallExpression > ObjectExpression",
					],
				},
			],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                foobar = baz
                       ? qux
                       : boop
            `,
			options: [4, { ignoredNodes: ["ConditionalExpression"] }],
		},
		{
			code: unIndent`
                \`
                    SELECT
                        \${
                            foo
                        } FROM THE_DATABASE
                \`
            `,
			options: [4, { ignoredNodes: ["TemplateLiteral"] }],
		},
		{
			code: unIndent`
                <foo
                    prop='bar'
                    >
                    Text
                </foo>
            `,
			options: [4, { ignoredNodes: ["JSXOpeningElement"] }],
		},
		{
			code: unIndent`
                {
                \tvar x = 1,
                \t    y = 2;
                }
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                var x = 1,
                    y = 2;
                var z;
            `,
			options: ["tab", { ignoredNodes: ["VariableDeclarator"] }],
		},
		{
			code: unIndent`
                [
                    foo(),
                    bar
                ]
            `,
			options: [
				"tab",
				{ ArrayExpression: "first", ignoredNodes: ["CallExpression"] },
			],
		},
		{
			code: unIndent`
                if (foo) {
                    doSomething();

                // Intentionally unindented comment
                    doSomethingElse();
                }
            `,
			options: [4, { ignoreComments: true }],
		},
		{
			code: unIndent`
                if (foo) {
                    doSomething();

                /* Intentionally unindented comment */
                    doSomethingElse();
                }
            `,
			options: [4, { ignoreComments: true }],
		},
		unIndent`
            const obj = {
                foo () {
                    return condition ? // comment
                        1 :
                        2
                }
            }
        `,

		//----------------------------------------------------------------------
		// Comment alignment tests
		//----------------------------------------------------------------------
		unIndent`
            if (foo) {
            // Comment can align with code immediately above even if "incorrect" alignment
                doSomething();
            }
        `,
		unIndent`
            if (foo) {
                doSomething();
            // Comment can align with code immediately below even if "incorrect" alignment
            }
        `,
		unIndent`
            if (foo) {
                // Comment can be in correct alignment even if not aligned with code above/below
            }
        `,
		unIndent`
            if (foo) {

                // Comment can be in correct alignment even if gaps between (and not aligned with) code above/below

            }
        `,
		unIndent`
            [{
                foo
            },

            // Comment between nodes

            {
                bar
            }];
        `,
		unIndent`
            [{
                foo
            },

            // Comment between nodes

            { // comment
                bar
            }];
        `,
		unIndent`
            let foo

            // comment

            ;(async () => {})()
        `,
		unIndent`
            let foo
            // comment

            ;(async () => {})()
        `,
		unIndent`
            let foo

            // comment
            ;(async () => {})()
        `,
		unIndent`
            let foo
            // comment
            ;(async () => {})()
        `,
		unIndent`
            let foo

                /* comment */;

            (async () => {})()
        `,
		unIndent`
            let foo
                /* comment */;

            (async () => {})()
        `,
		unIndent`
            let foo

                /* comment */;
            (async () => {})()
        `,
		unIndent`
            let foo
                /* comment */;
            (async () => {})()
        `,
		unIndent`
            let foo
            /* comment */;

            (async () => {})()
        `,
		unIndent`
            let foo
            /* comment */;
            (async () => {})()
        `,
		unIndent`
            // comment

            ;(async () => {})()
        `,
		unIndent`
            // comment
            ;(async () => {})()
        `,
		unIndent`
            {
                let foo

                // comment

                ;(async () => {})()
            }
        `,
		unIndent`
            {
                let foo
                // comment
                ;(async () => {})()
            }
        `,
		unIndent`
            {
                // comment

                ;(async () => {})()
            }
        `,
		unIndent`
            {
                // comment
                ;(async () => {})()
            }
        `,
		unIndent`
            const foo = 1
            const bar = foo

            /* comment */

            ;[1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo
            /* comment */

            ;[1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo

            /* comment */
            ;[1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo
            /* comment */
            ;[1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo

                /* comment */;

            [1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo
                /* comment */;

            [1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo

                /* comment */;
            [1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo
                /* comment */;
            [1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo
            /* comment */;

            [1, 2, 3].forEach(() => {})
        `,
		unIndent`
            const foo = 1
            const bar = foo
            /* comment */;
            [1, 2, 3].forEach(() => {})
        `,
		unIndent`
            /* comment */

            ;[1, 2, 3].forEach(() => {})
        `,
		unIndent`
            /* comment */
            ;[1, 2, 3].forEach(() => {})
        `,
		unIndent`
            {
                const foo = 1
                const bar = foo

                /* comment */

                ;[1, 2, 3].forEach(() => {})
            }
        `,
		unIndent`
            {
                const foo = 1
                const bar = foo
                /* comment */
                ;[1, 2, 3].forEach(() => {})
            }
        `,
		unIndent`
            {
                /* comment */

                ;[1, 2, 3].forEach(() => {})
            }
        `,
		unIndent`
            {
                /* comment */
                ;[1, 2, 3].forEach(() => {})
            }
        `,

		// import expressions
		{
			code: unIndent`
                import(
                    // before
                    source
                    // after
                )
            `,
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/12122
		{
			code: unIndent`
                foo(() => {
                    tag\`
                    multiline
                    template
                    literal
                    \`(() => {
                        bar();
                    });
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                {
                    tag\`
                    multiline
                    template
                    \${a} \${b}
                    literal
                    \`(() => {
                        bar();
                    });
                }
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo(() => {
                    tagOne\`
                    multiline
                    template
                    literal
                    \${a} \${b}
                    \`(() => {
                        tagTwo\`
                        multiline
                        template
                        literal
                        \`(() => {
                            bar();
                        });

                        baz();
                    });
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                {
                    tagOne\`
                    \${a} \${b}
                    multiline
                    template
                    literal
                    \`(() => {
                        tagTwo\`
                        multiline
                        template
                        literal
                        \`(() => {
                            bar();
                        });

                        baz();
                    });
                };
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                tagOne\`multiline
                        \${a} \${b}
                        template
                        literal
                        \`(() => {
                    foo();

                    tagTwo\`multiline
                            template
                            literal
                        \`({
                        bar: 1,
                        baz: 2
                    });
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                tagOne\`multiline
                    template
                    literal
                    \${a} \${b}\`({
                    foo: 1,
                    bar: tagTwo\`multiline
                        template
                        literal\`(() => {

                        baz();
                    })
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo.bar\` template literal \`(() => {
                    baz();
                })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo.bar.baz\` template literal \`(() => {
                    baz();
                })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .bar\` template
                        literal \`(() => {
                        baz();
                    })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .bar
                    .baz\` template
                        literal \`(() => {
                        baz();
                    })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo.bar\`
                    \${a} \${b}
                    \`(() => {
                    baz();
                })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo.bar1.bar2\`
                    \${a} \${b}
                    \`(() => {
                    baz();
                })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .bar1
                    .bar2\`
                    \${a} \${b}
                    \`(() => {
                        baz();
                    })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .bar\`
                    \${a} \${b}
                    \`(() => {
                        baz();
                    })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                .test\`
                    \${a} \${b}
                    \`(() => {
                    baz();
                })
            `,
			options: [4, { MemberExpression: 0 }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                        .test\`
                    \${a} \${b}
                    \`(() => {
                            baz();
                        })
            `,
			options: [4, { MemberExpression: 2 }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                const foo = async (arg1,
                                   arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
		},
		{
			code: unIndent`
                const foo = async /* some comments */(arg1,
                                                      arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
		},
		{
			code: unIndent`
                const a = async
                b => {}
            `,
			options: [2],
		},
		{
			code: unIndent`
                const foo = (arg1,
                             arg2) => async (arr1,
                                             arr2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
		},
		{
			code: unIndent`
                const foo = async (arg1,
                  arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                const foo = async /*comments*/(arg1,
                  arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                const foo = async (arg1,
                        arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: 4 },
					FunctionExpression: { parameters: 4 },
				},
			],
		},
		{
			code: unIndent`
                const foo = (arg1,
                        arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: 4 },
					FunctionExpression: { parameters: 4 },
				},
			],
		},
		{
			code: unIndent`
                async function fn(ar1,
                                  ar2){}
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
		},
		{
			code: unIndent`
                async function /* some comments */ fn(ar1,
                                                      ar2){}
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
		},
		{
			code: unIndent`
                async  /* some comments */  function fn(ar1,
                                                        ar2){}
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
		},
		{
			code: unIndent`
                class C {
                  static {
                    foo();
                    bar();
                  }
                }
            `,
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {
                        foo();
                        bar();
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {
                            foo();
                            bar();
                    }
                }
            `,
			options: [4, { StaticBlock: { body: 2 } }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {
                    foo();
                    bar();
                    }
                }
            `,
			options: [4, { StaticBlock: { body: 0 } }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                \tstatic {
                \t\tfoo();
                \t\tbar();
                \t}
                }
            `,
			options: ["tab"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                \tstatic {
                \t\t\tfoo();
                \t\t\tbar();
                \t}
                }
            `,
			options: ["tab", { StaticBlock: { body: 2 } }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static
                    {
                        foo();
                        bar();
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {
                        var x,
                            y;
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static
                    {
                        var x,
                            y;
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {
                        if (foo) {
                            bar;
                        }
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {
                        {
                            bar;
                        }
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static {}

                    static {
                    }

                    static
                    {
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {

                    static {
                        foo;
                    }

                    static {
                        bar;
                    }

                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {

                    x = 1;

                    static {
                        foo;
                    }

                    y = 2;

                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {

                    method1(param) {
                        foo;
                    }

                    static {
                        bar;
                    }

                    method2(param) {
                        foo;
                    }

                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                function f() {
                    class C {
                        static {
                            foo();
                            bar();
                        }
                    }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    method() {
                            foo;
                    }
                    static {
                            bar;
                    }
                }
            `,
			options: [
				4,
				{ FunctionExpression: { body: 2 }, StaticBlock: { body: 2 } },
			],
			languageOptions: { ecmaVersion: 2022 },
		},

		// https://github.com/eslint/eslint/issues/15930
		{
			code: unIndent`
                if (2 > 1)
                \tconsole.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                if (2 > 1)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo) bar();
                baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo) bar()
                ;baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar();
                baz();
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                ; baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                ;baz()
                qux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                ;else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                else
                    baz()
                ;qux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    if (bar)
                        baz()
                ;qux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                else if (baz)
                    qux()
                ;quux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    if (bar)
                        baz()
                    else
                        qux()
                ;quux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                    ;
                baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    ;
                baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                ;baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo);
                else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    ;
                else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                ;else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                do foo();
                while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do foo()
                ;while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                    foo();
                while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                    foo()
                ;while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do;
                while (foo)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                    ;
                while (foo)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                ;while (foo)
            `,
			options: [4],
		},
		{
			code: unIndent`
                while (2 > 1)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (;;)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (a in b)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (a of b)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                with (a)
                    console.log(b)
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                label: for (a of b)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                label:
                for (a of b)
                    console.log('a')
                ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},

		// https://github.com/eslint/eslint/issues/17316
		{
			code: unIndent`
                if (foo)
                \tif (bar) doSomething();
                \telse doSomething();
                else
                \tif (bar) doSomething();
                \telse doSomething();
            `,
			options: ["tab"],
		},
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (bar) doSomething();
                else doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (bar)
                    doSomething();
                else doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (bar) doSomething();
                else
                    doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (bar)
                    doSomething();
                else
                    doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (bar) doSomething();
            else doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (bar)
                doSomething();
            else doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (bar) doSomething();
            else
                doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (bar)
                doSomething();
            else
                doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                    if (bar) doSomething();
                    else doSomething();

        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (foo)
                    if (bar) doSomething();
                    else
                        if (bar) doSomething();
                        else doSomething();
                else doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (foo) doSomething();
            else doSomething();
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (foo) {
                doSomething();
            }
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else if (foo)
            {
                doSomething();
            }
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (foo) {
                    doSomething();
                }
        `,
		unIndent`
            if (foo)
                if (bar) doSomething();
                else doSomething();
            else
                if (foo)
                {
                    doSomething();
                }
        `,
	],

	invalid: [
		{
			code: unIndent`
                var a = b;
                if (a) {
                b();
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                require('http').request({hostname: 'localhost',
                                  port: 80}, function(res) {
                    res.end();
                  });
            `,
			options: [2],
		},
		{
			code: unIndent`
                if (array.some(function(){
                  return true;
                })) {
                a++; // ->
                  b++;
                    c++; // <-
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                if (a){
                \tb=c;
                \t\tc=d;
                e=f;
                }
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                if (a){
                    b=c;
                      c=d;
                 e=f;
                }
            `,
			options: [4],
		},
		{
			code: fixture,
			options: [
				2,
				{
					SwitchCase: 1,
					MemberExpression: 1,
					CallExpression: { arguments: "off" },
				},
			],
		},
		{
			code: unIndent`
                switch(value){
                    case "1":
                        a();
                    break;
                    case "2":
                        a();
                    break;
                    default:
                        a();
                        break;
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var x = 0 &&
                    {
                       a: 1,
                          b: 2
                    };
            `,
			options: [4],
		},
		{
			code: unIndent`
                switch(value){
                    case "1":
                        a();
                        break;
                    case "2":
                        a();
                        break;
                    default:
                    break;
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                switch(value){
                    case "1":
                    case "2":
                        a();
                        break;
                    default:
                        break;
                }
                switch(value){
                    case "1":
                    break;
                    case "2":
                        a();
                    break;
                    default:
                        a();
                    break;
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                switch(value){
                case "1":
                        a();
                        break;
                    case "2":
                        break;
                    default:
                        break;
                }
            `,
			options: [4],
		},
		{
			code: unIndent`
                var obj = {foo: 1, bar: 2};
                with (obj) {
                console.log(foo + bar);
                }
            `,
		},
		{
			code: unIndent`
                switch (a) {
                case '1':
                b();
                break;
                default:
                c();
                break;
                }
            `,
			options: [4, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var foo = function(){
                    foo
                          .bar
                }
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                (
                    foo
                    .bar
                )
            `,
		},
		{
			code: unIndent`
                var foo = function(){
                    foo
                             .bar
                }
            `,
			options: [4, { MemberExpression: 2 }],
		},
		{
			code: unIndent`
                var foo = () => {
                    foo
                             .bar
                }
            `,
			options: [4, { MemberExpression: 2 }],
		},
		{
			code: unIndent`
                TestClass.prototype.method = function () {
                  return Promise.resolve(3)
                      .then(function (x) {
                      return x;
                    });
                };
            `,
			options: [2, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                while (a)
                b();
            `,
			options: [4],
		},
		{
			code: unIndent`
                lmn = [{
                        a: 1
                    },
                    {
                        b: 2
                    },
                    {
                        x: 2
                }];
            `,
		},
		{
			code: unIndent`
                for (var foo = 1;
                foo < 10;
                foo++) {}
            `,
		},
		{
			code: unIndent`
                for (
                var foo = 1;
                foo < 10;
                foo++
                    ) {}
            `,
		},
		{
			code: unIndent`
                for (;;)
                b();
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (a in x)
                b();
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                b();
                while(true)
            `,
			options: [4],
		},
		{
			code: unIndent`
                with(a)
                b();
            `,
			options: [4],
		},
		{
			code: unIndent`
                if(true)
                b();
            `,
			options: [4],
		},
		{
			code: unIndent`
                var test = {
                      a: 1,
                    b: 2
                    };
            `,
			options: [2],
		},
		{
			code: unIndent`
                var a = function() {
                      a++;
                    b++;
                          c++;
                    },
                    b;
            `,
			options: [4],
		},
		{
			code: unIndent`
                var a = 1,
                b = 2,
                c = 3;
            `,
			options: [4],
		},
		{
			code: unIndent`
                [a, b,
                    c].forEach((index) => {
                        index;
                    });
            `,
			options: [4],
		},
		{
			code: unIndent`
                [a, b,
                c].forEach(function(index){
                  return index;
                });
            `,
			options: [4],
		},
		{
			code: unIndent`
                [a, b, c].forEach(function(index){
                  return index;
                });
            `,
			options: [4],
		},
		{
			code: unIndent`
                (foo)
                    .bar([
                    baz
                ]);
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                var x = ['a',
                         'b',
                         'c'
                ];
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = [
                         'a',
                         'b',
                         'c'
                ];
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = [
                         'a',
                         'b',
                         'c',
                'd'];
            `,
			options: [4],
		},
		{
			code: unIndent`
                var x = [
                         'a',
                         'b',
                         'c'
                  ];
            `,
			options: [4],
		},
		{
			code: unIndent`
                [[
                ], function(
                        foo
                    ) {}
                ]
            `,
		},
		{
			code: unIndent`
                define([
                    'foo'
                ], function(
                        bar
                    ) {
                    baz;
                }
                )
            `,
		},
		{
			code: unIndent`
                while (1 < 2)
                console.log('foo')
                  console.log('bar')
            `,
			options: [2],
		},
		{
			code: unIndent`
                function salutation () {
                  switch (1) {
                  case 0: return console.log('hi')
                    case 1: return console.log('hey')
                  }
                }
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
                height, rotate;
            `,
			options: [2, { SwitchCase: 1 }],
		},
		{
			code: unIndent`
                switch (a) {
                case '1':
                b();
                break;
                default:
                c();
                break;
                }
            `,
			options: [4, { SwitchCase: 2 }],
		},
		{
			code: unIndent`
                var geometry,
                rotate;
            `,
			options: [2, { VariableDeclarator: 1 }],
		},
		{
			code: unIndent`
                var geometry,
                  rotate;
            `,
			options: [2, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                var geometry,
                \trotate;
            `,
			options: ["tab", { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                let geometry,
                  rotate;
            `,
			options: [2, { VariableDeclarator: 2 }],
		},
		{
			code: unIndent`
                let foo = 'foo',
                  bar = bar;
                const a = 'a',
                  b = 'b';
            `,
			options: [2, { VariableDeclarator: "first" }],
		},
		{
			code: unIndent`
                var foo = 'foo',
                  bar = bar;
            `,
			options: [2, { VariableDeclarator: { var: "first" } }],
		},
		{
			code: unIndent`
                if(true)
                  if (true)
                    if (true)
                    console.log(val);
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = {
                    a: 1,
                    b: 2
                }
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = [
                    a,
                    b
                ]
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                let a = [
                    a,
                    b
                ]
            `,
			options: [2, { VariableDeclarator: { let: 2 }, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = new Test({
                      a: 1
                  }),
                    b = 4;
            `,
			options: [4],
		},
		{
			code: unIndent`
                var a = new Test({
                      a: 1
                    }),
                    b = 4;
                const c = new Test({
                      a: 1
                    }),
                    d = 4;
            `,
			options: [2, { VariableDeclarator: { var: 2 } }],
		},
		{
			code: unIndent`
                var abc = 5,
                    c = 2,
                    xyz =
                    {
                      a: 1,
                       b: 2
                    };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var abc =
                     {
                       a: 1,
                        b: 2
                     };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var foo = {
                    bar: 1,
                    baz: {
                        qux: 2
                      }
                  },
                  bar = 1;
            `,
			options: [2],
		},
		{
			code: unIndent`
                var path     = require('path')
                 , crypto    = require('crypto')
                ;
            `,
			options: [2],
		},
		{
			code: unIndent`
                var a = 1
                   ,b = 2
                ;
            `,
		},
		{
			code: unIndent`
                class A{
                  constructor(){}
                    a(){}
                    get b(){}
                }
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var A = class {
                  constructor(){}
                    a(){}
                  get b(){}
                };
            `,
			options: [4, { VariableDeclarator: 1, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                var a = 1,
                    B = class {
                    constructor(){}
                      a(){}
                      get b(){}
                    };
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                {
                    if(a){
                        foo();
                    }
                  else{
                        bar();
                    }
                }
            `,
			options: [4],
		},
		{
			code: unIndent`
                {
                    if(a){
                        foo();
                    }
                  else
                        bar();

                }
            `,
			options: [4],
		},
		{
			code: unIndent`
                {
                    if(a)
                        foo();
                  else
                        bar();
                }
            `,
			options: [4],
		},
		{
			code: unIndent`
                (function(){
                  function foo(x) {
                    return x + 1;
                  }
                })();
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                (function(){
                    function foo(x) {
                        return x + 1;
                    }
                })();
            `,
			options: [4, { outerIIFEBody: 2 }],
		},
		{
			code: unIndent`
                if(data) {
                console.log('hi');
                }
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                var ns = function(){
                    function fooVar(x) {
                        return x + 1;
                    }
                }(x);
            `,
			options: [4, { outerIIFEBody: 2 }],
		},
		{
			code: unIndent`
                var obj = {
                  foo: function() {
                  return true;
                  }()
                };
            `,
			options: [2, { outerIIFEBody: 0 }],
		},
		{
			code: unIndent`
                typeof function() {
                    function fooVar(x) {
                      return x + 1;
                    }
                }();
            `,
			options: [2, { outerIIFEBody: 2 }],
		},
		{
			code: unIndent`
                {
                \t!function(x) {
                \t\t\t\treturn x + 1;
                \t}()
                };
            `,
			options: ["tab", { outerIIFEBody: 3 }],
		},
		{
			code: unIndent`
                (function(){
                    function foo(x) {
                    return x + 1;
                    }
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                (function(){
                function foo(x) {
                return x + 1;
                }
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                (() => {
                    function foo(x) {
                    return x + 1;
                    }
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                (() => {
                function foo(x) {
                return x + 1;
                }
                })();
            `,
			options: [4, { outerIIFEBody: "off" }],
		},
		{
			code: unIndent`
                Buffer
                .toString()
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer
                    .indexOf('a')
                .toString()
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer.
                length
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer.
                \t\tlength
            `,
			options: ["tab", { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                Buffer
                  .foo
                  .bar
            `,
			options: [2, { MemberExpression: 2 }],
		},
		{
			code: unIndent`
                function foo() {
                    new
                    .target
                }
            `,
		},
		{
			code: unIndent`
                function foo() {
                    new.
                    target
                }
            `,
		},
		{
			// Indentation with multiple else statements: https://github.com/eslint/eslint/issues/6956

			code: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                  else if (qux) qux();
            `,
			options: [2],
		},
		{
			code: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                  else qux();
            `,
			options: [2],
		},
		{
			code: unIndent`
                foo();
                  if (baz) foobar();
                  else qux();
            `,
			options: [2],
		},
		{
			code: unIndent`
                if (foo) bar();
                else if (baz) foobar();
                     else if (bip) {
                       qux();
                     }
            `,
			options: [2],
		},
		{
			code: unIndent`
                if (foo) bar();
                else if (baz) {
                    foobar();
                     } else if (boop) {
                       qux();
                     }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo(aaa,
                    bbb, ccc, ddd) {
                      bar();
                }
            `,
			options: [2, { FunctionDeclaration: { parameters: 1, body: 2 } }],
		},
		{
			code: unIndent`
                function foo(aaa, bbb,
                  ccc, ddd) {
                bar();
                }
            `,
			options: [2, { FunctionDeclaration: { parameters: 3, body: 1 } }],
		},
		{
			code: unIndent`
                function foo(aaa,
                        bbb,
                  ccc) {
                      bar();
                }
            `,
			options: [4, { FunctionDeclaration: { parameters: 1, body: 3 } }],
		},
		{
			code: unIndent`
                function foo(aaa,
                  bbb, ccc,
                                   ddd, eee, fff) {
                   bar();
                }
            `,
			options: [
				2,
				{ FunctionDeclaration: { parameters: "first", body: 1 } },
			],
		},
		{
			code: unIndent`
                function foo(aaa, bbb)
                {
                bar();
                }
            `,
			options: [2, { FunctionDeclaration: { body: 3 } }],
		},
		{
			code: unIndent`
                function foo(
                aaa,
                    bbb) {
                bar();
                }
            `,
			options: [
				2,
				{ FunctionDeclaration: { parameters: "first", body: 2 } },
			],
		},
		{
			code: unIndent`
                var foo = function(aaa,
                  bbb,
                    ccc,
                      ddd) {
                  bar();
                }
            `,
			options: [2, { FunctionExpression: { parameters: 2, body: 0 } }],
		},
		{
			code: unIndent`
                var foo = function(aaa,
                   bbb,
                 ccc) {
                  bar();
                }
            `,
			options: [2, { FunctionExpression: { parameters: 1, body: 10 } }],
		},
		{
			code: unIndent`
                var foo = function(aaa,
                  bbb, ccc, ddd,
                                        eee, fff) {
                        bar();
                }
            `,
			options: [
				4,
				{ FunctionExpression: { parameters: "first", body: 1 } },
			],
		},
		{
			code: unIndent`
                var foo = function(
                aaa, bbb, ccc,
                    ddd, eee) {
                  bar();
                }
            `,
			options: [
				2,
				{ FunctionExpression: { parameters: "first", body: 3 } },
			],
		},
		{
			code: unIndent`
                var foo = bar;
                \t\t\tvar baz = qux;
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                \tbar();
                  baz();
                              qux();
                }
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                function foo() {
                  bar();
                \t\t}
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  function bar() {
                        baz();
                  }
                }
            `,
			options: [2, { FunctionDeclaration: { body: 1 } }],
		},
		{
			code: unIndent`
                function foo() {
                  function bar(baz,
                    qux) {
                    foobar();
                  }
                }
            `,
			options: [2, { FunctionDeclaration: { body: 1, parameters: 2 } }],
		},
		{
			code: unIndent`
                function foo() {
                  var bar = function(baz,
                          qux) {
                    foobar();
                  };
                }
            `,
			options: [2, { FunctionExpression: { parameters: 3 } }],
		},
		{
			code: unIndent`
                foo.bar(
                      baz, qux, function() {
                        qux;
                      }
                );
            `,
			options: [
				2,
				{
					FunctionExpression: { body: 3 },
					CallExpression: { arguments: 3 },
				},
			],
		},
		{
			code: unIndent`
                {
                    try {
                    }
                catch (err) {
                    }
                finally {
                    }
                }
            `,
		},
		{
			code: unIndent`
                {
                    do {
                    }
                while (true)
                }
            `,
		},
		{
			code: unIndent`
                function foo() {
                  return (
                    1
                    )
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                  return (
                    1
                    );
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function test(){
                  switch(length){
                    case 1: return function(a){
                    return fn.call(that, a);
                    };
                  }
                }
            `,
			options: [2, { VariableDeclarator: 2, SwitchCase: 1 }],
		},
		{
			code: unIndent`
                function foo() {
                   return 1
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                foo(
                bar,
                  baz,
                    qux);
            `,
			options: [2, { CallExpression: { arguments: 1 } }],
		},
		{
			code: unIndent`
                foo(
                \tbar,
                \tbaz);
            `,
			options: [2, { CallExpression: { arguments: 2 } }],
		},
		{
			code: unIndent`
                foo(bar,
                \t\tbaz,
                \t\tqux);
            `,
			options: ["tab", { CallExpression: { arguments: 1 } }],
		},
		{
			code: unIndent`
                foo(bar, baz,
                         qux);
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                foo(
                          bar,
                    baz);
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                foo(bar,
                  1 + 2,
                              !baz,
                        new Car('!')
                );
            `,
			options: [2, { CallExpression: { arguments: 3 } }],
		},

		// https://github.com/eslint/eslint/issues/7573
		{
			code: unIndent`
                return (
                    foo
                    );
            `,
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},
		{
			code: unIndent`
                return (
                    foo
                    )
            `,
			languageOptions: {
				parserOptions: { ecmaFeatures: { globalReturn: true } },
			},
		},

		// https://github.com/eslint/eslint/issues/7604
		{
			code: unIndent`
                if (foo) {
                        /* comment */bar();
                }
            `,
		},
		{
			code: unIndent`
                foo('bar',
                        /** comment */{
                        ok: true
                    });
            `,
		},
		{
			code: unIndent`
                foo(
                (bar)
                );
            `,
			options: [4, { CallExpression: { arguments: 1 } }],
		},
		{
			code: unIndent`
                ((
                foo
                ))
            `,
			options: [4],
		},

		// ternary expressions (https://github.com/eslint/eslint/issues/7420)
		{
			code: unIndent`
                foo
                ? bar
                    : baz
            `,
			options: [2],
		},
		{
			code: unIndent`
                [
                    foo ?
                        bar :
                        baz,
                        qux
                ]
            `,
		},
		{
			code: unIndent`
              condition
              ? () => {
              return true
              }
              : condition2
              ? () => {
              return true
              }
              : () => {
              return false
              }
            `,
			options: [2, { offsetTernaryExpressions: true }],
		},
		{
			code: unIndent`
              condition
              ? () => {
              return true
              }
              : condition2
              ? () => {
              return true
              }
              : () => {
              return false
              }
            `,
			options: [2, { offsetTernaryExpressions: false }],
		},
		{
			/*
			 * Checking comments:
			 * https://github.com/eslint/eslint/issues/6571
			 */
			code: unIndent`
                foo();
                  // comment
                    /* multiline
                  comment */
                bar();
                 // trailing comment
            `,
			options: [2],
		},
		{
			code: "  // comment",
		},
		{
			code: unIndent`
                foo
                  // comment
            `,
		},
		{
			code: unIndent`
                  // comment
                foo
            `,
		},
		{
			code: unIndent`
                [
                        // no elements
                ]
            `,
		},
		{
			/*
			 * Destructuring assignments:
			 * https://github.com/eslint/eslint/issues/6813
			 */
			code: unIndent`
                var {
                foo,
                  bar,
                    baz: qux,
                      foobar: baz = foobar
                  } = qux;
            `,
			options: [2],
		},
		{
			code: unIndent`
                const {
                  a
                } = {
                    a: 1
                  }
            `,
			options: [2],
		},
		{
			code: unIndent`
                var foo = [
                           bar,
                  baz
                          ]
            `,
		},
		{
			code: unIndent`
                var foo = [bar,
                baz,
                    qux
                ]
            `,
		},
		{
			code: unIndent`
                var foo = [bar,
                  baz,
                  qux
                ]
            `,
			options: [2, { ArrayExpression: 0 }],
		},
		{
			code: unIndent`
                var foo = [bar,
                  baz,
                  qux
                ]
            `,
			options: [2, { ArrayExpression: 8 }],
		},
		{
			code: unIndent`
                var foo = [bar,
                    baz,
                    qux
                ]
            `,
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = [bar,
                    baz, qux
                ]
            `,
			options: [2, { ArrayExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = [
                        { bar: 1,
                            baz: 2 },
                        { bar: 3,
                            qux: 4 }
                ]
            `,
			options: [4, { ArrayExpression: 2, ObjectExpression: "first" }],
		},
		{
			code: unIndent`
                var foo = {
                  bar: 1,
                  baz: 2
                };
            `,
			options: [2, { ObjectExpression: 0 }],
		},
		{
			code: unIndent`
                var quux = { foo: 1, bar: 2,
                baz: 3 }
            `,
			options: [2, { ObjectExpression: "first" }],
		},
		{
			code: unIndent`
                function foo() {
                    [
                            foo
                    ]
                }
            `,
			options: [2, { ArrayExpression: 4 }],
		},
		{
			code: unIndent`
                var [
                foo,
                  bar,
                    baz,
                      foobar = baz
                  ] = qux;
            `,
			options: [2],
		},
		{
			code: unIndent`
                import {
                foo,
                  bar,
                    baz
                } from 'qux';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import { foo,
                         bar,
                          baz,
                } from 'qux';
            `,
			options: [4, { ImportDeclaration: "first" }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                import { foo,
                    bar,
                     baz,
                } from 'qux';
            `,
			options: [2, { ImportDeclaration: 2 }],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                foo,
                  bar,
                    baz
                };
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                foo,
                  bar,
                    baz
                } from 'qux';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			// https://github.com/eslint/eslint/issues/7233
			code: unIndent`
                var folder = filePath
                  .foo()
                      .bar;
            `,
			options: [2, { MemberExpression: 2 }],
		},
		{
			code: unIndent`
                for (const foo of bar)
                    baz();
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = () =>
                    5;
            `,
			options: [2],
		},
		{
			// BinaryExpressions with parens
			code: unIndent`
                foo && (
                        bar
                )
            `,
			options: [4],
		},
		{
			code: unIndent`
                foo &&
                    !bar(
                )
            `,
		},
		{
			code: unIndent`
                foo &&
                    ![].map(() => {
                    bar();
                })
            `,
		},
		{
			code: unIndent`
                [
                ] || [
                    ]
            `,
		},
		{
			code: unIndent`
                foo
                        || (
                                bar
                            )
            `,
		},
		{
			code: unIndent`
                1
                + (
                        1
                    )
            `,
		},

		// Template curlies
		{
			code: unIndent`
                \`foo\${
                bar}\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                \`foo\${
                    \`bar\${
                baz}\`}\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                \`foo\${
                    \`bar\${
                  baz
                    }\`
                  }\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                \`foo\${
                (
                  bar
                )
                }\`
            `,
			options: [2],
		},
		{
			code: unIndent`
                function foo() {
                    \`foo\${bar}baz\${
                qux}foo\${
                  bar}baz\`
                }
            `,
		},
		{
			code: unIndent`
                function foo() {
                    const template = \`the indentation of
                a curly element in a \${
                        node.type
                    } node is checked.\`;
                }
            `,
		},
		{
			code: unIndent`
                function foo() {
                    const template = \`this time the
                closing curly is at the end of the line \${
                            foo}
                        so the spaces before this line aren't removed.\`;
                }
            `,
		},
		{
			/*
			 * https://github.com/eslint/eslint/issues/1801
			 * Note: This issue also mentioned checking the indentation for the 2 below. However,
			 * this is intentionally ignored because everyone seems to have a different idea of how
			 * BinaryExpressions should be indented.
			 */
			code: unIndent`
                if (true) {
                    a = (
                1 +
                        2);
                }
            `,
		},
		{
			// https://github.com/eslint/eslint/issues/3737
			code: unIndent`
                if (true) {
                    for (;;) {
                      b();
                  }
                }
            `,
			options: [2],
		},
		{
			// https://github.com/eslint/eslint/issues/6670
			code: unIndent`
                function f() {
                    return asyncCall()
                    .then(
                               'some string',
                              [
                              1,
                         2,
                                                   3
                                      ]
                );
                 }
            `,
			options: [
				4,
				{ MemberExpression: 1, CallExpression: { arguments: 1 } },
			],
		},

		// https://github.com/eslint/eslint/issues/7242
		{
			code: unIndent`
                var x = [
                      [1],
                  [2]
                ]
            `,
		},
		{
			code: unIndent`
                var y = [
                      {a: 1},
                  {b: 2}
                ]
            `,
		},
		{
			code: unIndent`
                echo = spawn('cmd.exe',
                            ['foo', 'bar',
                             'baz']);
            `,
			options: [
				2,
				{
					ArrayExpression: "first",
					CallExpression: { arguments: "first" },
				},
			],
		},
		{
			// https://github.com/eslint/eslint/issues/7522
			code: unIndent`
                foo(
                  )
            `,
		},
		{
			// https://github.com/eslint/eslint/issues/7616
			code: unIndent`
                foo(
                        bar,
                    {
                        baz: 1
                    }
                )
            `,
			options: [4, { CallExpression: { arguments: "first" } }],
		},
		{
			code: "  new Foo",
		},
		{
			code: unIndent`
                var foo = 0, bar = 0, baz = 0;
                export {
                foo,
                        bar,
                  baz
                }
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                foo
                    ? bar
                : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ?
                    bar :
                baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ?
                    bar
                  : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo
                    ? bar :
                baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ? bar
                    : baz ? qux
                        : foobar ? boop
                            : beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ? bar :
                    baz ? qux :
                        foobar ? boop :
                            beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                var a =
                    foo ? bar :
                      baz ? qux :
                  foobar ? boop :
                    /*else*/ beep
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                var a =
                    foo
                    ? bar
                    : baz
            `,
			options: [4, { flatTernaryExpressions: true }],
		},
		{
			code: unIndent`
                foo ? bar
                    : baz ? qux
                    : foobar ? boop
                    : beep
            `,
			options: [4, { flatTernaryExpressions: false }],
		},
		{
			code: unIndent`
                foo ? bar :
                    baz ? qux :
                    foobar ? boop :
                    beep
            `,
			options: [4, { flatTernaryExpressions: false }],
		},
		{
			code: unIndent`
                foo
                    ? bar
                    : baz
                    ? qux
                    : foobar
                    ? boop
                    : beep
            `,
			options: [4, { flatTernaryExpressions: false }],
		},
		{
			code: unIndent`
                foo ?
                    bar :
                    baz ?
                    qux :
                    foobar ?
                    boop :
                    beep
            `,
			options: [4, { flatTernaryExpressions: false }],
		},
		{
			code: unIndent`
                foo.bar('baz', function(err) {
                          qux;
                });
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                foo.bar(function() {
                  cookies;
                }).baz(function() {
                    cookies;
                  });
            `,
			options: [2, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                foo.bar().baz(function() {
                  cookies;
                }).qux(function() {
                    cookies;
                  });
            `,
			options: [2, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                [ foo,
                  bar ].forEach(function() {
                    baz;
                  })
            `,
			options: [2, { ArrayExpression: "first", MemberExpression: 1 }],
		},
		{
			code: unIndent`
                foo[
                    bar
                    ];
            `,
			options: [4, { MemberExpression: 1 }],
		},
		{
			code: unIndent`
                foo({
                bar: 1,
                baz: 2
                })
            `,
			options: [4, { ObjectExpression: "first" }],
		},
		{
			code: unIndent`
                foo(
                                        bar, baz,
                                        qux);
            `,
			options: [2, { CallExpression: { arguments: "first" } }],
		},
		{
			code: unIndent`
                if (foo) bar()

                    ; [1, 2, 3].map(baz)
            `,
		},
		{
			code: unIndent`
                if (foo)
                ;
            `,
		},
		{
			code: unIndent`
                import {foo}
                from 'bar';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                export {foo}
                from 'bar';
            `,
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: unIndent`
                (
                    a
                ) => b => {
                        c
                    }
            `,
		},
		{
			code: unIndent`
                (
                    a
                ) => b => c => d => {
                        e
                    }
            `,
		},
		{
			code: unIndent`
                if (
                    foo
                ) bar(
                        baz
                    );
            `,
		},
		{
			code: unIndent`
                (
                    foo
                )(
                        bar
                    )
            `,
		},
		{
			code: unIndent`
                (() =>
                    foo
                )(
                        bar
                    )
            `,
		},
		{
			code: unIndent`
                (() => {
                    foo();
                })(
                        bar
                    )
            `,
		},
		{
			code: unIndent`
                foo.
                  bar.
                      baz
            `,
		},
		{
			code: unIndent`
                const foo = a.b(),
                    longName
                    = (baz(
                            'bar',
                            'bar'
                        ));
            `,
		},
		{
			code: unIndent`
                const foo = a.b(),
                    longName =
                    (baz(
                            'bar',
                            'bar'
                        ));
            `,
		},
		{
			code: unIndent`
                const foo = a.b(),
                    longName
                        =baz(
                            'bar',
                            'bar'
                    );
            `,
		},
		{
			code: unIndent`
                const foo = a.b(),
                    longName
                        =(
                        'fff'
                        );
            `,
		},

		//----------------------------------------------------------------------
		// Ignore Unknown Nodes
		//----------------------------------------------------------------------

		{
			code: unIndent`
                namespace Foo {
                    const bar = 3,
                    baz = 2;

                    if (true) {
                    const bax = 3;
                    }
                }
            `,
			languageOptions: {
				parser: require(parser("unknown-nodes/namespace-invalid")),
			},
		},
		{
			code: unIndent`
                abstract class Foo {
                    public bar() {
                        let aaa = 4,
                        boo;

                        if (true) {
                        boo = 3;
                        }

                    boo = 3 + 2;
                    }
                }
            `,
			languageOptions: {
				parser: require(parser("unknown-nodes/abstract-class-invalid")),
			},
		},
		{
			code: unIndent`
                function foo() {
                    function bar() {
                        abstract class X {
                        public baz() {
                        if (true) {
                        qux();
                        }
                        }
                        }
                    }
                }
            `,
			languageOptions: {
				parser: require(
					parser(
						"unknown-nodes/functions-with-abstract-class-invalid",
					),
				),
			},
		},
		{
			code: unIndent`
                namespace Unknown {
                    function foo() {
                    function bar() {
                            abstract class X {
                                public baz() {
                                    if (true) {
                                    qux();
                                    }
                                }
                            }
                        }
                    }
                }
            `,
			languageOptions: {
				parser: require(
					parser(
						"unknown-nodes/namespace-with-functions-with-abstract-class-invalid",
					),
				),
			},
		},

		//----------------------------------------------------------------------
		// JSX tests
		// Some of the following tests are adapted from the tests in eslint-plugin-react.
		// License: https://github.com/yannickcr/eslint-plugin-react/blob/7ca9841f22d599f447a27ef5b2a97def9229d6c8/LICENSE
		//----------------------------------------------------------------------

		{
			code: unIndent`
                <App>
                  <Foo />
                </App>
            `,
		},
		{
			code: unIndent`
                <App>
                    <Foo />
                </App>
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App>
                    <Foo />
                </App>
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                function App() {
                  return <App>
                    <Foo />
                         </App>;
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function App() {
                  return (<App>
                    <Foo />
                    </App>);
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                function App() {
                  return (
                <App>
                  <Foo />
                </App>
                  );
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App>
                 {test}
                </App>
            `,
		},
		{
			code: unIndent`
                <App>
                    {options.map((option, index) => (
                        <option key={index} value={option.key}>
                           {option.name}
                        </option>
                    ))}
                </App>
            `,
		},
		{
			code: unIndent`
                [
                  <div />,
                    <div />
                ]
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App>

                 <Foo />

                </App>
            `,
			options: ["tab"],
		},
		{
			/*
			 * Multiline ternary
			 * (colon at the end of the first expression)
			 */
			code: unIndent`
                foo ?
                    <Foo /> :
                <Bar />
            `,
		},
		{
			/*
			 * Multiline ternary
			 * (colon on its own line)
			 */
			code: unIndent`
                foo ?
                    <Foo />
                :
                <Bar />
            `,
		},
		{
			/*
			 * Multiline ternary
			 * (colon at the end of the first expression, parenthesized first expression)
			 */
			code: unIndent`
                foo ? (
                    <Foo />
                ) :
                <Bar />
            `,
		},
		{
			code: unIndent`
                <App
                  foo
                />
            `,
		},
		{
			code: unIndent`
                <App
                  foo
                  />
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App
                  foo
                  ></App>
            `,
			options: [2],
		},
		{
			code: unIndent`
                const Button = function(props) {
                  return (
                    <Button
                      size={size}
                      onClick={onClick}
                                                    >
                      Button Text
                    </Button>
                  );
                };
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = function() {
                  return <App
                    foo
                         />
                }
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = <App
                  foo
                        />
            `,
			options: [2],
		},
		{
			code: unIndent`
                var x = (
                  <Something
                    />
                )
            `,
			options: [2],
		},
		{
			code: unIndent`
                <App
                \tfoo
                \t/>
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                <App
                \tfoo
                \t></App>
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                <
                    foo
                    .bar
                    .baz
                >
                    foo
                </
                    foo.
                    bar.
                    baz
                >
            `,
		},
		{
			code: unIndent`
                <
                    input
                    type=
                    "number"
                />
            `,
		},
		{
			code: unIndent`
                <
                    input
                    type=
                    {'number'}
                />
            `,
		},
		{
			code: unIndent`
                <
                    input
                    type
                    ="number"
                />
            `,
		},
		{
			code: unIndent`
                foo ? (
                    bar
                ) : (
                        baz
                    )
            `,
		},
		{
			code: unIndent`
                foo ? (
                    <div>
                    </div>
                ) : (
                        <span>
                        </span>
                    )
            `,
		},
		{
			code: unIndent`
                <div>
                    {
                    (
                        1
                    )
                    }
                </div>
            `,
		},
		{
			code: unIndent`
                <div>
                    {
                      /* foo */
                    }
                </div>
            `,
		},
		{
			code: unIndent`
                <div
                {...props}
                />
            `,
		},
		{
			code: unIndent`
                <div
                    {
                      ...props
                    }
                />
            `,
		},
		{
			code: unIndent`
                <div>foo
                <div>bar</div>
                </div>
            `,
		},
		{
			code: unIndent`
                <small>Foo bar&nbsp;
                <a>baz qux</a>.
                </small>
            `,
		},

		/*
		 * JSX Fragments
		 * https://github.com/eslint/eslint/issues/12208
		 */
		{
			code: unIndent`
                <>
                <A />
                </>
            `,
		},
		{
			code: unIndent`
                <
                    >
                    <A />
                </>
            `,
		},
		{
			code: unIndent`
                <>
                    <A />
                <
                    />
            `,
		},
		{
			code: unIndent`
                <>
                    <A />
                </
                    >
            `,
		},
		{
			code: unIndent`
                <
                    >
                    <A />
                </
                    >
            `,
		},
		{
			code: unIndent`
                <
                    >
                    <A />
                <
                    />
            `,
		},
		{
			code: unIndent`
                < // Comment
                    >
                    <A />
                </>
            `,
		},
		{
			code: unIndent`
                <>
                    <A />
                < // Comment
                    />
            `,
		},
		{
			code: unIndent`
                <>
                    <A />
                </ // Comment
                    >
            `,
		},
		{
			code: unIndent`
                < /* Comment */
                    >
                    <A />
                </>
            `,
		},
		{
			code: unIndent`
                <>
                    <A />
                < /* Comment */
                    />
            `,
		},
		{
			code: unIndent`
                <>
                    <A />
                </ /* Comment */
                    >
            `,
		},

		{
			code: unIndent`
                ({
                    foo
                    }: bar) => baz
            `,
			languageOptions: {
				parser: require("../../fixtures/parsers/babel-eslint7/object-pattern-with-annotation"),
			},
		},
		{
			code: unIndent`
                ([
                    foo
                    ]: bar) => baz
            `,
			languageOptions: {
				parser: require("../../fixtures/parsers/babel-eslint7/array-pattern-with-annotation"),
			},
		},
		{
			code: unIndent`
                ({
                    foo
                    }: {}) => baz
            `,
			languageOptions: {
				parser: require("../../fixtures/parsers/babel-eslint7/object-pattern-with-object-annotation"),
			},
		},
		{
			code: unIndent`
                class Foo {
                foo() {
                bar();
                }
                }
            `,
			options: [4, { ignoredNodes: ["ClassBody"] }],
		},
		{
			code: unIndent`
                $(function() {

                foo();
                bar();

                foo(function() {
                baz();
                });

                });
            `,
			options: [
				4,
				{
					ignoredNodes: [
						"ExpressionStatement > CallExpression[callee.name='$'] > FunctionExpression > BlockStatement",
					],
				},
			],
		},
		{
			code: unIndent`
                (function($) {
                $(function() {
                foo;
                });
                })()
            `,
			options: [
				4,
				{
					ignoredNodes: [
						"ExpressionStatement > CallExpression > FunctionExpression.callee > BlockStatement",
					],
				},
			],
		},
		{
			code: unIndent`
                if (foo) {
                    doSomething();

                // Intentionally unindented comment
                    doSomethingElse();
                }
            `,
			options: [4, { ignoreComments: false }],
		},
		{
			code: unIndent`
                if (foo) {
                    doSomething();

                /* Intentionally unindented comment */
                    doSomethingElse();
                }
            `,
			options: [4, { ignoreComments: false }],
		},
		{
			code: unIndent`
                const obj = {
                    foo () {
                        return condition ? // comment
                        1 :
                            2
                    }
                }
            `,
		},

		//----------------------------------------------------------------------
		// Comment alignment tests
		//----------------------------------------------------------------------
		{
			code: unIndent`
                if (foo) {

                // Comment cannot align with code immediately above if there is a whitespace gap
                    doSomething();
                }
            `,
		},
		{
			code: unIndent`
                if (foo) {
                    foo(
                        bar);
                // Comment cannot align with code immediately below if there is a whitespace gap

                }
            `,
		},
		{
			code: unIndent`
                [{
                    foo
                },

                    // Comment between nodes

                {
                    bar
                }];
            `,
		},
		{
			code: unIndent`
                let foo

                    // comment

                ;(async () => {})()
            `,
		},
		{
			code: unIndent`
                let foo
                    // comment
                ;(async () => {})()
            `,
		},
		{
			code: unIndent`
                let foo

                /* comment */;

                (async () => {})()
            `,
		},
		{
			code: unIndent`
                    // comment

                ;(async () => {})()
            `,
		},
		{
			code: unIndent`
                    // comment
                ;(async () => {})()
            `,
		},
		{
			code: unIndent`
                {
                    let foo

                        // comment

                    ;(async () => {})()

                }
            `,
		},
		{
			code: unIndent`
                {
                    let foo
                        // comment
                    ;(async () => {})()

                }
            `,
		},
		{
			code: unIndent`
                {
                    let foo

                    /* comment */;

                    (async () => {})()

                }
            `,
		},
		{
			code: unIndent`
                const foo = 1
                const bar = foo

                    /* comment */

                ;[1, 2, 3].forEach(() => {})
            `,
		},
		{
			code: unIndent`
                const foo = 1
                const bar = foo
                    /* comment */
                ;[1, 2, 3].forEach(() => {})
            `,
		},
		{
			code: unIndent`
                const foo = 1
                const bar = foo

                /* comment */;

                [1, 2, 3].forEach(() => {})
            `,
		},
		{
			code: unIndent`
                    /* comment */

                ;[1, 2, 3].forEach(() => {})
            `,
		},
		{
			code: unIndent`
                    /* comment */
                ;[1, 2, 3].forEach(() => {})
            `,
		},
		{
			code: unIndent`
                {
                    const foo = 1
                    const bar = foo

                        /* comment */

                    ;[1, 2, 3].forEach(() => {})

                }
            `,
		},
		{
			code: unIndent`
                {
                    const foo = 1
                    const bar = foo
                        /* comment */
                    ;[1, 2, 3].forEach(() => {})

                }
            `,
		},
		{
			code: unIndent`
                {
                    const foo = 1
                    const bar = foo

                    /* comment */;

                    [1, 2, 3].forEach(() => {})

                }
            `,
		},

		// import expressions
		{
			code: unIndent`
                import(
                source
                    )
            `,
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/12122
		{
			code: unIndent`
                foo(() => {
                    tag\`
                    multiline
                    template\${a} \${b}
                    literal
                    \`(() => {
                    bar();
                    });
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                {
                        tag\`
                    multiline
                    template
                    literal
                    \${a} \${b}\`(() => {
                            bar();
                        });
                }
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo(() => {
                    tagOne\`\${a} \${b}
                    multiline
                    template
                    literal
                    \`(() => {
                            tagTwo\`
                        multiline
                        template
                        literal
                        \`(() => {
                            bar();
                        });

                            baz();
                });
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                {
                    tagOne\`
                    multiline
                    template
                    literal
                    \${a} \${b}\`(() => {
                            tagTwo\`
                        multiline
                        template
                        literal
                        \`(() => {
                            bar();
                        });

                            baz();
                });
                }
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                tagOne\`multiline \${a} \${b}
                        template
                        literal
                        \`(() => {
                foo();

                    tagTwo\`multiline
                            template
                            literal
                        \`({
                    bar: 1,
                        baz: 2
                    });
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                tagOne\`multiline
                    template \${a} \${b}
                    literal\`({
                        foo: 1,
                bar: tagTwo\`multiline
                        template
                        literal\`(() => {

                baz();
                    })
                });
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo.bar\` template literal \`(() => {
                        baz();
                })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo.bar.baz\` template literal \`(() => {
                baz();
                    })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .bar\` template
                        literal \`(() => {
                        baz();
                })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .test\`
                    \${a} \${b}
                    \`(() => {
                bar();
                    })
            `,
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: unIndent`
                foo
                    .test\`
                    \${a} \${b}
                    \`(() => {
                bar();
                    })
            `,
			options: [4, { MemberExpression: 0 }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// Optional chaining
		{
			code: unIndent`
                obj
                ?.prop
                ?.[key]
                ?.
                [key]
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: unIndent`
                (
                    longSomething
                        ?.prop
                        ?.[key]
                )
                ?.prop
                ?.[key]
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: unIndent`
                obj
                ?.(arg)
                ?.
                (arg)
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: unIndent`
                (
                    longSomething
                        ?.(arg)
                        ?.(arg)
                )
                ?.(arg)
                ?.(arg)
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: unIndent`
                const foo = async (arg1,
                                    arg2) =>
                {
                  return arg1 + arg2;
                }
            `,
			options: [
				2,
				{
					FunctionDeclaration: { parameters: "first" },
					FunctionExpression: { parameters: "first" },
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: unIndent`
                const a = async
                 b => {}
            `,
			options: [2],
		},
		{
			code: unIndent`
                class C {
                field1;
                static field2;
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                field1
                =
                0
                ;
                static
                field2
                =
                0
                ;
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                [
                field1
                ]
                =
                0
                ;
                static
                [
                field2
                ]
                =
                0
                ;
                [
                field3
                ] =
                0;
                [field4] =
                0;
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                field1 = (
                foo
                + bar
                );
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                #aaa
                foo() {
                return this.#aaa
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                foo();
                bar();
                }
                }
            `,
			options: [2],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                foo();
                bar();
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                        static {
                    foo();
                bar();
                        }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                foo();
                bar();
                }
                }
            `,
			options: [4, { StaticBlock: { body: 2 } }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                foo();
                bar();
                }
                }
            `,
			options: [4, { StaticBlock: { body: 0 } }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                foo();
                bar();
                }
                }
            `,
			options: ["tab"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                foo();
                bar();
                }
                }
            `,
			options: ["tab", { StaticBlock: { body: 2 } }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static
                {
                foo();
                bar();
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                    static
                        {
                        foo();
                        bar();
                        }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                var x,
                y;
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static
                {
                var x,
                y;
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                if (foo) {
                bar;
                }
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {
                {
                bar;
                }
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                static {}

                static {
                }

                static
                {
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {

                static {
                    foo;
                }

                static {
                    bar;
                }

                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {

                x = 1;

                static {
                    foo;
                }

                y = 2;

                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {

                method1(param) {
                    foo;
                }

                static {
                    bar;
                }

                method2(param) {
                    foo;
                }

                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                function f() {
                class C {
                static {
                foo();
                bar();
                }
                }
                }
            `,
			options: [4],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: unIndent`
                class C {
                method() {
                foo;
                }
                static {
                bar;
                }
                }
            `,
			options: [
				4,
				{ FunctionExpression: { body: 2 }, StaticBlock: { body: 2 } },
			],
			languageOptions: { ecmaVersion: 2022 },
		},

		// https://github.com/eslint/eslint/issues/15930
		{
			code: unIndent`
                if (2 > 1)
                \tconsole.log('a')
                \t;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                if (2 > 1)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo) bar();
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo) bar()
                    ;baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar();
                    baz();
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                    ; baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                    ;baz()
                    qux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                    ;else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                else
                    baz()
                    ;qux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    if (bar)
                        baz()
                    ;qux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                else if (baz)
                    qux()
                    ;quux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    if (bar)
                        baz()
                    else
                        qux()
                    ;quux()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    bar()
                ;
                baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                ;
                baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    ;baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo);
                    else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                ;
                else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                if (foo)
                    ;else
                    baz()
            `,
			options: [4],
		},
		{
			code: unIndent`
                do foo();
                    while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do foo()
                    ;while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                    foo();
                    while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                    foo()
                    ;while (bar)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do;
                    while (foo)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                ;
                while (foo)
            `,
			options: [4],
		},
		{
			code: unIndent`
                do
                    ;while (foo)
            `,
			options: [4],
		},
		{
			code: unIndent`
                while (2 > 1)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (;;)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (a in b)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                for (a of b)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                with (a)
                    console.log(b)
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                label: for (a of b)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},
		{
			code: unIndent`
                label:
                for (a of b)
                    console.log('a')
                    ;[1, 2, 3].forEach(x=>console.log(x))
            `,
			options: [4],
		},

		// https://github.com/eslint/eslint/issues/17316
		{
			code: unIndent`
                if (foo)
                \tif (bar) doSomething();
                \telse doSomething();
                else
                if (bar) doSomething();
                else doSomething();
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                if (foo)
                \tif (bar) doSomething();
                \telse doSomething();
                else
                \t\tif (bar) doSomething();
                \t\telse doSomething();
            `,
			options: ["tab"],
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (bar) doSomething();
                else doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (bar)
                doSomething();
                else doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (bar) doSomething();
                else
                doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (bar)
                    doSomething();
                else
                doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else if (bar) doSomething();
                    else doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                    else if (bar)
                        doSomething();
                    else doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else if (bar) doSomething();
                     else
                         doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else if (bar)
                doSomething();
                else
                doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                    if (bar) doSomething();
                    else doSomething();

            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (foo)
                if (bar) doSomething();
                else
                if (bar) doSomething();
                else doSomething();
                else doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                if (bar) doSomething();
                else doSomething();
                else if (foo) doSomething();
                    else doSomething();
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else if (foo) {
                doSomething();
                }
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else if (foo)
                    {
                        doSomething();
                    }
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (foo) {
                    doSomething();
                }
            `,
		},
		{
			code: unIndent`
                if (foo)
                    if (bar) doSomething();
                    else doSomething();
                else
                if (foo)
                {
                    doSomething();
                }
            `,
		},
	],
};
