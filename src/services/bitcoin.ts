/**
 * 🏦 Bitcoin Service: The main service for interacting with the Bitcoin network and serving utility features.
 * =====================================================
 *
 * This service provides a clean interface to interact with Bitcoin's network. It handles everything from key generation
 * to transaction decoding, making Bitcoin operations accessible and safe.
 *
 * Features:
 * 🔑 Key Generation
 * 🔍 Address Validation
 * 📜 Transaction Decoding
 * ⛓️ Blockchain Queries
 *
 */

import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairAPI } from "ecpair";
import fetch from "node-fetch";
import { randomBytes } from "crypto";
import * as tinysecp from "tiny-secp256k1";
import {
  Config,
  GeneratedKey,
  DecodedTx,
  BlockInfo,
  TransactionInfo,
  BitcoinError,
  BitcoinErrorCode,
  HumanFriendlyInvoice,
  LightningError,
  LightningErrorCode,
} from "../types.js";
import { LNBitsClient } from "../clients/lnbits_clients.js";
import logger from "../utils/logger.js";

const ECPair: ECPairAPI = ECPairFactory(tinysecp);
const rng = (size: number) => randomBytes(size);

export class BitcoinService {
  private network: bitcoin.networks.Network;
  private apiBase: string;
  private lnbitsClient?: LNBitsClient;

  /**
   * Creates a new Bitcoin service instance
   *
   * @param config - Configuration including network (mainnet/testnet) and API base URL
   */
  constructor(config: Config) {
    this.network =
      config.network === "testnet"
        ? bitcoin.networks.testnet
        : bitcoin.networks.bitcoin;
    this.apiBase = config.blockstreamApiBase;

    // Initialize LNBits client only if all required config is present
    if (config.lnbitsUrl && config.lnbitsAdminKey && config.lnbitsReadKey) {
      this.lnbitsClient = new LNBitsClient(
        config.lnbitsUrl,
        config.lnbitsAdminKey,
        config.lnbitsReadKey
      );
      logger.info("LNBits client initialized");
    } else {
      logger.info("LNBits client not initialized (missing configuration)");
    }
  }

  /**
   * 🔑 Generate a New Bitcoin Key Pair
   * ================================
   * Creates a fresh Bitcoin key pair with:
   * - Private key (WIF format)
   * - Public key (hex)
   * - Bitcoin address (P2PKH)
   *
   * Security Note: Uses cryptographically secure random number generation
   */
  async generateKey(): Promise<GeneratedKey> {
    try {
      const keyPair = ECPair.makeRandom({ rng });
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: this.network,
      });

      if (!address) {
        throw new Error("Failed to generate address");
      }

      return {
        address,
        privateKey: keyPair.toWIF(),
        publicKey: keyPair.publicKey.toString("hex"),
      };
    } catch (error) {
      logger.error({ error }, "Failed to generate key");
      throw new BitcoinError(
        "Failed to generate key pair",
        BitcoinErrorCode.KEY_GENERATION_ERROR
      );
    }
  }

  /**
   * 🔍 Validate Bitcoin Address
   * =========================
   * Checks if a given string is a valid Bitcoin address
   * for the current network (mainnet/testnet)
   *
   * @param address - The Bitcoin address to validate
   * @returns true if valid, false otherwise
   */
  validateAddress(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(address, this.network);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 📜 Decode Raw Transaction
   * =======================
   * Parses a raw transaction hex and returns human-readable information
   *
   * Returns:
   * - Transaction ID
   * - Version
   * - Inputs (previous outputs being spent)
   * - Outputs (new outputs being created)
   * - Locktime
   *
   * @param rawHex - Raw transaction hex string
   */
  decodeTx(rawHex: string): DecodedTx {
    try {
      const tx = bitcoin.Transaction.fromHex(rawHex);

      return {
        txid: tx.getId(),
        version: tx.version,
        inputs: tx.ins.map((input) => ({
          txid: Buffer.from(input.hash).reverse().toString("hex"),
          vout: input.index,
          sequence: input.sequence,
        })),
        outputs: tx.outs.map((output) => ({
          value: output.value,
          scriptPubKey: output.script.toString("hex"),
          address: this.tryGetAddress(output.script),
        })),
        locktime: tx.locktime,
      };
    } catch (error) {
      logger.error({ error, rawHex }, "Failed to decode transaction");
      throw new BitcoinError(
        "Failed to decode transaction",
        BitcoinErrorCode.DECODE_ERROR
      );
    }
  }

  /**
   * ⛓️ Get Latest Block Information
   * ============================
   * Fetches information about the most recent block
   * from the Bitcoin network
   *
   * @returns Promise with block details
   */
  async getLatestBlock(): Promise<BlockInfo> {
    try {
      const hashRes = await fetch(`${this.apiBase}/blocks/tip/hash`);
      if (!hashRes.ok) {
        throw new Error("Failed to fetch latest block hash");
      }
      const hash = await hashRes.text();

      const blockRes = await fetch(`${this.apiBase}/block/${hash}`);
      if (!blockRes.ok) {
        throw new Error("Failed to fetch block data");
      }
      const block = (await blockRes.json()) as BlockstreamBlock;

      return {
        hash: block.id,
        height: block.height,
        timestamp: block.timestamp,
        txCount: block.tx_count,
        size: block.size,
        weight: block.weight,
      };
    } catch (error) {
      logger.error({ error }, "Failed to fetch latest block");
      throw new BitcoinError(
        "Failed to fetch latest block",
        BitcoinErrorCode.BLOCKCHAIN_ERROR
      );
    }
  }

  /**
   * 🔍 Get Transaction Details
   * =======================
   * Fetches detailed information about a specific transaction
   *
   * @param txid - Transaction ID to look up
   * @returns Promise with transaction details
   */
  async getTransaction(txid: string): Promise<TransactionInfo> {
    try {
      const response = await fetch(`${this.apiBase}/tx/${txid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tx = (await response.json()) as any;
      return {
        txid: tx.txid,
        version: tx.version,
        locktime: tx.locktime,
        size: tx.size,
        weight: tx.weight,
        fee: tx.fee,
        status: {
          confirmed: tx.status.confirmed,
          blockHeight: tx.status.block_height,
          blockHash: tx.status.block_hash,
          blockTime: tx.status.block_time,
        },
        inputs: tx.vin.map((input: any) => ({
          txid: input.txid,
          vout: input.vout,
          sequence: input.sequence,
          prevout: input.prevout
            ? {
                value: input.prevout.value,
                scriptPubKey: input.prevout.scriptpubkey,
                address: input.prevout.scriptpubkey_address,
              }
            : undefined,
        })),
        outputs: tx.vout.map((output: any) => ({
          value: output.value,
          scriptPubKey: output.scriptpubkey,
          address: output.scriptpubkey_address,
        })),
      };
    } catch (error) {
      logger.error({ error, txid }, "Failed to get transaction");
      throw new BitcoinError(
        "Failed to get transaction",
        BitcoinErrorCode.BLOCKCHAIN_ERROR
      );
    }
  }

  /**
   * Helper function to extract Bitcoin address from output script
   */
  private tryGetAddress(script: Buffer): string | undefined {
    try {
      return bitcoin.address.fromOutputScript(script, this.network);
    } catch {
      return undefined;
    }
  }

  /**
   * ⚡ Decode Lightning Invoice
   * =======================
   * Decodes a BOLT11 invoice and presents human-readable information
   *
   * @param bolt11 - BOLT11 format Lightning invoice
   * @throws {LightningError} If decoding fails or LNBits is not configured
   */
  decodeInvoice(bolt11: string): HumanFriendlyInvoice {
    if (!this.lnbitsClient) {
      throw new LightningError(
        "LNBits not configured. Please add lnbitsUrl, lnbitsAdminKey, and lnbitsReadKey to configuration.",
        LightningErrorCode.NOT_CONNECTED
      );
    }

    try {
      return this.lnbitsClient.toHumanFriendlyInvoice(bolt11);
    } catch (error) {
      logger.error({ error, bolt11 }, "Failed to decode invoice");
      throw new LightningError(
        "Failed to decode Lightning invoice",
        LightningErrorCode.PAYMENT_ERROR
      );
    }
  }

  /**
   * ⚡ Pay Lightning Invoice
   * ====================
   * Pays a BOLT11 invoice using LNBits
   *
   * @param bolt11 - BOLT11 format Lightning invoice
   * @returns Payment hash if successful
   * @throws {LightningError} If payment fails or LNBits is not configured
   */
  async payInvoice(bolt11: string): Promise<string> {
    if (!this.lnbitsClient) {
      throw new LightningError(
        "LNBits not configured. Please add lnbitsUrl, lnbitsAdminKey, and lnbitsReadKey to configuration.",
        LightningErrorCode.NOT_CONNECTED
      );
    }

    try {
      const response = await this.lnbitsClient.sendPayment(bolt11);
      return response.payment_hash;
    } catch (error) {
      logger.error({ error, bolt11 }, "Failed to pay invoice");
      throw new LightningError(
        "Failed to pay Lightning invoice",
        LightningErrorCode.PAYMENT_ERROR
      );
    }
  }
}
