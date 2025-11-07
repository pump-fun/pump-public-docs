# pump-public-docs

[Pump fee program docs](docs/FEE_PROGRAM_README.md)

## Other documentation

- [Pump Program](docs/PUMP_PROGRAM_README.md)
- [PumpSwap](docs/PUMP_SWAP_README.md)
- [PumpSwap SDK](docs/PUMP_SWAP_SDK_README.md)
- [Pump Program creator fee update](docs/PUMP_CREATOR_FEE_README.md)
- [PumpSwap creator fee update](docs/PUMP_SWAP_CREATOR_FEE_README.md)
- [FAQ](docs/FAQ.md)



# ⚠️ Breaking Change Announcement — Bonding Curve and Pump Swap Programs on 12:00 UTC, 11 November 2025 

---


### Mayhem program id: 
`MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e`
### Mayhem fee recipient:
`GesfTA3X2arioaHp8bbKdjG9vJtskViWACZoYvxp4twS` 

---

## 1. Changes Summary

1. **BondingCurve and Pool struct size increase**  
   The `bondingCurve` account now needs to be at least **82 bytes** in size (was 81 earlier) and the `pool` structure needs to be **244 bytes** (was 243 earlier).  
   This is because of a new field called `is_mayhem_mode` on both structs which is a boolean. 
   If the account lengths are insufficient, the buy and sell instruction will handle the size extension under the hood, no change needed on your end.

2. **New instruction to create tokens called `create_v2`**  
   This instruction will use the **Token2022 program** for token creations and to host the metadata, instead of Metaplex.

3. **New fee recipient requirement for mayhem mode coins**  
   For coins which have `is_mayhem_mode = true` (on both the bonding curve and pool), the fee recipient that should be passed must be changed.

---

## 2. What This Means to You


### 1️⃣ Introducing `create_v2`

We will move to a new standard of token creation with a new instruction called `create_v2`.  
This instruction will use the **Token2022 program** for minting tokens and managing metadata, replacing the legacy Metaplex approach.  
The original `create` instruction will also be active and will be **deprecated** at a later time (to be announced).

| Index | Account | Change needed | Seeds |
| ----- | ------ | ----- | ----- |
| 1 | Mint | None | - |
| 2 | Mint Authority | None | "mint-authority" + PUMP_PROGRAM_ID |
| 3 | Bonding Curve | None | "bonding-curve" + mint + PUMP_PROGRAM_ID |
| 4 | Associated Bonding Curve | Token account should now be owned by Token 2022 instead of Legacy Token | Token 2022 owned token account of Bonding curve account |
| 5 | Global | None | "global" + PUMP_PROGRAM_ID |
| 6 | User | None | - |
| 7 | System Program | None | - |
| 8 | Token Program | Pass Token 2022 instead of Legacy Token program | - |
| 9 | Associated Token Program | None | - |
| 10 | Mayhem Program ID | New Static account: `MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e`| - |
| 11 | Global Params | New Static account: `13ec7XdrjF3h3YcqBTFDSReRcUFwbCnJaAQspM4j6DDJ`| "global-params" + MAYHEM_PROGRAM_ID |
| 12 | Sol Vault | New Static account: `BwWK17cbHxwWBKZkUYvzxLcNQ1YVyaFezduWbtm2de6s` | "sol-vault" + MAYHEM_PROGRAM_ID |
| 13 | Mayhem State | New Account: dependent on the mint | "mayhem-state" + mint + MAYHEM_PROGRAM_ID |
| 14 | Mayhem Token Vault | New Account: Token 2022 owned token account of Sol vault account | - |


#### Key Points about trading `create_v2` coins:

- The **associated bonding curve account** will be owned by the **Token2022 program**, not the legacy token program.  
- The **user token account** should also be derived with Token2022 instead of the legacy token program.  
- There is a **new boolean instruction parameter** for `create_v2` called `is_mayhem_mode`.  
- Pass the token2022 program instead of the legacy token program.
- All coins previously (and in the future) created with the `create` instruction and owned by the legacy token program will have `is_mayhem_mode` as **false** and cannot be changed.  
  This means you do not have to handle fee recipients differently for such coins, and existing trade instructions will work as they are.

---

### :two: Fee Recipient for Mayhem Mode Coins

Any new coin created with `create_v2` can have `is_mayhem_mode` as **true** or **false**.

- If it’s **false**, the trade accounts required do not change.  
- If it’s **true**, you need to **pass a different fee_recipient** for both buys and sells.

#### Fee recipient details:
- **Pump Swap:** 10th account → should be **Mayhem fee recipient**  
- **Bonding Curve:** 2nd account → should be **Mayhem fee recipient**

The **Protocol Fee Recipient Token Account** at **account index 11** of Pump Swap should be the **WSOL token account of Mayhem fee recipient**.

This new fee recipient for mayhem mode coins can be found from:
- The **Global** account on **Bonding Curve**, and the **GlobalConfig** account on **Pump Swap**,  
as the field: `reserved_fee_recipient`
- The `reserved_fee_recipient` is set to Pubkey::default currently in mainnet. It will be changed to **Mayhem fee recipient** before the feature is live.
---

## 3. Summary of Action Items

| Change | Action Required |
|---------|----------------|
| Introduction of `create_v2` | Update creation flow to use `create_v2` instruction with Token2022 program |
| Fee recipient handling for `is_mayhem_mode = true` coins | Pass **Mayhem fee recipient** as the fee recipient at specified account indexes (Pump Swap: 10, Bonding Curve: 2). Ensure protocol fee token account (index 11) is the WSOL account of Mayhem fee recipient for pump swap |

---

### ✅ Checklist

 
- [ ] Migrate to `create_v2` for new tokens
- [ ] For mints owned by token2022, ensure you're passing the right associated bonding curve, user token account and token program  
- [ ] Handle `is_mayhem_mode = true` by setting the correct fee recipient  
- [ ] Confirm fee recipient WSOL token account configuration  

---

> ⚙️ **Summary:**
> - `create_v2` introduces Token2022-based token creation and optional mayhem mode.  
> - Mayhem mode coins require a different fee recipient (**Mayhem fee recipient**) configured per program indices.


### Please use the devnet program of the bonding curve and pump swap to test coin creations with the new instruction and trading such coins. They're updated to what will go live on mainnet. 