// import Statement from './out/statement';
const Statement = require('./out/statement').default;


function selectStatement() {
    const root = new Statement(TokenType.SelectStatement);
    root.right(TokenType.ColumnList)
    .right(TokenType.FromClause)
    .right(TokenType.Identifier)
    .right(TokenType.OptionalLimitClause)
    .right(TokenType.NumberLiteral)
    .right(TokenType.StatementTerminator)
    return root.parseTree();
}

console.log('selectStatement -> ', selectStatement());

