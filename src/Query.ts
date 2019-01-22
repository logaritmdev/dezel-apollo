import ApolloClient from 'apollo-client'
import { WatchQueryOptions } from 'apollo-client/core/watchQueryOptions'
import { ModifiableWatchQueryOptions } from 'apollo-client/core/watchQueryOptions'
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions'
import { ErrorPolicy } from 'apollo-client/core/watchQueryOptions'
import { DocumentNode } from 'graphql'
import { Application } from './Application'

/**
 * Symbols
 */
export const CLIENT = Symbol('client')
export const QUERY = Symbol('query')

/**
 * @interface QueryOptions
 * @since 0.1.0
 */
export interface QueryOptions extends ModifiableWatchQueryOptions {
	metadata?: any
	context?: any
	polling?: number
}

/**
 * @interface ReadQueryOptions
 * @since 0.1.0
 */
export interface ReadQueryOptions {
	variables?: any
}

/**
 * @interface WriteQueryOptions
 * @since 0.1.0
 */
export interface WriteQueryOptions {
	data: any
}

/**
 * @type ObserverFunction
 * @since 0.1.0
 */
export type ObserverFunction<T> = (loading: boolean, data: T) => void

/**
 * @type ObserverObject
 * @since 0.1.0
 */
export type ObserverObject<T> = {
	onQuery(loading: boolean, data: T, query: Query<T>): void
}

/**
 * @class Query
 * @since 0.1.0
 */
export class Query<T, V = any> {

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
	 * @property query
	 * @since 1.0.0
	 */
	public get query(): DocumentNode {
		return this[QUERY]
	}

	/**
	 * The default fetch policy.
	 * @property fetchPolicy
	 * @since 1.0.0
	 */
	public fetchPolicy?: FetchPolicy

	/**
	 * The default error policy.
	 * @property errorPolicy
	 * @since 1.0.0
	 */
	public errorPolicy?: ErrorPolicy = 'all'

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(query: DocumentNode) {
		this[QUERY] = query
	}

	/**
	 * Reads the query from the cache.
	 * @method read
	 * @since 1.0.0
	 */
	public read(options: ReadQueryOptions = {}) {

		try {

			let params = options as any // TODO type
			params.query = this.query
			return this.client.readQuery<T>(params)

		} catch (e) {
			return null
		}
	}

	/**
	 * Writes the query to the cache.
	 * @method write
	 * @since 1.0.0
	 */
	public write(options: WriteQueryOptions) {
		let params = options as any // TODO Type
		params.query = this.query
		return this.client.writeQuery(params)
	}

	/**
	 * Fetches data from this query.
	 * @method fetch
	 * @since 1.0.0
	 */
	public fetch(options: QueryOptions = {}) {
		let params = options as WatchQueryOptions
		params.query = this.query
		return this.client.query<T>(params)
	}

	/**
	 * Refetches data from this query from the network.
	 * @method refetch
	 * @since 1.0.0
	 */
	public refetch(options: QueryOptions = {}) {

		let params = options as WatchQueryOptions
		params.query = this.query
		params.fetchPolicy = options.fetchPolicy || 'network-only'
		params.errorPolicy = options.errorPolicy || this.errorPolicy

		return this.client.query<T>(params)
	}

	/**
	 * Watches changes to this query.
	 * @method watch
	 * @since 1.0.0
	 */
	public watch(options: QueryOptions = {}) {

		let params = options as WatchQueryOptions
		params.query = this.query
		params.fetchPolicy = options.fetchPolicy || this.fetchPolicy
		params.errorPolicy = options.errorPolicy || this.errorPolicy

		return this.client.watchQuery<T>(params)
	}

	/**
	 * Observes a query for changes.
	 * @method observe
	 * @since 1.0.0
	 */
	public observe(options: QueryOptions, observer: ObserverFunction<T> | ObserverObject<T>) {

		let subscription = this.observers.get(observer)
		if (subscription) {
			subscription.unsubscribe()
		}

		if (options.polling) {
			options.pollInterval = 1000 * 60 * options.polling
		}

		let params = options as WatchQueryOptions
		params.query = this.query
		params.fetchPolicy = options.fetchPolicy || 'cache-and-network'
		params.errorPolicy = options.errorPolicy || this.errorPolicy

		subscription = this.client.watchQuery<T>(params).subscribe({

			next: (res: any) => {

				if (typeof observer == 'function') {
					observer(res.loading, res.data || {})
					return
				}

				observer.onQuery(res.loading, res.data || {}, this)
			}
		})

		this.observers.set(observer, subscription)

		return this
	}

	/**
	 * Stop observing a query.
	 * @method unobserve
	 * @since 1.0.0
	 */
	public unobserve(observer: ObserverFunction<T> | ObserverObject<T>) {

		let subscription = this.observers.get(observer)
		if (subscription == null) {
			return this
		}

		subscription.unsubscribe()

		this.observers.delete(observer)

		return this
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
	 * @property Symbol(query)
	 * @since 1.0.0
	 * @hidden
	 */
	private [QUERY]: DocumentNode

	/**
	 * @property observers
	 * @since 1.0.0
	 * @hidden
	 */
	private observers: Map<any, any> = new Map()
}