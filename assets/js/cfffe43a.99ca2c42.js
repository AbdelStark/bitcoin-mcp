"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[55],{8193:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>r,contentTitle:()=>d,default:()=>u,frontMatter:()=>c,metadata:()=>t,toc:()=>o});const t=JSON.parse('{"id":"api/decode-tx","title":"Decode Transaction","description":"A tool for parsing and understanding raw Bitcoin transactions by converting them into a human-readable format.","source":"@site/docs/api/decode-tx.md","sourceDirName":"api","slug":"/api/decode-tx","permalink":"/bitcoin-mcp/docs/api/decode-tx","draft":false,"unlisted":false,"editUrl":"https://github.com/AbdelStark/bitcoin-mcp/tree/main/docs/docs/api/decode-tx.md","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3},"sidebar":"tutorialSidebar","previous":{"title":"Validate Address","permalink":"/bitcoin-mcp/docs/api/validate-address"},"next":{"title":"Get Latest Block","permalink":"/bitcoin-mcp/docs/api/get-latest-block"}}');var a=i(4848),s=i(8453);const c={sidebar_position:3},d="Decode Transaction",r={},o=[{value:"Tool Name",id:"tool-name",level:2},{value:"Description",id:"description",level:2},{value:"Input",id:"input",level:2},{value:"Output",id:"output",level:2},{value:"Example Usage",id:"example-usage",level:2},{value:"Common Use Cases",id:"common-use-cases",level:2},{value:"Technical Details",id:"technical-details",level:2},{value:"Supported Transaction Types",id:"supported-transaction-types",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"decode-transaction",children:"Decode Transaction"})}),"\n",(0,a.jsx)(n.p,{children:"A tool for parsing and understanding raw Bitcoin transactions by converting them into a human-readable format."}),"\n",(0,a.jsx)(n.h2,{id:"tool-name",children:"Tool Name"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.code,{children:"decode_tx"})}),"\n",(0,a.jsx)(n.h2,{id:"description",children:"Description"}),"\n",(0,a.jsx)(n.p,{children:"Decodes a raw Bitcoin transaction hex string into a structured format, revealing details about the transaction's inputs, outputs, and other properties. This tool is essential for transaction analysis and debugging."}),"\n",(0,a.jsx)(n.h2,{id:"input",children:"Input"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"rawHex"}),": The raw transaction data in hexadecimal format (string)"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"output",children:"Output"}),"\n",(0,a.jsx)(n.p,{children:"Returns detailed transaction information including:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Transaction ID (TXID)"}),"\n",(0,a.jsx)(n.li,{children:"Version number"}),"\n",(0,a.jsx)(n.li,{children:"Input details (previous transactions, script signatures)"}),"\n",(0,a.jsx)(n.li,{children:"Output details (amounts, recipient addresses)"}),"\n",(0,a.jsx)(n.li,{children:"Lock time"}),"\n",(0,a.jsx)(n.li,{children:"Size and weight"}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"example-usage",children:"Example Usage"}),"\n",(0,a.jsx)(n.p,{children:"Using the tool through Claude:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"Can you decode this Bitcoin transaction: 0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000\n"})}),"\n",(0,a.jsx)(n.p,{children:"Example output:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"I'll decode that Bitcoin transaction using the decode_tx tool.\n\nTransaction Details:\n- TXID: f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16\n- Version: 1\n- Size: 275 bytes\n\nInputs (1):\n1. Previous TX: 0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9\n   Output Index: 0\n   Script: 47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901\n\nOutputs (2):\n1. Amount: 10.00 BTC\n   Address: 1Q2TWHE3GMdB6BZKafqwxXtWAWgFt5Jvm3\n   Script Type: P2PK\n\n2. Amount: 40.00 BTC\n   Address: 12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S\n   Script Type: P2PK\n\nLocktime: 0 (No locktime)\n\nThis is a historical transaction from 2009 where 10 BTC was sent to one address and 40 BTC was sent as change.\n"})}),"\n",(0,a.jsx)(n.h2,{id:"common-use-cases",children:"Common Use Cases"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Analyzing transaction structure"}),"\n",(0,a.jsx)(n.li,{children:"Debugging transaction issues"}),"\n",(0,a.jsx)(n.li,{children:"Educational purposes"}),"\n",(0,a.jsx)(n.li,{children:"Transaction history research"}),"\n",(0,a.jsx)(n.li,{children:"Script analysis"}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"technical-details",children:"Technical Details"}),"\n",(0,a.jsx)(n.p,{children:"The tool decodes:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Transaction structure and version"}),"\n",(0,a.jsx)(n.li,{children:"Input and output counts"}),"\n",(0,a.jsx)(n.li,{children:"Script types and contents"}),"\n",(0,a.jsx)(n.li,{children:"Address formats"}),"\n",(0,a.jsx)(n.li,{children:"Bitcoin amounts"}),"\n",(0,a.jsx)(n.li,{children:"Sequence numbers"}),"\n",(0,a.jsx)(n.li,{children:"Witness data (for SegWit transactions)"}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"supported-transaction-types",children:"Supported Transaction Types"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Legacy (non-SegWit)"}),"\n",(0,a.jsx)(n.li,{children:"SegWit (native and wrapped)"}),"\n",(0,a.jsx)(n.li,{children:"Multi-signature"}),"\n",(0,a.jsx)(n.li,{children:"Time-locked transactions"}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>c,x:()=>d});var t=i(6540);const a={},s=t.createContext(a);function c(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:c(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);