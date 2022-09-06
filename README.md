# solana-benchmarking
10 mock txns on Solana's devnet, aiming to calculate time and fees required

## To reproduce:
0 - Make sure to follow instruction in this page to install solana and anchor CLIs: https://book.anchor-lang.com/getting_started/installation.html

1 - Run `yarn`.

2 - Run `anchor build`, this will add a new keypair to `target/deploy`.

3 - Run `anchor keys list`, this will give you the new program id.

4 - Copy the id to the top of `lib.rs`.

5 - Run `anchor test`.
