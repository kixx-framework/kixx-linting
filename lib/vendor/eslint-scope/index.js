import {
  analyze as analyzeScope,
  Definition,
  PatternVisitor,
  Referencer,
  Reference,
  Scope,
  ScopeManager,
  Variable,
  version,
} from "./lib/index.js";

export {
  Definition,
  PatternVisitor,
  Referencer,
  Reference,
  Scope,
  ScopeManager,
  Variable,
  version,
};

export function analyze(ast, options = {}) {
  const { globals, ...scopeOptions } = options;
  const scopeManager = analyzeScope(ast, scopeOptions);

  if (globals && typeof globals === "object") {
    scopeManager.addGlobals(Object.keys(globals));
  }

  return scopeManager;
}
