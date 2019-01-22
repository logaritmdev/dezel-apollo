import { bound } from 'dezel'
import { DataSource as BaseDataSource } from 'dezel'
import { DataSourceOptions as BaseDataSourceOptions } from 'dezel'
import { FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions'
import { Query } from './Query'
import { QueryOptions } from './Query'

/**
 * @interface DataSourceOptions
 * @since 0.1.0
 */
export interface DataSourceOptions<T, Q> extends BaseDataSourceOptions<T> {
	convert: (data: Q) => Array<T>
	polling?: number
	variables?: any
	fetchPolicy?: FetchPolicy
	errorPolicy?: ErrorPolicy
}

// TODO
// Add error hanlding

/**
 * @symbol LOADED
 * @since 0.1.0
 */
export const LOADED = Symbol('loaded')

/**
 * @symbol LOADING
 * @since 0.1.0
 */
export const LOADING = Symbol('loading')

/**
 * @class DataSource
 * @super DataSource
 * @since 0.1.0
 */
export class DataSource<T, Q> extends BaseDataSource<T> {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The data source's query
	 * @property query
	 * @since 0.1.0
	 */
	public readonly query: Query<Q>

	/**
	 * Whether the data is loaded.
	 * @property loaded
	 * @since 0.1.0
	 */
	public get loaded(): boolean {
		return this[LOADED]
	}

	/**
	 * Whether the data is loading.
	 * @property loaded
	 * @since 0.1.0
	 */
	public get loading(): boolean {
		return this[LOADING]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the data source with optional data.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(query: Query<Q>, options: DataSourceOptions<T, Q>) {
		super(undefined, options)
		this.query = query
		this.convert = options.convert
		this.polling = options.polling
		this.variables = options.variables
		this.fetchPolicy = options.fetchPolicy
		this.errorPolicy = options.errorPolicy || 'all'
	}

	/**
	 * Observes the data that is bound to this query.
	 * @method observe
	 * @since 0.1.0
	 */
	public observe(options: QueryOptions = {}) {

		if (options.polling == null) options.polling = this.polling
		if (options.variables == null) options.variables = this.variables
		if (options.fetchPolicy == null) options.fetchPolicy = this.fetchPolicy
		if (options.errorPolicy == null) options.errorPolicy = this.errorPolicy

		this.query.observe(options, this.onFetch)

		return this
	}

	/**
	 * Refetches the data that is bound to this query.
	 * @method refetch
	 * @since 0.1.0
	 */
	public refetch(options: QueryOptions = {}) {

		if (options.variables == null) options.variables = this.variables
		if (options.fetchPolicy == null) options.fetchPolicy = this.fetchPolicy
		if (options.errorPolicy == null) options.errorPolicy = this.errorPolicy

		return this.query.refetch(options).then(res => this.onFetch(res.loading, res.data))
	}

	/**
	 * @inherited
	 * @method destroy
	 * @since 0.1.0
	 */
	public destroy() {
		this.query.unobserve(this.onFetch)
		super.destroy()
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property [LOADED]
	 * @since 1.0.0
	 * @hidden
	 */
	private [LOADED]: boolean = false

	/**
	 * @property [LOADING]
	 * @since 1.0.0
	 * @hidden
	 */
	private [LOADING]: boolean = false

	/**
	 * @property polling
	 * @since 1.0.0
	 * @hidden
	 */
	private polling?: number

	/**
	 * @property variables
	 * @since 1.0.0
	 * @hidden
	 */
	private variables?: any

	/**
	 * @property fetchPolicy
	 * @since 1.0.0
	 * @hidden
	 */
	public fetchPolicy?: FetchPolicy

	/**
	 * @property errorPolicy
	 * @since 1.0.0
	 * @hidden
	 */
	public errorPolicy?: ErrorPolicy = 'all'

	/**
	 * @property convert
	 * @since 1.0.0
	 * @hidden
	 */
	private convert: (data: Q) => Array<T>

	/**
	 * @method onFetch
	 * @since 1.0.0
	 * @hidden
	 */
	@bound private onFetch(loading: boolean, data?: Q) {

		if (loading) {

			if (this[LOADING] == false) {
				this[LOADING] = true
				this.emit('loadstart')
			}

			return
		}

		if (data) {

			let rows = this.convert(data)

			if (this[LOADED] == false) {
				this[LOADED] = true
				this.reset(rows)
			} else {
				this.update(rows)
			}
		}

		if (this[LOADING]) {
			this[LOADING] = false
			this.emit('load')
		}
	}
}