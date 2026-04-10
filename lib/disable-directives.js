const DIRECTIVE_PREFIXES = new Map([
    ["eslint-disable-line", getSameLineTarget],
    ["eslint-disable-next-line", getNextLineTarget],
]);

export function collectDisableDirectives(sourceCode) {
    const directiveIndex = new Map();
    const comments = sourceCode.getAllComments();

    for (const comment of comments) {
        const directive = parseDisableDirective(comment);

        if (!directive || directive.ruleIds.length === 0) {
            continue;
        }

        const targetLine = directive.getTargetLine(comment);
        let ruleIds = directiveIndex.get(targetLine);

        if (!ruleIds) {
            ruleIds = new Set();
            directiveIndex.set(targetLine, ruleIds);
        }

        for (const ruleId of directive.ruleIds) {
            ruleIds.add(ruleId);
        }
    }

    return directiveIndex;
}

function parseDisableDirective(comment) {
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

function getSameLineTarget(comment) {
    return comment.loc.end.line;
}

function getNextLineTarget(comment) {
    return comment.loc.end.line + 1;
}

export default collectDisableDirectives;
