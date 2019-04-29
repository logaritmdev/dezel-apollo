import { DataSource as BaseDataSource } from 'dezel';
import { DataSourceOptions as BaseDataSourceOptions } from 'dezel';
import { FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions';
import { Query } from './Query';
import { QueryOptions } from './Query';
/**
 * @interface DataSourceOptions
 * @since 0.1.0
 */
export interface DataSourceOptions<T, Q> extends BaseDataSourceOptions<T> {
    convert: (data: Q) => Array<T>;
    polling?: number;
    variables?: any;
    fetchPolicy?: FetchPolicy;
    errorPolicy?: ErrorPolicy;
}
/**
 * @symbol LOADED
 * @since 0.1.0
 */
export declare const LOADED: unique symbol;
/**
 * @symbol LOADING
 * @since 0.1.0
 */
export declare const LOADING: unique symbol;
/**
 * @class DataSource
 * @super DataSource
 * @since 0.1.0
 */
export declare class DataSource<T, Q> extends BaseDataSource<T> {
    /**
     * The data source's query
     * @property query
     * @since 0.1.0
     */
    readonly query: Query<Q>;
    /**
     * Whether the data is loaded.
     * @property loaded
     * @since 0.1.0
     */
    readonly loaded: boolean;
    /**
     * Whether the data is loading.
     * @property loaded
     * @since 0.1.0
     */
    readonly loading: boolean;
    /**
     * Initializes the data source with optional data.
     * @constructor
     * @since 0.1.0
     */
    constructor(query: Query<Q>, options: DataSourceOptions<T, Q>);
    /**
     * Observes the data that is bound to this query.
     * @method observe
     * @since 0.1.0
     */
    observe(options?: QueryOptions): this;
    /**
     * Refetches the data that is bound to this query.
     * @method refetch
     * @since 0.1.0
     */
    refetch(options?: QueryOptions): any;
    /**
     * @inherited
     * @method destroy
     * @since 0.1.0
     */
    destroy(): void;
    /**
     * @property [LOADED]
     * @since 1.0.0
     * @hidden
     */
    private [LOADED];
    /**
     * @property [LOADING]
     * @since 1.0.0
     * @hidden
     */
    private [LOADING];
    /**
     * @property polling
     * @since 1.0.0
     * @hidden
     */
    private polling?;
    /**
     * @property variables
     * @since 1.0.0
     * @hidden
     */
    private variables?;
    /**
     * @property fetchPolicy
     * @since 1.0.0
     * @hidden
     */
    fetchPolicy?: FetchPolicy;
    /**
     * @property errorPolicy
     * @since 1.0.0
     * @hidden
     */
    errorPolicy?: ErrorPolicy;
    /**
     * @property convert
     * @since 1.0.0
     * @hidden
     */
    private convert;
    /**
     * @method onFetch
     * @since 1.0.0
     * @hidden
     */
    private onFetch;
}
