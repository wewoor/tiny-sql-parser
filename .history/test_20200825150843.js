const lexer = require('./out/lexer').lexer;
const parser = require('./out/parser').parser;

const sql = `

--- test comment
select * from tb_1 limit 100;
select a,b from tb_2 ;
select a,b from tb_3 limit 100;

-- select * from tb_1 where id=10 limit 100;

/**
 *  comment test
 * 
 */
`

const tokens = lexer(sql);
console.log('tokens -> ', tokens);

const ast = parser(tokens);
console.log('ast -> ', JSON.stringify(ast));

