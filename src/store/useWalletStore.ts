import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isConnected, requestAccess, getAddress, isAllowed } from '@stellar/freighter-api'
import { toast } from 'sonner'
import * as StellarSdk from '@stellar/stellar-sdk'
import { trackUserLogin } from '../lib/firebase'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'

/**
 * Helper to get Stellar SDK classes safely
 */
const getStellarClass = (path: string) => {
  const parts = path.split('.');
  let current: any = StellarSdk;
  for (const part of parts) {
    if (!current[part]) return null;
    current = current[part];
  }
  return current;
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
  deductBalance: (amount: number) => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      publicKey: null,
      balance: '0.00',
      isConnected: false,
      isLoading: false,
      walletType: null,
      error: null,

      connectFreighter: async () => {
        set({ isLoading: true, error: null })
        try {
          // 1. Detect if Freighter is installed and unlocked
          const connection = await isConnected()
          if (!connection.isConnected) {
            toast.error('Freighter Wallet not detected or locked. Please install and unlock the extension.')
            set({ isLoading: false, error: 'Freighter not installed or locked' })
            return
          }

          // 2. Request access (triggers popup)
          const access = await requestAccess()
          
          if (access.error) {
            throw new Error(access.error)
          }

          const key = access.address

          if (key) {
            set({ publicKey: key, isConnected: true, isLoading: false, walletType: 'freighter' })
            toast.success('Successfully connected to Freighter!')
            await trackUserLogin(key)
            await get().fetchBalance(key)
          } else {
            set({ isLoading: false, error: 'Access denied' })
            toast.error('Connection request rejected.')
          }
        } catch (err: any) {
          console.error('Freighter connection error:', err)
          const errorMessage = err.message || 'Connection failed'
          set({ isLoading: false, error: errorMessage })
          toast.error(errorMessage)
        }
      },

      checkConnection: async () => {
        try {
          const allowed = await isAllowed()
          if (allowed.isAllowed) {
            const result = await getAddress()
            if (result.address) {
              set({ publicKey: result.address, isConnected: true, walletType: 'freighter' })
              await trackUserLogin(result.address)
              await get().fetchBalance(result.address)
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

      deductBalance: (amount: number) => {
        set((state) => ({
          balance: (parseFloat(state.balance) - amount).toFixed(2)
        }))
      },

      disconnect: () => {
        set({ publicKey: null, isConnected: false, balance: '0.00', walletType: null })
        toast.info('Wallet disconnected')
      }
    }),
    {
      name: 'medilocker-wallet-storage',
    }
  )
)
