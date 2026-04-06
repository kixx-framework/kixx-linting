export default {
	valid: [
		{ code: "// any comment", options: [{ terms: ["fixme"] }] },
		{ code: "// any comment", options: [{ terms: ["fixme", "todo"] }] },
		"// any comment",
		{ code: "// any comment", options: [{ location: "anywhere" }] },
		{
			code: "// any comment with TODO, FIXME or XXX",
			options: [{ location: "start" }],
		},
		"// any comment with TODO, FIXME or XXX",
		{ code: "/* any block comment */", options: [{ terms: ["fixme"] }] },
		{
			code: "/* any block comment */",
			options: [{ terms: ["fixme", "todo"] }],
		},
		"/* any block comment */",
		{
			code: "/* any block comment */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/* any block comment with TODO, FIXME or XXX */",
			options: [{ location: "start" }],
		},
		"/* any block comment with TODO, FIXME or XXX */",
		"/* any block comment with (TODO, FIXME's or XXX!) */",
		{
			code: "// comments containing terms as substrings like TodoMVC",
			options: [{ terms: ["todo"], location: "anywhere" }],
		},
		{
			code: "// special regex characters don't cause a problem",
			options: [{ terms: ["[aeiou]"], location: "anywhere" }],
		},
		'/*eslint no-warning-comments: [2, { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]*/\n\nvar x = 10;\n',
		{
			code: '/*eslint no-warning-comments: [2, { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]*/\n\nvar x = 10;\n',
			options: [{ location: "anywhere" }],
		},
		{ code: "// foo", options: [{ terms: ["foo-bar"] }] },
		"/** multi-line block comment with lines starting with\nTODO\nFIXME or\nXXX\n*/",
		{ code: "//!TODO ", options: [{ decoration: ["*"] }] },
	],
	invalid: [
		{
			code: "// fixme",
		},
		{
			code: "// any fixme",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// any fixme",
			options: [{ terms: ["fixme"], location: "anywhere" }],
		},
		{
			code: "// any FIXME",
			options: [{ terms: ["fixme"], location: "anywhere" }],
		},
		{
			code: "// any fIxMe",
			options: [{ terms: ["fixme"], location: "anywhere" }],
		},
		{
			code: "/* any fixme */",
			options: [{ terms: ["FIXME"], location: "anywhere" }],
		},
		{
			code: "/* any FIXME */",
			options: [{ terms: ["FIXME"], location: "anywhere" }],
		},
		{
			code: "/* any fIxMe */",
			options: [{ terms: ["FIXME"], location: "anywhere" }],
		},
		{
			code: "// any fixme or todo",
			options: [{ terms: ["fixme", "todo"], location: "anywhere" }],
		},
		{
			code: "/* any fixme or todo */",
			options: [{ terms: ["fixme", "todo"], location: "anywhere" }],
		},
		{
			code: "/* any fixme or todo */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/* fixme and todo */",
		},
		{
			code: "/* fixme and todo */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/* any fixme */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/* fixme! */",
			options: [{ terms: ["fixme"] }],
		},
		{
			code: "// regex [litera|$]",
			options: [{ terms: ["[litera|$]"], location: "anywhere" }],
		},
		{
			code: "/* eslint one-var: 2 */",
			options: [{ terms: ["eslint"] }],
		},
		{
			code: "/* eslint one-var: 2 */",
			options: [{ terms: ["one"], location: "anywhere" }],
		},
		{
			code: "/* any block comment with TODO, FIXME or XXX */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/* any block comment with (TODO, FIXME's or XXX!) */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/** \n *any block comment \n*with (TODO, FIXME's or XXX!) **/",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// any comment with TODO, FIXME or XXX",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// TODO: something small",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// TODO: something really longer than 40 characters",
			options: [{ location: "anywhere" }],
		},
		{
			code: "/* TODO: something \n really longer than 40 characters \n and also a new line */",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// TODO: small",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// https://github.com/eslint/eslint/pull/13522#discussion_r470293411 TODO",
			options: [{ location: "anywhere" }],
		},
		{
			code: "// Comment ending with term followed by punctuation TODO!",
			options: [{ terms: ["todo"], location: "anywhere" }],
		},
		{
			code: "// Comment ending with term including punctuation TODO!",
			options: [{ terms: ["todo!"], location: "anywhere" }],
		},
		{
			code: "// Comment ending with term including punctuation followed by more TODO!!!",
			options: [{ terms: ["todo!"], location: "anywhere" }],
		},
		{
			code: "// !TODO comment starting with term preceded by punctuation",
			options: [{ terms: ["todo"], location: "anywhere" }],
		},
		{
			code: "// !TODO comment starting with term including punctuation",
			options: [{ terms: ["!todo"], location: "anywhere" }],
		},
		{
			code: "// !!!TODO comment starting with term including punctuation preceded by more",
			options: [{ terms: ["!todo"], location: "anywhere" }],
		},
		{
			code: "// FIX!term ending with punctuation followed word character",
			options: [{ terms: ["FIX!"], location: "anywhere" }],
		},
		{
			code: "// Term starting with punctuation preceded word character!FIX",
			options: [{ terms: ["!FIX"], location: "anywhere" }],
		},
		{
			code: "//!XXX comment starting with no spaces (anywhere)",
			options: [{ terms: ["!xxx"], location: "anywhere" }],
		},
		{
			code: "//!XXX comment starting with no spaces (start)",
			options: [{ terms: ["!xxx"], location: "start" }],
		},
		{
			code: "/*\nTODO undecorated multi-line block comment (start)\n*/",
			options: [{ terms: ["todo"], location: "start" }],
		},
		{
			code: "///// TODO decorated single-line comment with decoration array \n /////",
			options: [
				{ terms: ["todo"], location: "start", decoration: ["*", "/"] },
			],
		},
		{
			code: "///*/*/ TODO decorated single-line comment with multiple decoration characters (start) \n /////",
			options: [
				{ terms: ["todo"], location: "start", decoration: ["*", "/"] },
			],
		},
		{
			code: "//**TODO term starts with a decoration character",
			options: [
				{ terms: ["*todo"], location: "start", decoration: ["*"] },
			],
		},
	],
};
