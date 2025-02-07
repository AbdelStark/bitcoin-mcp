---
sidebar_position: 1
---

# Overview

Bitcoin MCP Server is a Model Context Protocol (MCP) server that enables AI models to interact with Bitcoin. It provides a set of tools for generating keys, validating addresses, decoding transactions, querying the blockchain, and more.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI models to interact with external tools and services. By implementing MCP, this server allows AI assistants like Claude and Goose to perform Bitcoin-related operations directly.

## Key Features

- Generate Bitcoin key pairs
- Validate Bitcoin addresses
- Decode raw transactions
- Query latest block information
- Retrieve transaction details

## Project Structure

```text
bitcoin-mcp/
├── src/
│   ├── bitcoin-client.ts      # Bitcoin utility functions and API calls
│   ├── sse_server.ts         # Server implementation using SSE transport
│   ├── stdio_server.ts       # Server implementation using STDIO transport
│   ├── index.ts             # Main entry point
│   ├── cli.ts               # CLI launcher
│   ├── bitcoin_mcp_types.ts # Shared types and schemas
│   └── utils/
│       └── logger.ts        # Logger setup
├── .env.example             # Example environment configuration
├── package.json
├── tsconfig.json
└── README.md
```
