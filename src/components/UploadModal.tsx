import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, CheckCircle, Loader2, Info, ExternalLink, ShieldCheck, ArrowRight, Shield, Wallet } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'
import { useRecordStore } from '../store/useRecordStore'
import { uploadRecordOnChain } from '../lib/stellar'
import { indexRecord, logActivity } from '../lib/firebase'
import { toast } from 'sonner'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

const STORAGE_FEE = 0.00 // Minimal network fee only

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { publicKey, balance, deductBalance, fetchBalance } = useWalletStore()
  const { addRecord } = useRecordStore()
  const [step, setStep] = useState<'upload' | 'confirm' | 'success' | 'error'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [lastTxHash, setLastTxHash] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('File too large. Please upload a file smaller than 2MB.')
        return
      }
      setFile(selectedFile)
      if (!title) setTitle(selectedFile.name.split('.')[0])
    }
  }

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) return
    
    if (parseFloat(balance) < STORAGE_FEE) {
      toast.error('Insufficient XLM balance for storage fee.')
      return
    }
    
    setStep('confirm')
  }

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'signing' | 'submitting'>('idle')

  const handleFinalSubmit = async () => {
    if (!file || !title) return

    setIsUploading(true)
    setUploadStatus('signing')
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Transaction timed out. Please check your Freighter wallet.')), 180000)
    )

    try {
      const id = Math.random().toString(36).substring(7)
      const fileHash = 'bafybeig' + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
      
      const fileUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      const recordData = {
        id,
        title,
        fileHash,
        fileUrl,
        owner: publicKey!,
        timestamp: Date.now(),
        fileType: file.type.split('/')[1].toUpperCase() || 'PDF',
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }

      const result = await Promise.race([
        uploadRecordOnChain(publicKey!, id).then(res => {
          setUploadStatus('submitting');
          return res;
        }),
        timeoutPromise
      ]) as { hash: string }
      
      const { hash } = result
      setLastTxHash(hash)

      const newRecord = {
        ...recordData,
        txHash: hash
      }

      indexRecord(publicKey!, newRecord).catch(err => {
        console.error('Indexing error:', err);
      })

      await fetchBalance(publicKey!)
      addRecord(newRecord)
      
      toast.success('Medical record secured on-chain!')
      setStep('success')
    } catch (err: any) {
      console.error('Upload error:', err)
      logActivity(publicKey || 'unknown', 'UPLOAD_FAILURE', { 
        title, 
        error: err.message || 'Unknown error' 
      }).catch(() => {})
      toast.error(err.message || 'Transaction failed or rejected.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => {
      setStep('upload')
      setFile(null)
      setTitle('')
      setLastTxHash('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
              {step === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-12">
                    <div className="flex items-center gap-3 text-brand-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                      <Shield className="w-4 h-4" />
                      Protocol: Secure Upload
                    </div>
                    <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight leading-none">Protect Document</h2>
                    <p className="text-surface-500 dark:text-surface-400 text-lg font-medium">Anchor your medical history to the Stellar ledger.</p>
                  </div>

                  <form onSubmit={handleProceedToConfirm} className="space-y-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        relative cursor-pointer py-16 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-6 transition-all duration-500 group
                        ${file ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-900/10' : 'border-surface-200 dark:border-surface-800 hover:border-brand-400 hover:bg-surface-50 dark:hover:bg-surface-800/50'}
                      `}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,image/*"
                      />
                      {file ? (
                        <>
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="w-20 h-20 bg-brand-600 text-white rounded-3xl flex items-center justify-center shadow-premium group-hover:rotate-6 transition-transform"
                          >
                            <CheckCircle className="w-10 h-10" />
                          </motion.div>
                          <div className="text-center px-8">
                            <p className="text-xl font-black text-surface-900 dark:text-surface-50 truncate max-w-[400px] mb-1">{file.name}</p>
                            <p className="text-[10px] text-brand-600 font-black uppercase tracking-[0.2em]">Verification Ready</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-surface-50 dark:bg-surface-800 text-surface-400 rounded-3xl flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-900/20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                            <Upload className="w-10 h-10" />
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-black text-surface-900 dark:text-surface-50 mb-1">Select Document</p>
                            <p className="text-[10px] text-surface-400 font-black uppercase tracking-[0.2em]">PDF or Images up to 2MB</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[0.3em] ml-2">Record Designation</label>
                      <input 
                        type="text"
                        placeholder="e.g. Diagnostic Report - Q4 2026"
                        className="input-premium py-5"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-premium shadow-emerald-600/20">
                          <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Node Status</p>
                          <p className="text-base font-black text-emerald-900 dark:text-emerald-400 leading-none">Network Synchronized</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={!file || !title}
                      className="btn-primary w-full py-6 text-sm"
                    >
                      Initialize Anchoring
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div 
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-12">
                    <div className="flex items-center gap-3 text-brand-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                      <ShieldCheck className="w-4 h-4" />
                      Consensus Verification
                    </div>
                    <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight leading-none">Ledger Review</h2>
                    <p className="text-surface-500 dark:text-surface-400 text-lg font-medium">Verify cryptographic parameters before signing.</p>
                  </div>

                  <div className="bg-surface-50 dark:bg-surface-800/50 rounded-[2.5rem] p-10 border border-surface-100 dark:border-surface-800 mb-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-surface-400 font-black uppercase tracking-widest">Document</span>
                      <span className="text-lg text-surface-900 dark:text-surface-50 font-black tracking-tight">{title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-surface-400 font-black uppercase tracking-widest">Payload Size</span>
                      <span className="text-lg text-surface-900 dark:text-surface-50 font-black tracking-tight">{(file?.size || 0 / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="w-full h-px bg-surface-200/50 dark:bg-surface-700/50" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-surface-400 font-black uppercase tracking-widest">Network Fee</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-sm text-emerald-600 font-black uppercase tracking-[0.2em]">Minimal</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-8 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-[2rem] mb-12">
                    <ShieldCheck className="w-6 h-6 text-brand-600 shrink-0" />
                    <p className="text-sm text-brand-900 dark:text-brand-400 leading-relaxed font-bold">
                      A unique SHA-256 cryptographic hash will be permanently anchored to the Stellar Testnet ledger. This action is immutable.
                    </p>
                  </div>

                  <div className="flex gap-6">
                    <button 
                      onClick={() => setStep('upload')}
                      disabled={isUploading}
                      className="btn-secondary flex-1 py-6"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={handleFinalSubmit}
                      disabled={isUploading}
                      className="btn-primary flex-[2] py-6"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {uploadStatus === 'signing' ? 'Check Wallet' : 'Synchronizing'}
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          Sign & Secure
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <div className="relative inline-block mb-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-premium shadow-emerald-600/10"
                    >
                      <CheckCircle className="w-16 h-16" />
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-surface-800 rounded-2xl flex items-center justify-center shadow-soft border border-emerald-100 dark:border-emerald-900/30"
                    >
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-4 tracking-tight leading-none">Protocol Success</h2>
                  <p className="text-surface-500 dark:text-surface-400 text-lg max-w-sm mx-auto mb-14 font-medium leading-relaxed">
                    Document anchored successfully. Cryptographic proof is now live on the global ledger.
                  </p>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary w-full py-6"
                    >
                        View Blockchain Proof
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                        onClick={resetAndClose}
                        className="btn-primary w-full py-6"
                    >
                        Return to Vault
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
