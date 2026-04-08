#!/usr/bin/env node
/**
 * lint.js — CLI wrapper for lintText().
 * Usage: node lint.js <path-to-file>
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { lintText } from "./lib/linter.js";

const filePath = process.argv[2];

if (!filePath) {
    console.error("Usage: node lint.js <path-to-file>");
    process.exit(1);
}

const absolutePath = resolve(filePath);
let source;

try {
    source = readFileSync(absolutePath, "utf8");
} catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
}

const rules = {
    "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        functions: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
    }],
    "constructor-super": ["error"],
    "default-case-last": ["error"],
    "eol-last": ["error"],
    "eqeqeq": ["error"],
    "for-direction": ["error"],
    "func-call-spacing": ["error"],
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "getter-return": ["error"],
    "grouped-accessor-pairs": ["error", "getBeforeSet"],
    "indent": ["error", 4, { SwitchCase: 1 }],
    "max-statements-per-line": ["error", { max: 1 }],
    "new-parens": ["error"],
    "no-async-promise-executor": ["error"],
    "no-caller": ["error"],
    "no-case-declarations": ["error"],
    "no-class-assign": ["error"],
    "no-compare-neg-zero": ["error"],
    "no-cond-assign": ["error"],
    "no-console": ["error"],
    "no-const-assign": ["error"],
    "no-constant-binary-expression": ["error"],
    "no-constant-condition": ["error"],
    "no-control-regex": ["error"],
    "no-debugger": ["error"],
    "no-duplicate-imports": ["error"],
    "no-dupe-class-members": ["error"],
    "no-dupe-else-if": ["error"],
    "no-dupe-keys": ["error"],
    "no-duplicate-case": ["error"],
    "no-else-return": ["error"],
    "no-empty": ["error"],
    "no-empty-character-class": ["error"],
    "no-eq-null": ["error"],
    "no-ex-assign": ["error"],
    "no-extend-native": ["error"],
    "no-floating-decimal": ["error"],
    "no-func-assign": ["error"],
    "no-global-assign": ["error"],
    "no-implicit-coercion": ["error"],
    "no-invalid-regexp": ["error"],
    "no-invalid-this": ["error"],
    "no-irregular-whitespace": ["error"],
    "no-lonely-if": ["error"],
    "no-loop-func": ["error"],
    "no-loss-of-precision": ["error"],
    "no-misleading-character-class": ["error"],
    "no-mixed-operators": ["warn"],
    "no-multi-assign": ["error"],
    "no-nested-ternary": ["error"],
    "no-new-native-nonconstructor": ["error"],
    "no-new-wrappers": ["error"],
    "no-obj-calls": ["error"],
    "no-plusplus": ["error"],
    "no-prototype-builtins": ["error"],
    "no-promise-executor-return": ["error"],
    "no-regex-spaces": ["error"],
    "no-return-assign": ["error"],
    "no-sequences": ["error"],
    "no-setter-return": ["error"],
    "no-shadow-restricted-names": ["error"],
    "no-template-curly-in-string": ["error"],
    "no-this-before-super": ["error"],
    "no-throw-literal": ["error"],
    "no-trailing-spaces": ["error"],
    "no-unassigned-vars": ["error"],
    "no-undef": ["error"],
    "no-unexpected-multiline": ["error"],
    "no-unmodified-loop-condition": ["error"],
    "no-unreachable": ["error"],
    "no-unsafe-finally": ["error"],
    "no-unsafe-negation": ["error"],
    "no-unused-expressions": ["error"],
    "no-unused-labels": ["error"],
    "no-unused-private-class-members": ["error"],
    "no-unused-vars": ["error"],
    "no-use-before-define": ["error", { functions: false, classes: false }],
    "no-useless-assignment": ["error"],
    "no-useless-backreference": ["error"],
    "no-useless-catch": ["error"],
    "no-useless-computed-key": ["error"],
    "no-useless-concat": ["error"],
    "no-useless-constructor": ["error"],
    "no-useless-escape": ["error"],
    "no-var": ["error"],
    "no-warning-comments": ["warn", { location: "anywhere" }],
    "preserve-caught-error": ["error"],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true, allowUnboundThis: false }],
    "prefer-const": ["error"],
    "prefer-numeric-literals": ["error"],
    "prefer-promise-reject-errors": ["error"],
    "prefer-rest-params": ["error"],
    "radix": ["error"],
    "require-atomic-updates": ["error"],
    "require-yield": ["error"],
    "rest-spread-spacing": ["error", "never"],
    "semi": ["error", "always"],
    "space-infix-ops": ["error"],
    "space-unary-ops": ["error", { words: true, nonwords: false }],
    "strict": ["error"],
    "use-isnan": ["error"],
    "valid-typeof": ["error"],
};

const globals = {
    console: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
    structuredClone: "readonly",
    Blob: "readonly",
    TextEncoder: "readonly",
    TextDecoder: "readonly",
    URL: "readonly",
    URLSearchParams: "readonly",
    Headers: "readonly",
    Request: "readonly",
    Response: "readonly",
    fetch: "readonly",
    btoa: "readonly",
    atob: "readonly",
    global: "readonly",
    process: "readonly",
    Buffer: "readonly",
    queueMicrotask: "readonly",
    // ECMAScript built-ins
    Array: "readonly",
    ArrayBuffer: "readonly",
    BigInt: "readonly",
    Boolean: "readonly",
    DataView: "readonly",
    Date: "readonly",
    Error: "readonly",
    EvalError: "readonly",
    Float32Array: "readonly",
    Float64Array: "readonly",
    Function: "readonly",
    Infinity: "readonly",
    Int16Array: "readonly",
    Int32Array: "readonly",
    Int8Array: "readonly",
    JSON: "readonly",
    Map: "readonly",
    Math: "readonly",
    NaN: "readonly",
    Number: "readonly",
    Object: "readonly",
    Promise: "readonly",
    Proxy: "readonly",
    RangeError: "readonly",
    ReferenceError: "readonly",
    Reflect: "readonly",
    RegExp: "readonly",
    Set: "readonly",
    String: "readonly",
    Symbol: "readonly",
    SyntaxError: "readonly",
    TypeError: "readonly",
    Uint16Array: "readonly",
    Uint32Array: "readonly",
    Uint8Array: "readonly",
    Uint8ClampedArray: "readonly",
    URIError: "readonly",
    WeakMap: "readonly",
    WeakRef: "readonly",
    WeakSet: "readonly",
    decodeURI: "readonly",
    decodeURIComponent: "readonly",
    encodeURI: "readonly",
    encodeURIComponent: "readonly",
    eval: "readonly",
    isFinite: "readonly",
    isNaN: "readonly",
    parseFloat: "readonly",
    parseInt: "readonly",
    undefined: "readonly",
    globalThis: "readonly",
};

const result = lintText(source, {
    fileName: absolutePath,
    rules,
    globals,
});

const SEVERITY_LABEL = { 1: "warn", 2: "error" };

if (result.messages.length === 0) {
    console.log(`${filePath}: no issues found`);
} else {
    for (const msg of result.messages) {
        const severity = SEVERITY_LABEL[msg.severity] ?? "error";
        const loc = `${msg.line}:${msg.column}`;
        const rule = msg.ruleId ?? "parse-error";
        console.log(`${filePath}:${loc}  ${severity}  ${msg.message}  (${rule})`);
    }
}

const exitCode = result.errorCount > 0 ? 1 : 0;
process.exit(exitCode);
