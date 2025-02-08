---
sidebar_position: 3
---

# Decode Transaction

A tool for parsing and understanding raw Bitcoin transactions by converting them into a human-readable format.

## Tool Name

`decode_tx`

## Description

Decodes a raw Bitcoin transaction hex string into a structured format, revealing details about the transaction's inputs, outputs, and other properties. This tool is essential for transaction analysis and debugging.

## Input

- `rawHex`: The raw transaction data in hexadecimal format (string)

## Output

Returns detailed transaction information including:

- Transaction ID (TXID)
- Version number
- Input details (previous transactions, script signatures)
- Output details (amounts, recipient addresses)
- Lock time
- Size and weight

## Example Usage

Using the tool through Claude:

```
Can you decode this Bitcoin transaction: 0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
```

Example output:

```
I'll decode that Bitcoin transaction using the decode_tx tool.

Transaction Details:
- TXID: f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16
- Version: 1
- Size: 275 bytes

Inputs (1):
1. Previous TX: 0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9
   Output Index: 0
   Script: 47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901

Outputs (2):
1. Amount: 10.00 BTC
   Address: 1Q2TWHE3GMdB6BZKafqwxXtWAWgFt5Jvm3
   Script Type: P2PK

2. Amount: 40.00 BTC
   Address: 12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S
   Script Type: P2PK

Locktime: 0 (No locktime)

This is a historical transaction from 2009 where 10 BTC was sent to one address and 40 BTC was sent as change.
```

## Common Use Cases

- Analyzing transaction structure
- Debugging transaction issues
- Educational purposes
- Transaction history research
- Script analysis

## Technical Details

The tool decodes:

- Transaction structure and version
- Input and output counts
- Script types and contents
- Address formats
- Bitcoin amounts
- Sequence numbers
- Witness data (for SegWit transactions)

## Supported Transaction Types

- Legacy (non-SegWit)
- SegWit (native and wrapped)
- Multi-signature
- Time-locked transactions
