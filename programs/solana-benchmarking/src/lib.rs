use anchor_lang::prelude::*;

declare_id!("3EPXr7MZTxfCWvKZoVCCcfJABwDjsFBaKMQQjtU2pRjb");

#[program]
pub mod solana_benchmarking {
    use super::*;

    pub fn store(ctx: Context<StoreCtx>, key:u32,  value: u32) -> Result<()> {
        let num: &mut Account<Number> = &mut ctx.accounts.number_account;
        num.value = value;
        num.key = key;
        emit!(NumberStored {
            key : key,
            value: value,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StoreCtx<'info> {
    
    #[account(init, payer = authority, space = 8 + 4 + 4)]
    pub number_account: Account<'info, Number>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: la'in haik
    #[account(address = anchor_lang::solana_program::system_program::ID)]
    pub system_program: AccountInfo<'info>
}

#[account]
#[derive(Default)]
pub struct Number {
    pub key: u32,
    pub value: u32,
}

#[event]
pub struct NumberStored {
    pub key: u32,
    pub value: u32,
}