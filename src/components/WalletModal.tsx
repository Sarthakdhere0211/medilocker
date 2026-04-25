import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Loader2, Shield, Wallet, ArrowRight, ShieldCheck } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const FreighterLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM28.5 26.5C28.5 27.3284 27.8284 28 27 28H13C12.1716 28 11.5 27.3284 11.5 26.5V13.5C11.5 12.6716 12.1716 12 13 12H27C27.8284 12 28.5 12.6716 28.5 13.5V26.5Z" fill="#0D9488"/>
    <path d="M20 16L16 20L20 24L24 20L20 16Z" fill="white"/>
  </svg>
)

const AlbedoLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#94A3B8"/>
    <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="white"/>
  </svg>
)

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectFreighter, isLoading, isConnected: isWalletConnected } = useWalletStore()

  const handleFreighter = async () => {
    try {
      await connectFreighter()
      if (useWalletStore.getState().isConnected) {
        onClose()
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-900/60 backdrop-blur-xl" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-[3rem] p-10 md:p-12 shadow-premium overflow-hidden border border-surface-100 dark:border-surface-800"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 p-3 text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-2xl transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-12 text-center relative z-10">
              <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-100 dark:border-brand-900/50">
                <ShieldCheck className="w-10 h-10 text-brand-600" />
              </div>
              <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight leading-none">Access Protocol</h2>
              <p className="text-surface-500 dark:text-surface-400 text-lg font-medium leading-relaxed">Establish a secure session using your Stellar identity.</p>
            </div>

            <div className="space-y-4 relative z-10">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFreighter}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-6 bg-brand-50/50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/50 rounded-[2rem] hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-all group relative overflow-hidden shadow-soft"
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 bg-white dark:bg-surface-800 rounded-2xl flex items-center justify-center shadow-soft border border-brand-100 dark:border-brand-900/50 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                     <FreighterLogo />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-brand-900 dark:text-brand-400 tracking-tight leading-none mb-1.5">Freighter Wallet</p>
                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest leading-none">Native Extension</p>
                  </div>
                </div>
                <div className="relative z-10">
                  {isLoading ? ( 
                    <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                  ) : (
                    <div className="w-10 h-10 bg-white dark:bg-surface-800 rounded-xl flex items-center justify-center shadow-soft border border-brand-100 dark:border-brand-900/50 group-hover:bg-brand-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-6 bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800 rounded-[2rem] hover:bg-white dark:hover:bg-surface-800 transition-all group relative opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white dark:bg-surface-700 rounded-2xl flex items-center justify-center shadow-soft border border-surface-100 dark:border-surface-600 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                     <AlbedoLogo />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-surface-900 dark:text-surface-100 tracking-tight leading-none mb-1.5">Albedo Identity</p>
                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest leading-none">Web Portal</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white dark:bg-surface-700 rounded-xl flex items-center justify-center shadow-soft border border-surface-100 dark:border-surface-600">
                  <ChevronRight className="w-5 h-5 text-surface-300" />
                </div>
              </motion.button>
            </div>

            <div className="mt-12 p-8 bg-surface-50 dark:bg-surface-800/30 rounded-[2rem] border border-surface-100 dark:border-surface-800 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-surface-400" />
                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Protocol Assurance</span>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed font-bold">
                MediLocker does not store your private keys. All signatures occur within your chosen wallet environment.
              </p>
            </div>
            
            <p className="mt-10 text-[10px] text-surface-400 dark:text-surface-500 text-center font-black uppercase tracking-[0.2em] relative z-10">
              Powered by <span className="text-brand-600">Stellar Soroban</span>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
