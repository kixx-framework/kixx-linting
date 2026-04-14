import Variable from "./variable.js";

class Definition {
    constructor(type, name, node, parent, index, kind) {
        this.type = type;
        this.name = name;
        this.node = node;
        this.parent = parent;
        this.index = index;
        this.kind = kind;
    }
}

class ParameterDefinition extends Definition {
    constructor(name, node, index, rest) {
        super(Variable.Parameter, name, node, null, index, null);

        this.rest = rest;
    }
}

export { ParameterDefinition, Definition };
