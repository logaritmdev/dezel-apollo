"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
"use strict";
const dezel_1 = require("dezel");
const dezel_2 = require("dezel");
// TODO
// Add error hanlding
/**
 * @symbol LOADED
 * @since 0.1.0
 */
exports.LOADED = Symbol('loaded');
/**
 * @symbol LOADING
 * @since 0.1.0
 */
exports.LOADING = Symbol('loading');
/**
 * @class DataSource
 * @super DataSource
 * @since 0.1.0
 */
class DataSource extends dezel_2.DataSource {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * Initializes the data source with optional data.
     * @constructor
     * @since 0.1.0
     */
    constructor(query, options) {
        super(undefined, options);
        //--------------------------------------------------------------------------
        // Private API
        //--------------------------------------------------------------------------
        /**
         * @property [LOADED]
         * @since 1.0.0
         * @hidden
         */
        this[_a] = false;
        /**
         * @property [LOADING]
         * @since 1.0.0
         * @hidden
         */
        this[_b] = false;
        /**
         * @property errorPolicy
         * @since 1.0.0
         * @hidden
         */
        this.errorPolicy = 'all';
        this.query = query;
        this.convert = options.convert;
        this.polling = options.polling;
        this.variables = options.variables;
        this.fetchPolicy = options.fetchPolicy;
        this.errorPolicy = options.errorPolicy || 'all';
    }
    /**
     * Whether the data is loaded.
     * @property loaded
     * @since 0.1.0
     */
    get loaded() {
        return this[exports.LOADED];
    }
    /**
     * Whether the data is loading.
     * @property loaded
     * @since 0.1.0
     */
    get loading() {
        return this[exports.LOADING];
    }
    /**
     * Observes the data that is bound to this query.
     * @method observe
     * @since 0.1.0
     */
    observe(options = {}) {
        if (options.polling == null)
            options.polling = this.polling;
        if (options.variables == null)
            options.variables = this.variables;
        if (options.fetchPolicy == null)
            options.fetchPolicy = this.fetchPolicy;
        if (options.errorPolicy == null)
            options.errorPolicy = this.errorPolicy;
        this.query.observe(options, this.onFetch);
        return this;
    }
    /**
     * Refetches the data that is bound to this query.
     * @method refetch
     * @since 0.1.0
     */
    refetch(options = {}) {
        if (options.variables == null)
            options.variables = this.variables;
        if (options.fetchPolicy == null)
            options.fetchPolicy = this.fetchPolicy;
        if (options.errorPolicy == null)
            options.errorPolicy = this.errorPolicy;
        return this.query.refetch(options).then(res => this.onFetch(res.loading, res.data));
    }
    /**
     * @inherited
     * @method destroy
     * @since 0.1.0
     */
    destroy() {
        this.query.unobserve(this.onFetch);
        super.destroy();
    }
    /**
     * @method onFetch
     * @since 1.0.0
     * @hidden
     */
    onFetch(loading, data) {
        if (loading) {
            if (this[exports.LOADING] == false) {
                this[exports.LOADING] = true;
                this.emit('loadstart');
            }
            return;
        }
        if (data) {
            let rows = this.convert(data);
            if (this[exports.LOADED] == false) {
                this[exports.LOADED] = true;
                this.reset(rows);
            }
            else {
                this.update(rows);
            }
        }
        if (this[exports.LOADING]) {
            this[exports.LOADING] = false;
            this.emit('load');
        }
    }
}
_a = exports.LOADED, _b = exports.LOADING;
__decorate([
    dezel_1.bound
], DataSource.prototype, "onFetch", null);
exports.DataSource = DataSource;
