import { parse as parseWithAcorn } from "./vendor/acorn/index.js";

/**
 * Normalize an acorn token to ESLint-style format.
 * Acorn tokens have object `type` properties; ESLint rules expect string type names.
 */
function normalizeToken(token) {
    const typeLabel = token.type?.label ?? "";
    // acorn sets keyword to the keyword string (e.g. "typeof"), not boolean true
    const isKeyword = Boolean(token.type?.keyword);

    let typeName;
    if (isKeyword) {
        typeName = "Keyword";
    } else if (typeLabel === "name") {
        typeName = "Identifier";
    } else if (typeLabel === "num") {
        typeName = "Numeric";
    } else if (typeLabel === "string") {
        typeName = "String";
    } else if (typeLabel === "regexp") {
        typeName = "RegularExpression";
    } else if (typeLabel === "template" || typeLabel === "`") {
        typeName = "Template";
    } else if (typeLabel === "eof") {
        return null; // Skip EOF token
    } else {
        typeName = "Punctuator";
    }

    return {
        type: typeName,
        value: token.value ?? typeLabel,
        start: token.start,
        end: token.end,
        range: [token.start, token.end],
        loc: token.loc,
    };
}

export function parse(sourceText, options = {}) {
    const comments = [];
    const rawTokens = [];
    const ecmaVersion = options.ecmaVersion ?? 2024;
    const sourceType = options.sourceType ?? "script";

    try {
        const ast = parseWithAcorn(sourceText, {
            ecmaVersion,
            sourceType,
            locations: true,
            ranges: true,
            onComment: comments,
            onToken: rawTokens,
        });

        // Normalize tokens from acorn format to ESLint-compatible format
        const tokens = rawTokens
            .map(normalizeToken)
            .filter(t => t !== null);

        return {
            ok: true,
            ast,
            comments,
            tokens,
        };
    } catch (error) {
        return {
            ok: false,
            errors: [
                {
                    message: error.message,
                    line: error.lineNumber ?? error.loc?.line ?? 1,
                    column: error.column ?? error.loc?.column ?? 0,
                },
            ],
        };
    }
}

export default parse;
