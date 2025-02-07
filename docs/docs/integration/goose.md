---
sidebar_position: 2
---

# Goose Integration

A guide to integrating Bitcoin MCP Server with the Goose AI framework.

## Integration Methods

### STDIO (Local Extension)

1. **Add Extension**

```bash
goose configure
```

2. **Configure Extension**

- Name: "bitcoin"
- Command: `npx -y bitcoin-mcp@latest`
- Type: Command-Line Extension

### SSE (Remote Extension)

1. **Start Server in SSE Mode**

```bash
SERVER_MODE=sse npm start
```

2. **Configure in Goose**

- Add as Remote Extension
- URL: `http://localhost:3000`

## Usage Examples

### Basic Commands

```
goose session --with-extension "bitcoin"
```

### Example Queries

- Get latest block
- Validate addresses
- Decode transactions

## Troubleshooting

### Common Issues

1. Extension not found
2. Communication errors
3. Configuration problems

### Solutions

1. Verify installation
2. Check server logs
3. Validate configuration
