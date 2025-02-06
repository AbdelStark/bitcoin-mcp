# Bitcoin MCP Server

## Overview

A Model Context Protocol (MCP) server that enables AI models to interact with Bitcoin, allowing them to generate keys, validate addresses, decode transactions, query the blockchain, and more.

## Features

- **Key Generation**: Create new Bitcoin key pairs — including address, public key, and private key (WIF).
- **Address Validation**: Validate the correctness of a Bitcoin address.
- **Transaction Decoding**: Parse a raw Bitcoin transaction and display its details in a human-readable format.
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
   git clone https://github.com/AbdelStark/bitcoin-mcp
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

## Available Tools

Each of the following tools is made available via the MCP interface. The input schemas below describe the expected parameters.

### generate_key

**Description:**  
Generates a new Bitcoin key pair.

**Input Schema:**

```json
{}
```

**Output:**  
Returns an object containing:

- `address`: Bitcoin address.
- `privateKey`: Wallet Import Format (WIF) private key.
- `publicKey`: Public key in hexadecimal format.

---

### validate_address

**Description:**  
Validates the correctness of a Bitcoin address.

**Input Schema:**

```json
{
  "address": "string"
}
```

**Example Input:**

```json
{
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}
```

**Output:**  
Returns a confirmation message informing whether the address is valid or invalid.

---

### decode_tx

**Description:**  
Decodes a raw Bitcoin transaction and displays its details.

**Input Schema:**

```json
{
  "rawHex": "string"
}
```

**Example Input:**

```json
{
  "rawHex": "0200000001abcd..."
}
```

**Output:**  
Returns transaction details including:

- `txid`
- `version`
- Count of `inputs` and `outputs`
- `locktime`

---

### get_latest_block

**Description:**  
Retrieves the latest Bitcoin block information.

**Input Schema:**

```json
{}
```

**Output:**  
Returns details including:

- `hash` (block hash)
- `height`
- `timestamp`
- `txCount` (number of transactions)
- `size`
- `weight`

---

### get_transaction

**Description:**  
Fetches detailed information about a specific transaction using its TXID.

**Input Schema:**

```json
{
  "txid": "string"
}
```

**Example Input:**

```json
{
  "txid": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
}
```

**Output:**  
Returns transaction details including:

- `txid`
- `version`
- `locktime`
- `size`
- `weight`
- `fee`
- `status` (confirmation status, block height, etc.)
- Detailed `inputs` and `outputs` information

## Error Handling

The server employs custom error types to handle Bitcoin operations and blockchain queries. Detailed error messages are logged using Pino and included in client responses for easier debugging.

## Contributing

Contributions and feature requests are welcome! Feel free to submit pull requests or open issues on GitHub.

## License

This project is licensed under the MIT License.
