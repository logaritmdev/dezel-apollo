import ApolloClient from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { DocumentNode } from 'graphql';
import { ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions';
import { MutationBaseOptions } from 'apollo-client/core/watchQueryOptions';
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
     * The apollo client.
     * @property client
     * @since 0.1.0
     */
    readonly client: ApolloClient<any>;
    /**
     *
     * @property mutation
     * @since 0.1.0
     */
    readonly mutation: DocumentNode;
    /**
     * The default fetch policy.
     * @property fetchPolicy
     * @since 0.1.0
     */
    fetchPolicy?: FetchPolicy;
    /**
     * The default error policy.
     * @property errorPolicy
     * @since 0.1.0
     */
    errorPolicy?: ErrorPolicy;
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor(query: DocumentNode);
    /**
     * Performs the mutation.
     * @method mutate
     * @since 0.1.0
     */
    mutate(options: MutationOptions): Promise<FetchResult<T>>;
    /**
     * @property Symbol(client)
     * @since 0.1.0
     * @hidden
     */
    private [CLIENT];
    /**
     * @property Symbol(mutation)
     * @since 0.1.0
     * @hidden
     */
    private [MUTATION];
}
