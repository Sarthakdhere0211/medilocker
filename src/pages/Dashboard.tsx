import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  Share2, 
  Eye, 
  Calendar, 
  HardDrive, 
  Trash2, 
  Search, 
  LayoutGrid, 
  List, 
  Activity, 
  ShieldCheck,
  ExternalLink,
  Wallet,
  Clock,
  Loader2
} from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'
import { useRecordStore } from '../store/useRecordStore'
import { fetchOnChainRecordIds } from '../lib/stellar'
import { UploadModal } from '../components/UploadModal'
import { ShareModal } from '../components/ShareModal'
import { PreviewModal } from '../components/PreviewModal'
import { Sidebar } from '../components/Sidebar'
import { toast } from 'sonner'

const MOCK_SHARED_RECORD = {
  id: 'shared-1',
  title: 'Radiology Report - City Hospital',
  fileHash: 'bafybeig...',
  fileUrl: '', 
  owner: 'GD2...HOSPITAL',
  timestamp: Date.now() - 86400000 * 5,
  fileType: 'PDF',
  size: '2.4 MB',
  txHash: 's1234567890abcdef'
}

export const Dashboard = () => {
  const { publicKey, balance, disconnect } = useWalletStore()
  const { records, sharedRecords, addSharedRecord, setRecords, setLoading, isLoading: isRecordsLoading } = useRecordStore()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const loadAndSyncRecords = async () => {
      if (!publicKey) return
      
      setLoading(true)
      try {
        // Hybrid Sync: Get IDs from blockchain + match with off-chain storage
        const onChainIds = await fetchOnChainRecordIds(publicKey)
        
        // Filter local records to only include those anchored on-chain
        const syncedRecords = records.filter(r => onChainIds.includes(r.id))
        
        // In a real production app, you would fetch missing record data 
        // from a decentralized DB (like GunDB or OrbitDB) using the ID.
        // For this MVP, we rely on the off-chain persistence layer.
        
        setRecords(syncedRecords)
      } catch (error) {
        console.error('Failed to sync records:', error)
        toast.error('Blockchain sync failed')
      } finally {
        setLoading(false)
      }
    }

    loadAndSyncRecords()
    
    if (sharedRecords.length === 0) {
        addSharedRecord(MOCK_SHARED_RECORD)
    }
  }, [publicKey, addSharedRecord, setRecords, setLoading])

  // Wallet-based filtering: only show records belonging to the current public key
  const myRecords = records.filter(r => r.owner === publicKey)
  const displayRecords = activeTab === 'shared' ? sharedRecords : myRecords

  const filteredRecords = displayRecords.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSharedCount = myRecords.reduce((acc, r) => acc + (r.sharedWith?.length || 0), 0)

  const handleShare = (record: any) => {
    setSelectedRecord(record)
    setIsShareOpen(true)
  }

  const handleView = (record: any) => {
    setSelectedRecord(record)
    setIsPreviewOpen(true)
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-6)}`

  return (
    <div className="bg-surface-50 min-h-screen flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-surface-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-surface-900 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-surface-50 rounded-2xl border border-surface-100">
              <div className="w-8 h-8 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider leading-none mb-1">Balance</p>
                <p className="text-sm font-bold text-surface-900 leading-none">{balance} XLM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-surface-900 leading-none mb-1">{formatAddress(publicKey!)}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Verified</p>
              </div>
              <button 
                onClick={disconnect}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-bold text-surface-900 mb-2">
                  {activeTab === 'dashboard' ? 'Health Overview' : activeTab === 'shared' ? 'Shared with Me' : 'My Medical Records'}
                </h1>
                <p className="text-surface-500 font-medium">
                  {activeTab === 'shared' 
                    ? 'Securely access records shared by your providers.' 
                    : `Managing ${myRecords.length} secure medical references.`}
                </p>
              </div>
              <button 
                onClick={() => setIsUploadOpen(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3 shadow-premium"
              >
                <Plus className="w-5 h-5" />
                Upload New Record
              </button>
            </div>

            {/* Quick Stats (Only on Dashboard) */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-surface-100 shadow-soft flex items-center gap-5 hover:border-brand-200 transition-all">
                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-0.5">Total Records</p>
                    <p className="text-2xl font-bold text-surface-900">{myRecords.length}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-surface-100 shadow-soft flex items-center gap-5 hover:border-indigo-200 transition-all">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-0.5">Access Granted</p>
                    <p className="text-2xl font-bold text-surface-900">{totalSharedCount}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-surface-100 shadow-soft flex items-center gap-5 hover:border-emerald-200 transition-all">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-0.5">Network Status</p>
                    <p className="text-2xl font-bold text-emerald-600">Secure</p>
                  </div>
                </div>
              </div>
            )}

            {/* Records List Container */}
            <div className="bg-white rounded-[2.5rem] border border-surface-100 shadow-soft overflow-hidden">
              {/* Toolbar */}
              <div className="px-8 py-6 border-b border-surface-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface-50/30">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input 
                    type="text"
                    placeholder="Search by title or type..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-surface-100 rounded-xl focus:outline-none focus:border-brand-600 transition-all text-sm font-medium shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-surface-100 shadow-sm">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-surface-400 hover:text-surface-600'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-surface-400 hover:text-surface-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {isRecordsLoading ? (
                  <div className="py-32 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-600 mx-auto mb-4" />
                    <p className="text-surface-500 font-medium">Syncing records from blockchain...</p>
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div className="py-32 text-center">
                    <div className="w-20 h-20 bg-surface-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-surface-100">
                      <Clock className="w-10 h-10 text-surface-200" />
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 mb-2">
                        {activeTab === 'shared' ? 'No shared records found' : 'No records found'}
                    </h3>
                    <p className="text-surface-500 max-w-sm mx-auto mb-10 text-sm leading-relaxed font-medium">
                      {activeTab === 'shared' 
                        ? 'Documents shared with you by other wallet addresses will appear here.'
                        : 'Your vault is empty. Secure your first medical document on the blockchain.'}
                    </p>
                    {activeTab !== 'shared' && (
                        <button 
                        onClick={() => setIsUploadOpen(true)}
                        className="btn-secondary px-8"
                        >
                        Start Uploading
                        </button>
                    )}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                    <AnimatePresence mode="popLayout">
                      {filteredRecords.map((record) => (
                        <motion.div
                          key={record.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={viewMode === 'grid' ? "card-premium group relative flex flex-col h-full" : "flex items-center justify-between p-5 bg-white border border-surface-100 rounded-3xl hover:border-brand-200 transition-all shadow-soft group"}
                        >
                          <div className={viewMode === 'grid' ? "flex-1" : "flex items-center gap-6"}>
                            <div className={`p-4 rounded-2xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white mb-6 w-fit shadow-sm' : 'bg-brand-50 text-brand-600'}`}>
                              <FileText className="w-6 h-6" />
                            </div>
                            
                            <div>
                              <h3 className="font-bold text-surface-900 mb-1.5 group-hover:text-brand-600 transition-colors truncate pr-2">{record.title}</h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-surface-400 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(record.timestamp).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <HardDrive className="w-3 h-3" />
                                  {record.size}
                                </span>
                                {activeTab === 'shared' ? (
                                    <span className="flex items-center gap-1.5 text-indigo-600">
                                        <ShieldCheck className="w-3 h-3" />
                                        Owner: {formatAddress(record.owner)}
                                    </span>
                                ) : record.sharedWith && record.sharedWith.length > 0 && (
                                    <span className="flex items-center gap-1.5 text-brand-600">
                                        <Share2 className="w-3 h-3" />
                                        {record.sharedWith.length} Shared
                                    </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className={viewMode === 'grid' ? "mt-8 pt-6 border-t border-surface-50 flex items-center gap-3" : "flex items-center gap-3"}>
                            <button 
                              onClick={() => handleView(record)}
                              className="btn-secondary flex-1 py-2.5 text-[10px] tracking-widest uppercase font-bold"
                            >
                              View
                            </button>
                            {activeTab !== 'shared' && (
                                <button 
                                onClick={() => handleShare(record)}
                                className="btn-secondary p-2.5 text-brand-600 hover:bg-brand-50 border-brand-100"
                                >
                                <Share2 className="w-4 h-4" />
                                </button>
                            )}
                            {record.txHash && (
                                <a 
                                    href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100"
                                    title="View on Stellar Expert"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} record={selectedRecord} />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} record={selectedRecord} />
    </div>
  )
}
