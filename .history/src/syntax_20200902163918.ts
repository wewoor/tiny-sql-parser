import { TokenType } from './token';
import { Ast } from './parser';

interface LinkNode {
    data: Ast;
    _left: LinkNode | null;
    _right: LinkNode [];
    left: (type: TokenType, optional: boolean) => Ast;
    right: (type: TokenType , optional: boolean) => Ast;
    statement: (type: TokenType , optional: boolean) => Ast;
    // node: (type: TokenType , optional: boolean) => Ast;
    // parseTree: () => Ast;
}

export class SyntaxTree implements LinkNode {

    _left: LinkNode | null;
    _right: LinkNode[];

    data: Ast = {
        type: TokenType.Program,
        left: null,
        right: [],
        optional: false
    };

    constructor(type: TokenType = TokenType.Error, optional: boolean = false)  {
        this.data.type = type;
        this.data.optional = optional;
        this._right = [];
        this._left = null;
    }
    statement(type: TokenType, optional: boolean = false) {
        return this.data;
    }

    left(type: TokenType, optional: boolean = false) {
        return this.data;
    }

    right(type: TokenType, optional: boolean = false) {
        const syntax: LinkNode = new SyntaxTree(type, optional); //this.node(type, optional);
        this._right?.push(syntax);
        this._left = syntax;
        return syntax.data;
    }

    // parseTree() {
    //     return this._syntaxNode;
    // }
}

const grammar = new SyntaxTree();
const syntaxTree = grammar
.right('*')
.right('from')
.right('identifier')
.right(['identifier'])

