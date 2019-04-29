import { ApolloQueryResult } from 'apollo-client'
import { ObservableQuery } from 'apollo-client'
import { OperationVariables } from 'apollo-client'
import { bound } from 'dezel'
import { ConnectivityManager } from 'dezel'
import { Query } from './Query'
import { QueryOptions } from './Query'

/**
 * @class QueryObserver
 * @since 0.1.0
 * @hidden
 */
export class QueryObserver<T, V = OperationVariables> {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * @class query
	 * @since 0.1.0
	 * @hidden
	 */
	private query: Query<T, V>

	/**
	 * @class options
	 * @since 0.1.0
	 * @hidden
	 */
	private options: QueryOptions

	/**
	 * @class action
	 * @since 0.1.0
	 * @hidden
	 */
	private target: QueryObserverFunction<T, V> | QueryObserverObject<T, V>

	/**
	 * @class observable
	 * @since 0.1.0
	 * @hidden
	 */
	private observable: ObservableQuery<T, V> | null = null

	/**
	 * @class subscriber
	 * @since 0.1.0
	 * @hidden
	 */
	private subscriber: any = null

	//--------------------------------------------------------------------------
	// Constructor
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 * @hidden
	 */
	constructor(query: Query<T, V>, options: QueryOptions, target: QueryObserverFunction<T, V> | QueryObserverObject<T, V>) {

		if (options.pollInterval == null) {
			options.pollInterval = 15 * 60 * 1000
		}

		this.query = query
		this.options = options
		this.target = target

		ConnectivityManager.main.on('connect', this.onConnect)
		ConnectivityManager.main.on('disconnect', this.onDisconnect)

		this.subscribe()
	}

	/**
	 * @method unobserve
	 * @since 0.1.0
	 * @hidden
	 */
	public unobserve() {
		ConnectivityManager.main.off('connect', this.onConnect)
		ConnectivityManager.main.off('disconnect', this.onDisconnect)
		this.unsubscribe()
	}

	/**
	 * @method refetch
	 * @since 0.1.0
	 * @hidden
	 */
	public refetch(variables?: V) {
		return this.observable ? this.observable.refetch(variables) : Promise.resolve(null)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method observe
	 * @since 0.1.0
	 * @hidden
	 */
	private subscribe() {

		let options = this.options as any
		options.query = this.query.query
		options.fetchPolicy = this.options.fetchPolicy || this.query.fetchPolicy
		options.errorPolicy = this.options.errorPolicy || this.query.errorPolicy

		this.observable = this.query.client.watchQuery<T, V>(options)

		this.subscriber = this.observable.subscribe({
			next: (result: ApolloQueryResult<T>) => {
				this.dispatch(result)
			}
		})
	}

	/**
	 * @method unsubscribe
	 * @since 0.1.0
	 * @hidden
	 */
	private unsubscribe() {
		if (this.subscriber) {
			this.subscriber.unsubscribe()
			this.subscriber = null
		}
	}

	/**
	 * @method dispatch
	 * @since 0.1.0
	 * @hidden
	 */
	private dispatch(result: ApolloQueryResult<T>) {

		let target = this.target
		if (target == null) {
			return
		}

		if (result.data == null) {
			result.data = {} as T
		}

		if (typeof target == 'function') {
			target(result)
		}

		if (typeof target == 'object') {
			target.onQuery(result)
		}
	}

	/**
	 * @method onConnect
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onConnect() {
		this.subscribe()
	}

	/**
	 * @method onDisconnect
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDisconnect() {
		this.unsubscribe()
	}
}

/**
 * @type QueryObserverFunction
 * @since 0.1.0
 */
export type QueryObserverFunction<T, V> = (result: ApolloQueryResult<T>) => void

/**
 * @type QueryObserverObject
 * @since 0.1.0
 */
export type QueryObserverObject<T, V> = {
	onQuery(result: ApolloQueryResult<T>): void
}