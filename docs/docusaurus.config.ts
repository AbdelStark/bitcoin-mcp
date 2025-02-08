import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Bitcoin MCP Server",
  tagline: "Enable AI models to interact with Bitcoin",
  favicon: "img/favicon.ico",

  url: "https://abdelstark.github.io",
  baseUrl: "/bitcoin-mcp/",

  // GitHub pages deployment config.
  organizationName: "AbdelStark",
  projectName: "bitcoin-mcp",
  deploymentBranch: "gh-pages",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/AbdelStark/bitcoin-mcp/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig: {
    image: "img/bitcoin-mcp-social-card.jpg",
    navbar: {
      title: "Bitcoin MCP Server",
      logo: {
        alt: "Bitcoin MCP Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/AbdelStark/bitcoin-mcp",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started/installation",
            },
            {
              label: "API Reference",
              to: "/docs/api/generate-key",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Issues",
              href: "https://github.com/AbdelStark/bitcoin-mcp/issues",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/AbdelStark/bitcoin-mcp",
            },
            {
              label: "MCP Documentation",
              href: "https://modelcontextprotocol.com",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bitcoin MCP Server. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
