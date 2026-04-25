import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  Share2, 
  Calendar, 
  HardDrive, 
  Trash2, 
  Search, 
  LayoutGrid, 
  List, 
  ShieldCheck,
  ExternalLink,
  Wallet,
  Clock,
  Loader2,
  Upload,
  Activity,
  Users,
  ArrowRight
} from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'
import { useRecordStore, RecordType } from '../store/useRecordStore'
import { fetchOnChainRecordIds } from '../lib/stellar'
import { UploadModal } from '../components/UploadModal'
import { ShareModal } from '../components/ShareModal'
import { PreviewModal } from '../components/PreviewModal'
import { Sidebar } from '../components/Sidebar'
import { fetchAnalyticsData, fetchRecentActivity, seedProductionData, fetchIndexedRecords, approveRecord, isDemoConfig } from '../lib/firebase'
import { toast } from 'sonner'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-none min-w-[120px]">
        <p className="text-sm font-bold text-slate-900 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#14B8A6]">
          users: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  const { publicKey, balance, disconnect, fetchBalance } = useWalletStore()
  const { records, sharedRecords, setRecords, setLoading, isLoading: isRecordsLoading } = useRecordStore()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalRecords: 0, totalTransactions: 0, dau: [] as any[] })
  const [liveDau, setLiveDau] = useState<any[]>([])
  const [isMetricsLoading, setIsMetricsLoading] = useState(true)
  const [activityLogs, setActivityLogs] = useState<any[]>([])

  // Simulate live updates for DAU
  useEffect(() => {
    if (metrics.dau.length > 0) {
      setLiveDau(metrics.dau.map(d => ({ ...d, users: d.count })))
    } else {
      // Fallback/Initial data if metrics aren't loaded yet
      const initialData = [
        { date: "04/14", users: 22 },
        { date: "04/15", users: 28 },
        { date: "04/16", users: 25 },
        { date: "04/17", users: 35 },
        { date: "04/18", users: 32 },
        { date: "04/19", users: 38 },
        { date: "04/20", users: 34 }
      ]
      setLiveDau(initialData)
    }
  }, [metrics.dau])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDau(current => {
        return current.map((item, index) => {
          // Only fluctuate the last few points to make it look "live"
          if (index >= current.length - 2) {
            const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
            const newValue = Math.max(10, Math.min(45, item.users + change))
            return { ...item, users: newValue }
          }
          return item
        })
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadMetrics = async () => {
    setIsMetricsLoading(true)
    try {
      if (publicKey) {
        await fetchBalance(publicKey)
      }
      const analytics = await fetchAnalyticsData()
      const logs = await fetchRecentActivity(8)
      setMetrics(analytics as any)
      setActivityLogs(logs)
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err)
    } finally {
      setIsMetricsLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [publicKey])

  useEffect(() => {
    const loadAndSyncRecords = async () => {
      if (!publicKey) return
      
      setLoading(true)
      try {
        const onChainIds = await fetchOnChainRecordIds(publicKey)
        const indexedRecords = await fetchIndexedRecords(publicKey)
        const syncedRecords = (indexedRecords as RecordType[]).filter((r: RecordType) => onChainIds.includes(r.id))
        setRecords(syncedRecords)

        if (syncedRecords.length > 0) {
            const analytics = await fetchAnalyticsData()
            if (analytics.totalRecords < syncedRecords.length) {
                loadMetrics()
            }
        }
      } catch (error) {
        console.error('Failed to sync records:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAndSyncRecords()
  }, [publicKey, setRecords, setLoading])

  const myRecords = records.filter((r: RecordType) => r.owner === publicKey)
  const displayRecords = activeTab === 'shared' ? sharedRecords : myRecords

  const filteredRecords = displayRecords.filter((r: RecordType) => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleShare = (record: RecordType) => {
    setSelectedRecord(record)
    setIsShareOpen(true)
  }

  const handleApprove = async (record: RecordType) => {
    if (!publicKey) return;
    
    const loadingToast = toast.loading('Processing approval...');
    try {
      const updated = await approveRecord(record.id, publicKey, record.owner || publicKey);
      if (updated) {
        const updatedRecords = records.map((r: RecordType) => r.id === record.id ? { ...r, ...updated } : r);
        setRecords(updatedRecords);
        toast.success((updated.status || "pending") === 'approved' ? 'Record fully approved!' : 'Approval recorded', { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve record', { id: loadingToast });
    }
  };

  const handleView = (record: RecordType) => {
    setSelectedRecord(record)
    setIsPreviewOpen(true)
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-6)}`

  const renderTimeline = () => {
    const sortedRecords = [...myRecords].sort((a: RecordType, b: RecordType) => b.timestamp - a.timestamp);
    
    if (sortedRecords.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-surface-900/50 rounded-[3rem] border border-dashed border-surface-200 dark:border-surface-800 relative overflow-hidden backdrop-blur-sm"
        >
          <div className="w-24 h-24 bg-surface-50 dark:bg-surface-800 rounded-full flex items-center justify-center mb-8 relative">
            <Calendar className="w-10 h-10 text-surface-200 dark:text-surface-600" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-8 h-8 bg-white dark:bg-surface-700 rounded-full shadow-soft flex items-center justify-center border border-surface-100 dark:border-surface-600"
            >
              <Clock className="w-4 h-4 text-brand-400" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight">No Records Yet</h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-xs text-center font-medium leading-relaxed mb-10">
            Your medical history will appear here once you upload your first record to the blockchain.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Upload First Record
          </motion.button>
        </motion.div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="relative border-l-2 border-brand-100 dark:border-brand-900/30 ml-4 space-y-12">
          {sortedRecords.map((record: RecordType, index: number) => (
            <div key={record.id} className="relative pl-12">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white dark:bg-surface-950 border-4 border-brand-600 rounded-full z-10 shadow-soft" />
              
              <div className="absolute -left-40 top-0 w-32 text-right hidden md:block">
                <p className="text-sm font-black text-surface-900 dark:text-surface-50">{new Date(record.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                <p className="text-[10px] text-surface-400 font-black uppercase tracking-widest">{new Date(record.timestamp).getFullYear()}</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-50 dark:bg-surface-800 rounded-2xl flex items-center justify-center text-brand-600 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-all duration-500 group-hover:scale-110">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-surface-900 dark:text-surface-50 mb-2 group-hover:text-brand-600 transition-colors tracking-tight leading-tight">{record.title}</h3>
                      <div className="flex items-center gap-4">
                        <span className="px-2.5 py-1 bg-surface-100 dark:bg-surface-800 text-[10px] font-black text-surface-500 dark:text-surface-400 rounded-lg uppercase tracking-widest">{record.fileType}</span>
                        <span className="text-[10px] text-surface-400 font-black uppercase tracking-widest">{record.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(record)}
                      className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all border border-transparent hover:border-brand-100 dark:hover:border-brand-900/50"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleShare(record)}
                      className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all border border-transparent hover:border-brand-100 dark:hover:border-brand-900/50"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-surface-50 dark:border-surface-800 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Anchored</p>
                    </div>
                    
                    {(record.status || "pending") === 'approved' ? (
                      <div className="status-badge-approved flex items-center gap-1.5 shadow-sm shadow-green-500/10">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="status-badge-pending flex items-center gap-1.5 shadow-sm shadow-amber-500/10">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending ({record.approvalCount || 0}/2)</span>
                      </div>
                    )}
                  </div>
                  
                  {record.txHash && (
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${record.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-surface-400 hover:text-brand-600 transition-colors flex items-center gap-2 uppercase tracking-widest bg-surface-50 dark:bg-surface-800 px-3 py-1.5 rounded-lg border border-surface-100 dark:border-surface-700"
                    >
                      Explorer Proof <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen flex selection:bg-brand-100 selection:text-brand-900 transition-colors duration-500 font-sans">
      <div className="fixed inset-0 bg-mesh opacity-40 pointer-events-none" />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-24 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800 flex items-center justify-between px-10 shrink-0 sticky top-0 z-30 transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-1 h-8 bg-brand-600 rounded-full" />
              <h2 className="text-2xl font-black text-surface-900 dark:text-surface-50 capitalize tracking-tight">
                {activeTab.replace('-', ' ')}
              </h2>
            </motion.div>
          </div>

          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex items-center gap-4 px-5 py-2.5 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-soft transition-all hover:shadow-premium group cursor-pointer"
            >
              <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/50 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest leading-none mb-1.5">Network Balance</p>
                <p className="text-base font-black text-surface-900 dark:text-surface-50 leading-none tracking-tight">{balance} <span className="text-brand-600 text-xs ml-0.5">XLM</span></p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4 pl-8 border-l border-surface-100 dark:border-surface-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-surface-900 dark:text-surface-50 leading-none mb-1.5 tracking-tight">
                  {formatAddress(publicKey!)}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Verified Node</p>
                </div>
              </div>
              <button 
                onClick={disconnect}
                className="w-12 h-12 flex items-center justify-center rounded-2xl text-surface-400 dark:text-surface-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-surface-100 dark:border-surface-800 hover:border-red-100 dark:hover:border-red-900/50 active:scale-90"
                title="Secure Sign Out"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-brand-600 font-black text-[10px] uppercase tracking-[0.2em]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Stellar Secure Protocol
                </motion.div>
                <motion.h1 
                  layout
                  className="text-5xl font-black text-surface-900 dark:text-surface-50 tracking-tight"
                >
                  {activeTab === 'dashboard' ? 'Health Dashboard' : activeTab === 'shared' ? 'Access Control' : 'Secure Vault'}
                </motion.h1>
                <p className="text-surface-500 dark:text-surface-400 font-medium text-lg max-w-2xl">
                  {activeTab === 'dashboard' 
                    ? 'Monitor your medical interactions and blockchain activity in real-time.' 
                    : activeTab === 'shared' 
                    ? 'Manage permissions and view medical records shared with your address.'
                    : 'Manage your cryptographically secured medical records on the Stellar network.'}
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUploadOpen(true)}
                  className="btn-primary px-8 py-5 h-auto text-sm"
                >
                  <Plus className="w-5 h-5" />
                  Secure Upload
                </motion.button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dashboard-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12 mb-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { label: 'My Records', value: myRecords.length, icon: FileText, color: 'text-brand-600', bg: 'bg-brand-50' },
                      { label: 'Network Users', value: metrics.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Verified Proofs', value: metrics.totalRecords, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Ledger Operations', value: metrics.totalTransactions, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' }
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        whileHover={{ y: -5 }}
                        className="card-premium group"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 ${stat.bg} dark:bg-surface-800 rounded-2xl flex items-center justify-center ${stat.color} transition-all duration-500 group-hover:scale-110`}>
                            <stat.icon className="w-7 h-7" />
                          </div>
                          <div className="p-1 bg-surface-50 dark:bg-surface-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 text-surface-400" />
                          </div>
                        </div>
                        <p className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                        <h3 className="text-3xl font-black text-surface-900 dark:text-surface-50 tracking-tight leading-none">
                          {isMetricsLoading ? (
                            <div className="w-16 h-8 bg-surface-100 dark:bg-surface-800 animate-pulse rounded-lg" />
                          ) : stat.value}
                        </h3>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#F8FAFC] dark:bg-surface-900 rounded-[16px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col h-[450px]">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-surface-50 tracking-tight">Network Activity</h3>
                          <p className="text-sm text-slate-400 font-medium">Daily active users (DAU) last 7 days</p>
                        </div>
                        <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                          LIVE DATA
                        </div>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            data={liveDau} 
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
                            <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}}
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}}
                              domain={[0, 50]}
                              dx={-10}
                            />
                            <Tooltip 
                              content={<CustomTooltip />} 
                              cursor={{ stroke: '#E2E8F0', strokeWidth: 1.5 }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="users" 
                              stroke="#14B8A6" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorUsers)" 
                              isAnimationActive={true}
                              animationDuration={1500}
                              animationEasing="ease-in-out"
                              activeDot={{ 
                                r: 6, 
                                fill: '#0D9488', 
                                stroke: '#fff', 
                                strokeWidth: 2,
                                shadow: '0 0 10px rgba(13, 148, 136, 0.5)'
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="card-premium flex flex-col h-[500px]">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-black text-surface-900 dark:text-surface-50 tracking-tight">Audit Log</h3>
                          <p className="text-sm font-bold text-surface-400">Latest network events</p>
                        </div>
                        <div className="p-2 bg-surface-50 dark:bg-surface-800 rounded-xl text-surface-400">
                          <Activity className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {activityLogs.length > 0 ? activityLogs.map((log, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            className="flex gap-4 p-4 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all group cursor-default border border-transparent hover:border-surface-100 dark:hover:border-surface-700"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-surface-50 dark:bg-surface-800 text-surface-400 group-hover:bg-brand-50 group-hover:text-brand-600`}>
                              {log.type === 'upload' ? <Upload className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-black text-surface-900 dark:text-surface-50 leading-tight mb-1 group-hover:text-brand-600 transition-colors">
                                {log.title || log.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                                  {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="w-1 h-1 bg-surface-200 rounded-full" />
                                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Verified</span>
                              </div>
                            </div>
                          </motion.div>
                        )) : (
                          <div className="flex flex-col items-center justify-center h-full text-center py-10">
                            <Clock className="w-12 h-12 text-surface-200 mb-4" />
                            <p className="text-sm text-surface-400 font-bold uppercase tracking-widest">No recent events</p>
                          </div>
                        )}
                      </div>
                      <button className="w-full mt-6 py-4 bg-surface-50 dark:bg-surface-800 rounded-2xl text-[10px] font-black text-surface-500 uppercase tracking-widest hover:bg-brand-50 hover:text-brand-600 transition-all border border-surface-100 dark:border-surface-700">
                        View Full Ledger
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {(activeTab === 'vault' || activeTab === 'shared') && (
                <motion.div 
                  key="vault-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10 mb-12"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full sm:w-96 group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-brand-600 transition-colors z-10" />
                      <input 
                        type="text"
                        placeholder="Search records by title or hash..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-premium pl-16"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-soft">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-brand-600 text-white shadow-brand-600/20' : 'text-surface-400 hover:text-surface-600 hover:bg-surface-50'}`}
                      >
                        <LayoutGrid className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-brand-600 text-white shadow-brand-600/20' : 'text-surface-400 hover:text-surface-600 hover:bg-surface-50'}`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {activeTab === 'vault' && renderTimeline()}
                  
                  <div className="space-y-6">
                    {activeTab !== 'vault' && (
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-surface-900 dark:text-surface-50 tracking-tight">
                          {activeTab === 'shared' ? 'Shared with Me' : 'Vault Storage'}
                        </h3>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                          {filteredRecords.length} Items Found
                        </p>
                      </div>
                    )}

                    {isRecordsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="card-premium h-64 animate-pulse bg-white/50" />
                        ))}
                      </div>
                    ) : filteredRecords.length > 0 ? (
                      <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                        : "flex flex-col gap-6"
                      }>
                        {filteredRecords.map((record: RecordType, i: number) => (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`${viewMode === 'grid' ? 'card-premium' : 'bg-white dark:bg-surface-900 p-6 rounded-2xl border border-surface-100 dark:border-surface-800 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group'}`}
                          >
                            <div className={`${viewMode === 'grid' ? 'flex flex-col h-full' : 'flex-1 flex items-center gap-6'}`}>
                              <div className={`${viewMode === 'grid' ? 'flex justify-between items-start mb-8' : 'flex items-center gap-6 shrink-0'}`}>
                                <div className={`w-16 h-16 bg-surface-50 dark:bg-surface-800 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-50 transition-all duration-500`}>
                                  <FileText className="w-8 h-8" />
                                </div>
                                {viewMode === 'grid' && (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleView(record)}
                                      className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all border border-transparent hover:border-brand-100 dark:hover:border-brand-900/50"
                                    >
                                      <ExternalLink className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-black text-surface-900 dark:text-surface-50 mb-2 tracking-tight group-hover:text-brand-600 transition-colors truncate">{record.title}</h4>
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                  <span className="px-2.5 py-1 bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 text-[10px] font-black rounded-lg uppercase tracking-widest">{record.fileType}</span>
                                  <span className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">{record.size}</span>
                                  <span className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">{new Date(record.timestamp).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className={`${viewMode === 'grid' ? 'mt-auto pt-8 border-t border-surface-50 dark:border-surface-800 flex items-center justify-between' : 'flex items-center gap-4'}`}>
                                <div className="flex items-center gap-3">
                                  {(record.status || "pending") === 'approved' ? (
                                    <div className="status-badge-approved flex items-center gap-1.5 shadow-sm shadow-green-500/10">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>Verified</span>
                                    </div>
                                  ) : (
                                    <div className="status-badge-pending flex items-center gap-1.5 shadow-sm shadow-amber-500/10">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{record.approvalCount || 0}/2 Signs</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {viewMode === 'list' && (
                                    <button 
                                      onClick={() => handleView(record)}
                                      className="px-4 py-2 text-[10px] font-black text-surface-500 uppercase tracking-widest hover:text-brand-600 transition-colors"
                                    >
                                      Open Document
                                    </button>
                                  )}
                                  
                                  {activeTab !== 'shared' && (
                                    <button 
                                      onClick={() => handleShare(record)}
                                      className="p-2.5 bg-surface-50 dark:bg-surface-800 text-surface-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all border border-surface-100 dark:border-surface-800 hover:border-brand-100 dark:hover:border-brand-900/50"
                                      title="Share Document"
                                    >
                                      <Share2 className="w-5 h-5" />
                                    </button>
                                  )}

                                  {activeTab === 'shared' && (record.approvals || []).indexOf(publicKey!) === -1 && (
                                    <button 
                                      onClick={() => handleApprove(record)}
                                      className="p-2.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-600 hover:text-white rounded-xl transition-all border border-brand-100 dark:border-brand-900/50 shadow-sm"
                                      title="Approve Record"
                                    >
                                      <ShieldCheck className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-surface-900/50 rounded-[3rem] border border-dashed border-surface-200 dark:border-surface-800 backdrop-blur-sm">
                        <div className="w-24 h-24 bg-surface-50 dark:bg-surface-800 rounded-full flex items-center justify-center mb-8">
                          <Search className="w-10 h-10 text-surface-200 dark:text-surface-700" />
                        </div>
                        <h3 className="text-2xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight">No records found</h3>
                        <p className="text-surface-500 dark:text-surface-400 font-medium max-w-sm text-center leading-relaxed">
                          {searchQuery ? `We couldn't find any records matching "${searchQuery}"` : "You haven't uploaded any medical records to your vault yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {renderTimeline()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      {selectedRecord && (
        <>
          <ShareModal 
            isOpen={isShareOpen} 
            onClose={() => setIsShareOpen(false)} 
            record={selectedRecord} 
          />
          <PreviewModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            record={selectedRecord} 
          />
        </>
      )}
    </div>
  )
}
