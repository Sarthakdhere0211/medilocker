import React from 'react'
import { Shield, LogOut, Wallet, Coins } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'

export const Navbar = () => {
  const { isConnected, publicKey, balance, disconnect } = useWalletStore()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-surface-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-soft">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-surface-900">
            Medi<span className="text-brand-600">Locker</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-surface-50 rounded-xl border border-surface-100">
                <div className="flex items-center gap-1.5 text-brand-700 font-bold text-sm">
                  <Coins className="w-4 h-4" />
                  {balance} <span className="text-[10px] font-medium opacity-70 uppercase">XLM</span>
                </div>
                <div className="w-px h-4 bg-surface-200" />
                <div className="flex items-center gap-2 text-surface-600 font-mono text-xs font-medium">
                  <Wallet className="w-3.5 h-3.5" />
                  {formatAddress(publicKey!)}
                </div>
              </div>
              <button 
                onClick={disconnect}
                className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <a href="#features" className="text-sm font-semibold text-surface-600 hover:text-brand-600 transition-colors">Features</a>
              <a href="#about" className="text-sm font-semibold text-surface-600 hover:text-brand-600 transition-colors">How it Works</a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
