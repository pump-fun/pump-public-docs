## Overview

Cashback Rewards allows token creators to create coins with "cashback" enabled which redirects the creator fee to the users. Each user would get the creator fee on their swap volume as cashback rather than paying that fee to the coin creator.

This is a backwards compatible change, so if you do not update to the latest IDsL/SDKs it will work but cashback will not be enabled.

## Integration

You can also use our Typescript SDKs for easier integration:
- [Pump SDK](https://www.npmjs.com/package/@pump-fun/pump-sdk)
- [PumpSwap SDK](https://www.npmjs.com/package/@pump-fun/pump-swap-sdk)

## Changes to Instructions

Cashback is only given to the user if the buy/sell instruction appends the proper remaining accounts.
If the coin traded is a cashback coin but the cashback remaining accounts are now added, then the creator fee will
go to the creator as it normally would. 

### Bonding Curve Buy Instructions
No change. Cashback is handled automatically if the coin has cashback enabled.

### Bonding Curve Sell Instruction
Expects the `UserVolumeAccumulator` PDA for the Pump program at the 0th index in the remaining accounts with `isWritable: true`

### Pump Swap Buy Instruction
Expects the WSOL associated token account of the `UserVolumeAccumulator` for the Pump AMM program (this is different than same account for the Pump program) at the 0th index of the remaining accounts.

### Pump Swap Sell Instruction
Expects the WSOL associated token account of the `UserVolumeAccumulator` for the Pump AMM program (this is different than same account for the Pump program) at the 0th index of the remaining accounts.

Expects the `UserVolumeAccumulator` for the Pump AMM Program (used to derive the WSOL ATA above) at the 1st index of the remaining accounts.

### Create V2
New parameter expected for `create_v2` instruction which is an `OptionBool` to define whether the coin has cashback enabled or not.
In typescript this is a tuple, so it would look like `[true]`.

### Bonding Curve Claim Cashback
New `claim_cashback` instruction for the Pump program.
No parameters needed. It transfers native lamports from the `UserVolumeAccumulator` to the user.

### Pump Swap Claim Cashback
New `claim_cashback` instruction for the Pump AMM program.
No parameters needed. It transfers WSOL from the WSOL ATA of the `UserVolumeAccumulator` to the user's WSOL ATA.
The user's WSOL ATA is expected to exist before hand, so use "create idempotent associated token account" instruction before the claim instruction if need be.

## Account Changes

### Bonding Curve
New `is_cashback_coin: bool` field on the `BondingCurve` account.

## Reading Unclaimed Cashback
It is important to note that there is an `UserVolumeAccumulator` account for both the Pump (bonding curve) program and Pump Swap (AMM) program.
They share a seed `"user_volume_accumulator"` with the program ID being the only difference in its seeds.

Example of deriving the `UserVolumeAccumulator` for Pump program. Simply pass the `PUMP_AMM_PROGRAM_ADDRESS` instead to derive the `UserVolumeAccumulator` for Pump AMM.
```typescript
import {
  getAddressEncoder,
  getProgramDerivedAddress,
  getUtf8Encoder,
} from "@solana/kit";

const addressEncoder = getAddressEncoder();
const utf8Encoder = getUtf8Encoder();

export const USER_ACCUMULATOR_SEED = utf8Encoder.encode(
  "user_volume_accumulator",
);

export const NATIVE_MINT_ADDRESS = address(
  "So11111111111111111111111111111111111111112",
);

export function getUserAccumulatorPda(
  walletAddress: Address,
  programAddress: Address = PUMP_PROGRAM_ADDRESS,
) {
  return getProgramDerivedAddress({
    programAddress,
    seeds: [USER_ACCUMULATOR_SEED, addressEncoder.encode(walletAddress)],
  });
}

export async function getUserAccumulatorCashbackPda(
  walletAddress: Address,
  programAddress: Address = PUMP_PROGRAM_ADDRESS,
): Promise<ProgramDerivedAddress> {
  const [userAccumulatorPda] = await getUserAccumulatorPda(
    walletAddress,
    programAddress,
  );
  return findAssociatedTokenPda({
    mint: NATIVE_MINT_ADDRESS,
    owner: userAccumulatorPda,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
}
```

The cashback on Pump AMM is collected in the WSOL ATA of the `UserVolumeAccumulator` for the Pump AMM program (use the PUMP_AMM_PROGRAM_ADDRESS when deriving the PDA).
But in the Pump program (bonding curve / PUMP_PROGRAM_ADDRESS) the cashback is in native lamports in the `UserVolumeAccumulator` itself (not a WSOL ATA) and transferred as native lamports to the user's wallet (not a WSOL ATA).
This is because Pump AMM uses WSOL whereas the Pump program uses native lamports for swaps.

To read unclaimed cashback for bonding curve / Pump program:
**Read the lamports of the `UserVolumeAccumulator` for the Pump program minus the rent exempt lamports needed to keep the account open.**

To read unclaimed cashback for pump swap / Pump AMM program:
**Read the token balance of the WSOL ATA of the `UserVolumeAccumulator` for the Pump AMM program.**
