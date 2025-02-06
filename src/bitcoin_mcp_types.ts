// Type definitions

import { z } from "zod";

export const ConfigSchema = z.object({
  network: z.enum(["mainnet", "testnet"]).default("mainnet"),
  blockstreamApiBase: z.string().url().default("https://blockstream.info/api"),
});

export type Config = z.infer<typeof ConfigSchema>;

export interface GeneratedKey {
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface DecodedTx {
  txid: string;
  version: number;
  inputs: {
    txid: string;
    vout: number;
    sequence: number;
  }[];
  outputs: {
    value: number;
    scriptPubKey: string;
    address?: string;
  }[];
  locktime: number;
}

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number;
  txCount: number;
  size: number;
  weight: number;
}

export interface TransactionInfo {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    blockHeight?: number;
    blockHash?: string;
    blockTime?: number;
  };
  inputs: {
    txid: string;
    vout: number;
    sequence: number;
    prevout?: {
      value: number;
      scriptPubKey: string;
      address?: string;
    };
  }[];
  outputs: {
    value: number;
    scriptPubKey: string;
    address?: string;
  }[];
}

export enum BitcoinErrorCode {
  KEY_GENERATION_ERROR = "key_generation_error",
  DECODE_ERROR = "decode_error",
  BLOCKCHAIN_ERROR = "blockchain_error",
  VALIDATION_ERROR = "validation_error",
}

export class BitcoinError extends Error {
  constructor(
    message: string,
    public readonly code: BitcoinErrorCode,
    public readonly status = 500,
  ) {
    super(message);
    this.name = "BitcoinError";
  }
}

export enum ServerMode {
  STDIO = "stdio",
  SSE = "sse",
}

export interface ServerConfig {
  mode: ServerMode;
  port?: number;
}

export interface BitcoinServer {
  start(): Promise<void>;
  shutdown(code?: number): Promise<never>;
}

// Tool schemas
export const ValidateAddressSchema = z.object({
  address: z.string().min(1, "Address is required"),
});

export const DecodeTxSchema = z.object({
  rawHex: z.string().min(1, "Raw transaction hex is required"),
});

export const GetTransactionSchema = z.object({
  txid: z.string().length(64, "Invalid transaction ID"),
});
