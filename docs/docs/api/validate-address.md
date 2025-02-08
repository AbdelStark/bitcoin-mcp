---
sidebar_position: 2
---

# Validate Address

A tool for checking if a Bitcoin address is valid and determining its properties.

## Tool Name

`validate_address`

## Description

Validates Bitcoin addresses by checking their format, checksum, and network compatibility. This tool helps ensure addresses are correctly formatted before sending transactions or using them in applications.

## Input

- `address`: The Bitcoin address to validate (string)

## Output

Returns validation details including:

- Whether the address is valid
- The address type (P2PKH, P2SH, etc.)
- The network (mainnet/testnet)

## Example Usage

Using the tool through Claude:

```
Is this Bitcoin address valid: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?
```

Example output:

```
I'll check if that Bitcoin address is valid using the validate_address tool.

The address 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa is valid:
- Type: P2PKH (Pay to Public Key Hash)
- Network: Mainnet
- Format: Legacy (starts with '1')

This is a valid Bitcoin address that can safely be used to receive funds on the main Bitcoin network.
```

Another example:

```
Can you validate this address: 1234abcd?
```

Example output:

```
I'll check that address using the validate_address tool.

The address "1234abcd" is NOT valid:
- Incorrect length
- Invalid checksum
- Improper format

A valid Bitcoin address should be longer and follow specific format rules. For example, a legacy Bitcoin address starts with '1' and is about 34 characters long.
```

## Common Use Cases

- Verifying addresses before sending transactions
- Validating user input in applications
- Checking address network compatibility
- Identifying address types for compatibility checks

## Technical Details

The tool performs several checks:

- Base58Check decoding
- Checksum verification
- Network prefix validation
- Address format identification
- Length validation
- Character set validation

## Error Handling

The tool provides clear feedback when validation fails, including:

- Format errors (invalid characters, wrong length)
- Network mismatches
- Checksum failures
- Invalid address types
