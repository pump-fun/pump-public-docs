# Creating a Coin Paired With a Pump Coin

`create_v2` can pair a new coin with an **existing pump coin** instead of SOL or USDC. The 16 accounts and the arguments are the same as in [Coin Creation](COIN_CREATION.md). What changes is the list of remaining accounts: you also pass the quote coin's bonding curve, and its PumpSwap pool if it has migrated.

Below, **Q** is the pump coin you want to use as the quote mint.

## Which pump coins can be the quote

- Q must be paired with SOL or USDC (or another quote mint listed by pump.fun). A coin that is itself paired with a pump coin cannot be used as a quote yet; creation fails with `CurveDepthExceeded` (6105).
- Q must not be a mayhem-mode coin.
- Q can still be on its bonding curve, or already migrated to PumpSwap. If Q's curve is complete but the pool is not created yet, creation fails with `QuoteCurveAwaitingMigration` (6107). Retry after `migrate_v2` runs.
- The new coin cannot be in mayhem mode (`MayhemModeQuoteMintNotAllowed`, 6071). Holder rewards work, and `creator_fee_bps` can be set, like on other custom pairs.
- If Q is listed by pump.fun as a quote mint, it works the normal way (see [Coin Creation](COIN_CREATION.md)) and the extra accounts below are not read.

## Remaining accounts

Pass these after the 16 fixed accounts, in this order. Slots are positional.

| Index | Account                          | Seeds / derivation                                                                                                                                                                                                         | Required when                     |
| ----- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 0     | `quote_mint`                     | Q's mint.                                                                                                                                                                                                                  | Always                            |
| 1     | `associated_quote_bonding_curve` | Associated token account for Q, owned by the new `bonding_curve`, using Q's token program. Writable. Created by the instruction, paid by `user`.                                                                           | Always                            |
| 2     | `quote_token_program`            | Q's token program. Token-2022 (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) for coins created with `create_v2`, SPL Token for older coins.                                                                                | Always                            |
| 3     | `quote_control`                  | Pump PDA: seeds `[b"quote-control"]`. Address: `6z6GDdfb2AjR9ZhJmAUQ5cipJCVxQvLJhB2H8mCwTFBP`.                                                                                                                              | Always                            |
| 4     | `quote_bonding_curve`            | Q's bonding curve. Pump PDA: seeds `[b"bonding-curve", Q]`.                                                                                                                                                                | Always                            |
| 5     | `quote_pool`                     | Q's PumpSwap pool. PumpSwap PDA: seeds `[b"pool", 0u16 (little endian), pool_authority, Q, quote_of_Q]`, where `pool_authority` is the Pump PDA `[b"pool-authority", Q]` and `quote_of_Q` is wrapped SOL for a SOL-paired Q, or Q's quote mint otherwise. | Only if Q has migrated |
| 6     | `quote_pool_base_token_account`  | `quote_pool.pool_base_token_account`.                                                                                                                                                                                      | Only if Q has migrated            |
| 7     | `quote_pool_quote_token_account` | `quote_pool.pool_quote_token_account`.                                                                                                                                                                                     | Only if Q has migrated            |

If Q is still on its bonding curve, pass indexes 0 to 4 only. If Q has migrated, all 8 are required (`QuotePoolAccountsRequired`, 6101, otherwise).

## Starting price

The new coin's starting `virtual_quote_reserves` are not a fixed number. They are computed from Q's current price (from Q's bonding curve, or from Q's pool after migration) so that the new coin starts at about the same value as a normal SOL or USDC launch, just counted in Q. The value is stored in `BondingCurve.virtual_quote_reserves` and reported in `CreateEvent.virtual_quote_reserves`. If Q's price makes the value unusable, creation fails with `QuoteReservesOutOfRange` (6104).

## Trading the new coin

- Use [`buy_v3` / `sell_v3`](TRADE_V3.md) or [`buy_v2` / `sell_v2`](BUY.md) with `quote_mint` = Q and `quote_token_program` = Q's token program. The user needs a token account for Q.
- For the v3 trades, `buyback_fee_recipient` is a buyback fee recipient wallet's associated token account for Q. It may not exist yet for a new quote coin. Add a `createAssociatedTokenAccountIdempotent` instruction for it before the trade; anyone can pay the rent.
- To buy the new coin straight from SOL or USDC, use [`multi_hop_swap`](MULTI_HOP_SWAP.md): Q's bonding curve or PumpSwap pool is the first hop and the new coin's bonding curve is the second.

## Errors

| Code | Name                            | Meaning                                                                                        |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| 6063 | `UnsupportedQuoteMint`          | Q is not a listed quote mint and remaining account 3 or 4 is missing.                           |
| 6099 | `InvalidQuoteBondingCurve`      | Remaining account 4 is not Q's bonding curve.                                                  |
| 6100 | `QuoteBondingCurveNotEligible`  | Q is a mayhem coin, or Q's own quote mint is not listed.                                        |
| 6105 | `CurveDepthExceeded`            | Q is itself paired with a pump coin. Not allowed yet.                                          |
| 6107 | `QuoteCurveAwaitingMigration`   | Q's curve is complete but its pool does not exist yet. Retry after migration.                  |
| 6101 | `QuotePoolAccountsRequired`     | Q has migrated but remaining accounts 5 to 7 are missing.                                       |
| 6102 | `QuotePoolNotFound`             | Remaining account 5 is not a PumpSwap pool.                                                    |
| 6103 | `InvalidQuotePool`              | Remaining accounts 5 to 7 do not match Q's pool and vaults.                                     |
| 6104 | `QuoteReservesOutOfRange`       | The starting reserves computed from Q's price are unusable.                                    |
| 6071 | `MayhemModeQuoteMintNotAllowed` | `is_mayhem_mode` was `true`. Mayhem mode only works with SOL or USDC.                          |

## SDKs

- TypeScript: [`@pump-fun/pump-sdk` 3.2.0](https://www.npmjs.com/package/@pump-fun/pump-sdk/v/3.2.0). `OnlinePumpSdk.resolveQuoteMint` recognises a pump coin quote (`source: "pumpCoin"`). Pass its `pumpQuote.accounts` to `createV2Instruction` or `createV2AndBuyV2Instructions` as `pumpQuote`, and its `pumpQuote.curve` to the quote functions. The refusals above map to typed errors such as `QuoteBondingCurveNotEligibleError` and `QuoteCurveAwaitingMigrationError`.
- Rust: [`pump-rust-client` 0.3.1](https://crates.io/crates/pump-rust-client/0.3.1). `fetch_pump_quote_create` and `create_v2_pump_quote_accounts` resolve the quote coin's accounts for `create_v2`; `pump_quote_initial_virtual_quote_reserves` gives the starting reserves for quoting the first buy.
- IDL: [idl/pump.json](../../idl/pump.json), TypeScript types in [idl/pump.ts](../../idl/pump.ts).

## Synthetic Migration

A coin paired with a pump coin completes its curve like any other coin: the v3 buy that crosses the limit can also buy from the tokens that would go into its PumpSwap pool, at that pool's price, and the pool later opens where that buy stopped. No migration fee is taken from a token-paired coin's raised quote in that pricing. See [Synthetic migration](../SYNTHETIC_MIGRATION.md).
