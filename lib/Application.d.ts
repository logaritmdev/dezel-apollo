import { ApolloClient } from 'apollo-client';
import { Operation } from 'apollo-link';
import { Event } from 'dezel';
import { Application as BaseApplication } from 'dezel';
/**
 * @symbol READY
 * @since 0.4.0
 */
export declare const APOLLO: unique symbol;
/**
 * @class Application
 * @super Application
 */
export declare class Application extends BaseApplication {
    /**
     * Returns the global apollo client.
     * @property apollo
     * @since 0.1.0
     */
    static readonly apollo: ApolloClient<any>;
    /**
     * Returns the apollo client.
     * @property apollo
     * @since 0.1.0
     */
    readonly apollo: ApolloClient<any>;
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor();
    /**
     * Returns the client configurations.
     * @method configure
     * @since 0.1.0
     */
    configure(): any;
    /**
     * @inherited
     * @method onEmit
     * @since 0.1.0
     */
    onEmit(event: Event): void;
    /**
     * Called when the application makes a request.
     * @method onApolloRequest
     * @since 0.1.0
     */
    onApolloRequest(event: Event<ApplicationRequestEvent>): void;
    /**
     * Called when the application receives a request error.
     * @method onApolloRequestError
     * @since 0.1.0
     */
    onApolloRequestError(event: Event<ApplicationRequestErrorEvent>): void;
    /**
     * Called when the application receives a network error.
     * @method onApolloNetworkError
     * @since 0.1.0
     */
    onApolloNetworkError(event: Event<ApplicationNetworkErrorEvent>): void;
    /**
     * @property [APOLLO]
     * @since 0.1.0
     * @hidden
     */
    private [APOLLO];
}
/**
 * @type ApplicationRequestEvent
 * @since 0.4.0
 */
export declare type ApplicationRequestEvent = {
    operation: Operation;
};
/**
 * @type ApplicationNetworkErrorEvent
 * @since 0.4.0
 */
export declare type ApplicationNetworkErrorEvent = {
    error: Error;
};
/**
 * @type ApplicationRequestErrorEvent
 * @since 0.4.0
 */
export declare type ApplicationRequestErrorEvent = {
    error: Error;
};
