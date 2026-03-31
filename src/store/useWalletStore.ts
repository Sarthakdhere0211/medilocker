import { create } from 'zustand'
import { isAllowed, setAllowed, getPublicKey, isConnected } from '@stellar/freighter-api'
import { toast } from 'sonner'
import * as StellarSdk from '@stellar/stellar-sdk'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'

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

const horizonServer = HorizonServer ? new HorizonServer(HORIZON_URL) : null;

interface WalletState {
  publicKey: string | null
  balance: string
  isConnected: boolean
  isLoading: boolean
  walletType: 'freighter' | 'albedo' | 'walletconnect' | null
  error: string | null
  connectFreighter: () => Promise<void>
  disconnect: () => void
  checkConnection: () => Promise<void>
  fetchBalance: (pubKey: string) => Promise<void>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  balance: '0.00',
  isConnected: false,
  isLoading: false,
  walletType: null,
  error: null,

  connectFreighter: async () => {
    set({ isLoading: true, error: null })
    try {
      // 1. Detect if Freighter is installed
      const freighterInstalled = await isConnected()
      if (!freighterInstalled) {
        toast.error('Freighter Wallet not detected. Please install the extension.')
        set({ isLoading: false, error: 'Freighter not installed' })
        return
      }

      // 2. Request access (triggers popup)
      const allowed = await setAllowed()
      if (!allowed) {
        toast.error('Connection request rejected.')
        set({ isLoading: false, error: 'Access denied' })
        return
      }

      // 3. Get public key
      const key = await getPublicKey()
      if (key) {
        set({ publicKey: key, isConnected: true, isLoading: false, walletType: 'freighter' })
        toast.success('Successfully connected to Freighter!')
        await get().fetchBalance(key)
      } else {
        throw new Error('Failed to retrieve public key')
      }
    } catch (err: any) {
      console.error('Freighter connection error:', err)
      set({ isLoading: false, error: err.message || 'Connection failed' })
      toast.error(err.message || 'Failed to connect wallet')
    }
  },

  checkConnection: async () => {
    try {
      const allowed = await isAllowed()
      if (allowed) {
        const key = await getPublicKey()
        if (key) {
          set({ publicKey: key, isConnected: true, walletType: 'freighter' })
          await get().fetchBalance(key)
        }
      }
    } catch (err) {
      console.error('Check connection error:', err)
    }
  },

  fetchBalance: async (pubKey: string) => {
    try {
      if (!horizonServer) return
      const account = await (horizonServer as any).loadAccount(pubKey)
      const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native')
      if (nativeBalance) {
        set({ balance: parseFloat(nativeBalance.balance).toFixed(2) })
      }
    } catch (err) {
      console.error('Error fetching balance:', err)
      set({ balance: '0.00' }) // Assume 0 if not funded on testnet
    }
  },

  disconnect: () => {
    set({ publicKey: null, isConnected: false, balance: '0.00', walletType: null })
    toast.info('Wallet disconnected')
  }
}))
