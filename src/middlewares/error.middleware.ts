import { ErrorRequestHandler } from 'express'

type AnyObject = Record<string, unknown>

interface ApiError extends Error {
    status?: number
    statusCode?: number
    errors?: AnyObject | AnyObject[]
    code?: string
    // joi style
    details?: AnyObject[]
    isJoi?: boolean
}

/**
 * Centralized Express error handler middleware.
 * - Normalizes common error shapes (custom, HTTP, Joi).
 * - Logs server errors.
 * - Returns a consistent JSON payload.
 */
export const errorHandler: ErrorRequestHandler = (err: ApiError, req, res, next) => {
    // ensure we have an Error
    const error = err || new Error('Unknown error')

    // derive HTTP status
    const status = error.status || error.statusCode || 500

    // normalize validation errors (Joi / celebrate)
    let validation: AnyObject | AnyObject[] | undefined = undefined
    if (error.isJoi && Array.isArray(error.details)) {
        validation = error.details.map(d => ({
            message: (d as any).message,
            path: (d as any).path ?? (d as any).context?.key ?? undefined,
        }))
    } else if (error.errors) {
        validation = error.errors
    }

    // log
    if (status >= 500) {
        // server errors -> full error
        // eslint-disable-next-line no-console
        console.error(error)
    } else {
        // client errors -> brief
        // eslint-disable-next-line no-console
        console.warn(error.message)
    }

    const env = process.env.NODE_ENV || 'development'

    const payload: AnyObject = {
        success: false,
        message: error.message || (status === 500 ? 'Internal Server Error' : 'Error'),
        status,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
    }

    if (validation) payload.validation = validation
    if (error.code) payload.code = error.code
    if (env === 'development' && error.stack) payload.stack = error.stack

    res.status(status).json(payload)
    // explicitly don't call next() to end the response cycle
}

export default errorHandler