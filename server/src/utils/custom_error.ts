/**
 * Custom error class for handling errors with an associated HTTP status code.
 * Extends the built-in `Error` class.
 */
export class CustomError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number;
  /**
   * Creates a new `CustomError` instance. Extends the built-in `Error` class.
   * @param message - The error message.
   * @param statusCode - The HTTP status code to associate with the error.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
