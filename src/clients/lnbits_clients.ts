import fetch from "node-fetch";
import bolt11 from "bolt11-decoder";
import {
  DecodedInvoice,
  HumanFriendlyInvoice,
  WalletInfo,
  PaymentResponse,
} from "../types";

class LNBitsClient {
  private baseUrl: string;
  private adminKey: string;
  private readKey: string;

  constructor(baseUrl: string, adminKey: string, readKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash if present
    this.adminKey = adminKey;
    this.readKey = readKey;
  }

  async getWalletInfo(): Promise<WalletInfo> {
    const response = await fetch(`${this.baseUrl}/api/v1/wallet`, {
      headers: {
        "X-Api-Key": this.readKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get wallet info: ${response.statusText}`);
    }

    const data = (await response.json()) as WalletInfo;
    return data;
  }

  async sendPayment(bolt11: string): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/payments`, {
      method: "POST",
      headers: {
        "X-Api-Key": this.adminKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        out: true,
        bolt11,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send payment: ${errorText}`);
    }

    const data = (await response.json()) as PaymentResponse;
    return data;
  }

  humanFriendlyInvoice(decoded: DecodedInvoice): HumanFriendlyInvoice {
    const network = decoded.prefix.startsWith("lnbc") ? "mainnet" : "testnet";
    const descriptionTag = decoded.tags.find(
      (t) => t.tagName === "description"
    );
    const description = descriptionTag
      ? String(descriptionTag.data)
      : "No description provided";
    return {
      network: network,
      amount: decoded.satoshis,
      description: description,
      expiryDate: new Date(decoded.timestamp * 1000).toLocaleString(),
      status: "VALID",
    };
  }

  toHumanFriendlyInvoice(bolt11Invoice: string): HumanFriendlyInvoice {
    const decoded = bolt11.decode(bolt11Invoice) as DecodedInvoice;
    return this.humanFriendlyInvoice(decoded);
  }

  displayInvoiceDetails(bolt11Invoice: string): void {
    try {
      const decoded = bolt11.decode(bolt11Invoice) as DecodedInvoice;

      console.log("\n=== Invoice Details ===");
      console.log(
        `Network: ${bolt11Invoice.startsWith("lnbc") ? "mainnet" : "testnet"}`
      );
      console.log(`Amount: ${decoded.satoshis} satoshis`);
      console.log(
        `Timestamp: ${new Date(decoded.timestamp * 1000).toLocaleString()}`
      );

      // Find description tag
      const descriptionTag = decoded.tags.find(
        (t) => t.tagName === "description"
      );
      const description = descriptionTag
        ? String(descriptionTag.data)
        : "No description provided";
      console.log(`Description: ${description}`);

      // Find payment hash
      const paymentHashTag = decoded.tags.find(
        (t) => t.tagName === "payment_hash"
      );
      console.log(
        "Payment Hash:",
        paymentHashTag ? String(paymentHashTag.data) : "Not found"
      );

      // Find expiry
      const expiryTag = decoded.tags.find((t) => t.tagName === "expire_time");
      const expirySeconds = expiryTag ? Number(expiryTag.data) : 3600; // default 1 hour
      console.log(`Expiry: ${expirySeconds} seconds`);

      // Calculate expiry time
      const expiryDate = new Date((decoded.timestamp + expirySeconds) * 1000);
      const now = new Date();
      const isExpired = expiryDate < now;

      console.log("\nExpiry Status:");
      console.log(`Expires at: ${expiryDate.toLocaleString()}`);
      console.log(`Status: ${isExpired ? "EXPIRED" : "VALID"}`);
      if (!isExpired) {
        const timeLeft = Math.floor(
          (expiryDate.getTime() - now.getTime()) / 1000
        );
        console.log(`Time remaining: ${timeLeft} seconds`);
      }

      // Route hints if any
      const routeHints = decoded.tags.filter(
        (t) => t.tagName === "routing_info"
      );
      if (routeHints.length > 0) {
        console.log("\nRoute Hints Available:", routeHints.length);
      }

      console.log("===================\n");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to decode invoice:", error.message);
      } else {
        console.error("Unknown error while decoding invoice:", error);
      }
      process.exit(1);
    }
  }
}

export { LNBitsClient };
