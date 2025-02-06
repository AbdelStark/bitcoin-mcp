#!/usr/bin/env node

import { main } from "./index.js";

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
