import { parse } from "./parser.js";
import { analyze } from "./eslint-scope/index.js";
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
        globals: filterDisabledGlobals(globals),
    });

    // Process /*global*/ block comments: inject names into scope and mark them
    // with eslintExplicitGlobalComments so no-unused-vars can report them when unused.
    const commentGlobals = parseBlockCommentGlobalNames(comments);
    if (commentGlobals.length > 0) {
        scopeManager.addGlobals(commentGlobals.map(g => g.name));
        const globalScope = scopeManager.globalScope;
        for (const { name, comment } of commentGlobals) {
            const variable = globalScope.set.get(name);
            if (variable) {
                if (!variable.eslintExplicitGlobalComments) {
                    variable.eslintExplicitGlobalComments = [];
                }
                variable.eslintExplicitGlobalComments.push(comment);
            }
        }
    }

    // Step 3: Construct SourceCode
    const sourceCode = new SourceCode({
        text: sourceText,
        ast,
        tokens,
        comments,
        scopeManager,
        visitorKeys: VISITOR_KEYS,
    });

    // Step 4: Merge caller-provided rules with any inline /*eslint rule:N*/ directives.
    // Only inline rules present in the registry are added; unknown rule IDs are skipped.
    const inlineRules = parseInlineEslintRules(comments);
    let mergedRules = rules;
    if (inlineRules.size > 0) {
        const knownInline = {};
        for (const [id, config] of inlineRules) {
            if (registry.has(id)) {
                knownInline[id] = config;
            }
        }
        if (Object.keys(knownInline).length > 0) {
            mergedRules = Object.assign({}, rules, knownInline);
        }
    }

    // Step 5: Run rules
    const messages = runRules(sourceCode, mergedRules, registry, languageOptions);
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

// Parse block comments of the form: /* global name1, name2 */
// Returns [{ name, comment }] for each declared global name.
function parseBlockCommentGlobalNames(comments) {
    const result = [];

    for (const comment of comments) {
        if (comment.type !== "Block") {
            continue;
        }

        const match = /^\s*globals?\s+([\s\S]*)$/iu.exec(comment.value);
        if (!match) {
            continue;
        }

        const declarationPattern = /([^\s,:]+)(?::\s*([^\s,]+))?/gu;
        let declarationMatch;

        while ((declarationMatch = declarationPattern.exec(match[1])) !== null) {
            const value = declarationMatch[2]?.trim().toLowerCase() ?? "readonly";
            if (value !== "off") {
                result.push({ name: declarationMatch[1], comment });
            }
        }
    }

    return result;
}

// Parse inline /*eslint rule-name:N*/ comments and return a Map of rule ID to config.
// Only includes rules that are registered; unknown rules are silently skipped.
function parseInlineEslintRules(comments) {
    const result = new Map();

    for (const comment of comments) {
        if (comment.type !== "Block") {
            continue;
        }

        const match = /^\s*eslint\s+([\s\S]+)$/iu.exec(comment.value);
        if (!match) {
            continue;
        }

        // Parse entries like: rule-name:N or rule-name:[N,opts]
        // The content may have multiple comma-separated entries.
        const content = match[1].trim();
        const entryPattern = /([\w/\-@.]+)\s*:\s*(\[[\s\S]*?\]|\d+)/gu;
        let entryMatch;

        while ((entryMatch = entryPattern.exec(content)) !== null) {
            const ruleId = entryMatch[1];
            const severityRaw = entryMatch[2].trim();
            let config;

            if (severityRaw.startsWith("[")) {
                try {
                    config = JSON.parse(severityRaw);
                } catch {
                    continue;
                }
            } else {
                config = parseInt(severityRaw, 10);
                if (isNaN(config)) {
                    continue;
                }
            }

            result.set(ruleId, config);
        }
    }

    return result;
}

function filterDisabledGlobals(globals) {
    const enabledGlobals = {};

    for (const [name, value] of Object.entries(globals)) {
        if (value === "off") {
            continue;
        }

        enabledGlobals[name] = value;
    }

    return enabledGlobals;
}

export default lintText;
