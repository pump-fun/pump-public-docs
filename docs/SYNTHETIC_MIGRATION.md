# Synthetic Migration: The Last Buy on the Bonding Curve Has No Max Size

Before, a buy could never take more than what the bonding curve had left. If you wanted more, you bought what was left, waited for the migration, and bought the rest on PumpSwap.

Now, with the v3 buys ([`buy_v3` and `buy_exact_quote_in_v3`](instructions/TRADE_V3.md)) and with a bonding curve hop of [`multi_hop_swap`](instructions/MULTI_HOP_SWAP.md), **the buy that empties the curve has no max size**. It takes what is left on the curve at the curve's price, completes the curve, and then buys the rest **from the tokens that would have gone into the PumpSwap pool**, at the price that pool would charge. We call this a synthetic migration: the buy trades against the pool before the pool exists.

## How it works

1. **Curve part.** The buy takes everything the curve has left, at the normal bonding curve price. The curve is now complete.
2. **Pool part.** The program works out the reserves the migration would deposit right after step 1: all the base tokens still in the curve's token account, and all the quote raised (minus the migration fee for SOL-paired coins). It then prices the rest of the buy on those reserves with the same constant-product formula PumpSwap uses. So the price is continuous: a token costs the same in this buy as it would right after the migration.
3. **Migration.** `migrate_v2` creates the pool with exactly the reserves the buy left behind. The pool opens at the price where the buy stopped.

Both parts pay the bonding curve fee schedule, not the pool's fees. The protocol and creator fee stay on the curve, as on every v3 trade (see [Fee sweeps](instructions/SWEEP_FEES.md)), and the buyback part is paid in the trade. So the total you pay differs from a real PumpSwap buy only by the fee rule.

## Rules

- **Only the buy that crosses the limit gets this.** After it the curve is complete, and every trade on it, buy or sell, v2 or v3, fails with `BondingCurveComplete` until the migration happens.
- **Only v3 buys and multi-hop curve hops.** `buy`, `buy_v2` and `buy_exact_quote_in_v2` are unchanged: a buy past what is left fails with `NotEnoughTokensToBuy`, or stops at what is left with `partial_fill`.
- **`buy_v3`**: `amount` may be bigger than what the curve has left. `max_sol_cost` must cover both parts. The pool part can never take all of the pool's tokens (constant product), so a very large `amount` fails with `NotEnoughTokensToBuy`.
- **`buy_exact_quote_in_v3`**: the whole budget is spent. What is left of `spendable_quote_in` after the curve part is spent in the pool part. `min_tokens_out` applies to the total tokens bought. If the leftover budget cannot buy even one token from the pool, the buy stops at the completed curve and the leftover stays with the user.
- **`multi_hop_swap` curve hop**: same as `buy_exact_quote_in_v3`, except the hop spends the whole rest of its input in the pool part. Mayhem-mode curves cannot be a hop at all, so a route never needs a partial fill.
- **Mayhem coins (and the mayhem agent) do not get a synthetic migration.** They keep the old behaviour: a too-big buy fails with `NotEnoughTokensToBuy`, or buys what is left and completes the curve when `partial_fill` is `[true]`.

## Quoting it off-chain

```text
remaining   = bonding_curve.real_token_reserves
curve_quote = the usual bonding curve cost for `remaining` tokens

pool_base   = associated_base_bonding_curve.amount - remaining
pool_quote  = bonding_curve.real_quote_reserves + curve_quote - Global.pool_migration_fee   (SOL-paired coin)
            = bonding_curve.real_quote_reserves + curve_quote                               (token-paired coin)

buy_v3, extra tokens `out`:          quote_in = ceil(pool_quote * out / (pool_base - out))
buy_exact_quote_in_v3, net budget `in`: out   = floor((in - 1) * pool_base / (pool_quote + in - 1))
```

The bonding curve fee schedule applies to each part separately. The pool part is the same math as a PumpSwap buy on a fresh pool with those reserves.

The SDKs quote it for you: `getBuyV3QuoteAmountFromTokenAmount` and `getBuyV3TokenAmountFromQuoteAmount` in [`@pump-fun/pump-sdk` 4.0.0](https://www.npmjs.com/package/@pump-fun/pump-sdk/v/4.0.0) (they need the curve's base token balance, returned by `fetchBuyState` as `curveBaseTokenBalance`), and `buy_quote_bonding_curve_v3_sol_in` / `buy_quote_bonding_curve_v3_token_out` in [`pump-rust-client` 0.4.0](https://crates.io/crates/pump-rust-client/0.4.0).

## Events and state

A completing v3 buy emits three events, in this order:

1. `TradeEvent`: the curve part only (`token_amount` is what the curve had left).
2. `CompleteEvent`: the curve is complete.
3. `PostCompleteBuyEvent`: the pool part. `base_out` and `quote_in` are the extra tokens and the quote they cost; `fee`, `creator_fee` and `buyback_fee` are the fees on that part; `pool_base_reserves_before` / `pool_quote_reserves_before` are the reserves it was priced on, and `pool_base_reserves_after` / `pool_quote_reserves_after` are the reserves the pool will open with.

The curve records the pool part in `BondingCurve.post_complete_base_out` and `post_complete_quote_in` (both `0` when the completing buy had no pool part, and on every coin completed before this change).

For indexers: the buyer's total is the `TradeEvent` amounts plus the `PostCompleteBuyEvent` amounts. The fees in `PostCompleteBuyEvent` are kept on the curve like the v3 trade fees, except `buyback_fee`, which is paid in the trade. A `TradeEvent` with `ix_name` `multi_hop_swap` on a bonding curve may be followed by the same two events.
