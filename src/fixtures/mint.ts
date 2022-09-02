// @ts-nocheck
import { Program } from "@project-serum/anchor";
import { Convertion } from "../target/types/convertion";
import { toPublicKey } from "./lib";
import { TokenAccount } from "./token-account";

import {
  createMint,
  mintTo,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  Transaction,
  SystemProgram,
  PublicKey,
  Keypair
} from "@solana/web3.js";

class Mint {
  constructor(
    public key: PublicKey,
    public authority: Keypair | WalletContextState,
    public program: Program<Convertion>,
    public decimals: number
  ) { }

  static async create(
    program: Program<Convertion>,
    authority: Keypair | WalletContextState = Keypair.generate(),
    freezeAuthority: PublicKey | null = null,
    decimals: number = 0,
  ): Promise<Mint> {
    // await spawnMoney(program, authority.publicKey, 1);
    let mint: Keypair | PublicKey = Keypair.generate();

    if ("secretKey" in authority) {
      mint = await createMint(
        program.provider.connection,
        authority as Keypair,
        authority.publicKey,
        freezeAuthority,
        decimals,
      );
      return new Mint(mint, authority, program, decimals);
    } else {
      let tx = new Transaction().add(
        // create mint account
        SystemProgram.createAccount({
          fromPubkey: authority.publicKey,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports: await getMinimumBalanceForRentExemptMint(program.provider.connection),
          programId: TOKEN_PROGRAM_ID,
        }),
        // init mint account
        createInitializeMintInstruction(
          mint.publicKey, // mint pubkey
          decimals, // decimals
          authority.publicKey, // mint authority
          authority.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        )
      );

      const txSignature = await (authority as WalletContextState).sendTransaction(tx, program.provider.connection, { signers: [mint] });
      await program.provider.connection.confirmTransaction(txSignature, "confirmed");
      return new Mint(mint.publicKey, authority, program, decimals);
    }
  }

  async mintTokens<T extends PublicKey | Keypair>(
    to: TokenAccount<T>,
    amount: number
  ) {
    if ("secretKey" in this.authority) {
      await mintTo(
        this.program.provider.connection,
        this.authority as Keypair,
        this.key,
        to.key,
        this.authority.publicKey,
        amount,
      );
    } else {
      let tx = new Transaction().add(
        createMintToCheckedInstruction(
          this.key,
          to.key,
          this.authority.publicKey,
          amount,
          this.decimals
        )
      );

      const txSignature = await (this.authority as WalletContextState).sendTransaction(tx, this.program.provider.connection);
      await this.program.provider.connection.confirmTransaction(txSignature, "confirmed");
    }
  }

  async getAssociatedTokenAddress<
    T extends PublicKey | Keypair
  >(owner: T): Promise<PublicKey> {
    return await getAssociatedTokenAddress(
      this.key,
      toPublicKey(owner),
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  }

  async createAssociatedAccount<
    T extends PublicKey | Keypair
  >(owner: T): Promise<TokenAccount<T>> {
    let tokenAccount;
    if ("secretKey" in this.authority) {
      tokenAccount = await createAssociatedTokenAccount(
        this.program.provider.connection,
        this.authority as Keypair,
        this.key,
        toPublicKey(owner),
      );
    } else {
      tokenAccount = await getAssociatedTokenAddress(
        this.key,
        toPublicKey(owner)
      );
      let tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          this.authority.publicKey,
          tokenAccount,
          toPublicKey(owner),
          this.key,
        )
      );
      console.log(tx)
      const txSignature = await (this.authority as WalletContextState).sendTransaction(tx, this.program.provider.connection);
      await this.program.provider.connection.confirmTransaction(txSignature, "confirmed");
    }
    return new TokenAccount(this.program, tokenAccount, this, owner);
  }
}

export { Mint };