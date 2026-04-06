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

    const { ecmaVersion, sourceType, globals } = _normalizeLanguageOptions(languageOptions);

    // Step 1: Parse
    const parseResult = parse(sourceText, { ecmaVersion, sourceType });

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

    // Step 5: Count errors and warnings
    let errorCount = 0;
    let warningCount = 0;
    for (const msg of messages) {
        if (msg.severity === 2) errorCount++;
        else if (msg.severity === 1) warningCount++;
    }

    return {
        filePath: fileName,
        messages,
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
    // Our eslint-scope wrapper's analyze() calls scopeManager.addGlobals(Object.keys(globals))
    // so the values don't matter yet — pass through as-is.
    return globals;
}

function _normalizeLanguageOptions(options) {
    const providedLanguageOptions = options.languageOptions ?? {};

    if (options.parserOptions !== undefined || providedLanguageOptions.parserOptions !== undefined) {
        throw new Error("lintText() does not support parserOptions.");
    }

    if (options.sourceType !== undefined && options.sourceType !== "module") {
        throw new Error('lintText() only supports sourceType "module".');
    }

    if (
        providedLanguageOptions.sourceType !== undefined &&
        providedLanguageOptions.sourceType !== "module"
    ) {
        throw new Error('lintText() only supports sourceType "module".');
    }

    if (
        options.ecmaFeatures !== undefined ||
        providedLanguageOptions.ecmaFeatures !== undefined
    ) {
        throw new Error("lintText() does not support ecmaFeatures.");
    }

    return {
        ecmaVersion: options.ecmaVersion ?? providedLanguageOptions.ecmaVersion ?? 2024,
        sourceType: options.sourceType ?? providedLanguageOptions.sourceType ?? "module",
        globals: options.globals ?? providedLanguageOptions.globals ?? {},
    };
}

export default lintText;
