import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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
  BitcoinServer,
  BitcoinError,
  ValidateAddressSchema,
  DecodeTxSchema,
  GetTransactionSchema,
} from "./bitcoin_mcp_types.js";
import logger from "./utils/logger.js";

const SERVER_NAME = "bitcoin-mcp";
const SERVER_VERSION = "0.0.1";

export class BitcoinStdioServer implements BitcoinServer {
  private server: Server;
  private client: BitcoinClient;
  private originalStdout: NodeJS.WriteStream;

  constructor(config: Config) {
    const result = ConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid configuration: ${result.error.message}`);
    }

    // Save original stdout
    this.originalStdout = process.stdout;

    // Redirect stdout to stderr for non-JSON-RPC output
    const stdoutWrite = process.stdout.write.bind(process.stdout);
    const customWrite = function (
      str: string | Uint8Array,
      encodingOrCb?: BufferEncoding | ((err?: Error) => void),
      cb?: (err?: Error) => void,
    ): boolean {
      let encoding: BufferEncoding | undefined;
      let callback: ((err?: Error) => void) | undefined;
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

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.onerror = (error) => {
      logger.error({ error }, "MCP Server Error");
    };

    process.on("SIGINT", async () => {
      await this.shutdown();
    });

    process.on("SIGTERM", async () => {
      await this.shutdown();
    });

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

  async shutdown(code = 0): Promise<never> {
    logger.info("Shutting down server...");
    try {
      // Restore original stdout
      process.stdout.write = this.originalStdout.write.bind(
        this.originalStdout,
      );
      await this.server.close();
      logger.info("Server shutdown complete");
      process.exit(code);
    } catch (error) {
      logger.error({ error }, "Error during shutdown");
      process.exit(1);
    }
  }

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

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info({ mode: "stdio" }, "Bitcoin MCP server running");
  }
}
