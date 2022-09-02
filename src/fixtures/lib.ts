// @ts-nocheck
import { Program } from "@project-serum/anchor";
import { Convertion } from "../target/types/convertion";
import { Keypair, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
// import { Mint } from "./mint";
// import { WalletContextState } from '@solana/wallet-adapter-react';

const VAULT_YAKU_SEED = "vault_yaku";

export function toPublicKey<T extends PublicKey | Keypair>(val: T): PublicKey {
  if ("publicKey" in val) {
    return val.publicKey;
  } else {
    return val;
  }
}

export async function getPoolAddress(
  source: PublicKey,
  //@ts-ignore
  program: Program<Convertion>,
): Promise<[PublicKey, number]> {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(VAULT_YAKU_SEED),
      source.toBuffer()
    ],
    program.programId
  );
}


export async function getTokenAmounts(
  program: Program<Convertion>,
  owner: PublicKey,
  tokenAccount: PublicKey
): Promise<number> {
  const { value: accounts } =
    await program.provider.connection.getParsedTokenAccountsByOwner(owner, {
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    });

  const checkedAccounts = accounts.filter(
    (t) => t.pubkey.toString() === tokenAccount.toString()
  );

  if (checkedAccounts.length > 0) {
    // console.log(checkedAccounts[0].account.data.parsed.info.tokenAmount);
    return checkedAccounts[0].account.data.parsed.info.tokenAmount.amount as number;
  }

  return 0;
}

export async function checkTokenAccounts(
  program: Program<Convertion>,
  owner: PublicKey,
  tokenAccount: PublicKey
): Promise<boolean> {
  const { value: accounts } =
    await program.provider.connection.getParsedTokenAccountsByOwner(owner, {
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    });

  const checkedAccounts = accounts.filter(
    (t) => t.pubkey.toString() === tokenAccount.toString()
  );

  return checkedAccounts.length > 0;
}
