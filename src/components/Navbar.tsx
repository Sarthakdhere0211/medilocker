import React from 'react'
import { Shield, LogOut, Wallet, Coins, Globe, ShieldCheck } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

export const Navbar = () => {
  const { isConnected, publicKey, balance, disconnect } = useWalletStore()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-surface-950/70 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800 px-8 py-5 transition-all duration-500 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-premium group-hover:bg-brand-500 transition-all duration-300 group-hover:rotate-6">
            <div className="w-6 h-6 border-[3px] border-white rounded-xl flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-surface-900 dark:text-surface-50">
            Medi<span className="text-brand-600">Locker</span>
          </span>
        </div>

        <div className="flex items-center gap-10">
          {!isConnected && (
            <div className="hidden lg:flex items-center gap-10">
              <a href="#features" className="text-[10px] font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-[0.2em]">Features</a>
              <a href="#about" className="text-[10px] font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-[0.2em]">Infrastructure</a>
            </div>
          )}

          <div className="flex items-center gap-6 pl-10 border-l border-surface-100 dark:border-surface-800">
            <ThemeToggle />
            
            {isConnected ? (
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-soft transition-all hover:bg-white dark:hover:bg-surface-800 hover:border-brand-200">
                  <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-black text-sm tracking-tight">
                    <Coins className="w-4.5 h-4.5" />
                    {balance} <span className="text-[10px] opacity-70">XLM</span>
                  </div>
                  <div className="w-px h-5 bg-surface-200 dark:bg-surface-700" />
                  <div className="flex items-center gap-2.5 text-surface-500 dark:text-surface-400 font-black text-xs tracking-tight">
                    <Wallet className="w-4 h-4" />
                    {formatAddress(publicKey!)}
                  </div>
                </div>
                <button 
                  onClick={disconnect}
                  className="w-12 h-12 flex items-center justify-center text-surface-400 dark:text-surface-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-surface-100 dark:border-surface-800 hover:border-red-100 dark:hover:border-red-900/50"
                  title="Secure Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary py-3.5 px-8 text-xs tracking-widest uppercase font-black"
              >
                Access Vault
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
