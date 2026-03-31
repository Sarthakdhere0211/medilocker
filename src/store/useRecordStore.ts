import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Record {
  id: string
  title: string
  fileHash: string
  fileUrl?: string // CRITICAL: URL for off-chain storage (IPFS/Blob)
  owner: string
  timestamp: number
  fileType: string
  size: string
  txHash?: string // Added to store transaction hash
  sharedWith?: string[]
}

interface RecordState {
  records: Record[]
  sharedRecords: Record[]
  isLoading: boolean
  addRecord: (record: Record) => void
  setRecords: (records: Record[]) => void
  setLoading: (loading: boolean) => void
  shareRecord: (recordId: string, address: string) => void
  addSharedRecord: (record: Record) => void
}

// Hybrid Storage: Use Zustand Persist for off-chain data + Blockchain for IDs
export const useRecordStore = create<RecordState>()(
  persist(
    (set) => ({
      records: [],
      sharedRecords: [],
      isLoading: false,
      addRecord: (record) => set((state) => ({ records: [record, ...state.records] })),
      setRecords: (records) => set({ records }),
      setLoading: (loading) => set({ isLoading: loading }),
      shareRecord: (recordId, address) => set((state) => ({
        records: state.records.map(r => 
          r.id === recordId 
            ? { ...r, sharedWith: [...(r.sharedWith || []), address] } 
            : r
        )
      })),
      addSharedRecord: (record) => set((state) => ({ sharedRecords: [record, ...state.sharedRecords] })),
    }),
    {
      name: 'medilocker-vault-offchain', // Hybrid off-chain storage
    }
  )
)
