---
sidebar_position: 1
---

# Generate Key

A tool for generating new Bitcoin key pairs. This tool creates a complete set of Bitcoin credentials including an address, private key in WIF format, and public key.

## Tool Name

`generate_key`

## Description

Creates a new cryptographically secure Bitcoin key pair. The generated keys can be used to create wallets, sign transactions, and receive Bitcoin. The address format will match the configured network (mainnet or testnet).

## Input

This tool doesn't require any input parameters.

## Output

Returns an object containing:

- `address`: The Bitcoin address derived from the public key
- `privateKey`: The private key in Wallet Import Format (WIF)
- `publicKey`: The public key in hexadecimal format

## Example Usage

Using the tool through Claude:

```
Could you generate a new Bitcoin key pair for me?
```

Example output:

```
I'll help you generate a new Bitcoin key pair using the generate_key tool.

Here are your new Bitcoin credentials:
- Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
- Private Key (WIF): 5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss
- Public Key: 04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f

Important: Keep your private key secure and never share it with anyone. The private key gives complete control over any funds sent to this address.
```

## Security Considerations

- The private key should be kept secure and never shared
- The tool uses cryptographically secure random number generation
- Generated addresses are network-specific (mainnet/testnet)
- Each call generates a completely new and unique key pair

## Common Use Cases

- Creating new Bitcoin wallets
- Generating addresses for receiving Bitcoin
- Creating test credentials for development
- Educational purposes to understand Bitcoin key formats
