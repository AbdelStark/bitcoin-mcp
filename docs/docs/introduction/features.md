---
sidebar_position: 2
---

# Features

Bitcoin MCP Server provides a comprehensive set of tools for AI models to interact with Bitcoin. Here's a detailed look at the available features:

## Key Generation

Generate new Bitcoin key pairs including:

- Bitcoin address
- Private key (WIF format)
- Public key (hex format)

## Address Validation

Validate Bitcoin addresses to ensure they are:

- Properly formatted
- Have valid checksums
- Compatible with the selected network (mainnet/testnet)

## Transaction Decoding

Parse raw Bitcoin transactions to extract:

- Transaction ID (TXID)
- Version
- Input and output counts
- Lock time
- Detailed input/output information

## Blockchain Queries

### Latest Block Information

Retrieve current blockchain state including:

- Block hash
- Block height
- Timestamp
- Transaction count
- Block size and weight

### Transaction Details

Get comprehensive transaction information:

- Transaction status
- Fee information
- Size and weight
- Detailed input/output data
- Confirmation status

## Multiple Transport Options

### STDIO Mode

- Default communication mode
- Perfect for direct integration with AI assistants
- Simple JSON-RPC interface

### SSE Mode

- Server-Sent Events transport
- Ideal for web-based integrations
- Supports remote connections

## Integration Support

Built-in support for popular AI platforms:

- Claude Desktop
- Goose AI Framework
- Compatible with any MCP-compliant system
