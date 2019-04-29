import { DocumentNode } from 'graphql';
import { ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions';
import { ModifiableWatchQueryOptions } from 'apollo-client/core/watchQueryOptions';
import { ObservableQuery } from 'apollo-client/core/ObservableQuery';
import ApolloClient, { OperationVariables } from 'apollo-client';
import { QueryObserver } from './QueryObserver';
import { QueryObserverFunction } from './QueryObserver';
import { QueryObserverObject } from './QueryObserver';
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
 * @class Query
 * @since 0.1.0
 */
export declare class Query<T, V = OperationVariables> {
    /**
     * The apollo client.
     * @property client
     * @since 0.1.0
     */
    readonly client: ApolloClient<any>;
    /**
     * The apollo query.
     * @property query
     * @since 0.1.0
     */
    readonly query: DocumentNode;
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
     * Reads the query from the cache.
     * @method read
     * @since 0.1.0
     */
    read(options?: ReadQueryOptions): T | null;
    /**
     * Writes the query to the cache.
     * @method write
     * @since 0.1.0
     */
    write(options: WriteQueryOptions): void;
    /**
     * Fetches data from this query.
     * @method fetch
     * @since 0.1.0
     */
    fetch(options?: QueryOptions): Promise<import("apollo-client/core/types").ApolloQueryResult<T>>;
    /**
     * Watches changes to this query.
     * @method watch
     * @since 0.1.0
     */
    watch(options?: QueryOptions): ObservableQuery<T, V>;
    /**
     * Observes a query for changes.
     * @method observe
     * @since 0.1.0
     */
    observe(target: QueryObserverFunction<T, V> | QueryObserverObject<T, V>, options?: QueryOptions): QueryObserver<T, V>;
    /**
     * @property Symbol(client)
     * @since 0.1.0
     * @hidden
     */
    private [CLIENT];
    /**
     * @property Symbol(query)
     * @since 0.1.0
     * @hidden
     */
    private [QUERY];
}
