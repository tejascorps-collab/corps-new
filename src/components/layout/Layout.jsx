import { useState, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from './BottomNav'
import InstallBanner from './InstallBanner'
import ToastHost from '../notifications/ToastHost'
import ChatWidget from '../support/ChatWidget'
import PageLoader from '../ui/PageLoader'

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] animate-fade-in px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-6">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Global overlays */}
      <ToastHost />
      <ChatWidget />
      <InstallBanner />
      <BottomNav onMore={() => setOpen(true)} />
    </div>
  )
}
