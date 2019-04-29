"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class NetworkError
 * @since 0.1.0
 */
class NetworkError extends Error {
    constructor(error) {
        super(error.message);
        this.error = error;
    }
}
exports.NetworkError = NetworkError;
