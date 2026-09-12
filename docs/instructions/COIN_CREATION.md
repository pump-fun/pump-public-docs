# Coin Creation Accounts

The `create_v2` instruction uses the following accounts. Accounts 1-16 are present in the generated IDL. Accounts 17-19 are optional `remaining_accounts` and must be appended in this exact order when creating a coin with a non-native quote mint.


| #   | Account                          | Seeds / derivation                                                                                                                                                                                                                                                                     | Added to IDL? |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | `mint`                           | New Token-2022 mint account. Signer, initialized with `decimals = 6`, `mint_authority`, `token_program`, and metadata pointer set to `mint`.                                                                                                                                           | Yes           |
| 2   | `mint_authority`                 | Pump PDA: seeds `[b"mint-authority"]`.                                                                                                                                                                                                                                                 | Yes           |
| 3   | `bonding_curve`                  | Pump PDA: seeds `[b"bonding-curve", mint]`.                                                                                                                                                                                                                                            | Yes           |
| 4   | `associated_bonding_curve`       | Associated token account for `mint`, owned by `bonding_curve`, using `token_program` and `associated_token_program`.                                                                                                                                                                   | Yes           |
| 5   | `global`                         | Pump PDA: seeds `[b"global"]`.                                                                                                                                                                                                                                                         | Yes           |
| 6   | `user`                           | Transaction signer and payer.                                                                                                                                                                                                                                                          | Yes           |
| 7   | `system_program`                 | System Program: `11111111111111111111111111111111`.                                                                                                                                                                                                                                    | Yes           |
| 8   | `token_program`                  | Token-2022 Program: `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`.                                                                                                                                                                                                                     | Yes           |
| 9   | `associated_token_program`       | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                                                                                                                                              | Yes           |
| 10  | `mayhem_program_id`              | Mayhem Program: `MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e`.                                                                                                                                                                                                                         | Yes           |
| 11  | `global_params`                  | Mayhem PDA: seeds `[b"global-params"]`.                                                                                                                                                                                                                                                | Yes           |
| 12  | `sol_vault`                      | Mayhem PDA: seeds `[b"sol-vault"]`.                                                                                                                                                                                                                                                    | Yes           |
| 13  | `mayhem_state`                   | Mayhem PDA: seeds `[b"mayhem-state", mint]`.                                                                                                                                                                                                                                           | Yes           |
| 14  | `mayhem_token_vault`             | Associated token account for `mint`, owned by `sol_vault`, using the Token-2022 program.                                                                                                                                                                                               | Yes           |
| 15  | `event_authority`                | Pump PDA generated by `#[event_cpi]`: seeds `[b"__event_authority"]`.                                                                                                                                                                                                                  | Yes           |
| 16  | `program`                        | Pump program account, generated by `#[event_cpi]`.                                                                                                                                                                                                                                     | Yes           |
| 17  | `quote_mint`                     | Optional remaining account at index `0`. Must be a supported quote mint. If left empty, or if passed as wrapped SOL (`So11111111111111111111111111111111111111112`), `bonding_curve.quote_mint` becomes `Pubkey::default()`, which is the correct value for a coin traded against SOL. | No            |
| 18  | `associated_quote_bonding_curve` | Optional remaining account at index `1`. Associated token account for `quote_mint`, owned by `bonding_curve`, using the quote mint's token program. Required for non-native quote mints.                                                                                               | No            |
| 19  | `quote_token_program`            | Optional remaining account at index `2`. Must be the token program for `quote_mint`; this is not necessarily the legacy SPL Token Program.                                                                                                                                             | No            |


When any optional quote account is supplied, all three optional remaining accounts must be supplied.

## Instruction Data

The `create_v2` instruction takes the following instruction data arguments.


| #   | Argument              | Type         | Description / validation                          | Optional? |
| --- | --------------------- | ------------ | ------------------------------------------------- | --------- |
| 1   | `name`                | `String`     | Coin name. Maximum 32 characters.                 | No        |
| 2   | `symbol`              | `String`     | Coin symbol. Maximum 13 characters.               | No        |
| 3   | `uri`                 | `String`     | Metadata URI. Maximum 200 characters.             | No        |
| 4   | `creator`             | `Pubkey`     | Creator address. Must not be `Pubkey::default()`. | No        |
| 5   | `is_mayhem_mode`      | `bool`       | Enables mayhem mode for the coin.                 | No        |
| 6   | `is_cashback_enabled` | `OptionBool` | **Deprecated.** Must be `[false]` or omitted: cashback coins can no longer be created and the instruction fails on `[true]`. Existing cashback coins are unaffected. | Yes       |
| 7   | `creator_fee_bps`     | `OptionU64`  | Creator fee rate for coins on a custom pair (a quote asset other than SOL or USDC). Omitted or `0` means the standard fee schedule; on SOL- and USDC-paired coins the value is ignored and the schedule always applies. Contact the CTO team to change the rate of an existing coin. | Yes       |
| 8   | `is_holder_reward`    | `OptionBool` | `[true]` creates a [holder rewards coin](../HOLDER_REWARDS_README.md): the creator fee of every trade is set aside for the coin's holders instead of a creator wallet, and `creator` is not used as the fee recipient. Permanent. Omitted or `[false]` creates a regular coin. | Yes       |

The trailing optional arguments (6-8) may be left off the end of the instruction data; a missing argument reads as `false` / `0`.

## TS SDK

### Default SOL-Paired Mint

When `quoteMint` is omitted, the coin is created as a SOL-paired mint.

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const mintKeypair = Keypair.generate();

const createInstruction = await PUMP_SDK.createV2Instruction({
  mint: mintKeypair.publicKey,
  name: "Name",
  symbol: "symbol",
  uri: "<your ipfs uri>",
  creator,
  user,
  mayhemMode: false, // Can be set to true.
  holderReward: false, // true creates a holder rewards coin (see HOLDER_REWARDS_README.md).
  // cashback is deprecated: create_v2 rejects true.
});
```

### Holder Rewards Mint

Pass `holderReward: true` to create a coin whose creator fee goes to its holders. See
[HOLDER_REWARDS_README.md](../HOLDER_REWARDS_README.md) for what this means and how to read the new fields.

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const mintKeypair = Keypair.generate();

const createInstruction = await PUMP_SDK.createV2Instruction({
  mint: mintKeypair.publicKey,
  name: "Name",
  symbol: "symbol",
  uri: "<your ipfs uri>",
  creator, // not used as the fee recipient on a holder rewards coin
  user,
  mayhemMode: false,
  holderReward: true,
});
```

### USDC-Paired Mint

Pass the USDC mint as `quoteMint` to create a USDC-paired mint.

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const mintKeypair = Keypair.generate();
const quoteMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

const createInstruction = await PUMP_SDK.createV2Instruction({
  mint: mintKeypair.publicKey,
  name: "Name",
  symbol: "symbol",
  uri: "<your ipfs uri>",
  creator,
  user,
  mayhemMode: false, // Can be set to true.
  quoteMint,
});
```

## Rust SDK

The Rust client exposes `create_v2_and_buy_instruction`, which returns the
`create_v2` instruction followed by a `buy_v2` instruction so the creator can
seed the curve in a single transaction. Pass `Pubkey::default()` for a
SOL-paired coin or the desired quote mint (e.g. USDC) for a non-native quote.

### Default SOL-Paired Mint

```rust
use pump_rust_client::{constants, PumpSdk};
use solana_sdk::pubkey::Pubkey;

let sdk = PumpSdk::new();
let global = client.fetch_global().await.expect("fetch_global");

let ixs = sdk
    .create_v2_and_buy_instruction(
        mint.pubkey(),
        user.pubkey(),
        "Example",
        "EX",
        "https://example.com/ex.json",
        user.pubkey(),       // creator
        Pubkey::default(),   // quote_mint — default → wSOL
        false,               // mayhem_mode
        false,               // cashback (deprecated: must stay false)
        None,                // tokenized_agent_buyback_bps
        &global,
        1_000_000_000,       // amount (token base units, 6 decimals)
        LAMPORTS_PER_SOL,    // max_quote_tokens (slippage cap, in quote base units)
    )
    .expect("create_v2_and_buy_instruction");
```

### USDC-Paired Mint

```rust
let usdc = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

let ixs = sdk
    .create_v2_and_buy_instruction(
        mint.pubkey(),
        user.pubkey(),
        "Example",
        "EX",
        "https://example.com/ex.json",
        user.pubkey(),
        usdc,                // quote_mint
        false,
        false,
        None,
        &global,
        1_000_000_000,
        max_quote_tokens,    // slippage cap, expressed in the quote mint's base units
    )
    .expect("create_v2_and_buy_instruction");
```

