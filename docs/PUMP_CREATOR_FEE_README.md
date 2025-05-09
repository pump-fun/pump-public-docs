Pump program will have a breaking upgrade to add support for coin creator fees. Each swap on a not-yet-completed
bonding curve will send a fee to a coin creator vault account, apart from the already existing protocol fee.

`BondingCurve` accounts will be extended to `150` bytes to support future protocol updates, including this one. So
you need to prepend an `extendAccount(bondingCurve)` instruction to your buy / sell txs if the
`bondingCurveAccountInfo.dataLen < 150`.

`buy` and `sell` instructions will be modified in the following way:

- the currently unused `Buy::rent` account (instruction account index `10`) will become `Buy::creator_vault` account.
- the currently unused `Sell::associated_token_program` account (instruction account index `8`) will become
  `Sell::creator_vault` account.

Both `Buy::creator_vault` and `Sell::creator_vault` accounts are PDA accounts with the following definition:

```rust
    #[account(
        mut,
        seeds = [
            b"creator-vault",
            bonding_curve.creator.as_ref()
        ],
        bump
    )]
    pub creator_vault: AccountInfo<'info >,
```

So the creator_vault PDA is dependent on a new `BondingCurve::creator` field. The updated `BondingCurve` struct will
look like this:

```rust
#[account]
pub struct BondingCurve {
    pub virtual_token_reserves: u64,
    pub virtual_sol_reserves: u64,
    pub real_token_reserves: u64,
    pub real_sol_reserves: u64,
    pub token_total_supply: u64,
    pub complete: bool,
    pub creator: Pubkey, // new creator field
}
```

There is also another change in fee calculation. There will be a new `Global::creator_fee_basis_points` field, which
will be used in computing the creator fee. The new `Global` struct will look like this:

```rust
#[account]
pub struct Global {
    pub initialized: bool,
    pub authority: Pubkey,
    pub fee_recipient: Pubkey,
    pub initial_virtual_token_reserves: u64,
    pub initial_virtual_sol_reserves: u64,
    pub initial_real_token_reserves: u64,
    pub token_total_supply: u64,
    pub fee_basis_points: u64,
    pub withdraw_authority: Pubkey,
    pub enable_migrate: bool,
    pub pool_migration_fee: u64,
    pub creator_fee_basis_points: u64, // new creator fee bps field
    pub fee_recipients: [Pubkey; 7],
    pub set_creator_authority: Pubkey,
}
```

Currently, the `Global::creator_fee_basis_points` field is set to `0`. But you can start using the new fee calculation
logic from now to be ready for the creator fee update. The latest version of our Typescript SDK includes the updated fee 
logic: [Pump SDK](https://www.npmjs.com/package/@pump-fun/pump-sdk) (including the source code of the SDK).

These functions do not include slippage in their calculations, but the slippage needs to be applied to sol amount for
both `buy` and `sell` instructions. Instructions which allow slippage for coin amount will be added to the Pump program
in the future.

All non-completed bonding curves will start receiving creator fees on swaps after the coin creator fee update is
deployed and `Global::creator_fee_basis_points` is set something else apart from `0`.

The `BondingCurve::creator` parameter will be populated from:
- the `creator` argument passed to `create` instruction for newly created coins. So be careful what `creator` pubkey
  you pass to the `create` instruction, as that pubkey will receive all the creator fees for that coin.
- the Metaplex creator metadata for coins which have it, by using the `set_metaplex_creator` instruction. You can
  include
  this instruction in your transactions, but it's not needed, as our backend service will listen for `TradeEvent`s and
  will set the `BondingCurve::creator` dynamically for coins missing it.
- our coins storage for coins created in the past and don't have Metaplex creator metadata. The backend service will
  listen for `TradeEvent`s and will set the `BondingCurve::creator` dynamically for coins missing it using the admin
  `set_creator` instruction.

The fees accumulated in a creator vault account can be transferred to the creator's wallet using the 
`collectCreatorFee(creator)` instruction. The `creator` needs to sign the transaction including this instruction.

The currently deployed Pump program on [Mainnet](https://solscan.io/account/6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P)
is backwards-compatible with the new update, so you can start using the new IDL from now, to be ready and not experience
any downtime when the creator fee update gets released.

We already updated the Devnet program, so you have time until Monday to implement the changes above. Ideally, the
same code should work on both the creator fee update on Devnet and the current Mainnet program, before we update Pump
program on Mainnet to the creator fee update.

We are also trying to release the Pump program Typescript SDK by Monday, so you can use it. The 
[bondingCurve.ts](bondingCurve.ts) file is part of the upcoming Pump program Typescript SDK.
