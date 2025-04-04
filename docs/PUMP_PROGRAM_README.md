# Pump program

Pump program allows creating SPL coins that are instantly tradeable on a bonding curve without having to seed liquidity.
When the coin hits a certain market cap the liquidity from the bonding curve is migrated to PumpSwap (an AMM on Solana).
The LP tokens received from the PumpSwap pool are then burnt.

The bonding curve formula is based on Uniswap V2 and uses synthetic x and y reserves to ensure that there is liquidity
for the coin.

Pump program is deployed at address `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P` on
both [Mainnet](https://solscan.io/account/6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P)
and [Devnet](https://solscan.io/account/6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P?cluster=devnet).

## State

### Global

The global configuration of the program is stored in the only `Global` account, whose address is
`4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf` (PDA-derived from `["global"]` seeds). The content of this account
can be examined
on [Mainnet Solscan](https://solscan.io/account/4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf#anchorData):

```json
{
  "initialized": {
    "type": "bool",
    "data": true
  },
  "authority": {
    "type": "pubkey",
    "data": "FFWtrEQ4B4PKQoVuHYzZq8FabGkVatYzDpEVHsK5rrhF"
  },
  "fee_recipient": {
    "type": "pubkey",
    "data": "62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV"
  },
  "initial_virtual_token_reserves": {
    "type": "u64",
    "data": "1073000000000000"
  },
  "initial_virtual_sol_reserves": {
    "type": "u64",
    "data": "30000000000"
  },
  "initial_real_token_reserves": {
    "type": "u64",
    "data": "793100000000000"
  },
  "token_total_supply": {
    "type": "u64",
    "data": "1000000000000000"
  },
  "fee_basis_points": {
    "type": "u64",
    "data": "100"
  },
  "withdraw_authority": {
    "type": "pubkey",
    "data": "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg"
  },
  "enable_migrate": {
    "type": "bool",
    "data": true
  },
  "pool_migration_fee": {
    "type": "u64",
    "data": "15000001"
  },
  "creator_fee": {
    "type": "u64",
    "data": "0"
  },
  "fee_recipients": {
    "type": {
      "array": [
        "pubkey",
        7
      ]
    },
    "data": [
      "7VtfL8fvgNfhz17qKRMjzQEXgbdpnHHHQRh54R9jP2RJ",
      "7hTckgnGnLQR6sdH7YkqFTAA7VwTfYFaZ6EhEsU3saCX",
      "9rPYyANsfQZw3DnDmKE3YCQF5E8oD89UXoHn9JFEhJUz",
      "AVmoTthdrX6tKt4nDjco2D775W2YK3sDhxPcMmzUAmTY",
      "CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM",
      "FWsW1xNtWscwNmKv6wVsU1iTzRN6wmmk3MjxRP5tT7hz",
      "G5UZAVbAf46s7cKWoyKu8kYTip9DGTpbLZ2qa9Aq69dP"
    ]
  }
}
```

- The `initialized` field is set to `true` and never used.
- The `authority` pubkey is the authority which can update the global configuration.
- The `fee_recipient` pubkey is one of the 8 fee_recipients which can be used by `buy` / `sell` instructions, together
  with the other 7 `Global::fee_recipients` pubkeys.
- The `initial_virtual_token_reserves`, `initial_virtual_sol_reserves`, `initial_real_token_reserves` and
  `token_total_supply` fields are used as the initial parameters for the bonding curve of each newly created coin.
- The `fee_basis_points == 100 bps` represents the fee in bps transferred to the `fee_recipient` account on `buy` /
  `sell` instructions.
- The `withdraw_authority` pubkey is the authority which can call the deprecated `withdraw` instruction.
- The `enable_migrate` flag is used to enable the new `migrate` instruction and disable the deprecated `withdraw`
  instruction. Currently, it is set to `true`.
- The `pool_migration_fee` are the minimum lamports necessary to pay for all accounts created during `migrate`
  instruction. It is currently set the minimum of `15000001`, less than `MAX_MIGRATE_FEES == 15_000_000`, which
  represents
  the maximum cost of all accounts created during a `migrate` instruction.
- The `creator_fee` is set to `0` and is not used.

### Bonding curve

Each coin has an associated bonding curve account, which is PDA-derived from `["bonding-curve", mint]` seeds. An example
bonding curve account can be found
at https://solscan.io/account/EsmVk4MTsoT71JFaRM5DWFZboKpMQjfY6EYzAgUuksXw#anchorData:

```json
{
  "virtual_token_reserves": {
    "type": "u64",
    "data": "1072999999992855"
  },
  "virtual_sol_reserves": {
    "type": "u64",
    "data": "30000000013"
  },
  "real_token_reserves": {
    "type": "u64",
    "data": "793099999992855"
  },
  "real_sol_reserves": {
    "type": "u64",
    "data": "13"
  },
  "token_total_supply": {
    "type": "u64",
    "data": "1000000000000000"
  },
  "complete": {
    "type": "bool",
    "data": false
  }
}
```

- The `virtual_token_reserves`, `virtual_sol_reserves`, `real_token_reserves` and `token_total_supply` fields are
  initialized on coin creation to the corresponding values from `Global` account. The initial `real_sol_reserves` is set
  to `0`.
- On each `buy` operation, `virtual_sol_reserves` and `real_sol_reverses` increase with the same lamports amount
  according to
  the bonding curve formula, while `virtual_token_reserves` and `real_token_reserves` decrease with the same coin
  amount.
- On each `sell` operation, `virtual_sol_reserves` and `real_sol_reverses` decrease with the same lamports amount
  according to
  the bonding curve formula, while `virtual_token_reserves` and `real_token_reserves` increase with the same coin
  amount.
- The `complete` field is initially set to `false`. It is set to `true` at the end of a `buy` instruction, when
  `real_token_reserves == 0`, so there are no more real tokens left in the bonding curve.

## Instructions

- `create(user, name, symbol, uri, creator)` allows a `user` to create a new coin with the given `name`, `symbol` and
  `uri`. The `creator` pubkey is the creator which will be added to the mint Metaplex metadata `creators` array,
  together with the provided `name`, `symbol` and `uri`.
    - In general, `user` and `creator` are the same pubkey, but they can be different, for example, on the
      `free coin creation` flow, when the first coin buyer also creates the coin on-chain. In this case, `creator`
      pubkey is the original coin creator, while `user` pubkey is the first buyer. This is also the reason why `creator`
      pubkey is not required to be a signer for this instruction, as the original creator cannot sign the tx of the
      first coin buyer.

- `buy(user, associated_user, mint, amount, max_sol_cost)` allows a `user` to buy the exact `amount` of coins from the
  bonding curve of the given `mint`, using at most `max_sol_cost` lamports.

- `sell(user, associated_user, mint, amount, min_sol_output)` allows a `user` to sell the exact `amount` of coins to
  the bonding curve of the given `mint`, receiving at least `min_sol_output` lamports.

- `withdraw(withdraw_authority, mint)` is a now-disabled instruction which allowed the `withdraw_authority` pubkey to
  withdraw the liquidity of a completed bonding curve and migrate it to Raydium from an off-chain server.

- `migrate(user, mint)` allows any `user` to migrate the liquidity of a completed bonding curve of the given `mint` to
  PumpSwap AMM. A completed bonding curve is a bonding curve with `complete == true` and `real_token_reserves == 0`. The
  `migrate` instruction is idempotent, meaning that running it on a completed and migrated bonding curve does nothing.
  It is also permisionless, so anyone can migrate a completed bonding curve.

- `extend_account(user, account)` allows anyone to extend the data size of any program-owned account (`Global` or
  `BondingCurve`) in order to allow adding new fields to the existing account types.

- `initialize(user, global)` initialized the sole `Global` account on Pump program deployment and can be executed by
  anyone. The first pubkey which successfully executes `initialize` is the one which sets the `Global::authority` field.
  This instruction cannot be called more than once because the second time it is called, the `Global` account already
  exists.
- `update_global_authority(global, authority, new_authority)` allows the current `Global::authority` to update the
  `Global::authority` field to a new pubkey.
- `set_params(global, authority)` allows updating all the `Global` account fields, apart from `Global::authority`, which
  is updated using `update_global_authority` instruction.
