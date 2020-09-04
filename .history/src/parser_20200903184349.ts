/**
 *  Parsing 是一种将代码转换为一种更抽象的表现形式的技术，这种形式更便于操作
 */

import { Token, TokenType } from './token';
import SQLGrammar from './grammar';

export interface AstBaseProps {
    /**
     * AST 类型
     */
    type: TokenType;
    /**
     * 类型值
     */
    value?: string;
    /**
     * 起点位置
     */
    start?: number;
    /**
     * 结束位置
     */
    end?: number;
    /**
     * 所在行号
     */
    lineNumber?: number;
}

export interface Ast extends AstBaseProps {
    name?: string;
    right?: Ast[];
    left?: Ast | null;
    message?: string;
    optional?: boolean;
    params?: Ast[];
}

export function syntaxParser(statement: string, leftNode: Ast, rightNode: Ast) {
    const syntax = SQLGrammar.get(statement);
    if (!syntax) return false;
    const getAstNode = (current: Ast, target: Ast): Ast | null => {
        const exit = current.right?.find((node: Ast) => node.type === rightNode.type);
        if (current.type === target.type && exit) {
            return exit;
        }
        if (current.right) {
            for (let i = 0; i < current.right.length; i++) {
                const result = getAstNode(current.right[i], target);
                if (result) return result;
            }
        }
        return null;
    }
    const existSyntax = getAstNode(syntax, leftNode);
    return !existSyntax;
}

/**
 * An LR Parser starts with a Context-Free Grammar (CFG)
 * @param tokens
 */
export function parser(tokens: Token[]): Ast {
    // Current token position
    let current = 0;
    let ast: Ast = {
        type: TokenType.Program,
        right: []
    };
    
    /**
     * 获取 AST 对象
     */
    const getAst = (astType: TokenType, token: Token): Ast => {
        return {
            type: astType,
            start: token.start,
            right: [],
            lineNumber: token.lineNumber,
            end: token.end,
            value: token.value
        }
    }

    const walk = function(prev: Ast): Ast {
        let token = tokens[current];
        let astNode: Ast = getAst(token.type, token);
        switch (token.type) {
            case TokenType.SelectStatement: {
                let rootNode = getAst(TokenType.SelectStatement, token);
                let prevNode = rootNode;
                token = tokens[++current]; // Move to next token
                // Hand inner select statement
                while (token && token.type !== TokenType.StatementTerminator) {
                    const currentNode = walk(prevNode);
                    prevNode.right?.push(currentNode);
                    // Valid select statement syntax
                    if (syntaxParser(TokenType.SelectStatement, prevNode, currentNode)) {
                        currentNode.type = TokenType.Error;
                        currentNode.message = `Invalid syntax located in token ${token.value}`;
                        return currentNode;
                    }
                    prevNode = currentNode;
                    token = tokens[current];
                }
                // insert terminator
                prevNode.right?.push(getAst(TokenType.StatementTerminator, token))
                current ++;
                return rootNode;
            }
            case TokenType.Identifier: {
                // 处理表达式， 如果发现的是 ColumnList, 则另做处理
                if (prev.type === TokenType.SelectStatement && tokens[current + 1].value === ',') {
                    const columnList: Ast = {
                        ...astNode,
                        type: TokenType.ColumnList,
                        params: []
                    };
                    while (token.type !== TokenType.FromClause) {
                        if (token.type === TokenType.Identifier) {
                            columnList.params?.push({
                                ...token
                            });
                        }
                        token = tokens[++current];
                    }
                    return columnList;
                }
                break;
            }
            case TokenType.Operator: {
                astNode = getAst(TokenType.Expression, token);
                break;
            }
            default: {
                astNode = getAst(token.type, token);
                break;
            }
        }
        current++;
        return astNode;
    }

    while (current < tokens.length) {
        ast.right?.push(walk(ast))
    }

    return ast;
}

interface Visitor {
    [tokenType: string]: {
        enter: (node: Ast, parent: Ast | null) => void;
        exit: (node: Ast, parent: Ast | null) => void;
    }
}
/**
 * 
 * @param ast 
 * @param visitor 
 */
export function traverser(ast: Ast, visitor: Visitor) {

    function traverseNode(node: Ast, parent: Ast | null) {
        const actions = visitor[node.type];

        if (actions && actions.enter) {
            actions.enter(node, parent);
        }

        if (ast.right) {
            traverseArray(ast.right, ast);
        }

        if (actions && actions.exit) {
            actions.exit(node, parent);
        }

        traverseNode(ast, null);
    }
    
    function traverseArray(arr: Ast[], parent: Ast) {
        arr.forEach(child => {
            traverseNode(child, parent);
        })
    }
    
}
