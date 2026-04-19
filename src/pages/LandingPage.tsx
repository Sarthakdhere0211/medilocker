import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Share2, Database, ChevronRight, Wallet, CheckCircle2 } from 'lucide-react'
import { useWalletStore } from '../store/useWalletStore'
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
      title: 'Secure & Private',
      description: 'Encrypted storage ensures your sensitive medical data remains private and secure.',
      icon: <Lock className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Full Ownership',
      description: 'You hold the keys to your records. No third-party access without your direct consent.',
      icon: <Shield className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Easy Sharing',
      description: 'Instantly grant access to healthcare providers using their public wallet address.',
      icon: <Share2 className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Tamper-Proof',
      description: 'Every record reference is stored on the Stellar blockchain, ensuring data integrity.',
      icon: <Database className="w-6 h-6 text-brand-600" />
    }
  ]

  return (
    <div className="bg-surface-50 min-h-screen">
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.span 
              variants={itemVariants}
              className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full border border-brand-100 mb-8"
            >
              Real-World Decentralized Health Records
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-surface-900 tracking-tight mb-8"
            >
              Your medical history,<br />
              <span className="gradient-text">owned by you</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-surface-600 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              A secure, decentralized vault for your health data. Connect your wallet, 
              upload your records, and maintain full control over who sees your history.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={() => setIsWalletModalOpen(true)}
                className="btn-primary flex items-center gap-2 group w-full sm:w-auto px-8 py-4"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsWalletModalOpen(true)}
                className="btn-secondary flex items-center gap-2 w-full sm:w-auto px-8 py-4"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-brand-100/30 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-white border-y border-surface-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">Why MediLocker?</h2>
            <p className="text-surface-600">Built for security, privacy, and ease of use.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="card-premium group"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">{feature.title}</h3>
                <p className="text-surface-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-surface-900 mb-8 leading-tight">
                Simple steps to secure your medical future
              </h2>
              <div className="space-y-10">
                {[
                  { 
                    title: 'Connect Wallet', 
                    desc: 'Securely link your Freighter wallet to establish your identity.', 
                    icon: <Wallet className="w-5 h-5" /> 
                  },
                  { 
                    title: 'Upload Records', 
                    desc: 'Upload PDFs or images. Metadata is stored securely on-chain for 5 XLM.', 
                    icon: <CheckCircle2 className="w-5 h-5" /> 
                  },
                  { 
                    title: 'Manage Access', 
                    desc: 'Grant or revoke access to doctors instantly with a click.', 
                    icon: <Share2 className="w-5 h-5" /> 
                  }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-soft">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-surface-900 mb-1">{step.title}</h4>
                      <p className="text-surface-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-[40px] shadow-premium border border-surface-100 p-8 md:p-12 relative z-10">
                <div className="space-y-6">
                  <div className="h-12 bg-surface-50 rounded-2xl animate-pulse w-3/4" />
                  <div className="h-32 bg-surface-50 rounded-3xl animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-10 bg-brand-100/50 rounded-xl flex-1" />
                    <div className="h-10 bg-brand-100/50 rounded-xl flex-1" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-200/40 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-indigo-200/40 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
