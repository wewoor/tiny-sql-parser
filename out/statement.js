"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var Statement = /** @class */ (function () {
    function Statement(type, optional) {
        if (type === void 0) { type = token_1.TokenType.Error; }
        if (optional === void 0) { optional = false; }
        this.data = {
            type: token_1.TokenType.Program,
            left: null,
            right: [],
            optional: false
        };
        this.data = this.node(type, optional);
        this._right = [];
        this._left = null;
    }
    Statement.prototype.node = function (type, optional) {
        if (optional === void 0) { optional = false; }
        return {
            type: type,
            left: null,
            right: [],
            optional: optional
        };
    };
    Statement.prototype.leftStatement = function (statement) {
        var _a;
        statement._right.push(this);
        (_a = statement.data.right) === null || _a === void 0 ? void 0 : _a.push(this.data);
        this._left = statement;
        this.data.left = statement.data;
        return statement;
    };
    Statement.prototype.rightStatement = function (statement) {
        var _a, _b;
        statement._left = this;
        statement.data.left = this.data;
        (_a = this.data.right) === null || _a === void 0 ? void 0 : _a.push(statement.data);
        (_b = this._right) === null || _b === void 0 ? void 0 : _b.push(statement);
        return statement;
    };
    Statement.prototype.left = function (type, optional) {
        if (optional === void 0) { optional = false; }
        var left = new Statement(type, optional);
        return this.leftStatement(left);
    };
    Statement.prototype.right = function (type, optional) {
        if (optional === void 0) { optional = false; }
        var right = new Statement(type, optional);
        return this.rightStatement(right);
    };
    Statement.prototype.parseTree = function () {
        return this.data;
    };
    return Statement;
}());
exports.default = Statement;
//# sourceMappingURL=statement.js.map