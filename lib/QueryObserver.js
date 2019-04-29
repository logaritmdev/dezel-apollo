"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dezel_1 = require("dezel");
const dezel_2 = require("dezel");
/**
 * @class QueryObserver
 * @since 0.1.0
 * @hidden
 */
class QueryObserver {
    //--------------------------------------------------------------------------
    // Constructor
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 0.1.0
     * @hidden
     */
    constructor(query, options, target) {
        /**
         * @class observable
         * @since 0.1.0
         * @hidden
         */
        this.observable = null;
        /**
         * @class subscriber
         * @since 0.1.0
         * @hidden
         */
        this.subscriber = null;
        if (options.pollInterval == null) {
            options.pollInterval = 15 * 60 * 1000;
        }
        this.query = query;
        this.options = options;
        this.target = target;
        dezel_2.ConnectivityManager.main.on('connect', this.onConnect);
        dezel_2.ConnectivityManager.main.on('disconnect', this.onDisconnect);
        this.subscribe();
    }
    /**
     * @method unobserve
     * @since 0.1.0
     * @hidden
     */
    unobserve() {
        dezel_2.ConnectivityManager.main.off('connect', this.onConnect);
        dezel_2.ConnectivityManager.main.off('disconnect', this.onDisconnect);
        this.unsubscribe();
    }
    /**
     * @method refetch
     * @since 0.1.0
     * @hidden
     */
    refetch(variables) {
        return this.observable ? this.observable.refetch(variables) : Promise.resolve(null);
    }
    //--------------------------------------------------------------------------
    // Private API
    //--------------------------------------------------------------------------
    /**
     * @method observe
     * @since 0.1.0
     * @hidden
     */
    subscribe() {
        let options = this.options;
        options.query = this.query.query;
        options.fetchPolicy = this.options.fetchPolicy || this.query.fetchPolicy;
        options.errorPolicy = this.options.errorPolicy || this.query.errorPolicy;
        this.observable = this.query.client.watchQuery(options);
        this.subscriber = this.observable.subscribe({
            next: (result) => {
                this.dispatch(result);
            }
        });
    }
    /**
     * @method unsubscribe
     * @since 0.1.0
     * @hidden
     */
    unsubscribe() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = null;
        }
    }
    /**
     * @method dispatch
     * @since 0.1.0
     * @hidden
     */
    dispatch(result) {
        let target = this.target;
        if (target == null) {
            return;
        }
        if (result.data == null) {
            result.data = {};
        }
        if (typeof target == 'function') {
            target(result);
        }
        if (typeof target == 'object') {
            target.onQuery(result);
        }
    }
    /**
     * @method onConnect
     * @since 0.1.0
     * @hidden
     */
    onConnect() {
        this.subscribe();
    }
    /**
     * @method onDisconnect
     * @since 0.1.0
     * @hidden
     */
    onDisconnect() {
        this.unsubscribe();
    }
}
__decorate([
    dezel_1.bound
], QueryObserver.prototype, "onConnect", null);
__decorate([
    dezel_1.bound
], QueryObserver.prototype, "onDisconnect", null);
exports.QueryObserver = QueryObserver;
