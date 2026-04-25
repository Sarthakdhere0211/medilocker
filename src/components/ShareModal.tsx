import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Wallet, CheckCircle2, Loader2, ArrowRight, ShieldCheck, AlertCircle, ExternalLink, Shield } from 'lucide-react'
import { shareRecordOnChain } from '../lib/stellar'
import { useWalletStore } from '../store/useWalletStore'
import { useRecordStore, RecordType } from '../store/useRecordStore'
import { toast } from 'sonner'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  record: RecordType | null
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, record }) => {
  const { publicKey, fetchBalance } = useWalletStore()
  const { shareRecord } = useRecordStore()
  const [isSharing, setIsSharing] = useState(false)
  const [step, setStep] = useState<'input' | 'success'>('input')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [lastTxHash, setLastTxHash] = useState('')

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientAddress || recipientAddress.length < 56 || !record) {
        toast.error('Please enter a valid Stellar wallet address')
        return
    }

    setIsSharing(true)
    try {
      const { hash } = await shareRecordOnChain(publicKey!, record.id, recipientAddress)
      setLastTxHash(hash)
      
      shareRecord(record.id, recipientAddress)
      await fetchBalance(publicKey!)
      
      toast.success(`Access granted successfully!`)
      setStep('success')
    } catch (err: any) {
      console.error('Share error:', err)
      toast.error(err.message || 'Failed to share record. Transaction rejected.')
    } finally {
      setIsSharing(false)
    }
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => {
      setStep('input')
      setRecipientAddress('')
      setLastTxHash('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && record && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-surface-900/60 backdrop-blur-xl" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-[3rem] p-10 md:p-14 shadow-premium overflow-hidden border border-surface-100 dark:border-surface-800"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            
            <button 
              onClick={resetAndClose}
              className="absolute top-10 right-10 p-3 text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-2xl transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'input' ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-12">
                    <div className="flex items-center gap-3 text-brand-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                      <Shield className="w-4 h-4" />
                      Protocol: Access Control
                    </div>
                    <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight leading-none">Share Record</h2>
                    <p className="text-surface-500 dark:text-surface-400 text-lg font-medium">Authorize another wallet to access this medical record.</p>
                  </div>

                  <div className="p-8 bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800 rounded-[2.5rem] mb-10 flex items-center gap-6 group transition-all hover:bg-white dark:hover:bg-surface-800 hover:border-brand-200">
                    <div className="w-16 h-16 bg-white dark:bg-surface-700 rounded-2xl border border-surface-100 dark:border-surface-600 flex items-center justify-center shadow-soft group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                      <ShieldCheck className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-1.5">Active Designation</p>
                      <p className="text-xl font-black text-surface-900 dark:text-surface-50 truncate tracking-tight leading-none">{record.title}</p>
                    </div>
                  </div>

                  <form onSubmit={handleShare} className="space-y-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.3em] ml-2">Recipient Public Key</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors">
                          <Wallet className="w-full h-full" />
                        </div>
                        <input 
                          type="text"
                          placeholder="G... (Stellar Wallet Address)"
                          className="input-premium pl-16 py-5 font-mono text-xs tracking-wider"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-5 p-8 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-[2rem] mb-10">
                        <CheckCircle2 className="w-6 h-6 text-brand-600 shrink-0" />
                        <p className="text-sm text-brand-900 dark:text-brand-400 leading-relaxed font-bold">
                          Access permissions are immutable and recorded on the global ledger. You can manage revocations in the security protocol panel.
                        </p>
                    </div>

                    <div className="flex items-center justify-between px-4 mb-4 text-[10px] font-black text-surface-400 uppercase tracking-[0.3em]">
                        <span>Ledger Operation Fee</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" />
                          <span className="text-brand-600">Minimal</span>
                        </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={!recipientAddress || isSharing}
                      className="btn-primary w-full py-6"
                    >
                      {isSharing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="uppercase tracking-widest text-xs font-black">Authorizing Proxy</span>
                        </>
                      ) : (
                        <>
                          <span className="uppercase tracking-widest text-xs font-black">Authorize Recipient</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-16 text-center"
                >
                  <div className="relative inline-block mb-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-premium shadow-emerald-600/10"
                    >
                      <CheckCircle2 className="w-16 h-16" />
                    </motion.div>
                  </div>

                  <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-4 tracking-tight leading-none">Access Granted</h2>
                  <p className="text-surface-500 dark:text-surface-400 text-lg max-w-sm mx-auto mb-14 leading-relaxed font-medium">
                    The recipient can now securely view this record through their synchronized vault.
                  </p>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary w-full py-6"
                    >
                        View Consensus Proof
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                        onClick={resetAndClose}
                        className="btn-primary w-full py-6"
                    >
                        Confirm & Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
