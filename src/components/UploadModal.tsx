import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, CheckCircle, Loader2, Info, ExternalLink, ShieldCheck } from 'lucide-react'
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
  const [errorMessage, setErrorMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lastTxHash, setLastTxHash] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      // Limit to 2MB for local storage persistence in MVP
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('File too large. Please upload a file smaller than 2MB for this MVP.')
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
    
    // Create a timeout promise to prevent hanging (Increased to 3 minutes to match Stellar timeout)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Transaction timed out. Please check if your Freighter wallet is locked or needs attention.')), 180000)
    )

    try {
      const id = Math.random().toString(36).substring(7)
      
      // Generate unique file hash (CID simulation)
      const fileHash = 'bafybeig' + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
      
      // Store file OFF-CHAIN (Persistent Data URL)
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

      // REAL Stellar transaction with timeout protection
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

      // --- Indexing & Metrics Layer (Non-blocking) ---
      indexRecord(publicKey!, newRecord).catch(err => {
        console.error('Indexing error:', err);
        toast.error('Record secured on-chain, but indexing failed. It might take a moment to appear in your dashboard.');
      })

      await fetchBalance(publicKey!) // Refresh real balance
      addRecord(newRecord)
      
      toast.success('Medical record secured on-chain!')
      setStep('success')
    } catch (err: any) {
      console.error('Upload error:', err)
      
      // Log the failure (Non-blocking)
      logActivity(publicKey || 'unknown', 'UPLOAD_FAILURE', { 
        title, 
        error: err.message || 'Unknown error' 
      }).catch(logErr => console.error('Logging failed:', logErr))
      
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
      setDescription('')
      setLastTxHash('')
    }, 300)
  }

  if (!isOpen) return null

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

          {step === 'upload' && (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-surface-900 mb-2">Upload Medical Record</h2>
                <p className="text-surface-500 text-sm">Store your records securely on the Stellar network.</p>
              </div>

              <form onSubmit={handleProceedToConfirm} className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative cursor-pointer py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all
                    ${file ? 'border-brand-600 bg-brand-50/30' : 'border-surface-100 hover:border-brand-300 hover:bg-surface-50'}
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
                      <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-soft">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-surface-900">{file.name}</p>
                        <p className="text-xs text-surface-500 font-medium">{(file.size / 1024).toFixed(1)} KB • Ready to secure</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-surface-50 text-surface-300 rounded-2xl flex items-center justify-center">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-surface-900">Choose a file or drag here</p>
                        <p className="text-xs text-surface-500 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-2 ml-1">Record Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Annual Blood Report 2026"
                      className="w-full px-5 py-3 bg-surface-50 border border-surface-100 rounded-2xl focus:outline-none focus:border-brand-600 transition-all text-sm font-medium"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Blockchain Status</p>
                      <p className="text-sm font-bold text-brand-900">Secure Anchoring</p>
                    </div>
                  </div>
                  <Info className="w-4 h-4 text-brand-400" />
                </div>

                <button 
                  type="submit"
                  disabled={!file || !title}
                  className="btn-primary w-full py-4 text-sm"
                >
                  Review Transaction
                </button>
              </form>
            </>
          )}

          {step === 'confirm' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-4"
            >
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-surface-900 mb-2">Confirm Storage</h2>
                <p className="text-surface-500 text-sm">Review the details before committing to the blockchain.</p>
              </div>

              <div className="bg-surface-50 rounded-3xl p-6 border border-surface-100 mb-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-500 font-medium">Record</span>
                  <span className="text-sm text-surface-900 font-bold">{title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-500 font-medium">File Type</span>
                  <span className="text-sm text-surface-900 font-bold">{file?.type.split('/')[1].toUpperCase()}</span>
                </div>
                <div className="w-full h-px bg-surface-100" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-surface-500 font-medium">Network Fee</span>
                  <span className="text-sm text-brand-600 font-bold">Minimal (XLM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-10">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  This transaction will store the record's unique hash on the Stellar blockchain. Only standard network fees apply.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('upload')}
                  disabled={isUploading}
                  className="btn-secondary flex-1 py-4"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  disabled={isUploading}
                  className="btn-primary flex-[2] py-4 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadStatus === 'signing' ? 'Check Wallet...' : 'Securing on Stellar...'}
                    </>
                  ) : (
                    <>
                      Sign & Upload
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-surface-900 mb-4">Upload Successful!</h2>
              <p className="text-surface-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
                Your medical record has been securely anchored to the Stellar blockchain.
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
                    Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}

          {/* Decorative Background */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-50/50 blur-3xl rounded-full -z-10" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
