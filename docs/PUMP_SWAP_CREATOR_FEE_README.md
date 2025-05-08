PumpSwap (Pump AMM) program will have a breaking upgrade to add support for coin creator fees. Each swap on canonical
Pump pools will send a fee to a coin creator vault account, apart from the already existing lp fee and protocol fee.

Canonical Pump pools are pools which have a `Pool::creator` defined as a Pump program PDA with the following seeds:

```rust
pub fn pump_pool_authority_pda(base_mint: &Pubkey) -> Pubkey {
    let (pump_pool_authority, _) = Pubkey::find_program_address(
        &[b"pool-authority", base_mint.as_ref()],
        &Pubkey::from_str("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P").unwrap(),
    );
    pump_pool_authority
}
```

Canonical Pump pools are pools created by Pump program `migrate` instruction for completed bonding curves.

`Pool` accounts will be extended to `300` bytes to support future protocol updates, including this one. So
you need to prepend an `extendAccount(pool)` instruction to your buy / sell txs if the `pool.dataLen < 300`.

Both `buy` and `sell` instructions will be need to append two new inputs accounts (input account indexes `17` and `18`):

```rust
    #[account(
        mut,
        associated_token::mint = quote_mint,
        associated_token::authority = coin_creator_vault_authority,
        associated_token::token_program = quote_token_program,
    )]
    pub coin_creator_vault_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        seeds = [
            b"creator_vault",
            pool.coin_creator.as_ref()
        ],
        bump
    )]
    pub coin_creator_vault_authority: AccountInfo<'info >,
```

So the `coin_creator_vault_authority` PDA is dependent on a new `Pool::coin_creator` field. The updated `Pool` struct
will look like this:

```rust
#[account]
pub struct Pool {
    pub pool_bump: u8,
    pub index: u16,
    pub creator: Pubkey,
    pub base_mint: Pubkey,
    pub quote_mint: Pubkey,
    pub lp_mint: Pubkey,
    pub pool_base_token_account: Pubkey,
    pub pool_quote_token_account: Pubkey,
    pub lp_supply: u64,
    pub coin_creator: Pubkey, // new coin creator field, set only for canonical pools, otherwise set to Pubkey::default()
}
```

There is also another change in fee calculation. There will be a new `GlobalConfig::coin_creator_fee_basis_points`
field, which will be used in computing the coin creator fee. The new `GlobalConfig` struct will look like this:

```rust
#[account]
pub struct GlobalConfig {
    pub admin: Pubkey,
    pub lp_fee_basis_points: u64,
    pub protocol_fee_basis_points: u64,
    pub disable_flags: u8,
    pub protocol_fee_recipients: [Pubkey; 8],
    pub coin_creator_fee_basis_points: u64, // new coin creator fee bps field
}
```

Currently, the `GlobalConfig::coin_creator_fee_basis_points` field is set to `0`. But you can start using the new fee
calculation logic from now to be ready for the coin creator fee update. The latest `@pump-fun/pump-swap-sdk` NPM package
version contains all the updates for coin creator fee support: https://www.npmjs.com/package/@pump-fun/pump-swap-sdk.

All Pump canonical pools will start receiving coin creator fees on each swap after the coin creator fee update is
deployed and `GlobalConfig::coin_creator_fee_basis_points` is set something else apart from `0`.

The `Pool::coin_creator` parameter will be populated from:

- the new `coin_creator` argument passed to `create_pool` instruction for newly created canonical Pump pools. Otherwise,
  the new `coin_creator` argument is ignored.
- the `base_mint` Metaplex creator metadata or `BondingCurve::creator`, by using the `set_creator` instruction. You can
  include this instruction in your transactions, but it's not needed, as our backend service will listen for `BuyEvent`s
  and `SellEvent`s and will set the `Pool::coin_creator` dynamically for canonical pools missing it.

The fees accumulated in a creator vault ATA can be transferred to any token account of the coin creator using the
`PumpAmmSdk.collectCoinCreatorFee(coinCreator)` instruction. The `coinCreator` needs to sign the transaction including
this instruction.

The currently deployed PumpSwap program
on [Mainnet](https://solscan.io/account/pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA)
is backwards-compatible with the new update, so you can start using the new IDL from now, to be ready and not experience
any downtime when the coin creator fee update gets released.

We already updated the Devnet program, so you have time until Monday to implement the changes above. Ideally, the
same code should work on both the creator fee update on Devnet and the current Mainnet program, before we update
PumpSwap program on Mainnet to the coin creator fee update.
