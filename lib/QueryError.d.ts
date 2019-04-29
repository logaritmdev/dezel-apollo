/**
 * @class QueryError
 * @since 0.1.0
 */
export declare class QueryError extends Error {
    readonly type: string;
    readonly code: number;
    constructor(message: string, type: string, code: number);
}
