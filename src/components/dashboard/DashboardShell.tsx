'use client'

import { useState } from 'react'
import TopBar from './TopBar'
import Sidebar, { type SidebarData } from './Sidebar'

export default function DashboardShell({ children, sidebarData }: { children: React.ReactNode; sidebarData: SidebarData }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopBar onMobileMenuClick={() => setMobileOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggle={() => setCollapsed(prev => !prev)}
          onMobileClose={() => setMobileOpen(false)}
          sidebarData={sidebarData}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
