import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { MutationBaseOptions, FetchPolicy, ErrorPolicy } from 'apollo-client/core/watchQueryOptions'
import { DocumentNode, ExecutionResult } from 'graphql'

/**
 * Symbols
 */
export const kClient = Symbol('client')
export const kMutation = Symbol('mutation')

/**
 * @interface MutationOptions
 */
export interface MutationOptions extends MutationBaseOptions {
	metadata?: any;
	context?: any;
}

/**
 * @class Mutation
 */
export class Mutation<T> {

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
	 * @property mutation
	 * @since 1.0.0
	 */
	public get mutation(): DocumentNode {
		return this[kMutation]
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
		this[kMutation] = query
	}

	/**
	 * Alias for mutate method.
	 * @method exec
	 * @since 1.0.0
	 */
	public exec(options: MutationOptions) {
		return this.mutate(options)
	}

	/**
	 * Performs the mutation.
	 * @method mutate
	 * @since 1.0.0
	 */
	public mutate(options: MutationOptions) {
		let params = options as any
		params.mutation = this.mutation
		params.fetchPolicy = params.fetchPolicy || this.fetchPolicy
		params.errorPolicy = params.errorPolicy || this.errorPolicy
		return this.client.mutate(params)
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
	 * @property Symbol(mutation)
	 * @since 1.0.0
	 * @hidden
	 */
	private [kMutation]: DocumentNode

}