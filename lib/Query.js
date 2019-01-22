"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
/**
 * Symbols
 */
exports.CLIENT = Symbol('client');
exports.QUERY = Symbol('query');
/**
 * @class Query
 * @since 0.1.0
 */
class Query {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 1.0.0
     */
    constructor(query) {
        /**
         * The default error policy.
         * @property errorPolicy
         * @since 1.0.0
         */
        this.errorPolicy = 'all';
        /**
         * @property observers
         * @since 1.0.0
         * @hidden
         */
        this.observers = new Map();
        this[exports.QUERY] = query;
    }
    //--------------------------------------------------------------------------
    // Property
    //--------------------------------------------------------------------------
    /**
     *
     * @property client
     * @since 1.0.0
     */
    get client() {
        if (this[exports.CLIENT] == null) {
            this[exports.CLIENT] = Application_1.Application.apollo;
        }
        return this[exports.CLIENT];
    }
    /**
     *
     * @property query
     * @since 1.0.0
     */
    get query() {
        return this[exports.QUERY];
    }
    /**
     * Reads the query from the cache.
     * @method read
     * @since 1.0.0
     */
    read(options = {}) {
        try {
            let params = options; // TODO type
            params.query = this.query;
            return this.client.readQuery(params);
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Writes the query to the cache.
     * @method write
     * @since 1.0.0
     */
    write(options) {
        let params = options; // TODO Type
        params.query = this.query;
        return this.client.writeQuery(params);
    }
    /**
     * Fetches data from this query.
     * @method fetch
     * @since 1.0.0
     */
    fetch(options = {}) {
        let params = options;
        params.query = this.query;
        return this.client.query(params);
    }
    /**
     * Refetches data from this query from the network.
     * @method refetch
     * @since 1.0.0
     */
    refetch(options = {}) {
        let params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || 'network-only';
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        return this.client.query(params);
    }
    /**
     * Watches changes to this query.
     * @method watch
     * @since 1.0.0
     */
    watch(options = {}) {
        let params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || this.fetchPolicy;
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        return this.client.watchQuery(params);
    }
    /**
     * Observes a query for changes.
     * @method observe
     * @since 1.0.0
     */
    observe(options, observer) {
        let subscription = this.observers.get(observer);
        if (subscription) {
            subscription.unsubscribe();
        }
        if (options.polling) {
            options.pollInterval = 1000 * 60 * options.polling;
        }
        let params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || 'cache-and-network';
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        subscription = this.client.watchQuery(params).subscribe({
            next: (res) => {
                if (typeof observer == 'function') {
                    observer(res.loading, res.data || {});
                    return;
                }
                observer.onQuery(res.loading, res.data || {}, this);
            }
        });
        this.observers.set(observer, subscription);
        return this;
    }
    /**
     * Stop observing a query.
     * @method unobserve
     * @since 1.0.0
     */
    unobserve(observer) {
        let subscription = this.observers.get(observer);
        if (subscription == null) {
            return this;
        }
        subscription.unsubscribe();
        this.observers.delete(observer);
        return this;
    }
}
exports.Query = Query;
