# Frequently Asked Questions

## How to optimize buy / sell CU limit?

Each buy / sell instruction used CUs depend on all the inputs of the instruction:

- `user` pubkey, through the `associated_user` PDA bump seed derivation.
- `mint` pubkey, through the `bonding_curve`, `associated_bonding_curve`, `associated_user` PDA bump seed derivation.
- `creator` pubkey, through the `creator_vault` PDA bump seed derivation.
- for buy, the `amount` and `max_sol_cost` inputs are logged as part of instruction execution, so bigger values consume
  more CUs to log than smaller values.
- for sell inputs, it's similar.

As an example, for the
tx https://solscan.io/tx/5frph8gBFyX7ayBmqntvwpTPwzZ8aF4kdfJAvC52Li2iDnnaRwtmcZP839Cm4YQUFx7GzsUUStCfAy3hAG69ir4u:

```Rust
    let mint = Pubkey::from_str("Coyj3LtKn1BNSgWc9HsGK5SKoGfEoDaymig4wrN6pump").unwrap();

assert_eq!(
    Pubkey::find_program_address(&[b"bonding-curve", mint.as_ref()], &pump::ID).1,
    255
);
```

The `bonding_curve` bump seed for mint `Coyj3LtKn1BNSgWc9HsGK5SKoGfEoDaymig4wrN6pump` is `255`.

While for the
tx https://solscan.io/tx/5xozUcJFvRj4ySpE2epSSs95ySxs6cLjs1rV2uaFNkFgsEMBZW53VUa2uc3CVQLVJRYxfQ5JoSzZLiUvAgM4GEJM:

```Rust
    let mint = Pubkey::from_str("3cLSxG6eXcCD9NSMawkhUcrvVCUC8KHKHMCxx6bhpump").unwrap();

assert_eq!(
    Pubkey::find_program_address(&[b"bonding-curve", mint.as_ref()], &pump::ID).1,
    251
);
```

The `bonding_curve` bump seed for mint `3cLSxG6eXcCD9NSMawkhUcrvVCUC8KHKHMCxx6bhpump` is `251`.

So it is not possible to compute the used CUs without first simulating the buy / sell tx before submission and adding a
buffer of 1% to the simulated CUs, because buy instruction executes a bit more code when the bonding curve completes on
that buy.

But since tx simulation before buy / sell slows down tx submission and can increase the chances for slippage errors, it
is recommended to use a static big enough CU limit like `100_000`.
