import { Alert } from 'dezel'
import { GraphQLError } from 'graphql'

/**
 * @interface ErrorAlertOptions
 * @since 0.1.0
 */
export interface ErrorAlertOptions {
	title?: string
	errors: ReadonlyArray<GraphQLError>
}

/**
 * @class ErrorAlert
 * @since 0.1.0
 */
export class ErrorAlert extends Alert {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(options: ErrorAlertOptions) {
		super({ title: options.title, message: options.errors.map(error => error.message).join('\n') })
	}
}