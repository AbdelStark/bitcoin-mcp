/**
 * 🎯 Base Bitcoin MCP Server
 * ========================
 *
 * The foundation of our Bitcoin MCP server architecture, providing a robust
 * base for both SSE and STDIO implementations. This abstract class handles
 * all the core functionality while letting specific implementations define
 * their transport mechanisms.
 *
 * Architecture Overview:
 *
 *     ┌─────────────────┐
 *     │  BaseBitcoinServer  │
 *     └─────────┬───────┘
 *               │
 *        ┌──────┴──────┐
 *        │             │
 *   ┌────▼───┐    ┌────▼───┐
 *   │  SSE   │    │ STDIO  │
 *   └────────┘    └────────┘
 *
 * Features:
 * 🔧 Tool Registration & Handling
 * 🚦 Error Management
 * 🔄 Lifecycle Control
 * 🛡️ Type Safety
 *
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
  ErrorCode,
  McpError,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { BitcoinService } from "../services/bitcoin.js";
import { Config, ConfigSchema, BitcoinServer } from "../types.js";
import logger from "../utils/logger.js";
import {
  handleGenerateKey,
  handleValidateAddress,
  handleDecodeTx,
  handleGetLatestBlock,
  handleGetTransaction,
  handleDecodeInvoice,
  handlePayInvoice,
} from "./tools.js";
const SERVER_NAME = "bitcoin-mcp";
const SERVER_VERSION = "0.0.1";

export abstract class BaseBitcoinServer implements BitcoinServer {
  protected server: Server;
  protected bitcoinService: BitcoinService;

  /**
   * Creates a new MCP server instance
   *
   * @param config - Server configuration including network and API settings
   * @throws Error if configuration is invalid
   */
  constructor(config: Config) {
    const result = ConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid configuration: ${result.error.message}`);
    }
    this.bitcoinService = new BitcoinService(config);
    this.server = new Server(
      { name: SERVER_NAME, version: SERVER_VERSION },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  /**
   * 🎮 Setup Server Event Handlers
   * ===========================
   * Configures error handling and graceful shutdown
   * for the server instance
   */
  protected setupHandlers(): void {
    this.server.onerror = (error: unknown) => {
      logger.error({ error }, "MCP Server Error");
    };
    process.on("SIGINT", async () => {
      await this.shutdown();
    });
    process.on("SIGTERM", async () => {
      await this.shutdown();
    });
    process.on("uncaughtException", (error: unknown) => {
      logger.error("Uncaught Exception", error);
      this.shutdown(1);
    });
    process.on("unhandledRejection", (reason: unknown) => {
      logger.error("Unhandled Rejection", reason);
      this.shutdown(1);
    });
    this.setupToolHandlers();
  }

  /**
   * 🛠️ Register Available Tools
   * ========================
   * Sets up handlers for all supported Bitcoin operations:
   * - Key Generation
   * - Address Validation
   * - Transaction Decoding
   * - Blockchain Queries
   */
  protected setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "generate_key",
          description: "Generate a new Bitcoin key pair and address",
          inputSchema: { type: "object", properties: {}, required: [] },
        } as Tool,
        {
          name: "validate_address",
          description: "Validate a Bitcoin address",
          inputSchema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                description: "The Bitcoin address to validate",
              },
            },
            required: ["address"],
          } as any,
        } as Tool,
        {
          name: "decode_tx",
          description: "Decode a Bitcoin transaction",
          inputSchema: {
            type: "object",
            properties: {
              rawHex: { type: "string", description: "Transaction hex" },
            },
            required: ["rawHex"],
          },
        } as Tool,
        {
          name: "get_latest_block",
          description: "Get the latest block",
          inputSchema: { type: "object", properties: {} },
        } as Tool,
        {
          name: "get_transaction",
          description: "Get transaction details",
          inputSchema: {
            type: "object",
            properties: {
              txid: { type: "string", description: "Transaction ID" },
            },
            required: ["txid"],
          },
        } as Tool,
        {
          name: "decode_invoice",
          description: "Decode a Lightning invoice",
          inputSchema: {
            type: "object",
            properties: {
              invoice: {
                type: "string",
                description: "BOLT11 Lightning invoice",
              },
            },
            required: ["invoice"],
          },
        } as Tool,
        {
          name: "pay_invoice",
          description: "Pay a Lightning invoice",
          inputSchema: {
            type: "object",
            properties: {
              invoice: {
                type: "string",
                description: "BOLT11 Lightning invoice",
              },
            },
            required: ["invoice"],
          },
        } as Tool,
      ],
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: any) => {
        try {
          const { name, arguments: args } = request.params;
          logger.debug({ name, args }, "Tool called");
          switch (name) {
            case "generate_key": {
              return handleGenerateKey(this.bitcoinService);
            }
            case "validate_address": {
              return handleValidateAddress(this.bitcoinService, args);
            }
            case "decode_tx": {
              return handleDecodeTx(this.bitcoinService, args);
            }
            case "get_latest_block": {
              return handleGetLatestBlock(this.bitcoinService);
            }
            case "get_transaction": {
              return handleGetTransaction(this.bitcoinService, args);
            }
            case "decode_invoice": {
              return handleDecodeInvoice(this.bitcoinService, args);
            }
            case "pay_invoice": {
              return handlePayInvoice(this.bitcoinService, args);
            }
            default:
              throw new McpError(ErrorCode.MethodNotFound, "Tool not found");
          }
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  /**
   * 📝 Format Response for MCP
   * =======================
   * Converts any response data into the MCP text content format
   */
  protected formatResponse(data: unknown): { content: TextContent[] } {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  /**
   * ⚠️ Handle Errors
   * ==============
   * Formats errors into user-friendly MCP responses
   */
  protected handleError(error: unknown): { content: TextContent[] } {
    logger.error({ error }, "Error handling tool call");
    return this.formatResponse({ error: "An error occurred" });
  }

  /**
   * 🔄 Graceful Shutdown
   * =================
   * Cleanly shuts down the server and exits
   */
  public async shutdown(code = 0): Promise<never> {
    logger.info("Shutting down server...");
    await this.server.close();
    logger.info("Server shutdown complete");
    process.exit(code);
  }

  /**
   * 🚀 Start Server
   * ============
   * Abstract method to be implemented by specific server types
   * to handle their unique startup requirements
   */
  public abstract start(): Promise<void>;
}
