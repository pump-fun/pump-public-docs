# Holder Rewards Coins

Coins can now be created as **holder rewards coins**. On a holder rewards coin the creator fee that is charged on every
trade is not paid to a creator wallet. It is set aside for the people who hold the coin, and pump.fun distributes it to
them on an ongoing basis.

This is a backwards compatible change. Integrations that do not update keep working; they will simply create regular
coins and will not see the new fields described below.

## What changes for creators

- A coin is either a regular coin or a holder rewards coin. The choice is made when the coin is created and cannot be
  undone afterwards.
- On a holder rewards coin there is nothing for the creator to claim: the creator fee goes to holders.
- Holders do not need to do anything to receive rewards. pump.fun pays them out; there is no claim instruction for
  holders to call.
- Creating holder rewards coins can be switched off globally by pump.fun. While it is off, `create_v2` rejects a request
  for a holder rewards coin.

## Creating a holder rewards coin

`create_v2` takes one new trailing argument:

| #   | Argument           | Type         | Description                                                                                                                      | Optional? |
| --- | ------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 8   | `is_holder_reward` | `OptionBool` | `[true]` creates a holder rewards coin. Omitted or `[false]` creates a regular coin. In TypeScript this is a tuple: `[true]`. | Yes       |

Notes:

- The argument is trailing and optional: instruction data built before it existed still decodes and creates a regular
  coin.
- On a holder rewards coin the `creator` argument is not used as the fee recipient. Pass your usual creator address; the
  program records a pump.fun controlled address as the coin's creator instead. The `BondingCurve::creator` field
  therefore still tells you where the fee goes, and the `creator_vault` derivation used by `buy` / `sell` is unchanged.
- `is_cashback_enabled` (argument 6) must be `[false]` or omitted, see [Cashback is deprecated](#cashback-is-deprecated).

### TS SDK

```ts
import { PUMP_SDK } from "@pump-fun/pump-sdk";

const createInstruction = await PUMP_SDK.createV2Instruction({
  mint: mintKeypair.publicKey,
  name: "Name",
  symbol: "symbol",
  uri: "<your ipfs uri>",
  creator,
  user,
  mayhemMode: false,
  holderReward: true, // holder rewards coin
});
```

To create and buy in one transaction, pass `holderReward: true` to `createV2AndBuyV2Instructions` (or
`createV2AndBuyInstructions`). The SDK then points the first buy at the right creator vault for you. The SDK throws
`HolderRewardDisabledError` up front when holder rewards coins are currently switched off.

```ts
const global = await onlineSdk.fetchGlobal();

const instructions = await PUMP_SDK.createV2AndBuyV2Instructions({
  global,
  mint: mintKeypair.publicKey,
  name: "Name",
  symbol: "symbol",
  uri: "<your ipfs uri>",
  creator,
  user,
  quoteAmount,
  amount,
  mayhemMode: false,
  holderReward: true,
});
```

## Trading holder rewards coins

There are **no changes to any trade instruction**. `buy`, `sell`, `buy_v2`, `sell_v2`, `buy_exact_quote_in_v2` and the
PumpSwap `buy` / `sell` instructions take the same accounts and the same arguments for holder rewards coins as for any
other coin. Fees are computed exactly as before; the only difference is who ends up receiving the creator fee.

## Reading holder rewards data

### Accounts

| Account                     | New field          | Type   | Meaning                                                          |
| --------------------------- | ------------------ | ------ | ---------------------------------------------------------------- |
| `BondingCurve` (Pump)       | `is_holder_reward` | `bool` | `true` on a holder rewards coin. Appended after the existing fields. |
| `Pool` (PumpSwap, canonical) | `is_holder_reward` | `bool` | Carried over from the bonding curve when the coin graduates.     |

Accounts written before the field existed are one byte shorter and should be read as `false`. The TS SDKs' decoders
(`PumpSdk.decodeBondingCurve`, `PumpAmmSdk.decodePool`) handle both lengths.

### Events

| Event                                    | New fields                                 | Meaning                                                                                                                           |
| ---------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `CreateEvent` (Pump)                     | `is_holder_reward: bool`                   | Whether the coin was created as a holder rewards coin.                                                                            |
| `CreatePoolEvent` (PumpSwap)             | `is_holder_reward: bool`                   | Same flag on the pool created at graduation.                                                                                      |
| `TradeEvent` (Pump)                      | `holder_rewards_bps: u64`, `holder_rewards: u64` | The creator fee rate and amount of this trade when the coin is a holder rewards coin; `0` otherwise.                        |
| `BuyEvent` / `SellEvent` (PumpSwap)      | `holder_rewards_bps: u64`, `holder_rewards: u64` | Same, for PumpSwap trades.                                                                                                    |

The existing `creator_fee` / `creator_fee_basis_points` (Pump) and `coin_creator_fee` / `coin_creator_fee_basis_points`
(PumpSwap) fields are unchanged and keep reporting the fee on holder rewards coins too, so existing indexers need no
change. Logs emitted before the new fields existed are shorter; read the missing fields as `0` / `false`.

## Cashback is deprecated

Cashback mode is deprecated. `create_v2` now rejects `is_cashback_enabled = [true]`, so **no new cashback coins can be
created**. Pass `[false]` or omit the argument.

Existing cashback coins are not affected:

- trading them works exactly as before, and their creator fee is still routed to the buyer as cashback;
- cashback that has already accrued stays claimable with `claim_cashback` / `claim_cashback_v2`, see
  [CLAIM_CASHBACK.md](instructions/CLAIM_CASHBACK.md).

## Community takeovers and creator fee changes

Contact the CTO team if you want to:

- change the creator fee bps of a coin on a **custom pair** (a coin paired with a quote asset other than SOL or USDC;
  SOL- and USDC-paired coins always use the standard fee schedule), or
- **convert an existing coin into a holder rewards coin**. Once converted, the coin stays a holder rewards coin.

## SDKs

- TS SDK: https://www.npmjs.com/package/@pump-fun/pump-sdk
- PumpSwap SDK: https://www.npmjs.com/package/@pump-fun/pump-swap-sdk

The IDLs in the [idl](../idl) directory are updated with the new argument, fields and events.
