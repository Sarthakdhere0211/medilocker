import React, { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { useWalletStore } from './store/useWalletStore'
import { useThemeStore } from './store/useThemeStore'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { trackUserLogin, logActivity } from './lib/firebase'

function App() {
  const { isConnected, publicKey } = useWalletStore()
  const { isDarkMode } = useThemeStore()

  useEffect(() => {
    // Sync document class with stored theme on mount
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (isConnected && publicKey) {
      console.log("User connected:", publicKey)   // 🔍 LOG
      trackUserLogin(publicKey)

      // 🔥 OPTIONAL (VERY IMPRESSIVE)
      logActivity(publicKey, "APP_OPEN") 
    }
  }, [isConnected, publicKey])

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 font-sans transition-colors duration-300">
      {!isConnected && <Navbar />}
      <main className="flex-grow flex flex-col">
        {isConnected ? <Dashboard /> : <LandingPage />}
      </main>
      {!isConnected && <Footer />}
    </div>
  )
}

export default App