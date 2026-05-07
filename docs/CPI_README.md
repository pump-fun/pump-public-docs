# CPI into pump from your own Anchor program

For CPI into pump's `buy_v2`, `sell_v2`, or any other pump instruction,
use `pump_rust_client` and follow the example below.

## Wrapper program

Your wrapper's `Accounts` struct must mirror pump's `BuyV2` account order
exactly:

```rust
use anchor_lang::prelude::*;

declare_id!("7enkT8uLQrwKYSRMrazjr1YZPT7unToAtwdLMWa2QLYY");
declare_program!(pump);

#[program]
pub mod example_cpi_program {
    use super::*;

    pub fn buy_v2(ctx: Context<BuyV2>, amount: u64, max_sol_cost: u64) -> Result<()> {
        pump::cpi::buy_v2(
            CpiContext::new(
                ctx.accounts.program.to_account_info(),
                pump::cpi::accounts::BuyV2 {
                    global: ctx.accounts.global.to_account_info(),
                    // ... all pump BuyV2 accounts, same order ...
                    program: ctx.accounts.program.to_account_info(),
                },
            ),
            amount,
            max_sol_cost,
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct BuyV2<'info> {
    /// CHECK: passed straight to pump
    pub global: UncheckedAccount<'info>,
    // ... fields in the same order as pump::cpi::accounts::BuyV2 ...
    #[account(mut)]
    pub user: Signer<'info>,
    // ...
    /// CHECK: pump program; CPI target
    pub program: UncheckedAccount<'info>,
}
```

## Typed account decoding

If you want `Account<'info, BondingCurve>` (or any other deserialized pump
account type) instead of `UncheckedAccount`, import the type from
`pump_rust_client::state`, **not** from `declare_program!(pump)`'s generated
`pump::accounts` module:

```rust
use pump_rust_client::state::BondingCurve;

#[derive(Accounts)]
pub struct BuyV2<'info> {
    // ...
    pub bonding_curve: Account<'info, BondingCurve>,
    // ...
}
```

`pump_rust_client::state` types are wrapped in `AccountWrapper`, which
zero-pads short buffers so older on-chain accounts (e.g. pre-existing
`BondingCurve`s) still deserialize. The raw IDL type does not, and will fail
on legacy accounts. The same applies to the other re-exports under
`pump_rust_client::state` and its `pump_amm` / `pump_agent_payments`
submodules (`Global`, `FeeConfig`, `pump_amm::Pool`, …).

You're also welcome to look into the source code (`src/account_wrapper.rs`)
to see how on-chain accounts like `BondingCurve` are deserialized without
errors by padding short buffers with extra zeros.

## `idl-build` feature

`pump-rust-client` exposes an `idl-build` feature that forwards to the
underlying anchor IDL build machinery. When your wrapper program builds its
own IDL (e.g. via `anchor build`), wire it up in your program's `Cargo.toml`
so pump's types are included in your IDL:

```toml
[features]
idl-build = [
    "anchor-lang/idl-build",
    "anchor-spl/idl-build",
    "pump-rust-client/idl-build",
]

[dependencies]
pump-rust-client = { version = "...", path = "..." }
```
