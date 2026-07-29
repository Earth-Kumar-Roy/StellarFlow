use soroban_sdk::{contracttype, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Escrow,
}

// 1 Ledger ~ 5 seconds -> ~17,280 ledgers per day
pub const DAY_IN_LEDGERS: u32 = 17_280;
pub const LIFETIME_THRESHOLD: u32 = 7 * DAY_IN_LEDGERS; // 7 days
pub const BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;        // Extend to 30 days

pub fn extend_contract_ttl(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
}