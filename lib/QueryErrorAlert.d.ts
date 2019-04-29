import { Alert } from 'dezel';
import { GraphQLError } from 'graphql';
export interface QueryErrorAlertOptions {
    title?: string;
    errors: ReadonlyArray<GraphQLError>;
}
export declare class QueryErrorAlert extends Alert {
    constructor(options: QueryErrorAlertOptions);
}
