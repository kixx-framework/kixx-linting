/**
 * no-extend-native — disallow extending native types.
 * Adapted from ESLint's no-extend-native rule.
 */

// Native prototype objects whose .prototype should not be modified
const NATIVE_OBJECTS = new Set([
    "Array", "ArrayBuffer", "Boolean", "DataView", "Date",
    "Error", "EvalError", "Float32Array", "Float64Array", "Function",
    "Int16Array", "Int32Array", "Int8Array", "JSON", "Map", "Math",
    "Number", "Object", "Promise", "Proxy", "RangeError", "ReferenceError",
    "RegExp", "Set", "String", "Symbol", "SyntaxError", "TypeError",
    "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray",
    "URIError", "WeakMap", "WeakSet",
]);

function isNativePrototypeAssignment(node) {
    // Detects: NativeType.prototype.x = ...
    if (node.type !== "AssignmentExpression") return null;
    const left = node.left;
    if (left.type !== "MemberExpression") return null;

    // x.prototype.y = ... → left.object is MemberExpression (x.prototype), left.property is y
    const objExpr = left.object;
    if (!objExpr || objExpr.type !== "MemberExpression") return null;

    const protoProperty = objExpr.property;
    if (!protoProperty || protoProperty.type !== "Identifier" || protoProperty.name !== "prototype") return null;
    if (objExpr.computed) return null;

    const object = objExpr.object;
    if (!object || object.type !== "Identifier") return null;

    if (!NATIVE_OBJECTS.has(object.name)) return null;
    return object.name;
}

function isNativePrototypeDefineProperty(node) {
    // Detects: Object.defineProperty(NativeType.prototype, ...)
    if (node.type !== "CallExpression") return null;
    const callee = node.callee;
    if (!callee || callee.type !== "MemberExpression") return null;
    if (callee.computed) return null;

    const obj = callee.object;
    const method = callee.property;
    if (!obj || obj.type !== "Identifier" || obj.name !== "Object") return null;
    if (!method || method.type !== "Identifier") return null;
    if (method.name !== "defineProperty" && method.name !== "defineProperties") return null;

    const args = node.arguments;
    if (!args || args.length < 1) return null;

    const target = args[0];
    if (!target || target.type !== "MemberExpression") return null;
    if (target.computed) return null;

    const prop = target.property;
    if (!prop || prop.type !== "Identifier" || prop.name !== "prototype") return null;

    const targetObj = target.object;
    if (!targetObj || targetObj.type !== "Identifier") return null;
    if (!NATIVE_OBJECTS.has(targetObj.name)) return null;

    return targetObj.name;
}

const noExtendNativeRule = {
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
            AssignmentExpression(node) {
                const nativeName = isNativePrototypeAssignment(node);
                if (nativeName && !exceptions.has(nativeName)) {
                    context.report({
                        node,
                        message: `${nativeName} prototype is read only, properties should not be added.`,
                    });
                }
            },
            CallExpression(node) {
                const nativeName = isNativePrototypeDefineProperty(node);
                if (nativeName && !exceptions.has(nativeName)) {
                    context.report({
                        node,
                        message: `${nativeName} prototype is read only, properties should not be added.`,
                    });
                }
            },
        };
    },
};

export default noExtendNativeRule;
