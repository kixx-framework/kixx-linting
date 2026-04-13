/**
 * @fileoverview A class to operate forking.
 *
 * This is state of forking.
 * This has a fork list and manages it.
 *
 * @author Toru Nagashima
 */

import assert from "node:assert";
import { CodePathSegment } from "./code-path-segment.js";

/**
 * Determines whether or not a given segment is reachable.
 * @param {CodePathSegment} segment The segment to check.
 * @returns {boolean} `true` if the segment is reachable.
 */
function isReachable(segment) {
    return segment.reachable;
}

/**
 * Creates a new segment for each fork in the given context and appends it
 * to the end of the specified range of segments.
 * @param {ForkContext} context An instance from which the previous segments
 *      will be obtained.
 * @param {number} startIndex The index of the first segment in the context
 *      that should be specified as previous segments for the newly created segments.
 * @param {number} endIndex The index of the last segment in the context
 *      that should be specified as previous segments for the newly created segments.
 * @param {Function} create A function that creates new `CodePathSegment`
 *      instances in a particular way. See the `CodePathSegment.new*` methods.
 * @returns {Array<CodePathSegment>} An array of the newly-created segments.
 */
function createSegments(context, startIndex, endIndex, create) {
    /** @type {Array<Array<CodePathSegment>>} */
    const list = context.segmentsList;

    const normalizedBegin =
        startIndex >= 0 ? startIndex : list.length + startIndex;
    const normalizedEnd = endIndex >= 0 ? endIndex : list.length + endIndex;

    /** @type {Array<CodePathSegment>} */
    const segments = [];

    for (let i = 0; i < context.count; i += 1) {
        const allPrevSegments = [];

        for (let j = normalizedBegin; j <= normalizedEnd; j += 1) {
            allPrevSegments.push(list[j][i]);
        }

        segments.push(create(context.idGenerator.next(), allPrevSegments));
    }

    return segments;
}

/**
 * Inside of a `finally` block we end up with two parallel paths. If the code path
 * exits by a control statement (such as `break` or `continue`) from the `finally`
 * block, then we need to merge the remaining parallel paths back into one.
 * @param {ForkContext} context The fork context to work on.
 * @param {Array<CodePathSegment>} segments Segments to merge.
 * @returns {Array<CodePathSegment>} The merged segments.
 */
function mergeExtraSegments(context, segments) {
    let currentSegments = segments;

    while (currentSegments.length > context.count) {
        const merged = [];
        const length = Math.floor(currentSegments.length / 2);

        for (let i = 0; i < length; i += 1) {
            merged.push(
                CodePathSegment.newNext(context.idGenerator.next(), [
                    currentSegments[i],
                    currentSegments[i + length],
                ]),
            );
        }

        currentSegments = merged;
    }

    return currentSegments;
}

/**
 * Manages the forking of code paths.
 */
export class ForkContext {
    /**
     * Creates a new instance.
     * @param {IdGenerator} idGenerator An identifier generator for segments.
     * @param {ForkContext|null} upper The preceding fork context.
     * @param {number} count The number of parallel segments in each element
     *      of `segmentsList`.
     */
    constructor(idGenerator, upper, count) {
        /**
         * The ID generator that will generate segment IDs for any new
         * segments that are created.
         * @type {IdGenerator}
         */
        this.idGenerator = idGenerator;

        /**
         * The preceding fork context.
         * @type {ForkContext|null}
         */
        this.upper = upper;

        /**
         * The number of elements in each element of `segmentsList`. In most
         * cases, this is 1 but can be 2 when there is a `finally` present.
         * @type {number}
         */
        this.count = count;

        /**
         * The segments within this context.
         * @type {Array<Array<CodePathSegment>>}
         */
        this.segmentsList = [];
    }

    /**
     * The segments that begin this fork context.
     * @type {Array<CodePathSegment>}
     */
    get head() {
        const list = this.segmentsList;

        return list.length === 0 ? [] : list.at(-1);
    }

    /**
     * Indicates if the context contains no segments.
     * @type {boolean}
     */
    get empty() {
        return this.segmentsList.length === 0;
    }

    /**
     * Indicates if there are any segments that are reachable.
     * @type {boolean}
     */
    get reachable() {
        const segments = this.head;

        return segments.length > 0 && segments.some(isReachable);
    }

    /**
     * Creates new segments in this context and appends them.
     * @param {number} startIndex The index of the first segment in the context.
     * @param {number} endIndex The index of the last segment in the context.
     * @returns {Array<CodePathSegment>} An array of the newly created segments.
     */
    makeNext(startIndex, endIndex) {
        return createSegments(
            this,
            startIndex,
            endIndex,
            CodePathSegment.newNext,
        );
    }

    /**
     * Creates new unreachable segments in this context and appends them.
     * @param {number} startIndex The index of the first segment in the context.
     * @param {number} endIndex The index of the last segment in the context.
     * @returns {Array<CodePathSegment>} An array of the newly created segments.
     */
    makeUnreachable(startIndex, endIndex) {
        return createSegments(
            this,
            startIndex,
            endIndex,
            CodePathSegment.newUnreachable,
        );
    }

    /**
     * Creates new disconnected segments in this context.
     * @param {number} startIndex The index of the first segment in the context.
     * @param {number} endIndex The index of the last segment in the context.
     * @returns {Array<CodePathSegment>} An array of the newly created segments.
     */
    makeDisconnected(startIndex, endIndex) {
        return createSegments(
            this,
            startIndex,
            endIndex,
            CodePathSegment.newDisconnected,
        );
    }

    /**
     * Adds segments to the head of this context.
     * @param {Array<CodePathSegment>} segments The segments to add.
     * @returns {void}
     */
    add(segments) {
        assert(
            segments.length >= this.count,
            `${segments.length} >= ${this.count}`,
        );
        this.segmentsList.push(mergeExtraSegments(this, segments));
    }

    /**
     * Replaces the head segments with the given segments.
     * @param {Array<CodePathSegment>} replacementHeadSegments The new head segments.
     * @returns {void}
     */
    replaceHead(replacementHeadSegments) {
        assert(
            replacementHeadSegments.length >= this.count,
            `${replacementHeadSegments.length} >= ${this.count}`,
        );
        this.segmentsList.splice(
            -1,
            1,
            mergeExtraSegments(this, replacementHeadSegments),
        );
    }

    /**
     * Adds all segments of a given fork context into this context.
     * @param {ForkContext} otherForkContext The fork context to add from.
     * @returns {void}
     */
    addAll(otherForkContext) {
        assert(otherForkContext.count === this.count);
        this.segmentsList.push(...otherForkContext.segmentsList);
    }

    /**
     * Clears all segments in this context.
     * @returns {void}
     */
    clear() {
        this.segmentsList = [];
    }

    /**
     * Creates a new root context.
     * @param {IdGenerator} idGenerator An identifier generator for segments.
     * @returns {ForkContext} New fork context.
     */
    static newRoot(idGenerator) {
        const context = new ForkContext(idGenerator, null, 1);

        context.add([CodePathSegment.newRoot(idGenerator.next())]);

        return context;
    }

    /**
     * Creates an empty fork context preceded by a given context.
     * @param {ForkContext} parentContext The parent fork context.
     * @param {boolean} shouldForkLeavingPath Indicates if we should fork leaving path.
     * @returns {ForkContext} New fork context.
     */
    static newEmpty(parentContext, shouldForkLeavingPath) {
        return new ForkContext(
            parentContext.idGenerator,
            parentContext,
            (shouldForkLeavingPath ? 2 : 1) * parentContext.count,
        );
    }
}
