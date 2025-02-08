---
sidebar_position: 1
---

# Claude Desktop Integration

A guide to integrating Bitcoin MCP Server with Claude Desktop.

## Prerequisites

- Claude Desktop installed
- Bitcoin MCP Server installed
- Basic understanding of MCP

## Configuration Steps

1. **Locate Configuration File**

   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add Server Configuration**

```json
{
  "mcpServers": {
    "bitcoin-mcp": {
      "command": "npx",
      "args": ["-y", "bitcoin-mcp@latest"]
    }
  }
}
```

3. **Restart Claude Desktop**

## Testing the Integration

1. Start a new conversation in Claude
2. Try basic commands:

```
Could you generate a new Bitcoin address for me?
```

3. Verify the response includes proper Bitcoin data

## Troubleshooting

### Common Issues

1. Server not starting
2. Configuration not loading
3. Communication errors

### Solutions

1. Check configuration file syntax
2. Verify server installation
3. Check Claude Desktop logs
