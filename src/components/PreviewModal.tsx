import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Shield, Calendar, HardDrive, FileText, ExternalLink, ShieldCheck, Globe, Clock } from 'lucide-react'
import { RecordType } from '../store/useRecordStore'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  record: RecordType | null
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, record }) => {
  return (
    <AnimatePresence>
      {isOpen && record && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 md:p-12">
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
            className="relative w-full max-w-7xl bg-white dark:bg-surface-900 rounded-[3.5rem] shadow-premium overflow-hidden flex flex-col md:flex-row h-[85vh] border border-surface-100 dark:border-surface-800"
          >
            {/* Document Viewer */}
            <div className="flex-1 bg-surface-50 dark:bg-surface-950 p-8 md:p-12 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-surface-100 dark:border-surface-800 overflow-hidden">
              <div className="w-full h-full bg-white dark:bg-surface-900 rounded-[2.5rem] shadow-soft border border-surface-200/50 dark:border-surface-800 flex flex-col items-center justify-center overflow-hidden group relative">
                  {record.fileUrl ? (
                      record.fileType === 'PDF' ? (
                          <iframe 
                              src={record.fileUrl} 
                              className="w-full h-full border-none"
                              title={record.title}
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center p-10">
                              <img 
                                  src={record.fileUrl} 
                                  alt={record.title}
                                  className="max-w-full max-h-full object-contain rounded-3xl shadow-premium group-hover:scale-[1.02] transition-transform duration-700"
                              />
                          </div>
                      )
                  ) : (
                      <div className="flex flex-col items-center justify-center p-16 text-center">
                          <div className="w-32 h-32 bg-surface-50 dark:bg-surface-800 rounded-[2rem] flex items-center justify-center mb-10 border border-surface-100 dark:border-surface-800">
                            <FileText className="w-16 h-16 text-surface-200 dark:text-surface-700" />
                          </div>
                          <h3 className="text-3xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight leading-none">Secure Decryption</h3>
                          <p className="text-surface-500 dark:text-surface-400 max-w-xs mx-auto text-lg leading-relaxed mb-12 font-medium">
                            Establishing session-specific secure tunnel to decentralized storage...
                          </p>
                          <div className="space-y-6 w-full max-w-sm">
                              <div className="h-4 bg-surface-50 dark:bg-surface-800 rounded-full w-full animate-pulse" />
                              <div className="h-4 bg-surface-50 dark:bg-surface-800 rounded-full w-5/6 animate-pulse mx-auto" />
                              <div className="h-4 bg-surface-50 dark:bg-surface-800 rounded-full w-4/6 animate-pulse mx-auto" />
                          </div>
                      </div>
                  )}
              </div>
              
              <div className="absolute top-14 right-14 flex gap-4">
                  {record.fileUrl && (
                      <motion.a 
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          href={record.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl rounded-2xl shadow-soft text-surface-400 hover:text-brand-600 transition-all border border-surface-100 dark:border-surface-700"
                          title="Open Native Viewer"
                      >
                          <ExternalLink className="w-6 h-6" />
                      </motion.a>
                  )}
              </div>
            </div>

            {/* Record Info Sidebar */}
            <div className="w-full md:w-[450px] bg-white dark:bg-surface-900 p-12 md:p-16 flex flex-col relative overflow-y-auto custom-scrollbar">
              <button 
                  onClick={onClose}
                  className="absolute top-12 right-12 p-3 text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-2xl transition-all z-10"
              >
                  <X className="w-6 h-6" />
              </button>

              <div className="mb-14 pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-brand-100 dark:border-brand-900/50">
                        {record.fileType} Protocol
                    </span>
                    {(record.status || "pending") === 'approved' ? (
                      <div className="status-badge-approved flex items-center gap-2 px-4 py-1.5 shadow-sm shadow-green-500/10">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
                      </div>
                    ) : (
                      <div className="status-badge-pending flex items-center gap-2 px-4 py-1.5 shadow-sm shadow-amber-500/10">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pending</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 leading-[0.9] mb-4 tracking-tighter">{record.title}</h2>
                  <div className="flex items-center gap-2 text-surface-400 dark:text-surface-500 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Globe className="w-3.5 h-3.5" />
                    Ledger State: Synchronized
                  </div>
              </div>

              <div className="space-y-8 flex-1">
                  <div className="p-7 rounded-[2rem] border border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 group transition-all hover:bg-white dark:hover:bg-surface-800">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white dark:bg-surface-700 rounded-2xl flex items-center justify-center text-surface-400 shadow-soft border border-surface-100 dark:border-surface-600 transition-transform group-hover:rotate-6">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em] mb-1.5">Anchor Timestamp</p>
                            <p className="text-lg font-black text-surface-900 dark:text-surface-50 tracking-tight leading-none">{new Date(record.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                  </div>

                  <div className="p-7 rounded-[2rem] border border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 group transition-all hover:bg-white dark:hover:bg-surface-800">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white dark:bg-surface-700 rounded-2xl flex items-center justify-center text-surface-400 shadow-soft border border-surface-100 dark:border-surface-600 transition-transform group-hover:-rotate-6">
                            <HardDrive className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em] mb-1.5">Cryptographic Size</p>
                            <p className="text-lg font-black text-surface-900 dark:text-surface-50 tracking-tight leading-none">{record.size}</p>
                        </div>
                    </div>
                  </div>

                  {record.txHash && (
                    <div className="p-8 rounded-[2.5rem] border border-brand-100 dark:border-brand-900/50 bg-brand-50/50 dark:bg-brand-900/10">
                      <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Blockchain Identity
                      </p>
                      <p className="text-[10px] font-mono text-surface-500 dark:text-surface-400 break-all leading-relaxed font-bold mb-6">
                        {record.txHash}
                      </p>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 uppercase tracking-[0.2em] transition-all border-b-2 border-brand-100 dark:border-brand-900/50 pb-1"
                      >
                        Verify Protocol Proof
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
              </div>

              <div className="mt-14 space-y-4 pt-10 border-t border-surface-50 dark:border-surface-800">
                  <motion.a 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href={record.fileUrl}
                      download={record.title}
                      className="btn-primary w-full py-6 no-underline"
                  >
                      <Download className="w-5 h-5" />
                      Download Session Copy
                  </motion.a>
                  <p className="text-[10px] text-surface-400 text-center font-black uppercase tracking-widest">End-to-End Encrypted Session</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
