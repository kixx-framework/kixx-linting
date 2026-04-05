/**
 * no-global-assign — disallow assignments to native objects or read-only global variables.
 * Adapted from ESLint's no-global-assign rule.
 */

// Built-in global objects that should never be reassigned
const NATIVE_GLOBALS = new Set([
    "Array", "Boolean", "Date", "decodeURI", "decodeURIComponent",
    "encodeURI", "encodeURIComponent", "Error", "eval", "EvalError",
    "Float32Array", "Float64Array", "Function", "Infinity", "Int16Array",
    "Int32Array", "Int8Array", "isFinite", "isNaN", "JSON", "Map",
    "Math", "NaN", "Number", "Object", "parseFloat", "parseInt",
    "Promise", "Proxy", "RangeError", "ReferenceError", "Reflect",
    "RegExp", "Set", "String", "Symbol", "SyntaxError", "TypeError",
    "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray",
    "undefined", "URIError", "WeakMap", "WeakSet", "WeakRef",
    "globalThis", "Atomics", "SharedArrayBuffer", "BigInt", "BigInt64Array",
    "BigUint64Array", "queueMicrotask", "structuredClone",
]);

const noGlobalAssignRule = {
    meta: {
        type: "suggestion",
        schema: [
            {
                type: "object",
                properties: {
                    exceptions: {
                        type: "array",
                        items: { type: "string" },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const exceptions = new Set(context.options[0]?.exceptions ?? []);

        return {
            "Program:exit"(node) {
                const scope = context.sourceCode.getScope(node);

                // Check all variables in the global scope
                function checkScope(s) {
                    for (const variable of s.variables) {
                        const name = variable.name;
                        if (!NATIVE_GLOBALS.has(name) || exceptions.has(name)) continue;
                        // Check for write references that are not the initial definition
                        for (const ref of variable.references) {
                            if (ref.isWrite()) {
                                context.report({
                                    node: ref.identifier,
                                    message: `Read-only global '${name}' should not be modified.`,
                                });
                            }
                        }
                    }
                    for (const child of s.childScopes) {
                        checkScope(child);
                    }
                }

                checkScope(scope);
            },
        };
    },
};

export default noGlobalAssignRule;
