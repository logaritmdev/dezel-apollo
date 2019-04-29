import { Alert } from 'dezel';
import { GraphQLError } from 'graphql';
/**
 * @interface ErrorAlertOptions
 * @since 0.1.0
 */
export interface ErrorAlertOptions {
    title?: string;
    errors: ReadonlyArray<GraphQLError>;
}
/**
 * @class ErrorAlert
 * @since 0.1.0
 */
export declare class ErrorAlert extends Alert {
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor(options: ErrorAlertOptions);
}
