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

## Development Workflow

### Running in Development Mode

Start the server in development mode with auto-reloading:

```bash
npm run dev
```

### Running Tests

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

## Project Structure

### Key Directories and Files

```
bitcoin-mcp/
├── src/                      # Source code
│   ├── bitcoin-client.ts     # Bitcoin operations
│   ├── sse_server.ts        # SSE transport implementation
│   ├── stdio_server.ts      # STDIO transport implementation
│   ├── index.ts            # Main entry point
│   └── utils/              # Utility functions
├── tests/                   # Test files
├── docs/                    # Documentation
└── examples/                # Example usage
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add type definitions for all functions and variables
- Keep functions small and focused

### Testing

- Write tests for all new features
- Maintain existing test coverage
- Use meaningful test descriptions
- Test both success and error cases

### Documentation

- Update documentation for new features
- Include JSDoc comments for public APIs
- Keep the README up to date
- Document breaking changes

### Git Workflow

1. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:

```bash
git add .
git commit -m "feat: description of your changes"
```

3. Push your branch and create a pull request:

```bash
git push origin feature/your-feature-name
```

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
