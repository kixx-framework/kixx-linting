import { parse } from "./parser.js";
import { analyze } from "./vendor/eslint-scope/index.js";
import { SourceCode } from "./source-code.js";
import { runRules } from "./rule-runner.js";
import VISITOR_KEYS from "./visitor-keys.js";
import registry from "./rules/index.js";


export function lintText(sourceFile, rules, languageOptions) {
    languageOptions = languageOptions || {};

    const fileName = sourceFile.name ?? "<input>";
    const sourceText = sourceFile.text;

    const ecmaVersion = languageOptions.ecmaVersion ?? "2024";
    const sourceType = languageOptions.sourceType ?? "module";
    const globals = languageOptions.globals ?? {};
    const allowReturnOutsideFunction = languageOptions.parserOptions?.ecmaFeatures?.globalReturn === true;

    // Step 1: Parse
    const parseResult = parse(sourceText, {
        ecmaVersion,
        sourceType,
        allowReturnOutsideFunction,
    });

    if (!parseResult.ok) {
        // Return fatal parse errors
        const messages = parseResult.errors.map(err => ({
            ruleId: null,
            severity: 2,
            message: err.message,
            line: err.line,
            column: err.column,
        }));
        return {
            filePath: fileName,
            messages,
            errorCount: messages.length,
            warningCount: 0,
        };
    }

    const { ast, tokens, comments } = parseResult;

    // Step 2: Scope analysis
    // eslint-scope globals format: variable names in an array (already handled
    // in our wrapper's addGlobals). We also translate 'readonly'/'writable' values
    // into the format expected by eslint-scope if needed.
    const scopeManager = analyze(ast, {
        ecmaVersion,
        sourceType,
        globals: _translateGlobals(globals),
    });

    // Step 3: Construct SourceCode
    const sourceCode = new SourceCode({
        text: sourceText,
        ast,
        tokens,
        comments,
        scopeManager,
        visitorKeys: VISITOR_KEYS,
    });

    // Step 4: Run rules
    const messages = runRules(sourceCode, rules, registry, fileName, languageOptions);
    const disableDirectives = sourceCode.getDisableDirectives();
    const filteredMessages = messages.filter(message => !disableDirectives.isSuppressed(message));

    // Step 5: Count errors and warnings
    let errorCount = 0;
    let warningCount = 0;
    for (const msg of filteredMessages) {
        if (msg.severity === 2) errorCount += 1;
        else if (msg.severity === 1) warningCount += 1;
    }

    return {
        filePath: fileName,
        messages: filteredMessages,
        errorCount,
        warningCount,
    };
}

/**
 * Translate globals from { name: 'readonly' | 'writable' | boolean } to
 * the flat object our eslint-scope wrapper expects (just the keys matter
 * for addGlobals; the wrapper ignores values currently).
 *
 * If future rules need to distinguish writable vs readonly globals, this
 * translation point is where that distinction would be preserved.
 */
function _translateGlobals(globals) {
    const translated = {};

    for (const [name, value] of Object.entries(globals)) {
        if (value === "off") {
            continue;
        }

        translated[name] = value;
    }

    return translated;
}

export default lintText;
