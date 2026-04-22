# 🔐 MediLocker: Production-Ready Web3 Medical Records

![CI](https://github.com/Sarthakdhere0211/medilocker/actions/workflows/ci.yml/badge.svg)


MediLocker is a secure, trust-minimized medical record anchoring platform built for the **Stellar Network**. It empowers patients to maintain immutable proof of their medical history while keeping sensitive data off-chain.

---

## 🚀 CI/CD Pipeline

This project implements a complete CI/CD pipeline using GitHub Actions and Vercel.

- ✅ Continuous Integration: Automated builds and checks on every push using GitHub Actions  
- 🚀 Continuous Deployment: Automatic production deployment via Vercel  
- 🔄 Seamless pipeline ensuring code quality and fast delivery  

> Note: Deployment is handled by Vercel’s native Git integration, so a separate GitHub Actions deployment workflow is not required.

<img width="1456" height="343" alt="Screenshot 2026-04-22 192416" src="https://github.com/user-attachments/assets/18d6e408-f221-43af-9888-6838dbe434d6" />

---

## 🚀 Demo Day Features

- **Hybrid Secure Anchoring**: Combines Stellar `manageData` (for immutability) with Firebase Firestore (for sub-second metadata indexing).
- **SaaS-Style Analytics**: Real-time tracking of Total Users, DAU (Daily Active Users), and Network Transaction volume.
- **Medical Timeline**: An advanced chronological view of patient history with direct links to blockchain proofs.
- **Wallet-Native Auth**: Zero-password login using the Freighter Wallet extension.
- **Client-Side Security**: Files are processed entirely in the browser; no PII (Personally Identifiable Information) ever touches the server.

---

## 🌐 Live Demo

🚀 **Live Application**  
https://medilocker-fawn.vercel.app  

🔍 Features you can test:
- Wallet connection via Freighter  
- Upload medical records  
- Secure sharing between users  
- Blockchain transaction verification

---

## 🎥 Demo Video

⬇️ [Watch Demo Video](./public/demo.mp4)

---

## 🚀 Key Features

### 🔐 Real Wallet Integration
- **Freighter Wallet**: Secure connection and transaction signing using the official `@stellar/freighter-api`.
- **Testnet Ready**: Fully functional on the Stellar Testnet with real-time balance fetching.

### 🏗️ Hybrid Storage Architecture
- **On-Chain Anchoring**: Stores unique record references using Stellar's `manageData` operations (permanently tied to your public key).
- **Persistent Vault**: High-performance off-chain storage for record metadata and files, ensuring data survives sessions and refreshes.
- **64-Byte Optimized**: Intelligent data restructuring to comply with Stellar protocol limits while maintaining rich record metadata.

---
## 🏗️ Architecture

```
medilocker/
│
├── contracts/                     # Soroban smart contract (Rust)
│   ├── src/
│   │   └── lib.rs                 # Core MediLocker contract logic
│   └── Cargo.toml
│
├── src/                           # React + TypeScript + Vite
│   │
│   ├── pages/                     # Application pages
│   │   ├── LandingPage.tsx        # Landing / marketing page
│   │   └── Dashboard.tsx          # User vault & medical records
│   │
│   ├── components/                # UI components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── UploadModal.tsx
│   │   ├── PreviewModal.tsx
│   │   ├── ShareModal.tsx
│   │   └── WalletModal.tsx
│   │
│   ├── lib/                       # Core integrations
│   │   ├── stellar.ts             # Stellar SDK + contract interaction
│   │   └── firebase.ts            # Off-chain storage
│   │
│   ├── store/                     # Zustand global state
│   ├── assets/                    # Static assets
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── docs/                          # Documentation
│   ├── architecture.md
│   └── feedback.md
│
├── public/                        # Static public files
├── .env                           # Environment variables
└── README.md
```

---

## 🔗 Smart Contract

The MediLocker smart contract is built using Soroban (Rust) and manages secure storage, ownership, and sharing of medical record references on the Stellar blockchain.

### 📦 Data Structures

| Structure | Description |
|----------|------------|
| Record | Stores metadata of a medical record including ID, title, file hash, owner, and timestamp |
| DataKey::Records | Maps a user address to their list of records |
| DataKey::Shared | Stores access permissions for shared records |
| DataKey::UserCount | Tracks total registered users |
| DataKey::UserExists | Checks if a user is registered |

---

### ⚙️ Functions

| Function | Description |
|----------|-------------|
| register_user | Registers a new user and increments total user count |
| get_user_count | Returns total number of registered users |
| upload_record | Stores a new medical record reference on-chain |
| get_my_records | Retrieves all records owned by a user |
| share_record | Grants access of a record to another wallet |
| has_access | Checks if a user has access to a shared record |

---

### 🔐 Security Features

- **Authentication Required**  
  All sensitive operations require `require_auth()` to ensure only the owner can act.

- **Ownership Verification**  
  Records are tied to a specific wallet address.

- **Access Control**  
  Records can only be accessed if explicitly shared.

- **No Sensitive Data On-Chain**  
  Only file hashes (references) are stored, ensuring privacy.

---

### 🧠 Smart Contract Logic Flow

1. User registers using their wallet address  
2. User uploads a medical record → hash stored on-chain  
3. Records are linked to the owner’s address  
4. Owner can share access with another wallet  
5. Access is verified using `has_access`  

---

### 📡 Deployment Details

- Blockchain: Stellar Testnet  
- Contract Type: Soroban Smart Contract  
- Contract ID: CCNL4Y3WFX7YR6LICQOMPD3CL5KET63ZYMCVHDHE3FEB5RMEVNQD6B4Y  

🔍 Explorer:  
https://stellar.expert/explorer/testnet/contract/CCNL4Y3WFX7YR6LICQOMPD3CL5KET63ZYMCVHDHE3FEB5RMEVNQD6B4Y

### 📂 Medical Document Management
- **Instant Preview**: View medical PDFs and images directly within the app using secure Blob gateways.
- **On-Chain Sharing**: Grant viewing permissions to other wallet addresses through real signed Stellar transactions.
- **Stellar Expert Integration**: Every action generates a real transaction hash with direct links to the blockchain explorer.

### 🎨 Premium UI/UX
- **SaaS Layout**: Professional sidebar/topbar navigation with a clean Inter/Poppins typography system.
- **Framer Motion**: Purposeful, high-fidelity animations for a "human-designed" feel.
- **Dark/Light Surface**: A refined palette using `brand-600` Indigo and `surface-50` Off-white.

---

## 📈 Metrics Dashboard

The application includes a real-time analytics dashboard to monitor platform usage and activity.

### 🔍 Key Metrics Tracked
- Total Users (30+ active users)
- Total Records Stored
- Total Transactions
- Daily Active Users (DAU)

### ⚙️ Implementation
- Metrics are tracked using Firebase Firestore
- Real-time updates are fetched using `fetchAnalyticsData()`
- Data is visualized using Recharts

### 📸 Dashboard Preview

<img width="1916" height="862" alt="Screenshot 2026-04-22 221938" src="https://github.com/user-attachments/assets/c0446caf-8b80-44f3-b179-65528920bea4" />

---

## 📊 Monitoring & Logging

We implemented monitoring to track user activity and system events in real-time.

### 🔍 What is Monitored
- User wallet connection
- Dashboard load events
- Record upload actions
- Approval actions

### ⚙️ Implementation
- Browser Console Logs (`console.log`)
- Firebase Activity Logs (`activity_logs` collection)

### 📸 Monitoring Screenshot

<img width="1534" height="338" alt="image" src="https://github.com/user-attachments/assets/8fcf9bf0-cca1-4c8b-9ffc-80a7e2c07dd5" />

---

<img width="944" height="560" alt="image" src="https://github.com/user-attachments/assets/4431bfe9-ad7c-490c-b3c2-f299baa94899" />

---

🔗 Smart Contract Details
Blockchain: Stellar Testnet
Contract Type: Soroban Smart Contract
Contract ID: CCNL4Y3WFX7YR6LICQOMPD3CL5KET63ZYMCVHDHE3FEB5RMEVNQD6B4Y
🔍 Explorer

https://stellar.expert/explorer/testnet/contract/CCNL4Y3WFX7YR6LICQOMPD3CL5KET63ZYMCVHDHE3FEB5RMEVNQD6B4Y

<img width="1639" height="476" alt="Screenshot 2026-04-21 152941" src="https://github.com/user-attachments/assets/803e748a-fe84-4dda-952f-0f6e76585dcf" />

---

## 👛 Verified Users (Testnet)

| Name                  | Email                         | Wallet Address |
|-----------------------|-------------------------------|----------------|
| Anuj Patil            | anuj24darkside@gmail.com                             | GCCKKVQS54JRCSTB64AQEQTMNVQBJ7JDDTP7US7ESBXIAQPMNL3P23F5 |
| Aditya Shisodiya      | adityasisodiya56412@gmail.com | GAEJZTWGMZCDGYWOSOVEVT5XTP6WHAK2GLJLG57ZUCJRKHTD4BOVOBF3 |
| Yash Annadate         | yashannadate2005@gmail.com    | GB6B6QEJFY4HAKATRO6MI77WDZ66W4FFPJN6AYLISJEHTLXYFPHQFFTV |
| Aniket Uday Bhilare   | bhilareaniket2424@gmail.com   | GA25HZHRBYNMAX3VPS6PGWX3NULSKSNGWY4C32XCMDU45NQM2Y4PIZ3Z |
| Rohit                 | mahiidev0211@gmail.com        | GCPM2OH2DFE7IKZT2DF5HLLLIU464MQ4WPJ5BMDBJ5RFYTAQXRAAFGYB |
---

## Dapp Images
<img width="1914" height="859" alt="Screenshot 2026-04-19 213916" src="https://github.com/user-attachments/assets/44b194e2-d13c-407d-978a-7a1838475584" />

---

<img width="1896" height="865" alt="image" src="https://github.com/user-attachments/assets/805d381f-a743-4f0f-9692-ea01503033ed" />


---

<img width="1896" height="862" alt="Screenshot 2026-04-19 214044" src="https://github.com/user-attachments/assets/242ce25d-b4c1-4d55-99ab-37b523f76460" />


---

## 🏗️ Architecture & Data Flow

### 1. Upload & Anchor (Patient Flow)
1. **Selection**: User selects a PDF/Image and provides a title.
2. **Hashing**: App generates a unique cryptographic hash (CID) of the file.
3. **Stellar Anchoring**: A `manageData` transaction is sent to Stellar Testnet, mapping the `recordId` to the `fileHash`.
4. **Firebase Indexing**: Metadata (title, type, size) is indexed in Firebase for fast retrieval, mapped to the user's wallet address.


### 2. Retrieval & Verification
1. **Login**: User connects via Freighter.
2. **Sync**: App fetches indexed metadata from Firebase and cross-references it with the Stellar ledger.
3. **Integrity Check**: Only records with a matching on-chain anchor are displayed as "Verified".

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Blockchain**: Stellar SDK, Freighter API
- **Backend/Analytics**: Firebase (Firestore, Analytics)
- **Charts**: Recharts
- **Icons/UI**: Lucide React, Framer Motion

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v18+
- **Freighter Wallet**: [Install Extension](https://www.freighter.app/)
- **Firebase Project**: [Create here](https://console.firebase.google.com/)

### Setup
1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-repo/medilocker.git
   cd medilocker
   npm install
   ```
2. **Environment Variables**: Create a `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   ```
3. **Run**:
   ```bash
   npm run dev
   ```

## ⚠️ Limitations
- **Storage**: Currently uses persistent data URLs for demo purposes. In a full production environment, this would be replaced with encrypted IPFS (Web3.storage) or Filecoin.
- **Fees**: Users need Testnet XLM to anchor records (available via Friendbot).

## 📄 License
MIT License. See [SECURITY.md](./SECURITY.md) for data handling policies.
