import pino, {Logger} from 'pino';

/**
 * Technical Logger Configuration
 *
 * This file creates and exports a Pino logger instance named `TECHNICAL_LOGGER`.
 * - Uses `info` as the default log level.
 * - In production: outputs structured JSON logs for performance and integration with log aggregators.
 * - In development: uses `pino-pretty` transport for human-readable, colorized logs with timestamps.
 */

export const TECHNICAL_LOGGER: Logger<never, boolean> = pino({
    level: 'info',
    transport: process.env["NODE_ENV"] === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: {colorize: true, translateTime: 'HH:MM:ss.l'}
        },
});