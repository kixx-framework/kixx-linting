import { assert } from "./assert.js";
import ScopeManager from "./scope-manager.js";
import Referencer from "./referencer.js";
import Reference from "./reference.js";
import Variable from "./variable.js";
import { Definition } from "./definition.js";
import PatternVisitor from "./pattern-visitor.js";
import { Scope } from "./scope.js";

function defaultOptions() {
    return {
        optimistic: false,
        nodejsScope: false,
        impliedStrict: false,
        sourceType: "script",
        ecmaVersion: 5,
        childVisitorKeys: null,
        fallback: "iteration",
    };
}

function isHashObject(value) {
    return (
        typeof value === "object" &&
        value instanceof Object &&
        !Array.isArray(value) &&
        !(value instanceof RegExp)
    );
}

function updateDeeply(target, override) {
    if (!isHashObject(override)) {
        return target;
    }

    for (const key of Object.keys(override)) {
        const value = override[key];

        if (isHashObject(value)) {
            if (isHashObject(target[key])) {
                updateDeeply(target[key], value);
            } else {
                target[key] = updateDeeply({}, value);
            }
        } else {
            target[key] = value;
        }
    }

    return target;
}

function analyzeScope(ast, providedOptions = {}) {
    const options = updateDeeply(defaultOptions(), providedOptions);
    const scopeManager = new ScopeManager(options);
    const referencer = new Referencer(options, scopeManager);

    referencer.visit(ast);

    assert(scopeManager.__currentScope === null, "currentScope should be null.");

    return scopeManager;
}

export const version = "9.1.2";

export function analyze(ast, options = {}) {
    const { globals, ...scopeOptions } = options;
    const scopeManager = analyzeScope(ast, scopeOptions);

    if (globals && typeof globals === "object") {
        scopeManager.addGlobals(Object.keys(globals));
    }

    return scopeManager;
}

export {
    Definition,
    PatternVisitor,
    Referencer,
    Reference,
    Scope,
    ScopeManager,
    Variable,
};
