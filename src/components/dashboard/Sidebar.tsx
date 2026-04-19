'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Clock, ChevronDown,
  X, FolderOpen, LogOut,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import UserAvatar from '@/src/components/ui/UserAvatar'
import type { ItemTypeWithCount } from '@/src/lib/db/items'
import type { FavoriteCollection, CollectionWithDetails } from '@/src/lib/db/collections'
import type { Session } from 'next-auth'

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

type SidebarUser = Session['user'] | null

interface SidebarContentProps {
  collapsed: boolean
  onToggle: () => void
  onClose?: () => void
  isMobile?: boolean
  sidebarData: SidebarData
  user: SidebarUser
}

function UserFooter({ show, user }: { show: boolean; user: SidebarUser }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const name = user?.name ?? 'User'
  const email = user?.email ?? ''
  const image = user?.image ?? null

  return (
    <div className="border-t border-sidebar-border p-2.5 shrink-0 relative" ref={ref}>
      {open && show && (
        <div className="absolute bottom-full left-2.5 right-2.5 mb-1 rounded-lg border border-border bg-popover shadow-lg overflow-hidden z-50">
          <button
            type="button"
            onClick={() => { setOpen(false); signOut({ callbackUrl: '/sign-in' }) }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
            Sign out
          </button>
        </div>
      )}

      <div className={cn('flex items-center gap-2.5', !show && 'justify-center')}>
        {show ? (
          <button
            type="button"
            onClick={() => setOpen(prev => !prev)}
            className="shrink-0 focus:outline-none"
          >
            <UserAvatar name={name} image={image} size={32} />
          </button>
        ) : (
          <Link href="/profile" className="shrink-0" title={name}>
            <UserAvatar name={name} image={image} size={32} />
          </Link>
        )}
        {show && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(prev => !prev)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            >
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function SidebarContent({ collapsed, onToggle, onClose, isMobile = false, sidebarData, user }: SidebarContentProps) {
  const show = !collapsed || isMobile
  const { itemTypes, favoriteCollections, recentCollections } = sidebarData

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
      <UserFooter show={show} user={user} />

    </div>
  )
}

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggle: () => void
  onMobileClose: () => void
  sidebarData: SidebarData
  user: SidebarUser
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose, sidebarData, user }: SidebarProps) {
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
        <SidebarContent collapsed={false} onToggle={onToggle} onClose={onMobileClose} isMobile sidebarData={sidebarData} user={user} />
      </aside>

      {/* Desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border',
          'transition-all duration-300 ease-out overflow-hidden',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} sidebarData={sidebarData} user={user} />
      </aside>
    </>
  )
}
