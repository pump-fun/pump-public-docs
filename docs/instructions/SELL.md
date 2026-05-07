# Sell V2

The `sell_v2` instruction sells base tokens into a bonding curve using the curve's quote mint. Like `buy_v2`, it uses a single unified account interface for both SOL-paired and non-SOL-paired coins.

## Accounts


| #   | Account                                  | Seeds / derivation                                                                                                                                                     | `init_if_needed` / SOL cost                                            |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | `global`                                 | Pump PDA: seeds `[b"global"]`.                                                                                                                                         | -                                                                      |
| 2   | `base_mint`                              | Base token mint for the coin being sold.                                                                                                                               | -                                                                      |
| 3   | `quote_mint`                             | Quote mint for the coin. For SOL-paired coins, pass wrapped SOL: `So11111111111111111111111111111111111111112`.                                                        | -                                                                      |
| 4   | `base_token_program`                     | Token program for `base_mint`. For `create_v2` coins this is Token-2022: `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`.                                                | -                                                                      |
| 5   | `quote_token_program`                    | Token program for `quote_mint`. This is not necessarily the same as `base_token_program`.                                                                              | -                                                                      |
| 6   | `associated_token_program`               | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                              | -                                                                      |
| 7   | `fee_recipient`                          | Fee recipient selected from the global config.                                                                                                                         | -                                                                      |
| 8   | `associated_quote_fee_recipient`         | Associated token account for `quote_mint`, owned by `fee_recipient`, using `quote_token_program`.                                                                      | ATA rent if missing                                                    |
| 9   | `buyback_fee_recipient`                  | Buyback fee recipient checked against the global config.                                                                                                               | -                                                                      |
| 10  | `associated_quote_buyback_fee_recipient` | Associated token account for `quote_mint`, owned by `buyback_fee_recipient`, using `quote_token_program`.                                                              | -                                                                      |
| 11  | `bonding_curve`                          | Pump PDA: seeds `[b"bonding-curve", base_mint]`. For SOL-paired coins, `bonding_curve.quote_mint` is `Pubkey::default()` and `quote_mint` should be wrapped SOL.       | Rent top-up to make the account data length 115 bytes if it is smaller |
| 12  | `associated_base_bonding_curve`          | Associated token account for `base_mint`, owned by `bonding_curve`, using `base_token_program`.                                                                        | -                                                                      |
| 13  | `associated_quote_bonding_curve`         | Associated token account for `quote_mint`, owned by `bonding_curve`, using `quote_token_program`.                                                                      | -                                                                      |
| 14  | `user`                                   | Transaction signer and seller.                                                                                                                                         | -                                                                      |
| 15  | `associated_base_user`                   | User's associated token account for `base_mint`, using `base_token_program`.                                                                                           | -                                                                      |
| 16  | `associated_quote_user`                  | User's associated token account for `quote_mint`, using `quote_token_program`. For SOL-paired coins, this is seed constrained but native SOL is used for the transfer. | -                                                                      |
| 17  | `creator_vault`                          | Pump PDA: seeds `[b"creator-vault", bonding_curve.creator]`.                                                                                                           | Rent-exempt top-up if needed                                           |
| 18  | `associated_creator_vault`               | Associated token account for `quote_mint`, owned by `creator_vault`, using `quote_token_program`.                                                                      | ATA rent if missing                                                    |
| 19  | `sharing_config`                         | Pump Fees PDA: seeds `[b"sharing-config", base_mint]`.                                                                                                                 | -                                                                      |
| 20  | `user_volume_accumulator`                | Pump PDA: seeds `[b"user_volume_accumulator", user]`. Initialized if needed, paid by `user`.                                                                           | Rent for 137-byte account if missing: 0.0018444 SOL                    |
| 21  | `associated_user_volume_accumulator`     | Associated token account for `quote_mint`, owned by `user_volume_accumulator`, using `quote_token_program`.                                                            | ATA rent if missing                                                    |
| 22  | `fee_config`                             | Pump Fees PDA: seeds `[b"fee_config", pump_program_id]`.                                                                                                               | -                                                                      |
| 23  | `fee_program`                            | Pump Fees Program.                                                                                                                                                     | -                                                                      |
| 24  | `system_program`                         | System Program: `11111111111111111111111111111111`.                                                                                                                    | -                                                                      |
| 25  | `event_authority`                        | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                              | -                                                                      |
| 26  | `program`                                | Pump program account.                                                                                                                                                  | -                                                                      |


## Instruction Data

The `sell_v2` instruction takes the following instruction data arguments.


| #   | Argument         | Type  | Description / validation                                                                                                      | Optional? |
| --- | ---------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | `amount`         | `u64` | Amount of base tokens to sell, in base token units. Must be greater than `0` and cannot exceed the user's base token balance. | No        |
| 2   | `min_sol_output` | `u64` | Minimum quote amount the seller is willing to receive after protocol and creator fees.                                        | No        |


## Fee Recipients

All `sell_v2` calls need a `feeRecipient` and a `buybackFeeRecipient`.

- For non-mayhem coins, choose one of the 8 normal fee recipients as `feeRecipient`.
- For mayhem mode coins, choose one of the 8 reserved fee recipients as `feeRecipient`.
- For all coins, choose one of the 8 buyback fee recipients as `buybackFeeRecipient`.

See [Fee Recipients](../FEE_RECIPIENTS.md) for the full address lists.

## TS SDK

### Sell SOL-Paired Coin

For SOL-paired coins, use wrapped SOL as the `quoteMint`.

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const amount = new BN(100_000 * 10 ** 6);
const quoteAmount = new BN(0);
const quoteMint = NATIVE_MINT;
const quoteTokenProgram = TOKEN_PROGRAM_ID;

const sellInstruction = await PUMP_SDK.getSellV2InstructionRaw({
  user,
  mint,
  creator,
  amount,
  quoteAmount,
  tokenProgram: TOKEN_2022_PROGRAM_ID,
  quoteMint,
  quoteTokenProgram,
  feeRecipient,
  buybackFeeRecipient,
});
```

### Sell Legacy SOL-Paired Coin

For legacy coins where the base mint uses the legacy SPL Token Program, pass `TOKEN_PROGRAM_ID` as both the base `tokenProgram` and `quoteTokenProgram`.

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const amount = new BN(100_000 * 10 ** 6);
const quoteAmount = new BN(0);
const quoteMint = NATIVE_MINT;
const quoteTokenProgram = TOKEN_PROGRAM_ID;

const sellInstruction = await PUMP_SDK.getSellV2InstructionRaw({
  user,
  mint,
  creator,
  amount,
  quoteAmount,
  tokenProgram: TOKEN_PROGRAM_ID,
  quoteMint,
  quoteTokenProgram,
  feeRecipient,
  buybackFeeRecipient,
});
```

### Sell USDC-Paired Coin

For USDC-paired coins, pass the USDC mint as `quoteMint` and the quote mint's token program as `quoteTokenProgram`.

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const amount = new BN(100_000 * 10 ** 6);
const quoteAmount = new BN(0);
const quoteMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const quoteTokenProgram = TOKEN_PROGRAM_ID;

const sellInstruction = await PUMP_SDK.getSellV2InstructionRaw({
  user,
  mint,
  creator,
  amount,
  quoteAmount,
  tokenProgram: TOKEN_2022_PROGRAM_ID,
  quoteMint,
  quoteTokenProgram,
  feeRecipient,
  buybackFeeRecipient,
});
```

## Rust SDK

The Rust client exposes `sell_v2_instructions`, which prepends the user's
base/quote ATA creates and emits the `sell_v2` instruction. The fetched
`BondingCurve` carries the coin's `quote_mint`, so the same builder works
for SOL-paired and non-native quote coins; only `quote_token_program`
needs to match the quote mint's token program.

```rust
use pump_rust_client::{constants, PumpSdk};

let sdk = PumpSdk::new();
let global = client.fetch_global().await.expect("fetch_global");
let bonding_curve = client
    .fetch_bonding_curve(&mint)
    .await
    .expect("fetch_bonding_curve");

let mut ixs = vec![ComputeBudgetInstruction::set_compute_unit_limit(400_000)];
ixs.extend(
    sdk.sell_v2_instructions(
        &global,
        &bonding_curve,
        mint,
        constants::SPL_TOKEN_PROGRAM_ID, // quote_token_program
        user.pubkey(),
        300_000_000,                     // amount (base token units, 6 decimals)
        1,                               // min_sol_output (slippage floor, quote base units)
    )
    .expect("sell_v2_instructions"),
);
```

