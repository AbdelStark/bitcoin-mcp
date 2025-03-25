/**
 * 🛠️ Bitcoin MCP Tool Handlers
 * =========================
 *
 * A collection of specialized handlers for each Bitcoin operation
 * supported by the MCP server. These handlers ensure type safety,
 * input validation, and proper error handling for all operations.
 *
 * Available Tools:
 *
 * 🔑 Key Generation
 * ├─ Generate new Bitcoin keypairs
 * └─ Returns address, public & private keys
 *
 * 🔍 Address Validation
 * ├─ Verify Bitcoin addresses
 * └─ Supports both mainnet & testnet
 *
 * 📜 Transaction Decoding
 * ├─ Parse raw transactions
 * └─ Human-readable output
 *
 * ⛓️ Blockchain Queries
 * ├─ Latest block info
 * └─ Transaction details
 */

import {
  ErrorCode,
  McpError,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { BitcoinService } from "../services/bitcoin.js";
import {
  DecodeTxSchema,
  GetTransactionSchema,
  ValidateAddressSchema,
  PayInvoiceSchema,
} from "../types.js";

/**
 * 🔑 Generate Bitcoin Key Pair
 * =========================
 * Creates a new Bitcoin key pair with address
 *
 * Returns:
 * - Bitcoin address (P2PKH)
 * - Private key (WIF format)
 * - Public key (hex)
 *
 */
export async function handleGenerateKey(bitcoinService: BitcoinService) {
  const key = await bitcoinService.generateKey();
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
 * 🔍 Validate Bitcoin Address
 * =======================
 * Checks if a given string is a valid Bitcoin address
 *
 * @param bitcoinService - Bitcoin service instance
 * @param args - Object containing the address to validate
 * @throws {McpError} If address parameter is invalid
 */
export async function handleValidateAddress(
  bitcoinService: BitcoinService,
  args: unknown
) {
  const result = ValidateAddressSchema.safeParse(args);
  if (!result.success) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters: ${result.error.message}`
    );
  }

  const isValid = bitcoinService.validateAddress(result.data.address);
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
 * 📜 Decode Raw Transaction
 * =====================
 * Parses a raw transaction hex and returns human-readable information
 *
 * @param bitcoinService - Bitcoin service instance
 * @param args - Object containing the raw transaction hex
 * @throws {McpError} If transaction hex is invalid
 */
export async function handleDecodeTx(
  bitcoinService: BitcoinService,
  args: unknown
) {
  const result = DecodeTxSchema.safeParse(args);
  if (!result.success) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters: ${result.error.message}`
    );
  }

  const tx = bitcoinService.decodeTx(result.data.rawHex);
  return {
    content: [
      {
        type: "text",
        text: `Decoded transaction:\nTXID: ${tx.txid}\nVersion: ${tx.version}\nInputs: ${tx.inputs.length}\nOutputs: ${tx.outputs.length}\nLocktime: ${tx.locktime}`,
      },
    ] as TextContent[],
  };
}

/**
 * ⛓️ Get Latest Block
 * ================
 * Fetches information about the most recent block
 *
 * Returns:
 * - Block hash
 * - Height
 * - Timestamp
 * - Transaction count
 * - Size & weight
 */
export async function handleGetLatestBlock(bitcoinService: BitcoinService) {
  const block = await bitcoinService.getLatestBlock();
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
 * 🔍 Get Transaction Details
 * ======================
 * Fetches detailed information about a specific transaction
 *
 * @param bitcoinService - Bitcoin service instance
 * @param args - Object containing the transaction ID
 * @throws {McpError} If transaction ID is invalid
 */
export async function handleGetTransaction(
  bitcoinService: BitcoinService,
  args: unknown
) {
  const result = GetTransactionSchema.safeParse(args);
  if (!result.success) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters: ${result.error.message}`
    );
  }

  const tx = await bitcoinService.getTransaction(result.data.txid);
  return {
    content: [
      {
        type: "text",
        text: `Transaction details:\nTXID: ${tx.txid}\nStatus: ${
          tx.status.confirmed ? "Confirmed" : "Unconfirmed"
        }\nBlock Height: ${tx.status.blockHeight || "Pending"}\nFee: ${
          tx.fee
        } sats`,
      },
    ] as TextContent[],
  };
}

/**
 * ⚡ Decode Lightning Invoice
 * =======================
 * Decodes a BOLT11 invoice and returns human-readable information
 *
 * @param bitcoinService - Bitcoin service instance
 * @param args - Object containing the BOLT11 invoice to decode
 * @throws {McpError} If invoice is invalid or LNBits is not configured
 */
export async function handleDecodeInvoice(
  bitcoinService: BitcoinService,
  args: unknown
) {
  if (
    !args ||
    typeof args !== "object" ||
    !("invoice" in args) ||
    typeof args.invoice !== "string"
  ) {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid parameters: invoice is required"
    );
  }

  try {
    const invoice = bitcoinService.decodeInvoice(args.invoice);
    return {
      content: [
        {
          type: "text",
          text: `Decoded Lightning invoice:\nNetwork: ${invoice.network}\nAmount: ${invoice.amount} satoshis\nDescription: ${invoice.description}\nExpiry: ${invoice.expiryDate}\nStatus: ${invoice.status}`,
        },
      ] as TextContent[],
    };
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      error.message || "Failed to decode invoice"
    );
  }
}

/**
 * ⚡ Pay Lightning Invoice
 * ===================
 * Pays a BOLT11 invoice using configured LNBits wallet
 *
 * @param bitcoinService - Bitcoin service instance
 * @param args - Object containing the BOLT11 invoice to pay
 * @throws {McpError} If payment fails or LNBits is not configured
 */
export async function handlePayInvoice(
  bitcoinService: BitcoinService,
  args: unknown
) {
  const result = PayInvoiceSchema.safeParse(args);
  if (!result.success) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters: ${result.error.message}`
    );
  }

  try {
    const paymentHash = await bitcoinService.payInvoice(result.data.invoice);
    return {
      content: [
        {
          type: "text",
          text: `Payment successful!\nPayment hash: ${paymentHash}`,
        },
      ] as TextContent[],
    };
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      error.message || "Failed to pay invoice"
    );
  }
}
