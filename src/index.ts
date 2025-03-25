export * from "./types.js";

import { config } from "dotenv";
import { BitcoinSseServer } from "./server/sse.js";
import { BitcoinStdioServer } from "./server/stdio.js";
import { Config, ServerConfig, ServerMode } from "./types.js";
import logger from "./utils/logger.js";

// Load environment variables
config();

/**
 * Validates environment variables and starts the Bitcoin MCP server
 */
export async function main() {
  // Get configuration from environment
  const network = (process.env.BITCOIN_NETWORK || "mainnet") as
    | "mainnet"
    | "testnet";
  const blockstreamApiBase =
    process.env.BLOCKSTREAM_API_BASE ||
    (network === "mainnet"
      ? "https://blockstream.info/api"
      : "https://blockstream.info/testnet/api");

  const lnbitsUrl = process.env.LNBITS_URL;
  const lnbitsAdminKey = process.env.LNBITS_ADMIN_KEY;
  const lnbitsReadKey = process.env.LNBITS_READ_KEY;

  const config: Config = {
    network,
    blockstreamApiBase,
    lnbitsUrl,
    lnbitsAdminKey,
    lnbitsReadKey,
  };

  const mode =
    (process.env.SERVER_MODE?.toLowerCase() as ServerMode) || ServerMode.STDIO;
  const serverConfig: ServerConfig = {
    mode,
    port: parseInt(process.env.PORT || "3000"),
  };

  // Validate required environment variables
  if (!config.network) {
    logger.error("NETWORK environment variable is required");
    process.exit(1);
  }

  try {
    const server =
      mode === ServerMode.SSE
        ? new BitcoinSseServer(config, serverConfig)
        : new BitcoinStdioServer(config);

    await server.start();
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
}

// Only run if this file is being executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error({ error }, "Unhandled error");
    process.exit(1);
  });
}
