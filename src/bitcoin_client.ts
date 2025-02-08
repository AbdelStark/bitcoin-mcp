// Bitcoin client implementation

import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory, ECPairAPI } from "ecpair";
import fetch from "node-fetch";
import {
  Config,
  GeneratedKey,
  DecodedTx,
  BlockInfo,
  TransactionInfo,
} from "./bitcoin_mcp_types.js";
import logger from "./utils/logger.js";
import { BitcoinError, BitcoinErrorCode } from "./bitcoin_mcp_types.js";
import { randomBytes } from "crypto";

import * as tinysecp from "tiny-secp256k1";

const ECPair: ECPairAPI = ECPairFactory(tinysecp);
const rng = (size: number) => randomBytes(size);

export class BitcoinClient {
  private network: bitcoin.networks.Network;
  private apiBase: string;

  constructor(config: Config) {
    this.network =
      config.network === "testnet"
        ? bitcoin.networks.testnet
        : bitcoin.networks.bitcoin;
    this.apiBase = config.blockstreamApiBase;
  }

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
        BitcoinErrorCode.KEY_GENERATION_ERROR,
      );
    }
  }

  validateAddress(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(address, this.network);
      return true;
    } catch {
      return false;
    }
  }

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
        BitcoinErrorCode.DECODE_ERROR,
      );
    }
  }

  private tryGetAddress(script: Buffer): string | undefined {
    try {
      return bitcoin.address.fromOutputScript(script, this.network);
    } catch {
      return undefined;
    }
  }

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
        BitcoinErrorCode.BLOCKCHAIN_ERROR,
      );
    }
  }

  async getTransaction(txid: string): Promise<TransactionInfo> {
    try {
      const res = await fetch(`${this.apiBase}/tx/${txid}`);
      if (!res.ok) {
        throw new Error("Transaction not found");
      }
      const tx = (await res.json()) as BlockstreamTx;

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
        inputs: tx.vin.map((input) => ({
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
        outputs: tx.vout.map((output) => ({
          value: output.value,
          scriptPubKey: output.scriptpubkey,
          address: output.scriptpubkey_address,
        })),
      };
    } catch (error) {
      logger.error({ error, txid }, "Failed to fetch transaction");
      throw new BitcoinError(
        "Failed to fetch transaction",
        BitcoinErrorCode.BLOCKCHAIN_ERROR,
      );
    }
  }
}
