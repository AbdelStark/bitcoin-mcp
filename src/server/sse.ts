/**
 * 🌊 SSE (Server-Sent Events) Bitcoin MCP Server
 * ==========================================
 *
 * A specialized implementation of the Bitcoin MCP server that uses
 * Server-Sent Events (SSE) for real-time communication. This server
 * type is ideal for web-based clients that need to maintain an open
 * connection for receiving updates.
 *
 * Connection Flow:
 *
 *    Client         SSE Server
 *      │     GET /sse    │
 *      │─────────────────>
 *      │    SSE Setup    │
 *      │<─────────────────
 *      │                 │
 *      │  POST /messages │
 *      │─────────────────>
 *      │     Events      │
 *      │<─────────────────
 *      │                 │
 *
 * Features:
 * 📡 Real-time Updates
 * 🔌 Persistent Connections
 * 🔄 Automatic Reconnection
 * 🛡️ Error Recovery
 */

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Config, ServerConfig } from "../types.js";
import logger from "../utils/logger.js";
import express from "express";
import { BaseBitcoinServer } from "./base.js";

/**
 * BitcoinSseServer implements a Model Context Protocol server for Bitcoin
 * It provides tools for interacting with the Bitcoin network, such as generating keys, validating addresses, and decoding transactions
 */
export class BitcoinSseServer extends BaseBitcoinServer {
  private transport?: SSEServerTransport;
  private app: express.Application;
  private port: number;

  /**
   * Creates a new SSE-based Bitcoin MCP server
   *
   * @param config - Bitcoin network configuration
   * @param serverConfig - SSE server settings including port
   */
  constructor(config: Config, serverConfig: ServerConfig) {
    super(config);
    this.port = serverConfig.port ?? 3000;
    this.app = express();
    this.setupExpressRoutes();
  }

  /**
   * 🛣️ Configure Express Routes
   * ========================
   * Sets up the SSE endpoint and message handling route
   */
  private setupExpressRoutes(): void {
    // SSE connection endpoint
    this.app.get("/sse", async (req, res) => {
      this.transport = new SSEServerTransport("/messages", res);
      await this.server.connect(this.transport);
    });

    // Message handling endpoint
    this.app.post("/messages", async (req, res) => {
      if (!this.transport) {
        res.status(400).json({ error: "No active SSE connection" });
        return;
      }
      await this.transport.handlePostMessage(req, res);
    });
  }

  /**
   * 🚀 Start SSE Server
   * ================
   * Begins listening for SSE connections and messages
   */
  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      logger.info(`SSE Server listening on port ${this.port}`);
    });
  }

  /**
   * 🔄 Graceful Shutdown
   * =================
   * Cleanly closes SSE connections and shuts down
   */
  public async shutdown(code = 0): Promise<never> {
    logger.info("Shutting down SSE server...");
    try {
      if (this.transport) {
        await this.server.close();
      }
      logger.info("SSE Server shutdown complete");
      process.exit(code);
    } catch (error) {
      logger.error({ error }, "Error during SSE server shutdown");
      process.exit(1);
    }
  }
}
