"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
/**
 * Symbols
 */
exports.CLIENT = Symbol('client');
exports.MUTATION = Symbol('mutation');
/**
 * @class Mutation
 */
class Mutation {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 0.1.0
     */
    constructor(query) {
        /**
         * The default fetch policy.
         * @property fetchPolicy
         * @since 0.1.0
         */
        this.fetchPolicy = 'no-cache';
        /**
         * The default error policy.
         * @property errorPolicy
         * @since 0.1.0
         */
        this.errorPolicy = 'all';
        this[exports.MUTATION] = query;
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
     *
     * @property mutation
     * @since 0.1.0
     */
    get mutation() {
        return this[exports.MUTATION];
    }
    /**
     * Performs the mutation.
     * @method mutate
     * @since 0.1.0
     */
    mutate(options) {
        let params = options;
        params.mutation = this.mutation;
        params.fetchPolicy = params.fetchPolicy || this.fetchPolicy;
        params.errorPolicy = params.errorPolicy || this.errorPolicy;
        return this.client.mutate(options);
    }
}
exports.Mutation = Mutation;
