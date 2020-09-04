import { TokenType, Token, TokenReg } from './definition';

/**
 * 
 * @param code Source codes
 */
export function lexer(code: string): Token[] {
    // 记录当前字符的位置
    let current = 0;
    let line = 1;
    // 最终的TokenTypes 结果
    let tokens: Token[] = [];

    /**
     * 提取TokenType
     */
    const extract = (currentChar: string, validator: RegExp, TokenType: TokenType): Token => {
        let value = '';
        let start = current;
        while (validator.test(currentChar)) {
            value += currentChar;
            currentChar = code[++current];
        }
        return {
            type: TokenType,
            start: start,
            end: current,
            lineNumber: line,
            value: value
        }
    }

    while (current < code.length) {
        let char = code[current];

        // 处理这些TokenType 字符时，需要额外注意，字符我们放在最后处理，
        // 优先处理，标点，数字，操作符号等等

        if (char === '\n') {
            line++;
            current++;
            continue;
        }
    
        if (TokenReg.Whitespace.test(char)) {
            current++;
            continue;
        }

        // 处理注释，以--开始，\n 结束，/* 开始， */结束
        if (char === '-' && code[current + 1] === '-') {
            let value = '';
            let start = current;
        
            while (char !== '\n') {
                char = code[++current];
            }
            // tokens.push({
            //     type: TokenType.Comment,
            //     value,
            //     start: start,
            //     end: current
            // })
            console.log(TokenType.Comment, value, start, line, current)
            continue;
        }
    
        // 处理注释，以 /* 开始， */结束
        if (char === '/' && code[current + 1] === '*') {
            let value = '';
            let start = current;
        
            while (!(char === '/' && code[current - 1] === '*')) {
                value += char;
                char = code[++current];
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
            console.log(TokenType.Comment, value, start, line, current)
            continue;
        }

        // 处理标点符号
        if (TokenReg.Quotation.test(char)) {
            tokens.push(extract(char, TokenReg.Quotation, TokenType.Quotation))
            continue;
        }

        // 处理标点符号
        if (TokenReg.Punctuation.test(char)) {
            tokens.push(extract(char, TokenReg.Punctuation, TokenType.Punctuation))
            continue;
        }
        
        // 处理结束
        if (TokenReg.StatementTerminator.test(char)) {
            tokens.push(extract(char, TokenReg.StatementTerminator, TokenType.StatementTerminator))
            continue;
        }

        // 处理操作符号
        if (TokenReg.Operator.test(char)) {
            var currentToken = tokens[current];
            // 处理 Star identifier
            if (char === '*' && currentToken && currentToken.type === TokenType.SelectStatement) {
                tokens.push({
                    type: TokenType.StarIdentifier,
                    value: char,
                    start: current,
                    lineNumber: line,
                    end: current
                })
            } else {
                tokens.push(extract(char, TokenReg.Operator, TokenType.Operator))
            }
            continue;
        }

        // 处理标点符号
        if (TokenReg.NumberLiteral.test(char)) {
            tokens.push(extract(char, TokenReg.NumberLiteral, TokenType.NumberLiteral))
            continue;
        }
    
        // 处理字符串
        if (TokenReg.StringLiteral.test(char)) {

            const token = extract(char, TokenReg.StringLiteral, TokenType.Identifier);
            
            const sqlTokenReg: any = TokenReg.SQL;
            Object.keys(sqlTokenReg).forEach((key: any) => {
                const reg: RegExp = sqlTokenReg[key];
                if (reg.test(token.value || '')) {
                    token.type = key;
                }
            })
    
            tokens.push(token)
            continue;
        }

        return [{
            type: TokenType.Error,
            value: char,
            start: current,
            end: current,
            lineNumber: line,
            message: 'Unknown character:' + char
        }];
    }

    return tokens;
}
