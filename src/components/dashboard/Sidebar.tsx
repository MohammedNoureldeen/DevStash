'use client'

import Link from 'next/link'
import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Clock, ChevronLeft, ChevronRight,
  X, FolderOpen,
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
      <div
        className={cn(
          'flex items-center h-14 px-3 border-b border-sidebar-border shrink-0',
          !show && 'justify-center',
        )}
      >
        {isMobile ? (
          <>
            <span className="text-sm font-semibold text-sidebar-foreground">Menu</span>
            <Button variant="ghost" size="icon-sm" className="ml-auto" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            {show && (
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Navigation
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className={cn(show ? 'ml-auto' : 'mx-auto')}
            >
              {collapsed
                ? <ChevronRight className="h-4 w-4" />
                : <ChevronLeft className="h-4 w-4" />
              }
            </Button>
          </>
        )}
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">

        {/* Item Types */}
        <nav className="px-2 mb-1">
          {show && (
            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Items
            </p>
          )}
          {itemTypes.map((type) => {
            const Icon = ICON_MAP[type.icon] ?? File
            const slug = PLURAL_MAP[type.name] ?? `${type.name}s`

            return (
              <Link
                key={type.id}
                href={`/items/${slug}`}
                title={!show ? `${type.name}s` : undefined}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm',
                  'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'transition-colors',
                  !show && 'justify-center',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                {show && (
                  <>
                    <span className="flex-1 capitalize">{type.name}s</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{type.count}</span>
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="my-2 border-t border-sidebar-border mx-2" />

        {/* Favorite Collections */}
        <nav className="px-2 mb-1">
          <div className={cn('flex items-center gap-1.5 px-2 py-1.5', !show && 'justify-center')}>
            <Star className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {show && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Favorites
              </p>
            )}
          </div>
          {show && favoriteCollections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{col.name}</span>
            </Link>
          ))}
        </nav>

        <div className="my-2 border-t border-sidebar-border mx-2" />

        {/* Recent Collections */}
        <nav className="px-2 mb-1">
          <div className={cn('flex items-center gap-1.5 px-2 py-1.5', !show && 'justify-center')}>
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {show && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </p>
            )}
          </div>
          {show && recentCollections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <span
                className="h-3.5 w-3.5 rounded-full shrink-0"
                style={{ backgroundColor: col.borderColor }}
              />
              <span className="truncate">{col.name}</span>
            </Link>
          ))}
          {show && (
            <Link
              href="/collections"
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mt-1"
            >
              View all collections
            </Link>
          )}
        </nav>

      </div>

      {/* User area */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className={cn('flex items-center gap-2.5', !show && 'justify-center')}>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0">
            {userInitials}
          </div>
          {show && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {mockUser.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {mockUser.email}
              </span>
            </div>
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
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onMobileClose}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 flex flex-col',
          'bg-sidebar border-r border-sidebar-border',
          'transition-transform duration-200 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent
          collapsed={false}
          onToggle={onToggle}
          onClose={onMobileClose}
          isMobile
          sidebarData={sidebarData}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0',
          'bg-sidebar border-r border-sidebar-border',
          'transition-all duration-200 overflow-hidden',
          collapsed ? 'w-14' : 'w-60',
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} sidebarData={sidebarData} />
      </aside>
    </>
  )
}
