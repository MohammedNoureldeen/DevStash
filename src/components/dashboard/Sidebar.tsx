'use client'

import Link from 'next/link'
import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Clock, ChevronLeft, ChevronRight,
  X, FolderOpen, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockUser } from '@/src/lib/mock-data'
import { Button } from '@/components/ui/button'
import type { ItemTypeWithCount } from '@/src/lib/db/items'
import type { FavoriteCollection, CollectionWithDetails } from '@/src/lib/db/collections'

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
}

const PLURAL_MAP: Record<string, string> = {
  snippet: 'snippets',
  prompt: 'prompts',
  note: 'notes',
  command: 'commands',
  link: 'links',
  file: 'files',
  image: 'images',
}

export type SidebarData = {
  itemTypes: ItemTypeWithCount[]
  favoriteCollections: FavoriteCollection[]
  recentCollections: CollectionWithDetails[]
}

interface SidebarContentProps {
  collapsed: boolean
  onToggle: () => void
  onClose?: () => void
  isMobile?: boolean
  sidebarData: SidebarData
}

function SidebarContent({ collapsed, onToggle, onClose, isMobile = false, sidebarData }: SidebarContentProps) {
  const show = !collapsed || isMobile
  const { itemTypes, favoriteCollections, recentCollections } = sidebarData

  const userInitials = mockUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border shrink-0',
        !show && 'justify-center px-3'
      )}>
        {isMobile ? (
          <>
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" className="ml-auto h-9 w-9 rounded-lg hover:bg-sidebar-accent" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            {show && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn('h-8 w-8 rounded-lg hover:bg-sidebar-accent', show ? 'ml-auto' : 'mx-auto')}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">

        {/* Item Types */}
        <nav className="mb-6">
          {show && <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</p>}
          <div className="space-y-1">
            {itemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? File
              const slug = PLURAL_MAP[type.name] ?? `${type.name}s`

              return (
                <Link
                  key={type.id}
                  href={`/items/${slug}`}
                  title={!show ? `${type.name}s` : undefined}
                  className={cn(
                    'sidebar-item flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground',
                    !show && 'justify-center'
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: `${type.color}15` }}>
                    <Icon className="h-4 w-4" style={{ color: type.color }} />
                  </div>
                  {show && (
                    <>
                      <span className="flex-1 capitalize">{type.name}s</span>
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{type.count}</span>
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Favorites */}
        {favoriteCollections.length > 0 && (
          <nav className="mb-6">
            <div className={cn('flex items-center gap-2 px-2 mb-2', !show && 'justify-center mb-0')}>
              <Star className="h-4 w-4 text-muted-foreground shrink-0" />
              {show && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favorites</p>}
            </div>
            {show && (
              <div className="space-y-1">
                {favoriteCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="sidebar-item flex items-center gap-3 px-3 py-2 text-sm"
                  >
                    <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{col.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        )}

        {/* Recent */}
        {recentCollections.length > 0 && (
          <nav>
            <div className={cn('flex items-center gap-2 px-2 mb-2', !show && 'justify-center mb-0')}>
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              {show && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>}
            </div>
            {show && (
              <div className="space-y-1">
                {recentCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="sidebar-item flex items-center gap-3 px-3 py-2 text-sm"
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: col.borderColor }} />
                    <span className="truncate">{col.name}</span>
                  </Link>
                ))}
                <Link href="/collections" className="sidebar-item block px-3 py-2 text-xs text-muted-foreground mt-1">
                  View all collections
                </Link>
              </div>
            )}
          </nav>
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className={cn('flex items-center gap-3', !show && 'justify-center')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-indigo-600 text-white text-xs font-bold shrink-0">
            {userInitials}
          </div>
          {show && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
            </div>
          )}
          {show && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-sidebar-accent shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

    </div>
  )
}

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggle: () => void
  onMobileClose: () => void
  sidebarData: SidebarData
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose, sidebarData }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onMobileClose}
      />

      {/* Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar border-r border-sidebar-border',
          'transition-transform duration-300 ease-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent collapsed={false} onToggle={onToggle} onClose={onMobileClose} isMobile sidebarData={sidebarData} />
      </aside>

      {/* Desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border',
          'transition-all duration-300 ease-out overflow-hidden',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} sidebarData={sidebarData} />
      </aside>
    </>
  )
}
