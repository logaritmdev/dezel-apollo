import ApolloLinkTimeout from 'apollo-link-timeout'
import 'whatwg-fetch'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { Observable } from 'apollo-link'
import { Operation } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { ServerError } from 'apollo-link-http-common'
import { ServerParseError } from 'apollo-link-http-common'
import { Application as BaseApplication } from 'dezel'
import { Event } from 'dezel'
import { GraphQLError } from 'graphql'
import { NetworkError } from './NetworkError'

/**
 * @symbol READY
 * @since 0.4.0
 */
export const APOLLO = Symbol('apollo')

/**
 * @symbol READY
 * @since 0.4.0
 */
export const QUERIES = Symbol('queries')

/**
 * @class Application
 * @super Application
 */
export class Application extends BaseApplication {

	//--------------------------------------------------------------------------
	// Static Properties
	//--------------------------------------------------------------------------

	/**
	 * Returns the global apollo client.
	 * @property apollo
	 * @since 0.1.0
	 */
	public static get apollo(): ApolloClient<any> {

		let application = Application.main
		if (application == null) {
			throw new Error(
				'Apollo Application Error: ' +
				'The application has not been created.'
			)
		}

		if (application instanceof Application) {

			let apollo = application[APOLLO]
			if (apollo == null) {
				throw new Error(
					'Apollo Application Error: ' +
					'The apollo client has not been created.'
				)
			}

			return apollo
		}

		throw new Error(
			'Apollo Application Error: ' +
			'The application is not an apollo application'
		)
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Returns the apollo client.
	 * @property apollo
	 * @since 0.1.0
	 */
	public get apollo(): ApolloClient<any> {
		return this[APOLLO]!
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	constructor() {

		super()

		let configs = this.configure()

		const request = async (operation: Operation) => {
			this.emit<ApplicationRequestEvent>('apollorequest', {
				data: {
					operation
				}
			})
		}

		const timeoutLink = new ApolloLinkTimeout(30000)

		const requestLink = new ApolloLink((operation, forward) => new Observable(observer => {

			let handle: any

			Promise.resolve(operation)
				.then(operation => request(operation))
				.then(() => {
					handle = forward!(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					});
				})
				.catch(observer.error.bind(observer))

			return () => handle && handle.unsubscribe()

		}))

		let link = ApolloLink.from([

			onError((error) => {

				let {
					graphQLErrors,
					networkError
				} = error

				if (networkError) {
					this.dispatchNetworkError(networkError)
				}

				if (graphQLErrors) {
					for (let requestError of graphQLErrors) {
						this.dispatchRequestError(requestError)
					}
				}
			}),

			requestLink,
			timeoutLink.concat(
				new HttpLink({ uri: configs.uri, credentials: 'include' })
			)

		])

		this[APOLLO] = new ApolloClient({ link, cache: new InMemoryCache() })
	}

	/**
	 * Returns the client configurations.
	 * @method configure
	 * @since 0.1.0
	 */
	public configure(): any {
		return {
			uri: ''
		}
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onEmit
	 * @since 0.1.0
	 */
	public onEmit(event: Event) {

		switch (event.type) {

			case 'apollorequest':
				this.onApolloRequest(event)
				break

			case 'apollorequesterror':
				this.onApolloRequestError(event)
				break

			case 'apollonetworkerror':
				this.onApolloNetworkError(event)
				break;
		}

		super.onEmit(event)
	}

	/**
	 * Called when the application makes a request.
	 * @method onApolloRequest
	 * @since 0.1.0
	 */
	public onApolloRequest(event: Event<ApplicationRequestEvent>) {

	}

	/**
	 * Called when the application receives a request error.
	 * @method onApolloRequestError
	 * @since 0.1.0
	 */
	public onApolloRequestError(event: Event<ApplicationRequestErrorEvent>) {

	}

	/**
	 * Called when the application receives a network error.
	 * @method onApolloNetworkError
	 * @since 0.1.0
	 */
	public onApolloNetworkError(event: Event<ApplicationNetworkErrorEvent>) {

	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property [APOLLO]
	 * @since 0.1.0
	 * @hidden
	 */
	private [APOLLO]: ApolloClient<any> | null

	/**
	 * @method dispatchNetworkError
	 * @since 0.1.0
	 * @hidden
	 */
	private dispatchNetworkError(error: Error | ServerError | ServerParseError) {

		let event = error as any

		if (event instanceof Error == false) {

			/*
			 * I believe the error event from Dezel XMLHttpRequest might not
			 * be doing the right thing becasue I'm receiving an event where
			 * instead of a error.
			 */

			if (event.description) {
				error = new TypeError(event.description)
			}
		}

		error = new NetworkError(error)

		this.emit('apollonetworkerror', { data: { error } })
	}

	/**
	 * @method dispatchRequestError
	 * @since 0.1.0
	 * @hidden
	 */
	private dispatchRequestError(error: GraphQLError) {
		this.emit('apollorequesterror', { data: { error } })
	}
}

/**
 * @type ApplicationRequestEvent
 * @since 0.4.0
 */
export type ApplicationRequestEvent = {
	operation: Operation
}

/**
 * @type ApplicationNetworkErrorEvent
 * @since 0.4.0
 */
export type ApplicationNetworkErrorEvent = {
	error: Error
}

/**
 * @type ApplicationRequestErrorEvent
 * @since 0.4.0
 */
export type ApplicationRequestErrorEvent = {
	error: Error
}