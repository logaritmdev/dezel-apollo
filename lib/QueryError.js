"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class QueryError
 * @since 0.1.0
 */
class QueryError extends Error {
    constructor(message, type, code) {
        super(message);
        this.type = type;
        this.code = code;
    }
}
exports.QueryError = QueryError;
