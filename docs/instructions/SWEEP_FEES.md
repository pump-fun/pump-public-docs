# Fees Kept on the Curve and Pool, and How to Sweep Them

The new trade instructions ([`buy_v3` / `sell_v3`](TRADE_V3.md) on the bonding curve, [`buy_v2` / `sell_v2`](PUMP_SWAP_TRADE_V2.md) on PumpSwap, and [`multi_hop_swap`](MULTI_HOP_SWAP.md)) **do not pay the protocol fee and the creator fee out on every trade**. They keep the money where the trade happened and write down how much is waiting. Anyone can pay it out later with a sweep instruction.

| Where the trade happened | Protocol fee waits in         | Creator fee waits in       | The money sits in                                                       |
| ------------------------ | ----------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| Bonding curve (Pump)     | `BondingCurve.protocol_fees`  | `BondingCurve.creator_fee` | The curve's lamports (SOL-paired) or the curve's quote token account.   |
| Pool (PumpSwap)          | `Pool.protocol_fees`          | `Pool.creator_fees`        | The pool's quote vault (`pool_quote_token_account`).                    |

What does not change:

- **Fee amounts are the same.** Only the moment they are paid out changes.
- **The buyback part of the protocol fee is still paid in the trade**, to the `buyback_fee_recipient` account. It never waits.
- **The LP fee on pools is unchanged.** It goes into the reserves on every trade.
- **Old instructions still pay fees per trade** as before: `buy`, `sell`, `buy_v2`, `sell_v2`, `buy_exact_quote_in_v2` on Pump, and `buy`, `sell`, `buy_exact_quote_in` on PumpSwap. Old and new trades can be mixed on the same coin.
- The creator fee is treated the same for every kind of creator: a wallet, a fee sharing config or a holder rewards coin.

## Sweep instructions

Four permissionless instructions pay the waiting fees out. Anyone can call them; the `payer` only pays small rent costs (a token account for the destination if it is missing, and a rent top-up if the curve or pool still has an older layout). Calling a sweep when nothing is waiting is fine and does nothing.

| Program  | Instruction          | Pays out                     | To (`recipient`)                                                                                                   |
| -------- | -------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Pump     | `sweep_protocol_fee` | `BondingCurve.protocol_fees` | One of the 8 normal fee recipients, or one of the 8 reserved fee recipients for a mayhem coin. See [Fee Recipients](../FEE_RECIPIENTS.md). |
| Pump     | `sweep_creator_fee`  | `BondingCurve.creator_fee`   | The creator vault of `bonding_curve.creator`: Pump PDA `[b"creator-vault", bonding_curve.creator]`.                  |
| PumpSwap | `sweep_protocol_fee` | `Pool.protocol_fees`         | One of the 8 protocol fee recipients, or a reserved one for a mayhem pool. Same addresses as above.                 |
| PumpSwap | `sweep_creator_fee`  | `Pool.creator_fees`          | The coin creator vault authority of `pool.coin_creator`: PumpSwap PDA `[b"creator_vault", pool.coin_creator]`.      |

The destination is fixed by the instruction, so a sweep can only move the money to where a v2 (Pump) or v1 (PumpSwap) trade would have paid it. A bonding curve sweep also works after the coin has migrated: migration moves the reserves, not the waiting fees.

## Which sweep to call, and when

**Protocol fee.** pump.fun runs `sweep_protocol_fee` on both programs. Integrators do not need to call it.

**Creator fee.** A creator's fee is only in the creator vault after a `sweep_creator_fee`. Call it right before the existing claim or distribute instruction, in the same transaction:

1. Coin with a single creator (no sharing config):
   - Pump `sweep_creator_fee`, then [`collect_creator_fee_v2`](COLLECT_CREATOR_FEE.md).
   - If the coin has migrated: PumpSwap `sweep_creator_fee`, then [`collect_coin_creator_fee`](COLLECT_CREATOR_FEE.md).
2. Coin with a sharing config ([Creator Fee Sharing](CREATOR_FEE_SHARING.md)):
   - Pump `sweep_creator_fee` (and PumpSwap `sweep_creator_fee` if migrated), then `transfer_creator_fees_to_pump_v2` and `distribute_creator_fees_v2`.
3. Holder rewards coins: the same two sweeps. The creator fee lands in the holder rewards vault, and the usual [holder rewards](../HOLDER_REWARDS_README.md) flow pays it out.

These instructions refuse to run while a creator fee is still waiting, so a creator fee sweep must come first in the same transaction:

| Instruction                                                            | Program   | Error if not swept                        |
| ---------------------------------------------------------------------- | --------- | ----------------------------------------- |
| `distribute_creator_fees` / `distribute_creator_fees_v2`               | Pump      | `CreatorFeesNotSwept` (6095)              |
| `admin_cto`                                                            | Pump      | `CreatorFeesNotSwept` (6095)              |
| `create_fee_sharing_config` (through `migrate_bonding_curve_creator`)  | Pump      | `CreatorFeesNotSwept` (6095)              |
| `admin_cto_pool`                                                       | PumpSwap  | `CreatorFeesNotSwept` (6081)              |
| `create_fee_sharing_config` (through `migrate_pool_coin_creator`)      | PumpSwap  | `CreatorFeesNotSwept` (6081)              |
| `update_fee_shares` / `update_fee_shares_v2`                           | Pump Fees | `PoolCreatorFeesNotSwept` (6033)          |

A short rule of thumb: **before you touch who the creator is, or pay the creator out, sweep the creator fee first** on the curve and, if the coin has migrated, on the pool.

## Accounts

### Pump `sweep_protocol_fee` and `sweep_creator_fee`

Both take the same 13 accounts.

| #   | Account                          | Seeds / derivation                                                                                                                                                              | `init_if_needed` / SOL cost                                  |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | `payer`                          | Transaction signer. Pays the rent costs below.                                                                                                                                  | -                                                            |
| 2   | `global`                         | Pump PDA: seeds `[b"global"]`.                                                                                                                                                  | -                                                            |
| 3   | `base_mint`                      | Base token mint of the coin.                                                                                                                                                    | -                                                            |
| 4   | `quote_mint`                     | Quote mint of the coin. For SOL-paired coins pass wrapped SOL: `So11111111111111111111111111111111111111112`.                                                                   | -                                                            |
| 5   | `quote_token_program`            | Token program of `quote_mint`.                                                                                                                                                  | -                                                            |
| 6   | `associated_token_program`       | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                                       | -                                                            |
| 7   | `system_program`                 | System Program: `11111111111111111111111111111111`.                                                                                                                             | -                                                            |
| 8   | `bonding_curve`                  | Pump PDA: seeds `[b"bonding-curve", base_mint]`. Writable.                                                                                                                      | Rent top-up if the account still has an older layout.        |
| 9   | `associated_quote_bonding_curve` | Associated token account for `quote_mint`, owned by `bonding_curve`. Writable. For SOL-paired coins pass the derived address; it is not used.                                                                   | -                                                            |
| 10  | `recipient`                      | `sweep_protocol_fee`: a normal fee recipient (reserved one for mayhem coins). `sweep_creator_fee`: the creator vault PDA `[b"creator-vault", bonding_curve.creator]`. Writable. | `sweep_creator_fee` on a SOL-paired coin: rent top-up for the vault if needed. |
| 11  | `associated_quote_recipient`     | Associated token account for `quote_mint`, owned by `recipient`. Writable. For SOL-paired coins pass the derived address; it is not used.                                                                       | ATA rent if missing (token-paired coins).                    |
| 12  | `event_authority`                | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                                       | -                                                            |
| 13  | `program`                        | Pump program account.                                                                                                                                                           | -                                                            |

No instruction data.

### PumpSwap `sweep_protocol_fee` and `sweep_creator_fee`

Both take the same 12 accounts.

| #   | Account                    | Seeds / derivation                                                                                                                                                                    | `init_if_needed` / SOL cost                           |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | `payer`                    | Transaction signer. Pays the rent costs below.                                                                                                                                        | -                                                     |
| 2   | `global_config`            | PumpSwap PDA: seeds `[b"global_config"]`. Address: `ADyA8hdefvWN2dbGGWFotbzWxrAvLW83WG6QCVXvJKqw`.                                                                                    | -                                                     |
| 3   | `pool`                     | The `Pool` account. Writable.                                                                                                                                                         | Rent top-up if the account still has an older layout. |
| 4   | `quote_mint`               | `pool.quote_mint`.                                                                                                                                                                    | -                                                     |
| 5   | `quote_token_program`      | Token program of `quote_mint`.                                                                                                                                                        | -                                                     |
| 6   | `pool_quote_token_account` | `pool.pool_quote_token_account`. Writable.                                                                                                                                            | -                                                     |
| 7   | `recipient`                | `sweep_protocol_fee`: a protocol fee recipient (reserved one for mayhem pools). `sweep_creator_fee`: the coin creator vault authority PDA `[b"creator_vault", pool.coin_creator]`.    | -                                                     |
| 8   | `recipient_token_account`  | Associated token account for `quote_mint`, owned by `recipient`. Writable.                                                                                                            | ATA rent if missing.                                  |
| 9   | `system_program`           | System Program: `11111111111111111111111111111111`.                                                                                                                                   | -                                                     |
| 10  | `associated_token_program` | Associated Token Program: `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`.                                                                                                             | -                                                     |
| 11  | `event_authority`          | PumpSwap PDA: seeds `[b"__event_authority"]`.                                                                                                                                         | -                                                     |
| 12  | `program`                  | PumpSwap program account.                                                                                                                                                             | -                                                     |

No instruction data.

## Events

- A trade that keeps its fee says so in its event: `TradeEvent.fee_recipient` (Pump v3) and `BuyEvent` / `SellEvent.protocol_fee_recipient` (PumpSwap v2) are the zero key `11111111111111111111111111111111`. The fee fields still carry the amounts charged. `creator_fee_unclaimed` is the creator fee waiting after the trade.
- A sweep emits `SweepBondingCurveFeeEvent` (Pump) or `SweepPoolFeeEvent` (PumpSwap) with `recipient`, `amount` and `bucket`: `0` for the protocol fee, `1` for the creator fee.

For indexers: fee income is in the trade events (when it is charged), payouts are in the sweep events (when it is paid). Do not count both as income.

## Account layout

`BondingCurve` and `Pool` have new fields appended at the end for the waiting fees. Accounts written before the upgrade are shorter; read the missing trailing fields as `0`, as with earlier appended fields. An old account grows on its first new-style trade or sweep (the trader or payer pays the small rent difference). Anyone can also grow it up front with the permissionless `extend_account` instruction on either program. A few write instructions on an account that has not grown yet fail until it does, for example PumpSwap `deposit` / `withdraw` on a pool that has not traded since the upgrade, so LPs on quiet pools should call `extend_account` on the pool first.

## Related

- [Virtual quote reserves and fees](../VIRTUAL_QUOTE_RESERVES_FEE_ADJUSTMENT.md): why the fees kept in a pool make `virtual_quote_reserves` negative.
- [Collect creator fee](COLLECT_CREATOR_FEE.md) and [Creator fee sharing](CREATOR_FEE_SHARING.md): the claim and distribute instructions a sweep comes before.

## SDKs

- TypeScript, Pump: [`@pump-fun/pump-sdk` 4.0.0](https://www.npmjs.com/package/@pump-fun/pump-sdk/v/4.0.0). `sweepProtocolFeeInstruction` and `sweepCreatorFeeInstruction` for the curve, `sweepPoolCreatorFeeInstruction` for the pool's creator fee. `OnlinePumpSdk.adminCtoInstructions` and `buildDistributeCreatorFeesInstructions` prepend the sweeps for you when a bucket is not empty. Event decoders: `decodeSweepBondingCurveFeeEvent` and `decodeSweepPoolFeeEventAmm`.
- TypeScript, PumpSwap: [`@pump-fun/pump-swap-sdk` 2.1.0](https://www.npmjs.com/package/@pump-fun/pump-swap-sdk/v/2.1.0). `sweepProtocolFeeInstruction` and `sweepCreatorFeeInstruction` for the pool, or `onlineSdk.sweepCreatorFeeInstruction(poolKey, payer)`.
- Rust: [`pump-rust-client` 0.4.0](https://crates.io/crates/pump-rust-client/0.4.0). `sweep_creator_fee_instruction` (curve) and `sweep_pool_creator_fee_instruction` (pool). `distribute_creator_fees_v2_instructions` prepends the curve sweep for you.
- IDL: [idl/pump.json](../../idl/pump.json) and [idl/pump_amm.json](../../idl/pump_amm.json).

## Synthetic Migration

The buy that empties a bonding curve can continue into the tokens that would go into the PumpSwap pool (see [Synthetic migration](../SYNTHETIC_MIGRATION.md)). That second part pays the bonding curve fee schedule like the first part: its protocol and creator fee are kept on the curve in the same `protocol_fees` / `creator_fee` fields and are paid out by the same sweeps, and its buyback part is paid in the trade. `PostCompleteBuyEvent` reports those amounts.
