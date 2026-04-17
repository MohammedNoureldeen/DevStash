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
          'flex items-center h-16 px-4 border-b border-border/60 shrink-0',
          !show && 'justify-center px-3',
        )}
      >
        {isMobile ? (
          <>
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight">Menu</span>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-lg hover:bg-sidebar-accent" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            {show && (
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Navigation
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn(
                'h-8 w-8 rounded-lg hover:bg-sidebar-accent transition-transform duration-200',
                show ? 'ml-auto' : 'mx-auto'
              )}
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">

        {/* Item Types */}
        <nav className="px-2 mb-2">
          {show && (
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Items
            </p>
          )}
          <div className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? File
              const slug = PLURAL_MAP[type.name] ?? `${type.name}s`

              return (
                <Link
                  key={type.id}
                  href={`/items/${slug}`}
                  title={!show ? `${type.name}s` : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    'transition-all duration-200 interactive-hover',
                    !show && 'justify-center px-2',
                  )}
                >
                  <div 
                    className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-transform duration-200"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
                  </div>
                  {show && (
                    <>
                      <span className="flex-1 capitalize">{type.name}s</span>
                      <span className="text-xs font-semibold text-muted-foreground tabular-nums bg-muted/60 px-2 py-0.5 rounded-md">
                        {type.count}
                      </span>
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="my-3 border-t border-border/40 mx-3" />

        {/* Favorite Collections */}
        <nav className="px-2 mb-2">
          <div className={cn('flex items-center gap-2 px-3 py-2', !show && 'justify-center px-2')}>
            <Star className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {show && (
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Favorites
              </p>
            )}
          </div>
          <div className="space-y-0.5">
            {show && favoriteCollections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 interactive-hover"
              >
                <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{col.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="my-3 border-t border-border/40 mx-3" />

        {/* Recent Collections */}
        <nav className="px-2 mb-2">
          <div className={cn('flex items-center gap-2 px-3 py-2', !show && 'justify-center px-2')}>
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {show && (
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent
              </p>
            )}
          </div>
          <div className="space-y-0.5">
            {show && recentCollections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 interactive-hover"
              >
                <span
                  className="h-3.5 w-3.5 rounded-full shrink-0 ring-2 ring-border/40"
                  style={{ backgroundColor: col.borderColor }}
                />
                <span className="truncate">{col.name}</span>
              </Link>
            ))}
            {show && (
              <Link
                href="/collections"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200 mt-1"
              >
                View all collections
              </Link>
            )}
          </div>
        </nav>

      </div>

      {/* User area */}
      <div className="border-t border-border/60 p-4 shrink-0">
        <div className={cn('flex items-center gap-3', !show && 'justify-center')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shrink-0 shadow-md">
            {userInitials}
          </div>
          {show && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-sidebar-foreground truncate">
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
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onMobileClose}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 flex flex-col',
          'bg-sidebar/95 backdrop-blur-xl border-r border-border/60',
          'transition-transform duration-300 ease-out lg:hidden shadow-elevation-xl',
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
          'bg-sidebar border-r border-border/60',
          'transition-all duration-300 ease-out overflow-hidden',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} sidebarData={sidebarData} />
      </aside>
    </>
  )
}
