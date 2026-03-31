# MediLocker - Personal Health Record Vault

MediLocker is a decentralized web application (dApp) built on the Stellar network using Soroban smart contracts. It provides a secure, private, and user-owned vault for medical records.

## 🚀 Key Features

- **Wallet-Based Authentication**: Uses Freighter wallet for secure, passwordless login.
- **On-Chain Metadata**: Stores record metadata and access permissions on the Stellar blockchain.
- **Decentralized Access Control**: Grant and revoke access to your records for specific wallet addresses.
- **Modern UI/UX**: Clean, responsive interface with smooth animations (Framer Motion).
- **Security First**: Your medical history is owned by you, not a central authority.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Blockchain**: Stellar Soroban (Rust), Stellar SDK, Freighter API
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Toasts**: Sonner

## 🏗️ System Architecture

### On-Chain (Soroban Smart Contract)
The `MediLocker` contract handles:
- `upload_record`: Stores record metadata (ID, Title, File Hash, Owner).
- `share_record`: Manages the access control list (ACL) for each record.
- `has_access`: Verifies if a viewer is authorized to see a record.

### Off-Chain
Medical files (PDFs/Images) are intended to be stored on IPFS or encrypted cloud storage. The blockchain stores the cryptographic hash of these files to ensure data integrity and ownership.

## 📂 Project Structure

- `/contracts`: Soroban smart contract (Rust).
- `/src/components`: Reusable UI components (Navbar, Modals, etc.).
- `/src/pages`: Main application views (Landing, Dashboard).
- `/src/store`: Global state management using Zustand.
- `/src/lib`: Blockchain integration logic.

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔒 Security & Privacy

MediLocker follows decentralized design principles:
- **Minimal Data Exposure**: Only necessary metadata is stored on-chain.
- **User Control**: Only the record owner can grant access to others.
- **Tamper-Proof**: Blockchain records ensure your medical history cannot be altered without authorization.

---

Built with ❤️ for the Stellar Soroban Ecosystem.
