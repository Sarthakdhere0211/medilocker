import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Share2, Database, ChevronRight, Wallet, CheckCircle2, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react'
import { WalletModal } from '../components/WalletModal'

export const LandingPage = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  const features = [
    {
      title: 'Quantum Privacy',
      description: 'Encrypted storage ensures your sensitive medical data remains private and secure.',
      icon: <Lock className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Full Sovereignty',
      description: 'You hold the keys to your records. No third-party access without your direct consent.',
      icon: <Shield className="w-6 h-6" />,
      color: 'brand'
    },
    {
      title: 'Instant Exchange',
      description: 'Instantly grant access to healthcare providers using their public wallet address.',
      icon: <Share2 className="w-6 h-6" />,
      color: 'emerald'
    },
    {
      title: 'Immutable Proof',
      description: 'Every record reference is stored on the Stellar blockchain, ensuring data integrity.',
      icon: <Database className="w-6 h-6" />,
      color: 'purple'
    }
  ]

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen selection:bg-brand-100 selection:text-brand-900 transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none" />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center relative z-10"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white dark:bg-surface-900 text-brand-700 dark:text-brand-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-brand-100 dark:border-brand-900/50 shadow-soft">
                <div className="w-2 h-2 bg-brand-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
                Next-Gen Medical Infrastructure
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-9xl font-black text-surface-900 dark:text-surface-50 tracking-tighter mb-10 leading-[0.85] md:leading-[0.8]"
            >
              Medical history,<br />
              <span className="gradient-text">fully sovereign.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-surface-500 dark:text-surface-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
            >
              A high-fidelity decentralized vault for your health data. 
              Built on the Stellar network for speed, security, and absolute privacy.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWalletModalOpen(true)}
                className="btn-primary px-12 py-6 text-sm group"
              >
                Enter the Vault
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWalletModalOpen(true)}
                className="btn-secondary px-12 py-6 text-sm group"
              >
                <Wallet className="w-5 h-5 group-hover:text-brand-600 transition-colors" />
                Connect Wallet
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={itemVariants}
              className="mt-32 pt-12 border-t border-surface-100 dark:border-surface-800 flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
            >
              <div className="flex items-center gap-3 text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em]">
                <Globe className="w-5 h-5" />
                Stellar Network
              </div>
              <div className="flex items-center gap-3 text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em]">
                <ShieldCheck className="w-5 h-5" />
                Soroban Smart Contracts
              </div>
              <div className="flex items-center gap-3 text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.2em]">
                <Zap className="w-5 h-5" />
                Instant Consensus
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-6 bg-white dark:bg-surface-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50/10 dark:bg-brand-900/5 skew-x-12 translate-x-1/2 -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-6xl font-black text-surface-900 dark:text-surface-50 mb-8 tracking-tight">Vault Protocol</h2>
            <p className="text-xl text-surface-500 dark:text-surface-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Engineered for healthcare's most demanding privacy requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="card-premium group"
              >
                <div className={`w-16 h-16 bg-surface-50 dark:bg-surface-800 rounded-[1.25rem] flex items-center justify-center mb-10 text-brand-600 dark:text-brand-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:rotate-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-surface-900 dark:text-surface-50 mb-4 tracking-tight leading-tight group-hover:text-brand-600 transition-colors">{feature.title}</h3>
                <p className="text-surface-500 dark:text-surface-400 leading-relaxed text-base font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-1 bg-brand-600 rounded-full mb-10" />
              <h2 className="text-6xl md:text-7xl font-black text-surface-900 dark:text-surface-50 mb-14 leading-[0.9] tracking-tight">
                Secure your medical future in three steps.
              </h2>
              <div className="space-y-14">
                {[
                  { 
                    title: 'Establish Identity', 
                    desc: 'Securely link your Freighter wallet to establish your unique blockchain medical ID.', 
                    icon: <Wallet className="w-6 h-6" /> 
                  },
                  { 
                    title: 'Anchor Records', 
                    desc: 'Upload records to the vault. Metadata is permanently anchored on the global ledger.', 
                    icon: <CheckCircle2 className="w-6 h-6" /> 
                  },
                  { 
                    title: 'Govern Access', 
                    desc: 'Grant or revoke access to providers instantly using real-time smart contracts.', 
                    icon: <Share2 className="w-6 h-6" /> 
                  }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-10 group">
                    <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center font-black text-2xl shadow-soft group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                      {idx + 1}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-2xl font-black text-surface-900 dark:text-surface-50 mb-3 tracking-tight group-hover:text-brand-600 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-surface-500 dark:text-surface-400 text-lg leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white dark:bg-surface-900 rounded-[4rem] shadow-premium border border-surface-100 dark:border-surface-800 p-12 md:p-20 relative z-10 group overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-50 dark:bg-surface-800 rounded-xl animate-pulse" />
                    <div className="h-6 bg-surface-50 dark:bg-surface-800 rounded-full animate-pulse w-1/2" />
                  </div>
                  <div className="h-48 bg-surface-50 dark:bg-surface-800 rounded-[2.5rem] animate-pulse" />
                  <div className="flex gap-6">
                    <div className="h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex-1 border border-brand-100/50 dark:border-brand-900/30" />
                    <div className="h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex-1 border border-brand-100/50 dark:border-brand-900/30" />
                  </div>
                  <div className="h-16 bg-brand-600 rounded-2xl w-full shadow-premium shadow-brand-600/20" />
                </div>
              </div>
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-brand-100/30 dark:bg-brand-900/10 blur-[120px] rounded-full -z-10 animate-pulse" />
              <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-teal-100/20 dark:bg-teal-900/5 blur-[120px] rounded-full -z-10 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="py-40 px-6 bg-surface-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight leading-none">
            Ready to reclaim <span className="text-brand-400">your health data?</span>
          </h2>
          <p className="text-surface-400 text-xl mb-16 font-medium leading-relaxed">
            Join the decentralized health revolution. Establish your vault today.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWalletModalOpen(true)}
            className="btn-primary px-16 py-8 text-lg"
          >
            Connect Wallet & Launch
          </motion.button>
        </div>
      </section>
    </div>
  )
}
