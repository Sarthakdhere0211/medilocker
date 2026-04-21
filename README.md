# MediLocker — Personal Health Record Vault


**MediLocker** is a production-ready decentralized application (dApp) built on the **Stellar Network**. It empowers users to securely store, manage, and share their medical records with a premium SaaS experience, leveraging blockchain for immutable anchoring and ownership verification.

---

## 🚀 Key Features

### 🔐 Real Wallet Integration
- **Freighter Wallet**: Secure connection and transaction signing using the official `@stellar/freighter-api`.
- **Testnet Ready**: Fully functional on the Stellar Testnet with real-time balance fetching.

### 🏗️ Hybrid Storage Architecture
- **On-Chain Anchoring**: Stores unique record references using Stellar's `manageData` operations (permanently tied to your public key).
- **Persistent Vault**: High-performance off-chain storage for record metadata and files, ensuring data survives sessions and refreshes.
- **64-Byte Optimized**: Intelligent data restructuring to comply with Stellar protocol limits while maintaining rich record metadata.

### 📂 Medical Document Management
- **Instant Preview**: View medical PDFs and images directly within the app using secure Blob gateways.
- **On-Chain Sharing**: Grant viewing permissions to other wallet addresses through real signed Stellar transactions.
- **Stellar Expert Integration**: Every action generates a real transaction hash with direct links to the blockchain explorer.

### 🎨 Premium UI/UX
- **SaaS Layout**: Professional sidebar/topbar navigation with a clean Inter/Poppins typography system.
- **Framer Motion**: Purposeful, high-fidelity animations for a "human-designed" feel.
- **Dark/Light Surface**: A refined palette using `brand-600` Indigo and `surface-50` Off-white.

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

<img width="1912" height="693" alt="Screenshot 2026-04-19 213938" src="https://github.com/user-attachments/assets/8f100580-441f-427d-a775-7e88163b702a" />

---

<img width="1896" height="862" alt="Screenshot 2026-04-19 214044" src="https://github.com/user-attachments/assets/242ce25d-b4c1-4d55-99ab-37b523f76460" />


---


## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS |
| **Blockchain** | Stellar SDK, Freighter API |
| **State** | Zustand (with Persistence) |
| **Icons** | Lucide React |
| **Notifications** | Sonner |

---

## 🚦 Getting Started

### Prerequisites
1. **Node.js**: Version 16.x or higher.
2. **Freighter Wallet**: Install the [Freighter Extension](https://www.freighter.app/) in your browser.
3. **Testnet XLM**: Fund your wallet via [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/medilocker.git
   cd medilocker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture Overview

MediLocker uses a **Reference-Based Blockchain Model**:
1. **Upload**: User uploads a file; the app generates a unique CID (hash) and a secure local URL.
2. **Anchor**: A Stellar `manageData` transaction is built containing only the `recordId`.
3. **Verify**: Freighter signs the transaction, and it is submitted to the **Stellar Testnet**.
4. **Retrieve**: Upon login, the app syncs with the blockchain to verify which record IDs are owned by the user before displaying them in the vault.

---

## 🛡️ Security & Privacy
- **User Ownership**: Your health data identity is your Stellar Public Key.
- **Minimal Exposure**: No sensitive medical data is ever stored directly on the blockchain.
- **Transparency**: Every record anchoring and sharing event is publicly verifiable on [Stellar Expert](https://stellar.expert).

---

## User Onboarding & Feedback Collection

We created a Google Form to onboard users and collect important details such as:

Name
Email
Wallet Address
Product Feedback (Rating + Comments)

The responses were automatically recorded using Google Sheets and later exported into an Excel file for analysi

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for the Stellar Ecosystem.
