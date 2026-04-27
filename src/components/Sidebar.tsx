import React from 'react'
import { LayoutDashboard, FileText, Share2, Shield, Settings, HelpCircle, LogOut, Clock } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { disconnect } = useWalletStore()

  const navItems = [
    { id: 'dashboard', label: 'Health Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'Secure Vault', icon: FileText },
    { id: 'timeline', label: 'Medical History', icon: Clock },
    { id: 'shared', label: 'Access Control', icon: Share2 },
    { id: 'security', label: 'Protocol Settings', icon: Shield },
  ]

  const bottomItems = [
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'help', label: 'Support Center', icon: HelpCircle },
  ]

  return (
    <aside className="w-80 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-r border-surface-100 dark:border-surface-800 flex flex-col h-screen sticky top-0 z-40 transition-all duration-500 shadow-sm overflow-hidden">
      {/* Brand Logo */}
      <div className="h-24 flex items-center px-8 border-b border-surface-50 dark:border-surface-800">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-premium group-hover:bg-brand-500 transition-all duration-300 group-hover:rotate-6">
            <div className="w-6 h-6 border-[3px] border-white rounded-xl flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <span className="text-2xl font-black text-surface-900 dark:text-surface-50 tracking-tighter">
            Medi<span className="text-brand-600">Locker</span>
          </span>
        </motion.div>
      </div>

      <div className="flex-1 py-10 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 mb-4 text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em]">Main Protocol</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black transition-all duration-300 group relative
                ${isActive 
                  ? 'text-brand-700 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20 shadow-sm' 
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-900'}
              `}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-600 text-white shadow-brand-600/20' : 'bg-transparent group-hover:bg-white dark:group-hover:bg-surface-800 group-hover:shadow-soft'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm tracking-tight">{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute right-4 w-1.5 h-6 bg-brand-600 dark:bg-brand-400 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}

        <div className="pt-10">
          <p className="px-4 mb-4 text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em]">Infrastructure</p>
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-900 hover:text-surface-900 dark:hover:text-surface-50 transition-all duration-300 group"
              >
                <div className="p-2 rounded-xl bg-transparent group-hover:bg-white dark:group-hover:bg-surface-800 group-hover:shadow-soft transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm tracking-tight">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 border-t border-surface-50 dark:border-surface-800 space-y-4">
        <div className="bg-surface-50 dark:bg-surface-900/50 p-4 rounded-2xl border border-surface-100 dark:border-surface-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Interface</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Online</span>
          </div>
        </div>
        
        <button
          onClick={disconnect}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-black text-surface-500 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
        >
          <div className="p-2 rounded-xl bg-transparent group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-sm tracking-tight">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
