// import Statement from './out/statement';
const Statement = require('./out/statement').default;
const TokenType = require('./out/token').TokenType;

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

const tree = selectStatement();

console.log('selectStatement -> ', tree);

