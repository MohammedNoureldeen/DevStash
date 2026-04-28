'use client'

import { Menu, Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface TopBarProps {
  onMobileMenuClick: () => void
  onNewItem: () => void
}

export default function TopBar({ onMobileMenuClick, onNewItem }: TopBarProps) {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 h-16 shrink-0">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 rounded-lg hover:bg-secondary"
        onClick={onMobileMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
          S
        </div>
        <span className="font-bold text-base tracking-tight hidden sm:block">DevStash</span>
      </Link>

      {/* Search */}
      <div className="relative flex-1 max-w-md mx-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10 pr-14 bg-secondary/50 border-0 h-10 text-sm rounded-lg focus:ring-2 focus:ring-primary/20"
          placeholder="Search items..."
          readOnly
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-lg hover:bg-secondary relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>
        <Button
          className="h-9 gap-2 btn-professional bg-gradient-to-r from-primary to-indigo-600 border-0"
          onClick={onNewItem}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>
    </header>
  );
}
