const lexer = require('./out/lexer').lexer;
const parser = require('./out/parser').parser;
const traverser = require('./out/visitor').traverser;
const tokenType = require('./out/token').TokenType;

const fs = require('fs');

const sql = `

--- test comment
select * from tb_test limit 100;

-- select a,b from tb_2 ;
-- select a,b from tb_3 limit 100;

-- select * from tb_1 where id=10 limit 100;

/**
 *  comment test
 * 
 */
`
function visit (ast) {
    traverser(ast, {
        [tokenType.StarIdentifier]: {
            enter: function(node, parent) {
                console.log('enter', node, parent);
            },
            exit: function(node, parent) {
                console.log('exit', node, parent);
            }
        }
    })
}

const tokens = lexer(sql);
console.log('tokens -> ', tokens);

const ast = parser(tokens);
const jsonString = JSON.stringify(ast, null, 4);

visit(ast);

console.log('ast -> ', jsonString);
fs.writeFileSync('./result.json', jsonString, function(err) {
    if (err) console.log(err);
    console.log('Write done');
});

