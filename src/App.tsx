import React, { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { useWalletStore } from './store/useWalletStore'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

function App() {
  const { isConnected, checkConnection } = useWalletStore()

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

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
