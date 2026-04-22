import { Analytics } from "@vercel/analytics/react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import { seedProductionData } from './lib/firebase'

// Expose seeding script for one-time use
(window as any).seedMediLocker = seedProductionData;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" richColors />
    <Analytics />
  </React.StrictMode>,
)
