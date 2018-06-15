"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Symbols
 */
exports.kClient = Symbol('client');
exports.kMutation = Symbol('mutation');
/**
 * @class Mutation
 */
var Mutation = /** @class */ (function () {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 1.0.0
     */
    function Mutation(client, query) {
        /**
         * The default error policy.
         * @property errorPolicy
         * @since 1.0.0
         */
        this.errorPolicy = 'all';
        this[exports.kClient] = client;
        this[exports.kMutation] = query;
    }
    Object.defineProperty(Mutation.prototype, "client", {
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
    Object.defineProperty(Mutation.prototype, "mutation", {
        /**
         *
         * @property mutation
         * @since 1.0.0
         */
        get: function () {
            return this[exports.kMutation];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Alias for mutate method.
     * @method exec
     * @since 1.0.0
     */
    Mutation.prototype.exec = function (options) {
        return this.mutate(options);
    };
    /**
     * Performs the mutation.
     * @method mutate
     * @since 1.0.0
     */
    Mutation.prototype.mutate = function (options) {
        var params = options;
        params.mutation = this.mutation;
        params.fetchPolicy = params.fetchPolicy || this.fetchPolicy;
        params.errorPolicy = params.errorPolicy || this.errorPolicy;
        return this.client.mutate(params);
    };
    return Mutation;
}());
exports.Mutation = Mutation;
