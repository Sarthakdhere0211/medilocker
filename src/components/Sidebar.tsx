import React from 'react'
import { LayoutDashboard, FileText, Share2, Shield, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { disconnect } = useWalletStore()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'records', label: 'My Records', icon: <FileText className="w-5 h-5" /> },
    { id: 'shared', label: 'Shared Access', icon: <Share2 className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
  ]

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', label: 'Help Center', icon: <HelpCircle className="w-5 h-5" /> },
  ]

  return (
    <aside className="w-72 bg-white border-r border-surface-100 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-surface-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform">
            <div className="w-5 h-5 border-2 border-white rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <span className="text-xl font-black text-surface-900 tracking-tight">Medi<span className="text-brand-600">Locker</span></span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${activeTab === item.id 
                ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-100/50' 
                : 'text-surface-500 hover:bg-surface-50 hover:text-surface-900'}
            `}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-surface-50 space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-surface-500 hover:bg-surface-50 hover:text-surface-900 transition-all duration-200"
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
        <button
          onClick={disconnect}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    </aside>
  )
}
