# Creator Fee Sharing

> **Note:** These instructions only apply to coins that **have** a `sharing_config` — i.e. coins whose creator vault has been migrated to the Pump Fees program for multi-recipient distribution. For single-creator-recipient coins (no `sharing_config`), use [`collect_creator_fee_v2` / `collect_coin_creator_fee`](./COLLECT_CREATOR_FEE.md) instead.

The lifecycle is:

1. `create_fee_sharing_config` (Pump Fees) — opt the coin into shared distribution. Migrates the bonding curve creator (and AMM `pool.coin_creator` if graduated) to the new `sharing_config` PDA.
2. `update_fee_shares_v2` (Pump Fees) — set the final list of shareholders. Sweeps any pending creator fees from both the AMM and the bonding curve via CPI before applying the new shares. Can only be called once per `sharing_config` (the admin is revoked after).
3. `transfer_creator_fees_to_pump_v2` (Pump AMM) — sweep coin creator fees accrued on the AMM into the bonding curve's creator vault so they can be distributed by the pump program. Permissionless.
4. `distribute_creator_fees_v2` (Pump program) — pay out the bonding curve's creator vault to each shareholder according to their `share_bps`. Permissionless.

For every token account in the tables below, the third column tells you who is responsible for initialization: whether the caller must initialize it beforehand, whether the instruction will initialize it on the fly, or whether it can be left uninitialized when `quote_mint` is wrapped SOL (the SOL-paired code path never touches it).

## `create_fee_sharing_config` (Pump Fees)

Creates the `sharing_config` PDA for a coin and CPIs into the Pump program (and the Pump AMM program if the coin has graduated) to point the creator vault at `sharing_config`. The initial shareholder set is `[(creator, 10_000 bps)]`. Callable by either the global `admin_set_creator_authority` or the current coin creator.

### Accounts


| #   | Account                       | Seeds / derivation                                                                                                                                              | `init_if_needed` / SOL cost |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `event_authority`             | Pump Fees PDA: seeds `[b"__event_authority"]`.                                                                                                                  | -                           |
| 2   | `program`                     | Pump Fees program account.                                                                                                                                      | -                           |
| 3   | `payer`                       | Transaction signer. Must be `global.admin_set_creator_authority` or the coin creator (`bonding_curve.creator` for pre-graduation, `pool.coin_creator` for graduated coins). Pays the rent for `sharing_config`. | -                           |
| 4   | `global`                      | Pump PDA: seeds `[b"global"]`.                                                                                                                                  | -                           |
| 5   | `mint`                        | Base token mint.                                                                                                                                                | -                           |
| 6   | `sharing_config`              | Pump Fees PDA: seeds `[b"sharing-config", mint]`. Allocates up to `SharingConfig::MAX_SIZE` (1024 bytes). Calling twice is a no-op.                              | Rent for a 1024-byte account |
| 7   | `system_program`              | System Program: `11111111111111111111111111111111`.                                                                                                             | -                           |
| 8   | `bonding_curve`               | Pump PDA: seeds `[b"bonding-curve", mint]`. Mutated by the CPI into `pump::migrate_bonding_curve_creator` (its `creator` field is updated to `sharing_config`).  | -                           |
| 9   | `pump_program`                | Pump program account.                                                                                                                                           | -                           |
| 10  | `pump_event_authority`        | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                       | -                           |
| 11  | `pool`                        | Optional. Pump AMM `Pool` account for the coin. **Required** if the coin has graduated; omit otherwise.                                                          | -                           |
| 12  | `pump_amm_program`            | Optional. Pump AMM program account. **Required** if `pool` is set.                                                                                              | -                           |
| 13  | `pump_amm_event_authority`    | Optional. Pump AMM PDA: seeds `[b"__event_authority"]`. **Required** if `pool` is set.                                                                          | -                           |


### Instruction Data

`create_fee_sharing_config` takes no instruction data arguments.

## `update_fee_shares_v2` (Pump Fees)

Sets the final shareholder list on the `sharing_config` and revokes further admin updates. Before applying the new shares, this instruction CPIs into the AMM to sweep any AMM-side creator fees into the bonding curve (if the coin has graduated and the AMM-side vault has accrued fees), and CPIs into the Pump program to distribute any currently pending bonding-curve creator fees to the **current** shareholder list. Callable by the `sharing_config.admin`.

### Accounts


| #   | Account                       | Seeds / derivation                                                                                                                                                                                                          | `init_if_needed` / SOL cost |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `event_authority`             | Pump Fees PDA: seeds `[b"__event_authority"]`.                                                                                                                                                                              | -                           |
| 2   | `program`                     | Pump Fees program account.                                                                                                                                                                                                  | -                           |
| 3   | `authority`                   | Transaction signer. Must equal `sharing_config.admin`.                                                                                                                                                                       | -                           |
| 4   | `global`                      | Pump PDA: seeds `[b"global"]`.                                                                                                                                                                                              | -                           |
| 5   | `mint`                        | Base token mint.                                                                                                                                                                                                            | -                           |
| 6   | `sharing_config`              | Pump Fees PDA: seeds `[b"sharing-config", mint]`. Must already exist and have `version != 1` (i.e. created by the V2 deployment).                                                                                            | -                           |
| 7   | `bonding_curve`               | Pump PDA: seeds `[b"bonding-curve", mint]`. Used by the CPI into `distribute_creator_fees_v2`.                                                                                                                              | -                           |
| 8   | `pump_creator_vault`          | Pump PDA: seeds `[b"creator-vault", sharing_config]`. Source of the bonding-curve-side creator fees.                                                                                                                         | -                           |
| 9   | `pump_creator_vault_ata`      | Associated token PDA for `(pump_creator_vault, token_program, quote_mint)`. Source of the token transfer for non-native quote mints during the CPI'd distribution.                                                            | Expected to be initialized; may be uninitialized when `quote_mint` is wrapped SOL. |
| 10  | `system_program`              | System Program: `11111111111111111111111111111111`.                                                                                                                                                                         | -                           |
| 11  | `pump_program`                | Pump program account.                                                                                                                                                                                                       | -                           |
| 12  | `pump_event_authority`        | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                                                                                   | -                           |
| 13  | `pump_amm_program`            | Pump AMM program account.                                                                                                                                                                                                   | -                           |
| 14  | `amm_event_authority`         | Pump AMM PDA: seeds `[b"__event_authority"]`.                                                                                                                                                                               | -                           |
| 15  | `quote_mint`                  | Quote mint for the coin. For SOL-paired coins, pass wrapped SOL: `So11111111111111111111111111111111111111112`.                                                                                                              | -                           |
| 16  | `token_program`               | Token program for `quote_mint`.                                                                                                                                                                                             | -                           |
| 17  | `associated_token_program`    | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                                                                                   | -                           |
| 18  | `coin_creator_vault_authority`| Pump AMM PDA: seeds `[b"creator_vault", sharing_config]`. Used by the AMM-sweep CPI when the coin has graduated.                                                                                                              | -                           |
| 19  | `coin_creator_vault_ata`      | Associated token PDA for `(coin_creator_vault_authority, token_program, quote_mint)`. Source of the AMM-sweep CPI.                                                                                                            | Expected to be initialized; may be uninitialized when `quote_mint` is wrapped SOL. |


### Remaining Accounts

The remaining accounts are forwarded to the inner `distribute_creator_fees_v2` CPI and follow its shape:

| Quote mint                    | Layout of `remainingAccounts`                                                  |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Wrapped SOL                   | `[shareholder_1, …, shareholder_N]`                                            |
| Non-native (e.g. USDC)        | `[shareholder_1, …, shareholder_N, ata_1, …, ata_N]` where `ata_i` is the ATA for `(shareholder_i, token_program, quote_mint)`. |

The order must match the current `sharing_config.shareholders`. For non-native quote mints, missing shareholder ATAs are created on the fly by the CPI'd `distribute_creator_fees_v2` (which is invoked with `initialize_ata = true` from this instruction).

### Instruction Data

| #   | Argument       | Type                | Description / validation                                                                                                                                                                                                                                       | Optional? |
| --- | -------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | `shareholders` | `Vec<Shareholder>`  | New list of `{ address, share_bps }`. Must be non-empty, contain at most 10 entries, have no duplicates, every `share_bps > 0`, and `sum(share_bps) == 10_000`. Replaces the current shareholders and sets `admin_revoked = true`, so this instruction can only effectively be used once per `sharing_config`. | No        |

## `transfer_creator_fees_to_pump_v2` (Pump AMM)

Sweeps coin creator fees accrued on the Pump AMM out of the AMM coin creator vault and into the Pump program's `creator_vault` for the same creator, so they can be paid out via `distribute_creator_fees_v2`. Permissionless. For wrapped-SOL quotes the instruction unwraps via close-and-recreate to forward lamports directly to `pump_creator_vault`; for non-native quotes it does a token transfer between ATAs and creates the destination ATA if needed.

### Accounts


| #   | Account                       | Seeds / derivation                                                                                                                       | `init_if_needed` / SOL cost                              |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | `payer`                       | Transaction signer. Pays the rent for `pump_creator_vault_ata` when it is initialized by the instruction (non-native quote only).         | -                                                        |
| 2   | `quote_mint`                  | Quote mint for the coin. For SOL-paired coins, pass wrapped SOL: `So11111111111111111111111111111111111111112`.                          | -                                                        |
| 3   | `token_program`               | Token program for `quote_mint`.                                                                                                          | -                                                        |
| 4   | `system_program`              | System Program: `11111111111111111111111111111111`.                                                                                      | -                                                        |
| 5   | `associated_token_program`    | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                | -                                                        |
| 6   | `coin_creator`                | Coin creator account (the `sharing_config` PDA once the coin has been migrated).                                                          | -                                                        |
| 7   | `coin_creator_vault_authority`| Pump AMM PDA: seeds `[b"creator_vault", coin_creator]`. Authority over `coin_creator_vault_ata`. Mutated when its lamports are forwarded for wrapped SOL. | -                                                        |
| 8   | `coin_creator_vault_ata`      | Associated token account for `quote_mint`, owned by `coin_creator_vault_authority`, using `token_program`. Source of the transfer.       | Must be initialized.                                     |
| 9   | `pump_creator_vault`          | Pump PDA: seeds `[b"creator-vault", coin_creator]`. Destination of the lamport transfer for wrapped SOL.                                  | -                                                        |
| 10  | `pump_creator_vault_ata`      | Associated token PDA for `(pump_creator_vault, token_program, quote_mint)`. Destination of the token transfer for non-native quotes.      | Expected to be initialized; initialized by the instruction if empty (non-native quote only). For wrapped SOL the account is unused and may be uninitialized. |
| 11  | `event_authority`             | Pump AMM PDA: seeds `[b"__event_authority"]`.                                                                                            | -                                                        |
| 12  | `program`                     | Pump AMM program account.                                                                                                                | -                                                        |


### Instruction Data

`transfer_creator_fees_to_pump_v2` takes no instruction data arguments.

## `distribute_creator_fees_v2` (Pump program)

Pays out the bonding curve creator vault to every shareholder in `sharing_config.shareholders` proportionally to their `share_bps`. Permissionless. For wrapped-SOL quotes the instruction transfers lamports directly to each shareholder address (leaving the vault rent-exempt). For non-native quotes it transfers tokens from the vault's ATA to each shareholder's ATA, and — if `initialize_ata = true` is passed — creates any missing shareholder ATAs along the way (paid for by `payer`).

### Accounts


| #   | Account                              | Seeds / derivation                                                                                                                                       | `init_if_needed` / SOL cost |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | `payer`                              | Transaction signer. Pays the rent for any shareholder ATAs created during this call when `initialize_ata = true`.                                         | -                           |
| 2   | `mint`                               | Base token mint.                                                                                                                                         | -                           |
| 3   | `bonding_curve`                      | Pump PDA: seeds `[b"bonding-curve", mint]`. Must have `bonding_curve.creator == sharing_config`.                                                          | -                           |
| 4   | `sharing_config`                     | Pump Fees PDA: seeds `[b"sharing-config", mint]`. Must be `Active`.                                                                                       | -                           |
| 5   | `creator_vault`                      | Pump PDA: seeds `[b"creator-vault", sharing_config]` (since `bonding_curve.creator == sharing_config`). Source of the distribution.                       | -                           |
| 6   | `system_program`                     | System Program: `11111111111111111111111111111111`.                                                                                                       | -                           |
| 7   | `event_authority`                    | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                | -                           |
| 8   | `program`                            | Pump program account.                                                                                                                                    | -                           |
| 9   | `creator_vault_quote_token_account`  | Associated token PDA for `(creator_vault, quote_token_program, quote_mint)`. Source of the token transfer for non-native quotes.                          | Expected to be initialized; may be uninitialized when `quote_mint` is wrapped SOL. |
| 10  | `quote_mint`                         | Quote mint for the coin. For SOL-paired coins, pass wrapped SOL: `So11111111111111111111111111111111111111112`. Must match the bonding curve's quote mint. | -                           |
| 11  | `quote_token_program`                | Token program for `quote_mint`.                                                                                                                          | -                           |
| 12  | `associated_token_program`           | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                | -                           |


### Remaining Accounts

| Quote mint                    | Layout of `remainingAccounts`                                                  |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Wrapped SOL                   | `[shareholder_1, …, shareholder_N]`                                            |
| Non-native (e.g. USDC)        | `[shareholder_1, …, shareholder_N, ata_1, …, ata_N]` where `ata_i` is the ATA for `(shareholder_i, quote_token_program, quote_mint)`. |

The order must match `sharing_config.shareholders` exactly. For wrapped-SOL coins, each shareholder receives lamports directly and only the wallet pubkeys are required. For non-native quote coins, each `ata_i` is enforced to be the canonical ATA for that shareholder; if `initialize_ata = true` is passed, any missing ATAs are created on the fly (rent paid by `payer`), and if `initialize_ata = false` the instruction fails on the first uninitialized ATA.

### Instruction Data

| #   | Argument         | Type   | Description / validation                                                                                                                                                                                                  | Optional? |
| --- | ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | `initialize_ata` | `bool` | If `true`, the instruction will create any missing shareholder ATAs (paid by `payer`) before transferring tokens. If `false`, missing ATAs cause the instruction to fail. Ignored for wrapped-SOL coins (no ATAs involved). | No        |

## TS SDK

End-to-end flow: opt the coin into fee sharing, set the final shareholder list, and (after fees have accrued from trading) sweep AMM-side fees into the bonding curve vault and distribute them to the shareholders.

### SOL-Paired Coin

For SOL-paired coins, use wrapped SOL as the `quoteMint` and the SPL token program as `quoteTokenProgram`.

```ts
import { PUMP_SDK, feeSharingConfigPda } from "@pump-fun/pump-sdk";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";

// 1. Opt the coin into shared distribution. After this CPI, `bonding_curve.creator`
//    (and `pool.coin_creator` if graduated) point at `sharing_config`, and the
//    default shareholder list is `[(creator, 10_000 bps)]`.
const createSharingConfigIx = await PUMP_SDK.createFeeSharingConfig({
  creator,
  mint,
  pool, // canonical Pump AMM pool, or `null` if the coin hasn't graduated
});

// 2. Set the final shareholder list. Sweeps any pending bonding-curve creator fees
//    to the *current* shareholders before applying the new list, then revokes
//    further admin updates on this sharing_config.
const updateFeeSharesIx = await PUMP_SDK.updateFeeSharesV2({
  authority: creator, // = sharing_config.admin (bonding_curve.creator at this point)
  mint,
  currentShareholders: [creator], // matches what was set by `createFeeSharingConfig`
  newShareholders: [
    { address: wallet1, shareBps: 5000 }, // 50%
    { address: wallet2, shareBps: 3000 }, // 30%
    { address: wallet3, shareBps: 2000 }, // 20%
  ],
  quoteMint: NATIVE_MINT,
  quoteTokenProgram: TOKEN_PROGRAM_ID,
});

// --- Trades occur over time and creator fees accumulate in the bonding curve
//     creator vault and, for graduated coins, in the AMM coin creator vault. ---

// 3. (Graduated coins only.) Sweep AMM-side creator fees into the bonding curve
//    creator vault so they can be distributed alongside the bonding-curve fees.
const transferIx = await PUMP_SDK.transferCreatorFeesToPumpV2({
  payer: user,
  mint,
  quoteMint: NATIVE_MINT,
  quoteTokenProgram: TOKEN_PROGRAM_ID,
});

// 4. Distribute the accumulated bonding-curve creator fees to the shareholders.
const sharingConfigAddress = feeSharingConfigPda(mint);
const sharingConfigAccountInfo = await connection.getAccountInfo(
  sharingConfigAddress,
);
const sharingConfig = PUMP_SDK.decodeSharingConfig(sharingConfigAccountInfo!);

const distributeIx = await PUMP_SDK.distributeCreatorFeesV2({
  mint,
  sharingConfig,
  sharingConfigAddress,
  quoteMint: NATIVE_MINT,
  payer: user,
  shouldInitializeAta: true, // create missing recipient ATAs (non-WSOL only)
  quoteTokenProgram: TOKEN_PROGRAM_ID,
});
```

### USDC-Paired Coin

For USDC-paired coins, pass the USDC mint as `quoteMint` and the USDC token program as `quoteTokenProgram`. Setting `shouldInitializeAta: true` on the distribute call ensures any missing shareholder USDC ATAs are created on the fly (rent paid by `payer`).

```ts
import { PUMP_SDK, feeSharingConfigPda } from "@pump-fun/pump-sdk";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const quoteMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const quoteTokenProgram = TOKEN_PROGRAM_ID;

// 1. Opt the coin into shared distribution.
const createSharingConfigIx = await PUMP_SDK.createFeeSharingConfig({
  creator,
  mint,
  pool, // canonical Pump AMM pool, or `null` if the coin hasn't graduated
});

// 2. Set the final shareholder list. For non-WSOL quotes, the inner CPI distributes
//    pending fees as USDC, so the current shareholder ATAs must already exist (the
//    initial shareholder is just `creator`, whose ATA will be auto-created here).
const updateFeeSharesIx = await PUMP_SDK.updateFeeSharesV2({
  authority: creator,
  mint,
  currentShareholders: [creator],
  newShareholders: [
    { address: wallet1, shareBps: 5000 },
    { address: wallet2, shareBps: 3000 },
    { address: wallet3, shareBps: 2000 },
  ],
  quoteMint,
  quoteTokenProgram,
});

// --- Trades occur over time and creator fees accumulate in the bonding curve
//     creator vault and, for graduated coins, in the AMM coin creator vault. ---

// 3. (Graduated coins only.) Sweep AMM-side creator fees into the bonding curve
//    creator vault. For non-WSOL quotes this transfers tokens via ATAs and creates
//    the destination `pump_creator_vault_ata` on the fly if it doesn't exist yet
//    (rent paid by `payer`).
const transferIx = await PUMP_SDK.transferCreatorFeesToPumpV2({
  payer: user,
  mint,
  quoteMint,
  quoteTokenProgram,
});

// 4. Distribute the accumulated USDC creator fees to the shareholders.
const sharingConfigAddress = feeSharingConfigPda(mint);
const sharingConfigAccountInfo = await connection.getAccountInfo(
  sharingConfigAddress,
);
const sharingConfig = PUMP_SDK.decodeSharingConfig(sharingConfigAccountInfo!);

const distributeIx = await PUMP_SDK.distributeCreatorFeesV2({
  mint,
  sharingConfig,
  sharingConfigAddress,
  quoteMint,
  payer: user,
  shouldInitializeAta: true, // create missing shareholder USDC ATAs as needed
  quoteTokenProgram,
});
```

## Rust SDK

Sweep AMM-side creator fees into the bonding curve vault, then distribute them to the shareholders. `quote_mint` can be wrapped SOL or USDC, pass the matching token program as `quote_token_program`.

```rust
use pump_rust_client::accounts::decode_sharing_config;
use pump_rust_client::accounts::pump_amm::decode_pool;
use pump_rust_client::constants::NATIVE_MINT;
use pump_rust_client::{constants, pda, PumpSdk};
use solana_sdk::compute_budget::ComputeBudgetInstruction;
use solana_sdk::pubkey::Pubkey;

let sdk = PumpSdk::new();

// For SOL-paired coins:
let quote_mint = NATIVE_MINT;
let quote_token_program = constants::SPL_TOKEN_PROGRAM_ID;
// For USDC-paired coins, set `quote_mint` to the USDC mint instead
// (token program remains `SPL_TOKEN_PROGRAM_ID`).

let pool_creator = pda::pump::pool_authority(&mint).0;
let pool_address = pda::pump_amm::pool(0, &pool_creator, &mint, &quote_mint).0;
let pool = decode_pool(&rpc.get_account(&pool_address).await?.data)?;

// 1. (Graduated coins only.) Sweep AMM-side creator fees into the bonding
//    curve creator vault.
let transfer_ix = sdk.transfer_creator_fees_to_pump_v2_instruction(
    payer,
    pool.coin_creator,
    quote_mint,
    quote_token_program,
);

// 2. Distribute the bonding curve creator vault to the shareholders.
let sharing_config = decode_sharing_config(
    &rpc.get_account(&pda::pump::sharing_config(&mint).0).await?.data,
)?;
let shareholders: Vec<Pubkey> = sharing_config
    .shareholders
    .iter()
    .map(|s| s.address)
    .collect();

let bc = client.fetch_bonding_curve(&mint).await?;

let mut ixs = vec![
    ComputeBudgetInstruction::set_compute_unit_limit(400_000),
    transfer_ix,
];
ixs.extend(sdk.distribute_creator_fees_v2_instructions(
    payer,
    mint,
    bc.creator,
    quote_mint,
    quote_token_program,
    false,
    true,
    &shareholders,
));
```
