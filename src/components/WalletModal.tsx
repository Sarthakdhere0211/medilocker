import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Loader2 } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const FreighterLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM28.5 26.5C28.5 27.3284 27.8284 28 27 28H13C12.1716 28 11.5 27.3284 11.5 26.5V13.5C11.5 12.6716 12.1716 12 13 12H27C27.8284 12 28.5 12.6716 28.5 13.5V26.5Z" fill="#4F61FF"/>
    <path d="M20 16L16 20L20 24L24 20L20 16Z" fill="white"/>
  </svg>
)

const AlbedoLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#64748B"/>
    <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="white"/>
  </svg>
)

const WalletConnectLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#3B82F6"/>
    <path d="M10 15C15 10 25 10 30 15L20 25L10 15Z" fill="white"/>
  </svg>
)

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectFreighter, isLoading } = useWalletStore()

  const handleFreighter = async () => {
    await connectFreighter()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface-900/40 backdrop-blur-md" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white border border-surface-100 rounded-[2.5rem] p-8 md:p-10 shadow-premium overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-surface-400 hover:text-surface-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-surface-900 mb-2 font-sans">Connect Your Wallet</h2>
            <p className="text-surface-500 text-sm font-medium">Select your preferred Stellar wallet to securely manage your health vault.</p>
          </div>

          <div className="space-y-4">
            {/* Freighter Wallet - Primary */}
            <button 
              onClick={handleFreighter}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-5 bg-brand-50 border border-brand-200 rounded-2xl hover:bg-brand-100 hover:border-brand-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft border border-brand-100 transition-transform group-hover:scale-110">
                   <FreighterLogo />
                </div>
                <div className="text-left">
                  <p className="font-bold text-brand-900 font-sans">Freighter Wallet</p>
                  <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Recommended</p>
                </div>
              </div>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-brand-600" /> : <ChevronRight className="w-5 h-5 text-brand-400 group-hover:translate-x-1 transition-transform" />}
            </button>

            {/* Albedo - Secondary */}
            <button 
              disabled={true}
              className="w-full flex items-center justify-between p-5 bg-surface-50 border border-surface-100 rounded-2xl opacity-60 cursor-not-allowed group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft border border-surface-50">
                   <AlbedoLogo />
                </div>
                <div className="text-left">
                  <p className="font-bold text-surface-900 font-sans">Albedo</p>
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Coming Soon</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-300" />
            </button>

            {/* WalletConnect - Secondary */}
            <button 
              disabled={true}
              className="w-full flex items-center justify-between p-5 bg-surface-50 border border-surface-100 rounded-2xl opacity-60 cursor-not-allowed group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft border border-surface-50">
                   <WalletConnectLogo />
                </div>
                <div className="text-left">
                  <p className="font-bold text-surface-900 font-sans">WalletConnect</p>
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Coming Soon</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-300" />
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-surface-400 font-bold uppercase tracking-widest leading-relaxed">
            SECURED BY STELLAR PROTOCOL
          </p>

          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-50/50 blur-3xl rounded-full -z-10" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
