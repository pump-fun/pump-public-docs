# Virtual Quote Reserves and Fees Kept in the Pool

This explains **why** `Pool::virtual_quote_reserves` goes negative (see [Negative virtual quote reserves](NEGATIVE_VIRTUAL_QUOTE_RESERVES.md)) and what it means for integrations.

**If you already treat `virtual_quote_reserves` as a signed number and price against the effective quote reserves, this is not a breaking change. Your quotes stay correct and nothing needs to change. All existing trade instructions keep working the same way, with the same accounts and arguments.**

## What happens

The PumpSwap v2 trades (`buy_v2`, `buy_exact_quote_in_v2`, `sell_v2`) and `multi_hop_swap` keep the protocol fee and the creator fee **inside the pool's quote vault** instead of paying them out on every trade (see [Fee sweeps](instructions/SWEEP_FEES.md)). That money is not liquidity. It must not change the price.

So every time a fee is kept, the program subtracts it from `virtual_quote_reserves`. Every time a sweep pays it out, the program adds it back. The quote vault balance and `virtual_quote_reserves` move in opposite directions by the same amount, and their sum stays the real liquidity:

```text
pool_quote_token_account.amount = real_quote_reserves + Pool::protocol_fees + Pool::creator_fees
Pool::virtual_quote_reserves    = boost_reserves - Pool::protocol_fees - Pool::creator_fees

effective_quote_reserves = pool_quote_token_account.amount + Pool::virtual_quote_reserves
                         = real_quote_reserves + boost_reserves
```

`boost_reserves` is the extra amount a boosted pool carries (see the existing docs); it is `0` on most pools. On a plain pool with fees waiting, `virtual_quote_reserves` is simply minus the waiting fees, which is why it is negative.

## Example

A plain pool holds 100 SOL of real liquidity and is not boosted. A user buys with a v2 trade and pays 10 SOL, of which 0.03 SOL is protocol and creator fee kept in the vault. The buyback part of the fee is left out to keep the numbers simple. Amounts in SOL.

| Step                         | Quote vault balance | `protocol_fees` + `creator_fees` | `virtual_quote_reserves` | Effective quote reserves |
| ---------------------------- | ------------------- | -------------------------------- | ------------------------ | ------------------------ |
| Start                        | 100.00              | 0                                | 0                        | 100.00                   |
| After the v2 buy             | 110.00              | 0.03                             | -0.03                    | 109.97                   |
| After the sweeps pay 0.03 out | 109.97             | 0                                | 0                        | 109.97                   |

The effective quote reserves never counted the waiting fees, so the price is the same before and after the sweep.

## What this means for you

- **Quoting:** keep using `effective_quote_reserves = pool_quote_token_account.amount + virtual_quote_reserves`, as a signed `i128` addition. Nothing changes.
- **Not a breaking change for quotes:** if your code already handles negative `virtual_quote_reserves`, you are done.
- **Existing trade instructions:** PumpSwap `buy`, `sell` and `buy_exact_quote_in`, and Pump `buy`, `sell`, `buy_v2`, `sell_v2`, `buy_exact_quote_in_v2`, all keep working exactly as before, with the same accounts and arguments. They still pay fees per trade.
- **Do not read the raw vault balance as liquidity.** It now includes fees waiting to be swept.
- **Boost:** a pool is boosted when `virtual_quote_reserves + protocol_fees + creator_fees` is not `0`, not when the stored field alone is not `0`. `BuyEvent` / `SellEvent` carry this as `can_boost`.
- **Indexers:** the trade events report `virtual_quote_reserves` (signed), `protocol_fee`, `coin_creator_fee` and `creator_fee_unclaimed`. `SweepPoolFeeEvent` reports each payout. `Pool.protocol_fees` and `Pool.creator_fees` are appended fields; read them as `0` on pools written before the upgrade.

The guarantees from [Negative virtual quote reserves](NEGATIVE_VIRTUAL_QUOTE_RESERVES.md) still hold: `pool_quote_token_account.amount + virtual_quote_reserves` never overflows and is never negative.
