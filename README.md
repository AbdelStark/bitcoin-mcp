# ₿itcoin MCP Server

<div align="center">

<a href="https://github.com/AbdelStark/bitcoin-mcp/actions/workflows/ci.yml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/AbdelStark/bitcoin-mcp/ci.yml?style=for-the-badge" height=30></a>
<a href="https://bitcoin.org/"> <img alt="Bitcoin" src="https://img.shields.io/badge/Bitcoin-000?style=for-the-badge&logo=bitcoin&logoColor=white" height=30></a>
<a href="https://modelcontextprotocol.com/"> <img alt="MCP" src="https://img.shields.io/badge/MCP-000?style=for-the-badge&logo=modelcontextprotocol&logoColor=white" height=30></a>

</div>

<div align="center">
  <h3>
    <a href="abdelstark.github.io/bitcoin-mcp/">
      Documentation
    </a>
    <span> | </span>
    <a href="https://abdelstark.github.io/bitcoin-mcp/docs/integration/claude-desktop">
      Try with Claude
    </a>
    <span> | </span>
    <a href="https://abdelstark.github.io/bitcoin-mcp/docs/integration/goose">
      Try with Goose
    </a>
  </h3>
</div>

<div align="center">
<a href="https://smithery.ai/server/@AbdelStark/bitcoin-mcp"><img alt="Smithery Badge" src="https://smithery.ai/badge/@AbdelStark/bitcoin-mcp"></a>
<a href="https://www.npmjs.com/package/bitcoin-mcp"><img alt="NPM Version" src="https://img.shields.io/npm/v/bitcoin-mcp"></a>
</div>

## Overview

A Model Context Protocol (MCP) server that enables AI models to interact with Bitcoin, allowing them to generate keys, validate addresses, decode transactions, query the blockchain, and more.

## 🎯 Architecture

Bitcoin MCP Server uses a modular architecture based on the Model Context Protocol (MCP). The server is designed to support multiple transport mechanisms through a common base implementation.

```
┌─────────────────────────┐
│     BaseBitcoinServer   │
├─────────────────────────┤
│ ✓ Tool Registration     │
│ ✓ Error Handling        │
│ ✓ Lifecycle Management  │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───────────┐ ┌──────────┐
│   SSE     │ │  STDIO   │
└───────────┘ └──────────┘
```

### Core Components

- **Base Server**: Common functionality for all server types
- **SSE Server**: Real-time updates via Server-Sent Events
- **STDIO Server**: Command-line interface via Standard I/O
- **Bitcoin Service**: Core Bitcoin operations and blockchain queries

## 🔧 Features

- **🔑 Key Generation**: Create new Bitcoin key pairs — including address, public key, and private key (WIF)
- **🔍 Address Validation**: Validate the correctness of a Bitcoin address
- **📜 Transaction Decoding**: Parse raw Bitcoin transactions into human-readable format
- **⛓️ Blockchain Queries**:
  - Latest block information (hash, height, timestamp, etc.)
  - Detailed transaction data (inputs, outputs, fees, etc.)

## 🚀 Quick Start

1. **Install the package**:
```bash
npm install bitcoin-mcp
```

2. **Choose your server mode**:

   **STDIO Mode** (Default):
   ```bash
   npm start
   ```

   **SSE Mode**:
   ```bash
   SERVER_MODE=sse npm start
   ```

## 🔌 Integration Options

### Claude Desktop

1. Install Claude Desktop
2. Configure MCP server in settings:
```json
{
  "mcpServers": {
    "bitcoin": {
      "url": "http://localhost:3000"
    }
  }
}
```

### Goose

1. **Local Extension (STDIO)**:
```bash
npm start
```

2. **Remote Extension (SSE)**:
```bash
SERVER_MODE=sse npm start
```

## 📦 Available Tools

| Tool               | Description                     |
| ------------------ | ------------------------------- |
| `generate_key`     | Generate a new Bitcoin key pair |
| `validate_address` | Validate a Bitcoin address      |
| `decode_tx`        | Decode a raw transaction        |
| `get_latest_block` | Get latest block information    |
| `get_transaction`  | Get transaction details         |

## 🛠️ Development

See our [Development Setup Guide](https://abdelstark.github.io/bitcoin-mcp/docs/getting-started/development-setup) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://abdelstark.github.io/bitcoin-mcp/docs/contributing) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
