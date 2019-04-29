"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dezel_1 = require("dezel");
class QueryErrorAlert extends dezel_1.Alert {
    constructor(options) {
        super({
            title: options.title,
            message: options.errors.map(error => error.message).join('\n')
        });
    }
}
exports.QueryErrorAlert = QueryErrorAlert;
