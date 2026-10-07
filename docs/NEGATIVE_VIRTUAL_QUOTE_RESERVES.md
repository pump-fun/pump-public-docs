# Negative Virtual Quote Reserves

Starting **September 30**, `Pool::virtual_quote_reserves` on PumpSwap pools can be **negative**.

Why it goes negative: the PumpSwap v2 trades keep the protocol and creator fee inside the pool's quote vault and subtract that amount from `virtual_quote_reserves`, so the waiting fees do not count as liquidity. See [Virtual quote reserves and fees](VIRTUAL_QUOTE_RESERVES_FEE_ADJUSTMENT.md). If you already handle a negative value, nothing changes for your quotes.

The field is an `i128`, so treat it as a signed value everywhere and never read it as a `u64` / `u128`. A positive value
puts `effective_quote_reserves` above `pool_quote_token_account.amount`; a negative value puts it below. In both cases
`effective_quote_reserves` itself is **never negative**: the program never lets `virtual_quote_reserves` drop further
below zero than the vault balance can cover.

## Pricing

The pricing formula is unchanged (see
[Quoting: effective quote reserves](PUMP_SWAP_README.md#quoting-effective-quote-reserves)). A negative value simply
lowers the effective quote reserves below the raw vault balance:

```text
effective_quote_reserves = pool_quote_token_account.amount + Pool::virtual_quote_reserves
```

Both `buy` and `sell` are priced against `effective_quote_reserves`. The base side is unchanged: base reserves are still
the raw `pool_base_token_account.amount`.

## Overflow guarantee

We guarantee that `pool_quote_token_account.amount + virtual_quote_reserves` will never overflow and will never be
negative. The program keeps the vault balance and `virtual_quote_reserves` in a range where the effective quote reserves
always fit in a `u64`, so integrations do not need to guard the computation themselves.

## Handling in integrations

```ts
// virtual_quote_reserves is a signed i128 and may be negative.
const realQuote = BigInt(poolQuoteTokenAccount.amount);
const virtualQuote = BigInt(pool.virtual_quote_reserves); // keep the sign

// Price both buys and sells against the effective reserves.
const effectiveQuoteReserves = realQuote + virtualQuote;

const quoteIn = buyQuote(baseReserves, effectiveQuoteReserves, baseOut);
const quoteOut = sellQuote(baseReserves, effectiveQuoteReserves, baseIn);
```

In Rust, do the addition in `i128` and then cast the result to `u64` for the quote math. The program guarantees the
result is non-negative and fits in a `u64`, so no checked conversion is needed.

```rust
fn effective_quote_reserves(
    pool_quote_token_account_amount: u64,
    virtual_quote_reserves: i128, // signed, may be negative
) -> u64 {
    // The program guarantees this addition never overflows and the result fits in u64.
    (i128::from(pool_quote_token_account_amount) + virtual_quote_reserves) as u64
}

let effective_quote_reserves =
    effective_quote_reserves(pool_quote_token_account.amount, pool.virtual_quote_reserves);

let quote_in = buy_quote(base_reserves, effective_quote_reserves, base_out);
let quote_out = sell_quote(base_reserves, effective_quote_reserves, base_in);
```

- Decode `virtual_quote_reserves` from the `Pool` account and from `BuyEvent` / `SellEvent` as a signed integer.
- Store it in a signed column in your indexer schema; a `u64` column will reject or corrupt negative values.
- Pools written before the field existed are shorter than the current layout; read a missing `virtual_quote_reserves`
  as `0`.
