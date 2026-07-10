import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { DataProvider } from './context/DataContext'
import { TelephonyProvider } from './context/TelephonyContext'
import { registerSW } from './pwa'
import './index.css'

registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <DataProvider>
          <TelephonyProvider>
            <App />
          </TelephonyProvider>
        </DataProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
