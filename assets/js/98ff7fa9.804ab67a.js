"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[49],{4648:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>l,metadata:()=>s,toc:()=>o});const s=JSON.parse('{"id":"getting-started/development-setup","title":"Development Setup","description":"This guide will help you set up Bitcoin MCP Server for local development.","source":"@site/docs/getting-started/development-setup.md","sourceDirName":"getting-started","slug":"/getting-started/development-setup","permalink":"/bitcoin-mcp/docs/getting-started/development-setup","draft":false,"unlisted":false,"editUrl":"https://github.com/AbdelStark/bitcoin-mcp/tree/main/docs/docs/getting-started/development-setup.md","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2},"sidebar":"tutorialSidebar","previous":{"title":"Installation","permalink":"/bitcoin-mcp/docs/getting-started/installation"},"next":{"title":"Claude Desktop Integration","permalink":"/bitcoin-mcp/docs/integration/claude-desktop"}}');var r=i(4848),t=i(8453);const l={sidebar_position:2},d="Development Setup",c={},o=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Setting Up the Development Environment",id:"setting-up-the-development-environment",level:2},{value:"Project Architecture",id:"project-architecture",level:2},{value:"Core Components",id:"core-components",level:3},{value:"Server Architecture",id:"server-architecture",level:3},{value:"Base Server (<code>server/base.ts</code>)",id:"base-server-serverbasets",level:4},{value:"SSE Server (<code>server/sse.ts</code>)",id:"sse-server-serverssets",level:4},{value:"STDIO Server (<code>server/stdio.ts</code>)",id:"stdio-server-serverstdiots",level:4},{value:"Core Services",id:"core-services",level:3},{value:"Bitcoin Service (<code>services/bitcoin.ts</code>)",id:"bitcoin-service-servicesbitcoints",level:4},{value:"Development Workflow",id:"development-workflow",level:2},{value:"Running Different Server Modes",id:"running-different-server-modes",level:3},{value:"Testing",id:"testing",level:3},{value:"Code Linting",id:"code-linting",level:3},{value:"Development Guidelines",id:"development-guidelines",level:2},{value:"Code Style",id:"code-style",level:3},{value:"Adding New Features",id:"adding-new-features",level:3},{value:"Testing",id:"testing-1",level:3},{value:"Documentation",id:"documentation",level:3},{value:"Debugging",id:"debugging",level:2},{value:"Debug Logging",id:"debug-logging",level:3},{value:"Using VS Code Debugger",id:"using-vs-code-debugger",level:3},{value:"Contributing",id:"contributing",level:2}];function a(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"development-setup",children:"Development Setup"})}),"\n",(0,r.jsx)(n.p,{children:"This guide will help you set up Bitcoin MCP Server for local development."}),"\n",(0,r.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Node.js (v16 or higher)"}),"\n",(0,r.jsx)(n.li,{children:"npm (v7 or higher)"}),"\n",(0,r.jsx)(n.li,{children:"Git"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"setting-up-the-development-environment",children:"Setting Up the Development Environment"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"Clone the Repository"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/AbdelStark/bitcoin-mcp\ncd bitcoin-mcp\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"Install Dependencies"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm install\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"Build the Project"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run build\n"})}),"\n",(0,r.jsx)(n.h2,{id:"project-architecture",children:"Project Architecture"}),"\n",(0,r.jsx)(n.p,{children:"Bitcoin MCP Server uses a modular architecture based on the Model Context Protocol (MCP). The server is designed to support multiple transport mechanisms through a common base implementation."}),"\n",(0,r.jsx)(n.h3,{id:"core-components",children:"Core Components"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"src/\n\u251c\u2500\u2500 server/                 # Server implementations\n\u2502   \u251c\u2500\u2500 base.ts            # Base server with common functionality\n\u2502   \u251c\u2500\u2500 sse.ts             # Server-Sent Events implementation\n\u2502   \u251c\u2500\u2500 stdio.ts           # Standard I/O implementation\n\u2502   \u2514\u2500\u2500 tools.ts           # Tool handlers (Bitcoin operations)\n\u251c\u2500\u2500 services/              # Core business logic\n\u2502   \u2514\u2500\u2500 bitcoin.ts         # Bitcoin service implementation\n\u251c\u2500\u2500 blockstream/           # Blockstream API types\n\u251c\u2500\u2500 utils/                 # Utility functions\n\u2514\u2500\u2500 types.ts              # Type definitions\n"})}),"\n",(0,r.jsx)(n.h3,{id:"server-architecture",children:"Server Architecture"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502     BaseBitcoinServer   \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 \u2713 Tool Registration     \u2502\n\u2502 \u2713 Error Handling        \u2502\n\u2502 \u2713 Lifecycle Management  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n            \u2502\n    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n    \u2502               \u2502\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502   SSE     \u2502 \u2502  STDIO   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n"})}),"\n",(0,r.jsxs)(n.h4,{id:"base-server-serverbasets",children:["Base Server (",(0,r.jsx)(n.code,{children:"server/base.ts"}),")"]}),"\n",(0,r.jsx)(n.p,{children:"The foundation of our server architecture, providing:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Tool registration and handling"}),"\n",(0,r.jsx)(n.li,{children:"Error management"}),"\n",(0,r.jsx)(n.li,{children:"Common lifecycle methods"}),"\n",(0,r.jsx)(n.li,{children:"Type-safe request/response handling"}),"\n"]}),"\n",(0,r.jsxs)(n.h4,{id:"sse-server-serverssets",children:["SSE Server (",(0,r.jsx)(n.code,{children:"server/sse.ts"}),")"]}),"\n",(0,r.jsx)(n.p,{children:"Implements Server-Sent Events transport:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Real-time updates"}),"\n",(0,r.jsx)(n.li,{children:"Persistent connections"}),"\n",(0,r.jsx)(n.li,{children:"Express.js endpoints"}),"\n",(0,r.jsx)(n.li,{children:"Automatic reconnection"}),"\n"]}),"\n",(0,r.jsxs)(n.h4,{id:"stdio-server-serverstdiots",children:["STDIO Server (",(0,r.jsx)(n.code,{children:"server/stdio.ts"}),")"]}),"\n",(0,r.jsx)(n.p,{children:"Implements Standard I/O transport:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Command-line interface"}),"\n",(0,r.jsx)(n.li,{children:"Stream redirection"}),"\n",(0,r.jsx)(n.li,{children:"Process isolation"}),"\n",(0,r.jsx)(n.li,{children:"Clean logging separation"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"core-services",children:"Core Services"}),"\n",(0,r.jsxs)(n.h4,{id:"bitcoin-service-servicesbitcoints",children:["Bitcoin Service (",(0,r.jsx)(n.code,{children:"services/bitcoin.ts"}),")"]}),"\n",(0,r.jsx)(n.p,{children:"Handles all Bitcoin-related operations:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Key generation"}),"\n",(0,r.jsx)(n.li,{children:"Address validation"}),"\n",(0,r.jsx)(n.li,{children:"Transaction decoding"}),"\n",(0,r.jsx)(n.li,{children:"Blockchain queries"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"development-workflow",children:"Development Workflow"}),"\n",(0,r.jsx)(n.h3,{id:"running-different-server-modes",children:"Running Different Server Modes"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"STDIO Mode (Default)"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm start\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.strong,{children:"SSE Mode"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"SERVER_MODE=sse npm start\n"})}),"\n",(0,r.jsx)(n.h3,{id:"testing",children:"Testing"}),"\n",(0,r.jsx)(n.p,{children:"Execute the test suite:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm test\n"})}),"\n",(0,r.jsx)(n.h3,{id:"code-linting",children:"Code Linting"}),"\n",(0,r.jsx)(n.p,{children:"Check code style and formatting:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run lint\n"})}),"\n",(0,r.jsx)(n.p,{children:"Fix automatic linting issues:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"npm run lint:fix\n"})}),"\n",(0,r.jsx)(n.h2,{id:"development-guidelines",children:"Development Guidelines"}),"\n",(0,r.jsx)(n.h3,{id:"code-style",children:"Code Style"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Use TypeScript for all new code"}),"\n",(0,r.jsx)(n.li,{children:"Follow the existing code style"}),"\n",(0,r.jsx)(n.li,{children:"Add type definitions for all functions and variables"}),"\n",(0,r.jsx)(n.li,{children:"Keep functions small and focused"}),"\n",(0,r.jsx)(n.li,{children:"Document with JSDoc comments"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"adding-new-features",children:"Adding New Features"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"New Tool Implementation"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Add tool handler in ",(0,r.jsx)(n.code,{children:"server/tools.ts"})]}),"\n",(0,r.jsxs)(n.li,{children:["Register tool in ",(0,r.jsx)(n.code,{children:"server/base.ts"})]}),"\n",(0,r.jsxs)(n.li,{children:["Implement business logic in ",(0,r.jsx)(n.code,{children:"services/bitcoin.ts"})]}),"\n",(0,r.jsxs)(n.li,{children:["Add necessary types in ",(0,r.jsx)(n.code,{children:"types.ts"})]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"New Transport Implementation"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Create new class extending ",(0,r.jsx)(n.code,{children:"BaseBitcoinServer"})]}),"\n",(0,r.jsxs)(n.li,{children:["Implement ",(0,r.jsx)(n.code,{children:"start()"})," method"]}),"\n",(0,r.jsx)(n.li,{children:"Handle transport-specific setup"}),"\n",(0,r.jsx)(n.li,{children:"Add appropriate error handling"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"testing-1",children:"Testing"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Write tests for all new features"}),"\n",(0,r.jsx)(n.li,{children:"Test both success and error cases"}),"\n",(0,r.jsx)(n.li,{children:"Mock external services appropriately"}),"\n",(0,r.jsx)(n.li,{children:"Maintain high test coverage"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"documentation",children:"Documentation"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Update documentation for new features"}),"\n",(0,r.jsx)(n.li,{children:"Include JSDoc comments for public APIs"}),"\n",(0,r.jsx)(n.li,{children:"Keep the README up to date"}),"\n",(0,r.jsx)(n.li,{children:"Document breaking changes"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"debugging",children:"Debugging"}),"\n",(0,r.jsx)(n.h3,{id:"debug-logging",children:"Debug Logging"}),"\n",(0,r.jsx)(n.p,{children:"Enable debug logging by setting the environment variable:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"LOG_LEVEL=debug npm start\n"})}),"\n",(0,r.jsx)(n.h3,{id:"using-vs-code-debugger",children:"Using VS Code Debugger"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Create a launch configuration in ",(0,r.jsx)(n.code,{children:".vscode/launch.json"}),":"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-json",children:'{\n  "version": "0.2.0",\n  "configurations": [\n    {\n      "type": "node",\n      "request": "launch",\n      "name": "Debug Server",\n      "program": "${workspaceFolder}/dist/index.js",\n      "preLaunchTask": "npm: build",\n      "outFiles": ["${workspaceFolder}/dist/**/*.js"],\n      "env": {\n        "LOG_LEVEL": "debug",\n        "SERVER_MODE": "stdio"\n      }\n    }\n  ]\n}\n'})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:"Start debugging using F5 or the VS Code debug panel"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"contributing",children:"Contributing"}),"\n",(0,r.jsxs)(n.p,{children:["Please see our ",(0,r.jsx)(n.a,{href:"/bitcoin-mcp/docs/contributing",children:"Contributing Guide"})," for details on how to contribute to the project."]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>l,x:()=>d});var s=i(6540);const r={},t=s.createContext(r);function l(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);