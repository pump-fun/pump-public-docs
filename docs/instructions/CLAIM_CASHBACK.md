# Claim Cashback

The `claim_cashback_v2` instruction claims cashback accrued in a user's volume accumulator. It supports both legacy SOL cashback and non-SOL quote mint cashback through the same interface. The instruction is permissionless: `user` is the cashback recipient, but does not need to sign the transaction.

## Accounts


| #   | Account                              | Seeds / derivation                                                                                                                                                      | `init_if_needed` / SOL cost |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `user`                               | Cashback recipient. For legacy SOL cashback, receives all lamports held above rent-exempt balance in `user_volume_accumulator`.                                         | -                           |
| 2   | `user_volume_accumulator`            | Pump PDA: seeds `[b"user_volume_accumulator", user]`.                                                                                                                   | -                           |
| 3   | `quote_mint`                         | Quote mint for the cashback being claimed. Pass wrapped SOL, `So11111111111111111111111111111111111111112`, for legacy SOL cashback.                                   | -                           |
| 4   | `quote_token_program`                | Token program for `quote_mint`. Pass the legacy SPL Token Program, `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`, for legacy SOL cashback.                              | -                           |
| 5   | `associated_token_program`           | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                               | -                           |
| 6   | `associated_user_volume_accumulator` | Associated token account for `quote_mint`, owned by `user_volume_accumulator`, using `quote_token_program`. For legacy SOL cashback, this account may not exist.        | -                           |
| 7   | `associated_quote_user`              | Associated token account for `quote_mint`, owned by `user`, using `quote_token_program`. For legacy SOL cashback, this account may not exist.                           | -                           |
| 8   | `system_program`                     | System Program: `11111111111111111111111111111111`.                                                                                                                     | -                           |
| 9   | `event_authority`                    | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                               | -                           |
| 10  | `program`                            | Pump program account.                                                                                                                                                   | -                           |


## Instruction Data

The `claim_cashback_v2` instruction takes no instruction data arguments.


## TS SDK

### Claim Legacy SOL-Paired Mint Cashback

Pass wrapped SOL as `quoteMint`. This claims lamports directly from the user's volume accumulator to `user`.

```ts
import { getPumpProgram } from "@pump-fun/pump-sdk";

const pumpProgram = getPumpProgram(connection);
const quoteMint = NATIVE_MINT;
const quoteTokenProgram = TOKEN_PROGRAM_ID;

const claimCashbackInstruction = await pumpProgram.methods
  .claimCashbackV2()
  .accountsPartial({
    user,
    quoteMint,
    quoteTokenProgram,
  })
  .instruction();
```

### Claim USDC-Paired Mint Cashback

For non-SOL quote mints, pass the quote mint and its token program. This claims tokens from the user's volume accumulator quote ATA to the user's quote ATA.

```ts
import { getPumpProgram } from "@pump-fun/pump-sdk";

const pumpProgram = getPumpProgram(connection);
const quoteMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const quoteTokenProgram = TOKEN_PROGRAM_ID;

const claimCashbackInstruction = await pumpProgram.methods
  .claimCashbackV2()
  .accountsPartial({
    user,
    quoteMint,
    quoteTokenProgram,
  })
  .instruction();
```

## Rust SDK

The Rust client exposes `claim_cashback_v2_instruction`. Pass
`Pubkey::default()` (or wSOL) as `quote_mint` for legacy SOL cashback, or
the desired quote mint (e.g. USDC) for non-SOL cashback. `quote_token_program`
must match the quote mint's token program.

### Claim Legacy SOL-Paired Mint Cashback

```rust
use pump_rust_client::{constants, PumpSdk};
use solana_sdk::pubkey::Pubkey;

let sdk = PumpSdk::new();

let ix = sdk.claim_cashback_v2_instruction(
    user.pubkey(),
    Pubkey::default(),               // quote_mint — default → wSOL
    constants::SPL_TOKEN_PROGRAM_ID, // quote_token_program
);
```

### Claim USDC-Paired Mint Cashback

```rust
let usdc = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

let ix = sdk.claim_cashback_v2_instruction(
    user.pubkey(),
    usdc,                            // quote_mint
    constants::SPL_TOKEN_PROGRAM_ID, // quote_token_program
);
```
