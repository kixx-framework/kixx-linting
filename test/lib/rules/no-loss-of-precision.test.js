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
    { text: "var x = 12345" },
    { text: "var x = 123.456" },
    { text: "var x = -123.456" },
    { text: "var x = -123456" },
    { text: "var x = 123e34" },
    { text: "var x = 123.0e34" },
    { text: "var x = 123e-34" },
    { text: "var x = -123e34" },
    { text: "var x = -123e-34" },
    { text: "var x = 12.3e34" },
    { text: "var x = 12.3e-34" },
    { text: "var x = -12.3e34" },
    { text: "var x = -12.3e-34" },
    { text: "var x = 12300000000000000000000000" },
    { text: "var x = -12300000000000000000000000" },
    { text: "var x = 0.00000000000000000000000123" },
    { text: "var x = -0.00000000000000000000000123" },
    { text: "var x = 9007199254740991" },
    { text: "var x = 0" },
    { text: "var x = 0.0" },
    { text: "var x = 0.000000000000000000000000000000000000000000000000000000000000000000000000000000" },
    { text: "var x = -0" },
    { text: "var x = 123.0000000000000000000000" },
    // https://github.com/eslint/eslint/issues/19957
    { text: "var x = 9.00e2" },
    { text: "var x = 9.000e3" },
    { text: "var x = 9.0000000000e10" },
    { text: "var x = 9.00E2" },
    { text: "var x = 9.000E3" },
    { text: "var x = 9.100E3" },
    { text: "var x = 9.0000000000E10" },
    { text: "var x = 019.5" },
    { text: "var x = 0195" },
    { text: "var x = 00195" },
    { text: "var x = 0008" },
    { text: "var x = 0e5" },
    { text: "var x = .42" },
    { text: "var x = 42." },

    { text: "var x = 12_34_56", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = 12_3.4_56", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = -12_3.4_56", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = -12_34_56", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = 12_3e3_4", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = 123.0e3_4", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = 12_3e-3_4", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = 12_3.0e-3_4", languageOptions: { ecmaVersion: 2021 } },
    { text: "var x = -1_23e-3_4", languageOptions: { ecmaVersion: 2021 } },
    {
        text: "var x = -1_23.8e-3_4",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 1_230000000_00000000_00000_000",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = -1_230000000_00000000_00000_000",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0.0_00_000000000_000000000_00123",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = -0.0_00_000000000_000000000_00123",
        languageOptions: { ecmaVersion: 2021 },
    },
    { text: "var x = 0e5_3", languageOptions: { ecmaVersion: 2021 } },

    {
        text: "var x = 0b11111111111111111111111111111111111111111111111111111",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0b111_111_111_111_1111_11111_111_11111_1111111111_11111111_111_111",
        languageOptions: { ecmaVersion: 2021 },
    },

    {
        text: "var x = 0B11111111111111111111111111111111111111111111111111111",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0B111_111_111_111_1111_11111_111_11111_1111111111_11111111_111_111",
        languageOptions: { ecmaVersion: 2021 },
    },

    {
        text: "var x = 0o377777777777777777",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0o3_77_777_777_777_777_777",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0O377777777777777777",
        languageOptions: { ecmaVersion: 6 },
    },

    { text: "var x = 0377777777777777777" },
    { text: "var x = 0x1FFFFFFFFFFFFF" },
    { text: "var x = 0X1FFFFFFFFFFFFF" },
    { text: "var x = true" },
    { text: "var x = 'abc'" },
    { text: "var x = ''" },
    { text: "var x = null" },
    { text: "var x = undefined" },
    { text: "var x = {}" },
    { text: "var x = ['a', 'b']" },
    { text: "var x = new Date()" },
    { text: "var x = '9007199254740993'" },

    {
        text: "var x = 0x1FFF_FFFF_FFF_FFF",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0X1_FFF_FFFF_FFF_FFF",
        languageOptions: { ecmaVersion: 2021 },
    },
];
const invalid = [
    {
        text: "var x = 9007199254740993",
    },
    {
        text: "var x = 9007199254740.993e3",
    },
    {
        text: "var x = 9.007199254740993e15",
    },
    {
        text: "var x = -9007199254740993",
    },
    {
        text: "var x = 900719.9254740994",
    },
    {
        text: "var x = -900719.9254740994",
    },
    {
        text: "var x = 900719925474099_3",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 90_0719925_4740.9_93e3",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 9.0_0719925_474099_3e15",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 90071992547409930e-1",
    },
    {
        text: "var x = .9007199254740993e16",
    },
    {
        text: "var x = 900719925474099.30e1",
    },
    {
        text: "var x = -9_00719_9254_740993",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 900_719.92_54740_994",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = -900_719.92_5474_0994",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 5123000000000000000000000000001",
    },
    {
        text: "var x = -5123000000000000000000000000001",
    },
    {
        text: "var x = 1230000000000000000000000.0",
    },
    {
        text: "var x = 1.0000000000000000000000123",
    },
    {
        text: "var x = 17498005798264095394980017816940970922825355447145699491406164851279623993595007385788105416184430592",
    },
    {
        text: "var x = 2e999",
    },
    {
        text: "var x = .1230000000000000000000000",
    },
    {
        text: "var x = 0b100000000000000000000000000000000000000000000000000001",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0B100000000000000000000000000000000000000000000000000001",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0o400000000000000001",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0O400000000000000001",
        languageOptions: { ecmaVersion: 6 },
    },
    {
        text: "var x = 0400000000000000001",
    },
    {
        text: "var x = 0x20000000000001",
    },
    {
        text: "var x = 0X20000000000001",
    },
    {
        text: "var x = 5123_00000000000000000000000000_1",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = -5_12300000000000000000000_0000001",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 123_00000000000000000000_00.0_0",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 1.0_00000000000000000_0000123",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 174_980057982_640953949800178169_409709228253554471456994_914061648512796239935950073857881054_1618443059_2",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 2e9_99",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = .1_23000000000000_00000_0000_0",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0b1_0000000000000000000000000000000000000000000000000000_1",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0B10000000000_0000000000000000000000000000_000000000000001",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0o4_00000000000000_001",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0O4_0000000000000000_1",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0x2_0000000000001",
        languageOptions: { ecmaVersion: 2021 },
    },
    {
        text: "var x = 0X200000_0000000_1",
        languageOptions: { ecmaVersion: 2021 },
    },
];
