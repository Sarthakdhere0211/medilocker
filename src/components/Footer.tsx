import React from 'react'
import { Shield, Github, Twitter, ExternalLink, Mail, ShieldCheck, Globe, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-950 border-t border-surface-100 dark:border-surface-900 pt-40 pb-20 px-8 relative overflow-hidden transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-24 mb-32">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
              <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-premium group-hover:bg-brand-500 transition-all duration-300 group-hover:rotate-6">
                <div className="w-7 h-7 border-[3px] border-white rounded-xl flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <span className="text-3xl font-black tracking-tighter text-surface-900 dark:text-surface-50">
                Medi<span className="text-brand-600">Locker</span>
              </span>
            </div>
            <p className="text-surface-500 dark:text-surface-400 max-w-sm mb-12 leading-relaxed text-lg font-medium">
              The definitive decentralized vault for medical history. 
              Built on Stellar for absolute privacy and cryptographic sovereignty.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Twitter className="w-6 h-6" />, href: "#" },
                { icon: <Github className="w-6 h-6" />, href: "#" },
                { icon: <Mail className="w-6 h-6" />, href: "#" }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href} 
                  className="w-14 h-14 bg-surface-50 dark:bg-surface-900 rounded-2xl flex items-center justify-center text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-surface-800 transition-all border border-surface-100 dark:border-surface-800 shadow-soft"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black text-surface-900 dark:text-surface-50 uppercase tracking-[0.3em] mb-10">Vault Protocol</h4>
            <ul className="space-y-6">
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest">Features</a></li>
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest">Security</a></li>
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest">Pricing</a></li>
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest">Consensus</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black text-surface-900 dark:text-surface-50 uppercase tracking-[0.3em] mb-10">Ecosystem</h4>
            <ul className="space-y-6">
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-2 uppercase tracking-widest">Stellar SDK <ExternalLink className="w-3.5 h-3.5 opacity-50" /></a></li>
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-2 uppercase tracking-widest">Soroban Docs <ExternalLink className="w-3.5 h-3.5 opacity-50" /></a></li>
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest">Privacy</a></li>
              <li><a href="#" className="text-sm font-black text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-widest">Terms</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="card-premium p-10 relative group overflow-hidden border-surface-100 dark:border-surface-800">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center border border-brand-100 dark:border-brand-900/50">
                  <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-[10px] font-black text-surface-900 dark:text-surface-50 uppercase tracking-[0.2em]">Verified Security</span>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed font-bold relative z-10">
                Our core smart contracts are open-source and anchored to the Stellar testnet ledger.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-100 dark:border-surface-900 pt-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <p className="text-surface-400 dark:text-surface-500 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} MediLocker Protocol. Immutable & Decentralized.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em]">
            <span>Powered by</span>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-soft">
              <Globe className="w-4 h-4 text-brand-600" />
              <span className="text-surface-900 dark:text-surface-50">Stellar Network</span>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
