"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dezel_1 = require("dezel");
/**
 * @class ErrorAlert
 * @since 0.1.0
 */
class ErrorAlert extends dezel_1.Alert {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor(options) {
        super({ title: options.title, message: options.errors.map(error => error.message).join('\n') });
    }
}
exports.ErrorAlert = ErrorAlert;
