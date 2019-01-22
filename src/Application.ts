import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { Observable } from 'apollo-link'
import { Operation } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { persistCache } from 'apollo-cache-persist'
import { Event } from 'dezel'
import { Application as BaseApplication } from 'dezel'

/**
 * @symbol READY
 * @since 0.4.0
 */
export const APOLLO = Symbol('apollo')

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

		let application = Application.instance
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

		/*
		 * Apollo cache
		 */

		let cache = new InMemoryCache()

		/*
		 * Manages apollo request
		 */

		const request = async (operation: Operation) => {
			console.log('request')
			this.emit<ApplicationRequestEvent>('apollorequest', {
				data: {
					operation
				}
			})
		};

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

		/*
		 * Apollo link
		 */

		let link = ApolloLink.from([

			onError((error) => {

				let {
					graphQLErrors,
					networkError
				} = error

				if (networkError) {
					this.emit('apollonetworkerror', { data: { error: networkError } })
				}

				if (graphQLErrors) {
					for (let error of graphQLErrors) {
						this.emit('apollorequesterror', { data: { error } })
					}
				}
			}),

			requestLink,

			new HttpLink({ uri: configs.uri, credentials: 'include' })

		])

		this[APOLLO] = new ApolloClient({ link, cache })
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