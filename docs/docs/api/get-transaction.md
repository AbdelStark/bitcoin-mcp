---
sidebar_position: 5
---

# Get Transaction

A tool for retrieving detailed information about any Bitcoin transaction using its transaction ID (TXID).

## Tool Name

`get_transaction`

## Description

Fetches comprehensive information about a specific Bitcoin transaction, including its inputs, outputs, confirmation status, and fees. This tool is essential for tracking payments and analyzing transaction history.

## Input

- `txid`: The transaction ID to look up (string, 64 hexadecimal characters)

## Output

Returns detailed transaction information including:

- Transaction status (confirmed/unconfirmed)
- Block information (if confirmed)
- Input and output details
- Fee information
- Size and weight
- Timestamp
- Confirmation count

## Example Usage

Using the tool through Claude:

```
Can you look up information about this Bitcoin transaction:
f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16
```

Example output:

```
I'll retrieve information about that transaction using the get_transaction tool.

Transaction Details:
- Status: Confirmed
- Block Height: 170
- Timestamp: 2009-01-12 03:30:25 UTC
- Confirmations: 831,073

Inputs (1):
1. From: 0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9
   Amount: 50 BTC
   Type: Coinbase

Outputs (2):
1. To: 1Q2TWHE3GMdB6BZKafqwxXtWAWgFt5Jvm3
   Amount: 10 BTC
   Type: P2PK

2. To: 12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S
   Amount: 40 BTC
   Type: P2PK

Additional Information:
- Size: 275 bytes
- Weight: 1,100 WU
- Fee: 0 BTC (early blockchain transaction)

This is a historical transaction from Bitcoin's early days, moving 50 BTC from a coinbase reward.
```

## Common Use Cases

- Payment verification
- Transaction tracking
- Fee analysis
- Historical research
- Blockchain exploration
- Debugging payment issues

## Technical Details

The tool provides:

- Full transaction data
- Input source tracing
- Output destination details
- Fee calculation
- Confirmation status
- Block inclusion details
- Script analysis

## Network Considerations

- Works with both confirmed and unconfirmed transactions
- Mempool transactions are supported
- Data is fetched from the configured network (mainnet/testnet)
- Historical transactions may take longer to retrieve
- Rate limits may apply based on the data source
