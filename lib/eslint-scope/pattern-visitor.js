import Syntax from "./syntax.js";
import { Visitor } from "./visitor.js";

function getLast(items) {
    return items.at(-1) || null;
}

class PatternVisitor extends Visitor {
    static isPattern(node) {
        const nodeType = node.type;

        return (
            nodeType === Syntax.Identifier ||
            nodeType === Syntax.ObjectPattern ||
            nodeType === Syntax.ArrayPattern ||
            nodeType === Syntax.SpreadElement ||
            nodeType === Syntax.RestElement ||
            nodeType === Syntax.AssignmentPattern
        );
    }

    constructor(options, rootPattern, callback) {
        super(null, options);
        this.rootPattern = rootPattern;
        this.callback = callback;
        this.assignments = [];
        this.rightHandNodes = [];
        this.restElements = [];
    }

    Identifier(pattern) {
        const lastRestElement = getLast(this.restElements);

        this.callback(pattern, {
            topLevel: pattern === this.rootPattern,
            rest: Boolean(lastRestElement) && lastRestElement.argument === pattern,
            assignments: this.assignments,
        });
    }

    Property(property) {
        if (property.computed) {
            this.rightHandNodes.push(property.key);
        }

        this.visit(property.value);
    }

    ArrayPattern(pattern) {
        for (const element of pattern.elements) {
            this.visit(element);
        }
    }

    AssignmentPattern(pattern) {
        this.assignments.push(pattern);
        this.visit(pattern.left);
        this.rightHandNodes.push(pattern.right);
        this.assignments.pop();
    }

    RestElement(pattern) {
        this.restElements.push(pattern);
        this.visit(pattern.argument);
        this.restElements.pop();
    }

    MemberExpression(node) {
        if (node.computed) {
            this.rightHandNodes.push(node.property);
        }

        this.rightHandNodes.push(node.object);
    }

    SpreadElement(node) {
        this.visit(node.argument);
    }

    ArrayExpression(node) {
        for (const element of node.elements) {
            this.visit(element);
        }
    }

    AssignmentExpression(node) {
        this.assignments.push(node);
        this.visit(node.left);
        this.rightHandNodes.push(node.right);
        this.assignments.pop();
    }

    CallExpression(node) {
        for (const arg of node.arguments) {
            this.rightHandNodes.push(arg);
        }

        this.visit(node.callee);
    }
}

export default PatternVisitor;
