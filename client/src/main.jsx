import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Get Clerk publishable key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    console.warn('Missing Clerk Publishable Key - Auth features will be disabled')
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {PUBLISHABLE_KEY ? (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <App />
            </ClerkProvider>
        ) : (
            <App />
        )}
    </React.StrictMode>,
)
