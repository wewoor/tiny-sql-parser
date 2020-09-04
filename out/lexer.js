"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
/**
 *
 * @param input Source string
 */
function lexer(input) {
    // 记录当前字符的位置
    var current = 0;
    var line = 1;
    // 最终的TokenTypes 结果
    var tokens = [];
    /**
     * 提取TokenType
     */
    var extract = function (currentChar, validator, TokenType) {
        var value = '';
        var start = current;
        while (validator.test(currentChar)) {
            value += currentChar;
            currentChar = input[++current];
        }
        return {
            type: TokenType,
            start: start,
            end: current,
            lineNumber: line,
            value: value
        };
    };
    var _loop_1 = function () {
        var char = input[current];
        // 处理这些TokenType 字符时，需要额外注意，字符我们放在最后处理，
        // 优先处理，标点，数字，操作符号等等
        if (char === '\n') {
            line++;
            current++;
            return "continue";
        }
        if (token_1.TokenReg.Whitespace.test(char)) {
            current++;
            return "continue";
        }
        // 处理注释，以--开始，\n 结束，/* 开始， */结束
        if (char === '-' && input[current + 1] === '-') {
            var value = '';
            var start = current;
            while (char !== '\n') {
                char = input[++current];
            }
            // tokens.push({
            //     type: TokenType.Comment,
            //     value,
            //     start: start,
            //     end: current
            // })
            console.log(token_1.TokenType.Comment, value, start, line, current);
            return "continue";
        }
        // 处理注释，以 /* 开始， */结束
        if (char === '/' && input[current + 1] === '*') {
            var value = '';
            var start = current;
            while (!(char === '/' && input[current - 1] === '*')) {
                value += char;
                char = input[++current];
            }
            value += char;
            ++current;
            // tokens.push({
            //     type: TokenType.Comment,
            //     value,
            //     start: start,
            //     lineNumber: line,
            //     end: current
            // })
            console.log(token_1.TokenType.Comment, value, start, line, current);
            return "continue";
        }
        // 处理标点符号
        if (token_1.TokenReg.Quotation.test(char)) {
            tokens.push(extract(char, token_1.TokenReg.Quotation, token_1.TokenType.Quotation));
            return "continue";
        }
        // 处理标点符号
        if (token_1.TokenReg.Punctuation.test(char)) {
            tokens.push(extract(char, token_1.TokenReg.Punctuation, token_1.TokenType.Punctuation));
            return "continue";
        }
        // 处理结束
        if (token_1.TokenReg.StatementTerminator.test(char)) {
            tokens.push(extract(char, token_1.TokenReg.StatementTerminator, token_1.TokenType.StatementTerminator));
            return "continue";
        }
        // 处理操作符号
        if (token_1.TokenReg.Operator.test(char)) {
            prevToken = tokens[tokens.length - 1];
            // 处理 Star identifier
            if (char === '*' && prevToken && prevToken.type === token_1.TokenType.SelectStatement) {
                tokens.push({
                    type: token_1.TokenType.StarIdentifier,
                    value: char,
                    start: current,
                    lineNumber: line,
                    end: current
                });
                ++current;
            }
            else {
                tokens.push(extract(char, token_1.TokenReg.Operator, token_1.TokenType.Operator));
            }
            return "continue";
        }
        // 处理标点符号
        if (token_1.TokenReg.NumberLiteral.test(char)) {
            tokens.push(extract(char, token_1.TokenReg.NumberLiteral, token_1.TokenType.NumberLiteral));
            return "continue";
        }
        // 处理字符串
        if (token_1.TokenReg.StringLiteral.test(char)) {
            var token_2 = extract(char, token_1.TokenReg.StringLiteral, token_1.TokenType.Identifier);
            var sqlTokenReg_1 = token_1.TokenReg.SQL;
            Object.keys(sqlTokenReg_1).forEach(function (key) {
                var reg = sqlTokenReg_1[key];
                if (reg.test(token_2.value || '')) {
                    token_2.type = key;
                }
            });
            tokens.push(token_2);
            return "continue";
        }
        return { value: [{
                    type: token_1.TokenType.Error,
                    value: char,
                    start: current,
                    end: current,
                    lineNumber: line,
                    message: 'Unknown character:' + char
                }] };
    };
    var prevToken;
    while (current < input.length) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return tokens;
}
exports.lexer = lexer;
//# sourceMappingURL=lexer.js.map