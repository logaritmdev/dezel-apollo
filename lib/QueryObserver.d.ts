import { ApolloQueryResult } from 'apollo-client';
import { OperationVariables } from 'apollo-client';
import { Query } from './Query';
import { QueryOptions } from './Query';
/**
 * @class QueryObserver
 * @since 0.1.0
 * @hidden
 */
export declare class QueryObserver<T, V = OperationVariables> {
    /**
     * @class query
     * @since 0.1.0
     * @hidden
     */
    private query;
    /**
     * @class options
     * @since 0.1.0
     * @hidden
     */
    private options;
    /**
     * @class action
     * @since 0.1.0
     * @hidden
     */
    private target;
    /**
     * @class observable
     * @since 0.1.0
     * @hidden
     */
    private observable;
    /**
     * @class subscriber
     * @since 0.1.0
     * @hidden
     */
    private subscriber;
    /**
     * @constructor
     * @since 0.1.0
     * @hidden
     */
    constructor(query: Query<T, V>, options: QueryOptions, target: QueryObserverFunction<T, V> | QueryObserverObject<T, V>);
    /**
     * @method unobserve
     * @since 0.1.0
     * @hidden
     */
    unobserve(): void;
    /**
     * @method refetch
     * @since 0.1.0
     * @hidden
     */
    refetch(variables?: V): Promise<null> | Promise<ApolloQueryResult<T>>;
    /**
     * @method observe
     * @since 0.1.0
     * @hidden
     */
    private subscribe;
    /**
     * @method unsubscribe
     * @since 0.1.0
     * @hidden
     */
    private unsubscribe;
    /**
     * @method dispatch
     * @since 0.1.0
     * @hidden
     */
    private dispatch;
    /**
     * @method onConnect
     * @since 0.1.0
     * @hidden
     */
    private onConnect;
    /**
     * @method onDisconnect
     * @since 0.1.0
     * @hidden
     */
    private onDisconnect;
}
/**
 * @type QueryObserverFunction
 * @since 0.1.0
 */
export declare type QueryObserverFunction<T, V> = (result: ApolloQueryResult<T>) => void;
/**
 * @type QueryObserverObject
 * @since 0.1.0
 */
export declare type QueryObserverObject<T, V> = {
    onQuery(result: ApolloQueryResult<T>): void;
};
