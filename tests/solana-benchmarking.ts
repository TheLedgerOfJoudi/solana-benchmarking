import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaBenchmarking } from "../target/types/solana_benchmarking";
import { Connection } from '@solana/web3.js';

const timer = ms => new Promise(res => setTimeout(res, ms));

describe("solana-benchmarking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaBenchmarking as Program<SolanaBenchmarking>;

  const connection = new Connection("https://api.devnet.solana.com")

  let fees = 0

  const timeAtStart = Math.floor(Date.now() / 1000)

  let txns = []

  it('Stores 10 numbers with keys', async () => {

    for (let i = 0; i < 10; i++) {
      
      const numberAccountKeypair = anchor.web3.Keypair.generate()

      console.log("pubkey is " + numberAccountKeypair.publicKey)

      const tx = await program.rpc.store(i, i, {
        accounts: {
          authority: (program.provider as anchor.AnchorProvider).wallet.publicKey,
          numberAccount: numberAccountKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [numberAccountKeypair]
      });

      console.log("Your transaction signature", tx);

      txns.push(tx)

      const number = await program.account.number.fetch(numberAccountKeypair.publicKey);

      console.log(number);
    }

    const timeAtFinish = Math.floor(Date.now() / 1000)

    await timer(5000)

    let responses = 0

    for (let i = 0; i < 10; i++) {
      const response = await connection.getTransaction(txns[i]);
      if (response != null) {
        fees += response.meta.fee
        responses++
      }
    }



    console.log("The process took is done, it lasted for "
      + (timeAtFinish - timeAtStart).toString()
      + " seconds, and each txn costed "
      + fees / responses
      + " on average, measured in Lamports"
    )

  });


});
