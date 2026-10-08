# PumpSwap Trades V2

PumpSwap `buy_v2`, `buy_exact_quote_in_v2` and `sell_v2` do the same trades as `buy`, `buy_exact_quote_in` and `sell`, with **17 accounts and no remaining accounts**. Prices, slippage checks and fee amounts are the same. The only difference is where the fees go: a v2 trade keeps the protocol fee and the coin creator fee in the pool instead of paying them out on every trade. See [Fee sweeps](SWEEP_FEES.md). The LP fee is unchanged: it goes into the pool reserves on every trade, as before.

They work on every pool, both pump pools created by migration and permissionless pools. Mayhem pools work too. Cashback coin pools are the one exception: a v2 trade on one fails with `CashbackCoinNotSupported` (6079), so keep using the v1 instructions for those.

The v1 instructions keep working unchanged. v1 and v2 trades can be mixed on the same pool.

## Why they are smaller

Compared with `buy` / `sell`, these accounts are gone:

- `protocol_fee_recipient` and `protocol_fee_recipient_token_account`: the protocol fee stays in the pool's quote vault and is recorded in `Pool.protocol_fees`.
- `coin_creator_vault_ata` and `coin_creator_vault_authority`: the creator fee stays in the pool's quote vault and is recorded in `Pool.creator_fees`.
- The buyback recipient wallet and its token account (remaining accounts) become one `buyback_fee_recipient` token account. The buyback part of the protocol fee is still paid in the trade.
- `global_volume_accumulator`, `fee_program`, `associated_token_program` and the other remaining accounts are not needed. The fee schedule is read from the Pump Fees `fee_config` account directly.

## Accounts

All three instructions take the same 17 accounts, in this order.

| #   | Account                    | Seeds / derivation                                                                                                                                                | `init_if_needed` / SOL cost                                  |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | `pool`                     | The `Pool` account.                                                                                                                                               | Small rent top-up if the account still has an older, shorter layout. Paid by `user`. |
| 2   | `user`                     | Transaction signer and trader.                                                                                                                                    | -                                                            |
| 3   | `global_config`            | PumpSwap PDA: seeds `[b"global_config"]`. Address: `ADyA8hdefvWN2dbGGWFotbzWxrAvLW83WG6QCVXvJKqw`.                                                                | -                                                            |
| 4   | `base_mint`                | `pool.base_mint`.                                                                                                                                                 | -                                                            |
| 5   | `quote_mint`               | `pool.quote_mint`. Wrapped SOL (`So11111111111111111111111111111111111111112`) for SOL pools.                                                                     | -                                                            |
| 6   | `user_base_token_account`  | User's token account for `base_mint`. **Must exist.** The trade does not create it.                                                                               | -                                                            |
| 7   | `user_quote_token_account` | User's token account for `quote_mint`. For SOL pools this is a wrapped SOL account. **Must exist.**                                                               | -                                                            |
| 8   | `pool_base_token_account`  | `pool.pool_base_token_account`.                                                                                                                                   | -                                                            |
| 9   | `pool_quote_token_account` | `pool.pool_quote_token_account`.                                                                                                                                  | -                                                            |
| 10  | `base_token_program`       | Token program of `base_mint`.                                                                                                                                     | -                                                            |
| 11  | `quote_token_program`      | Token program of `quote_mint`.                                                                                                                                    | -                                                            |
| 12  | `system_program`           | System Program: `11111111111111111111111111111111`.                                                                                                               | -                                                            |
| 13  | `user_volume_accumulator`  | PumpSwap PDA: seeds `[b"user_volume_accumulator", user]`. Created if missing, paid by `user`.                                                                      | Rent if missing                                              |
| 14  | `fee_config`               | Pump Fees PDA: seeds `[b"fee_config", pump_amm_program_id]`. Address: `5PHirr8joyTMp9JMm6nW7hNDVyEYdkzDqazxPD7RaTjx`.                                             | -                                                            |
| 15  | `buyback_fee_recipient`    | Associated token account for `quote_mint` of one of the 8 buyback fee recipient wallets, using `quote_token_program`. See [Buyback fee recipient](#buyback-fee-recipient). | Never created by the trade. **Must exist.**        |
| 16  | `event_authority`          | PumpSwap PDA: seeds `[b"__event_authority"]`.                                                                                                                     | -                                                            |
| 17  | `program`                  | PumpSwap program account.                                                                                                                                         | -                                                            |

## Instruction Data

### `buy_v2`

| #   | Argument              | Type  | Description / validation                                                                     | Optional? |
| --- | --------------------- | ----- | -------------------------------------------------------------------------------------------- | --------- |
| 1   | `base_amount_out`     | `u64` | Exact base tokens to buy. Must be greater than `0`.                                          | No        |
| 2   | `max_quote_amount_in` | `u64` | Most quote the buyer will pay, including all fees.                                           | No        |

### `buy_exact_quote_in_v2`

| #   | Argument              | Type  | Description / validation                                                                     | Optional? |
| --- | --------------------- | ----- | -------------------------------------------------------------------------------------------- | --------- |
| 1   | `spendable_quote_in`  | `u64` | Exact quote amount to spend, including all fees.                                             | No        |
| 2   | `min_base_amount_out` | `u64` | Fewest base tokens the buyer accepts. Must be greater than `0`.                              | No        |

### `sell_v2`

| #   | Argument               | Type  | Description / validation                                                                    | Optional? |
| --- | ---------------------- | ----- | ------------------------------------------------------------------------------------------- | --------- |
| 1   | `base_amount_in`       | `u64` | Exact base tokens to sell. Must be greater than `0`.                                        | No        |
| 2   | `min_quote_amount_out` | `u64` | Least quote the seller accepts after all fees.                                              | No        |

## Buyback Fee Recipient

The buyback part of the protocol fee is paid in the trade, to one token account: the associated token account for `quote_mint` of any of the 8 buyback fee recipient wallets listed in [Fee Recipients](../FEE_RECIPIENTS.md).

The trade checks this account on every trade, even when the fee is `0` (for example on mayhem pools), and never creates it. For wrapped SOL and USDC the token accounts already exist. For a pump coin used as quote they may not, so add a `createAssociatedTokenAccountIdempotent` instruction for it before the trade when you are not sure. Anyone can pay the rent for it.

The protocol fee recipients are not passed anymore: the protocol fee stays in the pool until it is swept.

## Quoting

Nothing changes for quotes. Price against the effective quote reserves, as described in
[Quoting: effective quote reserves](../PUMP_SWAP_README.md#quoting-effective-quote-reserves):

```text
effective_quote_reserves = pool_quote_token_account.amount + Pool::virtual_quote_reserves
```

The fees a v2 trade keeps in the vault are subtracted from `virtual_quote_reserves`, so this formula keeps giving the right reserves. See [Virtual quote reserves and fees](../VIRTUAL_QUOTE_RESERVES_FEE_ADJUSTMENT.md).

## Events

A v2 trade emits the usual `BuyEvent` or `SellEvent`.

- `ix_name` is `buy_v2` or `buy_exact_quote_in_v2` on a `BuyEvent`. `SellEvent` has no `ix_name`; a v2 sell is recognised by the zero key below.
- `protocol_fee`, `coin_creator_fee`, `lp_fee` and `buyback_fee` are the amounts charged, same as on v1.
- `protocol_fee_recipient` and `protocol_fee_recipient_token_account` are the zero key (`11111111111111111111111111111111`). It means the protocol fee was kept in the pool, not paid out.
- `creator_fee_unclaimed` is the creator fee waiting in the pool after this trade.
- `virtual_quote_reserves` is signed and may be negative.

The payouts show up later as `SweepPoolFeeEvent`. See [Fee sweeps](SWEEP_FEES.md#events).

## Related

- [Bonding Curve Trades V3](TRADE_V3.md): the same change for coins still on their bonding curve.
- [Multi-hop swap](MULTI_HOP_SWAP.md): trade through two or more pools and curves in one instruction.

## SDKs

- TypeScript: [`@pump-fun/pump-swap-sdk` 2.1.0](https://www.npmjs.com/package/@pump-fun/pump-swap-sdk/v/2.1.0). `buyV2Instructions`, `buyExactQuoteInV2Instructions` and `sellV2Instructions`. The high-level `buyBaseInput`, `buyQuoteInput`, `sellBaseInput` and `sellQuoteInput` builders take `{ v2: true }` and use v2 on pools that support it (`supportsTradeV2(pool)`), v1 elsewhere. Prices come from the same quote functions as v1.
- Rust: [`pump-rust-client` 0.4.0](https://crates.io/crates/pump-rust-client/0.4.0). `buy_amm_v2_instructions`, `buy_exact_quote_in_amm_v2_instruction` and `sell_amm_v2_instructions`.
- IDL: [idl/pump_amm.json](../../idl/pump_amm.json), TypeScript types in [idl/pump_amm.ts](../../idl/pump_amm.ts).

## Synthetic Migration

The v3 buy that empties a bonding curve can now also buy from the tokens that would go into the PumpSwap pool, at the price that pool would charge, before the pool exists. The migration then creates the pool with exactly the reserves that buy left, so the pool opens where it stopped. Nothing changes for trading on the pool itself: the first PumpSwap trade sees a pool that is already at the right price. See [Synthetic migration](../SYNTHETIC_MIGRATION.md).
