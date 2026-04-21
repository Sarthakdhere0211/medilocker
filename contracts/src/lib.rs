#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Vec, Address};

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
    UserCount, // u32
    UserExists(Address), // bool
}

#[contract]
pub struct MediLocker;

#[contractimpl]
impl MediLocker {
    pub fn register_user(env: Env, user: Address) {
        user.require_auth();
        
        let exists_key = DataKey::UserExists(user.clone());
        let exists: bool = env.storage().persistent().get(&exists_key).unwrap_or(false);
        
        if !exists {
            env.storage().persistent().set(&exists_key, &true);
            
            let count_key = DataKey::UserCount;
            let mut count: u32 = env.storage().persistent().get(&count_key).unwrap_or(0);
            count += 1;
            env.storage().persistent().set(&count_key, &count);
        }
    }

    pub fn get_user_count(env: Env) -> u32 {
        let count_key = DataKey::UserCount;
        env.storage().persistent().get(&count_key).unwrap_or(0)
    }

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
