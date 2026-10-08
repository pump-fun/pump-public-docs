# Multi-Hop Swap

`multi_hop_swap` is one PumpSwap instruction that trades through **two or more pools and bonding curves in a row**.

It is made for coins paired with another pump coin. Say coin **B** is paired with pump coin **A**, and **A** is paired with SOL. To buy B with SOL you used to need two trades and a token account for A. With `multi_hop_swap` it is one instruction: SOL → A (on A's bonding curve or pool) → B (on B's bonding curve or pool). Selling works the same way in reverse: B → A → SOL.

What you get:

- **Smaller transactions.** 16 fixed accounts plus 5 accounts per hop. Two hops fit easily in one normal transaction, and so do three.
- **No token account for the middle coin.** Coin A never touches the user's wallet. Each hop's output stays in the pool or curve until the next hop pulls it.
- **Fees once per route, not once per hop.** See [Fees](#fees).
- **One slippage check**, on the final amount.

## Rules

- **Exact in.** `amount_in` is taken from `user_in_token_account`. The final coin lands in `user_out_token_account`. `min_amount_out` is checked once at the end and must be greater than `0`.
- **One direction per route.** Every hop must be a buy (SOL/USDC → A → B) or every hop must be a sell (B → A → SOL/USDC). Mixing fails with `MultiHopMixedDirection` (6086).
- **The hops must chain.** The coin coming out of one hop must be the base or quote mint of the next one, and the last hop must produce the mint of `user_out_token_account`. Otherwise `MultiHopDiscontinuousPath` (6084).
- **Pool hops** must be pump pools (created by migration, pool `index` 0 with pump's pool authority as `creator`). Mayhem-mode pools are not supported (`MayhemPoolNotSupported`, 6080), and neither are mayhem-mode bonding curves (`MultiHopMayhemCurveNotSupported`, 6108).
- **Bonding curve hops** can use any quote mint: SOL, USDC, a pump coin, or another listed token such as an xStock. A SOL-paired bonding curve is always the hop next to the user's own SOL, since every hop of a route trades the same way: the first hop of a buy route or the last hop of a sell route. On that hop the user pays or receives **native SOL**. A buy takes lamports from the `user` wallet, and a sell pays lamports to it.
- **The wrapped SOL ATA is still required on a SOL curve hop.** Pass the user's wrapped SOL ATA as `user_in_token_account` (buy) or `user_out_token_account` (sell), and make sure it exists. No tokens move through it; it is read for its mint only, so the interface stays the same for every route.
- **Cashback coins** can only be the hop next to your own currency (the first hop of a buy, the last hop of a sell).
- **SOL routes.** When the SOL hop is a PumpSwap pool (a migrated SOL-paired coin), SOL moves as wrapped SOL through the user's wrapped SOL token account, so wrap first. When the SOL hop is a bonding curve, native SOL moves instead, but the same wrapped SOL account is passed and must exist.
- **The user's in and out token accounts must exist.** The instruction does not create them. It does create `user_volume_accumulator` if missing (paid by `user`).
- **Set a compute unit limit.** Each hop costs roughly 30k to 50k CU, and a first trade also creates the volume accumulator. A three-hop route is already near the 200k default.
- **Four or more hops** need a v0 transaction with an address lookup table. Up to three hops fit a legacy transaction.

## Accounts

### Fixed accounts (16)

| #   | Account                   | Seeds / derivation                                                                                                                                        | `init_if_needed` / SOL cost          |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 1   | `user`                    | Transaction signer and trader.                                                                                                                            | -                                    |
| 2   | `user_in_token_account`   | User's token account for the coin they pay with. Must exist. On a buy route that starts on a SOL-paired bonding curve this is the user's wrapped SOL ATA; it must exist even though the buy takes native SOL from the `user` wallet instead.                                                                                              | -                                    |
| 3   | `user_out_token_account`  | User's token account for the coin they receive. Must exist. On a sell route that ends on a SOL-paired bonding curve this is the user's wrapped SOL ATA; it must exist even though the sell pays native SOL to the `user` wallet instead.                                                                                               | -                                    |
| 4   | `global_config`           | PumpSwap PDA: seeds `[b"global_config"]`. Address: `ADyA8hdefvWN2dbGGWFotbzWxrAvLW83WG6QCVXvJKqw`.                                                        | -                                    |
| 5   | `fee_config`              | Pump Fees PDA: seeds `[b"fee_config", pump_amm_program_id]`. Address: `5PHirr8joyTMp9JMm6nW7hNDVyEYdkzDqazxPD7RaTjx`.                                     | -                                    |
| 6   | `user_volume_accumulator` | PumpSwap PDA: seeds `[b"user_volume_accumulator", user]`. Created if missing, paid by `user`.                                                              | Rent if missing                      |
| 7   | `buyback_fee_recipient`   | Associated token account of one of the 8 buyback fee recipient wallets, for the quote mint of the hop that trades the user's own currency (the first hop on a buy route, the last hop on a sell route). On a SOL route this is the wallet's wrapped SOL ATA, whether that hop is a pool or a bonding curve (a SOL curve pays it in lamports and syncs it). Must exist. | Never created. |
| 8   | `token_program`           | SPL Token Program: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`.                                                                                          | -                                    |
| 9   | `token_2022_program`      | Token-2022 Program: `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`.                                                                                         | -                                    |
| 10  | `system_program`          | System Program: `11111111111111111111111111111111`.                                                                                                       | -                                    |
| 11  | `event_authority`         | PumpSwap PDA: seeds `[b"__event_authority"]`.                                                                                                             | -                                    |
| 12  | `program`                 | PumpSwap program account.                                                                                                                                 | -                                    |
| 13  | `pump_program`            | Pump program: `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`.                                                                                               | -                                    |
| 14  | `pump_global`             | Pump PDA: seeds `[b"global"]`. Address: `4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf`.                                                                   | -                                    |
| 15  | `pump_fee_config`         | Pump Fees PDA: seeds `[b"fee_config", pump_program_id]`. Address: `8Wf5TiAheLUqBrKXeYg2JtAFFMWtKdG2BSFgqUcPVwTt`.                                         | -                                    |
| 16  | `pump_event_authority`    | Pump PDA: seeds `[b"__event_authority"]`. Address: `Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1`.                                                        | -                                    |

Accounts 13 to 16 are always required, even when no hop is a bonding curve.

### Remaining accounts (5 per hop)

After the 16 fixed accounts, pass one group of 5 accounts per hop, in route order. The program reads the owner of the third account to know if the hop is a pool or a bonding curve.

| Slot | Pool hop                        | Bonding curve hop                                                                 |
| ---- | ------------------------------- | --------------------------------------------------------------------------------- |
| 1    | `pool.base_mint`                | Base mint of the coin                                                             |
| 2    | `pool.quote_mint`               | Quote mint of the coin (`bonding_curve.quote_mint`). Wrapped SOL for a SOL-paired coin. |
| 3    | `pool` (writable)               | `bonding_curve` PDA `[b"bonding-curve", base_mint]` (writable)                    |
| 4    | `pool.pool_base_token_account` (writable)  | Associated token account for the base mint, owned by `bonding_curve` (writable)   |
| 5    | `pool.pool_quote_token_account` (writable) | Associated token account for the quote mint, owned by `bonding_curve` (writable). For a SOL-paired coin pass the derived wrapped SOL ATA address; it is not read and does not need to exist. |

The direction of a hop follows from the coin you hold when you reach it: if it is the hop's quote mint, the hop is a buy; if it is the hop's base mint, the hop is a sell.

## Instruction Data

| #   | Argument         | Type  | Description / validation                                                             | Optional? |
| --- | ---------------- | ----- | ------------------------------------------------------------------------------------ | --------- |
| 1   | `amount_in`      | `u64` | Amount of the input coin to spend, in its base units. Must be greater than `0`.      | No        |
| 2   | `min_amount_out` | `u64` | Least amount of the output coin the user accepts. Must be greater than `0`.          | No        |

## Examples: two hops, buying and selling B with SOL

In both examples coin **B** is on its bonding curve and is paired with pump coin **A**. **A** is paired with SOL. The only difference is where A trades: on its PumpSwap pool (A has migrated) or still on its bonding curve.

### First leg on a PumpSwap pool (A has migrated)

Buy B with SOL. Route: SOL → A (A's PumpSwap pool, quote wrapped SOL) → B (B's bonding curve, quote A).

- `user_in_token_account`: the user's wrapped SOL token account, holding the SOL to spend. Wrap first.
- `user_out_token_account`: the user's token account for B.
- `buyback_fee_recipient`: a buyback fee recipient wallet's wrapped SOL token account (the first hop trades the user's SOL).
- Remaining accounts, hop 1 (pool): `[A mint, WSOL mint, A pool, A pool base vault, A pool quote vault]`.
- Remaining accounts, hop 2 (curve): `[B mint, A mint, B bonding curve, B curve base ATA, B curve quote ATA]`.

The wrapped SOL moves from the user's token account into A's pool vault. The user's A never touches their wallet.

Sell B for SOL. Route: B → A (B's bonding curve) → SOL (A's PumpSwap pool). Swap the two groups and the in/out token accounts: `user_in_token_account` is the user's B account, `user_out_token_account` is the user's wrapped SOL token account, which receives wrapped SOL. `buyback_fee_recipient` is again the wallet's wrapped SOL token account, since the last hop now trades the user's SOL.

### First leg on a bonding curve (A has not migrated)

Buy B with SOL. Route: SOL → A (A's bonding curve, quote SOL) → B (B's bonding curve, quote A).

- `user_in_token_account`: the user's wrapped SOL ATA. **It must exist, but it is not used for the transfer.** The buy takes native SOL from the `user` wallet as lamports. The account is only read for its mint, so the interface is the same as in the pool case.
- `user_out_token_account`: the user's token account for B.
- `buyback_fee_recipient`: a buyback fee recipient wallet's wrapped SOL ATA, the same account as in the pool case. A's curve pays it in lamports and syncs it.
- Remaining accounts, hop 1 (curve): `[A mint, WSOL mint, A bonding curve, A curve base ATA, A curve WSOL ATA address]`. Pass the wrapped SOL mint as A's quote mint, and the derived wrapped SOL ATA address of A's curve: it is not read and does not need to exist.
- Remaining accounts, hop 2 (curve): `[B mint, A mint, B bonding curve, B curve base ATA, B curve quote ATA]`.

Both hops are bonding curves, so the Pump program handles the whole route in one call and moves the A tokens from A's curve to B's curve itself.

Sell B for SOL. Route: B → A (B's bonding curve) → SOL (A's bonding curve). Swap the two groups and the in/out token accounts: `user_in_token_account` is the user's B account, `user_out_token_account` is the user's wrapped SOL ATA, which must exist but receives nothing. The sell pays native SOL to the `user` wallet as lamports.

## Fees

Fees are charged **once per route**:

- The **protocol fee** is charged once, on the hop that trades the user's own currency (the first hop of a buy, the last hop of a sell), at that pool's or curve's normal rate and in that hop's quote mint. Its buyback part is paid in the trade to `buyback_fee_recipient`. The rest stays in that pool or curve, as on a v2 / v3 trade.
- The **creator fee** (or holder rewards fee) and, on a pool, the **LP fee** are charged once, on the hop that trades the coin at the far end of the route (the coin being bought or sold), at that pool's or curve's normal rate.
- Every other hop charges nothing.
- A one-hop route pays exactly what a `buy_v2` / `sell_v2` (PumpSwap) or `buy_v3` / `sell_v3` (bonding curve) pays.

The protocol and creator fees stay in the pool or curve that charged them and are paid out later by the sweep instructions. See [Fee sweeps](SWEEP_FEES.md).

## Events

Each hop emits its own event, as if the user had traded there directly: a PumpSwap `BuyEvent` (with `ix_name` `multi_hop_swap`) or `SellEvent` for a pool hop, a Pump `TradeEvent` (with `ix_name` `multi_hop_swap`) for a bonding curve hop. Each event reports only the fees that hop charged. The middle coins net to zero for the user, while the volume on every pool and curve is real.

## `multi_hop_curve_swap`

The Pump program has a matching `multi_hop_curve_swap` instruction. It is only for PumpSwap to call: it requires PumpSwap's `global_config` PDA as a signer, so nothing else can call it. Do not call it directly; always use PumpSwap's `multi_hop_swap`.

## Related

- [Bonding Curve Trades V3](TRADE_V3.md) and [PumpSwap Trades V2](PUMP_SWAP_TRADE_V2.md): the single-venue trades a multi-hop route is made of.
- [Creating a coin paired with a pump coin](CREATE_WITH_PUMP_COIN_QUOTE.md): how the coins that need a multi-hop route are created.

## SDKs

- TypeScript, PumpSwap side: [`@pump-fun/pump-swap-sdk` 2.1.0](https://www.npmjs.com/package/@pump-fun/pump-swap-sdk/v/2.1.0). `onlineSdk.multiHopPoolHops` fetches the pool hops, `multiHopSwapQuote` gives `minAmountOut`, and `PUMP_AMM_SDK.multiHopSwapInstructions` builds the instruction.
- TypeScript, Pump side: [`@pump-fun/pump-sdk` 4.0.0](https://www.npmjs.com/package/@pump-fun/pump-sdk/v/4.0.0). `OnlinePumpSdk.resolveMultiHopRoute(path, side)` picks each hop's venue, `simulateMultiHopSwap` returns the amount out, and `PumpSdk.multiHopSwapInstructions` builds the swap, wrapping SOL in, closing the wrapped SOL account after, and creating the buyback recipient's token account when it is missing.
- Rust: [`pump-rust-client` 0.4.0](https://crates.io/crates/pump-rust-client/0.4.0). `multi_hop_swap_instructions` with `MultiHopHop::pool` / `MultiHopHop::curve`, `quote_multi_hop_swap` for the route output, and `MULTI_HOP_COMPUTE_UNITS` for the compute budget.
- IDL: [idl/pump_amm.json](../../idl/pump_amm.json), TypeScript types in [idl/pump_amm.ts](../../idl/pump_amm.ts).

These releases support SOL-paired bonding curve hops too. The builders make sure the user's wrapped SOL ATA exists (created, not funded); a buy that starts on a SOL curve pays from the wallet's SOL, not from the wrapped SOL account, so the wallet needs `amount_in` plus rent, and a sell that ends on one is unwrapped like any other wrapped SOL output.

## Synthetic Migration on a Curve Hop

A bonding curve hop that would buy more than the curve has left does not fail. It takes what is left at the curve's price, completes the curve, and spends the whole rest of its input on the tokens that would have gone into that coin's PumpSwap pool, at the price that pool would charge. The hop then emits `CompleteEvent` and `PostCompleteBuyEvent` after its `TradeEvent`. After that hop, the curve takes no more trades until its migration happens.

This works on a SOL-paired curve too: the migration fee comes off the raised SOL before the pool part is priced, exactly as `migrate_v2` would take it. Mayhem-mode curves cannot be a hop at all. See [Synthetic migration](../SYNTHETIC_MIGRATION.md).
