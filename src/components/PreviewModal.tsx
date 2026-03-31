import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, Shield, Calendar, HardDrive, FileText, ExternalLink } from 'lucide-react'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-white border border-surface-100 rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col md:flex-row h-[80vh]"
        >
          {/* Document Viewer */}
          <div className="flex-1 bg-surface-50 p-6 md:p-10 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-surface-100 overflow-hidden">
            <div className="w-full h-full bg-white rounded-2xl shadow-inner border border-surface-100 flex flex-col items-center justify-center overflow-hidden">
                {record.fileUrl ? (
                    record.fileType === 'PDF' ? (
                        <iframe 
                            src={record.fileUrl} 
                            className="w-full h-full border-none rounded-2xl"
                            title={record.title}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img 
                                src={record.fileUrl} 
                                alt={record.title}
                                className="max-w-full max-h-full object-contain rounded-xl shadow-premium"
                            />
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <FileText className="w-24 h-24 text-surface-100 mb-6" />
                        <h3 className="text-xl font-bold text-surface-900 mb-2">Secure Document Preview</h3>
                        <p className="text-surface-400 max-w-xs mx-auto text-sm leading-relaxed mb-8">
                          This document is decrypted on-the-fly and served through a secure gateway.
                        </p>
                        <div className="space-y-4 w-full max-w-xs">
                            <div className="h-4 bg-surface-50 rounded-full w-full animate-pulse" />
                            <div className="h-4 bg-surface-50 rounded-full w-5/6 animate-pulse" />
                            <div className="h-4 bg-surface-50 rounded-full w-4/6 animate-pulse" />
                            <div className="h-4 bg-surface-50 rounded-full w-full animate-pulse" />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2">
                {record.fileUrl && (
                    <a 
                        href={record.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-lg shadow-soft text-surface-400 hover:text-brand-600 transition-colors border border-surface-100"
                        title="Open in new tab"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                )}
            </div>
          </div>

          {/* Record Info Sidebar */}
          <div className="w-full md:w-80 bg-white p-8 flex flex-col">
            <button 
                onClick={onClose}
                className="self-end p-2 text-surface-400 hover:text-surface-900 transition-colors mb-4"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-wider rounded-lg mb-3">
                    {record.fileType} Record
                </span>
                <h2 className="text-2xl font-bold text-surface-900 leading-tight mb-2">{record.title}</h2>
                <p className="text-surface-500 text-sm">Stored on Stellar Network</p>
            </div>

            <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Date Uploaded</p>
                        <p className="text-sm font-bold text-surface-900">{new Date(record.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400">
                        <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">File Size</p>
                        <p className="text-sm font-bold text-surface-900">{record.size}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Status</p>
                        <p className="text-sm font-bold text-emerald-600">Verified On-Chain</p>
                    </div>
                </div>
                
                {record.txHash && (
                  <div className="pt-4">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest flex items-center gap-2"
                    >
                      View Transaction
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
            </div>

            <div className="mt-auto space-y-3">
                <a 
                    href={record.fileUrl}
                    download={record.title}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm no-underline"
                >
                    <Download className="w-4 h-4" />
                    Download File
                </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
