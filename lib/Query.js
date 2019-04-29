"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const QueryObserver_1 = require("./QueryObserver");
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
     * @since 0.1.0
     */
    constructor(query) {
        /**
         * The default error policy.
         * @property errorPolicy
         * @since 0.1.0
         */
        this.errorPolicy = 'all';
        this[exports.QUERY] = query;
    }
    //--------------------------------------------------------------------------
    // Property
    //--------------------------------------------------------------------------
    /**
     * The apollo client.
     * @property client
     * @since 0.1.0
     */
    get client() {
        if (this[exports.CLIENT] == null) {
            this[exports.CLIENT] = Application_1.Application.apollo;
        }
        return this[exports.CLIENT];
    }
    /**
     * The apollo query.
     * @property query
     * @since 0.1.0
     */
    get query() {
        return this[exports.QUERY];
    }
    /**
     * Reads the query from the cache.
     * @method read
     * @since 0.1.0
     */
    read(options = {}) {
        let params = options;
        params.query = this.query;
        return this.client.readQuery(params);
    }
    /**
     * Writes the query to the cache.
     * @method write
     * @since 0.1.0
     */
    write(options) {
        let params = options;
        params.query = this.query;
        return this.client.writeQuery(params);
    }
    /**
     * Fetches data from this query.
     * @method fetch
     * @since 0.1.0
     */
    fetch(options = {}) {
        let params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || this.fetchPolicy;
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        return this.client.query(params);
    }
    /**
     * Watches changes to this query.
     * @method watch
     * @since 0.1.0
     */
    watch(options = {}) {
        if (options.pollInterval == null) {
            options.pollInterval = 15 * 60 * 1000;
        }
        let params = options;
        params.query = this.query;
        params.fetchPolicy = options.fetchPolicy || this.fetchPolicy;
        params.errorPolicy = options.errorPolicy || this.errorPolicy;
        return this.client.watchQuery(params);
    }
    /**
     * Observes a query for changes.
     * @method observe
     * @since 0.1.0
     */
    observe(target, options = {}) {
        return new QueryObserver_1.QueryObserver(this, options, target);
    }
}
exports.Query = Query;
