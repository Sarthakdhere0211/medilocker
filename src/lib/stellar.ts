import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, signTransaction } from '@stellar/freighter-api';

/**
 * Robustly handle extension communication errors
 */
const handleExtensionError = (err: any) => {
  const msg = err.message || '';
  if (msg.includes('context invalidated') || msg.includes('Unable to send message')) {
    return new Error('Wallet connection lost. Please refresh the page and try again.');
  }
  return err;
};

// const CONTRACT_ID = 'CCF2A7X6M7Y6M7Y6M7Y6M7Y6M7Y6M7Y6M7Y6M7Y6M7Y6M7Y6'; // Placeholder
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

// Highly resilient way to get the correct classes from the SDK
const getStellarClass = (path: string) => {
  const parts = path.split('.');
  let current: any = StellarSdk;
  for (const part of parts) {
    current = current?.[part] || (StellarSdk as any).default?.[part];
    if (!current) break;
  }
  return current || (StellarSdk as any)[parts[parts.length - 1]];
};

const HorizonServer = getStellarClass('Horizon.Server');
const TransactionBuilderClass = getStellarClass('TransactionBuilder');
const OperationNamespace = getStellarClass('Operation');
const AssetClass = getStellarClass('Asset');
const NetworksNamespace = getStellarClass('Networks');
const BASE_FEE_VALUE = "1000"; // Increased fee for faster inclusion (0.0001 XLM)

// For Soroban interactions
// const ContractClass = getStellarClass('Contract');
// const AddressClass = getStellarClass('Address');
// const xdrNamespace = getStellarClass('xdr');

const horizonServer = HorizonServer ? new HorizonServer(HORIZON_URL) : null;

/**
 * Validates a Stellar address.
 */
function isValidStellarAddress(address: string): boolean {
  return typeof address === 'string' && address.startsWith('G') && address.length === 56;
}

/**
 * Funds an account on Testnet using Friendbot.
 */
export async function fundAccount(publicKey: string): Promise<boolean> {
  try {
    console.log(`[Stellar] Requesting funds from Friendbot for ${publicKey}...`);
    const response = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
    if (response.ok) {
      console.log('[Stellar] Account successfully funded by Friendbot.');
      return true;
    }
    return false;
  } catch (err) {
    console.error('[Stellar] Friendbot funding error:', err);
    return false;
  }
}

/**
 * Signs and submits a transaction to store record reference (ID) on-chain.
 */
export async function uploadRecordOnChain(
  publicKey: string,
  recordId: string
): Promise<{ hash: string }> {
  try {
    if (!horizonServer || !TransactionBuilderClass || !OperationNamespace || !AssetClass || !NetworksNamespace) {
        throw new Error('Stellar SDK components not properly initialized');
    }

    if (!isValidStellarAddress(publicKey)) {
        throw new Error('Invalid source wallet address');
    }

    console.log('[Stellar] Building transaction with manageData for record ID storage...');
    
    let account;
    try {
      account = await (horizonServer as any).loadAccount(publicKey);
    } catch (err: any) {
      // If account not found (404), it's a new account on Testnet
      if (err.response?.status === 404) {
        console.log('[Stellar] Account not found on Testnet. Attempting to fund via Friendbot...');
        const funded = await fundAccount(publicKey);
        if (funded) {
          // Wait a bit for Horizon to index the new account
          await new Promise(resolve => setTimeout(resolve, 2000));
          account = await (horizonServer as any).loadAccount(publicKey);
        } else {
          throw new Error('Your wallet is not activated on Testnet. Please fund it at https://laboratory.stellar.org/#account-creator');
        }
      } else {
        throw err;
      }
    }
    
    // Store only the record ID (short string) to stay within 64-byte limit
    const value = recordId;

    const transaction = new (TransactionBuilderClass as any)(account, {
      fee: BASE_FEE_VALUE,
      networkPassphrase: (NetworksNamespace as any).TESTNET,
    })
      .addOperation(
        (OperationNamespace as any).manageData({
          name: `medilocker:${recordId}`,
          value: value,
        })
      )
      .setTimeout(180) // Increased timeout to 3 minutes
      .build();

    console.log('[Stellar] Transaction Operations: 1 (manageData)');
    console.log('[Stellar] Transaction XDR:', transaction.toXDR());
    console.log('[Stellar] Requesting signature from Freighter...');
    const xdr = transaction.toXDR();
    
    if (!signTransaction) {
      throw new Error('Freighter signTransaction method not found. Please ensure Freighter is installed.');
    }

    // Verify connection status before signing
    const connection = await isConnected();
    if (!connection.isConnected) {
      throw new Error('Wallet is disconnected or locked. Please unlock Freighter.');
    }

    let signedXDR;
    try {
      const result = await signTransaction(xdr, { 
        networkPassphrase: (NetworksNamespace as any).TESTNET 
      });
      if (result.error) throw new Error(result.error);
      signedXDR = result.signedTxXdr;
    } catch (e: any) {
      throw handleExtensionError(e);
    }

    console.log('[Stellar] Submitting transaction to Horizon...');
    const signedTx = new (TransactionBuilderClass as any).fromXDR(signedXDR, (NetworksNamespace as any).TESTNET);
    
    let result;
    try {
      result = await (horizonServer as any).submitTransaction(signedTx);
    } catch (submitErr: any) {
      // Detailed logging for submission errors
      if (submitErr.response?.data?.extras?.result_codes) {
        const codes = submitErr.response.data.extras.result_codes;
        console.error('[Stellar] Submission Error Details:', JSON.stringify(codes, null, 2));
        
        if (codes.transaction === 'tx_bad_seq') {
          throw new Error('Sequence number mismatch. Please try again in a few seconds.');
        }
        if (codes.transaction === 'tx_insufficient_balance') {
          throw new Error('Insufficient XLM balance for transaction fees.');
        }
        if (codes.operations?.includes('op_not_supported')) {
          throw new Error('This operation is not supported by your account.');
        }
      }
      throw submitErr;
    }
    
    const txHash = result.hash;
    console.log('[Stellar] Transaction successful! Hash:', txHash);
    return { hash: txHash };
  } catch (err: any) {
    console.error('Error in real on-chain transaction:', err);
    throw err;
  }
}

/**
 * Fetches all record IDs stored in the account's manageData attributes.
 */
export async function fetchOnChainRecordIds(publicKey: string): Promise<string[]> {
  try {
    if (!horizonServer) throw new Error('Horizon server not initialized');
    
    console.log('[Stellar] Fetching on-chain record IDs for:', publicKey);
    const account = await (horizonServer as any).loadAccount(publicKey);
    const data = account.data_attr || {};
    
    const recordIds: string[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('medilocker:')) {
        try {
          // Stellar data values are base64 encoded
          const decodedId = atob(value as string);
          recordIds.push(decodedId);
        } catch (e) {
          console.error(`[Stellar] Failed to decode record ID for key ${key}:`, e);
        }
      }
    }
    
    console.log(`[Stellar] Found ${recordIds.length} on-chain record references.`);
    return recordIds;
  } catch (err) {
    console.error('Error fetching on-chain record IDs:', err);
    return [];
  }
}

/**
 * Grants access via a real signed transaction.
 */
export async function shareRecordOnChain(
  publicKey: string,
  recordId: string,
  withAddress: string
): Promise<{ hash: string }> {
  try {
    if (!horizonServer || !TransactionBuilderClass || !OperationNamespace || !NetworksNamespace) {
        throw new Error('Stellar SDK components not properly initialized');
    }

    if (!isValidStellarAddress(publicKey)) {
        throw new Error('Invalid source wallet address');
    }

    if (!isValidStellarAddress(withAddress)) {
        throw new Error('Invalid recipient wallet address');
    }

    console.log('[Stellar] Building sharing permission transaction...');
    const account = await (horizonServer as any).loadAccount(publicKey);
    
    const transaction = new (TransactionBuilderClass as any)(account, {
      fee: BASE_FEE_VALUE,
      networkPassphrase: (NetworksNamespace as any).TESTNET,
    })
      .addOperation(
        (OperationNamespace as any).manageData({
          name: `share:${recordId}`,
          value: withAddress,
        })
      )
      .setTimeout(30)
      .build();

    console.log('[Stellar] Requesting signature from Freighter...');
    const xdr = transaction.toXDR();
    const signResult = await signTransaction(xdr, { 
      networkPassphrase: (NetworksNamespace as any).TESTNET 
    });

    if (signResult.error) throw new Error(signResult.error);
    const signedXDR = signResult.signedTxXdr;
    
    console.log('[Stellar] Submitting transaction to Horizon...');
    const signedTx = new (TransactionBuilderClass as any).fromXDR(signedXDR, (NetworksNamespace as any).TESTNET);
    const submitResult = await (horizonServer as any).submitTransaction(signedTx);
    
    const txHash = submitResult.hash;
    console.log('[Stellar] Transaction successful! Hash:', txHash);
    return { hash: txHash };
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.extras && err.response.data.extras.result_codes) {
        const codes = err.response.data.extras.result_codes;
        console.error('Stellar Submission Error Codes:', codes);
        if (codes.operations && codes.operations.includes('op_no_destination')) {
            throw new Error('Destination account does not exist on Stellar Testnet.');
        }
    }
    console.error('Error in sharing transaction:', err);
    throw err;
  }
}
