function freezeVisitorKeys(rawVisitorKeys) {
    const frozenVisitorKeys = {};

    for (const [nodeType, keys] of Object.entries(rawVisitorKeys)) {
        frozenVisitorKeys[nodeType] = Object.freeze([...keys]);
    }

    return Object.freeze(frozenVisitorKeys);
}

const VISITOR_KEYS = freezeVisitorKeys({
    AssignmentExpression: ["left", "right"],
    AssignmentPattern: ["left", "right"],
    ArrayExpression: ["elements"],
    ArrayPattern: ["elements"],
    ArrowFunctionExpression: ["params", "body"],
    AwaitExpression: ["argument"],
    BinaryExpression: ["left", "right"],
    BlockStatement: ["body"],
    BreakStatement: ["label"],
    CallExpression: ["callee", "arguments"],
    CatchClause: ["param", "body"],
    ChainExpression: ["expression"],
    ClassBody: ["body"],
    ClassDeclaration: ["id", "superClass", "body"],
    ClassExpression: ["id", "superClass", "body"],
    ComprehensionBlock: ["left", "right"],
    ComprehensionExpression: ["blocks", "filter", "body"],
    ConditionalExpression: ["test", "consequent", "alternate"],
    ContinueStatement: ["label"],
    DebuggerStatement: [],
    DirectiveStatement: [],
    DoWhileStatement: ["body", "test"],
    EmptyStatement: [],
    ExportAllDeclaration: ["exported", "source"],
    ExportDefaultDeclaration: ["declaration"],
    ExportNamedDeclaration: ["declaration", "specifiers", "source"],
    ExportSpecifier: ["exported", "local"],
    ExpressionStatement: ["expression"],
    ForInStatement: ["left", "right", "body"],
    ForOfStatement: ["left", "right", "body"],
    ForStatement: ["init", "test", "update", "body"],
    FunctionDeclaration: ["id", "params", "body"],
    FunctionExpression: ["id", "params", "body"],
    GeneratorExpression: ["blocks", "filter", "body"],
    Identifier: [],
    IfStatement: ["test", "consequent", "alternate"],
    ImportDeclaration: ["specifiers", "source"],
    ImportDefaultSpecifier: ["local"],
    ImportExpression: ["source"],
    ImportNamespaceSpecifier: ["local"],
    ImportSpecifier: ["imported", "local"],
    LabeledStatement: ["label", "body"],
    Literal: [],
    LogicalExpression: ["left", "right"],
    MemberExpression: ["object", "property"],
    MetaProperty: ["meta", "property"],
    MethodDefinition: ["key", "value"],
    ModuleSpecifier: [],
    NewExpression: ["callee", "arguments"],
    ObjectExpression: ["properties"],
    ObjectPattern: ["properties"],
    PrivateIdentifier: [],
    Program: ["body"],
    Property: ["key", "value"],
    PropertyDefinition: ["key", "value"],
    RestElement: ["argument"],
    ReturnStatement: ["argument"],
    SequenceExpression: ["expressions"],
    SpreadElement: ["argument"],
    StaticBlock: ["body"],
    Super: [],
    SwitchCase: ["test", "consequent"],
    SwitchStatement: ["discriminant", "cases"],
    TaggedTemplateExpression: ["tag", "quasi"],
    TemplateElement: [],
    TemplateLiteral: ["quasis", "expressions"],
    ThisExpression: [],
    ThrowStatement: ["argument"],
    TryStatement: ["block", "handler", "finalizer"],
    UnaryExpression: ["argument"],
    UpdateExpression: ["argument"],
    VariableDeclaration: ["declarations"],
    VariableDeclarator: ["id", "init"],
    WhileStatement: ["test", "body"],
    WithStatement: ["object", "body"],
    YieldExpression: ["argument"],
});

export function mergeVisitorKeys(childVisitorKeys) {
    if (!childVisitorKeys) {
        return VISITOR_KEYS;
    }

    return {
        ...VISITOR_KEYS,
        ...childVisitorKeys,
    };
}

export default VISITOR_KEYS;
