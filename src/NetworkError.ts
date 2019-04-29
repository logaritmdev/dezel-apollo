/**
 * @class NetworkError
 * @since 0.1.0
 */
export class NetworkError extends Error {

	public readonly error: Error

	constructor(error: Error) {
		super(error.message)
		this.error = error
	}
}