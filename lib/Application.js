"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_timeout_1 = require("apollo-link-timeout");
require("whatwg-fetch");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_client_1 = require("apollo-client");
const apollo_link_1 = require("apollo-link");
const apollo_link_2 = require("apollo-link");
const apollo_link_error_1 = require("apollo-link-error");
const apollo_link_http_1 = require("apollo-link-http");
const dezel_1 = require("dezel");
const NetworkError_1 = require("./NetworkError");
/**
 * @symbol READY
 * @since 0.4.0
 */
exports.APOLLO = Symbol('apollo');
/**
 * @symbol READY
 * @since 0.4.0
 */
exports.QUERIES = Symbol('queries');
/**
 * @class Application
 * @super Application
 */
class Application extends dezel_1.Application {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor() {
        super();
        let configs = this.configure();
        const request = (operation) => __awaiter(this, void 0, void 0, function* () {
            this.emit('apollorequest', {
                data: {
                    operation
                }
            });
        });
        const timeoutLink = new apollo_link_timeout_1.default(30000);
        const requestLink = new apollo_link_1.ApolloLink((operation, forward) => new apollo_link_2.Observable(observer => {
            let handle;
            Promise.resolve(operation)
                .then(operation => request(operation))
                .then(() => {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
                .catch(observer.error.bind(observer));
            return () => handle && handle.unsubscribe();
        }));
        let link = apollo_link_1.ApolloLink.from([
            apollo_link_error_1.onError((error) => {
                let { graphQLErrors, networkError } = error;
                if (networkError) {
                    this.dispatchNetworkError(networkError);
                }
                if (graphQLErrors) {
                    for (let requestError of graphQLErrors) {
                        this.dispatchRequestError(requestError);
                    }
                }
            }),
            requestLink,
            timeoutLink.concat(new apollo_link_http_1.HttpLink({ uri: configs.uri, credentials: 'include' }))
        ]);
        this[exports.APOLLO] = new apollo_client_1.ApolloClient({ link, cache: new apollo_cache_inmemory_1.InMemoryCache() });
    }
    //--------------------------------------------------------------------------
    // Static Properties
    //--------------------------------------------------------------------------
    /**
     * Returns the global apollo client.
     * @property apollo
     * @since 0.1.0
     */
    static get apollo() {
        let application = Application.main;
        if (application == null) {
            throw new Error('Apollo Application Error: ' +
                'The application has not been created.');
        }
        if (application instanceof Application) {
            let apollo = application[exports.APOLLO];
            if (apollo == null) {
                throw new Error('Apollo Application Error: ' +
                    'The apollo client has not been created.');
            }
            return apollo;
        }
        throw new Error('Apollo Application Error: ' +
            'The application is not an apollo application');
    }
    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------
    /**
     * Returns the apollo client.
     * @property apollo
     * @since 0.1.0
     */
    get apollo() {
        return this[exports.APOLLO];
    }
    /**
     * Returns the client configurations.
     * @method configure
     * @since 0.1.0
     */
    configure() {
        return {
            uri: ''
        };
    }
    //--------------------------------------------------------------------------
    // Events
    //--------------------------------------------------------------------------
    /**
     * @inherited
     * @method onEmit
     * @since 0.1.0
     */
    onEmit(event) {
        switch (event.type) {
            case 'apollorequest':
                this.onApolloRequest(event);
                break;
            case 'apollorequesterror':
                this.onApolloRequestError(event);
                break;
            case 'apollonetworkerror':
                this.onApolloNetworkError(event);
                break;
        }
        super.onEmit(event);
    }
    /**
     * Called when the application makes a request.
     * @method onApolloRequest
     * @since 0.1.0
     */
    onApolloRequest(event) {
    }
    /**
     * Called when the application receives a request error.
     * @method onApolloRequestError
     * @since 0.1.0
     */
    onApolloRequestError(event) {
    }
    /**
     * Called when the application receives a network error.
     * @method onApolloNetworkError
     * @since 0.1.0
     */
    onApolloNetworkError(event) {
    }
    /**
     * @method dispatchNetworkError
     * @since 0.1.0
     * @hidden
     */
    dispatchNetworkError(error) {
        let event = error;
        if (event instanceof Error == false) {
            /*
             * I believe the error event from Dezel XMLHttpRequest might not
             * be doing the right thing becasue I'm receiving an event where
             * instead of a error.
             */
            if (event.description) {
                error = new TypeError(event.description);
            }
        }
        error = new NetworkError_1.NetworkError(error);
        this.emit('apollonetworkerror', { data: { error } });
    }
    /**
     * @method dispatchRequestError
     * @since 0.1.0
     * @hidden
     */
    dispatchRequestError(error) {
        this.emit('apollorequesterror', { data: { error } });
    }
}
exports.Application = Application;
