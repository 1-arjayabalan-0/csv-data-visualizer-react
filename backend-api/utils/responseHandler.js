import { ResponseDto } from '../dtos/response.dto.js';

/**
 * Send a success response
 * @param {Express.Response} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Express.Response} Express response
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json(ResponseDto.success(message, data, statusCode));
};

/**
 * Send an error response
 * @param {Express.Response} res - Express response object
 * @param {string} message - Error message
 * @param {string|null} error - Detailed error information
 * @param {number} statusCode - HTTP status code
 * @returns {Express.Response} Express response
 */
export const errorResponse = (res, message, error = null, statusCode = 400) => {
    return res.status(statusCode).json(ResponseDto.error(message, error, statusCode));
};
