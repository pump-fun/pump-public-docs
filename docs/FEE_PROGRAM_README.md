Hello. We pushed again the update to both Pump and PumpSwap programs which adds the 2 new additional accounts on buy / sell.

On Monday, September 1, 20:00 UTC, these 2 accounts will become mandatory and the programs fee structure will change from the existing one to a dynamic fee structure depending on the current market cap of the coin in lamports. This new fee structure applies only to:
- Pump bonding curves
- PumpSwap canonical pools, where a canonical pool is defined as a pool whose `pool.creator` (NOT `pool.coinCreator`) is defined as:
```Typescript
export function isPumpPool(
 baseMint: PublicKey,
 poolCreator: PublicKey,
): boolean {
 return pumpPoolAuthorityPda(baseMint)[0].equals(poolCreator);
}
```

The new fee structure code is present in both our Typescript SDKs:
- https://www.npmjs.com/package/@pump-fun/pump-sdk?activeTab=code
- https://www.npmjs.com/package/@pump-fun/pump-swap-sdk?activeTab=code

The market cap in lamports for bonding curve is computed as follows:
```Typescript
export function bondingCurveMarketCap({
 mintSupply,
 virtualSolReserves,
 virtualTokenReserves,
}: {
 mintSupply: BN;
 virtualSolReserves: BN;
 virtualTokenReserves: BN;
}): BN {
 if (virtualTokenReserves.isZero()) {
   throw new Error("Division by zero: virtual token reserves cannot be zero");
 }
 return virtualSolReserves.mul(mintSupply).div(virtualTokenReserves);
}
```

The market in lamports for a PumpSwap canonical pool is:
```Typescript
export function poolMarketCap({
 baseMintSupply,
 baseReserve,
 quoteReserve,
}: {
 baseMintSupply: BN;
 baseReserve: BN;
 quoteReserve: BN;
}): BN {
 if (baseReserve.isZero()) {
   throw new Error(
     "Division by zero: pool base token reserves cannot be zero",
   );
 }
 return quoteReserve.mul(baseMintSupply).div(baseReserve);
}
```

For bonding curve program, the fee bps for protocol and creator fees will be computed using the following logic:
```Typescript
export function computeFeesBps({
 global,
 feeConfig,
 mintSupply,
 virtualSolReserves,
 virtualTokenReserves,
}: {
 global: Global;
 feeConfig: FeeConfig | null;
 mintSupply: BN;
 virtualSolReserves: BN;
 virtualTokenReserves: BN;
}): CalculatedFeesBps {
 if (feeConfig != null) {
   const marketCap = bondingCurveMarketCap({
     mintSupply,
     virtualSolReserves,
     virtualTokenReserves,
   });

   return calculateFeeTier({
     feeTiers: feeConfig.feeTiers,
     marketCap,
   });
 }

 return {
   protocolFeeBps: global.feeBasisPoints,
   creatorFeeBps: global.creatorFeeBasisPoints,
 };
}

/// rust reference: pump-fees-math::calculate_fee_tier()
export function calculateFeeTier({
 feeTiers,
 marketCap,
}: {
 feeTiers: FeeTier[];
 marketCap: BN;
}): Fees {
 const firstTier = feeTiers[0];

 if (marketCap.lt(firstTier.marketCapLamportsThreshold)) {
   return firstTier.fees;
 }

 for (const tier of feeTiers.slice().reverse()) {
   if (marketCap.gte(tier.marketCapLamportsThreshold)) {
     return tier.fees;
   }
 }

 return firstTier.fees;
}
```

A similar logic will be used for PumpSwap canonical pools too:
```Typescript
export function computeFeesBps({
 globalConfig,
 feeConfig,
 creator,
 baseMintSupply,
 baseMint,
 baseReserve,
 quoteReserve,
 tradeSize,
}: {
 globalConfig: GlobalConfig;
 feeConfig: FeeConfig | null;
 creator: PublicKey;
 baseMintSupply: BN;
 baseMint: PublicKey;
 baseReserve: BN;
 quoteReserve: BN;
 tradeSize: BN;
}): Fees {
 if (feeConfig != null) {
   const marketCap = poolMarketCap({
     baseMintSupply,
     baseReserve,
     quoteReserve,
   });

   return getFees({
     feeConfig,
     isPumpPool: isPumpPool(baseMint, creator),
     marketCap,
     tradeSize,
   });
 }

 return {
   lpFeeBps: globalConfig.lpFeeBasisPoints,
   protocolFeeBps: globalConfig.protocolFeeBasisPoints,
   creatorFeeBps: globalConfig.coinCreatorFeeBasisPoints,
 };
}

/// rust reference: pump-fees::get_fees()
function getFees({
 feeConfig,
 isPumpPool,
 marketCap,
}: {
 feeConfig: FeeConfig;
 isPumpPool: boolean;
 marketCap: BN;
 tradeSize: BN;
}): Fees {
 if (isPumpPool) {
   return calculateFeeTier({
     feeTiers: feeConfig.feeTiers,
     marketCap,
   });
 } else {
   return feeConfig.flatFees;
 }
}

/// rust reference: pump-fees-math::calculate_fee_tier()
export function calculateFeeTier({
 feeTiers,
 marketCap,
}: {
 feeTiers: FeeTier[];
 marketCap: BN;
}): Fees {
 const firstTier = feeTiers[0];

 if (marketCap.lt(firstTier.marketCapLamportsThreshold)) {
   return firstTier.fees;
 }

 for (const tier of feeTiers.slice().reverse()) {
   if (marketCap.gte(tier.marketCapLamportsThreshold)) {
     return tier.fees;
   }
 }

 return firstTier.fees;
}
```

We will use the following fee tiers starting from Monday:
![Fee Tiers](fees.png)

In order to avoid possible issues created by the new fee structure, until you make sure it's implemented correctly, you can increase the slippage tolerance on buy / sell instructions as a temporary mitigation.

If you implement the fee logic correctly, any future change to the fee tiers structure above should not affect your code.