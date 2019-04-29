import ApolloClient from 'apollo-client'
import { FetchResult } from 'apollo-link'
import { DocumentNode } from 'graphql'
import { ErrorPolicy } from 'apollo-client/core/watchQueryOptions'
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions'
import { MutationBaseOptions } from 'apollo-client/core/watchQueryOptions'
import { Application } from './Application'

/**
 * Symbols
 */
export const CLIENT = Symbol('client')
export const MUTATION = Symbol('mutation')

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
	 *
	 * @property mutation
	 * @since 0.1.0
	 */
	public get mutation(): DocumentNode {
		return this[MUTATION]
	}

	/**
	 * The default fetch policy.
	 * @property fetchPolicy
	 * @since 0.1.0
	 */
	public fetchPolicy?: FetchPolicy = 'no-cache'

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
		this[MUTATION] = query
	}

	/**
	 * Performs the mutation.
	 * @method mutate
	 * @since 0.1.0
	 */
	public mutate(options: MutationOptions): Promise<FetchResult<T>> {

		let params = options as any
		params.mutation = this.mutation
		params.fetchPolicy = params.fetchPolicy || this.fetchPolicy
		params.errorPolicy = params.errorPolicy || this.errorPolicy

		return this.client.mutate<T>(options as any)
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
	 * @property Symbol(mutation)
	 * @since 0.1.0
	 * @hidden
	 */
	private [MUTATION]: DocumentNode

}
