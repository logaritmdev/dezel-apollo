import ApolloClient from 'apollo-client';
import { MutationBaseOptions, FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { DocumentNode, ExecutionResult } from 'graphql';
/**
 * Symbols
 */
export declare const kClient: unique symbol;
export declare const kMutation: unique symbol;
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
    readonly client: ApolloClient<Object>;
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
    constructor(client: ApolloClient<Object>, query: DocumentNode);
    /**
     * Alias for mutate method.
     * @method exec
     * @since 1.0.0
     */
    exec(options: MutationOptions): Promise<ExecutionResult & {
        extensions?: Record<string, any> | undefined;
        context?: {} | undefined;
    }>;
    /**
     * Performs the mutation.
     * @method mutate
     * @since 1.0.0
     */
    mutate(options: MutationOptions): Promise<ExecutionResult & {
        extensions?: Record<string, any> | undefined;
        context?: {} | undefined;
    }>;
    /**
     * @property Symbol(client)
     * @since 1.0.0
     * @hidden
     */
    private [kClient];
    /**
     * @property Symbol(mutation)
     * @since 1.0.0
     * @hidden
     */
    private [kMutation];
}
