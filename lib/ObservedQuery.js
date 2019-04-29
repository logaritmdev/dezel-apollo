"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class ObservedQuery
 * @since 0.1.0
 * @hidden
 */
class ObservedQuery {
    //--------------------------------------------------------------------------
    // Constructor
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 1.0.0
     * @hidden
     */
    constructor(context, options, observer, bind = undefined) {
        //--------------------------------------------------------------------------
        // Properties
        //--------------------------------------------------------------------------
        /**
         * @property key
         * @since 1.0.0
         * @hidden
         */
        this.key = {};
        /**
         * @property query
         * @since 1.0.0
         * @hidden
         */
        this.query = null;
        this.context = context;
        this.options = options;
        this.observer = observer;
        this.bind = bind;
        this.attach();
    }
    /**
     * @method insert
     * @since 1.0.0
     * @hidden
     */
    static insert(key, val) {
        let index = ObservedQuery.keys.indexOf(key);
        if (index > -1) {
            return;
        }
        ObservedQuery.keys.push(key);
        ObservedQuery.vals.set(key, val);
    }
    /**
     * @method remove
     * @since 1.0.0
     * @hidden
     */
    static remove(key) {
        let index = ObservedQuery.keys.indexOf(key);
        if (index == -1) {
            return;
        }
        ObservedQuery.keys.splice(index, 1);
        ObservedQuery.vals.delete(key);
    }
    /**
     * @method refetch
     * @since 1.0.0
     * @hidden
     */
    refetch(variables) {
        return this.query ? this.query.refetch(variables) : Promise.resolve(null);
    }
    /**
     * @method attach
     * @since 1.0.0
     * @hidden
     */
    attach() {
        this.detach();
        if (this.options.polling) {
            this.options.pollInterval = 1000 * 60 * this.options.polling;
        }
        let params = this.options;
        params.query = this.context.query;
        params.fetchPolicy = this.options.fetchPolicy || 'cache-and-network';
        params.errorPolicy = this.options.errorPolicy || this.context.errorPolicy;
        console.log(params);
        this.query = this.context.client.watchQuery(params);
        this.subscriber = this.query.subscribe({
            next: (res) => {
                console.log('sybscrube res', res);
                if (this.options.execute == 'whenLoaded' ||
                    this.options.execute == 'whenLoadedWithData') {
                    if (res.loading) {
                        return;
                    }
                    if (res.data == null && this.options.execute == 'whenLoadedWithData') {
                        return;
                    }
                }
                if (typeof this.observer == 'function') {
                    this.observer.call(this.bind, res.loading, res.data || {});
                    return;
                }
                this.observer.onQuery(res.loading, res.data || {}, this.context);
            }
        });
        ObservedQuery.insert(this.key, this);
    }
    /**
     * @method detach
     * @since 1.0.0
     * @hidden
     */
    detach() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
        ObservedQuery.remove(this.key);
    }
}
//--------------------------------------------------------------------------
// Static
//--------------------------------------------------------------------------
/**
 * @property queries
 * @since 1.0.0
 * @hidden
 */
ObservedQuery.vals = new WeakMap();
/**
 * @property queries
 * @since 1.0.0
 * @hidden
 */
ObservedQuery.keys = [];
exports.ObservedQuery = ObservedQuery;
/**
 * Reattach observed queries when the connectivity is back.
 * @since 0.1.0
 */
ConnectivityManager.main.on('connect', function () {
    let keys = [];
    ObservedQuery.keys.forEach(key => {
        let val = ObservedQuery.vals.get(key);
        if (val == null) {
            return;
        }
        val.attach();
        keys.push(key);
    });
    ObservedQuery.keys = keys;
});
/**
 * Detach observed queries when the connectivity is lost.
 * @since 0.1.0
 */
ConnectivityManager.main.on('disconnect', function () {
    let keys = [];
    ObservedQuery.keys.forEach(key => {
        let val = ObservedQuery.vals.get(key);
        if (val == null) {
            return;
        }
        val.detach();
        keys.push(key);
    });
    ObservedQuery.keys = keys;
});
