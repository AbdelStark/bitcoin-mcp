---
sidebar_position: 2
---

# Development Setup

This guide will help you set up Bitcoin MCP Server for local development.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Setting Up the Development Environment

1. **Clone the Repository**

```bash
git clone https://github.com/AbdelStark/bitcoin-mcp
cd bitcoin-mcp
```

2. **Install Dependencies**

```bash
npm install
```

3. **Build the Project**

```bash
npm run build
```

## Project Architecture

Bitcoin MCP Server uses a modular architecture based on the Model Context Protocol (MCP). The server is designed to support multiple transport mechanisms through a common base implementation.

### Core Components

```
src/
├── server/                 # Server implementations
│   ├── base.ts            # Base server with common functionality
│   ├── sse.ts             # Server-Sent Events implementation
│   ├── stdio.ts           # Standard I/O implementation
│   └── tools.ts           # Tool handlers (Bitcoin operations)
├── services/              # Core business logic
│   └── bitcoin.ts         # Bitcoin service implementation
├── blockstream/           # Blockstream API types
├── utils/                 # Utility functions
└── types.ts              # Type definitions
```

### Server Architecture

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

#### Base Server (`server/base.ts`)

The foundation of our server architecture, providing:

- Tool registration and handling
- Error management
- Common lifecycle methods
- Type-safe request/response handling

#### SSE Server (`server/sse.ts`)

Implements Server-Sent Events transport:

- Real-time updates
- Persistent connections
- Express.js endpoints
- Automatic reconnection

#### STDIO Server (`server/stdio.ts`)

Implements Standard I/O transport:

- Command-line interface
- Stream redirection
- Process isolation
- Clean logging separation

### Core Services

#### Bitcoin Service (`services/bitcoin.ts`)

Handles all Bitcoin-related operations:

- Key generation
- Address validation
- Transaction decoding
- Blockchain queries

## Development Workflow

### Running Different Server Modes

1. **STDIO Mode (Default)**

```bash
npm start
```

2. **SSE Mode**

```bash
SERVER_MODE=sse npm start
```

### Testing

Execute the test suite:

```bash
npm test
```

### Code Linting

Check code style and formatting:

```bash
npm run lint
```

Fix automatic linting issues:

```bash
npm run lint:fix
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add type definitions for all functions and variables
- Keep functions small and focused
- Document with JSDoc comments

### Adding New Features

1. **New Tool Implementation**

   - Add tool handler in `server/tools.ts`
   - Register tool in `server/base.ts`
   - Implement business logic in `services/bitcoin.ts`
   - Add necessary types in `types.ts`

2. **New Transport Implementation**
   - Create new class extending `BaseBitcoinServer`
   - Implement `start()` method
   - Handle transport-specific setup
   - Add appropriate error handling

### Testing

- Write tests for all new features
- Test both success and error cases
- Mock external services appropriately
- Maintain high test coverage

### Documentation

- Update documentation for new features
- Include JSDoc comments for public APIs
- Keep the README up to date
- Document breaking changes

## Debugging

### Debug Logging

Enable debug logging by setting the environment variable:

```bash
LOG_LEVEL=debug npm start
```

### Using VS Code Debugger

1. Create a launch configuration in `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/dist/index.js",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "LOG_LEVEL": "debug",
        "SERVER_MODE": "stdio"
      }
    }
  ]
}
```

2. Start debugging using F5 or the VS Code debug panel

## Contributing

Please see our [Contributing Guide](../contributing.md) for details on how to contribute to the project.
