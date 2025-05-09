# pump-public-docs

## Coin creator fees update

We will deploy a breaking update to both Pump and PumpSwap (Pump AMM) programs to add support for coin creator fees on
Mainnet on Monday, May 12, 11:00 AM UTC.

On Devnet, both programs have already been updated to support coin creator fees.

Who will receive coin creator fees?
- all non-completed Pump bonding curves;
- all canonical PumpSwap pools will. Canonical PumpSwap pools are pools created by Pump program `migrate` instruction
  for completed bonding curves.

Who will not receive coin creator fees?
- coins already migrated to Raydium, as that program is not under our control.
- normal PumpSwap pools which are not created by Pump program `migrate` instruction.

You should start by using the latest IDL files for both programs from the [idl](idl) directory. They are 
backwards-compatible with current programs deployed on Mainnet, so you can start using them now.

You can also use our Typescript SDKs for easier integration:
- [Pump SDK](https://www.npmjs.com/package/@pump-fun/pump-sdk)
- [PumpSwap SDK](https://www.npmjs.com/package/@pump-fun/pump-swap-sdk)

If you implement and test the changes described in these two documents on Devnet before the creator fee upgrade, you
should not experience any downtime. Ideally, you should use exactly the same code for both Devnet and Mainnet, before
we update the programs on Mainnet.
- [Pump Program creator fee update](docs/PUMP_CREATOR_FEE_README.md)
- [PumpSwap creator fee update](docs/PUMP_SWAP_CREATOR_FEE_README.md)

## Other documentation

- [Pump Program](docs/PUMP_PROGRAM_README.md)
- [PumpSwap](docs/PUMP_SWAP_README.md)
- [PumpSwap SDK](docs/PUMP_SWAP_SDK_README.md)
