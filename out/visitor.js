"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  便利 AST
 * @param ast
 * @param visitor
 */
function traverser(ast, visitor) {
    function traverseArray(arr, parent) {
        arr.forEach(function (child) {
            traverseNode(child, parent);
        });
    }
    function traverseNode(node, parent) {
        var actions = visitor[node.type];
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
exports.traverser = traverser;
//# sourceMappingURL=visitor.js.map