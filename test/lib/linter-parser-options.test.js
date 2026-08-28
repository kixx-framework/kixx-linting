import {
    describe,
    assertEqual,
} from "../deps.js";

import { lintText } from "../../mod.js";

describe("linter parser options", ({ it }) => {
    it("allows a leading hashbang by default for older ECMAScript versions", () => {
        const result = lintText(
            { text: "#!/usr/bin/env node\nconsole.log('hello');" },
            { "no-console": ["error"] },
            { ecmaVersion: 2022 },
        );

        assertEqual(1, result.errorCount);
        assertEqual("no-console", result.messages[0].ruleId);
        assertEqual(2, result.messages[0].line);
        assertEqual(0, result.messages[0].column);
    });

    it("rejects a leading hashbang when allowHashBang is false", () => {
        const result = lintText(
            { text: "#!/usr/bin/env node\nconsole.log('hello');" },
            { "no-console": ["error"] },
            {
                ecmaVersion: 2024,
                parserOptions: { allowHashBang: false },
            },
        );

        assertEqual(1, result.errorCount);
        assertEqual(null, result.messages[0].ruleId);
        assertEqual(1, result.messages[0].line);
        assertEqual(1, result.messages[0].column);
    });

    it("rejects a return statement outside a function by default", () => {
        const result = lintText(
            { text: "return 1;" },
            {},
            { sourceType: "script" },
        );

        assertEqual(1, result.errorCount);
        assertEqual(null, result.messages[0].ruleId);
        assertEqual(1, result.messages[0].line);
        assertEqual(0, result.messages[0].column);
    });

    it("allows a return statement outside a function when globalReturn is true", () => {
        const result = lintText(
            { text: "return 1;" },
            {},
            {
                sourceType: "script",
                parserOptions: { ecmaFeatures: { globalReturn: true } },
            },
        );

        assertEqual(0, result.errorCount);
        assertEqual(0, result.messages.length);
    });

    it("rejects optional chaining before ECMAScript 2020", () => {
        const result = lintText(
            { text: "value?.key;" },
            {},
            { ecmaVersion: 2019 },
        );

        assertEqual(1, result.errorCount);
        assertEqual(null, result.messages[0].ruleId);
        assertEqual(1, result.messages[0].line);
        assertEqual(6, result.messages[0].column);
    });

    it("allows optional chaining with ECMAScript 2020", () => {
        const result = lintText(
            { text: "value?.key;" },
            {},
            { ecmaVersion: 2020 },
        );

        assertEqual(0, result.errorCount);
        assertEqual(0, result.messages.length);
    });

    it("rejects import declarations in scripts", () => {
        const result = lintText(
            { text: "import value from 'package';" },
            {},
            { sourceType: "script" },
        );

        assertEqual(1, result.errorCount);
        assertEqual(null, result.messages[0].ruleId);
        assertEqual(1, result.messages[0].line);
        assertEqual(0, result.messages[0].column);
    });

    it("allows import declarations in modules", () => {
        const result = lintText(
            { text: "import value from 'package';" },
            {},
            { sourceType: "module" },
        );

        assertEqual(0, result.errorCount);
        assertEqual(0, result.messages.length);
    });
});
