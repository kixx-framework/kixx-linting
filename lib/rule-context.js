/**
 * RuleContext — per-rule context object passed to rule.create(context).
 *
 * Each rule instance gets its own RuleContext. The `messages` array is shared
 * across all rules in a single lintText() call.
 */
export class RuleContext {
    /**
     * @param {object} options
     * @param {string} options.id - Rule name (e.g. 'no-debugger')
     * @param {number} options.severity - 1 (warn) or 2 (error)
     * @param {Array} options.options - Rule option values from config (after severity)
     * @param {import('./source-code.js').SourceCode} options.sourceCode
     * @param {string} options.filename
     * @param {object} options.languageOptions
     * @param {Array} options.messages - Shared messages array for this lint run
     */
    constructor({ id, severity, options, sourceCode, filename, languageOptions, messages }) {
        this.id = id;
        this.severity = severity;
        this.options = options;
        this.sourceCode = sourceCode;
        this.filename = filename;
        this._messages = messages;
        this.languageOptions = languageOptions;
    }

    /**
     * Report a lint violation.
     *
     * @param {object} descriptor
     * @param {object} [descriptor.node] - AST node (used for location if loc not provided)
     * @param {string} descriptor.message - Message string, may contain {{placeholder}} patterns
     * @param {object} [descriptor.loc] - Explicit location { line, column } or { start: { line, column } }
     * @param {object} [descriptor.data] - Data for {{placeholder}} substitution in message
     */
    report({ node, message, loc, data }) {
        // Resolve location
        let line, column;

        if (loc) {
            // loc can be { line, column } or { start: { line, column } }
            if (loc.start) {
                line = loc.start.line;
                column = loc.start.column;
            } else {
                line = loc.line;
                column = loc.column;
            }
        } else if (node && node.loc) {
            line = node.loc.start.line;
            column = node.loc.start.column;
        } else {
            line = 1;
            column = 0;
        }

        // Apply {{placeholder}} substitutions from data
        let resolvedMessage = message;
        if (data) {
            resolvedMessage = message.replace(/\{\{(\w+)\}\}/g, (_, key) => {
                return Object.prototype.hasOwnProperty.call(data, key)
                    ? String(data[key])
                    : `{{${key}}}`;
            });
        }

        this._messages.push({
            ruleId: this.id,
            severity: this.severity,
            message: resolvedMessage,
            line,
            column,
        });
    }
}

export default RuleContext;
