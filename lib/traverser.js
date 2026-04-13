/**
 * AST traverser — walks the AST depth-first and fires visitor callbacks.
 *
 * visitors is a Map<string, Function[]> where keys are node types (enter) or
 * "NodeType:exit" (leave). Each value is an array of callbacks.
 *
 * Code-path events (onCodePathStart, onCodePathEnd, onCodePathSegmentStart,
 * onCodePathSegmentEnd, onUnreachableCodePathSegmentStart,
 * onUnreachableCodePathSegmentEnd, onCodePathSegmentLoop) are emitted when
 * any rule has subscribed to them. In that case the traversal is driven
 * through the vendored CodePathAnalyzer.
 */

import CodePathAnalyzer from "./code-path-analysis/index.js";

const CODE_PATH_EVENTS = new Set([
    "onCodePathStart",
    "onCodePathEnd",
    "onCodePathSegmentStart",
    "onCodePathSegmentEnd",
    "onUnreachableCodePathSegmentStart",
    "onUnreachableCodePathSegmentEnd",
    "onCodePathSegmentLoop",
]);

/**
 * Traverse the AST, firing visitor callbacks.
 *
 * @param {object} ast - ESTree program AST (from acorn)
 * @param {object} visitorKeys - Map of node type to child property names
 * @param {Map<string, Function[]>} visitors - Map of event name to callback arrays
 * @returns {void}
 */
export function traverse(ast, visitorKeys, visitors) {
    // Determine if code-path analysis is needed
    const needsCodePath = [...visitors.keys()].some(k => CODE_PATH_EVENTS.has(k));

    // Build a simple event generator that fires rule visitors
    const nodeEventGenerator = {
        enterNode(node) {
            const callbacks = visitors.get(node.type);
            if (callbacks) {
                for (const cb of callbacks) cb(node, node.parent ?? null);
            }
        },
        leaveNode(node) {
            const callbacks = visitors.get(`${node.type}:exit`);
            if (callbacks) {
                for (const cb of callbacks) cb(node, node.parent ?? null);
            }
        },
        emit(eventName, args) {
            const callbacks = visitors.get(eventName);
            if (callbacks) {
                for (const cb of callbacks) cb(...args);
            }
        },
    };

    // Wrap with CodePathAnalyzer if any rule needs code-path events
    const eventGenerator = needsCodePath
        ? new CodePathAnalyzer(nodeEventGenerator)
        : nodeEventGenerator;

    // Perform depth-first traversal, annotating parent pointers
    _traverse(ast, null, visitorKeys, eventGenerator);
}

/**
 * Recursive depth-first traversal.
 *
 * @param {object} node - Current AST node
 * @param {object|null} parent - Parent node
 * @param {object} visitorKeys - Child property map
 * @param {object} eventGenerator - enterNode/leaveNode event dispatcher
 */
function _traverse(node, parent, visitorKeys, eventGenerator) {
    if (node === null || node === undefined) return;
    if (typeof node !== "object" || typeof node.type !== "string") return;

    // Annotate parent so rules and code-path analysis can navigate up
    node.parent = parent;

    // Enter phase
    eventGenerator.enterNode(node);

    // Recurse into children
    const keys = visitorKeys[node.type];
    if (keys) {
        for (const key of keys) {
            const child = node[key];
            if (Array.isArray(child)) {
                for (const item of child) {
                    _traverse(item, node, visitorKeys, eventGenerator);
                }
            } else if (child && typeof child === "object" && typeof child.type === "string") {
                _traverse(child, node, visitorKeys, eventGenerator);
            }
        }
    } else {
        throw new Error(`Unknown node type: ${node.type}`);
    }

    // Leave phase
    eventGenerator.leaveNode(node);
}

export default traverse;
