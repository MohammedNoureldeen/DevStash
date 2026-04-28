'use client'

import { useState } from 'react'
import TopBar from './TopBar'
import Sidebar, { type SidebarData } from './Sidebar'
import NewItemDialog from '@/src/components/items/NewItemDialog'
import NewCollectionDialog from '@/src/components/collections/NewCollectionDialog'
import type { Session } from 'next-auth'

type SidebarUser = Session['user'] | null

export default function DashboardShell({
  children,
  sidebarData,
  user,
}: {
  children: React.ReactNode
  sidebarData: SidebarData
  user: SidebarUser
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [newItemOpen, setNewItemOpen] = useState(false)
  const [newCollectionOpen, setNewCollectionOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <NewItemDialog open={newItemOpen} onOpenChange={setNewItemOpen} />
      <NewCollectionDialog open={newCollectionOpen} onOpenChange={setNewCollectionOpen} />
      <TopBar
        onMobileMenuClick={() => setMobileOpen(true)}
        onNewItem={() => setNewItemOpen(true)}
        onNewCollection={() => setNewCollectionOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggle={() => setCollapsed(prev => !prev)}
          onMobileClose={() => setMobileOpen(false)}
          sidebarData={sidebarData}
          user={user}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
