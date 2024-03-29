# Tiny SQL Parser

## 前言

## Parser

`Parser` 是一个将输入数据（一般都是字符串）转换为更抽象的数据结构（data structure)的程序, 这种数据结构常见的就是我们所谓的抽象语法树（AST）。 `Parser` 一般分为`自顶向下（Top-bottom parsing）`或者`自下而上（Bottom-up parsing）`两种解析方式。

### Parsing

Parsing 指的是针对特定符号字符进行分析的过程，常应用于自然语言、计算机语言、数据结构等领域。Parsing 是编写`编译器（Compiler）`和`解释器（Interpreter）`重要的组成部分。

### 核心逻辑

典型的 `Parser` 我们可以分为 `词法分析（Lexical Analysis）`和`语法分析（Syntactic Analysis)`主要的2个部分, 如图：

<p align="center"><img src="./img/process.svg" /></p>

### 词法分析（Lexical Analysis）

指通过一个叫做 `tokenizer`(或`lexer`) 的东西，将未加工的代码切割成叫做`tokens`东西的过程。而`tokens`是一个由一系列孤立的语法块对象所组成的数组，数组里的对象可以是数字（numbers),
标签（labels), 标点符号（punctuation), 操作符号（operators) 等等。

我们这里以`SQL`查询语言为例，`SQL` 语言主要主要由以下几种元素类型组成：

- KeyWords 关键词
- Identifiers 标识符
- Clauses 子句
- Expression 表达式
- Predicates 预测
- Queries 查询声明
- Statement 声明
- Insignificant whitespace 无意义的空字符

表达式（Expression）中还会包含各种操作符（Operator），例如`+-*/`等等。这里我们以
一个`查询（Select）语句`来进行示例：

```sql
SELECT * FROM tb_test LIMIT 100;
```

<p align="center"><img src="./img/tokenizer.svg" /></p>

这里我们针对 `Select` 语句稍作调整：

符号 | 类型 | 备注
---------|----------|---------
 SELECT | SelectStatement | 查询声明
 * | StarIdentifier | star 标识符
 FROM | FromClauses | from 子句
 tb_test | Identifier | 标识符
 limit | OptionalLimitClauses | 可选 limit 子句
 100 | NumberLiteral | 数字字符

所以, 经过 `lexer` 解析之后， 会返回一个如下的 `Token` 对象数组：

```typescript
[
  {
    type: 'SelectStatement',
    start: 19,
    end: 25,
    lineNumber: 4,
    value: 'select'
  },
  {
    type: 'StarIdentifier',
    value: '*',
    start: 26,
    lineNumber: 4,
    end: 26
  },
  {
    type: 'FromClauses',
    start: 28,
    end: 32,
    lineNumber: 4,
    value: 'from'
  },
  {
    type: 'Identifier',
    start: 33,
    end: 40,
    lineNumber: 4,
    value: 'tb_test'
  },
  {
    type: 'OptionalLimitClause',
    start: 41,
    end: 46,
    lineNumber: 4,
    value: 'limit'
  },
  {
    type: 'NumberLiteral',
    start: 47,
    end: 50,
    lineNumber: 4,
    value: '100'
  },
  {
    type: 'StatementTerminator',
    start: 50,
    end: 51,
    lineNumber: 4,
    value: ';'
  }
]
```

### 语法分析（Syntactic Analysis)

语法分析则是指我们把 *tokens* 重新格式化为一种可以描述彼此语法块之间关系的数据结构。也就是我们所熟知的中间结构或者`Abstract Syntax Tree`（后面简称AST）。生成的 `AST` 是一个深度嵌套的对象，这个对象结构更易于我们去操作和获取信息。 例如，我们把如上的 *tokens* 转化成大致像这样：

```javascript
{
    "type": "Program",
    "right": [
        {
            "type": "SelectStatement",
            "start": 19,
            "right": [
                {
                    "type": "StarIdentifier",
                    "start": 26,
                    "right": [
                        {
                            "type": "FromClause",
                            "start": 28,
                            "right": [
                                {
                                    "type": "Identifier",
                                    "start": 33,
                                    "right": [
                                        {
                                            "type": "OptionalLimitClause",
                                            "start": 41,
                                            "right": [
                                                {
                                                    "type": "NumberLiteral",
                                                    "start": 47,
                                                    "right": [
                                                        {
                                                            "type": "StatementTerminator",
                                                            "start": 50,
                                                            "right": [],
                                                            "lineNumber": 4,
                                                            "end": 51,
                                                            "value": ";"
                                                        }
                                                    ],
                                                    "lineNumber": 4,
                                                    "end": 50,
                                                    "value": "100"
                                                }
                                            ],
                                            "lineNumber": 4,
                                            "end": 46,
                                            "value": "limit"
                                        }
                                    ],
                                    "lineNumber": 4,
                                    "end": 40,
                                    "value": "tb_test"
                                }
                            ],
                            "lineNumber": 4,
                            "end": 32,
                            "value": "from"
                        }
                    ],
                    "lineNumber": 4,
                    "end": 26,
                    "value": "*"
                }
            ],
            "lineNumber": 4,
            "end": 25,
            "value": "select"
        }
    ]
}
```

### 语法校验

#### 定义语法 （Grammar）

语法是指一系列句法规则（Syntax）的集合，而句法则指的是约束语言组成部分之间关系的规则。我们仍然以上面的查询（Select）语句为例，不过我们这里再稍微扩展一下句法：

```sql
SELECT * FROM tb_test;
SELECT a,b FROM tb_test LIMIT 100;
SELECT id+1 FROM tb_test Where id > 1;
```

我们可以用下图来理解整个查询语法的规则：
<p align="center"><img src="./img/sql-select-syntax.svg" /></p>

这里我们可以尝试使用一个文本结构去描述一下这个语法结构：

```yml
SelectStatement:
select
  Identifier ｜ ColumnList | Expression
FromClause
  Identifier
OptionalWhereClause
OptionalLimitClause

ColumnList:
  Identifier, ColumnList

OptionalWhereClause:
  where Expression TerminateStatement

OptionalLimitClause:
  limit NumberLiteral TerminateStatement

FromClause:
  from
TerminateStatement:
  ;
```

冒号之前对为句法类型声明，后面为具体对语法组成结构。 其中`|`符号表示或对关系。使用过`Parser 生成器`（例如`antlr4`, `jison`, `PEG.js`）的同学，对这种语法表示方法应该不会感到陌生。

另外，为了便于做语法对比检测，我们需要使用 JS 生成一个类似的结构树，以便于对生成的 AST 对象进行语法比较。这里我们将上面对语法用类似下面的数据结构：

```typescript
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
                        optional: false,
                        right: [{
                          optional: false,
                          type: TokenType.StatementTerminator,
                          left: parent,
                        }]
                    }]
                }, {
                    optional: true,
                    type: TokenType.OptionalClausesLimit,
                    left: parent,
                    right: [{
                        type: TokenType.NumberLiteral,
                        left: parent,
                        optional: false,
                        right: [{
                          optional: false,
                          type: TokenType.StatementTerminator,
                          left: parent,
                        }]
                    }]
                }]
            }]
        }]
    }]
}
```

### 遍历语法树 - Visitor

## 总结

## 参考

- <https://www.jooq.org/doc/latest/manual/sql-building/sql-parser/sql-parser-grammar/>
- <https://en.wikipedia.org/wiki/Parsing>
- <https://www.youtube.com/watch?v=eF9qWbuQLuw>
- <https://docs.gethue.com/developer/parsers/>
- <https://www.gnu.org/software/bison/manua>
- <http://dinosaur.compilertools.net/>
- [SQL Wikipedia](https://en.wikipedia.org/wiki/SQL#:~:text=SQL%20was%20adopted%20as%20a,32%2C%20Data%20management%20and%20interchange.&text=First%20formalized%20by%20ANSI.)
- [SQL Syntax](https://en.wikipedia.org/wiki/SQL_syntax)
- <https://web.cs.ucdavis.edu/~peisert/teaching/cse131a/lecture_slides/>
- <https://www.w3schools.com/sql/sql_insert.asp>
- <https://github.com/cloudera/hue/tree/master/desktop/core/src/desktop/js/parse/jison/sql/generic>
