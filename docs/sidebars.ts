import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Introduction",
      items: ["intro", "introduction/overview", "introduction/features"],
    },
    {
      type: "category",
      label: "Getting Started",
      items: [
        "getting-started/installation",
        "getting-started/development-setup",
      ],
    },
    {
      type: "category",
      label: "Integration Guides",
      items: ["integration/claude-desktop", "integration/goose"],
    },
    {
      type: "category",
      label: "API Reference",
      items: [
        "api/generate-key",
        "api/validate-address",
        "api/decode-tx",
        "api/get-latest-block",
        "api/get-transaction",
      ],
    },
    "error-handling",
    "contributing",
  ],
};

export default sidebars;
