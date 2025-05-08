import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export interface Global {
  initialized: boolean;
  authority: PublicKey;
  feeRecipient: PublicKey;
  initialVirtualTokenReserves: BN;
  initialVirtualSolReserves: BN;
  initialRealTokenReserves: BN;
  tokenTotalSupply: BN;
  feeBasisPoints: BN;
  withdrawAuthority: PublicKey;
  enableMigrate: boolean;
  poolMigrationFee: BN;
  creatorFeeBasisPoints: BN;
  feeRecipients: PublicKey[];
}

export interface BondingCurve {
  virtualTokenReserves: BN;
  virtualSolReserves: BN;
  realTokenReserves: BN;
  realSolReserves: BN;
  tokenTotalSupply: BN;
  complete: boolean;
  creator: PublicKey;
}

function getFee(
  global: Global,
  bondingCurve: BondingCurve,
  amount: BN,
  newCoin: boolean
): BN {
  return computeFee(amount, global.feeBasisPoints).add(
    newCoin || !PublicKey.default.equals(bondingCurve.creator)
      ? computeFee(amount, global.creatorFeeBasisPoints)
      : new BN(0)
  );
}

function computeFee(amount: BN, feeBasisPoints: BN): BN {
  return amount.mul(feeBasisPoints).add(new BN(9_999)).div(new BN(10_000));
}

export function getBuyTokenAmountFromSolAmount(
  global: Global,
  bondingCurve: BondingCurve,
  amount: BN,
  newCoin: boolean
): BN {
  if (amount.eq(new BN(0))) {
    return new BN(0);
  }

  // migrated bonding curve
  if (bondingCurve.virtualTokenReserves.eq(new BN(0))) {
    return new BN(0);
  }

  const totalFeeBasisPoints = global.feeBasisPoints.add(
    newCoin || !PublicKey.default.equals(bondingCurve.creator)
      ? global.creatorFeeBasisPoints
      : new BN(0)
  );

  const inputAmount = amount.muln(10_000).div(totalFeeBasisPoints.addn(10_000));

  const tokensReceived = inputAmount
    .mul(bondingCurve.virtualTokenReserves)
    .div(bondingCurve.virtualSolReserves.add(inputAmount));

  return BN.min(tokensReceived, bondingCurve.realTokenReserves);
}

export function getBuySolAmountFromTokenAmount(
  global: Global,
  bondingCurve: BondingCurve,
  amount: BN,
  newCoin: boolean
): BN {
  if (amount.eq(new BN(0))) {
    return new BN(0);
  }

  // migrated bonding curve
  if (bondingCurve.virtualTokenReserves.eq(new BN(0))) {
    return new BN(0);
  }

  const minAmount = BN.min(amount, bondingCurve.realTokenReserves);

  const solCost = minAmount
    .mul(bondingCurve.virtualSolReserves)
    .div(bondingCurve.virtualTokenReserves.sub(minAmount))
    .add(new BN(1));

  return solCost.add(getFee(global, bondingCurve, solCost, newCoin));
}

export function getSellSolAmountFromTokenAmount(
  global: Global,
  bondingCurve: BondingCurve,
  amount: BN
): BN {
  if (amount.eq(new BN(0))) {
    return new BN(0);
  }

  // migrated bonding curve
  if (bondingCurve.virtualTokenReserves.eq(new BN(0))) {
    return new BN(0);
  }

  const solCost = amount
    .mul(bondingCurve.virtualSolReserves)
    .div(bondingCurve.virtualTokenReserves.add(amount));

  return solCost.sub(getFee(global, bondingCurve, solCost, false));
}
