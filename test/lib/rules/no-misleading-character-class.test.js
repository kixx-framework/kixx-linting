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

import {
    describe,
    assertEqual,
    assertNonEmptyString,
} from "../../deps.js";

import { lintText } from "../../../mod.js";

const valid = [
    { text: "var r = /[👍]/u" },
    { text: "var r = /[\\uD83D\\uDC4D]/u" },
    { text: "var r = /[\\u{1F44D}]/u" },
    { text: "var r = /❇️/" },
    { text: "var r = /Á/" },
    { text: "var r = /[❇]/" },
    { text: "var r = /👶🏻/" },
    { text: "var r = /[👶]/u" },
    { text: "var r = /🇯🇵/" },
    { text: "var r = /[JP]/" },
    { text: "var r = /👨‍👩‍👦/" },
    { text: "new RegExp()" },
    { text: "var r = RegExp(/[👍]/u)" },
    { text: "const regex = /[👍]/u; new RegExp(regex);" },
    {
        code: "new RegExp('[👍]')",
        languageOptions: { globals: { RegExp: "off" } },
    },

    // Ignore solo lead/tail surrogate.
    { text: "var r = /[\\uD83D]/" },
    { text: "var r = /[\\uDC4D]/" },
    { text: "var r = /[\\uD83D]/u" },
    { text: "var r = /[\\uDC4D]/u" },

    // Ignore solo combining char.
    { text: "var r = /[\\u0301]/" },
    { text: "var r = /[\\uFE0F]/" },
    { text: "var r = /[\\u0301]/u" },
    { text: "var r = /[\\uFE0F]/u" },

    // Ignore solo emoji modifier.
    { text: "var r = /[\\u{1F3FB}]/u" },
    { text: "var r = /[\u{1F3FB}]/u" },

    // Ignore solo regional indicator symbol.
    { text: "var r = /[🇯]/u" },
    { text: "var r = /[🇵]/u" },

    // Ignore solo ZWJ.
    { text: "var r = /[\\u200D]/" },
    { text: "var r = /[\\u200D]/u" },

    // don't report and don't crash on invalid regex
    { text: "new RegExp('[Á] [ ');" },
    { text: "var r = new RegExp('[Á] [ ');" },
    { text: "var r = RegExp('{ [Á]', 'u');" },
    {
        code: "var r = new globalThis.RegExp('[Á] [ ');",
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: "var r = globalThis.RegExp('{ [Á]', 'u');",
        languageOptions: { ecmaVersion: 2020 },
    },

    // don't report on templates with expressions
    // eslint-disable-next-line no-template-curly-in-string
    { text: "var r = RegExp(`${x}[👍]`)" },

    // don't report on unknown flags
    // eslint-disable-next-line no-template-curly-in-string
    { text: "var r = new RegExp('[🇯🇵]', `${foo}`)" },
    { text: String.raw`var r = new RegExp("[👍]", flags)` },

    // don't report on spread arguments
    { text: "const args = ['[👍]', 'i']; new RegExp(...args);" },

    // ES2024
    { code: "var r = /[👍]/v", languageOptions: { ecmaVersion: 2024 } },
    {
        code: String.raw`var r = /^[\q{👶🏻}]$/v`,
        languageOptions: { ecmaVersion: 2024 },
    },
    {
        code: String.raw`var r = /[🇯\q{abc}🇵]/v`,
        languageOptions: { ecmaVersion: 2024 },
    },
    { code: "var r = /[🇯[A]🇵]/v", languageOptions: { ecmaVersion: 2024 } },
    {
        code: "var r = /[🇯[A--B]🇵]/v",
        languageOptions: { ecmaVersion: 2024 },
    },

    // allowEscape
    {
        code: String.raw`/[\ud83d\udc4d]/`,
        options: [{ allowEscape: true }],
    },
    {
        code: '/[\ud83d\\udc4d]/u // U+D83D + Backslash + "udc4d"',
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[A\u0301]/`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[👶\u{1f3fb}]/u`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[\u{1F1EF}\u{1F1F5}]/u`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[👨\u200d👩\u200d👦]/u`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[\u00B7\u0300-\u036F]/u`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[\n\u0305]/`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp("[\uD83D\uDC4D]")`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp("[A\u0301]")`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp("[\x41\\u0301]")`,
        options: [{ allowEscape: true }],
    },
    {
        code: 'RegExp(`[\\uD83D\\uDC4D]`) // Backslash + "uD83D" + Backslash + "uDC4D"',
        options: [{ allowEscape: true }],
    },
];

const invalid = [
    // RegExp Literals.
    {
        code: "var r = /[👍]/",
    },
    {
        code: "var r = /[\\uD83D\\uDC4D]/",
    },
    {
        code: "var r = /[\\uD83D\\uDC4D-\\uffff]/",
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
    {
        code: "var r = /[👍]/",
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
    {
        code: "var r = /before[\\uD83D\\uDC4D]after/",
    },
    {
        code: "var r = /[before\\uD83D\\uDC4Dafter]/",
    },
    {
        code: "var r = /\\uDC4D[\\uD83D\\uDC4D]/",
    },
    {
        code: "var r = /[👍]/",
        languageOptions: { ecmaVersion: 5, sourceType: "script" },
    },
    {
        code: "var r = /[👍]\\a/",
    },
    {
        code: "var r = /\\a[👍]\\a/",
    },
    {
        code: "var r = /(?<=[👍])/",
        languageOptions: { ecmaVersion: 9 },
    },
    {
        code: "var r = /(?<=[👍])/",
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        code: "var r = /[Á]/",
    },
    {
        code: "var r = /[Á]/u",
    },
    {
        code: "var r = /[\\u0041\\u0301]/",
    },
    {
        code: "var r = /[\\u0041\\u0301]/u",
    },
    {
        code: "var r = /[\\u{41}\\u{301}]/u",
    },
    {
        code: "var r = /[❇️]/",
    },
    {
        code: "var r = /[❇️]/u",
    },
    {
        code: "var r = /[\\u2747\\uFE0F]/",
    },
    {
        code: "var r = /[\\u2747\\uFE0F]/u",
    },
    {
        code: "var r = /[\\u{2747}\\u{FE0F}]/u",
    },
    {
        code: "var r = /[👶🏻]/",
    },
    {
        code: "var r = /[👶🏻]/u",
    },
    {
        code: "var r = /[a\\uD83C\\uDFFB]/u",
    },
    {
        code: "var r = /[\\uD83D\\uDC76\\uD83C\\uDFFB]/u",
    },
    {
        code: "var r = /[\\u{1F476}\\u{1F3FB}]/u",
    },
    {
        code: "var r = /[🇯🇵]/",
    },
    {
        code: "var r = /[🇯🇵]/i",
    },
    {
        code: "var r = /[🇯🇵]/u",
    },
    {
        code: "var r = /[\\uD83C\\uDDEF\\uD83C\\uDDF5]/u",
    },
    {
        code: "var r = /[\\u{1F1EF}\\u{1F1F5}]/u",
    },
    {
        code: "var r = /[👨‍👩‍👦]/",
    },
    {
        code: "var r = /[👨‍👩‍👦]/u",
    },
    {
        code: "var r = /[👩‍👦]/u",
    },
    {
        code: "var r = /[👩‍👦][👩‍👦]/u",
    },
    {
        code: "var r = /[👨‍👩‍👦]foo[👨‍👩‍👦]/u",
    },
    {
        code: "var r = /[👨‍👩‍👦👩‍👦]/u",
    },
    {
        code: "var r = /[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66]/u",
    },
    {
        code: "var r = /[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]/u",
    },
    {
        code: "var r = /[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69]/u",
    },
    {
        code: "var r = /[\\u{1F468}\\u{200D}\\u{1F469}]/u",
    },
    {
        code: "var r = /[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]foo[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]/u",
    },

    // RegExp constructors.
    {
        code: String.raw`var r = RegExp("[👍]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[👍]", "")`,
    },
    {
        code: "var r = new RegExp('[👍]', ``)",
    },
    {
        code: `var r = new RegExp(\`
                [👍]\`)`,
    },
    {
        code: `var r = new RegExp(\`
                [❇️]\`)`,
    },
    {
        code: "var r = new RegExp(`\r\n[❇️]`)",
    },
    {
        code: String.raw`const flags = ""; var r = new RegExp("[👍]", flags)`,
    },
    {
        code: String.raw`var r = RegExp("[\\uD83D\\uDC4D]", "")`,
    },
    {
        code: String.raw`var r = RegExp("before[\\uD83D\\uDC4D]after", "")`,
    },
    {
        code: String.raw`var r = RegExp("[before\\uD83D\\uDC4Dafter]", "")`,
    },
    {
        code: String.raw`var r = RegExp("\t\t\t👍[👍]")`,
    },
    {
        code: String.raw`var r = new RegExp("\u1234[\\uD83D\\uDC4D]")`,
    },
    {
        code: String.raw`var r = new RegExp("\\u1234\\u5678👎[👍]")`,
    },
    {
        code: String.raw`var r = new RegExp("\\u1234\\u5678👍[👍]")`,
    },
    {
        code: String.raw`var r = new RegExp("[👍]", "")`,
        languageOptions: { ecmaVersion: 3, sourceType: "script" },
    },
    {
        code: String.raw`var r = new RegExp("[👍]", "")`,
        languageOptions: { ecmaVersion: 5, sourceType: "script" },
    },
    {
        code: String.raw`var r = new RegExp("[👍]\\a", "")`,
    },
    {
        code: String.raw`var r = new RegExp("/(?<=[👍])", "")`,
        languageOptions: { ecmaVersion: 9 },
    },
    {
        code: String.raw`var r = new RegExp("/(?<=[👍])", "")`,
        languageOptions: { ecmaVersion: 2018 },
    },
    {
        code: String.raw`var r = new RegExp("[Á]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[Á]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u0041\\u0301]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u0041\\u0301]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u{41}\\u{301}]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[❇️]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[❇️]", "u")`,
    },
    {
        code: String.raw`new RegExp("[ \\ufe0f]", "")`,
    },
    {
        code: String.raw`new RegExp("[ \\ufe0f]", "u")`,
    },
    {
        code: String.raw`new RegExp("[ \\ufe0f][ \\ufe0f]")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u2747\\uFE0F]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u2747\\uFE0F]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u{2747}\\u{FE0F}]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[👶🏻]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[👶🏻]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\uD83D\\uDC76\\uD83C\\uDFFB]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u{1F476}\\u{1F3FB}]", "u")`,
    },
    {
        code: "var r = RegExp(`\t\t\t👍[👍]`)",
    },
    {
        code: "var r = RegExp(`\\t\\t\\t👍[👍]`)",
    },
    {
        code: String.raw`var r = new RegExp("[🇯🇵]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[🇯🇵]", "i")`,
    },
    {
        code: "var r = new RegExp('[🇯🇵]', `i`)",
    },
    {
        code: String.raw`var r = new RegExp("[🇯🇵]")`,
    },
    {
        code: String.raw`var r = new RegExp("[🇯🇵]",)`,
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        code: String.raw`var r = new RegExp(("[🇯🇵]"))`,
    },
    {
        code: String.raw`var r = new RegExp((("[🇯🇵]")))`,
    },
    {
        code: String.raw`var r = new RegExp(("[🇯🇵]"),)`,
        languageOptions: { ecmaVersion: 2017 },
    },
    {
        code: String.raw`var r = new RegExp("[🇯🇵]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\uD83C\\uDDEF\\uD83C\\uDDF5]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u{1F1EF}\\u{1F1F5}]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[👨‍👩‍👦]", "")`,
    },
    {
        code: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[👩‍👦]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[👩‍👦][👩‍👦]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[👨‍👩‍👦]foo[👨‍👩‍👦]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[👨‍👩‍👦👩‍👦]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66]", "u")`,
    },
    {
        code: String.raw`var r = new RegExp("[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]", "u")`,
    },
    {
        code: String.raw`var r = new globalThis.RegExp("[❇️]", "")`,
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: String.raw`var r = new globalThis.RegExp("[👶🏻]", "u")`,
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: String.raw`var r = new globalThis.RegExp("[🇯🇵]", "")`,
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: String.raw`var r = new globalThis.RegExp("[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]", "u")`,
        languageOptions: { ecmaVersion: 2020 },
    },
    {
        code: String.raw`/[\ud83d\u{dc4d}]/u`,
    },
    {
        code: String.raw`/[\u{d83d}\udc4d]/u`,
    },
    {
        code: String.raw`/[\u{d83d}\u{dc4d}]/u`,
    },
    {
        code: String.raw`/[\uD83D\u{DC4d}]/u`,
    },

    // no granular reports on templates with expressions
    {
        // eslint-disable-next-line no-template-curly-in-string
        code: 'new RegExp(`${"[👍🇯🇵]"}[😊]`);',
    },

    // no granular reports on identifiers
    {
        code: 'const pattern = "[👍]"; new RegExp(pattern);',
    },

    // second argument in RegExp should override flags in regex literal
    {
        code: "RegExp(/[a👍z]/u, '');",
    },

    /*
		 * These test cases have been disabled because of a limitation in Node.js 18, see https://github.com/eslint/eslint/pull/18082#discussion_r1506142421.
		 *
		 * {
		 *     code: "const pattern = /[👍]/u; RegExp(pattern, '');",
		 *     errors: [{
		 *         column: 33,
		 *         endColumn: 40,
		 *         messageId: "surrogatePairWithoutUFlag",
		 *         suggestions: [{
		 *             messageId: "suggestUnicodeFlag",
		 *             output: "const pattern = /[👍]/u; RegExp(pattern, 'u');"
		 *         }]
		 *     }]
		 * },
		 * {
		 *     code: "const pattern = /[👍]/g; RegExp(pattern, 'i');",
		 *     errors: [{
		 *         column: 19,
		 *         endColumn: 21,
		 *         messageId: "surrogatePairWithoutUFlag",
		 *         suggestions: [{
		 *             messageId: "suggestUnicodeFlag",
		 *             output: "const pattern = /[👍]/gu; RegExp(pattern, 'i');"
		 *         }]
		 *     }, {
		 *         column: 33,
		 *         endColumn: 40,
		 *         messageId: "surrogatePairWithoutUFlag",
		 *         suggestions: [{
		 *             messageId: "suggestUnicodeFlag",
		 *             output: "const pattern = /[👍]/g; RegExp(pattern, 'iu');"
		 *         }]
		 *     }]
		 * },
		 */

    // report only on regex literal if no flags are supplied
    {
        code: "RegExp(/[👍]/)",
    },

    // report only on RegExp call if a regex literal and flags are supplied
    {
        code: "RegExp(/[👍]/, 'i');",
    },

    // ignore RegExp if not built-in
    {
        code: "RegExp(/[👍]/, 'g');",
        languageOptions: { globals: { RegExp: "off" } },
    },

    {
        code: String.raw`

            // "[" and "]" escaped as "\x5B" and "\u005D"
            new RegExp("\x5B \\ufe0f\u005D")

            `,
    },
    {
        code: String.raw`

            // backslash escaped as "\u{5c}"
            new RegExp("[ \u{5c}ufe0f]")

            `,
    },
    {
        code: String.raw`

            // "0" escaped as "\60"
            new RegExp("[ \\ufe\60f]")

            `,
        languageOptions: { sourceType: "script" },
    },
    {
        code: String.raw`

            // "e" escaped as "\e"
            new RegExp("[ \\uf\e0f]")

            `,
    },
    {
        code: String.raw`

            // line continuation: backslash + <CR> + <LF>
            new RegExp('[ \\u<line continuation>fe0f]')

            `.replace("<line continuation>", "\\\r\n"),
    },
    {
        code: String.raw`

            // just a backslash escaped as "\\"
            new RegExp(<backtick>[.\\u200D.]<backtick>)

            `.replaceAll("<backtick>", "`"),
    },
    {
        code: String.raw`

            // "u" escaped as "\x75"
            new RegExp(<backtick>[.\\\x75200D.]<backtick>)

            `.replaceAll("<backtick>", "`"),
    },
    {
        code: String.raw`

            // unescaped <CR> <LF> counts as a single character
            new RegExp(<backtick>[<crlf>\\u200D.]<backtick>)

            `
            .replaceAll("<backtick>", "`")
            .replace("<crlf>", "\n"),
    },

    // ES2024

    {
        code: "var r = /[[👶🏻]]/v",
        languageOptions: { ecmaVersion: 2024 },
    },
    {
        code: "new RegExp(/^[👍]$/v, '')",
        languageOptions: {
            ecmaVersion: 2024,
        },
    },

    /*
		 * This test case has been disabled because of a limitation in Node.js 18, see https://github.com/eslint/eslint/pull/18082#discussion_r1506142421.
		 *
		 * {
		 *     code: "var r = /[👶🏻]/v; RegExp(r, 'v');",
		 *     languageOptions: {
		 *         ecmaVersion: 2024
		 *     },
		 *     errors: [{
		 *         column: 11,
		 *         endColumn: 15,
		 *         messageId: "emojiModifier",
		 *         suggestions: null
		 *     }, {
		 *         column: 27,
		 *         endColumn: 28,
		 *         messageId: "emojiModifier",
		 *         suggestions: null
		 *     }]
		 * }
		 */

    // allowEscape

    {
        code: String.raw`/[Á]/`,
        options: [{ allowEscape: false }],
    },
    {
        code: String.raw`/[Á]/`,
        options: [{ allowEscape: void 0 }],
    },
    {
        code: String.raw`/[\\̶]/`, // Backslash + Backslash + Combining Long Stroke Overlay
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[\n̅]/`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`/[\👍]/`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp('[\è]')`, // Backslash + Latin Small Letter E + Combining Grave Accent
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp('[\👍]')`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp('[\\👍]')`,
        options: [{ allowEscape: true }],
    },
    {
        code: String.raw`RegExp('[\❇️]')`,
        options: [{ allowEscape: true }],
    },
    {
        code: "RegExp(`[\\👍]`) // Backslash + U+D83D + U+DC4D",
        options: [{ allowEscape: true }],
    },
    {
        /*
			 * In this case the rule can determine the value of `pattern` statically but has no information about the source,
			 * so it doesn't know that escape sequences were used. This is a limitation with our tools.
			 */
        code: String.raw`const pattern = "[\x41\u0301]"; RegExp(pattern);`,
        options: [{ allowEscape: true }],
    },
];

describe("no-misleading-character-class", ({ describe }) => {

    const globalRules = { "no-misleading-character-class": ["error"] };

    describe("valid code", ({ it }) => {
        it("has expected outcomes", () => {
            valid.forEach(({ text, code, options, languageOptions }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-misleading-character-class"] = rules["no-misleading-character-class"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                if (res.errorCount > 0 || res.warningCount > 0) {
                    // eslint-disable-next-line no-console
                    console.error(res);
                }

                assertEqual(0, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);
            });
        });
    });

    describe("invalid code", ({ it }) => {
        it("has expected outcomes", () => {
            invalid.forEach(({ text, code, options, languageOptions, errors = 1 }, i) => {
                const sourceText = text ?? code;
                const file = { text: sourceText };

                let rules = globalRules;
                if (options) {
                    rules = structuredClone(globalRules);
                    rules["no-misleading-character-class"] = rules["no-misleading-character-class"].concat(options);
                }

                const res = lintText(file, rules, languageOptions);

                assertEqual(errors, res.errorCount, `errorCount:[${i}]:${sourceText.slice(0, 52)} ...`);
                assertEqual(0, res.warningCount, `warningCount:[${i}]:${sourceText.slice(0, 52)} ...`);

                res.messages.forEach((message) => {
                    assertEqual("no-misleading-character-class", message.ruleId, `message.ruleId:[${i}]:${sourceText.slice(0, 52)} ...`);
                    assertNonEmptyString(message.message, `message.message:[${i}]:${sourceText.slice(0, 52)} ...`);
                });
            });
        });
    });
});
