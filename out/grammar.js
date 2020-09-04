"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var statement_1 = __importDefault(require("./helper/statement"));
var astNode = function (type, optional) {
    if (optional === void 0) { optional = false; }
    return {
        type: type,
        left: null,
        right: [],
        optional: optional
    };
};
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
var generateSelectGrammar = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var selectSt = astNode(token_1.TokenType.SelectStatement);
    var starIdentifier = astNode(token_1.TokenType.StarIdentifier);
    starIdentifier.left = selectSt;
    var callExp = astNode(token_1.TokenType.Expression);
    callExp.left = selectSt;
    var columnList = astNode(token_1.TokenType.ColumnList);
    callExp.left = selectSt;
    var fromClause = astNode(token_1.TokenType.FromClause);
    fromClause.left = callExp;
    var identifier = astNode(token_1.TokenType.Identifier);
    identifier.left = fromClause;
    var optionalWhere = astNode(token_1.TokenType.OptionalWhereClause, true);
    optionalWhere.left = identifier;
    var optionalWhereExp = astNode(token_1.TokenType.Expression, true);
    optionalWhereExp.left = optionalWhere;
    var optionalLimit = astNode(token_1.TokenType.OptionalLimitClause, true);
    optionalLimit.left = identifier;
    var numberLiteral = astNode(token_1.TokenType.NumberLiteral, true);
    numberLiteral.left = optionalLimit;
    var terminator = astNode(token_1.TokenType.StatementTerminator);
    optionalLimit.left = identifier;
    // link right elements
    (_a = identifier.right) === null || _a === void 0 ? void 0 : _a.push(optionalWhere);
    (_b = optionalWhere.right) === null || _b === void 0 ? void 0 : _b.push(optionalWhereExp);
    (_c = optionalLimit.right) === null || _c === void 0 ? void 0 : _c.push(numberLiteral);
    (_d = identifier.right) === null || _d === void 0 ? void 0 : _d.push(optionalLimit);
    (_e = identifier.right) === null || _e === void 0 ? void 0 : _e.push(terminator);
    (_f = fromClause.right) === null || _f === void 0 ? void 0 : _f.push(identifier);
    (_g = callExp.right) === null || _g === void 0 ? void 0 : _g.push(fromClause);
    (_h = columnList.right) === null || _h === void 0 ? void 0 : _h.push(fromClause);
    (_j = starIdentifier.right) === null || _j === void 0 ? void 0 : _j.push(fromClause);
    (_k = selectSt.right) === null || _k === void 0 ? void 0 : _k.push(callExp, columnList, starIdentifier);
    return selectSt;
};
function selectStatement() {
    var select = new statement_1.default(token_1.TokenType.SelectStatement);
    var fromClause = new statement_1.default(token_1.TokenType.FromClause);
    fromClause.right(token_1.TokenType.Identifier)
        .right(token_1.TokenType.OptionalWhereClause, true)
        .right(token_1.TokenType.Expression)
        .right(token_1.TokenType.StatementTerminator);
    fromClause.right(token_1.TokenType.Identifier)
        .right(token_1.TokenType.OptionalLimitClause, true)
        .right(token_1.TokenType.NumberLiteral)
        .right(token_1.TokenType.StatementTerminator);
    // Select Grammar
    select.right(token_1.TokenType.ColumnList).rightStatement(fromClause);
    select.right(token_1.TokenType.Identifier).rightStatement(fromClause);
    select.right(token_1.TokenType.StarIdentifier).rightStatement(fromClause);
    select.right(token_1.TokenType.Expression).rightStatement(fromClause);
    return select.parseTree();
}
var SQLGrammar = new Map();
SQLGrammar.set(token_1.TokenType.SelectStatement, selectStatement());
exports.default = SQLGrammar;
//# sourceMappingURL=grammar.js.map