# Bonding Curve Trades V3

`buy_v3`, `buy_exact_quote_in_v3` and `sell_v3` do the same trades as `buy_v2`, `buy_exact_quote_in_v2` and `sell_v2`, with **17 accounts instead of 27 or 26**. Prices, slippage checks and fee amounts are the same. The only difference is where the fees go: a v3 trade keeps the protocol fee and the creator fee on the bonding curve instead of paying them out on every trade. See [Fee sweeps](SWEEP_FEES.md).

Use them for any coin paired with SOL, USDC or a pump coin. Mayhem coins work too. Cashback coins are the one exception: a v3 trade on a cashback coin fails with `CashbackCoinNotSupported` (6094), so keep using v2 for those.

The v2 and legacy instructions keep working unchanged. v2 and v3 trades can be mixed on the same coin.

## Why they are smaller

Compared with `buy_v2` / `sell_v2`, these accounts are gone:

- `fee_recipient` and `associated_quote_fee_recipient`: the protocol fee stays on the curve in `BondingCurve.protocol_fees`.
- `creator_vault`, `associated_creator_vault` and `sharing_config`: the creator fee stays on the curve in `BondingCurve.creator_fee`.
- `buyback_fee_recipient` and `associated_quote_buyback_fee_recipient` become one `buyback_fee_recipient` account. The buyback part of the protocol fee is still paid in the trade.
- `global_volume_accumulator`, `associated_user_volume_accumulator`, `associated_token_program` and `fee_program` are not needed. The fee schedule is read from the Pump Fees `fee_config` account directly.

## Accounts

All three instructions take the same 17 accounts, in this order.

| #   | Account                         | Seeds / derivation                                                                                                                                                                        | `init_if_needed` / SOL cost                                   |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | `global`                        | Pump PDA: seeds `[b"global"]`.                                                                                                                                                            | -                                                             |
| 2   | `base_mint`                     | Base token mint of the coin.                                                                                                                                                              | -                                                             |
| 3   | `quote_mint`                    | Quote mint of the coin. For SOL-paired coins pass wrapped SOL: `So11111111111111111111111111111111111111112`.                                                                             | -                                                             |
| 4   | `base_token_program`            | Token program of `base_mint`. Token-2022 (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) for `create_v2` coins, SPL Token for older coins.                                              | -                                                             |
| 5   | `quote_token_program`           | Token program of `quote_mint`. SPL Token for wrapped SOL and USDC. Token-2022 for most pump coins used as quote.                                                                           | -                                                             |
| 6   | `bonding_curve`                 | Pump PDA: seeds `[b"bonding-curve", base_mint]`.                                                                                                                                          | Small rent top-up if the account still has an older, shorter layout. Paid by `user`. |
| 7   | `associated_base_bonding_curve` | Associated token account for `base_mint`, owned by `bonding_curve`, using `base_token_program`.                                                                                           | -                                                             |
| 8   | `associated_quote_bonding_curve`| Associated token account for `quote_mint`, owned by `bonding_curve`, using `quote_token_program`. Already exists for token-paired coins (`create_v2` creates it). For SOL-paired coins pass the derived address too; it is not used and does not need to exist. | -                                                      |
| 9   | `user`                          | Transaction signer and trader.                                                                                                                                                            | -                                                             |
| 10  | `associated_base_user`          | User's token account for `base_mint`. **Must exist.** The trade does not create it.                                                                                                       | -                                                             |
| 11  | `associated_quote_user`         | User's token account for `quote_mint`. **Must exist** for token-paired coins. For SOL-paired coins pass the user's wrapped SOL ATA address; it is not used and does not need to exist.     | -                                                             |
| 12  | `user_volume_accumulator`       | Pump PDA: seeds `[b"user_volume_accumulator", user]`. Created if missing, paid by `user`.                                                                                                  | Rent for a 137-byte account if missing: 0.0018444 SOL         |
| 13  | `fee_config`                    | Pump Fees PDA: seeds `[b"fee_config", pump_program_id]`. Address: `8Wf5TiAheLUqBrKXeYg2JtAFFMWtKdG2BSFgqUcPVwTt`.                                                                          | -                                                             |
| 14  | `buyback_fee_recipient`         | SOL-paired coins: one of the 8 buyback fee recipient wallets. Token-paired coins: that wallet's associated token account for `quote_mint`. See [Buyback fee recipient](#buyback-fee-recipient). | Never created by the trade. **Must exist.**              |
| 15  | `system_program`                | System Program: `11111111111111111111111111111111`.                                                                                                                                       | -                                                             |
| 16  | `event_authority`               | Pump PDA: seeds `[b"__event_authority"]`.                                                                                                                                                 | -                                                             |
| 17  | `program`                       | Pump program account.                                                                                                                                                                     | -                                                             |

## Instruction Data

### `buy_v3`

| #   | Argument       | Type         | Description / validation                                                                                                  | Optional? |
| --- | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | `amount`       | `u64`        | Base tokens to buy, in base token units. Must be greater than `0`. May be more than the curve has left: see [Synthetic migration](#synthetic-migration). | No |
| 2   | `max_sol_cost` | `u64`        | Most quote the buyer will pay, including the protocol and creator fee, for the whole buy (both parts of a synthetic migration). In quote base units (lamports for SOL-paired coins). | No |
| 3   | `partial_fill` | `OptionBool` | Only used on mayhem coins, which get no synthetic migration: `[true]` buys what the curve has left and completes it; omitted or `[false]`, a buy for more than what is left fails with `NotEnoughTokensToBuy`. On every other coin a buy for more than what is left continues into the [synthetic migration](#synthetic-migration), whatever this flag says. May be left off the end of the instruction data. | Yes |

### `buy_exact_quote_in_v3`

| #   | Argument             | Type         | Description / validation                                                                                 | Optional? |
| --- | -------------------- | ------------ | -------------------------------------------------------------------------------------------------------- | --------- |
| 1   | `spendable_quote_in` | `u64`        | Exact quote amount to spend, including fees. In quote base units. May be more than the curve has left to sell: see [Synthetic migration](#synthetic-migration). | No |
| 2   | `min_tokens_out`     | `u64`        | Fewest base tokens the buyer accepts, counting both parts of a synthetic migration.                     | No        |
| 3   | `partial_fill`       | `OptionBool` | Only used on mayhem coins, which get no synthetic migration: `[true]` spends up to what the curve has left and skips `min_tokens_out`; omitted or `[false]`, a budget that would buy more than what is left fails with `NotEnoughTokensToBuy`. On every other coin such a budget continues into the [synthetic migration](#synthetic-migration). May be left off the end of the instruction data. | Yes |

### `sell_v3`

| #   | Argument         | Type  | Description / validation                                                                       | Optional? |
| --- | ---------------- | ----- | ---------------------------------------------------------------------------------------------- | --------- |
| 1   | `amount`         | `u64` | Base tokens to sell, in base token units. Must be greater than `0`.                            | No        |
| 2   | `min_sol_output` | `u64` | Least quote the seller accepts after the protocol and creator fee. In quote base units.        | No        |

## Buyback Fee Recipient

The buyback part of the protocol fee is paid in the trade, to one account. Pick any of the 8 buyback fee recipient wallets listed in [Fee Recipients](../FEE_RECIPIENTS.md).

- SOL-paired coin: pass the wallet itself.
- USDC-paired or pump-coin-paired coin: pass the wallet's associated token account for `quote_mint`, using `quote_token_program`.

The trade checks this account on every trade, even when the fee is `0`, and never creates it. For USDC the token accounts already exist. For a pump coin used as quote they may not, so add a `createAssociatedTokenAccountIdempotent` instruction for it before the trade when you are not sure. Anyone can pay the rent for it.

The normal and reserved fee recipients are not passed anymore: the protocol fee stays on the curve until it is swept.

## Events

A v3 trade emits the usual `TradeEvent` with `ix_name` set to `buy_v3`, `buy_exact_quote_in_v3` or `sell_v3`.

- `fee`, `creator_fee` and `buyback_fee` are the amounts charged, same as on v2.
- `fee_recipient` is the zero key (`11111111111111111111111111111111`). It means the protocol fee was kept on the curve, not paid out.
- `creator_fee_unclaimed` is the creator fee waiting on the curve after this trade.

The payouts show up later as `SweepBondingCurveFeeEvent`. See [Fee sweeps](SWEEP_FEES.md#events).

## Related

- [Buy V2](BUY.md) and [Sell V2](SELL.md): the previous interface, still supported.
- [PumpSwap Trades V2](PUMP_SWAP_TRADE_V2.md): the same change for pools after migration.
- [Multi-hop swap](MULTI_HOP_SWAP.md): trade through two or more pools and curves in one instruction.

## SDKs

- TypeScript: [`@pump-fun/pump-sdk` 4.0.0](https://www.npmjs.com/package/@pump-fun/pump-sdk/v/4.0.0). `buyV3Instructions`, `buyExactQuoteInV3Instructions` and `sellV3Instructions` build the trade and create the buyback recipient's token account first when it is missing. `getBuyV3InstructionRaw`, `getBuyExactQuoteInV3InstructionRaw` and `getSellV3InstructionRaw` return the bare instruction. Quote with `getBuyV3QuoteAmountFromTokenAmount` and `getBuyV3TokenAmountFromQuoteAmount`.
- Rust: [`pump-rust-client` 0.4.0](https://crates.io/crates/pump-rust-client/0.4.0). `buy_v3_instructions`, `buy_exact_quote_in_v3_instructions` and `sell_v3_instructions` prepend the buyback token account create; the single `*_instruction` versions do not. Quote with `buy_quote_bonding_curve_v3_sol_in` and `buy_quote_bonding_curve_v3_token_out`.
- IDL: [idl/pump.json](../../idl/pump.json), TypeScript types in [idl/pump.ts](../../idl/pump.ts).

## Synthetic Migration

The buy that empties the curve has no max size. A `buy_v3` or `buy_exact_quote_in_v3` that asks for more than the curve has left no longer fails: it takes what is left at the curve's price, completes the curve, and buys the rest from the tokens that would have gone into the PumpSwap pool, at the price that pool would charge. The migration then opens the pool where that buy stopped.

- `max_sol_cost` (`buy_v3`) and `min_tokens_out` (`buy_exact_quote_in_v3`) cover both parts.
- Only the buy that crosses the limit gets this. After it, no buy or sell is possible on the curve until the migration happens.
- Mayhem coins keep the old behaviour, controlled by `partial_fill`.
- Three events: `TradeEvent` (curve part), `CompleteEvent`, then `PostCompleteBuyEvent` (pool part).

Full details, including how to quote it: [Synthetic migration](../SYNTHETIC_MIGRATION.md).
