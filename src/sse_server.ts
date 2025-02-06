import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
  ErrorCode,
  McpError,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { BitcoinClient } from "./bitcoin-client.js";
import {
  Config,
  ConfigSchema,
  ServerConfig,
  BitcoinServer,
  BitcoinError,
  ValidateAddressSchema,
  DecodeTxSchema,
  GetTransactionSchema,
} from "./bitcoin_mcp_types.js";
import logger from "./utils/logger.js";
import express from "express";

const SERVER_NAME = "bitcoin-mcp";
const SERVER_VERSION = "0.0.1";

/**
 * BitcoinSseServer implements a Model Context Protocol server for Bitcoin
 * It provides tools for interacting with the Bitcoin network, such as generating keys, validating addresses, and decoding transactions
 */
export class BitcoinSseServer implements BitcoinServer {
  private server: Server;
  private client: BitcoinClient;
  private transport?: SSEServerTransport;
  private app: express.Application;

  constructor(config: Config, serverConfig: ServerConfig) {
    // Validate configuration using Zod schema
    const result = ConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid configuration: ${result.error.message}`);
    }

    // Initialize Bitcoin client and MCP server
    this.client = new BitcoinClient(config);
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );
    this.app = express();

    // Initialize transport based on mode
    this.app.get("/sse", async (req, res) => {
      this.transport = new SSEServerTransport("/messages", res);
      await this.server.connect(this.transport);
    });

    this.app.post("/messages", async (req, res) => {
      if (!this.transport) {
        res.status(400).json({ error: "No active SSE connection" });
        return;
      }
      await this.transport.handlePostMessage(req, res);
    });

    this.app.listen(serverConfig.port, () => {
      logger.info(`SSE Server listening on port ${serverConfig.port}`);
    });

    this.setupHandlers();
  }

  /**
   * Sets up error and signal handlers for the server
   */
  private setupHandlers(): void {
    // Log MCP errors
    this.server.onerror = (error) => {
      logger.error({ error }, "MCP Server Error");
    };

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      await this.shutdown();
    });

    process.on("SIGTERM", async () => {
      await this.shutdown();
    });

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception", error);
      this.shutdown(1);
    });

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection", reason);
      this.shutdown(1);
    });

    this.setupToolHandlers();
  }

  public async shutdown(code = 0): Promise<never> {
    logger.info("Shutting down server...");
    try {
      if (this.transport) {
        await this.server.close();
      }
      logger.info("Server shutdown complete");
      process.exit(code);
    } catch (error) {
      logger.error({ error }, "Error during shutdown");
      process.exit(1);
    }
  }

  /**
   * Registers available tools with the MCP server
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "generate_key",
          description: "Generate a new Bitcoin key pair and address",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
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
          },
        } as Tool,
        {
          name: "decode_tx",
          description: "Decode a raw Bitcoin transaction",
          inputSchema: {
            type: "object",
            properties: {
              rawHex: {
                type: "string",
                description: "Raw transaction hex to decode",
              },
            },
            required: ["rawHex"],
          },
        } as Tool,
        {
          name: "get_latest_block",
          description: "Get the latest Bitcoin block info",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        } as Tool,
        {
          name: "get_transaction",
          description: "Get transaction details by TXID",
          inputSchema: {
            type: "object",
            properties: {
              txid: {
                type: "string",
                description: "Transaction ID (64 hex chars)",
              },
            },
            required: ["txid"],
          },
        } as Tool,
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      logger.debug({ name, args }, "Tool called");

      try {
        switch (name) {
          case "generate_key":
            return await this.handleGenerateKey();
          case "validate_address":
            return await this.handleValidateAddress(args);
          case "decode_tx":
            return await this.handleDecodeTx(args);
          case "get_latest_block":
            return await this.handleGetLatestBlock();
          case "get_transaction":
            return await this.handleGetTransaction(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`,
            );
        }
      } catch (error) {
        return this.handleError(error);
      }
    });
  }

  /**
   * Handles the generate_key tool execution
   */
  private async handleGenerateKey() {
    const key = await this.client.generateKey();
    return {
      content: [
        {
          type: "text",
          text: `Generated new Bitcoin key pair:\nAddress: ${key.address}\nPrivate Key (WIF): ${key.privateKey}\nPublic Key: ${key.publicKey}`,
        },
      ] as TextContent[],
    };
  }

  /**
   * Handles the validate_address tool execution
   * @param args - Tool arguments containing the address to validate
   */
  private async handleValidateAddress(args: unknown) {
    const result = ValidateAddressSchema.safeParse(args);
    if (!result.success) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${result.error.message}`,
      );
    }

    const isValid = this.client.validateAddress(result.data.address);
    return {
      content: [
        {
          type: "text",
          text: isValid
            ? `Address ${result.data.address} is valid`
            : `Address ${result.data.address} is invalid`,
        },
      ] as TextContent[],
    };
  }

  /**
   * Handles the decode_tx tool execution
   * @param args - Tool arguments containing the raw transaction hex to decode
   */
  private async handleDecodeTx(args: unknown) {
    const result = DecodeTxSchema.safeParse(args);
    if (!result.success) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${result.error.message}`,
      );
    }

    const tx = this.client.decodeTx(result.data.rawHex);
    return {
      content: [
        {
          type: "text",
          text: `Decoded transaction:\nTXID: ${tx.txid}\nVersion: ${
            tx.version
          }\nInputs: ${tx.inputs.length}\nOutputs: ${
            tx.outputs.length
          }\nLocktime: ${tx.locktime}`,
        },
      ] as TextContent[],
    };
  }

  /**
   * Handles the get_latest_block tool execution
   */
  private async handleGetLatestBlock() {
    const block = await this.client.getLatestBlock();
    return {
      content: [
        {
          type: "text",
          text: `Latest block:\nHash: ${block.hash}\nHeight: ${block.height}\nTimestamp: ${block.timestamp}\nTransactions: ${block.txCount}`,
        },
      ] as TextContent[],
    };
  }

  /**
   * Handles the get_transaction tool execution
   * @param args - Tool arguments containing the transaction ID
   */
  private async handleGetTransaction(args: unknown) {
    const result = GetTransactionSchema.safeParse(args);
    if (!result.success) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${result.error.message}`,
      );
    }

    const tx = await this.client.getTransaction(result.data.txid);
    return {
      content: [
        {
          type: "text",
          text: `Transaction details:\nTXID: ${tx.txid}\nStatus: ${
            tx.status.confirmed ? "Confirmed" : "Unconfirmed"
          }\nBlock Height: ${
            tx.status.blockHeight || "Pending"
          }\nFee: ${tx.fee} sats`,
        },
      ] as TextContent[],
    };
  }

  /**
   * Handles errors during tool execution
   * @param error - The error to handle
   */
  private handleError(error: unknown) {
    if (error instanceof McpError) {
      throw error;
    }

    if (error instanceof BitcoinError) {
      return {
        content: [
          {
            type: "text",
            text: `Bitcoin error: ${error.message}`,
            isError: true,
          },
        ] as TextContent[],
      };
    }

    logger.error({ error }, "Unexpected error");
    throw new McpError(ErrorCode.InternalError, "An unexpected error occurred");
  }

  /**
   * Starts the MCP server
   */
  async start(): Promise<void> {
    logger.info({ mode: "sse" }, "Bitcoin MCP server running");
  }
}
