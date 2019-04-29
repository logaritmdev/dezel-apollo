import { DocumentNode } from 'graphql'
import { ErrorPolicy } from 'apollo-client/core/watchQueryOptions'
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions'
import { ModifiableWatchQueryOptions } from 'apollo-client/core/watchQueryOptions'
import { ObservableQuery } from 'apollo-client/core/ObservableQuery'
import ApolloClient, { OperationVariables } from 'apollo-client'
import { WatchQueryOptions } from 'apollo-client/core/watchQueryOptions'
import { Application } from './Application'
import { QueryObserver } from './QueryObserver'
import { QueryObserverFunction } from './QueryObserver'
import { QueryObserverObject } from './QueryObserver'

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
 * @class Query
 * @since 0.1.0
 */
export class Query<T, V = OperationVariables> {

	//--------------------------------------------------------------------------
	// Property
	//--------------------------------------------------------------------------

	/**
	 * The apollo client.
	 * @property client
	 * @since 0.1.0
	 */
	public get client(): ApolloClient<any> {

		if (this[CLIENT] == null) {
			this[CLIENT] = Application.apollo
		}

		return this[CLIENT]
	}

	/**
	 * The apollo query.
	 * @property query
	 * @since 0.1.0
	 */
	public get query(): DocumentNode {
		return this[QUERY]
	}

	/**
	 * The default fetch policy.
	 * @property fetchPolicy
	 * @since 0.1.0
	 */
	public fetchPolicy?: FetchPolicy

	/**
	 * The default error policy.
	 * @property errorPolicy
	 * @since 0.1.0
	 */
	public errorPolicy?: ErrorPolicy = 'all'

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(query: DocumentNode) {
		this[QUERY] = query
	}

	/**
	 * Reads the query from the cache.
	 * @method read
	 * @since 0.1.0
	 */
	public read(options: ReadQueryOptions = {}) {
		let params = options as any
		params.query = this.query
		return this.client.readQuery<T>(params)
	}

	/**
	 * Writes the query to the cache.
	 * @method write
	 * @since 0.1.0
	 */
	public write(options: WriteQueryOptions) {
		let params = options as any
		params.query = this.query
		return this.client.writeQuery(params)
	}

	/**
	 * Fetches data from this query.
	 * @method fetch
	 * @since 0.1.0
	 */
	public fetch(options: QueryOptions = {}) {

		let params = options as any
		params.query = this.query
		params.fetchPolicy = options.fetchPolicy || this.fetchPolicy
		params.errorPolicy = options.errorPolicy || this.errorPolicy

		return this.client.query<T>(params)
	}

	/**
	 * Watches changes to this query.
	 * @method watch
	 * @since 0.1.0
	 */
	public watch(options: QueryOptions = {}) {

		if (options.pollInterval == null) {
			options.pollInterval = 15 * 60 * 1000
		}

		let params = options as any
		params.query = this.query
		params.fetchPolicy = options.fetchPolicy || this.fetchPolicy
		params.errorPolicy = options.errorPolicy || this.errorPolicy

		return this.client.watchQuery<T, V>(params)
	}

	/**
	 * Observes a query for changes.
	 * @method observe
	 * @since 0.1.0
	 */
	public observe(target: QueryObserverFunction<T, V> | QueryObserverObject<T, V>, options: QueryOptions = {}): QueryObserver<T, V> {
		return new QueryObserver(this, options, target)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property Symbol(client)
	 * @since 0.1.0
	 * @hidden
	 */
	private [CLIENT]: ApolloClient<Object>

	/**
	 * @property Symbol(query)
	 * @since 0.1.0
	 * @hidden
	 */
	private [QUERY]: DocumentNode
}
