# Collect Creator Fee

> **Note:** These instructions only apply to coins that do **not** have a `sharing_config` — i.e. single-creator-recipient coins. Once a coin's creator vault has been migrated to a `sharing_config`, fees must be distributed through the Pump Fees program instead, and both instructions below will fail.

Coin creators accrue fees in two separate vaults:

1. A **bonding curve creator vault** held by the Pump program, drained via `collect_creator_fee_v2`.
2. An **AMM coin creator vault** held by the Pump AMM program (post-migration), drained via `collect_coin_creator_fee`.

The two instructions are independent: a creator typically calls both to fully sweep their fees. Unlike the legacy `collect_creator_fee`, the V2 / AMM variants use a unified account layout that supports both SOL-paired and non-SOL-paired coins.

## `collect_creator_fee_v2` (Bonding Curve)

The `collect_creator_fee_v2` instruction sweeps creator fees out of the bonding curve creator vault into the creator's wallet (for SOL-paired coins) or the creator's token account (for non-SOL-paired coins). It is permissionless: anyone can call it for a given creator.

### Accounts


| #   | Account                       | Seeds / derivation                                                                                                                                                                  | `init_if_needed` / SOL cost |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `creator`                     | The coin creator account that receives the fees. Must not be owned by the Pump Fees program (otherwise the vault has been migrated to a `sharing_config`) and must not be executable. | -                           |
| 2   | `creator_token_account`       | Associated token PDA for `(creator, quote_token_program, quote_mint)`. Destination of the token transfer.                                                                           | Expected to be initialized; may be uninitialized when `quote_mint` is wrapped SOL. |
| 3   | `creator_vault`               | Pump PDA: seeds `[b"creator-vault", creator]`. Holds the accrued creator fees (either as lamports for SOL-paired coins or as a token-account authority for non-SOL coins).          | -                           |
| 4   | `creator_vault_token_account` | Associated token PDA for `(creator_vault, quote_token_program, quote_mint)`. Source of the token transfer.                                                                          | Expected to be initialized; may be uninitialized when `quote_mint` is wrapped SOL. |
| 5   | `quote_mint`                  | Quote mint for the coin. For SOL-paired coins, pass wrapped SOL: `So11111111111111111111111111111111111111112`.                                                                     | -                           |
| 6   | `quote_token_program`         | Token program for `quote_mint`.                                                                                                                                                     | -                           |
| 7   | `associated_token_program`    | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                                           | -                           |
| 8   | `system_program`              | System Program: `11111111111111111111111111111111`.                                                                                                                                 | -                           |
| 9   | `event_authority`             | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                                           | -                           |
| 10  | `program`                     | Pump program account.                                                                                                                                                               | -                           |


When `quote_mint` is wrapped SOL the program performs a lamport transfer from `creator_vault` to `creator`, leaving the vault rent-exempt, and `creator_token_account` / `creator_vault_token_account` are unused. For non-SOL quotes the program reads the balance of `creator_vault_token_account` and transfers it via `quote_token_program` into `creator_token_account`.

## `collect_coin_creator_fee` (Pump AMM)

The `collect_coin_creator_fee` instruction sweeps coin creator fees that have accrued on the Pump AMM out of the coin creator's vault ATA into the coin creator's token account. It is permissionless: anyone can call it for a given coin creator. The coin creator account must not be owned by the Pump Fees program (otherwise the vault has been migrated to a `sharing_config`).

### Accounts


| #   | Account                        | Seeds / derivation                                                                                                                                            | `init_if_needed` / SOL cost |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `quote_mint`                   | Quote mint for the coin. For SOL-paired coins, pass wrapped SOL: `So11111111111111111111111111111111111111112`.                                               | -                           |
| 2   | `quote_token_program`          | Token program for `quote_mint`.                                                                                                                               | -                           |
| 3   | `coin_creator`                 | Coin creator account. Must not be owned by the Pump Fees program.                                                                                             | -                           |
| 4   | `coin_creator_vault_authority` | Pump AMM PDA: seeds `[b"creator_vault", coin_creator]`. Authority over `coin_creator_vault_ata`.                                                              | -                           |
| 5   | `coin_creator_vault_ata`       | Associated token account for `quote_mint`, owned by `coin_creator_vault_authority`, using `quote_token_program`. Source of the transfer.                      | Must be initialized.        |
| 6   | `coin_creator_token_account`   | Token account for `quote_mint` owned by `coin_creator`, using `quote_token_program`. Destination of the transfer.                                             | Must be initialized.        |
| 7   | `event_authority`              | Pump AMM PDA: seeds `[b"__event_authority"]`.                                                                                                                 | -                           |
| 8   | `program`                      | Pump AMM program account.                                                                                                                                     | -                           |

## Rust SDK

Sweep the bonding curve creator vault, and (if the coin has graduated) the AMM coin creator vault. `quote_mint` can be wrapped SOL or USDC, pass the matching token program as `quote_token_program`.

```rust
use pump_rust_client::accounts::pump_amm::decode_pool;
use pump_rust_client::constants::NATIVE_MINT;
use pump_rust_client::{constants, pda, PumpSdk};
use solana_sdk::compute_budget::ComputeBudgetInstruction;

let sdk = PumpSdk::new();

// For SOL-paired coins:
let quote_mint = NATIVE_MINT;
let quote_token_program = constants::SPL_TOKEN_PROGRAM_ID;
// For USDC-paired coins, set `quote_mint` to the USDC mint instead
// (token program remains `SPL_TOKEN_PROGRAM_ID`).

let mut ixs = vec![ComputeBudgetInstruction::set_compute_unit_limit(200_000)];

if graduated {
    let pool_creator = pda::pump::pool_authority(&mint).0;
    let pool_address = pda::pump_amm::pool(0, &pool_creator, &mint, &quote_mint).0;
    let pool = decode_pool(&rpc.get_account(&pool_address).await?.data)?;

    ixs.extend(sdk.collect_coin_creator_fee_instructions(
        payer,
        pool.coin_creator,
        quote_mint,
        quote_token_program,
        true,
    ));
}

// 2. Sweep the bonding curve creator vault to `creator`.
ixs.extend(sdk.collect_creator_fee_v2_instructions(
    payer,
    creator,
    quote_mint,
    quote_token_program,
    true,
));
```
