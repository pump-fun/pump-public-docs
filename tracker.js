import Client from "@triton-one/yellowstone-grpc";
import { PublicKey } from "@solana/web3.js";
import { deserialize } from "borsh";

// Pump.fun program ID
const PUMP_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

// Event discriminators
const CREATE_EVENT_DISCRIMINATOR = Buffer.from([27, 114, 169, 77, 222, 235, 99, 118]);
const TRADE_EVENT_DISCRIMINATOR = Buffer.from([189, 219, 127, 211, 78, 230, 97, 238]);

// Borsh schema for CreateEvent
class CreateEvent {
  constructor(props) {
    Object.assign(this, props);
  }
}

// Borsh schema for TradeEvent
class TradeEvent {
  constructor(props) {
    Object.assign(this, props);
  }
}

const createEventSchema = new Map([
  [
    CreateEvent,
    {
      kind: "struct",
      fields: [
        ["name", "string"],
        ["symbol", "string"],
        ["uri", "string"],
        ["mint", [32]], // pubkey as 32-byte array
        ["bonding_curve", [32]],
        ["user", [32]],
        ["creator", [32]],
        ["timestamp", "i64"],
        ["virtual_token_reserves", "u64"],
        ["virtual_sol_reserves", "u64"],
        ["real_token_reserves", "u64"],
        ["token_total_supply", "u64"],
      ],
    },
  ],
]);

const tradeEventSchema = new Map([
  [
    TradeEvent,
    {
      kind: "struct",
      fields: [
        ["mint", [32]], // pubkey as 32-byte array
        ["sol_amount", "u64"],
        ["token_amount", "u64"],
        ["is_buy", "bool"],
        ["user", [32]],
        ["timestamp", "i64"],
        ["virtual_sol_reserves", "u64"],
        ["virtual_token_reserves", "u64"],
        ["real_sol_reserves", "u64"],
        ["real_token_reserves", "u64"],
        ["fee_recipient", [32]],
      ],
    },
  ],
]);

// Helper function to convert byte array to PublicKey string
function bytesToPublicKey(bytes) {
  return new PublicKey(bytes).toBase58();
}

// Helper function to format SOL amount (lamports to SOL)
function formatSol(lamports) {
  return (Number(lamports) / 1e9).toFixed(9);
}

// Helper function to format token amount
function formatTokens(amount, decimals = 6) {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(decimals);
}

// Parse CreateEvent
function parseCreateEvent(data) {
  try {
    // Skip the discriminator (first 8 bytes)
    const eventData = data.slice(8);
    const event = deserialize(createEventSchema, CreateEvent, eventData);

    return {
      name: event.name,
      symbol: event.symbol,
      uri: event.uri,
      mint: bytesToPublicKey(event.mint),
      bondingCurve: bytesToPublicKey(event.bonding_curve),
      user: bytesToPublicKey(event.user),
      creator: bytesToPublicKey(event.creator),
      timestamp: new Date(Number(event.timestamp) * 1000).toISOString(),
      virtualTokenReserves: event.virtual_token_reserves.toString(),
      virtualSolReserves: formatSol(event.virtual_sol_reserves),
      realTokenReserves: event.real_token_reserves.toString(),
      tokenTotalSupply: event.token_total_supply.toString(),
    };
  } catch (error) {
    console.error("Error parsing CreateEvent:", error);
    return null;
  }
}

// Parse TradeEvent
function parseTradeEvent(data) {
  try {
    // Skip the discriminator (first 8 bytes)
    const eventData = data.slice(8);
    const event = deserialize(tradeEventSchema, TradeEvent, eventData);

    return {
      type: event.is_buy ? "BUY" : "SELL",
      mint: bytesToPublicKey(event.mint),
      solAmount: formatSol(event.sol_amount),
      tokenAmount: event.token_amount.toString(),
      user: bytesToPublicKey(event.user),
      timestamp: new Date(Number(event.timestamp) * 1000).toISOString(),
      virtualSolReserves: formatSol(event.virtual_sol_reserves),
      virtualTokenReserves: event.virtual_token_reserves.toString(),
      realSolReserves: formatSol(event.real_sol_reserves),
      realTokenReserves: event.real_token_reserves.toString(),
      feeRecipient: bytesToPublicKey(event.fee_recipient),
    };
  } catch (error) {
    console.error("Error parsing TradeEvent:", error);
    return null;
  }
}

// Print formatted event
function printCreateEvent(event) {
  console.log("\n" + "=".repeat(80));
  console.log("🚀 NEW TOKEN CREATION");
  console.log("=".repeat(80));
  console.log(`Token Name:       ${event.name}`);
  console.log(`Symbol:           ${event.symbol}`);
  console.log(`Mint:             ${event.mint}`);
  console.log(`URI:              ${event.uri}`);
  console.log(`Creator:          ${event.creator}`);
  console.log(`User:             ${event.user}`);
  console.log(`Bonding Curve:    ${event.bondingCurve}`);
  console.log(`Timestamp:        ${event.timestamp}`);
  console.log(`Total Supply:     ${event.tokenTotalSupply}`);
  console.log(`Virtual SOL:      ${event.virtualSolReserves} SOL`);
  console.log(`Virtual Tokens:   ${event.virtualTokenReserves}`);
  console.log(`Real Tokens:      ${event.realTokenReserves}`);
  console.log("=".repeat(80));
}

function printTradeEvent(event) {
  const emoji = event.type === "BUY" ? "💰" : "💸";
  console.log("\n" + "=".repeat(80));
  console.log(`${emoji} ${event.type} EVENT`);
  console.log("=".repeat(80));
  console.log(`Token Mint:       ${event.mint}`);
  console.log(`User:             ${event.user}`);
  console.log(`SOL Amount:       ${event.solAmount} SOL`);
  console.log(`Token Amount:     ${event.tokenAmount}`);
  console.log(`Timestamp:        ${event.timestamp}`);
  console.log(`Virtual SOL:      ${event.virtualSolReserves} SOL`);
  console.log(`Virtual Tokens:   ${event.virtualTokenReserves}`);
  console.log(`Real SOL:         ${event.realSolReserves} SOL`);
  console.log(`Real Tokens:      ${event.realTokenReserves}`);
  console.log(`Fee Recipient:    ${event.feeRecipient}`);
  console.log("=".repeat(80));
}

// Main function to start the tracker
async function startTracker() {
  console.log("🔍 Starting Pump.fun Event Tracker...");
  console.log(`📡 Connecting to: solana-yellowstone-grpc.publicnode.com:443`);
  console.log(`🎯 Monitoring Program: ${PUMP_PROGRAM_ID}`);
  console.log(`📊 Tracking: Token Creation, Buy, and Sell events\n`);

  // Create gRPC client
  const client = new Client.default(
    "solana-yellowstone-grpc.publicnode.com:443",
    undefined, // No auth token needed
    {
      "grpc.max_receive_message_length": 1024 * 1024 * 1024, // 1GB
    }
  );

  // Create subscription request
  const request = {
    accounts: {},
    slots: {},
    transactions: {
      pump: {
        vote: false,
        failed: false,
        accountInclude: [PUMP_PROGRAM_ID],
      },
    },
    blocks: {},
    blocksMeta: {},
    accountsDataSlice: [],
    commitment: 1, // Processed
    entry: {},
    transactionsStatus: {},
  };

  try {
    const stream = await client.subscribeOnce(
      {}, // accounts
      {}, // slots
      {
        pump: {
          vote: false,
          failed: false,
          accountInclude: [PUMP_PROGRAM_ID],
          accountExclude: [],
          accountRequired: [],
        },
      }, // transactions
      {}, // transactionsStatus
      {}, // entry
      {}, // blocks
      {}, // blocksMeta
      1, // commitment: Processed (CommitmentLevel.CONFIRMED)
      [] // accountsDataSlice
    );

    console.log("✅ Successfully subscribed to Pump.fun events!");

    // Handle stream events
    stream.on("data", (data) => {
      // Check for transaction updates
      if (data?.transaction) {
        const transaction = data.transaction.transaction;

        // Look for account data in the transaction
        if (transaction?.meta?.logMessages) {
          // Parse log messages for events
          const logs = transaction.meta.logMessages;

          // Check if this is a Pump.fun transaction
          const isPumpTransaction = logs.some(log =>
            log.includes("Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")
          );

          if (isPumpTransaction) {
            // Parse Anchor events from logs
            // Anchor events are emitted as "Program data: <base64>"
            for (const log of logs) {
              if (log.startsWith("Program data: ")) {
                try {
                  const base64Data = log.replace("Program data: ", "");
                  const eventData = Buffer.from(base64Data, "base64");

                  // Check for CreateEvent
                  if (eventData.length >= 8 && eventData.slice(0, 8).equals(CREATE_EVENT_DISCRIMINATOR)) {
                    const event = parseCreateEvent(eventData);
                    if (event) {
                      printCreateEvent(event);
                    }
                  }

                  // Check for TradeEvent
                  if (eventData.length >= 8 && eventData.slice(0, 8).equals(TRADE_EVENT_DISCRIMINATOR)) {
                    const event = parseTradeEvent(eventData);
                    if (event) {
                      printTradeEvent(event);
                    }
                  }
                } catch (error) {
                  // Ignore parsing errors for non-pump events
                }
              }
            }
          }
        }
      }
    });

    stream.on("error", (error) => {
      console.error("Stream error:", error);
      console.log("Attempting to reconnect in 5 seconds...");
      setTimeout(() => startTracker(), 5000);
    });

    stream.on("end", () => {
      console.log("Stream ended. Reconnecting...");
      setTimeout(() => startTracker(), 1000);
    });

    // Keep the process running
    await new Promise(() => {});
  } catch (error) {
    console.error("Error in tracker:", error);
    console.log("Retrying in 5 seconds...");
    setTimeout(() => startTracker(), 5000);
  }
}

// Start the tracker
startTracker().catch(console.error);
