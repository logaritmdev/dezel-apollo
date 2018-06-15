"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Symbols
 */
exports.kClient = Symbol('client');
exports.kQuery = Symbol('query');
/**
 * @class Query
 */
var Query = /** @class */ (function () {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 1.0.0
     */
    function Query(client, query) {
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
        this[exports.kClient] = client;
        this[exports.kQuery] = query;
    }
    Object.defineProperty(Query.prototype, "client", {
        //--------------------------------------------------------------------------
        // Property
        //--------------------------------------------------------------------------
        /**
         *
         * @property client
         * @since 1.0.0
         */
        get: function () {
            return this[exports.kClient];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Query.prototype, "query", {
        /**
         *
         * @property query
         * @since 1.0.0
         */
        get: function () {
            return this[exports.kQuery];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Alias for fetch method.
     * @method exec
     * @since 1.0.0
     */
    Query.prototype.exec = function (options) {
        return this.fetch(options);
    };
    /**
     * Reads the query from the cache.
     * @method read
     * @since 1.0.0
     */
    Query.prototype.read = function (options) {
        if (options === void 0) { options = {}; }
        try {
            var params = options;
            params.query = this.query;
            return this.client.readQuery(params);
        }
        catch (e) {
            return null;
        }
    };
    /**
     * Writes the query to the cache.
     * @method write
     * @since 1.0.0
     */
    Query.prototype.write = function (options) {
        var params = options;
        params.query = this.query;
        return this.client.writeQuery(params);
    };
    /**
     * Fetches data from this query.
     * @method fetch
     * @since 1.0.0
     */
    Query.prototype.fetch = function (options) {
        if (options === void 0) { options = {}; }
        var params = options;
        params.query = this.query;
        return this.client.query(params);
    };
    /**
     * Refetches data from this query from the network.
     * @method refetch
     * @since 1.0.0
     */
    Query.prototype.refetch = function (options) {
        if (options === void 0) { options = {}; }
        var params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || 'network-only';
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        return this.client.query(params);
    };
    /**
     * Watches changes to this query.
     * @method watch
     * @since 1.0.0
     */
    Query.prototype.watch = function (options) {
        if (options === void 0) { options = {}; }
        var params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || this.fetchPolicy;
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        return this.client.watchQuery(params);
    };
    /**
     * Observes a query for changes.
     * @method observe
     * @since 1.0.0
     */
    Query.prototype.observe = function (options, observer) {
        var subscription = this.observers.get(observer);
        if (subscription) {
            subscription.unsubscribe();
        }
        if (options.polling) {
            options.pollInterval = 1000 * 60 * options.polling;
        }
        var params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || 'cache-and-network';
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        subscription = this.client.watchQuery(params).subscribe({
            next: function (res) { return observer(res.loading, res.data); }
        });
        this.observers.set(observer, subscription);
        return this;
    };
    /**
     * Stop observing a query.
     * @method unobserve
     * @since 1.0.0
     */
    Query.prototype.unobserve = function (observer) {
        var subscription = this.observers.get(observer);
        if (subscription == null) {
            return this;
        }
        subscription.unsubscribe();
        this.observers.delete(observer);
        return this;
    };
    return Query;
}());
exports.Query = Query;
