import ApolloClient from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { MutationBaseOptions, FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { DocumentNode } from 'graphql';
/**
 * Symbols
 */
export declare const CLIENT: unique symbol;
export declare const MUTATION: unique symbol;
/**
 * @interface MutationOptions
 */
export interface MutationOptions extends MutationBaseOptions {
    metadata?: any;
    context?: any;
}
/**
 * @class Mutation
 */
export declare class Mutation<T> {
    /**
     *
     * @property client
     * @since 1.0.0
     */
    readonly client: ApolloClient<any>;
    /**
     *
     * @property mutation
     * @since 1.0.0
     */
    readonly mutation: DocumentNode;
    /**
     * The default fetch policy.
     * @property fetchPolicy
     * @since 1.0.0
     */
    fetchPolicy?: FetchPolicy;
    /**
     * The default error policy.
     * @property errorPolicy
     * @since 1.0.0
     */
    errorPolicy?: ErrorPolicy;
    /**
     * @constructor
     * @since 1.0.0
     */
    constructor(query: DocumentNode);
    /**
     * Performs the mutation.
     * @method mutate
     * @since 1.0.0
     */
    mutate(options: MutationOptions): Promise<FetchResult<T>>;
    /**
     * @property Symbol(client)
     * @since 1.0.0
     * @hidden
     */
    private [CLIENT];
    /**
     * @property Symbol(mutation)
     * @since 1.0.0
     * @hidden
     */
    private [MUTATION];
}
