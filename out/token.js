"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
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
var TokenType;
(function (TokenType) {
    /**
     * Root type
     */
    TokenType["Program"] = "Program";
    /**
     * Basic type
     */
    TokenType["NumberLiteral"] = "NumberLiteral";
    /**
     * Enclosed in single/double quotation, `` Symbol
     * 'abc', "abc", `abc`
     */
    TokenType["StringLiteral"] = "StringLiteral";
    TokenType["Punctuation"] = "Punctuation";
    TokenType["Operator"] = "Operator";
    TokenType["Whitespace"] = "Whitespace";
    TokenType["NewLine"] = "NewLine";
    TokenType["Quotation"] = "Quotation";
    /**
     * Language element type
     */
    TokenType["KeyWord"] = "KeyWord";
    TokenType["Comment"] = "Comment";
    TokenType["Identifier"] = "Identifier";
    TokenType["StarIdentifier"] = "StarIdentifier";
    TokenType["Predicate"] = "Predicate";
    TokenType["Expression"] = "Expression";
    TokenType["ColumnList"] = "ColumnList";
    /**
     * Statement
     */
    TokenType["Statement"] = "Statement";
    TokenType["StatementTerminator"] = "StatementTerminator";
    TokenType["SelectStatement"] = "SelectStatement";
    /**
     * Clauses
     */
    TokenType["FromClause"] = "FromClause";
    TokenType["OptionalWhereClause"] = "OptionalWhereClause";
    TokenType["OptionalLimitClause"] = "OptionalLimitClause";
    /**
     * Others
     */
    TokenType["Error"] = "Error";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
/**
 *  Token recognition rules
 */
exports.TokenReg = (_a = {},
    _a[TokenType.Identifier] = /\w|tables|database|columns/,
    _a[TokenType.KeyWord] = /insert|delete|update|select|from|limit|group|into|values|create|table/i,
    _a[TokenType.Operator] = /[<>=!%&+\-*/|~^]/,
    _a[TokenType.Punctuation] = /[,.\(\)]/,
    _a[TokenType.NumberLiteral] = /[0-9]/,
    _a[TokenType.StringLiteral] = /[\w]/,
    _a[TokenType.Whitespace] = /\s/,
    _a[TokenType.StatementTerminator] = /[;]/,
    _a[TokenType.Quotation] = /[`'"]/,
    _a.SQL = (_b = {},
        _b[TokenType.SelectStatement] = /^select$/i,
        _b[TokenType.FromClause] = /^from$/i,
        _b[TokenType.OptionalWhereClause] = /^where$/i,
        _b[TokenType.OptionalLimitClause] = /^limit$/i,
        _b),
    _a);
//# sourceMappingURL=token.js.map