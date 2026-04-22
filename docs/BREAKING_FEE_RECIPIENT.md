# Program Upgrade

Hi. We will be doing a breaking program upgrade on April 28th, 16:00 UTC, to both the pump bonding curve program and the pump swap amm program. In order to make sure your integrations do not break please see the instructions below:

## These are 8 new fee recipients ( common for both programs )

```text
5YxQFdt3Tr9zJLvkFccqXVUwhdTWJQc1fFg2YPbxvxeD
9M4giFFMxmFGXtc3feFzRai56WbBqehoSeRE5GK7gf7
GXPFM2caqTtQYC2cJ5yJRi9VDkpsYZXzYdwYpGnLmtDL
3BpXnfJaUTiwXnJNe7Ej1rcbzqTTQUvLShZaWazebsVR
5cjcW9wExnJJiqgLjq7DEG75Pm6JBgE1hNv4B2vHXUW6
EHAAiTxcdDwQ3U4bU6YcMsQGaekdzLS3B5SmYo46kJtL
5eHhjP8JaYkz83CWwvGU2uMUXefd3AazWGx4gpcuEEYD
A7hAgCzFw14fejgCp387JUJRMNyz4j89JKnhtKU8piqW
```

## As part of this change,

- Bonding curve: A new account is required to be added in buys and sells
- AMM: 2 new accounts required to be added in buys and sells

All accounts till bonding-curve-v2 and pool-v2 remain the same, no change needed

## Bonding Curve

- Add any one of the 8 new fee recipients at the end of the buy and sell instructions.
- This new account should be added AFTER the bonding-curve-v2 account for both buys and sells.
- Account needs to be mutable
- Buy instructions should have 18 accounts in total
- Sell instruction should have 16 accounts for non cashback coins
- Sell instruction should have 17 accounts for cashback coins

## Pump swap ( AMM )

- Add 2 new accounts in this order at the end:
  - One of the 8 fee recipients. ( Second last account, readonly)
  - Quote mint ATA for fee recipient. ( Last account, mutable )

- These 2 new accounts should be added AFTER the pool-v2 account for both buys and sells for coins that graduate from bonding curve.
- Even if the coin is not a bonding curve coin, the 2 new accounts are necessary to be added.
- Buy instructions should have 26 accounts for non cashback coins.
- Buy instructions should have 27 accounts non cashback coins
- Sell instructions should have 24 accounts for non cashback coins.
- Sell instructions should have 26 accounts for cashback coins.

## Both SDKs are updated to reflect the upcoming change.

- `@pump-fun/pump-sdk@1.33.0`: https://www.npmjs.com/package/@pump-fun/pump-sdk
- `@pump-fun/pump-swap-sdk@1.15.0`: https://www.npmjs.com/package/@pump-fun/pump-swap-sdk

## Devnet

The new accounts can be passed before the program upgrade happens on Monday. The devnet programs are updated with the upcoming change, here are a few example transactions:

### Bonding curve

- https://solscan.io/tx/3iRpvjc41MJYH1g6T1xSjphCqi3PoqZGAZrFxveKxx8hZQDyJyWy8C9FQLbtRt97h9m51tDrLVCAedrVxgVgEPWg?cluster=devnet
- https://solscan.io/tx/59myh9VnJSwpDn7j5c8FuU1Nx3JN7wXs8WyX9CXABJoDPDYyCDeQvW96ugFzUWQiHG1K6TKAUNNcV2EZXUwtQizM?cluster=devnet
- https://solscan.io/tx/4iBEotkjLdNAsGxmLjM7E1cwLB8eTEH4BeUZHkthpHBF6ei69vef9vg4FK8jGKnwJUK8FT3DHqRtYn4Rijc6n3sn?cluster=devnet

### Amm

- https://solscan.io/tx/235fuAQcDZXL8CMRuGf7iqMYpkHX95cAXW8Kqh5yVDEPs7zN7K8yRkuji1j6vkAg4ybBQbvQ4HKGaLexR3p9xWm7?cluster=devnet
- https://solscan.io/tx/jqZAviLnwV7cyBtNzz7DTPB3xSyj2ZTkSAWtUKWKrjXeAkTKM16zsH3J2FbZQtXY4mCsVntVe1C6qnnNVYNDAfP?cluster=devnet
- https://solscan.io/tx/2MJZMr86BdoNKDRpzAZSyQ8k782ZcNo1gaqse5raFzeWKERkdnr7B9iknSKJRSWGiUzXnsRT5m9CZpouvjbZnhrA?cluster=devnet
- https://solscan.io/tx/2FDkzZ4WzKN3FMLuffz61JLMGpJ1Q9oGydyJp14xttgYaMZM5rZQiXnBkaSGTadCaP7EhjQw2peLGWskk8YaRS5s?cluster=devnet
