# Security Policy: MediLocker

## Overview
MediLocker implements a "Trust-Minimized" security architecture, ensuring that sensitive medical data is never stored on a public ledger while maintaining cryptographic proof of existence and ownership.

## 1. Data Separation (On-Chain vs Off-Chain)
MediLocker follows the principle of **PII-less Blockchain Usage**:
- **On-Chain (Stellar)**: Only non-identifiable `recordId` and `fileHash` (CID) are stored. No medical data, names, or personal details ever touch the blockchain.
- **Off-Chain (Indexing Layer)**: Metadata (Title, File Type, Size) is stored in Firebase, indexed by the user's `wallet_address`.
- **Off-Chain (Storage)**: Actual files are currently handled as persistent data URLs/Local Storage (simulating IPFS/S3) and are encrypted client-side where possible.

## 2. Access Control
Access is strictly enforced via **Wallet-Based Authentication**:
- Users must sign transactions using the **Freighter Wallet**.
- All data retrieval requests are scoped to the `publicKey` returned by the wallet extension.
- **Verification Logic**: Every record displayed in the dashboard is verified against the Stellar ledger to ensure the current user is the rightful owner or an authorized recipient.

## 3. File Validation Rules
To prevent malicious uploads and ensure platform stability:
- **Type Restriction**: Only `.pdf`, `.jpg`, `.png`, and `.webp` files are permitted.
- **Size Limits**: Maximum file size is capped at 10MB to prevent browser memory issues.
- **Hash Integrity**: Every file is hashed client-side before upload. This hash is anchored to the blockchain, allowing for future integrity checks.

## 4. Threat Model & Mitigations
| Threat | Mitigation |
| :--- | :--- |
| **Identity Theft** | MediLocker uses private-key-based signatures (Freighter). No passwords to steal. |
| **Data Tampering** | Blockchain anchoring provides an immutable proof of the original file hash. |
| **Unauthorized Access** | Firebase security rules restrict data access to the document owner's wallet address. |
| **Metadata Leakage** | All indexing metadata is scoped to the user's public key; no global public search is available. |

## 5. Security Best Practices
- **Client-Side Processing**: Files are processed in-memory. No raw data is sent to a central server for processing.
- **Secure Transports**: All communication with Firebase and Stellar Horizon is over HTTPS.
- **Sanitization**: All user-provided metadata (titles, descriptions) is sanitized before being rendered in the UI to prevent XSS.

---
For security vulnerabilities, please contact: security@medilocker.io
