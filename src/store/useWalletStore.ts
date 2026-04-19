import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as Freighter from '@stellar/freighter-api'
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
          // 1. Detect if Freighter is installed
          const freighterInstalled = await Freighter.isConnected()
          if (!freighterInstalled) {
            toast.error('Freighter Wallet not detected. Please install the extension.')
            set({ isLoading: false, error: 'Freighter not installed' })
            return
          }

          // 2. Check if already connected/unlocked
          let key = ''
          try {
            key = await Freighter.getPublicKey()
          } catch (e) {
            // Not connected or locked, proceed to requestAccess
          }

          if (!key) {
            // 3. Request access (triggers popup)
            // We await this fully to ensure we get the result after user interaction
            key = await (Freighter as any).requestAccess()
          }

          if (key) {
            set({ publicKey: key, isConnected: true, isLoading: false, walletType: 'freighter' })
            toast.success('Successfully connected to Freighter!')
            await get().fetchBalance(key)
          } else {
            // If key is still empty after requestAccess, it means user rejected or closed popup
            set({ isLoading: false, error: 'Access denied' })
            toast.error('Connection request rejected.')
          }
        } catch (err: any) {
          console.error('Freighter connection error:', err)
          
          // Handle specific error cases if needed
          const errorMessage = err.message || 'Connection failed'
          set({ isLoading: false, error: errorMessage })
          
          // Don't toast if it was a user cancellation that we already handled above
          if (errorMessage !== 'Access denied') {
            toast.error(errorMessage)
          }
        }
      },

      checkConnection: async () => {
        try {
          const allowed = await Freighter.isAllowed()
          if (allowed) {
            const key = await Freighter.getPublicKey()
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
