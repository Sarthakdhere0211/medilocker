import React, { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { useWalletStore } from './store/useWalletStore'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { trackUserLogin, logActivity } from './lib/firebase'  // ✅ ADD logActivity

function App() {
  const { isConnected, checkConnection, publicKey } = useWalletStore()

  useEffect(() => {
    console.log("Checking wallet connection...")   // 🔍 LOG
    checkConnection()
  }, [checkConnection])

  useEffect(() => {
    if (isConnected && publicKey) {
      console.log("User connected:", publicKey)   // 🔍 LOG
      trackUserLogin(publicKey)

      // 🔥 OPTIONAL (VERY IMPRESSIVE)
      logActivity(publicKey, "APP_OPEN") 
    }
  }, [isConnected, publicKey])

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 font-sans">
      {!isConnected && <Navbar />}
      <main className="flex-grow flex flex-col">
        {isConnected ? <Dashboard /> : <LandingPage />}
      </main>
      {!isConnected && <Footer />}
    </div>
  )
}

export default App