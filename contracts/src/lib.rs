#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Vec, Address, symbol_short};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Record {
    pub id: String,
    pub title: String,
    pub file_hash: String,
    pub owner: Address,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Records(Address), // Vec<Record>
    Shared(String, Address), // bool
}

#[contract]
pub struct MediLocker;

#[contractimpl]
impl MediLocker {
    pub fn upload_record(env: Env, owner: Address, id: String, title: String, file_hash: String) {
        owner.require_auth();
        
        let key = DataKey::Records(owner.clone());
        let mut records: Vec<Record> = env.storage().persistent().get(&key).unwrap_or(Vec::new(&env));
        
        let record = Record {
            id: id.clone(),
            title,
            file_hash,
            owner: owner.clone(),
            timestamp: env.ledger().timestamp(),
        };
        
        records.push_back(record);
        env.storage().persistent().set(&key, &records);
    }

    pub fn get_my_records(env: Env, owner: Address) -> Vec<Record> {
        owner.require_auth();
        let key = DataKey::Records(owner);
        env.storage().persistent().get(&key).unwrap_or(Vec::new(&env))
    }

    pub fn share_record(env: Env, owner: Address, record_id: String, with: Address) {
        owner.require_auth();
        
        // Verify owner owns the record (optional but good)
        let key = DataKey::Records(owner.clone());
        let records: Vec<Record> = env.storage().persistent().get(&key).unwrap_or(Vec::new(&env));
        let mut found = false;
        for r in records.iter() {
            if r.id == record_id {
                found = true;
                break;
            }
        }
        if !found {
            panic!("Record not found");
        }

        let share_key = DataKey::Shared(record_id, with);
        env.storage().persistent().set(&share_key, &true);
    }

    pub fn has_access(env: Env, record_id: String, viewer: Address) -> bool {
        let share_key = DataKey::Shared(record_id, viewer);
        env.storage().persistent().get(&share_key).unwrap_or(false)
    }
}
