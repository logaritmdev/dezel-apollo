"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
/**
 * Symbols
 */
exports.CLIENT = Symbol('client');
exports.FRAGMENT = Symbol('fragment');
exports.TYPENAME = Symbol('typename');
/**
 * @class Fragment
 * @since 0.1.0
 */
class Fragment {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor(typename, fragment) {
        this[exports.TYPENAME] = typename;
        this[exports.FRAGMENT] = fragment;
    }
    //--------------------------------------------------------------------------
    // Property
    //--------------------------------------------------------------------------
    /**
     *
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
     *
     * @property fragment
     * @since 0.1.0
     */
    get fragment() {
        return this[exports.FRAGMENT];
    }
    /**
     *
     * @property typename
     * @since 0.1.0
     */
    get typename() {
        return this[exports.TYPENAME];
    }
    /**
     * Reads the query from the cache.
     * @method read
     * @since 0.1.0
     */
    read(id) {
        return this.client.readFragment({ id: this.typename + ':' + id, fragment: this.fragment });
    }
    /**
     * Writes the query to the cache.
     * @method write
     * @since 0.1.0
     */
    write(id, data) {
        return this.client.writeFragment({ id: this.typename + ':' + id, fragment: this.fragment, data });
    }
}
exports.Fragment = Fragment;
