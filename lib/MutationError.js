"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class MutationError
 * @since 0.1.0
 */
class MutationError extends Error {
    constructor(errors) {
        super();
        this.errors = errors;
        this.message = errors.map(error => error.message).join('\n');
    }
}
exports.MutationError = MutationError;
