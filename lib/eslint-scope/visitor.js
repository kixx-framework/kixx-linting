import Syntax from "./syntax.js";
import VISITOR_KEYS, { mergeVisitorKeys } from "./visitor-keys.js";

function isNode(node) {
    return Boolean(node) && typeof node === "object" && typeof node.type === "string";
}

function isPropertyContainer(nodeType, key) {
    return (
        (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) &&
        key === "properties"
    );
}

function toFallbackFunction(fallback) {
    if (fallback === "iteration") {
        return Object.keys;
    }

    if (typeof fallback === "function") {
        return fallback;
    }

    return null;
}

function getVisitorMethod(visitor, nodeType) {
    let current = visitor;

    while (current) {
        if (Object.hasOwn(current, nodeType)) {
            return current[nodeType];
        }

        current = Object.getPrototypeOf(current);
    }

    return null;
}

export class Visitor {
    constructor(visitor, options) {
        const normalizedOptions = options ?? {};

        this.__visitor = visitor || this;

        const providedChildVisitorKeys = normalizedOptions.childVisitorKeys;

        this.__childVisitorKeys = providedChildVisitorKeys
            ? mergeVisitorKeys(providedChildVisitorKeys)
            : VISITOR_KEYS;

        this.__fallback = toFallbackFunction(normalizedOptions.fallback);
    }

    visitChildren(node) {
        if (node === null || node === undefined) {
            return;
        }

        const type = node.type || Syntax.Property;
        let children = this.__childVisitorKeys[type];

        if (!children) {
            if (!this.__fallback) {
                throw new Error(`Unknown node type ${type}.`);
            }

            children = this.__fallback(node);
        }

        for (const childKey of children) {
            const child = node[childKey];

            if (!child) {
                continue;
            }

            if (Array.isArray(child)) {
                for (const childNode of child) {
                    if (!childNode) {
                        continue;
                    }

                    if (isNode(childNode) || isPropertyContainer(type, childKey)) {
                        this.visit(childNode);
                    }
                }

                continue;
            }

            if (isNode(child)) {
                this.visit(child);
            }
        }
    }

    visit(node) {
        if (node === null || node === undefined) {
            return;
        }

        const type = node.type || Syntax.Property;
        const visitorMethod = getVisitorMethod(this.__visitor, type);

        if (typeof visitorMethod === "function") {
            visitorMethod.call(this, node);
            return;
        }

        this.visitChildren(node);
    }
}

export function visit(node, visitor, options) {
    const walker = new Visitor(visitor, options);

    walker.visit(node);
}
