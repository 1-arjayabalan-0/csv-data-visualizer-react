
/**
 * Standard API Response DTO
 * @typedef {Object} ApiResponse
 * @property {string} message - Response message
 * @property {boolean} success - Indicates if the operation was successful
 * @property {any} data - Response data payload (null if error)
 * @property {string|null} error - Error message (null if success)
 * @property {number} statusCode - HTTP status code
 */

export class ResponseDto {
  /**
   * Create a success response
   * @param {string} message - Success message
   * @param {any} data - Response data
   * @param {number} statusCode - HTTP status code
   * @returns {ApiResponse} Formatted success response
   */
  static success(message, data = null, statusCode = 200) {
    return {
      message,
      success: true,
      data,
      error: null,
      statusCode
    };
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {string|null} error - Detailed error information
   * @param {number} statusCode - HTTP status code
   * @returns {ApiResponse} Formatted error response
   */
  static error(message, error = null, statusCode = 400) {
    return {
      message,
      success: false,
      data: null,
      error,
      statusCode
    };
  }
}