# Block 0 Tax (November 27)

The pump bonding curve program now supports a **block 0 tax**: an extra protocol fee on trades made in the same slot a coin is created, by anyone other than the coin's creator.

The upgrade is live on mainnet since **November 27**.

**The tax is currently 0 and stays 0 until further notice.** Nothing is charged today, and trades in a coin's creation slot cost the same as before. We will announce before it is turned on. Everything below describes how it works once the rate is set above `0`.

**This is not a breaking change.** There are no interface changes for coin creation or trading: `create`, `create_v2` and every trade instruction take the same accounts and arguments as before. PumpSwap is not affected.

## 1. Where to read the tax rate

`Global::block0_tax_bps` (`u64`, basis points) on the pump `Global` account.

- Account: `4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf` (PDA of `["global"]`).
- It is the last field: bytes `1096..1104`. The account is now `1104` bytes.
- It is `0` today, which means no tax. Read it live rather than hardcoding it, so you pick up the change when it is turned on.

## 2. Who is exempt: `tax_exempt_creator`

`BondingCurve` has two new fields at the end:

| Field                | Type     | Bytes      | Meaning                                                    |
| -------------------- | -------- | ---------- | ---------------------------------------------------------- |
| `created_at_slot`    | `u64`    | `166..174` | The slot the coin was created in.                          |
| `tax_exempt_creator` | `pubkey` | `174..206` | The one wallet that trades without the block 0 tax.        |

- `tax_exempt_creator` is the `creator` argument passed to `create` / `create_v2`. It is set once at creation and never changes, also not on a community takeover.
- A bonding curve account is now `206` bytes. Curves created before this upgrade are shorter: read the missing fields as `0` and `Pubkey::default()`. They never pay the tax.

Once the rate is above `0`, a trade pays the tax when both are true:

```text
current slot <= bonding_curve.created_at_slot
user != bonding_curve.tax_exempt_creator
```

## 3. Holder rewards coins

On a holder rewards coin, `BondingCurve::creator` is the holder rewards PDA, as before. The `creator` argument of `create_v2` used to be unused on these coins.

Going forward:

- `BondingCurve::creator` is still the holder rewards PDA. Nothing changes for fees or the `creator_vault`.
- The `creator` argument you pass to `create_v2` is stored as `tax_exempt_creator`. That wallet can buy in the creation slot without the tax.
- `creator` must not be `Pubkey::default()`, on any coin.

On every other coin `tax_exempt_creator` is the same as `creator` at creation.

## How it is charged

- The tax is added to the protocol fee rate: `protocol_fee_bps + block0_tax_bps`. The creator fee is unchanged.
- It applies to buys and sells, on every bonding curve trade instruction (`buy`, `buy_exact_sol_in`, `sell`, the v2 and the v3 trades).
- It is paid like any protocol fee, including the buyback share.
- If you quote a trade in the coin's creation slot for a wallet that is not the `tax_exempt_creator`, add `block0_tax_bps` to the protocol fee bps.
- From the next slot on, fees are the same as before.

## Events

- `TradeEvent` has a new last field `block0_fee` (`u64`): the part of `fee` that is the block 0 tax. It is included in `fee`, not added on top. `0` when no tax was charged.
- `fee_basis_points` on a taxed trade is the protocol rate plus the tax rate.
- `PostCompleteBuyEvent` has the same new `block0_fee` field.

## Multi-hop swap

A PumpSwap `multi_hop_swap` that goes through a bonding curve in its creation slot, for a wallet that owes the tax, only works when that curve is the leg that pays the protocol fee. Otherwise it fails with `MultiHopBlock0TaxLegRequired` (`6113`). Retry from the next slot, or trade the curve directly.

## Account sizes

- `Global`: `1096` → `1104` bytes.
- `BondingCurve`: `166` → `206` bytes. An older curve is grown by its next trade, and the trader pays the extra rent (about `0.00028` SOL), as with earlier upgrades.

The pump IDL and TypeScript types in [idl](../idl) are updated.
