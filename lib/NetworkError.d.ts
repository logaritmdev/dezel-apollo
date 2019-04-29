/**
 * @class NetworkError
 * @since 0.1.0
 */
export declare class NetworkError extends Error {
    readonly error: Error;
    constructor(error: Error);
}
