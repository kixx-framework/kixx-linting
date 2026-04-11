const DIRECTIVE_PREFIXES = new Map([
    ["eslint-disable-line", getSameLineTarget],
    ["eslint-disable-next-line", getNextLineTarget],
]);

const RANGE_DIRECTIVE_PREFIXES = new Map([
    ["eslint-disable", "disable"],
    ["eslint-enable", "enable"],
]);

export function collectDisableDirectives(sourceCode) {
    const lineDirectiveIndex = new Map();
    const rangeDirectives = [];
    const comments = sourceCode.getAllComments();

    for (const comment of comments) {
        const lineDirective = parseLineDisableDirective(comment);

        if (lineDirective && lineDirective.ruleIds.length > 0) {
            const targetLine = lineDirective.getTargetLine(comment);
            let ruleIds = lineDirectiveIndex.get(targetLine);

            if (!ruleIds) {
                ruleIds = new Set();
                lineDirectiveIndex.set(targetLine, ruleIds);
            }

            for (const ruleId of lineDirective.ruleIds) {
                ruleIds.add(ruleId);
            }
        }

        const rangeDirective = parseRangeDisableDirective(comment);

        if (rangeDirective) {
            rangeDirectives.push(rangeDirective);
        }
    }

    return new DisableDirectives(lineDirectiveIndex, rangeDirectives);
}

export class DisableDirectives {
    constructor(lineDirectiveIndex, rangeDirectives) {
        this._lineDirectiveIndex = lineDirectiveIndex;
        this._rangeDirectives = rangeDirectives;
    }

    isSuppressed(message) {
        if (!message.ruleId) {
            return false;
        }

        const suppressedRuleIds = this._lineDirectiveIndex.get(message.line);

        if (suppressedRuleIds && suppressedRuleIds.has(message.ruleId)) {
            return true;
        }

        return isSuppressedByRangeDirectives(message, this._rangeDirectives);
    }

    entries() {
        return this._lineDirectiveIndex.entries();
    }

    [Symbol.iterator]() {
        return this.entries();
    }
}

function parseLineDisableDirective(comment) {
    const normalizedValue = comment.value.trim();

    for (const [prefix, getTargetLine] of DIRECTIVE_PREFIXES) {
        if (!normalizedValue.startsWith(prefix)) {
            continue;
        }

        const ruleText = normalizedValue.slice(prefix.length).trim();

        return {
            getTargetLine,
            ruleIds: parseRuleIds(ruleText),
        };
    }

    return null;
}

function parseRangeDisableDirective(comment) {
    if (comment.type !== "Block") {
        return null;
    }

    const normalizedValue = comment.value.trim();

    for (const [prefix, type] of RANGE_DIRECTIVE_PREFIXES) {
        if (!isRangeDirectiveMatch(normalizedValue, prefix)) {
            continue;
        }

        const ruleText = normalizedValue.slice(prefix.length).trim();
        const ruleIds = parseRuleIds(ruleText);

        return {
            type,
            ruleIds: ruleIds.length > 0 ? ruleIds : null,
            line: comment.loc.end.line,
            column: comment.loc.end.column + 1,
            index: comment.end,
        };
    }

    return null;
}

function isRangeDirectiveMatch(normalizedValue, prefix) {
    if (!normalizedValue.startsWith(prefix)) {
        return false;
    }

    const nextCharacter = normalizedValue[prefix.length];

    return nextCharacter === undefined || /\s/u.test(nextCharacter);
}

function parseRuleIds(ruleText) {
    if (!ruleText) {
        return [];
    }

    const seen = new Set();
    const ruleIds = [];

    for (const segment of ruleText.split(",")) {
        const normalizedSegment = segment.trim();

        if (!normalizedSegment) {
            continue;
        }

        const match = normalizedSegment.match(/^[^\s,]+/u);
        const ruleId = match ? match[0] : "";

        if (!ruleId || seen.has(ruleId)) {
            continue;
        }

        seen.add(ruleId);
        ruleIds.push(ruleId);
    }

    return ruleIds;
}

function isSuppressedByRangeDirectives(message, rangeDirectives) {
    let allRulesDisabled = false;
    const disabledRuleIds = new Set();

    for (const directive of rangeDirectives) {
        if (!isDirectiveBeforeMessage(directive, message)) {
            break;
        }

        if (directive.type === "disable") {
            if (directive.ruleIds) {
                for (const ruleId of directive.ruleIds) {
                    disabledRuleIds.add(ruleId);
                }
            } else {
                allRulesDisabled = true;
            }
        } else if (directive.ruleIds) {
            for (const ruleId of directive.ruleIds) {
                disabledRuleIds.delete(ruleId);
            }
        } else {
            allRulesDisabled = false;
            disabledRuleIds.clear();
        }
    }

    return allRulesDisabled || disabledRuleIds.has(message.ruleId);
}

function isDirectiveBeforeMessage(directive, message) {
    const messageColumn = message.column ?? 1;

    if (directive.line < message.line) {
        return true;
    }

    return directive.line === message.line && directive.column < messageColumn;
}

function getSameLineTarget(comment) {
    return comment.loc.end.line;
}

function getNextLineTarget(comment) {
    return comment.loc.end.line + 1;
}

export default collectDisableDirectives;
