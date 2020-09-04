"use strict";
/**
 *  Parsing 是一种将代码转换为一种更抽象的表现形式的技术，这种形式更便于操作
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var grammar_1 = __importDefault(require("./grammar"));
function syntaxParser(statement, leftNode, rightNode) {
    var syntax = grammar_1.default.get(statement);
    if (!syntax)
        return false;
    var getAstNode = function (current, target) {
        var _a;
        var exit = (_a = current.right) === null || _a === void 0 ? void 0 : _a.find(function (node) { return node.type === rightNode.type; });
        if (current.type === target.type && exit) {
            return exit;
        }
        if (current.right) {
            for (var i = 0; i < current.right.length; i++) {
                var result = getAstNode(current.right[i], target);
                if (result)
                    return result;
            }
        }
        return null;
    };
    var existSyntax = getAstNode(syntax, leftNode);
    return existSyntax;
}
exports.syntaxParser = syntaxParser;
/**
 * An LR Parser starts with a Context-Free Grammar (CFG)
 * @param tokens
 */
function parser(tokens) {
    var _a;
    // Current token position
    var current = 0;
    var ast = {
        type: token_1.TokenType.Program,
        right: []
    };
    /**
     * 获取 AST 对象
     */
    var getAst = function (astType, token) {
        return {
            type: astType,
            start: token.start,
            right: [],
            lineNumber: token.lineNumber,
            end: token.end,
            value: token.value
        };
    };
    var walk = function (prev) {
        var _a, _b, _c;
        var token = tokens[current];
        var astNode = getAst(token.type, token);
        switch (token.type) {
            case token_1.TokenType.SelectStatement: {
                var rootNode = getAst(token_1.TokenType.SelectStatement, token);
                var prevNode = rootNode;
                token = tokens[++current]; // Move to next token
                // Hand inner select statement
                while (token && token.type !== token_1.TokenType.StatementTerminator) {
                    var currentNode = walk(prevNode);
                    (_a = prevNode.right) === null || _a === void 0 ? void 0 : _a.push(currentNode);
                    // Valid select statement syntax
                    var validSyntax = syntaxParser(token_1.TokenType.SelectStatement, prevNode, currentNode);
                    if (!validSyntax) {
                        currentNode.type = token_1.TokenType.Error;
                        currentNode.message = "Invalid syntax located in token " + token.value;
                        return currentNode;
                    }
                    prevNode = currentNode;
                    token = tokens[current];
                }
                // insert terminator
                (_b = prevNode.right) === null || _b === void 0 ? void 0 : _b.push(getAst(token_1.TokenType.StatementTerminator, token));
                current++;
                return rootNode;
            }
            case token_1.TokenType.Identifier: {
                // 处理表达式， 如果发现的是 ColumnList, 则另做处理
                if (prev.type === token_1.TokenType.SelectStatement && tokens[current + 1].value === ',') {
                    var columnList = __assign(__assign({}, astNode), { type: token_1.TokenType.ColumnList, params: [] });
                    while (token.type !== token_1.TokenType.FromClause) {
                        if (token.type === token_1.TokenType.Identifier) {
                            (_c = columnList.params) === null || _c === void 0 ? void 0 : _c.push(__assign({}, token));
                        }
                        token = tokens[++current];
                    }
                    return columnList;
                }
                break;
            }
            case token_1.TokenType.Operator: {
                astNode = getAst(token_1.TokenType.Expression, token);
                break;
            }
            default: {
                astNode = getAst(token.type, token);
                break;
            }
        }
        current++;
        return astNode;
    };
    while (current < tokens.length) {
        (_a = ast.right) === null || _a === void 0 ? void 0 : _a.push(walk(ast));
    }
    return ast;
}
exports.parser = parser;
//# sourceMappingURL=parser.js.map