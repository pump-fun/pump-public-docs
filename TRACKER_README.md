# Pump.fun Event Tracker

A real-time tracker for Pump.fun events on Solana using gRPC streaming.

## Features

- **Real-time tracking** of Pump.fun events using Yellowstone gRPC
- **Token Creation Events**: Monitors new token launches with full metadata
- **Buy Events**: Tracks token purchases with amounts and pricing
- **Sell Events**: Monitors token sales with amounts and pricing
- **Detailed Output**: Displays comprehensive information about each event

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

## Usage

Start the tracker:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## What it Tracks

### Token Creation Events 🚀
- Token name and symbol
- Mint address
- Creator address
- Metadata URI
- Token supply information
- Bonding curve details
- Initial reserves (virtual and real)

### Buy Events 💰
- Token mint address
- Buyer address
- SOL amount spent
- Token amount received
- Current reserves
- Fee recipient
- Timestamp

### Sell Events 💸
- Token mint address
- Seller address
- SOL amount received
- Token amount sold
- Current reserves
- Fee recipient
- Timestamp

## Technical Details

### gRPC Connection
- **Endpoint**: `solana-yellowstone-grpc.publicnode.com:443`
- **Auth**: No authentication required
- **Commitment Level**: Processed (for fastest updates)

### Pump.fun Program
- **Program ID**: `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`
- **Events Tracked**:
  - CreateEvent (discriminator: `[27, 114, 169, 77, 222, 235, 99, 118]`)
  - TradeEvent (discriminator: `[189, 219, 127, 211, 78, 230, 97, 238]`)

### Event Parsing
Events are parsed using Borsh deserialization based on the Pump.fun IDL. The tracker automatically:
- Converts public keys from byte arrays to base58 strings
- Formats SOL amounts from lamports
- Distinguishes between buy and sell trades
- Provides human-readable timestamps

## Output Example

```
================================================================================
🚀 NEW TOKEN CREATION
================================================================================
Token Name:       MyToken
Symbol:           MTK
Mint:             AbC1DeF2GhI3JkL4MnO5PqR6StU7VwX8YzA9BcD0EfG1
URI:              https://example.com/metadata.json
Creator:          DeF2GhI3JkL4MnO5PqR6StU7VwX8YzA9BcD0EfG1HiJ2
User:             GhI3JkL4MnO5PqR6StU7VwX8YzA9BcD0EfG1HiJ2KlM3
Bonding Curve:    JkL4MnO5PqR6StU7VwX8YzA9BcD0EfG1HiJ2KlM3NoP4
Timestamp:        2024-11-05T20:30:15.000Z
Total Supply:     1000000000
Virtual SOL:      30.000000000 SOL
Virtual Tokens:   1073000000
Real Tokens:      793100000
================================================================================

================================================================================
💰 BUY EVENT
================================================================================
Token Mint:       AbC1DeF2GhI3JkL4MnO5PqR6StU7VwX8YzA9BcD0EfG1
User:             MnO5PqR6StU7VwX8YzA9BcD0EfG1HiJ2KlM3NoP4QrS5
SOL Amount:       1.500000000 SOL
Token Amount:     50000000
Timestamp:        2024-11-05T20:31:20.000Z
Virtual SOL:      31.500000000 SOL
Virtual Tokens:   1023000000
Real SOL:         1.500000000 SOL
Real Tokens:      743100000
Fee Recipient:    PqR6StU7VwX8YzA9BcD0EfG1HiJ2KlM3NoP4QrS5TuV6
================================================================================
```

## Error Handling

The tracker includes automatic reconnection logic:
- Reconnects after stream errors (5 second delay)
- Reconnects after stream ends (1 second delay)
- Continues running until manually stopped (Ctrl+C)

## Dependencies

- `@triton-one/yellowstone-grpc`: Yellowstone gRPC client for Solana
- `@solana/web3.js`: Solana Web3.js library
- `borsh`: Borsh serialization library for event parsing
- `@solana/buffer-layout`: Buffer layout utilities

## License

MIT
