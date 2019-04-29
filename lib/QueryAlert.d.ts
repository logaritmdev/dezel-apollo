import { Alert } from 'dezel';
import { GraphQLError } from 'graphql';
export interface ErrorAlertOptions {
    title?: string;
    errors: ReadonlyArray<GraphQLError>;
}
export declare class ErrorAlert extends Alert {
    constructor(options: ErrorAlertOptions);
}
