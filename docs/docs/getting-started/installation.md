---
sidebar_position: 1
---

# Installation

Bitcoin MCP Server can be installed and run in multiple ways. Choose the method that best fits your needs.

## NPX (Recommended)

The simplest way to run Bitcoin MCP Server is using npx:

```bash
npx -y bitcoin-mcp@latest
```

This command will automatically download and run the latest version of the server.

## Global Installation

If you prefer to install the package globally:

```bash
npm install -g bitcoin-mcp
```

After installation, you can run the server using:

```bash
bitcoin-mcp
```

## Local Development Installation

For development or contributing to the project:

1. Clone the repository:

```bash
git clone https://github.com/AbdelStark/bitcoin-mcp
cd bitcoin-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Configure the following environment variables:

```env
LOG_LEVEL=info
BITCOIN_NETWORK=mainnet
SERVER_MODE=stdio
PORT=3000
```

### Environment Variables

| Variable        | Description                               | Default |
| --------------- | ----------------------------------------- | ------- |
| LOG_LEVEL       | Logging verbosity (debug/info/warn/error) | info    |
| BITCOIN_NETWORK | Bitcoin network (mainnet/testnet)         | mainnet |
| SERVER_MODE     | Server transport mode (stdio/sse)         | stdio   |
| PORT            | Port for SSE mode                         | 3000    |

## Verifying Installation

To verify your installation is working correctly:

1. Start the server in STDIO mode:

```bash
bitcoin-mcp
```

2. The server should start without errors and be ready to accept commands.

3. Test a basic command (in another terminal):

```bash
echo '{"jsonrpc":"2.0","method":"get_latest_block","params":{},"id":1}' | nc localhost 3000
```

You should receive a JSON response with the latest block information.
