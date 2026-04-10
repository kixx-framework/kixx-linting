import { collectDisableDirectives } from "./disable-directives.js";

/**
 * SourceCode — unified interface to AST, tokens, comments, source text, and scope.
 *
 * Constructed from { text, ast, tokens, comments, scopeManager, visitorKeys }.
 * Tokens array comes from acorn's onToken callback; each token has start, end, loc.
 * Comments array comes from acorn's onComment callback; each has type, value, start, end, loc.
 */
export class SourceCode {
    constructor({ text, ast, tokens, comments, scopeManager, visitorKeys }) {
        this.text = text;
        this.ast = ast;
        this.scopeManager = scopeManager;
        this.visitorKeys = visitorKeys;

        this._tokens = tokens;
        this._comments = comments;

        // Build sorted array of all tokens (no comments) for lookups
        this._tokensSorted = tokens.slice().sort((a, b) => a.start - b.start);

        // Build sorted array of comments for lookups
        this._commentsSorted = comments.slice().sort((a, b) => a.start - b.start);
        this._disableDirectives = collectDisableDirectives(this);

        // Build a combined sorted array for includeComments queries
        this._allTokensSorted = [...tokens, ...comments]
            .sort((a, b) => a.start - b.start);

        // Build line-start offset index for O(1) line/column lookups
        // _lineOffsets[i] is the character offset of the start of line i+1
        this._lineOffsets = [0];
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                this._lineOffsets.push(i + 1);
            }
        }

        // Cache lines array (lazy)
        this._lines = null;
    }

    /**
     * Get source text, optionally sliced to a node's range.
     */
    getText(node) {
        if (!node) return this.text;
        return this.text.slice(node.start, node.end);
    }

    /**
     * Get all source lines as an array of strings (without newline characters).
     */
    getLines() {
        if (!this._lines) {
            this._lines = this.text.split('\n');
        }
        return this._lines;
    }

    /**
     * Get source lines as an array (alias for getLines(), for compatibility).
     */
    get lines() {
        return this.getLines();
    }

    /**
     * Get all tokens within the range of a node.
     * Options: { includeComments: boolean }
     */
    getTokens(node, options = {}) {
        const list = options.includeComments ? this._allTokensSorted : this._tokensSorted;
        return _filterByRange(list, node.start, node.end);
    }

    /**
     * Get the first token within a node's range.
     * Options: number (skip), function (filter), or { skip, filter, includeComments }
     */
    getFirstToken(node, rawOptions) {
        const { skip, filter, includeComments } = _normalizeOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = node.range ? node.range[0] : node.start;
        const end = node.range ? node.range[1] : node.end;
        const tokens = _filterByRange(list, start, end);
        let skipped = 0;
        for (const token of tokens) {
            if (filter && !filter(token)) continue;
            if (skipped < skip) { skipped++; continue; }
            return token;
        }
        return null;
    }

    /**
     * Get the last token within a node's range.
     * Options: number (skip), function (filter), or { skip, filter, includeComments }
     */
    getLastToken(node, rawOptions) {
        const { skip, filter, includeComments } = _normalizeOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = node.range ? node.range[0] : node.start;
        const end = node.range ? node.range[1] : node.end;
        const tokens = _filterByRange(list, start, end);
        let skipped = 0;
        for (let i = tokens.length - 1; i >= 0; i--) {
            const token = tokens[i];
            if (filter && !filter(token)) continue;
            if (skipped < skip) { skipped++; continue; }
            return token;
        }
        return null;
    }

    /**
     * Get the token immediately before a node (or token).
     * Options: number (skip), function (filter), or { skip, filter, includeComments }
     */
    getTokenBefore(nodeOrToken, rawOptions) {
        const { skip, filter, includeComments } = _normalizeOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = nodeOrToken.range ? nodeOrToken.range[0] : nodeOrToken.start;
        let skipped = 0;
        for (let i = list.length - 1; i >= 0; i--) {
            const token = list[i];
            if (token.end > start) continue;
            if (filter && !filter(token)) continue;
            if (skipped < skip) { skipped++; continue; }
            return token;
        }
        return null;
    }

    /**
     * Get the token immediately after a node (or token).
     * Options: number (skip), function (filter), or { skip, filter, includeComments }
     */
    getTokenAfter(nodeOrToken, rawOptions) {
        const { skip, filter, includeComments } = _normalizeOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const end = nodeOrToken.range ? nodeOrToken.range[1] : nodeOrToken.end;
        let skipped = 0;
        for (let i = 0; i < list.length; i++) {
            const token = list[i];
            if (token.start < end) continue;
            if (filter && !filter(token)) continue;
            if (skipped < skip) { skipped++; continue; }
            return token;
        }
        return null;
    }

    /**
     * Get the first token between two nodes/tokens (exclusive).
     * Options: number (skip), function (filter), or { skip, filter, includeComments }
     */
    getFirstTokenBetween(left, right, rawOptions) {
        const { skip, filter, includeComments } = _normalizeOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = left.range ? left.range[1] : left.end;
        const end = right.range ? right.range[0] : right.start;
        const tokens = _filterByRange(list, start, end);
        let skipped = 0;
        for (const token of tokens) {
            if (token.start < start) continue;
            if (filter && !filter(token)) continue;
            if (skipped < skip) { skipped++; continue; }
            return token;
        }
        return null;
    }

    /**
     * Get the last token between two nodes/tokens (exclusive).
     * Options: number (skip), function (filter), or { skip, filter, includeComments }
     */
    getLastTokenBetween(left, right, rawOptions) {
        const { skip, filter, includeComments } = _normalizeOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = left.range ? left.range[1] : left.end;
        const end = right.range ? right.range[0] : right.start;
        const tokens = _filterByRange(list, start, end);
        let skipped = 0;
        for (let i = tokens.length - 1; i >= 0; i--) {
            const token = tokens[i];
            if (token.end > end) continue;
            if (filter && !filter(token)) continue;
            if (skipped < skip) { skipped++; continue; }
            return token;
        }
        return null;
    }

    /**
     * Get the first N tokens within a node's range.
     * Options: number (count), function (filter), or { count, filter, includeComments }
     */
    getFirstTokens(node, rawOptions) {
        const { count, filter, includeComments } = _normalizeCountOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = node.range ? node.range[0] : node.start;
        const end = node.range ? node.range[1] : node.end;
        const tokens = _filterByRange(list, start, end);
        const result = [];
        for (const token of tokens) {
            if (result.length >= count) break;
            if (filter && !filter(token)) continue;
            result.push(token);
        }
        return result;
    }

    /**
     * Get the last N tokens within a node's range.
     * Options: number (count), function (filter), or { count, filter, includeComments }
     */
    getLastTokens(node, rawOptions) {
        const { count, filter, includeComments } = _normalizeCountOptions(rawOptions);
        const list = includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = node.range ? node.range[0] : node.start;
        const end = node.range ? node.range[1] : node.end;
        const tokens = _filterByRange(list, start, end);
        const result = [];
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (result.length >= count) break;
            const token = tokens[i];
            if (filter && !filter(token)) continue;
            result.unshift(token);
        }
        return result;
    }

    /**
     * Get all tokens between two nodes (exclusive of both nodes' ranges).
     * Options: { includeComments: boolean }
     */
    getTokensBetween(nodeA, nodeB, options = {}) {
        const list = options.includeComments ? this._allTokensSorted : this._tokensSorted;
        const start = nodeA.range ? nodeA.range[1] : nodeA.end;
        const end = nodeB.range ? nodeB.range[0] : nodeB.start;
        return _filterByRange(list, start, end);
    }

    /**
     * Check whether there is any whitespace between two adjacent tokens.
     */
    isSpaceBetween(tokenA, tokenB) {
        const a = tokenA.range ? tokenA.range[1] : tokenA.end;
        const b = tokenB.range ? tokenB.range[0] : tokenB.start;
        const textBetween = this.text.slice(a, b);
        return /\s/u.test(textBetween);
    }

    /**
     * Check whether any comments exist between two nodes/tokens.
     */
    commentsExistBetween(left, right) {
        const start = left.range ? left.range[1] : left.end;
        const end = right.range ? right.range[0] : right.start;
        return this._commentsSorted.some(c => {
            const cs = c.range ? c.range[0] : c.start;
            const ce = c.range ? c.range[1] : c.end;
            return cs >= start && ce <= end;
        });
    }

    /**
     * Get all comments in the source file.
     */
    getAllComments() {
        return this._commentsSorted;
    }

    /**
     * Get line-scoped disable-directive metadata keyed by target line.
     */
    getDisableDirectives() {
        return this._disableDirectives;
    }

    /**
     * Get all comments inside a node's range (for no-empty, etc.).
     */
    getCommentsInside(node) {
        const start = node.range ? node.range[0] : node.start;
        const end = node.range ? node.range[1] : node.end;
        return this._commentsSorted.filter(c => {
            const cs = c.range ? c.range[0] : c.start;
            const ce = c.range ? c.range[1] : c.end;
            return cs >= start && ce <= end;
        });
    }

    /**
     * Get comments that appear immediately before a node (between the previous
     * token's end and this node's start).
     */
    getCommentsBefore(node) {
        const nodeStart = node.range ? node.range[0] : node.start;
        // Find the end of the previous token (non-comment)
        let prevEnd = 0;
        for (let i = this._tokensSorted.length - 1; i >= 0; i--) {
            if (this._tokensSorted[i].end <= nodeStart) {
                prevEnd = this._tokensSorted[i].end;
                break;
            }
        }
        return _filterByRange(this._commentsSorted, prevEnd, nodeStart);
    }

    /**
     * Get comments that appear immediately after a node (between this node's end
     * and the next token's start).
     */
    getCommentsAfter(node) {
        const nodeEnd = node.range ? node.range[1] : node.end;
        // Find the start of the next token (non-comment)
        let nextStart = this.text.length;
        for (let i = 0; i < this._tokensSorted.length; i++) {
            if (this._tokensSorted[i].start >= nodeEnd) {
                nextStart = this._tokensSorted[i].start;
                break;
            }
        }
        return _filterByRange(this._commentsSorted, nodeEnd, nextStart);
    }

    /**
     * Get the innermost scope that contains the given node.
     * Walks up the scope tree from the node's scope.
     */
    getScope(node) {
        // Try to acquire a scope directly associated with this node
        const acquired = this.scopeManager.acquire(node);
        if (acquired) return acquired;

        // Otherwise find which scope contains this node by position
        // Walk all scopes and find the innermost one whose block contains the node
        let bestScope = this.scopeManager.globalScope;

        const nodeStart = node.range ? node.range[0] : node.start;
        const nodeEnd = node.range ? node.range[1] : node.end;

        for (const scope of this.scopeManager.scopes) {
            const block = scope.block;
            if (!block) continue;
            const blockStart = block.range ? block.range[0] : block.start;
            const blockEnd = block.range ? block.range[1] : block.end;
            if (blockStart <= nodeStart && blockEnd >= nodeEnd) {
                // This scope contains the node; pick the innermost (smallest) scope
                const bestBlock = bestScope.block;
                if (bestBlock) {
                    const bestStart = bestBlock.range ? bestBlock.range[0] : bestBlock.start;
                    const bestEnd = bestBlock.range ? bestBlock.range[1] : bestBlock.end;
                    if ((blockEnd - blockStart) < (bestEnd - bestStart)) {
                        bestScope = scope;
                    }
                } else {
                    bestScope = scope;
                }
            }
        }

        return bestScope;
    }

    /**
     * Get variables declared by a given node (delegated to eslint-scope).
     */
    getDeclaredVariables(node) {
        return this.scopeManager.getDeclaredVariables(node);
    }

    /**
     * Convert a character offset to { line, column } (1-based line, 0-based column).
     * Used internally.
     */
    getLocFromIndex(index) {
        // Binary search the line offsets
        let lo = 0;
        let hi = this._lineOffsets.length - 1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (this._lineOffsets[mid] <= index) {
                lo = mid;
            } else {
                hi = mid - 1;
            }
        }
        return { line: lo + 1, column: index - this._lineOffsets[lo] };
    }
}

/**
 * Normalize token query options.
 * Options can be: number (skip), function (filter), or object { skip, filter, includeComments }.
 */
function _normalizeOptions(rawOptions) {
    if (typeof rawOptions === 'number') {
        return { skip: rawOptions, filter: null, includeComments: false };
    }
    if (typeof rawOptions === 'function') {
        return { skip: 0, filter: rawOptions, includeComments: false };
    }
    if (rawOptions && typeof rawOptions === 'object') {
        return {
            skip: rawOptions.skip ?? 0,
            filter: rawOptions.filter ?? null,
            includeComments: rawOptions.includeComments ?? false,
        };
    }
    return { skip: 0, filter: null, includeComments: false };
}

/**
 * Normalize token count options (for getFirstTokens/getLastTokens).
 * Options can be: number (count), function (filter), or object { count, filter, includeComments }.
 */
function _normalizeCountOptions(rawOptions) {
    if (typeof rawOptions === 'number') {
        return { count: rawOptions, filter: null, includeComments: false };
    }
    if (typeof rawOptions === 'function') {
        return { count: Infinity, filter: rawOptions, includeComments: false };
    }
    if (rawOptions && typeof rawOptions === 'object') {
        return {
            count: rawOptions.count ?? Infinity,
            filter: rawOptions.filter ?? null,
            includeComments: rawOptions.includeComments ?? false,
        };
    }
    return { count: Infinity, filter: null, includeComments: false };
}

/**
 * Filter a sorted token array to those whose range overlaps [start, end).
 * Tokens are included if they start before `end` and end after `start`.
 */
function _filterByRange(sorted, start, end) {
    const result = [];
    for (const token of sorted) {
        if (token.start >= end) break;
        if (token.end > start) {
            result.push(token);
        }
    }
    return result;
}

export default SourceCode;
