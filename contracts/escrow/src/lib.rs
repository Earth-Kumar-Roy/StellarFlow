#![no_std]

mod storage;
mod types;

#[cfg(test)]
mod test;

use crate::storage::{extend_contract_ttl, DataKey};
use crate::types::{Escrow, EscrowError, EscrowStatus, Milestone};
use soroban_sdk::{
    contract, contractimpl, token::Client as TokenClient, Address, Env, Vec,
};

#[contract]
pub struct StellarFlowEscrow;

#[contractimpl]
impl StellarFlowEscrow {
    /// Initializes a new escrow contract, locking client tokens inside the contract.
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        total_amount: i128,
        deadline: u64,
        milestones: Vec<Milestone>,
    ) -> Result<(), EscrowError> {
        // Enforce client authorization
        client.require_auth();

        if total_amount <= 0 {
            return Err(EscrowError::InvalidAmount);
        }

        if deadline <= env.ledger().timestamp() {
            return Err(EscrowError::ContractExpired);
        }

        // Verify milestone sums match total amount
        let mut sum: i128 = 0;
        for i in 0..milestones.len() {
            if let Some(m) = milestones.get(i) {
                if m.amount <= 0 {
                    return Err(EscrowError::InvalidAmount);
                }
                sum = sum.checked_add(m.amount).ok_or(EscrowError::InvalidAmount)?;
            }
        }

        if sum != total_amount {
            return Err(EscrowError::MilestoneSumMismatch);
        }

        // Transfer tokens from client into this contract address
        let contract_address = env.current_contract_address();
        let token_client = TokenClient::new(&env, &token);
        token_client.transfer(&client, &contract_address, &total_amount);

        let escrow = Escrow {
            client,
            freelancer,
            token,
            total_amount,
            released_amount: 0,
            deadline,
            status: EscrowStatus::Active,
            milestones,
        };

        // Overwrite or create new escrow instance without single-initialization restriction
        env.storage().instance().set(&DataKey::Escrow, &escrow);
        extend_contract_ttl(&env);

        Ok(())
    }

    /// Client approves a milestone, releasing designated tokens to the freelancer.
    pub fn approve_milestone(env: Env, milestone_id: u32) -> Result<(), EscrowError> {
        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&DataKey::Escrow)
            .ok_or(EscrowError::NotInitialized)?;

        // Only client can approve milestones
        escrow.client.require_auth();

        if escrow.status != EscrowStatus::Active {
            return Err(EscrowError::EscrowCompleted);
        }

        let mut milestone_found = false;
        let mut amount_to_release: i128 = 0;
        let mut updated_milestones = Vec::new(&env);

        for i in 0..escrow.milestones.len() {
            if let Some(mut m) = escrow.milestones.get(i) {
                if m.id == milestone_id {
                    milestone_found = true;
                    if m.is_completed {
                        return Err(EscrowError::MilestoneAlreadyCompleted);
                    }
                    m.is_completed = true;
                    amount_to_release = m.amount;
                }
                updated_milestones.push_back(m);
            }
        }

        if !milestone_found {
            return Err(EscrowError::MilestoneNotFound);
        }

        // Execute token transfer to freelancer
        let token_client = TokenClient::new(&env, &escrow.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.freelancer,
            &amount_to_release,
        );

        escrow.released_amount += amount_to_release;
        escrow.milestones = updated_milestones;

        // Check if all milestones are complete
        if escrow.released_amount >= escrow.total_amount {
            escrow.status = EscrowStatus::Completed;
        }

        // Save updated escrow state to storage
        env.storage().instance().set(&DataKey::Escrow, &escrow);
        extend_contract_ttl(&env);

        Ok(())
    }

    /// Refunds remaining locked tokens back to client if deadline has passed.
    pub fn refund_expired(env: Env) -> Result<(), EscrowError> {
        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&DataKey::Escrow)
            .ok_or(EscrowError::NotInitialized)?;

        escrow.client.require_auth();

        if escrow.status != EscrowStatus::Active {
            return Err(EscrowError::EscrowCompleted);
        }

        if env.ledger().timestamp() < escrow.deadline {
            return Err(EscrowError::DeadlineNotPassed);
        }

        let remaining_balance = escrow.total_amount - escrow.released_amount;
        if remaining_balance > 0 {
            let token_client = TokenClient::new(&env, &escrow.token);
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.client,
                &remaining_balance,
            );
        }

        escrow.status = EscrowStatus::Refunded;
        // Save refunded state to storage
        env.storage().instance().set(&DataKey::Escrow, &escrow);
        extend_contract_ttl(&env);

        Ok(())
    }

    /// View helper to fetch current contract state.
    pub fn get_escrow(env: Env) -> Result<Escrow, EscrowError> {
        extend_contract_ttl(&env);
        env.storage()
            .instance()
            .get(&DataKey::Escrow)
            .ok_or(EscrowError::NotInitialized)
    }

    /// Explicitly extend state TTL.
    pub fn bump_ttl(env: Env) {
        extend_contract_ttl(&env);
    }
}