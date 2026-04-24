import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Wallet, CheckCircle2, Loader2, ArrowRight, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react'
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
      // REAL Soroban interaction via Freighter
      const { hash } = await shareRecordOnChain(publicKey!, record.id, recipientAddress)
      setLastTxHash(hash)
      
      // Update local state
      shareRecord(record.id, recipientAddress)
      await fetchBalance(publicKey!) // Refresh real balance after fee
      
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

  if (!isOpen || !record) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white border border-surface-100 rounded-[2.5rem] p-8 md:p-10 shadow-premium overflow-hidden"
        >
          <button 
            onClick={resetAndClose}
            className="absolute top-8 right-8 p-2 text-surface-400 hover:text-surface-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {step === 'input' ? (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-surface-900 mb-2">Share Access</h2>
                <p className="text-surface-500 text-sm">Grant permission for another wallet to view this record.</p>
              </div>

              <div className="p-5 bg-surface-50 border border-surface-100 rounded-3xl mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl border border-surface-100 flex items-center justify-center shadow-soft">
                  <ShieldCheck className="w-6 h-6 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Record to share</p>
                  <p className="font-bold text-surface-900 truncate">{record.title}</p>
                </div>
              </div>

              <form onSubmit={handleShare} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-2 ml-1">Recipient Wallet Address</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input 
                      type="text"
                      placeholder="G... (Stellar Public Key)"
                      className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:border-brand-600 transition-all text-sm font-mono"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-brand-50/50 border border-brand-100 rounded-2xl mb-8">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-brand-800 leading-relaxed font-medium">
                      This requires a real signature. You will grant access by adding a metadata entry to your account on-chain.
                    </p>
                </div>

                <div className="flex items-center justify-between px-2 mb-4">
                    <span className="text-xs font-bold text-surface-400 uppercase">Network Fee</span>
                    <span className="text-xs font-bold text-surface-900">~0.00001 XLM</span>
                </div>

                <button 
                  type="submit"
                  disabled={!recipientAddress || isSharing}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  {isSharing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Waiting for Wallet...
                    </>
                  ) : (
                    <>
                      Grant Access
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-surface-900 mb-4">Access Granted!</h2>
              <p className="text-surface-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
                The recipient can now securely view this record through their MediLocker dashboard.
              </p>
              
              <div className="space-y-4">
                <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                >
                    View on Stellar Expert
                    <ExternalLink className="w-4 h-4" />
                </a>
                <button 
                    onClick={resetAndClose}
                    className="btn-primary w-full py-3.5"
                >
                    Done
                </button>
              </div>
            </motion.div>
          )}

          {/* Decorative Background */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-50/50 blur-3xl rounded-full -z-10" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
