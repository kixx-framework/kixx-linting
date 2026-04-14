import {
    BlockScope,
    CatchScope,
    ClassFieldInitializerScope,
    ClassStaticBlockScope,
    ClassScope,
    ForScope,
    FunctionExpressionNameScope,
    FunctionScope,
    GlobalScope,
    ModuleScope,
    SwitchScope,
    WithScope,
} from "./scope.js";
import { assert } from "./assert.js";

class ScopeManager {
    constructor(options) {
        this.scopes = [];
        this.globalScope = null;
        this.__nodeToScope = new WeakMap();
        this.__currentScope = null;
        this.__options = options;
        this.__declaredVariables = new WeakMap();
    }

    __isOptimistic() {
        return this.__options.optimistic;
    }

    __ignoreEval() {
        return this.__options.ignoreEval;
    }

    __isJSXEnabled() {
        return this.__options.jsx === true;
    }

    isGlobalReturn() {
        return this.__options.nodejsScope || this.__options.sourceType === "commonjs";
    }

    isModule() {
        return this.__options.sourceType === "module";
    }

    isImpliedStrict() {
        return Boolean(this.__options.impliedStrict);
    }

    isStrictModeSupported() {
        return this.__options.ecmaVersion >= 5;
    }

    __get(node) {
        return this.__nodeToScope.get(node);
    }

    getDeclaredVariables(node) {
        return this.__declaredVariables.get(node) || [];
    }

    acquire(node, inner) {
        const scopes = this.__get(node);

        if (!scopes || scopes.length === 0) {
            return null;
        }

        if (scopes.length === 1) {
            return scopes[0];
        }

        const isEligibleScope = scope => (
            !(scope.type === "function" && scope.functionExpressionScope)
        );

        if (inner) {
            for (let index = scopes.length - 1; index >= 0; index -= 1) {
                const scope = scopes[index];

                if (isEligibleScope(scope)) {
                    return scope;
                }
            }

            return null;
        }

        for (const scope of scopes) {
            if (isEligibleScope(scope)) {
                return scope;
            }
        }

        return null;
    }

    acquireAll(node) {
        return this.__get(node);
    }

    release(node, inner) {
        const scopes = this.__get(node);

        if (!scopes || scopes.length === 0) {
            return null;
        }

        const upperScope = scopes[0].upper;

        if (!upperScope) {
            return null;
        }

        return this.acquire(upperScope.block, inner);
    }

    addGlobals(names) {
        this.globalScope.__addVariables(names);
    }

    // eslint-disable-next-line class-methods-use-this -- API parity with upstream
    attach() {}

    // eslint-disable-next-line class-methods-use-this -- API parity with upstream
    detach() {}

    __nestScope(scope) {
        if (scope instanceof GlobalScope) {
            assert(this.__currentScope === null);
            this.globalScope = scope;
        }

        this.__currentScope = scope;
        return scope;
    }

    __nestGlobalScope(node) {
        return this.__nestScope(new GlobalScope(this, node));
    }

    __nestBlockScope(node) {
        return this.__nestScope(new BlockScope(this, this.__currentScope, node));
    }

    __nestFunctionScope(node, isMethodDefinition) {
        return this.__nestScope(
            new FunctionScope(
                this,
                this.__currentScope,
                node,
                isMethodDefinition,
            ),
        );
    }

    __nestForScope(node) {
        return this.__nestScope(new ForScope(this, this.__currentScope, node));
    }

    __nestCatchScope(node) {
        return this.__nestScope(new CatchScope(this, this.__currentScope, node));
    }

    __nestWithScope(node) {
        return this.__nestScope(new WithScope(this, this.__currentScope, node));
    }

    __nestClassScope(node) {
        return this.__nestScope(new ClassScope(this, this.__currentScope, node));
    }

    __nestClassFieldInitializerScope(node) {
        return this.__nestScope(
            new ClassFieldInitializerScope(this, this.__currentScope, node),
        );
    }

    __nestClassStaticBlockScope(node) {
        return this.__nestScope(
            new ClassStaticBlockScope(this, this.__currentScope, node),
        );
    }

    __nestSwitchScope(node) {
        return this.__nestScope(new SwitchScope(this, this.__currentScope, node));
    }

    __nestModuleScope(node) {
        return this.__nestScope(new ModuleScope(this, this.__currentScope, node));
    }

    __nestFunctionExpressionNameScope(node) {
        return this.__nestScope(
            new FunctionExpressionNameScope(this, this.__currentScope, node),
        );
    }

    __isES6() {
        return this.__options.ecmaVersion >= 6;
    }
}

export default ScopeManager;
