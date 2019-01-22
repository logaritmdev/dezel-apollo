import ApolloClient from 'apollo-client';
import { DocumentNode } from 'graphql';
/**
 * Symbols
 */
export declare const CLIENT: unique symbol;
export declare const FRAGMENT: unique symbol;
export declare const TYPENAME: unique symbol;
/**
 * @class Fragment
 * @since 0.1.0
 */
export declare class Fragment<T> {
    /**
     *
     * @property client
     * @since 1.0.0
     */
    readonly client: ApolloClient<any>;
    /**
     *
     * @property fragment
     * @since 1.0.0
     */
    readonly fragment: DocumentNode;
    /**
     *
     * @property typename
     * @since 1.0.0
     */
    readonly typename: string;
    /**
     * @constructor
     * @since 1.0.0
     */
    constructor(typename: string, fragment: DocumentNode);
    /**
     * Reads the query from the cache.
     * @method read
     * @since 1.0.0
     */
    read(id: string): T | null;
    /**
     * Writes the query to the cache.
     * @method write
     * @since 1.0.0
     */
    write(id: string, data: any): void;
    /**
     * @property Symbol(client)
     * @since 1.0.0
     * @hidden
     */
    private [CLIENT];
    /**
     * @property Symbol(fragment)
     * @since 1.0.0
     * @hidden
     */
    private [FRAGMENT];
    /**
     * @property Symbol(typename)
     * @since 1.0.0
     * @hidden
     */
    private [TYPENAME];
}
