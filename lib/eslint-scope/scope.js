import Syntax from "./syntax.js";
import Reference from "./reference.js";
import Variable from "./variable.js";
import { Definition } from "./definition.js";
import { assert } from "./assert.js";

function isStrictScope(scope, block, isMethodDefinition) {
    let body;

    if (scope.upper && scope.upper.isStrict) {
        return true;
    }

    if (isMethodDefinition) {
        return true;
    }

    if (scope.type === "class" || scope.type === "module") {
        return true;
    }

    if (scope.type === "block" || scope.type === "switch") {
        return false;
    }

    if (scope.type === "function") {
        if (
            block.type === Syntax.ArrowFunctionExpression &&
            block.body.type !== Syntax.BlockStatement
        ) {
            return false;
        }

        body = block.type === Syntax.Program ? block : block.body;

        if (!body) {
            return false;
        }
    } else if (scope.type === "global") {
        body = block;
    } else {
        return false;
    }

    for (const statement of body.body) {
        if (typeof statement.directive !== "string") {
            break;
        }

        if (statement.directive === "use strict") {
            return true;
        }
    }

    return false;
}

function registerScope(scopeManager, scope) {
    scopeManager.scopes.push(scope);

    const scopes = scopeManager.__nodeToScope.get(scope.block);

    if (scopes) {
        scopes.push(scope);
        return;
    }

    scopeManager.__nodeToScope.set(scope.block, [scope]);
}

class Scope {
    constructor(scopeManager, type, upperScope, block, isMethodDefinition) {
        this.type = type;
        this.set = new Map();
        this.taints = new Map();
        this.dynamic = this.type === "global" || this.type === "with";
        this.block = block;
        this.through = [];
        this.variables = [];
        this.references = [];
        this.variableScope = (
            this.type === "global" ||
            this.type === "module" ||
            this.type === "function" ||
            this.type === "class-field-initializer" ||
            this.type === "class-static-block"
        ) ?
            this :
            upperScope.variableScope;
        this.functionExpressionScope = false;
        this.directCallToEvalScope = false;
        this.thisFound = false;
        this.__left = [];
        this.upper = upperScope;
        this.isStrict = scopeManager.isStrictModeSupported() ?
            isStrictScope(this, block, isMethodDefinition) :
            false;
        this.childScopes = [];

        if (this.upper) {
            this.upper.childScopes.push(this);
        }

        this.__declaredVariables = scopeManager.__declaredVariables;

        registerScope(scopeManager, this);
    }

    __shouldStaticallyClose(scopeManager) {
        return !this.dynamic || scopeManager.__isOptimistic() || this.type === "global";
    }

    __staticCloseRef(ref) {
        if (!this.__resolve(ref)) {
            this.__delegateToUpperScope(ref);
        }
    }

    __dynamicCloseRef(ref) {
        let current = this;

        while (current) {
            current.through.push(ref);
            current = current.upper;
        }
    }

    __close(scopeManager) {
        const closeReference = this.__shouldStaticallyClose(scopeManager) ?
            this.__staticCloseRef :
            this.__dynamicCloseRef;

        for (const ref of this.__left) {
            closeReference.call(this, ref);
        }

        this.__left = null;

        return this.upper;
    }

    __isValidResolution(_ref, _variable) {
        return true;
    }

    __resolve(ref) {
        const name = ref.identifier.name;

        if (!this.set.has(name)) {
            return false;
        }

        const variable = this.set.get(name);

        if (!this.__isValidResolution(ref, variable)) {
            return false;
        }

        variable.references.push(ref);
        variable.stack = variable.stack && ref.from.variableScope === this.variableScope;

        if (ref.tainted) {
            variable.tainted = true;
            this.taints.set(variable.name, true);
        }

        ref.resolved = variable;
        return true;
    }

    __delegateToUpperScope(ref) {
        if (this.upper) {
            this.upper.__left.push(ref);
        }

        this.through.push(ref);
    }

    __addDeclaredVariablesOfNode(variable, node) {
        if (node === null || node === undefined) {
            return;
        }

        let variables = this.__declaredVariables.get(node);

        if (!variables) {
            variables = [];
            this.__declaredVariables.set(node, variables);
        }

        if (!variables.includes(variable)) {
            variables.push(variable);
        }
    }

    __defineGeneric(name, set, variables, node, def) {
        let variable = set.get(name);

        if (!variable) {
            variable = new Variable(name, this);
            set.set(name, variable);
            variables.push(variable);
        }

        if (def) {
            variable.defs.push(def);
            this.__addDeclaredVariablesOfNode(variable, def.node);
            this.__addDeclaredVariablesOfNode(variable, def.parent);
        }

        if (node) {
            variable.identifiers.push(node);
        }
    }

    __define(node, def) {
        if (node && node.type === Syntax.Identifier) {
            this.__defineGeneric(node.name, this.set, this.variables, node, def);
        }
    }

    __referencing(node, assign, writeExpr, maybeImplicitGlobal, partial, init) {
        if (!node || (node.type !== Syntax.Identifier && node.type !== "JSXIdentifier")) {
            return;
        }

        if (node.name === "super") {
            return;
        }

        const reference = new Reference(
            node,
            this,
            assign || Reference.READ,
            writeExpr,
            maybeImplicitGlobal,
            Boolean(partial),
            Boolean(init),
        );

        this.references.push(reference);
        this.__left.push(reference);
    }

    __detectEval() {
        let current = this;

        this.directCallToEvalScope = true;

        while (current) {
            current.dynamic = true;
            current = current.upper;
        }
    }

    __detectThis() {
        this.thisFound = true;
    }

    __isClosed() {
        return this.__left === null;
    }

    resolve(ident) {
        assert(this.__isClosed(), "Scope should be closed.");
        assert(ident.type === Syntax.Identifier, "Target should be identifier.");

        for (const ref of this.references) {
            if (ref.identifier === ident) {
                return ref;
            }
        }

        return null;
    }

    isStatic() {
        return !this.dynamic;
    }

    // eslint-disable-next-line class-methods-use-this -- API parity with upstream
    isArgumentsMaterialized() {
        return true;
    }

    // eslint-disable-next-line class-methods-use-this -- API parity with upstream
    isThisMaterialized() {
        return true;
    }

    isUsedName(name) {
        if (this.set.has(name)) {
            return true;
        }

        return this.through.some(reference => reference.identifier.name === name);
    }
}

class GlobalScope extends Scope {
    constructor(scopeManager, block) {
        super(scopeManager, "global", null, block, false);
        this.implicit = {
            set: new Map(),
            variables: [],
            left: [],
        };
    }

    __close(scopeManager) {
        const implicit = [];

        for (const ref of this.__left) {
            if (ref.__maybeImplicitGlobal && !this.set.has(ref.identifier.name)) {
                implicit.push(ref.__maybeImplicitGlobal);
            }
        }

        for (const info of implicit) {
            this.__defineImplicit(
                info.pattern,
                new Definition(
                    Variable.ImplicitGlobalVariable,
                    info.pattern,
                    info.node,
                    null,
                    null,
                    null,
                ),
            );
        }

        super.__close(scopeManager);
        this.implicit.left = [...this.through];

        return null;
    }

    __defineImplicit(node, def) {
        if (node && node.type === Syntax.Identifier) {
            this.__defineGeneric(node.name, this.implicit.set, this.implicit.variables, node, def);
        }
    }

    __addVariables(names) {
        for (const name of names) {
            this.__defineGeneric(name, this.set, this.variables, null, null);
        }

        const namesSet = new Set(names);

        this.through = this.through.filter(reference => {
            const name = reference.identifier.name;

            if (!namesSet.has(name)) {
                return true;
            }

            const variable = this.set.get(name);

            reference.resolved = variable;
            variable.references.push(reference);
            return false;
        });

        this.implicit.variables = this.implicit.variables.filter(variable => {
            if (!namesSet.has(variable.name)) {
                return true;
            }

            this.implicit.set.delete(variable.name);
            return false;
        });

        this.implicit.left = this.implicit.left.filter(
            reference => !namesSet.has(reference.identifier.name),
        );
    }
}

class ModuleScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "module", upperScope, block, false);
    }
}

class FunctionExpressionNameScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "function-expression-name", upperScope, block, false);
        this.__define(
            block.id,
            new Definition(
                Variable.FunctionName,
                block.id,
                block,
                null,
                null,
                null,
            ),
        );
        this.functionExpressionScope = true;
    }
}

class CatchScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "catch", upperScope, block, false);
    }
}

class WithScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "with", upperScope, block, false);
    }

    __close(scopeManager) {
        if (this.__shouldStaticallyClose(scopeManager)) {
            return super.__close(scopeManager);
        }

        for (const ref of this.__left) {
            ref.tainted = true;
            this.__delegateToUpperScope(ref);
        }

        this.__left = null;
        return this.upper;
    }
}

class BlockScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "block", upperScope, block, false);
    }
}

class SwitchScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "switch", upperScope, block, false);
    }
}

class FunctionScope extends Scope {
    constructor(scopeManager, upperScope, block, isMethodDefinition) {
        super(scopeManager, "function", upperScope, block, isMethodDefinition);

        if (this.block.type !== Syntax.ArrowFunctionExpression) {
            this.__defineArguments();
        }
    }

    isArgumentsMaterialized() {
        if (this.block.type === Syntax.ArrowFunctionExpression) {
            return false;
        }

        if (!this.isStatic()) {
            return true;
        }

        const variable = this.set.get("arguments");

        assert(variable, "Always have arguments variable.");
        return variable.tainted || variable.references.length !== 0;
    }

    isThisMaterialized() {
        if (!this.isStatic()) {
            return true;
        }

        return this.thisFound;
    }

    __defineArguments() {
        this.__defineGeneric("arguments", this.set, this.variables, null, null);
        this.taints.set("arguments", true);
    }

    __isValidResolution(ref, variable) {
        if (this.block.type === Syntax.Program) {
            return true;
        }

        const bodyStart = this.block.body.range[0];

        return !(
            variable.scope === this &&
            ref.identifier.range[0] < bodyStart &&
            variable.defs.every(definition => definition.name.range[0] >= bodyStart)
        );
    }
}

class ForScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "for", upperScope, block, false);
    }
}

class ClassScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "class", upperScope, block, false);
    }
}

class ClassFieldInitializerScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "class-field-initializer", upperScope, block, true);
    }
}

class ClassStaticBlockScope extends Scope {
    constructor(scopeManager, upperScope, block) {
        super(scopeManager, "class-static-block", upperScope, block, true);
    }
}

export {
    Scope,
    GlobalScope,
    ModuleScope,
    FunctionExpressionNameScope,
    CatchScope,
    WithScope,
    BlockScope,
    SwitchScope,
    FunctionScope,
    ForScope,
    ClassScope,
    ClassFieldInitializerScope,
    ClassStaticBlockScope,
};
