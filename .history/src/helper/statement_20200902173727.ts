import { TokenType } from '../token';
import { Ast } from '../parser';

interface IStatement {
    data: Ast;
    _left: IStatement | null;
    _right: IStatement [];
    left: (type: TokenType, optional?: boolean) => IStatement;
    right: (type: TokenType , optional?: boolean) => IStatement;
    leftStatement: (statement: IStatement) => IStatement;
    rightStatement: (statement: IStatement) => IStatement;
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
   
    leftStatement(statement: IStatement) {
        statement._right.push(this);
        statement.data.right?.push(this.data);

        this._left = statement;
        this.data.left = statement.data;
        return statement;
    }


    rightStatement(statement: IStatement) {
    
        statement._left = this;
        statement.data.left = this.data;
    
        this.data.right?.push(statement.data)
        this._right?.push(statement);
        return statement;
    }

    left(type: TokenType, optional: boolean = false) {
        const left: IStatement = new Statement(type, optional);
        return this.leftStatement(left);
    }

    right(type: TokenType, optional: boolean = false) {
        const right: IStatement = new Statement(type, optional);
        return this.rightStatement(right);
    }

    parseTree () {
        return this.data;
    }
}


