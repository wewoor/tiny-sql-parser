import { TokenType } from './token';
import { Ast } from './parser';
import Statement from './helper/statement';


const astNode = function(type: TokenType, optional: boolean = false): Ast {
    return {
        type: type,
        left: null,
        right: [],
        optional: optional
    };
}

 /**
 * SQL Select Example: 
 *  1. select * from tb1;
 *  2. select col1, col2 from tb1;
 *  3. select * from tb1 limit 10;
 *  4. select id, name from tb1 where id > 1 ;
 *  5. select id+1 from tb1;
 * 
 *  Grammar: 
 *  SelectStatement 
 *      StarIdentifier | ColumnList | Expression 
 *  FromClauses 
 *      Identifier
 *  OptionalClausesWhere
 *      Expression
 *  OptionalClausesLimit
 *      NumberLiteral 
 *  StatementTerminator
 *
 * 
 * Grammar Table:
 * 
 * ColumnList -> Identifier, Identifier, ColumnList
 * SelectStatement -> select
 * Expression -> * | 1+1 | id > 100
 * Identifier -> tableName
 * NumberLiteral -> [0-9]
 * FromClauses -> from
 * OptionalClausesWhere -> where
 * OptionalClausesLimit -> limit
 * StatementTerminator -> ;
 * 
 * AST：
 {
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

    let starIdentifier = astNode(TokenType.StarIdentifier);
    starIdentifier.left = selectSt;

    let callExp = astNode(TokenType.Expression);
    callExp.left = selectSt;

    let columnList = astNode(TokenType.ColumnList);
    callExp.left = selectSt;

    let fromClause = astNode(TokenType.FromClause);
    fromClause.left = callExp;

    let identifier = astNode(TokenType.Identifier);
    identifier.left = fromClause;

    let optionalWhere = astNode(TokenType.OptionalWhereClause, true);
    optionalWhere.left = identifier;

    let optionalWhereExp = astNode(TokenType.Expression, true);
    optionalWhereExp.left = optionalWhere;

    let optionalLimit = astNode(TokenType.OptionalLimitClause, true);
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
    starIdentifier.right?.push(fromClause);

    selectSt.right?.push(callExp, columnList, starIdentifier);

    return selectSt;
}

function selectStatement() {
    const select = new Statement(TokenType.SelectStatement);
    const fromClause = new Statement(TokenType.FromClause);

    fromClause.right(TokenType.Identifier)
    .right(TokenType.OptionalWhereClause, true)
    .right(TokenType.Expression)
    .right(TokenType.StatementTerminator);

    fromClause.right(TokenType.Identifier)
    .right(TokenType.OptionalLimitClause, true)
    .right(TokenType.NumberLiteral)
    .right(TokenType.StatementTerminator);

    // Select Grammar
    select.right(TokenType.ColumnList).rightStatement(fromClause);
    select.right(TokenType.Identifier).rightStatement(fromClause);
    select.right(TokenType.StarIdentifier).rightStatement(fromClause);
    select.right(TokenType.Expression).rightStatement(fromClause);

    return select.parseTree();
}

const SQLGrammar = new Map<String, Ast>();

SQLGrammar.set(TokenType.SelectStatement, selectStatement());

export default SQLGrammar;
