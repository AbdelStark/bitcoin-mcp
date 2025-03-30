/**
 * 🖥️ STDIO Bitcoin MCP Server
 * ========================
 *
 * A specialized implementation of the Bitcoin MCP server that uses
 * standard input/output streams for communication. This server type
 * is perfect for command-line tools and local integrations.
 *
 * Data Flow:
 *
 *    Client        STDIO Server
 *      │              │
 *      │   stdin      │
 *      │─────────────>│
 *      │   Process    │
 *      │   Request    │
 *      │              │
 *      │   stdout     │
 *      │<─────────────│
 *
 * Features:
 * 📥 MCP tools over STDIO
 * 🔄 Stream Redirection
 * 🛡️ Process Isolation
 * 📝 Clean Logging
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Config } from "../types.js";
import logger from "../utils/logger.js";
import { BaseBitcoinServer } from "./base.js";

export class BitcoinStdioServer extends BaseBitcoinServer {
  private originalStdout: NodeJS.WriteStream;

  /**
   * Creates a new STDIO-based Bitcoin MCP server
   *
   * @param config - Bitcoin network configuration
   */
  constructor(config: Config) {
    super(config);
    this.originalStdout = process.stdout;
    this.setupStdioRedirect();
  }

  /**
   * 🔄 Configure STDIO Redirection
   * ==========================
   * Sets up stdout redirection to ensure clean separation of
   * JSON-RPC messages and other output (logs, errors, etc.)
   */
  private setupStdioRedirect(): void {
    const stdoutWrite = process.stdout.write.bind(process.stdout);
    const customWrite = function (
      str: string | Uint8Array,
      encodingOrCb?: BufferEncoding | ((err?: Error) => void),
      cb?: (err?: Error) => void,
    ): boolean {
      let encoding: BufferEncoding | undefined;
      let callback: ((err?: Error) => void) | undefined;

      // Handle flexible parameter types
      if (typeof encodingOrCb === "function") {
        callback = encodingOrCb;
        encoding = undefined;
      } else {
        encoding = encodingOrCb;
        callback = cb;
      }

      // Only allow JSON-RPC messages through stdout
      if (typeof str === "string" && str.includes('"jsonrpc":"2.0"')) {
        return stdoutWrite(str, encoding, callback);
      }
      // Redirect everything else to stderr
      return process.stderr.write(str, encoding, callback);
    };
    process.stdout.write = customWrite as typeof process.stdout.write;
  }

  /**
   * 🚀 Start STDIO Server
   * =================
   * Initializes the STDIO transport and begins
   * listening for JSON-RPC messages
   */
  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info({ mode: "stdio" }, "Bitcoin MCP server running");
  }

  /**
   * 🔄 Graceful Shutdown
   * =================
   * Restores original stdout and cleanly shuts down
   */
  public async shutdown(code = 0): Promise<never> {
    logger.info("Shutting down STDIO server...");
    try {
      // Restore original stdout
      process.stdout.write = this.originalStdout.write.bind(
        this.originalStdout,
      );
      await this.server.close();
      logger.info("STDIO Server shutdown complete");
      process.exit(code);
    } catch (error) {
      logger.error({ error }, "Error during STDIO server shutdown");
      process.exit(1);
    }
  }
}
