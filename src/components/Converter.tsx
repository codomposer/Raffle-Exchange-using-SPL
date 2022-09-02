// @ts-nocheck
import { AnchorProvider, Idl, Program, BN } from "@project-serum/anchor";
import {
  Commitment,
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { ChangeEvent, useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "../target/idl/convertion.json";

const options: { preflightCommitment: Commitment } = {
  preflightCommitment: "processed",
};

const programId = new PublicKey(idl.metadata.address);

export const Converter = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [splAddress, setSplAddress] = useState(
    "3HeV96b8euHLxifCWp63YH6A4ZiVkrxjN8LcswCJkXzr"
  );
  const [splTransferAddress, setSplTransferAddress] = useState(
    "A9HRGoT112zx1jX1FNMFXLc6xr9inr9ZagwjyvpRa2rD"
  );
  const [raffleAddress, setRaffleAddress] = useState(
    "A9HRGoT112zx1jX1FNMFXLc6xr9inr9ZagwjyvpRa2rD"
  );
  const [raffleTickets, setRaffleTickets] = useState(
    "10"
  );

  const getProgram = () => {
    const provider = new AnchorProvider(connection, wallet as any, options);
    const program = new Program(idl as unknown as Idl, programId, provider);
    return program;
  };
  const program = getProgram();

  return (
    <div className="flex inset-0 flex-col items-center justify-center">
      <div className="my-5">
        <WalletMultiButton />
      </div>
      <div className="flex gap-3">
        <button>Init Raffle</button>
        <button>Buy Ticket SOL</button>
        <button>Buy Ticket SPL</button>
        <button>Create Counter</button>
        <button>Fetch Raffle</button>
        <button>Transfer Token</button>
      </div>
      <div className="flex flex-col mt-10 items-center">
        <h2>Raffle Transfer:</h2>
        <div className="flex gap-2 mt-4">
          <h3>SPL Token Address Transfer: </h3>
          <input value={splTransferAddress} onChange={e => setSplTransferAddress(e.target.value)}/>
        </div>
        <h2 className="mt-10">Raffle Input:</h2>
        <div className="flex gap-2 mt-[2px]">
          <h3>Raffle Address: </h3>
          <input value={splTransferAddress} onChange={e => setSplAddress(e.target.value)}/>
        </div>
        <div className="flex gap-2 mt-[2px]">
          <h3>SPL Token Address: </h3>
          <input value={splTransferAddress} onChange={e => setRaffleAddress(e.target.value)}/>
        </div>
        <div className="flex gap-2 mt-[2px]">
          <h3>Raffle Tickets: </h3>
          <input value={splTransferAddress} onChange={e => setRaffleTickets(e.target.value)}/>
        </div>
      </div>
    </div>
  );
};

export default Converter;
