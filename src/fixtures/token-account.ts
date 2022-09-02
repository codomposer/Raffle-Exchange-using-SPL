// @ts-nocheck
import * as anchor from "@project-serum/anchor";
import { Mint } from "./mint";
import { Convertion } from "../target/types/convertion";

export class TokenAccount<
  T extends anchor.web3.PublicKey | anchor.web3.Keypair
  > {
  constructor(
    public program: anchor.Program<Convertion>,
    public key: anchor.web3.PublicKey,
    public mint: Mint,
    public owner: T
  ) { }
}
