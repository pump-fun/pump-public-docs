# pump-public-docs

# Holder Rewards Coins and the End of Cashback

Coins can now be created as **holder rewards coins**: the creator fee charged on every trade is set aside for the coin's
holders and paid out to them by pump.fun, instead of going to a creator wallet.

- `create_v2` takes one new trailing, optional `is_holder_reward` (`OptionBool`) argument. `[true]` creates a holder
  rewards coin; omitted or `[false]` creates a regular coin, so existing integrations keep working unchanged.
- **There are no trade interface changes.** `buy`, `sell`, `buy_v2`, `sell_v2`, `buy_exact_quote_in_v2` and the PumpSwap
  `buy` / `sell` take the same accounts and arguments for every coin.
- `BondingCurve` and PumpSwap `Pool` gain an `is_holder_reward` flag; `CreateEvent` / `CreatePoolEvent` gain
  `is_holder_reward`; `TradeEvent` and PumpSwap `BuyEvent` / `SellEvent` gain `holder_rewards_bps` / `holder_rewards`.
  The existing creator fee fields are unchanged.
- **Cashback mode is deprecated.** `create_v2` rejects `is_cashback_enabled = [true]`, so no new cashback coins can be
  created. Existing cashback coins keep trading as before and their accrued cashback stays claimable.
- Contact the CTO team if you want the creator fee bps changed on a custom pair, or an existing coin converted into a
  holder rewards coin.

Full details: [Holder rewards coins](docs/HOLDER_REWARDS_README.md).

# PumpSwap Update: Virtual Quote Reserves

PumpSwap pools now carry a `virtual_quote_reserves` field (appended to the `Pool` account). Buys and sells are priced against the pool's **effective quote reserves**:

```text
effective_quote_reserves = pool_quote_token_account.amount + Pool::virtual_quote_reserves
```

- Use effective quote reserves (not the raw quote-vault token balance) wherever you quote, price, or index a pool.
- `virtual_quote_reserves` is `0` on all pools today, so quotes are unchanged. Switching to effective quote reserves now keeps your quotes correct if a pool later carries a non-zero value.
- Indexers: the `BuyEvent` and `SellEvent` logs include the appended `virtual_quote_reserves` field, so effective quote reserves can be reconstructed from the event stream.

Full details: [PumpSwap docs — Quoting: effective quote reserves](docs/PUMP_SWAP_README.md#quoting-effective-quote-reserves).

# New Bonding Curve Trade Instructions

Hello everyone. As part of supporting stable paired meme coins, we are announcing three new trading instructions for the bonding curve program:

- `buy_v2`
- `sell_v2`
- `buy_exact_quote_in_v2`

These new instructions have no optional accounts. All accounts are mandatory and are passed in the same order for all kinds of coins.

This should alleviate many of the issues integrations are facing when choosing which accounts to pass based on the type of coin being traded.

We are moving to this new unified interface and would urge all integrations to switch to these instructions to future proof their setup.

## Existing Trade Instructions

All existing trade instructions will continue to work with the same setup. No changes are needed to continue trading coins with the existing coins.

You can switch to the new instructions to trade coins paired with both SOL and USDC, with no change to quotes or costs.

The first feature we are looking to support with the new interface is the addition of USDC as a quote asset for meme coins.

## Important Note For Existing Coins

These new interfaces can be used to trade all coins ever created by passing the quote mint as the wrapped SOL mint:

```text
So11111111111111111111111111111111111111112
```

Trading and transfer will continue to happen with native SOL for these coins. However, to provide a unified interface regardless of `quote_mint`, please pass the wrapped SOL mint shown above.

## What's New

- `user_volume_accumulator` account is mandatory for all buys and sells.
- `sharing_config` PDA is mandatory for all buys and sells.
- Added the following accounts to support more quote mints:
  - `quote_mint`
  - `associated_quote_bonding_curve`
  - `associated_quote_fee_recipient`
  - `associated_quote_buyback_fee_recipient`
  - `associated_creator_vault`
  - `associated_quote_user`
- Added a new `quote_mint` field in the bonding curve struct. This field is `Pubkey::default()` for all coins created to date and for all coins created with SOL as the quote mint.
- Renamed `real_sol_reserves` to `real_quote_reserves` in the BondingCurve.
- Renamed `virtual_sol_reserves` to `virtual_quote_reserves` in the BondingCurve.
- New Global field called `initial_virtual_quote_reserves`. Coins paired with SOL have their BondingCurve.`virtual_quote_reserves` start at `initial_virtual_sol_reserves`. All other quote mints will start theirs at `initial_virtual_quote_reserves`.

## SOL-Paired Meme Coins

Trading will continue to happen with native SOL for all SOL-paired coins. For those coins, the following accounts are only Anchor seed constrained to the quote mint and do not need to be initialized for the instruction to work:

- `associated_quote_fee_recipient`
- `associated_quote_buyback_fee_recipient`
- `associated_quote_bonding_curve`
- `associated_quote_user`
- `associated_creator_vault`
- `associated_user_volume_accumulator`

When using the new instructions (`buy_v2`, `sell_v2`, `buy_exact_quote_in_v2`) for SOL-paired meme coins, there will be no extra cost compared to the legacy instructions (`buy`, `sell`, `buy_exact_quote_in`). All account initialization costs remain the same.

## Launch Timeline

Today we are only announcing the launch of the new interface.

Currently, no quote mint other than native SOL can be used to create or trade coins. We will add USDC next week. Exact Date and time TBH. Trading USDC-paired coins will not be possible with the legacy instructions.

## SDKS

- TS SDK: https://www.npmjs.com/package/@pump-fun/pump-sdk
- RUST crate: https://crates.io/crates/pump-rust-client

## New docs
- Holder rewards coins: [docs/HOLDER_REWARDS_README.md](docs/HOLDER_REWARDS_README.md)
- Fee recipients: [docs/FEE_RECIPIENTS.md](docs/FEE_RECIPIENTS.md)
- Coin creation: [docs/instructions/COIN_CREATION.md](docs/instructions/COIN_CREATION.md)
- Buy: [docs/instructions/BUY.md](docs/instructions/BUY.md)
- Sell: [docs/instructions/SELL.md](docs/instructions/SELL.md)
- Claim cashback (existing cashback coins only, cashback is deprecated): [docs/instructions/CLAIM_CASHBACK.md](docs/instructions/CLAIM_CASHBACK.md)
- Collect creator fee: [docs/instructions/COLLECT_CREATOR_FEE.md](docs/instructions/COLLECT_CREATOR_FEE.md)
- Creator fee sharing: [docs/instructions/CREATOR_FEE_SHARING.md](docs/instructions/CREATOR_FEE_SHARING.md)




## Other documentation

- [Pump Program](docs/PUMP_PROGRAM_README.md)
- [PumpSwap](docs/PUMP_SWAP_README.md)
- [PumpSwap SDK](docs/PUMP_SWAP_SDK_README.md)
- [Pump Program creator fee update](docs/PUMP_CREATOR_FEE_README.md)
- [PumpSwap creator fee update](docs/PUMP_SWAP_CREATOR_FEE_README.md)
- [FAQ](docs/FAQ.md)
- [Pump fee program docs](docs/FEE_PROGRAM_README.md)

---