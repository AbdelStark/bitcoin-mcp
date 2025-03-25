/**
 * 📦 Bitcoin Types
 * =================
 *
 * This module defines the core types used throughout the Bitcoin MCP server.
 * It includes types for configuration, key generation, transaction decoding,
 * block information, and error handling.
 *
 */

import { z } from "zod";

export const ConfigSchema = z.object({
  network: z.enum(["mainnet", "testnet"]).default("mainnet"),
  blockstreamApiBase: z.string().url().default("https://blockstream.info/api"),
  lnbitsUrl: z.string().url().optional(),
  lnbitsAdminKey: z.string().optional(),
  lnbitsReadKey: z.string().optional(),
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
    public readonly status = 500
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

export const PayInvoiceSchema = z.object({
  invoice: z.string().min(1, "Invoice cannot be empty"),
});

export type PayInvoiceArgs = z.infer<typeof PayInvoiceSchema>;

export interface PaidInvoice {
  invoice: string;
}

/**
 * Error codes for Nostr operations
 */
export enum LightningErrorCode {
  CONNECTION_ERROR = "connection_error",
  PAYMENT_ERROR = "payment_error",
  NOT_CONNECTED = "not_connected",
  DISCONNECT_ERROR = "disconnect_error",
}

export class LightningError extends Error {
  constructor(
    message: string,
    public readonly code: LightningErrorCode | string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "NostrError";
  }
}

export interface WalletInfo {
  id: string;
  name: string;
  balance: number;
}

export interface PaymentResponse {
  payment_hash: string;
}

export interface Tag {
  tagName: string;
  data: string | number | boolean | unknown;
}

export interface DecodedInvoice {
  paymentRequest: string;
  prefix: string;
  wordsTemp: string;
  complete: boolean;
  millisatoshis: string;
  satoshis: number;
  timestamp: number;
  timestampString: string;
  timeExpireDate: number;
  timeExpireDateString: string;
  tags: Tag[];
  merchantName?: string;
  description?: string;
}

export interface HumanFriendlyInvoice {
  network: string;
  amount: number;
  description: string;
  expiryDate: string;
  status: string;
}

export interface ProviderError extends Error {
  data?: unknown;
}
