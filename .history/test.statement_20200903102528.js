// import Statement from './out/statement';
const Statement = require('./out/statement').default;
const TokenType = require('./out/token').TokenType;

// function selectStatement0() {
//     const root = new Statement(TokenType.SelectStatement);
//     root.right(TokenType.ColumnList)
//     .right(TokenType.FromClause)
//     .right(TokenType.Identifier)
//     .right(TokenType.OptionalLimitClause)
//     .right(TokenType.NumberLiteral)
//     .right(TokenType.StatementTerminator)
//     return root.parseTree();
// }

function selectStatement() {
    const select = new Statement(TokenType.SelectStatement);

    const fromClause = new Statement(TokenType.FromClause)
    .right(TokenType.Identifier)
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

const tree = selectStatement();

console.log('selectStatement -> ', tree);

