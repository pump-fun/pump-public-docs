import {
  Connection,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import fs from "fs";
import { createTokenMetadata } from "./utils/create-token-metadata";
import {
  PumpSdk,
  OnlinePumpSdk,
  getBuyTokenAmountFromSolAmount,
} from "@pump-fun/pump-sdk";
import BN from "bn.js";

const RPC_URL = "";

const TOKEN_NAME = "TEST";
const TOKEN_SYMBOL = "TEST";
const TOKEN_DESCRIPTION = "My awesome token";
const TOKEN_IMAGE_PATH = "./image.png";
const TOKEN_TWITTER = "https://twitter.com/mytoken";
const TOKEN_TELEGRAM = "https://t.me/mytoken";
const TOKEN_WEBSITE = "https://mytoken.com";

const creator = Keypair.generate();
const CONNECTION = new Connection(RPC_URL, "confirmed");
const pumpSdk = new PumpSdk();
const onlinePumpSdk = new OnlinePumpSdk(CONNECTION);

export const createToken = async () => {
  const mint = new Keypair();
  console.log("🔑 Mint keypair generated:", mint.publicKey.toBase58());

  // Upload metadata to IPFS via pump.fun
  console.log("📤 Uploading token metadata...");
  const imageData = fs.readFileSync(TOKEN_IMAGE_PATH);
  const metadata = await createTokenMetadata({
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    description: TOKEN_DESCRIPTION,
    file: new Blob([new Uint8Array(imageData)]),
    twitter: TOKEN_TWITTER,
    telegram: TOKEN_TELEGRAM,
    website: TOKEN_WEBSITE,
  });
  const metadataUri = (metadata as any).metadataUri ?? (metadata as any).uri;
  console.log("✅ Metadata URI:", metadataUri);

  const global = await onlinePumpSdk.fetchGlobal();
  const solAmount = new BN(0.1 * 10 ** 9); // 0.1 SOL

  const createIx = await pumpSdk.createV2AndBuyInstructions({
    global,
    mint: mint.publicKey,
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    uri: metadataUri,
    creator: creator.publicKey,
    user: creator.publicKey,
    amount: getBuyTokenAmountFromSolAmount({
      global,
      feeConfig: null,
      mintSupply: null,
      bondingCurve: null,
      amount: solAmount,
    }),
    solAmount,
    mayhemMode: false,
    cashback: false,
  });

  const { blockhash } = await CONNECTION.getLatestBlockhash();

  const tx = new VersionedTransaction(
    new TransactionMessage({
      instructions: [...createIx],
      recentBlockhash: blockhash,
      payerKey: creator.publicKey,
    }).compileToV0Message(),
  );

  tx.sign([creator, mint]);

  console.log("🚀 Sending transaction...");
  await CONNECTION.sendRawTransaction(tx.serialize());

  console.log("✅ Token created successfully!");
};

createToken();

// Example: https://solscan.io/tx/4L1LapFUMwxNAcHbQ9Y9i6a7LZCXL23gZbDk6HCcirBLYVpVfPfzixdgEDcjtycH1rvs9DVreskRDMtXA5nPK3JT
