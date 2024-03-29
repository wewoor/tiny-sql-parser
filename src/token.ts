
/**
 * We break SQL language down into below 7 main language elements:
 *      1. Keywords,
 *      2. Identifier  -> show database/tables/functionName/tableName/columnName/...
 *      3. Clauses, -> from/where
 *      4. Expressions, -> 1+1
 *      5. Predicates, -> WHERE id = 1
 *      6. Queries, -> select 
 *      7. Statement -> Create/Update/Alter/...
 *      8. Whitespace -> \s
 * The below is token types:
 */
export enum TokenType {
    /**
     * Root type
     */
    Program = 'Program',
    /**
     * Basic type
     */
    NumberLiteral = 'NumberLiteral',
    /**
     * Enclosed in single/double quotation, `` Symbol
     * 'abc', "abc", `abc`
     */
    StringLiteral = 'StringLiteral',
    Punctuation = 'Punctuation',
    Operator = 'Operator',
    Whitespace = 'Whitespace',
    NewLine = 'NewLine',
    Quotation = 'Quotation',
    /**
     * Language element type
     */
    KeyWord = 'KeyWord',
    Comment = 'Comment',
    Identifier = 'Identifier',
    StarIdentifier = 'StarIdentifier', // symbol *
    Predicate = 'Predicate',
    Expression = 'Expression',
    ColumnList = 'ColumnList',
    /**
     * Statement
     */
    Statement = 'Statement',
    StatementTerminator = 'StatementTerminator',
    SelectStatement = 'SelectStatement',
    /**
     * Clauses
     */
    FromClause = 'FromClause',
    OptionalWhereClause = 'OptionalWhereClause',
    OptionalLimitClause = 'OptionalLimitClause',
    
    /**
     * Others
     */
    Error = 'Error'
}

/**
 * Token object
 */
export interface Token {
    type: TokenType,
    value: string;
    start: number;
    end: number;
    lineNumber: number;
    message?: string;
}

/**
 *  Token recognition rules
 */
export const TokenReg = {
    [TokenType.Identifier]: /\w|tables|database|columns/,
    [TokenType.KeyWord]: /insert|delete|update|select|from|limit|group|into|values|create|table/i,
    [TokenType.Operator]: /[<>=!%&+\-*/|~^]/,
    [TokenType.Punctuation]: /[,.\(\)]/,
    [TokenType.NumberLiteral]: /[0-9]/,
    [TokenType.StringLiteral]: /[\w]/,
    [TokenType.Whitespace]: /\s/,
    [TokenType.StatementTerminator]: /[;]/,
    [TokenType.Quotation]: /[`'"]/,
    SQL: {
        [TokenType.SelectStatement]: /^select$/i,
        [TokenType.FromClause]: /^from$/i,
        [TokenType.OptionalWhereClause]: /^where$/i,
        [TokenType.OptionalLimitClause]: /^limit$/i,
    }
}