# Pump SDK

The SDK is structured as follows:
- `PumpAmmSdk` is the high level SDK, useful for UI integrations.
- `PumpAmmInternalSdk` is the low level SDK, useful for programmatic integrations, allowing full customization of instructions.
- `PumpAmmAdminSdk` is the SDK which allows access to admin-protected instructions.

## Create pool

To create a `(base, quote)` pool, you need to call:
`const createPoolInstructions = await pumpAmmSdk.createPoolInstructions(index, creator, baseMint, quoteMint, baseIn, quoteIn)`.

On UI, you can use `const initialPoolPrice = pumpAmmSdk.createAutocompleteInitialPoolPrice(initialBase, initialQuote)` to display
the initial pool price based on the initial `base` and `quote` inputs.

## Deposit

For depositing into a `(quote, base)` pool:
- when the `base` input changes, you need to call
  `const {quote, lpToken} = await pumpAmmSdk.depositAutocompleteQuoteAndLpTokenFromBase(pool, base, slippage)` in order to
  autocomplete the corresponding `quote` and `lpToken` values in the UI.
- when the `quote` input changes, you need to call
  `const {base, lpToken} = await pumpAmmSdk.depositAutocompleteBaseAndLpTokenFromQuote(pool, quote, slippage)` in order to
  autocomplete the corresponding `base` and `lpToken` values in the UI.

No matter which input is changed, when hitting deposit, you need to call
`const depositInstructions = await pumpAmmSdk.depositInstructions(pool, lpToken, slippage, user)`
to build the AMM deposit instruction, because `lpToken` is the only fixed input required by the `deposit` instruction.

## Swap

By default, the UI will display a `(quote, base)` pool like this:

Quote on first line, base on second line, with an ⬇️ from quote to base.
By default, you swap `quote` tokens for `base` tokens.

The arrow `swapDirection` can be either `quoteToBase` (⬇️, default)
or `baseToQuote` (⬆️).

```
(USDC, SOL) pool:
- USDC (quote)
- ⬇️
- SOL (base)
```

- If `quote` input changes, you call
  `const base = await pumpAmmSdk.swapAutocompleteBaseFromQuote(pool, quote, slippage, swapDirection)`.
- If `base` input changes, you call
  `const quote = await pumpAmmSdk.swapAutocompleteQuoteFromBase(pool, base, slippage, swapDirection)`.

No matter which input is changed, when hitting swap, you can call
`const swapInstructions = await pumpAmmSdk.swapBaseInstructions(pool, base, slippage, swapDirection, user)` or 
`const swapInstructions = await pumpAmmSdk.swapBaseInstructions(pool, quote, slippage, swapDirection, user)` to 
build the AMM swap instructions.

The `swapDirection` can be toggled in the UI either by making the arrow point upward or by swapping the base and quote
tokens positions.

```
(USDC, SOL) pool
- USDC (quote)
- ⬆️
- SOL (base)
```

## Withdraw

For withdrawing from a `(base, quote)` pool, you can use:
`const withdrawInstructions = await pumpAmmSdk.withdrawInstructions(pool, lpToken, slippage, user)`.

In the UI, you can use `const {base, quote} = pumpAmmSdk.withdrawAutocompleteBaseAndQuoteFromLpToken(pool, lpToken, slippage)`
to autocomplete the `base` and `quote` displayed amounts based on the `lpToken` input.
