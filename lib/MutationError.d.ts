import { GraphQLError } from 'graphql';
/**
 * @class MutationError
 * @since 0.1.0
 */
export declare class MutationError extends Error {
    readonly errors: ReadonlyArray<GraphQLError>;
    constructor(errors: ReadonlyArray<GraphQLError>);
}
