import { Ast } from './parser';

interface Visitor {
    [tokenType: string]: {
        enter: (node: Ast, parent: Ast | null) => void;
        exit: (node: Ast, parent: Ast | null) => void;
    }
}
/**
 *  便利 AST
 * @param ast 
 * @param visitor 
 */
export function traverser(ast: Ast, visitor: Visitor) {

    function traverseArray(arr: Ast[], parent: Ast) {
        arr.forEach(child => {
            traverseNode(child, parent);
        })
    }

    function traverseNode(node: Ast, parent: Ast | null) {
        const actions = visitor[node.type];

        if (actions && actions.enter) {
            actions.enter(node, parent);
        }

        if (node.right && node.right.length > 0) {
            traverseArray(node.right, ast);
        }

        if (actions && actions.exit) {
            actions.exit(node, parent);
        }
    }
    
    traverseNode(ast, null);
}
