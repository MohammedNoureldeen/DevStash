'use client'

import Link from 'next/link'
import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Clock, ChevronDown,
  X, FolderOpen, Settings,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockUser } from '@/src/lib/mock-data'
import { Badge } from '@/components/ui/badge'
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

const PRO_TYPES = new Set(['file', 'image'])

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
        'flex items-center h-11 px-3 border-b border-sidebar-border shrink-0',
        !show && 'justify-center'
      )}>
        {isMobile ? (
          <>
            <span className="text-sm font-medium text-foreground">Navigation</span>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            {show && <span className="text-sm font-medium text-foreground">Navigation</span>}
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors',
                show ? 'ml-auto' : 'mx-auto'
              )}
            >
              {collapsed
                ? <PanelLeftOpen className="h-4 w-4" />
                : <PanelLeftClose className="h-4 w-4" />
              }
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2">

        {/* Item Types */}
        <nav className="mb-4">
          {show && (
            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Types
            </p>
          )}
          <div className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? File
              const slug = PLURAL_MAP[type.name] ?? `${type.name}s`
              const isPro = PRO_TYPES.has(type.name)

              return (
                <Link
                  key={type.id}
                  href={`/items/${slug}`}
                  title={!show ? `${type.name}s` : undefined}
                  className={cn(
                    'sidebar-item flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium text-sidebar-foreground rounded-md',
                    !show && 'justify-center'
                  )}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0" style={{ backgroundColor: `${type.color}18` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
                  </div>
                  {show && (
                    <>
                      <span className="flex-1 capitalize">{type.name}s</span>
                      {isPro && (
                        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[9px] font-semibold tracking-wide px-1.5 py-0 h-4">
                          PRO
                        </Badge>
                      )}
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {type.count}
                      </span>
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Collections */}
        <nav>
          {show && (
            <div className="flex items-center gap-1.5 px-2 mb-1.5">
              <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Collections
              </p>
            </div>
          )}

          {/* Favorites */}
          {show && favoriteCollections.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <Star className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide">Favorites</p>
              </div>
              <div className="space-y-0.5">
                {favoriteCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="sidebar-item flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-md"
                  >
                    <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{col.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent */}
          {show && recentCollections.length > 0 && (
            <div className="mb-1">
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide">Recent</p>
              </div>
              <div className="space-y-0.5">
                {recentCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="sidebar-item flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-md"
                  >
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: col.borderColor }} />
                    <span className="truncate">{col.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* View all */}
          {show && (
            <Link href="/collections" className="sidebar-item flex items-center px-2 py-1.5 text-xs text-muted-foreground rounded-md">
              View all collections
            </Link>
          )}
        </nav>

      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2.5 shrink-0">
        <div className={cn('flex items-center gap-2.5', !show && 'justify-center')}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 text-white text-xs font-bold shrink-0">
            {userInitials}
          </div>
          {show && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
            </div>
          )}
          {show && (
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
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
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-sidebar-border',
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
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} sidebarData={sidebarData} />
      </aside>
    </>
  )
}
