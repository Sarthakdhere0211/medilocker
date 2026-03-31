import React from 'react'
import { Shield, Github, Twitter, ExternalLink, Mail, ShieldCheck } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-surface-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-soft">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-surface-900">
                Medi<span className="text-brand-600">Locker</span>
              </span>
            </div>
            <p className="text-surface-500 max-w-sm mb-8 leading-relaxed text-sm font-medium">
              Empowering individuals with full ownership of their medical records through 
              decentralized identity and secure blockchain technology on the Stellar network.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-surface-900 uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors">Security</a></li>
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-surface-900 uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors flex items-center gap-2">Stellar SDK <ExternalLink className="w-3.5 h-3.5 opacity-50" /></a></li>
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors flex items-center gap-2">Soroban Docs <ExternalLink className="w-3.5 h-3.5 opacity-50" /></a></li>
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm font-semibold text-surface-500 hover:text-brand-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="bg-surface-50 rounded-3xl p-6 border border-surface-100">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span className="text-xs font-bold text-surface-900 uppercase tracking-wider">Verified Security</span>
              </div>
              <p className="text-xs text-surface-500 leading-relaxed font-medium">
                Our smart contracts are audited and open-source on the Stellar testnet.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-50 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-surface-400 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} MediLocker. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-widest">
            <span>Powered by</span>
            <span className="text-surface-900">Stellar Blockchain</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
