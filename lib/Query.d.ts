import ApolloClient from 'apollo-client';
import { ModifiableWatchQueryOptions, FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { ObservableQuery } from 'apollo-client/core/ObservableQuery';
import { DocumentNode } from 'graphql';
/**
 * Symbols
 */
export declare const kClient: unique symbol;
export declare const kQuery: unique symbol;
/**
 * @interface QueryOptions
 */
export interface QueryOptions extends ModifiableWatchQueryOptions {
    metadata?: any;
    context?: any;
    polling?: number;
}
/**
 * @interface ReadQueryOptions
 */
export interface ReadQueryOptions {
    variables?: any;
}
/**
 * @interface WriteQueryOptions
 */
export interface WriteQueryOptions {
    data: any;
}
/**
 * @type Callback
 */
export declare type Callback<T> = (loading: boolean, data?: T) => void;
/**
 * @class Query
 */
export declare class Query<T> {
    /**
     *
     * @property client
     * @since 1.0.0
     */
    readonly client: ApolloClient<Object>;
    /**
     *
     * @property query
     * @since 1.0.0
     */
    readonly query: DocumentNode;
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
     * Alias for fetch method.
     * @method exec
     * @since 1.0.0
     */
    exec(options: QueryOptions): Promise<ApolloQueryResult<T>>;
    /**
     * Reads the query from the cache.
     * @method read
     * @since 1.0.0
     */
    read(options?: ReadQueryOptions): T | null;
    /**
     * Writes the query to the cache.
     * @method write
     * @since 1.0.0
     */
    write(options: WriteQueryOptions): void;
    /**
     * Fetches data from this query.
     * @method fetch
     * @since 1.0.0
     */
    fetch(options?: QueryOptions): Promise<ApolloQueryResult<T>>;
    /**
     * Refetches data from this query from the network.
     * @method refetch
     * @since 1.0.0
     */
    refetch(options?: QueryOptions): Promise<ApolloQueryResult<T>>;
    /**
     * Watches changes to this query.
     * @method watch
     * @since 1.0.0
     */
    watch(options?: QueryOptions): ObservableQuery<T>;
    /**
     * Observes a query for changes.
     * @method observe
     * @since 1.0.0
     */
    observe(options: QueryOptions, observer: Callback<T>): this;
    /**
     * Stop observing a query.
     * @method unobserve
     * @since 1.0.0
     */
    unobserve(observer: Callback<T>): this;
    /**
     * @property Symbol(client)
     * @since 1.0.0
     * @hidden
     */
    private [kClient];
    /**
     * @property Symbol(query)
     * @since 1.0.0
     * @hidden
     */
    private [kQuery];
    /**
     * @property observers
     * @since 1.0.0
     * @hidden
     */
    private observers;
}
