import ApolloClient from 'apollo-client';
import { ModifiableWatchQueryOptions } from 'apollo-client/core/watchQueryOptions';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions';
import { ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { DocumentNode } from 'graphql';
/**
 * Symbols
 */
export declare const CLIENT: unique symbol;
export declare const QUERY: unique symbol;
/**
 * @interface QueryOptions
 * @since 0.1.0
 */
export interface QueryOptions extends ModifiableWatchQueryOptions {
    metadata?: any;
    context?: any;
    polling?: number;
}
/**
 * @interface ReadQueryOptions
 * @since 0.1.0
 */
export interface ReadQueryOptions {
    variables?: any;
}
/**
 * @interface WriteQueryOptions
 * @since 0.1.0
 */
export interface WriteQueryOptions {
    data: any;
}
/**
 * @type ObserverFunction
 * @since 0.1.0
 */
export declare type ObserverFunction<T> = (loading: boolean, data: T) => void;
/**
 * @type ObserverObject
 * @since 0.1.0
 */
export declare type ObserverObject<T> = {
    onQuery(loading: boolean, data: T, query: Query<T>): void;
};
/**
 * @class Query
 * @since 0.1.0
 */
export declare class Query<T, V = any> {
    /**
     *
     * @property client
     * @since 1.0.0
     */
    readonly client: ApolloClient<any>;
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
    constructor(query: DocumentNode);
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
    fetch(options?: QueryOptions): Promise<import("apollo-client/core/types").ApolloQueryResult<T>>;
    /**
     * Refetches data from this query from the network.
     * @method refetch
     * @since 1.0.0
     */
    refetch(options?: QueryOptions): Promise<import("apollo-client/core/types").ApolloQueryResult<T>>;
    /**
     * Watches changes to this query.
     * @method watch
     * @since 1.0.0
     */
    watch(options?: QueryOptions): import("apollo-client/core/ObservableQuery").ObservableQuery<T, import("apollo-client/core/types").OperationVariables>;
    /**
     * Observes a query for changes.
     * @method observe
     * @since 1.0.0
     */
    observe(options: QueryOptions, observer: ObserverFunction<T> | ObserverObject<T>): this;
    /**
     * Stop observing a query.
     * @method unobserve
     * @since 1.0.0
     */
    unobserve(observer: ObserverFunction<T> | ObserverObject<T>): this;
    /**
     * @property Symbol(client)
     * @since 1.0.0
     * @hidden
     */
    private [CLIENT];
    /**
     * @property Symbol(query)
     * @since 1.0.0
     * @hidden
     */
    private [QUERY];
    /**
     * @property observers
     * @since 1.0.0
     * @hidden
     */
    private observers;
}
