import ApolloClient from 'apollo-client'
import { DocumentNode } from 'graphql'
import { Application } from './Application'

/**
 * Symbols
 */
export const CLIENT = Symbol('client')
export const FRAGMENT = Symbol('fragment')
export const TYPENAME = Symbol('typename')

/**
 * @class Fragment
 * @since 0.1.0
 */
export class Fragment<T> {

	//--------------------------------------------------------------------------
	// Property
	//--------------------------------------------------------------------------

	/**
	 *
	 * @property client
	 * @since 1.0.0
	 */
	public get client(): ApolloClient<any> {

		if (this[CLIENT] == null) {
			this[CLIENT] = Application.apollo
		}

		return this[CLIENT]
	}

	/**
	 *
	 * @property fragment
	 * @since 1.0.0
	 */
	public get fragment(): DocumentNode {
		return this[FRAGMENT]
	}

	/**
	 *
	 * @property typename
	 * @since 1.0.0
	 */
	public get typename(): string {
		return this[TYPENAME]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(typename: string, fragment: DocumentNode) {
		this[TYPENAME] = typename
		this[FRAGMENT] = fragment
	}

	/**
	 * Reads the query from the cache.
	 * @method read
	 * @since 1.0.0
	 */
	public read(id: string) {
		return this.client.readFragment<T>({ id: this.typename + ':' + id, fragment: this.fragment })
	}

	/**
	 * Writes the query to the cache.
	 * @method write
	 * @since 1.0.0
	 */
	public write(id: string, data: any) {
		return this.client.writeFragment({ id: this.typename + ':' + id, fragment: this.fragment, data })
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property Symbol(client)
	 * @since 1.0.0
	 * @hidden
	 */
	private [CLIENT]: ApolloClient<Object>

	/**
	 * @property Symbol(fragment)
	 * @since 1.0.0
	 * @hidden
	 */
	private [FRAGMENT]: DocumentNode

	/**
	 * @property Symbol(typename)
	 * @since 1.0.0
	 * @hidden
	 */
	private [TYPENAME]: string

}