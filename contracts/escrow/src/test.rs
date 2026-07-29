#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{AdminClient as TokenAdminClient, Client as TokenClient},
    Address, Env, String, Vec,
};

fn create_token_contract<'a>(e: &'a Env, admin: &'a Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let contract_id = e.register_stellar_asset_contract_v2(admin.clone()).address();
    (
        TokenClient::new(e, &contract_id),
        TokenAdminClient::new(e, &contract_id),
    )
}

#[test]
fn test_escrow_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token, token_admin_client) = create_token_contract(&env, &token_admin);
    token_admin_client.mint(&client, &1000);

    let contract_id = env.register(StellarFlowEscrow, ());
    let escrow_client = StellarFlowEscrowClient::new(&env, &contract_id);

    let mut milestones = Vec::new(&env);
    milestones.push_back(Milestone {
        id: 1,
        description: String::from_str(&env, "Design Wireframes"),
        amount: 400,
        is_completed: false,
    });
    milestones.push_back(Milestone {
        id: 2,
        description: String::from_str(&env, "Build Smart Contract"),
        amount: 600,
        is_completed: false,
    });

    let deadline = env.ledger().timestamp() + 86400; // +1 day

    // 1. Create Escrow
    escrow_client.create_escrow(
        &client,
        &freelancer,
        &token.address,
        &1000,
        &deadline,
        &milestones,
    );

    assert_eq!(token.balance(&client), 0);
    assert_eq!(token.balance(&contract_id), 1000);

    // 2. Approve Milestone 1
    escrow_client.approve_milestone(&1);
    assert_eq!(token.balance(&freelancer), 400);
    assert_eq!(token.balance(&contract_id), 600);

    // 3. Approve Milestone 2
    escrow_client.approve_milestone(&2);
    assert_eq!(token.balance(&freelancer), 1000);
    assert_eq!(token.balance(&contract_id), 0);

    let state = escrow_client.get_escrow();
    assert_eq!(state.status, EscrowStatus::Completed);
}