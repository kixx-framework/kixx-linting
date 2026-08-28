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
});
