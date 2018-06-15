import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { WatchQueryOptions, SubscriptionOptions, MutationOptions, ModifiableWatchQueryOptions, MutationBaseOptions, FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions'
import { ApolloQueryResult } from 'apollo-client/core/types'
import { ObservableQuery } from 'apollo-client/core/ObservableQuery'
import { DataProxy } from 'apollo-cache'
import { DocumentNode, ExecutionResult } from 'graphql'

/**
 * Symbols
 */
export const kClient = Symbol('client')
export const kQuery = Symbol('query')

/**
 * @interface QueryOptions
 */
export interface QueryOptions extends ModifiableWatchQueryOptions {
	metadata?: any
	context?: any
	polling?: number
}

/**
 * @interface ReadQueryOptions
 */
export interface ReadQueryOptions {
	variables?: any
}

/**
 * @interface WriteQueryOptions
 */
export interface WriteQueryOptions {
	data: any
}

/**
 * @type Callback
 */
export type Callback<T> = (loading: boolean, data?: T) => void

/**
 * @class Query
 */
export class Query<T> {

	//--------------------------------------------------------------------------
	// Property
	//--------------------------------------------------------------------------

	/**
	 *
	 * @property client
	 * @since 1.0.0
	 */
	public get client(): ApolloClient<Object> {
		return this[kClient]
	}

	/**
	 *
	 * @property query
	 * @since 1.0.0
	 */
	public get query(): DocumentNode {
		return this[kQuery]
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
	constructor(client: ApolloClient<Object>, query: DocumentNode) {
		this[kClient] = client
		this[kQuery] = query
	}

	/**
	 * Alias for fetch method.
	 * @method exec
	 * @since 1.0.0
	 */
	public exec(options: QueryOptions) {
		return this.fetch(options)
	}

	/**
	 * Reads the query from the cache.
	 * @method read
	 * @since 1.0.0
	 */
	public read(options: ReadQueryOptions = {}) {

		try {

			let params = options as DataProxy.Query
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
		let params = options as DataProxy.WriteQueryOptions
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
	public observe(options: QueryOptions, observer: Callback<T>) {

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
			next: (res) => observer(res.loading, res.data as T)
		})

		this.observers.set(observer, subscription)

		return this
	}

	/**
	 * Stop observing a query.
	 * @method unobserve
	 * @since 1.0.0
	 */
	public unobserve(observer: Callback<T>) {

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
	private [kClient]: ApolloClient<Object>

	/**
	 * @property Symbol(query)
	 * @since 1.0.0
	 * @hidden
	 */
	private [kQuery]: DocumentNode

	/**
	 * @property observers
	 * @since 1.0.0
	 * @hidden
	 */
	private observers: Map<any, any> = new Map()
}