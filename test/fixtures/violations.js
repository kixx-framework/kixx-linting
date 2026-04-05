// TODO: remove this file once violations are catalogued (no-warning-comments)
'use strict'; // strict: redundant 'use strict' in ES module

// ── Imports ──────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs'
import { writeFileSync } from 'node:fs'; // no-duplicate-imports; semi on prev line

// ── Variable declarations ─────────────────────────────────────────────────────

var legacyVar = 1; // no-var
legacyVar;

let neverReassigned = legacyVar; neverReassigned; // prefer-const; max-statements-per-line

// no-use-before-define: variable used before its declaration
const useBeforeRef = notYetDeclared; useBeforeRef;
const notYetDeclared = 1; notYetDeclared;

let undefined = 0; // no-shadow-restricted-names
undefined;

const completelyUnused = 42; // no-unused-vars

let declaredNoInit; // no-unassigned-vars
declaredNoInit;

let overwritten;
overwritten = 1;
overwritten = 2; // no-useless-assignment: first write never read
overwritten;

undeclaredVar; // no-undef

// ── Binding violations ────────────────────────────────────────────────────────

const immutable = 1;
immutable = 2; // no-const-assign
immutable;

function namedFn() { return 1; }
namedFn = null; // no-func-assign
namedFn;

class ReassignableClass {}
ReassignableClass = null; // no-class-assign
ReassignableClass;

Math = null; // no-global-assign

Array.prototype.badMethod = function() {}; // no-extend-native

let shadowUndefined = undefined; // no-shadow-restricted-names (re-use same binding)
shadowUndefined;

try {
    readFileSync('/nonexistent');
} catch (caughtEx) {
    caughtEx = 'overwritten'; // no-ex-assign
}

// ── Functions ─────────────────────────────────────────────────────────────────

const funcExpression = function namedExpr() { return 1; }; // func-style
funcExpression;

function invalidThisFn() {
    return this.value; // no-invalid-this
}
invalidThisFn();

function withArguments() {
    return arguments[0]; // prefer-rest-params
}
withArguments(1);

function withCaller() {
    return arguments.caller; // no-caller
}
withCaller();

function* noYieldGenerator() {
    return 1; // require-yield: generator has no yield
}
noYieldGenerator();

function normalFn() { return 0; }
normalFn (); // func-call-spacing: space before (

[1, 2].map(function(x) { return x * 2; }); // prefer-arrow-callback

for (var loopVar = 0; loopVar < 3; loopVar++) { // no-loop-func; no-plusplus
    setTimeout(function() { return loopVar; }, 0);
}

function withRestSpread(a, ...rest) {
    const arr = [1, 2];
    const spread = [... arr]; // rest-spread-spacing: space after ...
    return rest.length + spread.length;
}
withRestSpread(0);

// ── Classes ───────────────────────────────────────────────────────────────────

class DupeMembers {
    method() { return 1; }
    method() { return 2; } // no-dupe-class-members
}
new DupeMembers();

class UselessCtor {
    constructor() {} // no-useless-constructor
}
new UselessCtor();

class WithUnusedPrivate {
    #secretField; // no-unused-private-class-members
    method() { return 0; }
}
new WithUnusedPrivate();

class BaseClass {
    constructor(x) { this.x = x; }
}

class NoSuperCall extends BaseClass {
    constructor() {
        // missing super() → constructor-super
    }
}
new NoSuperCall();

class ThisBeforeSuper extends BaseClass {
    constructor(x) {
        this.extra = x; // no-this-before-super: this used before super()
        super(x);
    }
}
new ThisBeforeSuper(1);

class AccessorBadOrder {
    set value(v) { this._v = v; } // grouped-accessor-pairs: setter before getter
    get value() {} // getter-return: getter has no return statement
}
new AccessorBadOrder();

class SetterWithReturn {
    set name(v) { return v; } // no-setter-return: setter must not return a value
    get name() { return this._name; }
}
new SetterWithReturn();

// no-useless-computed-key: computed key is a plain string literal
const uselessComputedKey = { ["foo"]: 1, bar: 2 };
uselessComputedKey;

// ── Switches ──────────────────────────────────────────────────────────────────

function checkSwitch(x) {
    switch (x) {
        default: // default-case-last: default is not the last case
            break;
        case 1:
            const switchDecl = 1; // no-case-declarations: declaration in case without block
            return switchDecl;
        case 2:
            return 2;
        case 1: // no-duplicate-case
            return 3;
    }
}
checkSwitch(0);

// ── Control flow ──────────────────────────────────────────────────────────────

function checkCondAssign(getValue) {
    let r;
    if (r = getValue()) { r; } // no-cond-assign
}
checkCondAssign(() => 1);

if (true) {} // no-constant-condition; no-empty

while (false) {} // no-empty

function checkLonelyIf(a) {
    if (a > 0) {
        return 1;
    } else {
        if (a < 0) { return -1; } // no-lonely-if: should be else if
    }
}
checkLonelyIf(0);

function checkDupeElseIf(x) {
    if (x > 0) {
        return 1;
    } else if (x > 0) { // no-dupe-else-if: duplicate condition
        return 2;
    }
    return 0;
}
checkDupeElseIf(0);

function withUnreachable() {
    return 1;
    normalFn(); // no-unreachable
}
withUnreachable();

function withUnreachableLoop(cond) {
    while (cond) {
        return true; // no-unreachable-loop: always exits on first iteration
    }
}
withUnreachableLoop(true);

function withUnsafeFinally() {
    try {
        normalFn();
    } finally {
        return 0; // no-unsafe-finally
    }
}
withUnsafeFinally();

if (!legacyVar in Object) {} // no-unsafe-negation: !x in y

for (let fi = 0; fi < 10; fi--) {} // for-direction: decrement moves away from condition

let staticCond = 5;
while (staticCond > 0) {} // no-unmodified-loop-condition: staticCond never changes in body

unusedLabel: // no-unused-labels
for (let i = 0; i < 3; i += 1) { normalFn(); }

function withOptionalChaining(a) {
    return new (a?.b)(); // no-unsafe-optional-chaining
}
withOptionalChaining({});

function elseAfterReturn(x) {
    if (x > 0) {
        return 1;
    } else { // no-else-return
        return 0;
    }
}
elseAfterReturn(0);

debugger; // no-debugger

// ── Expressions ───────────────────────────────────────────────────────────────

if (legacyVar == 1) {} // eqeqeq
if (legacyVar == null) {} // no-eq-null
if (legacyVar === NaN) {} // use-isnan
if (typeof legacyVar === 'nunber') {} // valid-typeof
if (legacyVar === -0) {} // no-compare-neg-zero

let seqX = 0, seqY = 0;
seqX = 1, seqY = 2; // no-sequences: comma operator
seqX; seqY;

let multiA, multiB;
multiA = multiB = 1; // no-multi-assign
multiA; multiB;

const nested = legacyVar > 0 ? (legacyVar > 1 ? 'big' : 'med') : 'small'; // no-nested-ternary
nested;

const mixedOps = legacyVar + neverReassigned * 2; // no-mixed-operators
mixedOps;

function throwLiteral() {
    throw 'not an Error object'; // no-throw-literal
}

function returnWithAssign(x) {
    let y;
    return y = x + 1; // no-return-assign
}
returnWithAssign(1);

const concatLiterals = 'foo' + 'bar'; // no-useless-concat
concatLiterals;

const badEscape = "\a"; // no-useless-escape
badEscape;

const bigPrecision = 9007199254740993; // no-loss-of-precision
bigPrecision;

const templateInString = "${x} is not interpolated"; // no-template-curly-in-string
templateInString;

const floatDecimal = .5; // no-floating-decimal
floatDecimal;

const fromBinary = parseInt('10', 2); // prefer-numeric-literals: use 0b10
fromBinary;

const implicitBool = !!legacyVar; // no-implicit-coercion
implicitBool;

1 + 2; // no-unused-expressions

const constBinary = [] === []; // no-constant-binary-expression
constBinary;

const dupeKeyObj = { key: 1, key: 2 }; // no-dupe-keys
dupeKeyObj;

const newWrapper = new String('x'); // no-new-wrappers
newWrapper;

const badSymbol = new Symbol(); // no-new-native-nonconstructor
badSymbol;

class NewNoParens {}
const noParensNew = new NewNoParens; // new-parens
noParensNew;

// ── Object/prototype/global calls ─────────────────────────────────────────────

console.log('hello'); // no-console

const protoObj = {};
protoObj.hasOwnProperty('key'); // no-prototype-builtins

const badMath = Math(); // no-obj-calls
badMath;

setTimeout('console.log(1)', 100); // no-implied-eval

const noRadix = parseInt('10'); // radix: missing radix argument
noRadix;

const noSpaces = legacyVar+neverReassigned; // space-infix-ops
noSpaces;

const typeofNoSpace = typeof(legacyVar); // space-unary-ops: keyword operator needs space
typeofNoSpace;

// ── Async / Promises ──────────────────────────────────────────────────────────

async function asyncViolations() {
    const p1 = new Promise(async (resolve) => { // no-async-promise-executor
        resolve(1);
    });
    p1;

    const p2 = new Promise((resolve) => {
        return resolve(2); // no-promise-executor-return
    });
    p2;

    new Promise((resolve, reject) => {
        reject('string error'); // prefer-promise-reject-errors
    });

    let counter = 0;
    counter += await Promise.resolve(1); // require-atomic-updates
    counter;
}
asyncViolations();

// ── Regex ─────────────────────────────────────────────────────────────────────

const regexSpaces = /foo  bar/; // no-regex-spaces: two consecutive spaces
regexSpaces;

const emptyClass = /[]/; // no-empty-character-class
emptyClass;

const ctrlChar = /\x00/; // no-control-regex: null byte (U+0000)
ctrlChar;

const invalidRe = new RegExp('['); // no-invalid-regexp: unclosed bracket
invalidRe;

const fwdBackref = /\1(a)/; // no-useless-backreference: forward reference
fwdBackref;

const misleadingCls = /[a\u0301]/; // no-misleading-character-class: combining accent
misleadingCls;

// ── Catch violations ──────────────────────────────────────────────────────────

try {
    normalFn();
} catch (e) {
    throw e; // no-useless-catch: catch only rethrows
}

try {
    normalFn();
} catch (caughtErr) {
    throw new Error('failed'); // preserve-caught-error: missing { cause: caughtErr }
}

// ── Multiline / spacing ───────────────────────────────────────────────────────

// no-unexpected-multiline: computed member access split across lines
const splitObj = { prop: 1 };
const splitResult = splitObj
    ['prop']; // no-unexpected-multiline
splitResult;

// comma-dangle: multiline object missing trailing comma
const noTrailingComma = {
    alpha: 1,
    beta: 2
}; // no trailing comma on beta line
noTrailingComma;

// indent: deliberately wrong indentation (2-space instead of 4-space)
function badIndent() {
  return 1; // indent: 2 spaces instead of 4
}
badIndent();

export { legacyVar }; // makes this file a module   
// no-irregular-whitespace: non-breaking space in comment above
