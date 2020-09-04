import { TokenType } from './token';
import { Ast } from './parser';

interface IStatement {
    data: Ast;
    _left: IStatement | null;
    _right: IStatement [];
    left: (type: TokenType, optional?: boolean) => IStatement;
    right: (type: TokenType , optional?: boolean) => IStatement;
    node: (type: TokenType , optional?: boolean) => Ast;
    parseTree: () => Ast;
}

export default class Statement implements IStatement {

    _left: IStatement | null;
    _right: IStatement[];

    data: Ast = {
        type: TokenType.Program,
        left: null,
        right: [],
        optional: false
    };

    constructor(type: TokenType = TokenType.Error, optional: boolean = false)  {
        this.data = this.node(type, optional);
        this._right = [];
        this._left = null;
    }

    node(type: TokenType, optional: boolean = false) {
        return {
            type: type,
            left: null,
            right: [],
            optional: optional
        }
    }
   
    left(type: TokenType, optional: boolean = false) {
        const left: IStatement = new Statement(type, optional);
        left._right.push(this);
        left.data.right?.push(this.data);

        this._left = left;
        this.data.left = left.data;
        return left;
    }

    right(type: TokenType, optional: boolean = false) {
        const right: IStatement = new Statement(type, optional);
    
        right._left = this;
        right.data.left = this.data;
    
        this.data.right?.push(right.data)
        this._right?.push(right);
        return right;
    }

    parseTree () {
        return this.data;
    }
}


