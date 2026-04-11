/**
 * runRules — instantiates rules, collects their visitors, traverses the AST,
 * and returns the sorted messages array.
 *
 * @param {import('./source-code.js').SourceCode} sourceCode
 * @param {object} configuredRules - e.g. { 'no-debugger': 'error', 'indent': ['error', 4] }
 * @param {Map} registry - rule registry (Map from ruleId to rule module)
 * @param {object} languageOptions
 * @param {object} visitorKeys - ESTree visitor keys map
 * @returns {Array} messages sorted by line then column
 */
import { RuleContext } from "./rule-context.js";
import { traverse } from "./traverser.js";
import VISITOR_KEYS from "./visitor-keys.js";

export function runRules(sourceCode, configuredRules, registry, languageOptions) {
    const messages = [];

    // Merged visitor map: event name -> array of callbacks
    const visitors = new Map();

    function addVisitor(eventName, callback) {
        if (!visitors.has(eventName)) {
            visitors.set(eventName, []);
        }
        visitors.get(eventName).push(callback);
    }

    for (const [ruleId, ruleConfig] of Object.entries(configuredRules)) {
        const { severity, options } = parseRuleConfig(ruleConfig);

        // Skip disabled rules
        if (severity === 0) continue;

        const rule = registry.get(ruleId);
        if (!rule) {
            throw new Error(
                `Rule '${ruleId}' is not defined in the rule registry. ` +
                `Make sure it has been registered in lib/rules/index.js.`,
            );
        }

        const context = new RuleContext({
            id: ruleId,
            severity,
            options,
            sourceCode,
            languageOptions,
            messages,
        });

        // Call rule.create(context) to get the visitor map for this rule
        const ruleVisitors = rule.create(context);

        if (ruleVisitors && typeof ruleVisitors === "object") {
            for (const [eventName, callback] of Object.entries(ruleVisitors)) {
                if (typeof callback === "function") {
                    addVisitor(eventName, callback);
                }
            }
        }
    }

    // Traverse the AST with all collected visitors
    traverse(sourceCode.ast, VISITOR_KEYS, visitors);

    // Sort messages by line then column
    messages.sort((a, b) => {
        if (a.line !== b.line) return a.line - b.line;
        return a.column - b.column;
    });

    return messages;
}

/**
 * Parse a rule config entry into { severity, options }.
 *
 * Config entries can be:
 *   'off' | 'warn' | 'error'
 *   0 | 1 | 2
 *   ['error', ...options]
 *   ['warn', ...options]
 *   [0 | 1 | 2, ...options]
 *
 * Returns severity as a number: 0 = off, 1 = warn, 2 = error.
 */
function parseRuleConfig(ruleConfig) {
    if (Array.isArray(ruleConfig)) {
        const [severityRaw, ...options] = ruleConfig;
        return { severity: normalizeSeverity(severityRaw), options };
    }
    return { severity: normalizeSeverity(ruleConfig), options: [] };
}

function normalizeSeverity(raw) {
    if (raw === "off" || raw === 0) return 0;
    if (raw === "warn" || raw === 1) return 1;
    if (raw === "error" || raw === 2) return 2;
    throw new Error(`Invalid rule severity: ${JSON.stringify(raw)}`);
}

export default runRules;
