import { TokenType } from './definition';
import { Ast } from './parser';

const SQLGrammar = new Map<String, Ast>();

// interface GrammarTreeNode extends Ast {
//     right: Ast[];
// }

 /**
     * SQL Example: 
     *      1. select * from tb1;
     *      2. select col1, col2 from tb1;
     *      3. select * from tb1 limit 10;
     *      3. select id, name from tb1 where id > 1 ;
     *      4. select id+1 from tb1;
     * 
     * Grammar: 
     *  SelectStatement 
     *      Expression 
     *  FromClauses 
     *      Identifier 
     *  OptionalClausesWhere 
     *      Expression
     *  OptionalClausesLimit 
     *      NumberLiteral 
     *  StatementTerminator
     * 
     * Grammar Table:
     * 
     * SelectStatement -> select
     * Expression -> *, 1+1, id > 100...
     * Identifier -> tableName
     * NumberLiteral -> [0-9]
     * FromClauses -> from
     * OptionalClausesWhere -> where
     * OptionalClausesLimit -> limit
     * StatementTerminator -> ;
     */
const astNode = function(type: TokenType, optional: boolean = false): Ast {
    return {
        type: type,
        left: null,
        right: [],
        optional: optional
    };
}
/**
 * We are generate a ast like this:
 * {
    type: TokenType.SelectStatement,
    left: null,
    right: [{
        type: TokenType.Expression,
        left: parent,
        optional: false,
        right: [{
            type: TokenType.FromClauses,
            left: parent,
            optional: false,
            right: [{
                optional: false,
                type: TokenType.Identifier,
                left: parent,
                right: [{
                    optional: true,
                    type: TokenType.OptionalClausesWhere,
                    left: parent,
                    right: [{
                        type: TokenType.Expression,
                        left: parent,
                        optional: false
                    }]
                }, {
                    optional: true,
                    type: TokenType.OptionalClausesLimit,
                    left: parent,
                    right: [{
                        type: TokenType.NumberLiteral,
                        left: parent,
                        optional: false
                    }]
                }, {
                    optional: false,
                    type: TokenType.StatementTerminator,
                    left: parent,
                }]
            }]
        }]
    }]
}
 */
const generateSelectGrammar = ():Ast => {
    let selectSt: Ast = astNode(TokenType.SelectStatement);

    let callExp = astNode(TokenType.Expression);
    callExp.left = selectSt;

    let columnList = astNode(TokenType.ColumnList);
    callExp.left = selectSt;

    let fromClause = astNode(TokenType.FromClauses);
    fromClause.left = callExp;

    let identifier = astNode(TokenType.Identifier);
    identifier.left = fromClause;

    let optionalWhere = astNode(TokenType.OptionalClausesWhere, true);
    optionalWhere.left = identifier;

    let optionalWhereExp = astNode(TokenType.Expression, true);
    optionalWhereExp.left = optionalWhere;

    let optionalLimit = astNode(TokenType.OptionalClausesLimit, true);
    optionalLimit.left = identifier;

    let numberLiteral = astNode(TokenType.NumberLiteral, true);
    numberLiteral.left = optionalLimit;

    let terminator = astNode(TokenType.StatementTerminator);
    optionalLimit.left = identifier;

    // link right elements
    identifier.right?.push(optionalWhere);
    optionalWhere.right?.push(optionalWhereExp);
    
    optionalLimit.right?.push(numberLiteral);
    identifier.right?.push(optionalLimit);
    identifier.right?.push(terminator);
    
    fromClause.right?.push(identifier);
    callExp.right?.push(fromClause);
    columnList.right?.push(fromClause);

    selectSt.right?.push(callExp, columnList);

    return selectSt;
}

SQLGrammar.set(TokenType.SelectStatement, generateSelectGrammar());

export default SQLGrammar;

