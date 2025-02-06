import pino from "pino";

/**
 * Configure pino logger with pretty printing in development
 */
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      // Write to stderr to keep stdout clean for JSON-RPC
      destination: 2,
    },
  },
});

// Export the logger instance
export default logger;
