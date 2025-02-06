# Bitcoin MCP Server

## Overview

The Bitcoin MCP Server is a Model Context Protocol (MCP) server designed to bridge Bitcoin's blockchain with other applications. It offers Bitcoin utilities such as key generation, address validation, transaction decoding, and blockchain queries in a standardized service format.

## Features

- **Key Generation**: Create new Bitcoin key pairs — including address, public key, and private key (WIF).
- **Address Validation**: Validate the correctness of a Bitcoin address.
- **Transaction Decoding**: Parse raw Bitcoin transaction hex to expose inputs, outputs, version, and locktime.
- **Blockchain Queries**:
  - **Latest Block**: Retrieve details about the most recent block (hash, height, timestamp, transaction count, etc.).
  - **Transaction Details**: Fetch detailed information about a transaction using its TXID.

## Project Structure

```text
bitcoin-mcp/
├── src/
│   ├── bitcoin-client.ts      # Bitcoin utility functions and API calls
│   ├── sse_server.ts          # Server implementation using SSE transport
│   ├── stdio_server.ts        # Server implementation using STDIO transport
│   ├── index.ts               # Main entry point
│   ├── cli.ts                 # CLI launcher
│   ├── bitcoin_mcp_types.ts   # Shared types and schemas for the Bitcoin MCP server
│   └── utils/
│       └── logger.ts          # Logger setup
├── .env.example               # Example environment configuration file
├── package.json
├── tsconfig.json
└── README.md
```

## Setup and Running

1. **Clone the Repository**:

   ```bash
   git clone <repository_url>
   cd bitcoin-mcp
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   - Copy the example file:
  
     ```bash
     cp .env.example .env
     ```

   - Adjust settings in `.env` as needed:

     ```bash
     LOG_LEVEL=info
     BITCOIN_NETWORK=mainnet
     # BLOCKSTREAM_API_BASE=https://blockstream.info/api  # Uncomment to override the default
     SERVER_MODE=stdio
     PORT=3000
     ```

4. **Build the Project**:

   ```bash
   npm run build
   ```

5. **Run the Server**:
   - **STDIO Mode** (default):
  
     ```bash
     npm start
     ```

     STDIO mode is designed for JSON-RPC communication via standard input/output.

   - **SSE Mode**:
     Set the environment variable `SERVER_MODE=sse` and run:

     ```bash
     SERVER_MODE=sse npm start
     ```

     Then connect via HTTP to `http://localhost:3000/sse`.

## Usage

> TODO

## Error Handling

The server employs custom error types to handle Bitcoin operations and blockchain queries. Detailed error messages are logged using Pino and included in client responses for easier debugging.

## Contributing

Contributions and feature requests are welcome! Feel free to submit pull requests or open issues on GitHub.

## License

This project is licensed under the MIT License.
